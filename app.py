from flask import Flask, render_template, request, send_file, jsonify, make_response
from dotenv import load_dotenv
import requests
import io
import os
import sqlite3
import json
from datetime import datetime

load_dotenv()

app = Flask(__name__)

# Database setup
DATABASE = 'cvs.db'

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize the database with schema"""
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS cvs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            data TEXT NOT NULL,
            template TEXT DEFAULT 'professional',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    db.commit()
    db.close()

# Initialize database on startup
init_db()


# Custom Jinja filter to format dates
@app.template_filter('format_date')
def format_date(date_str):
    """Convert YYYY-MM to 'Mon YYYY'"""
    if not date_str or date_str == 'Present':
        return date_str
    try:
        year, month = date_str.split('-')
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return f"{months[int(month) - 1]} {year}"
    except:
        return date_str


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
    if not summary and target_job:
        # Generate from scratch based on target job
        return f"""Create a professional CV summary for a {target_job}. Rules:
- 2-3 sentences max
- Strong action words and achievements
- No first person (I, my, me)
- Highlight key skills and experience relevant to this role
- Return ONLY the summary

Summary:"""
    elif summary and target_job:
        # Improve existing summary for target job
        return f"""Improve this CV summary for a {target_job} role. Rules:
- 2-3 sentences max
- Strong action words
- No first person (I, my, me)
- Tailor to the target job
- Return ONLY the improved summary

Original: {summary}

Improved:"""
    else:
        # Just improve existing summary (no target job)
        return f"""Improve this CV summary. Rules:
- 2-3 sentences max
- Strong action words
- No first person (I, my, me)
- Return ONLY the improved summary

Original: {summary}

Improved:"""


def create_bullet_prompt(bullet, job_title='', company=''):
    if not bullet and job_title:
        # Generate from scratch based on job title and company
        company_context = f" at {company}" if company else ""
        return f"""Create a professional job description bullet point for a {job_title}{company_context}. Rules:
- Start with strong action verb
- Include specific responsibilities and achievements
- Add metrics or impact where relevant
- 2-3 sentences max
- No first person (I, my, me)
- Return ONLY the description

Description:"""
    else:
        # Improve existing bullet
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

    # If no summary and no target job, return error
    if not summary and not target_job:
        return jsonify({'improved': '', 'error': 'Please provide either a summary or target job'})

    improved = call_ai(create_summary_prompt(summary, target_job))

    if improved:
        return jsonify({'improved': improved, 'provider': AI_PROVIDER})
    return jsonify({'improved': summary, 'error': f'{AI_PROVIDER} unavailable'})


@app.route('/improve-bullet', methods=['POST'])
def improve_bullet():
    data = request.json
    bullet = data.get('bullet', '').strip()
    job_title = data.get('jobTitle', '').strip()
    company = data.get('company', '').strip()

    # Allow empty bullet if we have job title
    if not bullet and not job_title:
        return jsonify({'improved': '', 'error': 'No text or job title provided'})

    improved = call_ai(create_bullet_prompt(bullet, job_title, company))

    if improved:
        return jsonify({'improved': improved, 'provider': AI_PROVIDER})
    return jsonify({'improved': bullet, 'error': f'{AI_PROVIDER} unavailable'})


@app.route('/suggest-skills', methods=['POST'])
def suggest_skills():
    data = request.json
    job_title = data.get('jobTitle', '').strip()
    summary = data.get('summary', '').strip()
    experience = data.get('experience', [])

    # Check if we have enough information
    if not job_title:
        return jsonify({
            'error': 'Please fill in your Job Title (Step 1) first to get better skill suggestions',
            'technical': [],
            'soft': [],
            'languages': []
        })

    # Create context for AI
    context = f"Job Title: {job_title}\n"
    if summary:
        context += f"Summary: {summary}\n"
    if experience:
        context += "Experience:\n"
        for exp in experience:
            if exp.get('title'):
                context += f"- {exp['title']}: {exp.get('description', '')}\n"

    # Add note if minimal info
    hint = ""
    if not summary and not experience:
        hint = "\nNote: Limited information provided. Suggest common skills for this job title."

    prompt = f"""Based on this person's profile, suggest relevant skills in 3 categories.
Return ONLY a JSON object with this exact format (no markdown, no code blocks):
{{"technical": ["skill1", "skill2", "skill3"], "soft": ["skill1", "skill2", "skill3"], "languages": ["language1", "language2"]}}

Profile:
{context}{hint}

Rules:
- Technical skills: Programming languages, frameworks, tools, technologies (e.g., Python, JavaScript, React, Docker, AWS)
- Soft skills: Personal attributes and interpersonal skills (e.g., Leadership, Communication, Problem-solving)
- Languages: ONLY spoken/human languages (e.g., English, Spanish, Arabic, French, German) - NOT programming languages!

Suggest 5-8 technical skills, 3-5 soft skills, and 1-3 spoken languages they likely know based on the job title and any experience provided.
JSON:"""

    result = call_ai(prompt)

    if result:
        try:
            # Clean up the response
            result = result.strip()
            # Remove markdown code blocks if present
            if result.startswith('```'):
                result = result.split('```')[1]
                if result.startswith('json'):
                    result = result[4:]
            result = result.strip()

            # Parse JSON
            import json
            skills_data = json.loads(result)
            return jsonify(skills_data)
        except:
            # Fallback: return empty skills
            return jsonify({'technical': [], 'soft': [], 'languages': []})

    return jsonify({'technical': [], 'soft': [], 'languages': []})


@app.route('/ai-status')
def ai_status():
    if AI_PROVIDER == 'groq':
        configured = GROQ_API_KEY != 'your-groq-api-key'
        return jsonify({'provider': 'groq', 'model': GROQ_MODEL, 'configured': configured})
    else:
        configured = OPENAI_API_KEY != 'your-openai-api-key'
        return jsonify({'provider': 'openai', 'model': OPENAI_MODEL, 'configured': configured})


# Database Routes

@app.route('/save-cv', methods=['POST'])
def save_cv():
    """Save CV to database"""
    data = request.json
    title = data.get('title', 'Untitled CV')
    cv_data = json.dumps(data.get('data', {}))
    template = data.get('template', 'professional')

    db = get_db()
    cursor = db.execute(
        'INSERT INTO cvs (title, data, template) VALUES (?, ?, ?)',
        (title, cv_data, template)
    )
    db.commit()
    cv_id = cursor.lastrowid
    db.close()

    return jsonify({'success': True, 'id': cv_id, 'message': 'CV saved successfully'})


@app.route('/load-cv/<int:cv_id>', methods=['GET'])
def load_cv(cv_id):
    """Load a specific CV from database"""
    db = get_db()
    cv = db.execute('SELECT * FROM cvs WHERE id = ?', (cv_id,)).fetchone()
    db.close()

    if cv:
        return jsonify({
            'success': True,
            'id': cv['id'],
            'title': cv['title'],
            'data': json.loads(cv['data']),
            'template': cv['template'],
            'created_at': cv['created_at'],
            'updated_at': cv['updated_at']
        })
    else:
        return jsonify({'success': False, 'message': 'CV not found'}), 404


@app.route('/list-cvs', methods=['GET'])
def list_cvs():
    """List all saved CVs"""
    db = get_db()
    cvs = db.execute('SELECT id, title, template, created_at, updated_at FROM cvs ORDER BY updated_at DESC').fetchall()
    db.close()

    cv_list = [{
        'id': cv['id'],
        'title': cv['title'],
        'template': cv['template'],
        'created_at': cv['created_at'],
        'updated_at': cv['updated_at']
    } for cv in cvs]

    return jsonify({'success': True, 'cvs': cv_list})


@app.route('/update-cv/<int:cv_id>', methods=['PUT'])
def update_cv(cv_id):
    """Update an existing CV"""
    data = request.json
    title = data.get('title')
    cv_data = json.dumps(data.get('data', {}))
    template = data.get('template')

    db = get_db()
    db.execute(
        'UPDATE cvs SET title = ?, data = ?, template = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        (title, cv_data, template, cv_id)
    )
    db.commit()
    db.close()

    return jsonify({'success': True, 'message': 'CV updated successfully'})


@app.route('/delete-cv/<int:cv_id>', methods=['DELETE'])
def delete_cv(cv_id):
    """Delete a CV"""
    db = get_db()
    db.execute('DELETE FROM cvs WHERE id = ?', (cv_id,))
    db.commit()
    db.close()

    return jsonify({'success': True, 'message': 'CV deleted successfully'})


@app.route('/generate', methods=['POST'])
def generate_cv():
    data = {
        'firstName': request.form.get('firstName', ''),
        'lastName': request.form.get('lastName', ''),
        'jobTitle': request.form.get('jobTitle', ''),
        'email': request.form.get('email', ''),
        'phone': request.form.get('phone', ''),
        'location': request.form.get('location', ''),
        'summary': request.form.get('summary', ''),
        'template': request.form.get('template', 'professional'),
    }

    # Parse custom links
    data['links'] = []
    for i in range(1, 11):
        label = request.form.get(f'link_label_{i}')
        url = request.form.get(f'link_url_{i}')
        if label and url:
            data['links'].append({'label': label, 'url': url})
        elif url:
            data['links'].append({'label': '', 'url': url})

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
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') != 'production'

    print("\n" + "="*50)
    print("🚀 ResumeForge - AI CV Maker")
    print("="*50)
    print(f"📡 Provider: {AI_PROVIDER.upper()}")
    print(f"📦 Model: {GROQ_MODEL if AI_PROVIDER == 'groq' else OPENAI_MODEL}")
    print(f"\n🌐 Port: {port}")
    print("="*50 + "\n")

    app.run(host='0.0.0.0', port=port, debug=debug)
