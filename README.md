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

### Deploy to PythonAnywhere (100% FREE)

PythonAnywhere is perfect for Flask apps with SQLite databases!

#### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Deploy ResumeForge to PythonAnywhere"
git push origin main
```

#### 2. Create PythonAnywhere Account

1. Go to [www.pythonanywhere.com](https://www.pythonanywhere.com)
2. Click **"Pricing & signup"**
3. Choose **"Create a Beginner account"** (100% FREE forever)
4. Verify your email

#### 3. Setup Your Web App

1. **Open a Bash Console**:
   - Dashboard → "Consoles" → "Bash"

2. **Clone Your Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/resumeforge.git
   cd resumeforge
   ```

3. **Install Dependencies**:
   ```bash
   pip3 install --user -r requirements.txt
   ```

4. **Create Environment File**:
   ```bash
   nano .env
   ```
   Add your API key:
   ```
   GROQ_API_KEY=gsk_your_actual_api_key_here
   AI_PROVIDER=groq
   ```
   Press `Ctrl+X`, then `Y`, then `Enter` to save

#### 4. Configure Web App

1. Go to **"Web"** tab in dashboard
2. Click **"Add a new web app"**
3. Choose **"Manual configuration"**
4. Select **"Python 3.10"**

5. **Configure WSGI File**:
   - Click on the WSGI configuration file link
   - Replace ALL content with:
   ```python
   import sys
   import os

   # Add your project directory to the sys.path
   project_home = '/home/YOUR_USERNAME/resumeforge'
   if project_home not in sys.path:
       sys.path.insert(0, project_home)

   # Load environment variables
   from dotenv import load_dotenv
   load_dotenv(os.path.join(project_home, '.env'))

   # Import Flask app
   from app import app as application
   ```
   - Replace `YOUR_USERNAME` with your PythonAnywhere username
   - Click **"Save"**

6. **Set Working Directory**:
   - In "Web" tab, find **"Code"** section
   - Set "Source code" to: `/home/YOUR_USERNAME/resumeforge`
   - Set "Working directory" to: `/home/YOUR_USERNAME/resumeforge`

7. **Reload Web App**:
   - Click the big green **"Reload"** button at the top

#### 5. Your App is Live! 🎉

Your app will be available at:
```
https://YOUR_USERNAME.pythonanywhere.com
```

#### Updating Your App

Whenever you make changes:

```bash
# SSH into PythonAnywhere console
cd ~/resumeforge
git pull origin main
pip3 install --user -r requirements.txt

# Then reload your web app from the Web tab
```

---

### Alternative: Deploy to Railway

Railway also offers free hosting with SQLite support:

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variable: `GROQ_API_KEY`
5. Railway auto-detects Flask and deploys

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
