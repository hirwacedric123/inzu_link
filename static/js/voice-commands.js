/**
 * Voice Command System for InzuLink
 * 
 * Phase 1: Basic Voice Recognition & Navigation Commands ✅
 * Phase 2: Advanced Navigation & Search Commands ✅
 * 
 * Features:
 * - Web Speech API integration
 * - Basic command recognition
 * - Simple navigation commands
 * - Voice activation button
 * - Search functionality with parameters
 * - Category filtering
 * - Command history
 */

(function() {
    'use strict';

    /**
     * Voice Command Manager
     */
    class VoiceCommandManager {
        constructor() {
            this.recognition = null;
            this.isListening = false;
            this.isSupported = false;
            this.commands = new Map();
            this.parameterCommands = new Map(); // Commands that accept parameters
            this.commandHistory = [];
            this.currentCommand = null;
            this.feedbackElement = null;
            this.maxHistorySize = 10;
            this.init();
        }

        /**
         * Initialize voice recognition
         */
        init() {
            // Check browser support
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!SpeechRecognition) {
                console.warn('Speech recognition not supported in this browser');
                this.isSupported = false;
                return;
            }

            this.isSupported = true;
            this.recognition = new SpeechRecognition();
            
            // Configure recognition
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1;

            // Setup event handlers
            this.setupEventHandlers();
            
            // Register default commands
            this.registerDefaultCommands();
            
            // Register Phase 2 commands (search, filter)
            this.registerPhase2Commands();
            
            // Create feedback element
            this.createFeedbackElement();
            
            // Load command history from localStorage
            this.loadCommandHistory();
        }

        /**
         * Setup recognition event handlers
         */
        setupEventHandlers() {
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateFeedback('Listening...', 'listening');
                this.updateButtonState(true);
                this.announceToScreenReader('Voice recognition started. Speak your command.');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.trim().toLowerCase();
                this.updateFeedback(`Heard: "${transcript}"`, 'processing');
                this.processCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                this.isListening = false;
                let errorMessage = 'Voice recognition error';
                
                switch(event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not found. Please check your microphone.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone permission denied. Please enable microphone access.';
                        break;
                    case 'network':
                        errorMessage = 'Network error. Please check your connection.';
                        break;
                    default:
                        errorMessage = `Error: ${event.error}`;
                }
                
                this.updateFeedback(errorMessage, 'error');
                this.announceToScreenReader(errorMessage);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateButtonState(false);
                this.updateFeedback('Click to activate voice commands', 'idle');
            };
        }

        /**
         * Register Phase 2 commands (search, filter, advanced navigation)
         */
        registerPhase2Commands() {
            // Additional navigation commands - using correct URLs with /auth/ prefix
            this.registerCommand(['go to purchases', 'my purchases', 'purchase history', 'show purchases'], () => {
                this.navigateTo('/auth/purchases/');
            });

            this.registerCommand(['go to bookmarks', 'my bookmarks', 'show bookmarks', 'saved items'], () => {
                this.navigateTo('/auth/bookmarks/');
            });

            this.registerCommand(['go to chat', 'messages', 'my messages', 'show messages'], () => {
                this.navigateTo('/auth/chat/');
            });

            this.registerCommand(['vendor dashboard', 'go to vendor dashboard', 'my vendor dashboard'], () => {
                this.navigateTo('/auth/vendor-dashboard/');
            });

            this.registerCommand(['create product', 'add product', 'new product', 'list product'], () => {
                this.navigateTo('/auth/create-product/');
            });

            this.registerCommand(['create post', 'add post', 'new post'], () => {
                this.navigateTo('/auth/create-post/');
            });
        }

        /**
         * Register default navigation commands
         */
        registerDefaultCommands() {
            // Navigation commands - using correct URLs with /auth/ prefix
            this.registerCommand(['go to home', 'navigate to home', 'home', 'go home'], () => {
                this.navigateTo('/');
            });

            this.registerCommand(['go to dashboard', 'navigate to dashboard', 'dashboard', 'go dashboard', 'my dashboard'], () => {
                this.navigateTo('/auth/dashboard/');
            });

            this.registerCommand(['go to login', 'navigate to login', 'login', 'go login', 'sign in'], () => {
                this.navigateTo('/auth/login/');
            });

            this.registerCommand(['go to register', 'navigate to register', 'register', 'go register', 'sign up', 'create account'], () => {
                this.navigateTo('/auth/register/');
            });

            this.registerCommand(['show products', 'go to products', 'products', 'browse products', 'view products'], () => {
                this.navigateTo('/auth/dashboard/');
            });

            this.registerCommand(['show cart', 'go to cart', 'cart', 'my cart', 'view cart'], () => {
                this.navigateTo('/auth/cart/');
            });

            this.registerCommand(['go to profile', 'navigate to profile', 'profile', 'my profile', 'view profile'], () => {
                this.navigateTo('/auth/settings/');
            });

            this.registerCommand(['go to settings', 'navigate to settings', 'settings', 'my settings'], () => {
                this.navigateTo('/auth/settings/');
            });

            // Help command
            this.registerCommand(['help', 'what can i say', 'voice commands', 'show commands'], () => {
                this.showHelp();
            });

            // Stop/cancel command
            this.registerCommand(['stop', 'cancel', 'never mind'], () => {
                this.stopListening();
                this.updateFeedback('Voice command cancelled', 'idle');
            });
        }

        /**
         * Register a command
         */
        registerCommand(triggers, handler) {
            triggers.forEach(trigger => {
                this.commands.set(trigger.toLowerCase(), handler);
            });
        }

        /**
         * Process recognized command
         */
        processCommand(transcript) {
            // Save to history
            this.addToHistory(transcript);
            
            // Try exact match first
            if (this.commands.has(transcript)) {
                this.executeCommand(transcript);
                return;
            }

            // Try parameter commands (search, filter, etc.) - check these FIRST before partial matching
            const parameterResult = this.processParameterCommand(transcript);
            if (parameterResult) {
                return;
            }

            // Try partial match - but be more strict
            // Only match if the command is a significant part of the transcript
            for (const [command, handler] of this.commands.entries()) {
                // Check if transcript starts with command or command is a complete word in transcript
                const words = transcript.split(/\s+/);
                const commandWords = command.split(/\s+/);
                
                // Match if:
                // 1. Transcript starts with the command
                // 2. Command is at least 2 words and transcript contains all command words in order
                // 3. Command is a single word and it's a complete word in transcript (not part of another word)
                const transcriptStartsWithCommand = transcript.startsWith(command);
                const commandIsCompleteWord = commandWords.length === 1 && 
                    new RegExp(`\\b${command}\\b`, 'i').test(transcript);
                const commandWordsInOrder = commandWords.length >= 2 && 
                    this.wordsInOrder(commandWords, words);
                
                if (transcriptStartsWithCommand || commandIsCompleteWord || commandWordsInOrder) {
                    this.executeCommand(command);
                    return;
                }
            }

            // No match found
            this.updateFeedback(`Command not recognized: "${transcript}"`, 'error');
            this.announceToScreenReader(`Command not recognized. Say "help" for available commands.`);
        }

        /**
         * Check if command words appear in order in transcript words
         */
        wordsInOrder(commandWords, transcriptWords) {
            let commandIndex = 0;
            for (let i = 0; i < transcriptWords.length && commandIndex < commandWords.length; i++) {
                if (transcriptWords[i].toLowerCase() === commandWords[commandIndex].toLowerCase()) {
                    commandIndex++;
                }
            }
            return commandIndex === commandWords.length;
        }

        /**
         * Process commands with parameters (Phase 2)
         */
        processParameterCommand(transcript) {
            // Search commands
            const searchPatterns = [
                /search for (.+)/i,
                /find (.+)/i,
                /look for (.+)/i,
                /show (.+)/i,
                /search (.+)/i
            ];

            for (const pattern of searchPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const query = match[1].trim();
                    this.executeSearch(query);
                    return true;
                }
            }

            // Filter by category commands
            const filterPatterns = [
                /filter by (.+)/i,
                /show (.+) category/i,
                /show (.+) products/i,
                /category (.+)/i,
                /filter (.+)/i
            ];

            for (const pattern of filterPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const category = match[1].trim();
                    this.executeCategoryFilter(category);
                    return true;
                }
            }

            // More navigation commands with context
            const navPatterns = [
                /go to my (.+)/i,
                /show my (.+)/i,
                /open my (.+)/i
            ];

            for (const pattern of navPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const target = match[1].trim();
                    this.executeContextualNavigation(target);
                    return true;
                }
            }

            return false;
        }

        /**
         * Execute a command
         */
        executeCommand(command) {
            const handler = this.commands.get(command);
            if (handler) {
                this.currentCommand = command;
                this.updateFeedback(`Executing: ${command}`, 'success');
                this.announceToScreenReader(`Executing command: ${command}`);
                
                try {
                    handler();
                } catch (error) {
                    console.error('Error executing command:', error);
                    this.updateFeedback('Error executing command', 'error');
                    this.announceToScreenReader('Error executing command. Please try again.');
                }
            }
        }

        /**
         * Execute search command
         */
        executeSearch(query) {
            if (!query || query.trim() === '') {
                this.updateFeedback('Please specify what to search for', 'error');
                this.announceToScreenReader('Please specify what to search for');
                return;
            }

            // Navigate to dashboard with search query - using correct URL with /auth/ prefix
            const searchUrl = `/auth/dashboard/?q=${encodeURIComponent(query)}`;
            this.updateFeedback(`Searching for: ${query}`, 'processing');
            this.announceToScreenReader(`Searching for ${query}`);
            
            setTimeout(() => {
                this.navigateTo(searchUrl);
            }, 500);
        }

        /**
         * Execute category filter command
         */
        executeCategoryFilter(category) {
            // Map common category names to actual category values
            const categoryMap = {
                'electronics': 'electronics',
                'electronic': 'electronics',
                'furniture': 'furniture',
                'clothing': 'clothing',
                'clothes': 'clothing',
                'vehicles': 'vehicles',
                'vehicle': 'vehicles',
                'property': 'property',
                'properties': 'property',
                'house': 'house',
                'houses': 'house',
                'land': 'land',
                'apartment': 'apartment',
                'villa': 'villa',
                'food': 'food',
                'art': 'art',
                'photography': 'photography',
                'design': 'design',
                'technology': 'technology',
                'tech': 'technology'
            };

            const normalizedCategory = category.toLowerCase().trim();
            const mappedCategory = categoryMap[normalizedCategory] || normalizedCategory;

            // Using correct URL with /auth/ prefix
            const filterUrl = `/auth/dashboard/?category=${encodeURIComponent(mappedCategory)}`;
            this.updateFeedback(`Filtering by category: ${category}`, 'processing');
            this.announceToScreenReader(`Filtering by ${category} category`);
            
            setTimeout(() => {
                this.navigateTo(filterUrl);
            }, 500);
        }

        /**
         * Execute contextual navigation
         */
        executeContextualNavigation(target) {
            const targetMap = {
                'profile': '/auth/settings/',
                'settings': '/auth/settings/',
                'dashboard': '/auth/dashboard/',
                'cart': '/auth/cart/',
                'purchases': '/auth/purchases/',
                'bookmarks': '/auth/bookmarks/',
                'messages': '/auth/chat/',
                'chat': '/auth/chat/',
                'orders': '/auth/purchases/',
                'products': '/auth/dashboard/'
            };

            const normalizedTarget = target.toLowerCase().trim();
            const url = targetMap[normalizedTarget];

            if (url) {
                this.updateFeedback(`Navigating to my ${target}`, 'processing');
                this.announceToScreenReader(`Navigating to my ${target}`);
                setTimeout(() => {
                    this.navigateTo(url);
                }, 500);
            } else {
                this.updateFeedback(`Unknown target: ${target}`, 'error');
                this.announceToScreenReader(`Unknown target: ${target}`);
            }
        }

        /**
         * Navigate to a URL
         */
        navigateTo(url) {
            // Check if URL is relative or absolute
            if (url.startsWith('http')) {
                window.location.href = url;
            } else {
                // Get base URL
                const baseUrl = window.location.origin;
                window.location.href = baseUrl + url;
            }
        }

        /**
         * Start listening
         */
        startListening() {
            if (!this.isSupported) {
                this.updateFeedback('Voice recognition not supported in this browser', 'error');
                return;
            }

            if (this.isListening) {
                this.stopListening();
                return;
            }

            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.updateFeedback('Error starting voice recognition', 'error');
            }
        }

        /**
         * Stop listening
         */
        stopListening() {
            if (this.recognition && this.isListening) {
                this.recognition.stop();
                this.isListening = false;
            }
        }

        /**
         * Add command to history
         */
        addToHistory(command) {
            this.commandHistory.unshift(command);
            if (this.commandHistory.length > this.maxHistorySize) {
                this.commandHistory.pop();
            }
            this.saveCommandHistory();
        }

        /**
         * Save command history to localStorage
         */
        saveCommandHistory() {
            try {
                localStorage.setItem('voiceCommandHistory', JSON.stringify(this.commandHistory));
            } catch (e) {
                console.warn('Could not save command history:', e);
            }
        }

        /**
         * Load command history from localStorage
         */
        loadCommandHistory() {
            try {
                const saved = localStorage.getItem('voiceCommandHistory');
                if (saved) {
                    this.commandHistory = JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Could not load command history:', e);
                this.commandHistory = [];
            }
        }

        /**
         * Get recent commands
         */
        getRecentCommands(limit = 5) {
            return this.commandHistory.slice(0, limit);
        }

        /**
         * Show help dialog
         */
        showHelp() {
            const commands = Array.from(this.commands.keys());
            const helpText = `Available voice commands: ${commands.slice(0, 10).join(', ')}. Say "help" for more commands.`;
            
            this.updateFeedback(helpText, 'help');
            this.announceToScreenReader(helpText);
            
            // Create help modal with Phase 2 features
            this.showHelpModal(commands);
        }

        /**
         * Show help modal
         */
        showHelpModal(commands) {
            // Remove existing modal if any
            const existingModal = document.getElementById('voice-help-modal');
            if (existingModal) {
                existingModal.remove();
            }

            const recentCommands = this.getRecentCommands(5);
            const searchExamples = [
                'Search for iPhone',
                'Find properties in Kigali',
                'Look for furniture'
            ];
            const filterExamples = [
                'Filter by electronics',
                'Show furniture category',
                'Category vehicles'
            ];

            const modal = document.createElement('div');
            modal.id = 'voice-help-modal';
            modal.className = 'voice-help-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-labelledby', 'voice-help-title');
            modal.setAttribute('aria-modal', 'true');
            
            modal.innerHTML = `
                <div class="voice-help-content">
                    <div class="voice-help-header">
                        <h2 id="voice-help-title">Voice Commands</h2>
                        <button class="voice-help-close" aria-label="Close help dialog" onclick="this.closest('.voice-help-modal').remove()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="voice-help-body">
                        <div class="voice-help-section">
                            <h3>Navigation Commands</h3>
                            <ul class="voice-commands-list">
                                ${commands.slice(0, 8).map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="voice-help-section">
                            <h3>Search Commands</h3>
                            <ul class="voice-commands-list">
                                ${searchExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="voice-help-section">
                            <h3>Filter Commands</h3>
                            <ul class="voice-commands-list">
                                ${filterExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        ${recentCommands.length > 0 ? `
                        <div class="voice-help-section">
                            <h3>Recent Commands</h3>
                            <ul class="voice-commands-list">
                                ${recentCommands.map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            
            // Focus on close button
            const closeBtn = modal.querySelector('.voice-help-close');
            if (closeBtn) {
                closeBtn.focus();
            }

            // Close on escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        }

        /**
         * Create feedback element
         */
        createFeedbackElement() {
            this.feedbackElement = document.createElement('div');
            this.feedbackElement.id = 'voice-feedback';
            this.feedbackElement.className = 'voice-feedback';
            this.feedbackElement.setAttribute('role', 'status');
            this.feedbackElement.setAttribute('aria-live', 'polite');
            this.feedbackElement.setAttribute('aria-atomic', 'true');
            this.feedbackElement.textContent = 'Voice commands ready';
            document.body.appendChild(this.feedbackElement);
        }

        /**
         * Update feedback display
         */
        updateFeedback(message, status = 'idle') {
            if (!this.feedbackElement) return;

            this.feedbackElement.textContent = message;
            this.feedbackElement.className = `voice-feedback voice-feedback-${status}`;
            
            // Auto-hide after 3 seconds for success/idle messages
            if (status === 'success' || status === 'idle') {
                setTimeout(() => {
                    if (this.feedbackElement && !this.isListening) {
                        this.feedbackElement.textContent = 'Voice commands ready';
                        this.feedbackElement.className = 'voice-feedback voice-feedback-idle';
                    }
                }, 3000);
            }
        }

        /**
         * Update button state
         */
        updateButtonState(listening) {
            const button = document.getElementById('voice-command-btn');
            if (button) {
                if (listening) {
                    button.classList.add('listening');
                    button.setAttribute('aria-label', 'Listening... Click to stop');
                    button.setAttribute('title', 'Listening... Click to stop');
                } else {
                    button.classList.remove('listening');
                    button.setAttribute('aria-label', 'Activate voice commands');
                    button.setAttribute('title', 'Voice Commands (Press V)');
                }
            }
        }

        /**
         * Announce to screen reader
         */
        announceToScreenReader(message) {
            // Use existing live region or create one
            let liveRegion = document.getElementById('voice-live-region');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.id = 'voice-live-region';
                liveRegion.setAttribute('role', 'status');
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.className = 'sr-only';
                liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
                document.body.appendChild(liveRegion);
            }

            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Create voice activation button
     */
    function createVoiceButton() {
        // Check if button already exists
        if (document.getElementById('voice-command-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'voice-command-btn';
        button.className = 'voice-command-btn';
        button.setAttribute('aria-label', 'Activate voice commands');
        button.setAttribute('title', 'Voice Commands (Press V)');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            <span class="sr-only">Activate voice commands</span>
        `;

        // Add click handler
        button.addEventListener('click', () => {
            if (window.voiceCommandManager) {
                window.voiceCommandManager.startListening();
            }
        });

        // Add keyboard shortcut (V key)
        document.addEventListener('keydown', (e) => {
            // Only activate if not typing in an input field
            if (e.key === 'v' || e.key === 'V') {
                const activeElement = document.activeElement;
                const isInput = activeElement.tagName === 'INPUT' || 
                               activeElement.tagName === 'TEXTAREA' ||
                               activeElement.isContentEditable;
                
                if (!isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    if (window.voiceCommandManager) {
                        window.voiceCommandManager.startListening();
                    }
                }
            }
        });

        document.body.appendChild(button);
    }

    /**
     * Initialize voice command system
     */
    function initVoiceCommands() {
        // Create voice command manager
        window.voiceCommandManager = new VoiceCommandManager();
        
        // Create voice button
        createVoiceButton();
        
        // Add CSS if not already added
        if (!document.getElementById('voice-commands-style')) {
            const style = document.createElement('style');
            style.id = 'voice-commands-style';
            style.textContent = getVoiceCommandsCSS();
            document.head.appendChild(style);
        }
    }

    /**
     * Get CSS for voice commands
     */
    function getVoiceCommandsCSS() {
        return `
            /* Voice Command Button */
            .voice-command-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6B9080 0%, #4A7C59 100%);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(107, 144, 128, 0.4);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                padding: 0;
            }

            .voice-command-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(107, 144, 128, 0.6);
            }

            .voice-command-btn:active {
                transform: scale(0.95);
            }

            .voice-command-btn:focus {
                outline: 3px solid #6B9080;
                outline-offset: 2px;
            }

            /* Listening state */
            .voice-command-btn.listening {
                animation: pulse 1.5s ease-in-out infinite;
                background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
                }
                50% {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.6);
                }
            }

            /* Voice Feedback */
            .voice-feedback {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10001;
                font-size: 14px;
                max-width: 90%;
                text-align: center;
                transition: all 0.3s ease;
            }

            .voice-feedback-listening {
                background: #2196F3;
                color: white;
            }

            .voice-feedback-processing {
                background: #FF9800;
                color: white;
            }

            .voice-feedback-success {
                background: #4CAF50;
                color: white;
            }

            .voice-feedback-error {
                background: #f44336;
                color: white;
            }

            .voice-feedback-help {
                background: #9C27B0;
                color: white;
            }

            /* Help Modal */
            .voice-help-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
            }

            .voice-help-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }

            .voice-help-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
            }

            .voice-help-header h2 {
                margin: 0;
                font-size: 24px;
                color: #6B9080;
            }

            .voice-help-close {
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .voice-help-close:hover {
                color: #000;
            }

            .voice-help-body {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .voice-help-section {
                margin-bottom: 24px;
            }

            .voice-help-section:last-child {
                margin-bottom: 0;
            }

            .voice-help-section h3 {
                margin: 0 0 12px 0;
                font-size: 18px;
                color: #6B9080;
                font-weight: 600;
            }

            .voice-commands-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .voice-commands-list li {
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
                color: #333;
            }

            .voice-commands-list li:last-child {
                border-bottom: none;
            }

            /* Screen reader only */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVoiceCommands);
    } else {
        initVoiceCommands();
    }

    // Export for global access
    window.VoiceCommandManager = VoiceCommandManager;
})();

