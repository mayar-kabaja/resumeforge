from flask import Flask, render_template, request, send_file, jsonify, make_response
from dotenv import load_dotenv
import requests
import io
import os

load_dotenv()

app = Flask(__name__)


AI_PROVIDER = os.getenv('AI_PROVIDER', 'groq')

GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'your-groq-api-key')
GROQ_MODEL = 'llama-3.3-70b-versatile'

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-openai-api-key')
OPENAI_MODEL = 'gpt-3.5-turbo'



def call_groq(prompt):
    """Call Groq API (FREE tier)"""
    try:
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': GROQ_MODEL,
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.7,
                'max_tokens': 300
            },
            timeout=30
        )

        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content'].strip()
        print(f"Groq error: {response.status_code}")
        return None
    except Exception as e:
        print(f"Groq error: {e}")
        return None


def call_openai(prompt):
    """Call OpenAI API (Paid)"""
    try:
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': OPENAI_MODEL,
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.7,
                'max_tokens': 300
            },
            timeout=30
        )

        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content'].strip()
        print(f"OpenAI error: {response.status_code}")
        return None
    except Exception as e:
        print(f"OpenAI error: {e}")
        return None


def call_ai(prompt):
    """Call AI based on provider"""
    if AI_PROVIDER == 'openai':
        return call_openai(prompt)
    return call_groq(prompt)



def create_summary_prompt(summary, target_job=''):
    job_context = f"\nTarget job: {target_job}" if target_job else ""
    return f"""Improve this CV summary. Rules:
- 2-3 sentences max
- Strong action words
- No first person (I, my, me)
- Return ONLY the improved summary

Original: {summary}{job_context}

Improved:"""


def create_bullet_prompt(bullet):
    return f"""Improve this CV bullet point. Rules:
- Start with action verb
- Add metrics if possible
- 1-2 lines max
- Return ONLY the improved bullet

Original: {bullet}

Improved:"""



@app.route('/')
def home():
    return render_template('index.html')


@app.route('/create')
def create():
    template = request.args.get('template', 'professional')
    return render_template('create.html', selected_template=template)


@app.route('/templates')
def templates():
    return render_template('templates.html')



@app.route('/improve-summary', methods=['POST'])
def improve_summary():
    data = request.json
    summary = data.get('summary', '').strip()
    target_job = data.get('targetJob', '').strip()

    if not summary:
        return jsonify({'improved': summary, 'error': 'No summary provided'})

    improved = call_ai(create_summary_prompt(summary, target_job))

    if improved:
        return jsonify({'improved': improved, 'provider': AI_PROVIDER})
    return jsonify({'improved': summary, 'error': f'{AI_PROVIDER} unavailable'})


@app.route('/improve-bullet', methods=['POST'])
def improve_bullet():
    data = request.json
    bullet = data.get('bullet', '').strip()

    if not bullet:
        return jsonify({'improved': bullet, 'error': 'No text provided'})

    improved = call_ai(create_bullet_prompt(bullet))

    if improved:
        return jsonify({'improved': improved, 'provider': AI_PROVIDER})
    return jsonify({'improved': bullet, 'error': f'{AI_PROVIDER} unavailable'})


@app.route('/ai-status')
def ai_status():
    if AI_PROVIDER == 'groq':
        configured = GROQ_API_KEY != 'your-groq-api-key'
        return jsonify({'provider': 'groq', 'model': GROQ_MODEL, 'configured': configured})
    else:
        configured = OPENAI_API_KEY != 'your-openai-api-key'
        return jsonify({'provider': 'openai', 'model': OPENAI_MODEL, 'configured': configured})



@app.route('/generate', methods=['POST'])
def generate_cv():
    data = {
        'firstName': request.form.get('firstName', ''),
        'lastName': request.form.get('lastName', ''),
        'jobTitle': request.form.get('jobTitle', ''),
        'email': request.form.get('email', ''),
        'phone': request.form.get('phone', ''),
        'location': request.form.get('location', ''),
        'linkedin': request.form.get('linkedin', ''),
        'website': request.form.get('website', ''),
        'summary': request.form.get('summary', ''),
        'template': request.form.get('template', 'professional'),
    }

    # Parse experience
    data['experience'] = []
    for i in range(1, 11):
        title = request.form.get(f'exp_title_{i}')
        if title:
            data['experience'].append({
                'title': title,
                'company': request.form.get(f'exp_company_{i}', ''),
                'start': request.form.get(f'exp_start_{i}', ''),
                'end': request.form.get(f'exp_end_{i}', 'Present'),
                'description': request.form.get(f'exp_desc_{i}', '')
            })

    # Parse education
    data['education'] = []
    for i in range(1, 11):
        degree = request.form.get(f'edu_degree_{i}')
        if degree:
            data['education'].append({
                'degree': degree,
                'field': request.form.get(f'edu_field_{i}', ''),
                'school': request.form.get(f'edu_school_{i}', ''),
                'start': request.form.get(f'edu_start_{i}', ''),
                'end': request.form.get(f'edu_end_{i}', '')
            })

    # Parse skills
    data['skills'] = {
        'technical': [s.strip() for s in request.form.get('techSkills', '').split(',') if s.strip()],
        'soft': [s.strip() for s in request.form.get('softSkills', '').split(',') if s.strip()],
        'languages': [s.strip() for s in request.form.get('languages', '').split(',') if s.strip()]
    }

    # Render print-ready HTML (user can print to PDF with Cmd+P)
    template_name = f"cv_{data['template']}.html"
    try:
        html_content = render_template(template_name, data=data)
    except:
        html_content = render_template('cv_professional.html', data=data)

    response = make_response(html_content)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 ResumeForge - AI CV Maker")
    print("="*50)
    print(f"📡 Provider: {AI_PROVIDER.upper()}")
    print(f"📦 Model: {GROQ_MODEL if AI_PROVIDER == 'groq' else OPENAI_MODEL}")
    print("\n🌐 http://localhost:5001")
    print("="*50 + "\n")

    app.run(debug=True, port=5001)
