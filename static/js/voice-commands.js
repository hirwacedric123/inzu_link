/**
 * Voice Command System for InzuLink
 * 
 * Phase 1: Basic Voice Recognition & Navigation Commands ✅
 * Phase 2: Advanced Navigation & Search Commands ✅
 * Phase 3: Form Interaction Commands ✅
 * Phase 4: E-commerce Actions ✅
 * 
 * Features:
 * - Web Speech API integration
 * - Basic command recognition
 * - Simple navigation commands
 * - Voice activation button
 * - Search functionality with parameters
 * - Category filtering
 * - Command history
 * - Form field navigation and filling
 * - Form submission via voice
 * - Cart management (add, remove, clear)
 * - Checkout commands
 * - Order tracking
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
            
            // Register Phase 3 commands (form interaction)
            this.registerPhase3Commands();
            
            // Register Phase 4 commands (e-commerce actions)
            this.registerPhase4Commands();
            
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
         * Register Phase 4 commands (e-commerce actions)
         */
        registerPhase4Commands() {
            // Cart management
            this.registerCommand(['clear cart', 'empty cart', 'remove all from cart'], () => {
                this.clearCart();
            });

            // Checkout
            this.registerCommand(['checkout', 'proceed to checkout', 'go to checkout', 'buy now'], () => {
                this.goToCheckout();
            });

            // Orders
            this.registerCommand(['show my orders', 'my orders', 'order history', 'purchase history'], () => {
                this.navigateTo('/auth/purchases/');
            });

            this.registerCommand(['show orders', 'orders', 'view orders'], () => {
                this.navigateTo('/auth/purchases/');
            });
        }

        /**
         * Register Phase 3 commands (form interaction)
         */
        registerPhase3Commands() {
            // Form navigation commands
            this.registerCommand(['next field', 'go to next field', 'next input', 'next'], () => {
                this.navigateToNextField();
            });

            this.registerCommand(['previous field', 'go to previous field', 'previous input', 'previous', 'back'], () => {
                this.navigateToPreviousField();
            });

            this.registerCommand(['first field', 'go to first field', 'start of form'], () => {
                this.navigateToFirstField();
            });

            this.registerCommand(['last field', 'go to last field', 'end of form'], () => {
                this.navigateToLastField();
            });

            // Form submission
            this.registerCommand(['submit form', 'submit', 'send form', 'send'], () => {
                this.submitCurrentForm();
            });

            // Clear field
            this.registerCommand(['clear field', 'clear', 'clear input', 'erase'], () => {
                this.clearCurrentField();
            });

            // Field information
            this.registerCommand(['what field', 'what is this field', 'field name', 'current field'], () => {
                this.announceCurrentField();
            });

            // Form validation
            this.registerCommand(['check form', 'validate form', 'check fields'], () => {
                this.validateCurrentForm();
            });
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
         * Process commands with parameters (Phase 2, 3 & 4)
         */
        processParameterCommand(transcript) {
            // Phase 4: E-commerce commands (check these first)
            const addToCartPatterns = [
                /add (.+?) to cart/i,
                /add (.+?) to my cart/i,
                /put (.+?) in cart/i,
                /add (.+?) in cart/i
            ];

            for (const pattern of addToCartPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const productName = match[1].trim();
                    this.addToCart(productName);
                    return true;
                }
            }

            const removeFromCartPatterns = [
                /remove (.+?) from cart/i,
                /remove (.+?) from my cart/i,
                /delete (.+?) from cart/i,
                /take (.+?) out of cart/i
            ];

            for (const pattern of removeFromCartPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const productName = match[1].trim();
                    this.removeFromCart(productName);
                    return true;
                }
            }

            const updateQuantityPatterns = [
                /update (.+?) quantity to (\d+)/i,
                /set (.+?) quantity to (\d+)/i,
                /change (.+?) quantity to (\d+)/i,
                /update (.+?) to (\d+)/i
            ];

            for (const pattern of updateQuantityPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const productName = match[1].trim();
                    const quantity = parseInt(match[2].trim());
                    this.updateCartQuantity(productName, quantity);
                    return true;
                }
            }

            const trackOrderPatterns = [
                /track order (\d+)/i,
                /show order (\d+)/i,
                /order (\d+)/i,
                /order number (\d+)/i
            ];

            for (const pattern of trackOrderPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const orderId = match[1].trim();
                    this.trackOrder(orderId);
                    return true;
                }
            }

            // Phase 3: Form interaction commands (check these first when on a form page)
            const formFillPatterns = [
                /fill (.+?) with (.+)/i,
                /enter (.+?) as (.+)/i,
                /set (.+?) to (.+)/i,
                /type (.+?) in (.+)/i,
                /put (.+?) in (.+)/i
            ];

            for (const pattern of formFillPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const fieldName = match[1].trim();
                    const value = match[2].trim();
                    this.fillFormField(fieldName, value);
                    return true;
                }
            }

            // Fill current field (simpler pattern)
            const fillCurrentPatterns = [
                /fill (.+)/i,
                /enter (.+)/i,
                /type (.+)/i
            ];

            for (const pattern of fillCurrentPatterns) {
                const match = transcript.match(pattern);
                if (match) {
                    const value = match[1].trim();
                    // Only if we're in a form field
                    const activeElement = document.activeElement;
                    if (activeElement && (activeElement.tagName === 'INPUT' || 
                        activeElement.tagName === 'TEXTAREA' || 
                        activeElement.tagName === 'SELECT')) {
                        this.fillCurrentField(value);
                        return true;
                    }
                }
            }

            // Phase 2: Search commands
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
                    // Don't match if it's a form fill command
                    if (!formFillPatterns.some(p => p.test(transcript))) {
                        this.executeSearch(query);
                        return true;
                    }
                }
            }

            // Phase 2: Filter by category commands
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

            // Phase 2: More navigation commands with context
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
         * Phase 3: Form Interaction Methods
         */

        /**
         * Get all form fields on the page
         */
        getFormFields() {
            const forms = document.querySelectorAll('form');
            const fields = [];
            
            forms.forEach(form => {
                const formFields = form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
                formFields.forEach(field => {
                    if (!field.disabled && !field.readOnly) {
                        fields.push(field);
                    }
                });
            });
            
            return fields;
        }

        /**
         * Navigate to next form field
         */
        navigateToNextField() {
            const fields = this.getFormFields();
            const currentField = document.activeElement;
            
            if (fields.length === 0) {
                this.updateFeedback('No form fields found on this page', 'error');
                this.announceToScreenReader('No form fields found on this page');
                return;
            }

            let currentIndex = -1;
            if (currentField && (currentField.tagName === 'INPUT' || currentField.tagName === 'TEXTAREA' || currentField.tagName === 'SELECT')) {
                currentIndex = fields.indexOf(currentField);
            }

            const nextIndex = currentIndex < fields.length - 1 ? currentIndex + 1 : 0;
            const nextField = fields[nextIndex];
            
            nextField.focus();
            nextField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const fieldLabel = this.getFieldLabel(nextField);
            const fieldName = fieldLabel || nextField.name || nextField.id || 'field';
            this.updateFeedback(`Moved to: ${fieldName}`, 'success');
            this.announceToScreenReader(`Moved to ${fieldName} field`);
        }

        /**
         * Navigate to previous form field
         */
        navigateToPreviousField() {
            const fields = this.getFormFields();
            const currentField = document.activeElement;
            
            if (fields.length === 0) {
                this.updateFeedback('No form fields found on this page', 'error');
                this.announceToScreenReader('No form fields found on this page');
                return;
            }

            let currentIndex = -1;
            if (currentField && (currentField.tagName === 'INPUT' || currentField.tagName === 'TEXTAREA' || currentField.tagName === 'SELECT')) {
                currentIndex = fields.indexOf(currentField);
            }

            const prevIndex = currentIndex > 0 ? currentIndex - 1 : fields.length - 1;
            const prevField = fields[prevIndex];
            
            prevField.focus();
            prevField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const fieldLabel = this.getFieldLabel(prevField);
            const fieldName = fieldLabel || prevField.name || prevField.id || 'field';
            this.updateFeedback(`Moved to: ${fieldName}`, 'success');
            this.announceToScreenReader(`Moved to ${fieldName} field`);
        }

        /**
         * Navigate to first form field
         */
        navigateToFirstField() {
            const fields = this.getFormFields();
            
            if (fields.length === 0) {
                this.updateFeedback('No form fields found on this page', 'error');
                this.announceToScreenReader('No form fields found on this page');
                return;
            }

            const firstField = fields[0];
            firstField.focus();
            firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const fieldLabel = this.getFieldLabel(firstField);
            const fieldName = fieldLabel || firstField.name || firstField.id || 'field';
            this.updateFeedback(`Moved to first field: ${fieldName}`, 'success');
            this.announceToScreenReader(`Moved to first field: ${fieldName}`);
        }

        /**
         * Navigate to last form field
         */
        navigateToLastField() {
            const fields = this.getFormFields();
            
            if (fields.length === 0) {
                this.updateFeedback('No form fields found on this page', 'error');
                this.announceToScreenReader('No form fields found on this page');
                return;
            }

            const lastField = fields[fields.length - 1];
            lastField.focus();
            lastField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const fieldLabel = this.getFieldLabel(lastField);
            const fieldName = fieldLabel || lastField.name || lastField.id || 'field';
            this.updateFeedback(`Moved to last field: ${fieldName}`, 'success');
            this.announceToScreenReader(`Moved to last field: ${fieldName}`);
        }

        /**
         * Get label for a form field
         */
        getFieldLabel(field) {
            // Try to find associated label
            if (field.id) {
                const label = document.querySelector(`label[for="${field.id}"]`);
                if (label) {
                    return label.textContent.trim();
                }
            }

            // Try to find label in parent
            const parent = field.closest('.form-group, .mb-3, .mb-4, .form-field');
            if (parent) {
                const label = parent.querySelector('label');
                if (label) {
                    return label.textContent.trim();
                }
            }

            // Use placeholder, name, or id
            return field.placeholder || field.name || field.id || 'field';
        }

        /**
         * Fill a specific form field by name
         */
        fillFormField(fieldName, value) {
            const fields = this.getFormFields();
            const normalizedFieldName = fieldName.toLowerCase();
            
            // Try to find field by label, name, id, or placeholder
            let targetField = null;
            
            for (const field of fields) {
                const label = this.getFieldLabel(field).toLowerCase();
                const name = (field.name || '').toLowerCase();
                const id = (field.id || '').toLowerCase();
                const placeholder = (field.placeholder || '').toLowerCase();
                
                if (label.includes(normalizedFieldName) || 
                    name.includes(normalizedFieldName) || 
                    id.includes(normalizedFieldName) ||
                    placeholder.includes(normalizedFieldName)) {
                    targetField = field;
                    break;
                }
            }

            if (!targetField) {
                this.updateFeedback(`Field "${fieldName}" not found`, 'error');
                this.announceToScreenReader(`Field ${fieldName} not found`);
                return;
            }

            // Fill the field
            targetField.value = value;
            targetField.focus();
            
            // Trigger input event for validation
            targetField.dispatchEvent(new Event('input', { bubbles: true }));
            targetField.dispatchEvent(new Event('change', { bubbles: true }));

            const fieldLabel = this.getFieldLabel(targetField);
            this.updateFeedback(`Filled ${fieldLabel} with: ${value}`, 'success');
            this.announceToScreenReader(`Filled ${fieldLabel} with ${value}`);
        }

        /**
         * Fill current focused field
         */
        fillCurrentField(value) {
            const currentField = document.activeElement;
            
            if (!currentField || (currentField.tagName !== 'INPUT' && 
                currentField.tagName !== 'TEXTAREA' && 
                currentField.tagName !== 'SELECT')) {
                this.updateFeedback('No field is currently focused', 'error');
                this.announceToScreenReader('No field is currently focused. Please click on a field first.');
                return;
            }

            currentField.value = value;
            
            // Trigger input event for validation
            currentField.dispatchEvent(new Event('input', { bubbles: true }));
            currentField.dispatchEvent(new Event('change', { bubbles: true }));

            const fieldLabel = this.getFieldLabel(currentField);
            this.updateFeedback(`Filled ${fieldLabel} with: ${value}`, 'success');
            this.announceToScreenReader(`Filled ${fieldLabel} with ${value}`);
        }

        /**
         * Clear current field
         */
        clearCurrentField() {
            const currentField = document.activeElement;
            
            if (!currentField || (currentField.tagName !== 'INPUT' && 
                currentField.tagName !== 'TEXTAREA' && 
                currentField.tagName !== 'SELECT')) {
                this.updateFeedback('No field is currently focused', 'error');
                this.announceToScreenReader('No field is currently focused');
                return;
            }

            currentField.value = '';
            currentField.focus();
            
            // Trigger input event
            currentField.dispatchEvent(new Event('input', { bubbles: true }));

            const fieldLabel = this.getFieldLabel(currentField);
            this.updateFeedback(`Cleared ${fieldLabel}`, 'success');
            this.announceToScreenReader(`Cleared ${fieldLabel}`);
        }

        /**
         * Submit current form
         */
        submitCurrentForm() {
            const currentField = document.activeElement;
            let form = null;

            if (currentField && currentField.tagName === 'FORM') {
                form = currentField;
            } else if (currentField && currentField.form) {
                form = currentField.form;
            } else {
                // Find first form on page
                form = document.querySelector('form');
            }

            if (!form) {
                this.updateFeedback('No form found on this page', 'error');
                this.announceToScreenReader('No form found on this page');
                return;
            }

            this.updateFeedback('Submitting form...', 'processing');
            this.announceToScreenReader('Submitting form');
            
            // Submit the form
            form.submit();
        }

        /**
         * Announce current field information
         */
        announceCurrentField() {
            const currentField = document.activeElement;
            
            if (!currentField || (currentField.tagName !== 'INPUT' && 
                currentField.tagName !== 'TEXTAREA' && 
                currentField.tagName !== 'SELECT')) {
                this.updateFeedback('No field is currently focused', 'error');
                this.announceToScreenReader('No field is currently focused');
                return;
            }

            const fieldLabel = this.getFieldLabel(currentField);
            const fieldType = currentField.type || currentField.tagName.toLowerCase();
            const isRequired = currentField.hasAttribute('required') || currentField.getAttribute('aria-required') === 'true';
            const currentValue = currentField.value || '(empty)';
            
            const info = `${fieldLabel}, ${fieldType} field${isRequired ? ', required' : ''}, current value: ${currentValue}`;
            this.updateFeedback(info, 'help');
            this.announceToScreenReader(info);
        }

        /**
         * Validate current form
         */
        validateCurrentForm() {
            const currentField = document.activeElement;
            let form = null;

            if (currentField && currentField.form) {
                form = currentField.form;
            } else {
                form = document.querySelector('form');
            }

            if (!form) {
                this.updateFeedback('No form found on this page', 'error');
                this.announceToScreenReader('No form found on this page');
                return;
            }

            const fields = Array.from(form.querySelectorAll('input, textarea, select'));
            const requiredFields = fields.filter(f => f.hasAttribute('required') || f.getAttribute('aria-required') === 'true');
            const emptyRequired = requiredFields.filter(f => !f.value || f.value.trim() === '');

            if (emptyRequired.length === 0) {
                this.updateFeedback('All required fields are filled', 'success');
                this.announceToScreenReader('All required fields are filled');
            } else {
                const fieldNames = emptyRequired.map(f => this.getFieldLabel(f)).join(', ');
                this.updateFeedback(`Missing required fields: ${fieldNames}`, 'error');
                this.announceToScreenReader(`Missing required fields: ${fieldNames}`);
            }
        }

        /**
         * Phase 4: E-commerce Action Methods
         */

        /**
         * Find product on current page by name
         */
        findProductOnPage(productName) {
            const normalizedName = productName.toLowerCase();
            
            // Try to find by data-post attribute (dashboard/products page)
            const productCards = document.querySelectorAll('[data-post]');
            for (const card of productCards) {
                const postId = card.getAttribute('data-post');
                const titleElement = card.querySelector('[id^="product-title"], .card-title, h3, h4, .product-title');
                const title = titleElement ? titleElement.textContent.trim().toLowerCase() : '';
                
                if (title.includes(normalizedName) || normalizedName.includes(title)) {
                    return {
                        id: postId,
                        element: card,
                        title: titleElement ? titleElement.textContent.trim() : productName
                    };
                }
            }

            // Try to find by product title in various elements
            const titleSelectors = [
                '[id^="product-title"]',
                '.product-title',
                '.card-title',
                'h1.product-title',
                'h2.product-title',
                'h3.product-title'
            ];

            for (const selector of titleSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const title = element.textContent.trim().toLowerCase();
                    if (title.includes(normalizedName) || normalizedName.includes(title)) {
                        // Try to find associated product ID
                        const card = element.closest('[data-post], .product-card, .pinterest-card');
                        if (card) {
                            const postId = card.getAttribute('data-post');
                            if (postId) {
                                return {
                                    id: postId,
                                    element: card,
                                    title: element.textContent.trim()
                                };
                            }
                        }
                    }
                }
            }

            return null;
        }

        /**
         * Add product to cart
         */
        async addToCart(productName) {
            const product = this.findProductOnPage(productName);
            
            if (!product) {
                this.updateFeedback(`Product "${productName}" not found on this page`, 'error');
                this.announceToScreenReader(`Product ${productName} not found on this page. Please navigate to the product page first.`);
                return;
            }

            this.updateFeedback(`Adding ${product.title} to cart...`, 'processing');
            this.announceToScreenReader(`Adding ${product.title} to cart`);

            try {
                // Get CSRF token
                const csrfToken = this.getCSRFToken();
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }

                // Make POST request to add to cart
                const response = await fetch(`/auth/cart/add/${product.id}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok || response.redirected) {
                    this.updateFeedback(`Added ${product.title} to cart`, 'success');
                    this.announceToScreenReader(`Successfully added ${product.title} to cart`);
                    
                    // Optionally refresh cart count if there's a cart badge
                    this.updateCartBadge();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMsg = errorData.message || 'Failed to add to cart';
                    throw new Error(errorMsg);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error adding to cart: ${error.message}`);
            }
        }

        /**
         * Remove product from cart
         */
        async removeFromCart(productName) {
            // First check if we're on the cart page
            if (!window.location.pathname.includes('/cart/')) {
                this.updateFeedback('Please navigate to cart page first', 'error');
                this.announceToScreenReader('Please navigate to cart page first');
                return;
            }

            // Find cart item by product name
            const cartItems = document.querySelectorAll('.cart-item, [data-cart-item], tr[data-item-id]');
            let cartItem = null;
            let itemId = null;

            for (const item of cartItems) {
                const titleElement = item.querySelector('.product-title, .cart-item-title, td:first-child');
                if (titleElement) {
                    const title = titleElement.textContent.trim().toLowerCase();
                    if (title.includes(productName.toLowerCase())) {
                        cartItem = item;
                        itemId = item.getAttribute('data-item-id') || 
                                 item.getAttribute('data-cart-item') ||
                                 item.querySelector('[data-item-id]')?.getAttribute('data-item-id');
                        break;
                    }
                }
            }

            if (!cartItem || !itemId) {
                this.updateFeedback(`Product "${productName}" not found in cart`, 'error');
                this.announceToScreenReader(`Product ${productName} not found in cart`);
                return;
            }

            this.updateFeedback(`Removing ${productName} from cart...`, 'processing');
            this.announceToScreenReader(`Removing ${productName} from cart`);

            try {
                const csrfToken = this.getCSRFToken();
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }

                const response = await fetch(`/auth/cart/remove/${itemId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok || response.redirected) {
                    this.updateFeedback(`Removed ${productName} from cart`, 'success');
                    this.announceToScreenReader(`Successfully removed ${productName} from cart`);
                    
                    // Reload page to update cart
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error('Failed to remove from cart');
                }
            } catch (error) {
                console.error('Error removing from cart:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error removing from cart: ${error.message}`);
            }
        }

        /**
         * Update cart item quantity
         */
        async updateCartQuantity(productName, quantity) {
            if (!window.location.pathname.includes('/cart/')) {
                this.updateFeedback('Please navigate to cart page first', 'error');
                this.announceToScreenReader('Please navigate to cart page first');
                return;
            }

            if (quantity < 1) {
                this.updateFeedback('Quantity must be at least 1', 'error');
                this.announceToScreenReader('Quantity must be at least 1');
                return;
            }

            // Find cart item
            const cartItems = document.querySelectorAll('.cart-item, [data-cart-item], tr[data-item-id]');
            let itemId = null;

            for (const item of cartItems) {
                const titleElement = item.querySelector('.product-title, .cart-item-title, td:first-child');
                if (titleElement) {
                    const title = titleElement.textContent.trim().toLowerCase();
                    if (title.includes(productName.toLowerCase())) {
                        itemId = item.getAttribute('data-item-id') || 
                                 item.getAttribute('data-cart-item') ||
                                 item.querySelector('[data-item-id]')?.getAttribute('data-item-id');
                        break;
                    }
                }
            }

            if (!itemId) {
                this.updateFeedback(`Product "${productName}" not found in cart`, 'error');
                this.announceToScreenReader(`Product ${productName} not found in cart`);
                return;
            }

            this.updateFeedback(`Updating quantity to ${quantity}...`, 'processing');
            this.announceToScreenReader(`Updating quantity to ${quantity}`);

            try {
                const csrfToken = this.getCSRFToken();
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }

                const response = await fetch(`/auth/cart/update/${itemId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: quantity })
                });

                if (response.ok || response.redirected) {
                    this.updateFeedback(`Updated quantity to ${quantity}`, 'success');
                    this.announceToScreenReader(`Successfully updated quantity to ${quantity}`);
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error('Failed to update quantity');
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error updating quantity: ${error.message}`);
            }
        }

        /**
         * Clear entire cart
         */
        async clearCart() {
            this.updateFeedback('Clearing cart...', 'processing');
            this.announceToScreenReader('Clearing cart. This action cannot be undone.');

            try {
                const csrfToken = this.getCSRFToken();
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }

                const response = await fetch('/auth/cart/clear/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok || response.redirected) {
                    this.updateFeedback('Cart cleared', 'success');
                    this.announceToScreenReader('Cart cleared successfully');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error('Failed to clear cart');
                }
            } catch (error) {
                console.error('Error clearing cart:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error clearing cart: ${error.message}`);
            }
        }

        /**
         * Go to checkout
         */
        goToCheckout() {
            this.updateFeedback('Navigating to checkout...', 'processing');
            this.announceToScreenReader('Navigating to checkout');
            this.navigateTo('/auth/checkout/');
        }

        /**
         * Track order by ID
         */
        trackOrder(orderId) {
            this.updateFeedback(`Finding order ${orderId}...`, 'processing');
            this.announceToScreenReader(`Finding order ${orderId}`);
            this.navigateTo(`/auth/purchase/${orderId}/`);
        }

        /**
         * Get CSRF token from page
         */
        getCSRFToken() {
            // Try to get from meta tag
            const metaToken = document.querySelector('meta[name="csrf-token"]');
            if (metaToken) {
                return metaToken.getAttribute('content');
            }

            // Try to get from cookie
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'csrftoken') {
                    return decodeURIComponent(value);
                }
            }

            // Try to get from form
            const form = document.querySelector('form');
            if (form) {
                const csrfInput = form.querySelector('input[name="csrfmiddlewaretoken"]');
                if (csrfInput) {
                    return csrfInput.value;
                }
            }

            return null;
        }

        /**
         * Update cart badge count if it exists
         */
        updateCartBadge() {
            // Try to find and update cart badge
            const cartBadges = document.querySelectorAll('.cart-badge, .cart-count, [data-cart-count]');
            // Note: This would require an API call to get current cart count
            // For now, we'll just trigger a visual update if badge exists
            cartBadges.forEach(badge => {
                badge.style.animation = 'pulse 0.5s';
            });
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
            const cartExamples = [
                'Add iPhone to cart',
                'Remove furniture from cart',
                'Clear cart',
                'Update quantity to 2'
            ];
            const orderExamples = [
                'Show my orders',
                'Track order 123',
                'Order history'
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
                        
                        <div class="voice-help-section">
                            <h3>Cart Commands</h3>
                            <ul class="voice-commands-list">
                                ${cartExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="voice-help-section">
                            <h3>Order Commands</h3>
                            <ul class="voice-commands-list">
                                ${orderExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
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

