# ResumeForge 🎨

Free AI-powered CV/Resume builder with multiple templates and PDF export

## ✨ Features

- 🎯 Multiple professional resume templates
- 👀 Live preview as you type
- 🤖 AI-powered content improvement (100% FREE!)
- 📄 Export to PDF
- 🎨 Stunning animations and modern UI
- 💾 Auto-save drafts

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Get Your FREE AI API Key (No Credit Card Required!)

1. Visit **[https://console.groq.com](https://console.groq.com)**
2. Click **"Sign Up"** - completely free, no credit card needed
3. After signing in, navigate to **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Give it a name (e.g., "ResumeForge") and click **"Submit"**
6. **Copy the API key** (starts with `gsk_`)

### 3. Configure Your Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file and paste your API key
# Replace "your_api_key_here" with your actual Groq API key
```

Your `.env` file should look like this:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Run the Application

```bash
python3 app.py
```

🎉 **Open your browser and go to: http://localhost:5001**

## 🎯 How to Use

1. **Start Creating**: Click "Create Resume" on the homepage
2. **Fill Your Info**: Enter personal details, work experience, education
3. **Use AI Magic** ✨: Click "Improve with AI" buttons to enhance your content instantly
4. **Pick a Template**: Choose between Professional, Modern, or Minimal designs
5. **Export**: Download your polished resume as PDF

## 🤖 AI Features

The free AI assistant helps you:
- ✍️ Write compelling professional summaries
- 💪 Transform job descriptions with powerful action verbs
- 📊 Quantify your achievements
- 🎯 Make your resume ATS-friendly (beats applicant tracking systems)
- ⭐ Apply the STAR method for maximum impact

**Model Used**: Llama 3.3 70B (via Groq) - One of the best free AI models available!

## 🛠 Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI**: Groq API (Llama 3.3 70B - FREE)
- **Animations**: Custom CSS keyframes + JavaScript

## 📁 Project Structure

```
resumeforge/
├── app.py                 # Flask backend with AI endpoints
├── requirements.txt       # Python dependencies
├── .env.example          # Environment template
├── static/
│   ├── css/
│   │   └── style.css     # Animations & styling
│   └── js/
│       └── main.js       # Frontend logic
└── templates/
    ├── index.html        # Landing page
    ├── create.html       # Resume builder
    ├── templates.html    # Template gallery
    ├── cv_professional.html
    ├── cv_modern.html
    └── cv_minimal.html
```

## 🔥 Why Groq?

- ⚡ **Super Fast**: 10x faster than ChatGPT
- 💰 **100% Free**: Generous free tier, no credit card
- 🧠 **Powerful**: Uses Llama 3.3 70B model
- 🚀 **No Limits**: Great rate limits for personal projects

## 📝 License

MIT License - Feel free to use and modify!
