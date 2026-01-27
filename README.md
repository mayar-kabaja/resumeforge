# ResumeForge 🎨

**Free AI-powered CV/Resume builder with database storage, multiple templates, and smart features**

Built with ❤️ by Mayar

---

## ✨ Features

### 🎯 Core Features
- **Multiple Professional Templates**: Professional, Modern, and Minimal designs
- **Live Preview**: See changes in real-time as you type
- **Database Storage**: Save, load, and manage multiple CVs
- **PDF Export**: Print-ready CVs with custom styling

### 🤖 AI-Powered Features
- **Smart Content Improvement**: Enhance summaries and job descriptions
- **AI Skill Suggestions**: Get relevant skill recommendations based on your job title
- **Context-Aware**: AI analyzes your experience to suggest better content
- **100% FREE**: Powered by Groq API (no credit card required)

### 🎨 Modern UI/UX
- **Beautiful Toast Notifications**: No more ugly browser alerts
- **Custom Confirmation Modals**: Elegant delete confirmations
- **Mobile-Responsive**: Full-screen preview modal on mobile
- **Custom Date Pickers**: Styled calendar inputs with icons
- **Smooth Animations**: Professional transitions throughout

### 💾 CV Management
- **Save CVs**: Store multiple CVs with custom titles
- **Load CVs**: Continue editing previously saved CVs
- **Delete CVs**: Remove CVs you no longer need
- **My CVs Library**: View all saved CVs in one place

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get Your FREE AI API Key

1. Visit **[https://console.groq.com](https://console.groq.com)**
2. Sign up (completely free, no credit card needed)
3. Navigate to **"API Keys"** in the sidebar
4. Click **"Create API Key"**
5. Copy the key (starts with `gsk_`)

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your key:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Run the Application

```bash
python app.py
```

🎉 **Open: http://localhost:5001**

---

## 🎯 How to Use

### Creating Your First CV
1. **Start Creating**: Click "Create Resume" on homepage
2. **Fill Information**: Enter personal details, work experience, education
3. **Add Skills**: Type skills or use AI to suggest relevant ones
4. **Use AI Features**:
   - Click "✨ Improve with AI" to enhance text
   - Use "✨ Suggest Skills with AI" for skill recommendations
5. **Choose Template**: Professional, Modern, or Minimal
6. **Save Your CV**: Click "💾 Save CV" to store in database
7. **Export PDF**: Click "📄 Download PDF" and print

### Managing Your CVs
- **Save**: Give your CV a title and save it
- **Load**: Click "My CVs" to see all saved CVs
- **Edit**: Load any CV to continue editing
- **Delete**: Remove CVs you don't need anymore

---

## 🤖 AI Features Explained

### 1. Content Improvement
Enhances your professional summaries and job descriptions:
- Powerful action verbs
- STAR method formatting
- Quantified achievements
- ATS-friendly language

### 2. Smart Skill Suggestions
Analyzes your:
- Job title
- Professional summary
- Work experience

Suggests:
- **Technical Skills**: Programming languages, frameworks, tools
- **Soft Skills**: Leadership, communication, problem-solving
- **Languages**: Spoken languages (English, Spanish, etc.)

---

## 🛠 Tech Stack

- **Backend**: Flask (Python)
- **Database**: SQLite (local storage)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI**: Groq API (Llama 3.3 70B - FREE)
- **Server**: Gunicorn (production)

---

## 📁 Project Structure

```
resumeforge/
├── app.py                    # Flask app with AI & database
├── requirements.txt          # Python dependencies
├── render.yaml              # Deployment config
├── .env                     # Environment variables
├── cvs.db                   # SQLite database (auto-created)
└── templates/
    ├── index.html           # Landing page
    ├── create.html          # CV builder interface
    ├── templates.html       # Template gallery
    ├── cv_professional.html # Professional template
    ├── cv_modern.html       # Modern template
    └── cv_minimal.html      # Minimal template
```

---

## 🚀 Deployment

### Deploy to Render (FREE)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy ResumeForge"
   git push origin main
   ```

2. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render auto-detects `render.yaml`
   - Add environment variable: `GROQ_API_KEY`
   - Deploy! ✅

3. **Your app will be live in 2-3 minutes**

---

## 🎨 Templates

### Professional
Clean and corporate design with clear sections

### Modern
Gradient background with bold typography

### Minimal
Simple black & white for maximum readability

All templates are:
- ✅ ATS-friendly
- ✅ Print-ready
- ✅ Mobile-responsive

---

## 🔥 Why Groq?

- ⚡ **Super Fast**: 10x faster than ChatGPT
- 💰 **100% Free**: Generous free tier
- 🧠 **Powerful**: Llama 3.3 70B model
- 🚀 **Great Limits**: Perfect for apps

---

## 📱 Mobile Support

- Full-screen preview modal
- Touch-friendly interface
- Optimized forms
- Responsive design

---

## 🎯 Features in Detail

### Database Features
- Save unlimited CVs
- Edit anytime
- No data loss
- Local SQLite storage

### Form Features
- Date validation
- "Currently working here" checkbox
- AI-enhanced inputs
- Auto-save drafts (localStorage)

### Export Features
- Print to PDF
- Background graphics included
- Custom page layout
- No headers/footers

---

## 📝 License

MIT License - Free to use and modify!

---

## 🙏 Credits

- **Built by**: Mayar
- **AI Provider**: Groq (Llama 3.3 70B)
- **Fonts**: Space Grotesk, Instrument Serif

---

## 🐛 Issues?

Found a bug or have a suggestion? Open an issue on GitHub!

---

**Made with ❤️ for job seekers everywhere**
