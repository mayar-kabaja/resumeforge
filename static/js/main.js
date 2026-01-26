/* =============================================================================
   ResumeForge - Main JavaScript
   ============================================================================= */

// =============================================================================
// State Management
// =============================================================================

const state = {
    currentStep: 1,
    totalSteps: 5,
    currentTemplate: 'professional',
    experienceCount: 1,
    educationCount: 1,
    skills: {
        'tech-skills': [],
        'soft-skills': [],
        'languages': []
    }
};

// =============================================================================
// Step Navigation
// =============================================================================

function goToStep(step) {
    // Hide current section
    const currentSection = document.querySelector('.form-section.active');
    const currentStepBtn = document.querySelector('.step-btn.active');
    
    if (currentSection) currentSection.classList.remove('active');
    if (currentStepBtn) currentStepBtn.classList.remove('active');

    // Show new section
    const newSection = document.querySelector(`.form-section[data-step="${step}"]`);
    const newStepBtn = document.querySelector(`.step-btn[data-step="${step}"]`);
    
    if (newSection) newSection.classList.add('active');
    if (newStepBtn) newStepBtn.classList.add('active');

    state.currentStep = step;
    updateNavButtons();
}

function nextStep() {
    if (state.currentStep < state.totalSteps) {
        // Mark current as completed
        const currentBtn = document.querySelector(`.step-btn[data-step="${state.currentStep}"]`);
        if (currentBtn) currentBtn.classList.add('completed');
        goToStep(state.currentStep + 1);
    } else {
        downloadPDF();
    }
}

function prevStep() {
    if (state.currentStep > 1) {
        goToStep(state.currentStep - 1);
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
        nextBtn.textContent = state.currentStep === state.totalSteps ? 'Download PDF →' : 'Next →';
    }
}

// =============================================================================
// Experience Management
// =============================================================================

function addExperience() {
    state.experienceCount++;
    const container = document.getElementById('experience-entries');
    if (!container) return;

    const entry = document.createElement('div');
    entry.className = 'entry-card';
    entry.dataset.index = state.experienceCount;
    entry.innerHTML = `
        <div class="entry-header">
            <span class="entry-number">${state.experienceCount}</span>
            <button type="button" class="remove-entry" onclick="removeEntry(this, 'experience')">×</button>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" name="exp_title_${state.experienceCount}" placeholder="Software Engineer">
            </div>
            <div class="form-group">
                <label>Company *</label>
                <input type="text" name="exp_company_${state.experienceCount}" placeholder="Tech Corp">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="month" name="exp_start_${state.experienceCount}">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="month" name="exp_end_${state.experienceCount}" placeholder="Present">
            </div>
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea name="exp_desc_${state.experienceCount}" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
            <button type="button" class="ai-enhance-btn" onclick="enhanceBullet(this)">
                <span class="icon">✨</span>
                <span class="spinner"></span>
                Improve with AI
            </button>
        </div>
    `;
    container.appendChild(entry);
    
    // Add input listeners for live preview
    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    updatePreview();
}

// =============================================================================
// Education Management
// =============================================================================

function addEducation() {
    state.educationCount++;
    const container = document.getElementById('education-entries');
    if (!container) return;

    const entry = document.createElement('div');
    entry.className = 'entry-card';
    entry.dataset.index = state.educationCount;
    entry.innerHTML = `
        <div class="entry-header">
            <span class="entry-number">${state.educationCount}</span>
            <button type="button" class="remove-entry" onclick="removeEntry(this, 'education')">×</button>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Degree</label>
                <input type="text" name="edu_degree_${state.educationCount}" placeholder="Bachelor of Science">
            </div>
            <div class="form-group">
                <label>Field of Study</label>
                <input type="text" name="edu_field_${state.educationCount}" placeholder="Computer Science">
            </div>
        </div>

        <div class="form-group">
            <label>School/University</label>
            <input type="text" name="edu_school_${state.educationCount}" placeholder="University of Technology">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Start Year</label>
                <input type="number" name="edu_start_${state.educationCount}" placeholder="2018" min="1950" max="2030">
            </div>
            <div class="form-group">
                <label>End Year</label>
                <input type="number" name="edu_end_${state.educationCount}" placeholder="2022" min="1950" max="2030">
            </div>
        </div>
    `;
    container.appendChild(entry);
    
    // Add input listeners for live preview
    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    updatePreview();
}

// =============================================================================
// Remove Entry
// =============================================================================

function removeEntry(button, type) {
    const card = button.closest('.entry-card');
    const container = card.parentElement;
    
    if (container.children.length > 1) {
        card.remove();
        // Renumber remaining entries
        const entries = container.querySelectorAll('.entry-card');
        entries.forEach((entry, index) => {
            const numberEl = entry.querySelector('.entry-number');
            if (numberEl) numberEl.textContent = index + 1;
        });
        updatePreview();
    }
}

// =============================================================================
// Skills Management
// =============================================================================

function addSkill(event, containerId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const value = input.value.trim();
        
        if (value && !state.skills[containerId].includes(value)) {
            state.skills[containerId].push(value);
            renderSkills(containerId);
            input.value = '';
            updatePreview();
        }
    }
}

function renderSkills(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const input = container.querySelector('.skills-input');
    
    // Remove existing tags
    container.querySelectorAll('.skill-tag').forEach(tag => tag.remove());
    
    // Add tags before input
    state.skills[containerId].forEach((skill, index) => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.innerHTML = `${skill} <button type="button" onclick="removeSkill('${containerId}', ${index})">×</button>`;
        container.insertBefore(tag, input);
    });
}

function removeSkill(containerId, index) {
    state.skills[containerId].splice(index, 1);
    renderSkills(containerId);
    updatePreview();
}

// =============================================================================
// Template Change
// =============================================================================

function changeTemplate(template) {
    document.querySelectorAll('.template-option').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.template-option[data-template="${template}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    const preview = document.getElementById('cv-preview');
    if (preview) {
        preview.className = `cv-preview ${template}`;
    }
    state.currentTemplate = template;
}

// =============================================================================
// Live Preview Update
// =============================================================================

function updatePreview() {
    const firstName = document.getElementById('firstName')?.value || 'Your';
    const lastName = document.getElementById('lastName')?.value || 'Name';
    const email = document.getElementById('email')?.value || 'your.email@example.com';
    const phone = document.getElementById('phone')?.value;
    const summary = document.getElementById('summary')?.value;

    // Update name and contact
    const nameEl = document.getElementById('preview-name');
    const contactEl = document.getElementById('preview-contact');
    
    if (nameEl) nameEl.textContent = `${firstName} ${lastName}`;
    if (contactEl) contactEl.textContent = [email, phone].filter(Boolean).join(' • ');

    // Update summary
    const summarySection = document.getElementById('preview-summary-section');
    const summaryEl = document.getElementById('preview-summary');
    
    if (summarySection && summaryEl) {
        if (summary) {
            summarySection.style.display = 'block';
            summaryEl.textContent = summary;
        } else {
            summarySection.style.display = 'none';
        }
    }

    // Update experience
    const expSection = document.getElementById('preview-experience-section');
    const expContainer = document.getElementById('preview-experience');
    
    if (expSection && expContainer) {
        expContainer.innerHTML = '';
        let hasExperience = false;
        
        document.querySelectorAll('#experience-entries .entry-card').forEach(card => {
            const index = card.dataset.index;
            const title = document.querySelector(`[name="exp_title_${index}"]`)?.value;
            const company = document.querySelector(`[name="exp_company_${index}"]`)?.value;
            const desc = document.querySelector(`[name="exp_desc_${index}"]`)?.value;
            
            if (title || company) {
                hasExperience = true;
                const entry = document.createElement('div');
                entry.className = 'cv-entry';
                entry.innerHTML = `
                    <div class="cv-entry-title">${title || ''}</div>
                    <div class="cv-entry-subtitle">${company || ''}</div>
                    ${desc ? `<div class="cv-entry-desc">${desc}</div>` : ''}
                `;
                expContainer.appendChild(entry);
            }
        });
        expSection.style.display = hasExperience ? 'block' : 'none';
    }

    // Update education
    const eduSection = document.getElementById('preview-education-section');
    const eduContainer = document.getElementById('preview-education');
    
    if (eduSection && eduContainer) {
        eduContainer.innerHTML = '';
        let hasEducation = false;
        
        document.querySelectorAll('#education-entries .entry-card').forEach(card => {
            const index = card.dataset.index;
            const degree = document.querySelector(`[name="edu_degree_${index}"]`)?.value;
            const field = document.querySelector(`[name="edu_field_${index}"]`)?.value;
            const school = document.querySelector(`[name="edu_school_${index}"]`)?.value;
            
            if (degree || school) {
                hasEducation = true;
                const entry = document.createElement('div');
                entry.className = 'cv-entry';
                entry.innerHTML = `
                    <div class="cv-entry-title">${degree || ''} ${field ? `in ${field}` : ''}</div>
                    <div class="cv-entry-subtitle">${school || ''}</div>
                `;
                eduContainer.appendChild(entry);
            }
        });
        eduSection.style.display = hasEducation ? 'block' : 'none';
    }

    // Update skills
    const skillsSection = document.getElementById('preview-skills-section');
    const skillsContainer = document.getElementById('preview-skills');
    const allSkills = [
        ...state.skills['tech-skills'], 
        ...state.skills['soft-skills'], 
        ...state.skills['languages']
    ];
    
    if (skillsSection && skillsContainer) {
        if (allSkills.length > 0) {
            skillsSection.style.display = 'block';
            skillsContainer.innerHTML = allSkills.map(skill => 
                `<span class="cv-skill">${skill}</span>`
            ).join('');
        } else {
            skillsSection.style.display = 'none';
        }
    }
}

// =============================================================================
// AI Enhancement
// =============================================================================

async function enhanceSummary() {
    const btn = document.querySelector('.form-section[data-step="2"] .ai-enhance-btn');
    const textarea = document.getElementById('summary');
    
    if (!btn || !textarea) return;
    
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const response = await fetch('/improve-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                summary: textarea.value,
                targetJob: document.getElementById('targetJob')?.value || ''
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            textarea.value = data.improved;
            updatePreview();
        }
    } catch (error) {
        console.error('AI enhancement failed:', error);
    }

    btn.classList.remove('loading');
    btn.disabled = false;
}

async function enhanceBullet(button) {
    const textarea = button.previousElementSibling;
    if (!textarea) return;
    
    button.classList.add('loading');
    button.disabled = true;

    try {
        const response = await fetch('/improve-bullet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bullet: textarea.value })
        });
        
        if (response.ok) {
            const data = await response.json();
            textarea.value = data.improved;
            updatePreview();
        }
    } catch (error) {
        console.error('AI enhancement failed:', error);
    }

    button.classList.remove('loading');
    button.disabled = false;
}

// =============================================================================
// PDF Download
// =============================================================================

function downloadPDF() {
    const form = document.getElementById('cv-form');
    if (!form) return;
    
    // Create hidden inputs for skills
    const techInput = document.createElement('input');
    techInput.type = 'hidden';
    techInput.name = 'techSkills';
    techInput.value = state.skills['tech-skills'].join(',');
    form.appendChild(techInput);
    
    const softInput = document.createElement('input');
    softInput.type = 'hidden';
    softInput.name = 'softSkills';
    softInput.value = state.skills['soft-skills'].join(',');
    form.appendChild(softInput);
    
    const langInput = document.createElement('input');
    langInput.type = 'hidden';
    langInput.name = 'languages';
    langInput.value = state.skills['languages'].join(',');
    form.appendChild(langInput);
    
    const templateInput = document.createElement('input');
    templateInput.type = 'hidden';
    templateInput.name = 'template';
    templateInput.value = state.currentTemplate;
    form.appendChild(templateInput);

    // Submit form
    form.action = '/generate';
    form.method = 'POST';
    form.submit();
}

// =============================================================================
// Save/Load Draft
// =============================================================================

function saveDraft() {
    const form = document.getElementById('cv-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data.skills = state.skills;
    
    localStorage.setItem('cv-draft', JSON.stringify(data));
    alert('Draft saved!');
}

function loadDraft() {
    const saved = localStorage.getItem('cv-draft');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            if (key === 'skills') {
                Object.assign(state.skills, data.skills);
                Object.keys(state.skills).forEach(containerId => renderSkills(containerId));
            } else {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) input.value = data[key];
            }
        });
        updatePreview();
    }
}

// =============================================================================
// Mobile Preview Toggle
// =============================================================================

function togglePreview() {
    const preview = document.querySelector('.preview-panel');
    if (preview) {
        preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
    }
}

// =============================================================================
// Template Gallery Filter
// =============================================================================

function initTemplateFilters() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards
            const filter = tab.dataset.filter;
            document.querySelectorAll('.template-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// =============================================================================
// Scroll Reveal Animations
// =============================================================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
                element.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// =============================================================================
// Card Mouse Follow Effect
// =============================================================================

function initCardMouseEffect() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });

        // Add 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            card.style.transform = `
                translateY(-5px)
                scale(1.02)
                rotateX(${-deltaY * 5}deg)
                rotateY(${deltaX * 5}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// =============================================================================
// Particle Background
// =============================================================================

function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }

    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(particleContainer);
}

// =============================================================================
// Typing Effect
// =============================================================================

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach(element => {
        const text = element.textContent;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(element, text, 50);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);
    });
}

// =============================================================================
// Ripple Effect on Click
// =============================================================================

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

function initRippleEffect() {
    document.querySelectorAll('.btn, button').forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
}

// =============================================================================
// Smooth Scroll
// =============================================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// =============================================================================
// Parallax Effect
// =============================================================================

function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// =============================================================================
// Loading Animation
// =============================================================================

function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s, visibility 0.5s;
    `;
    loader.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner" style="width: 60px; height: 60px; border-width: 4px; margin: 0 auto 20px;"></div>
            <p style="color: var(--text-secondary); font-size: 1rem;">Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(() => loader.remove(), 500);
        }, 300);
    });
}

// =============================================================================
// Counter Animation
// =============================================================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.counter);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// =============================================================================
// Initialize
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load saved draft
    loadDraft();

    // Add input listeners for live preview
    document.querySelectorAll('#cv-form input, #cv-form textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Initialize preview
    updatePreview();

    // Initialize template filters (if on templates page)
    initTemplateFilters();

    // Initialize all animations
    initScrollReveal();
    initCardMouseEffect();
    initRippleEffect();
    initSmoothScroll();
    initParallax();
    initTypingEffect();
    initCounters();
    createParticles();

    // Show loading animation
    if (document.readyState === 'loading') {
        showLoadingAnimation();
    }
});
