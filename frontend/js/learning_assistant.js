/**
 * Learning Assistant - AI-based curriculum navigation guidance
 * Helps students when stuck on modules by suggesting prerequisites
 */

const BACKEND_URL = 'http://localhost:5000';

class LearningAssistant {
    constructor() {
        this.assistantContainer = null;
        this.isVisible = false;
        this.currentSubject = null;
        this.currentLevel = null;
        this.currentModule = null;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.updateContext();
        this.createAssistantUI();
        this.attachEventListeners();
    }

    updateContext() {
        // 1. Try to get from module.js state (most accurate as it has the full title)
        if (window.moduleState && typeof window.moduleState.getCurrentModule === 'function') {
            const moduleData = window.moduleState.getCurrentModule();
            if (moduleData) {
                this.currentSubject = moduleData.subject;
                this.currentLevel = moduleData.level;
                // Prefer module name (title) for better AI prompts, fallback to ID
                this.currentModule = moduleData.module_name || moduleData.module_id;
                console.log('Learning Assistant: Loaded context from moduleState', { subject: this.currentSubject, level: this.currentLevel, module: this.currentModule });
                return;
            }
        }

        // 2. Try LocalStorage (fallback if module.js hasn't loaded yet)
        const localSubject = localStorage.getItem('selectedSubject');
        const localLevel = localStorage.getItem('selectedLevel');
        const localModuleId = localStorage.getItem('selectedModuleId');

        if (localSubject && localLevel && localModuleId) {
            this.currentSubject = localSubject;
            this.currentLevel = localLevel;
            this.currentModule = localModuleId; // We only have ID here, but that's okay
            console.log('Learning Assistant: Loaded context from localStorage', { subject: this.currentSubject, level: this.currentLevel, module: this.currentModule });
            return;
        }

        // 3. Fallback to URL parameters (legacy/deep links)
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSubject = urlParams.get('subject') || this.currentSubject || 'mathematics';
        this.currentLevel = urlParams.get('level') || this.currentLevel || 'beginner';
        this.currentModule = urlParams.get('module') || this.currentModule || '';
        console.log('Learning Assistant: Loaded context from URL', { subject: this.currentSubject, level: this.currentLevel, module: this.currentModule });
    }

    createAssistantUI() {
        // Find the AI controls section
        const aiControls = document.querySelector('.ai-controls');
        if (!aiControls) {
            console.warn('AI controls section not found');
            return;
        }

        // Add "Need Help?" button
        const helpButton = document.createElement('button');
        helpButton.id = 'needHelpBtn';
        helpButton.className = 'premium-btn help-btn';
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i> Need Help?';
        aiControls.appendChild(helpButton);

        // Create assistant container (initially hidden)
        this.assistantContainer = document.createElement('section');
        this.assistantContainer.id = 'learningAssistantContainer';
        this.assistantContainer.className = 'learning-card assistant-card';
        this.assistantContainer.style.display = 'none';
        this.assistantContainer.innerHTML = `
            <div class="card-header">
                <span><i class="fas fa-compass"></i> Learning Guidance Assistant</span>
                <button id="closeAssistant" class="icon-btn">&times;</button>
            </div>
            <div class="card-body">
                <div class="assistant-intro">
                    <p><strong>Stuck on this module?</strong> I can help you navigate the curriculum by suggesting prerequisite modules and learning paths.</p>
                    <p class="assistant-note"><i class="fas fa-info-circle"></i> Note: I cannot answer quiz questions or solve problems directly.</p>
                </div>
                
                <div class="assistant-input-group">
                    <label for="assistantMessage">What are you struggling with? (optional)</label>
                    <textarea 
                        id="assistantMessage" 
                        class="assistant-textarea"
                        placeholder="e.g., I don't understand the concept overview..."
                        rows="3"
                    ></textarea>
                </div>
                
                <button id="getGuidanceBtn" class="btn-get-guidance">
                    <i class="fas fa-compass"></i> Get Guidance
                </button>
                
                <div id="assistantLoading" class="assistant-loading" style="display: none;">
                    <div class="spinner"></div>
                    <p>Analyzing curriculum and generating guidance...</p>
                </div>
                
                <div id="assistantResponse" class="assistant-response" style="display: none;">
                    <div class="response-header">
                        <i class="fas fa-lightbulb"></i> Suggested Learning Path
                    </div>
                    <div id="assistantResponseText" class="response-text"></div>
                </div>
            </div>
        `;

        // Insert after AI controls section
        const mainContent = document.querySelector('main');
        if (mainContent) {
            const quizHero = document.querySelector('.quiz-hero');
            if (quizHero) {
                mainContent.insertBefore(this.assistantContainer, quizHero);
            } else {
                mainContent.appendChild(this.assistantContainer);
            }
        }
    }

    attachEventListeners() {
        // Toggle assistant visibility
        const helpBtn = document.getElementById('needHelpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.toggleAssistant());
        }

        // Close assistant
        const closeBtn = document.getElementById('closeAssistant');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideAssistant());
        }

        // Get guidance
        const guidanceBtn = document.getElementById('getGuidanceBtn');
        if (guidanceBtn) {
            guidanceBtn.addEventListener('click', () => this.getGuidance());
        }

        // Allow Enter key in textarea (Shift+Enter for new line)
        const textarea = document.getElementById('assistantMessage');
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.getGuidance();
                }
            });
        }
    }

    toggleAssistant() {
        if (this.isVisible) {
            this.hideAssistant();
        } else {
            this.showAssistant();
        }
    }

    showAssistant() {
        if (this.assistantContainer) {
            this.updateContext(); // Refresh context before showing
            this.assistantContainer.style.display = 'block';
            this.isVisible = true;

            // Scroll to assistant
            this.assistantContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Focus on textarea
            const textarea = document.getElementById('assistantMessage');
            if (textarea) {
                setTimeout(() => textarea.focus(), 300);
            }
        }
    }

    hideAssistant() {
        if (this.assistantContainer) {
            this.assistantContainer.style.display = 'none';
            this.isVisible = false;
        }
    }

    async getGuidance() {
        const messageInput = document.getElementById('assistantMessage');
        const loadingDiv = document.getElementById('assistantLoading');
        const responseDiv = document.getElementById('assistantResponse');
        const responseText = document.getElementById('assistantResponseText');
        const guidanceBtn = document.getElementById('getGuidanceBtn');

        // Get user message (optional)
        const userMessage = messageInput ? messageInput.value.trim() : '';

        // Show loading state
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (responseDiv) responseDiv.style.display = 'none';
        if (guidanceBtn) guidanceBtn.disabled = true;

        try {
            const response = await fetch(`${BACKEND_URL}/api/learning-assist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: this.currentSubject,
                    level: this.currentLevel,
                    module: this.currentModule,
                    user_message: userMessage
                })
            });

            const data = await response.json();

            if (data.success) {
                // Display guidance
                if (responseText) {
                    responseText.textContent = data.guidance;
                }
                if (responseDiv) responseDiv.style.display = 'block';
            } else {
                // Show error
                if (responseText) {
                    responseText.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${data.error || 'Failed to get guidance'}</div>`;
                }
                if (responseDiv) responseDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error getting guidance:', error);
            if (responseText) {
                responseText.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Unable to connect to the guidance service. Please try again.</div>`;
            }
            if (responseDiv) responseDiv.style.display = 'block';
        } finally {
            // Hide loading state
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (guidanceBtn) guidanceBtn.disabled = false;
        }
    }
}

// Initialize when script loads
const learningAssistant = new LearningAssistant();
