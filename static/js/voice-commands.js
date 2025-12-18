/**
 * Voice Command System for InzuLink
 * 
 * Phase 1: Basic Voice Recognition & Navigation Commands ✅
 * Phase 2: Advanced Navigation & Search Commands ✅
 * Phase 3: Form Interaction Commands ✅
 * Phase 4: E-commerce Actions ✅
 * Phase 5: Advanced Features & Personalization ✅
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
 * - Browser control (back, refresh, scroll)
 * - Custom user-defined commands
 * - Command suggestions
 * - Repeat last command
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
            this.customCommands = new Map(); // User-defined custom commands
            this.commandHistory = [];
            this.commandUsage = new Map(); // Track command usage frequency
            this.currentCommand = null;
            this.lastCommand = null; // For repeat functionality
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
            
            // Register Phase 5 commands (advanced features)
            this.registerPhase5Commands();
            
            // Load custom commands from localStorage
            this.loadCustomCommands();
            
            // Load command usage statistics
            this.loadCommandUsage();
            
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
         * Register Phase 5 commands (advanced features)
         */
        registerPhase5Commands() {
            // Browser control commands
            this.registerCommand(['go back', 'back', 'previous page', 'browser back'], () => {
                this.goBack();
            });

            this.registerCommand(['go forward', 'forward', 'next page'], () => {
                this.goForward();
            });

            this.registerCommand(['refresh page', 'reload page', 'refresh', 'reload'], () => {
                this.refreshPage();
            });

            this.registerCommand(['scroll up', 'scroll to top', 'go to top'], () => {
                this.scrollToTop();
            });

            this.registerCommand(['scroll down', 'scroll to bottom', 'go to bottom'], () => {
                this.scrollToBottom();
            });

            this.registerCommand(['scroll down a bit', 'scroll down little'], () => {
                this.scrollDown(300);
            });

            this.registerCommand(['scroll up a bit', 'scroll up little'], () => {
                this.scrollUp(300);
            });

            // Custom command management
            this.registerCommand(['create custom command', 'add custom command', 'define command'], () => {
                this.showCustomCommandDialog();
            });

            this.registerCommand(['show custom commands', 'list custom commands', 'my commands'], () => {
                this.showCustomCommandsList();
            });

            // Command suggestions
            this.registerCommand(['suggest commands', 'command suggestions', 'what should I say'], () => {
                this.showCommandSuggestions();
            });
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
            
            // Check for repeat command first
            if (transcript.match(/^(repeat|again|do that again|say that again)$/i)) {
                this.repeatLastCommand();
                return;
            }
            
            // Check custom commands first (user-defined)
            if (this.customCommands.has(transcript)) {
                const customCommand = this.customCommands.get(transcript);
                this.executeCustomCommand(customCommand);
                return;
            }
            
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
         * Process commands with parameters (Phase 2, 3, 4 & 6)
         */
        processParameterCommand(transcript) {
            // Phase 6: Product Detail Page commands (check these first when on product page)
            // Check if we're on a product detail page
            const isProductDetailPage = window.location.pathname.match(/\/auth\/post\/\d+\//);
            
            if (isProductDetailPage) {
                // Like/Unlike commands
                const likePatterns = [
                    /^(like this|like it|like the product|like)$/i,
                    /^(unlike this|unlike it|unlike the product|unlike)$/i
                ];
                
                for (const pattern of likePatterns) {
                    if (pattern.test(transcript)) {
                        this.toggleLikeProduct();
                        return true;
                    }
                }

                // Bookmark/Save commands
                const bookmarkPatterns = [
                    /^(bookmark this|bookmark it|bookmark the product|save this|save it|save the product|save for later)$/i,
                    /^(remove bookmark|unbookmark|unsave)$/i
                ];
                
                for (const pattern of bookmarkPatterns) {
                    if (pattern.test(transcript)) {
                        this.toggleBookmarkProduct();
                        return true;
                    }
                }

                // Send inquiry commands
                const inquiryPatterns = [
                    /^(send inquiry|contact seller|send message to seller|inquire about this)$/i,
                    /^(ask about|question about)$/i
                ];
                
                for (const pattern of inquiryPatterns) {
                    if (pattern.test(transcript)) {
                        this.openInquiryModal();
                        return true;
                    }
                }

                // Start chat commands
                const chatPatterns = [
                    /^(start chat|chat with seller|message seller|open chat)$/i,
                    /^(talk to seller|contact via chat)$/i
                ];
                
                for (const pattern of chatPatterns) {
                    if (pattern.test(transcript)) {
                        this.startChatWithSeller();
                        return true;
                    }
                }

                // Share commands
                const sharePatterns = [
                    /^(share this|share product|share link|copy link)$/i
                ];
                
                for (const pattern of sharePatterns) {
                    if (pattern.test(transcript)) {
                        this.shareProduct();
                        return true;
                    }
                }

                // Image navigation
                const imagePatterns = [
                    /^(next image|next photo|show next image)$/i,
                    /^(previous image|previous photo|show previous image|last image)$/i,
                    /^(first image|main image)$/i
                ];
                
                for (const pattern of imagePatterns) {
                    if (pattern.test(transcript)) {
                        if (transcript.match(/next/i)) {
                            this.nextProductImage();
                        } else if (transcript.match(/previous|last/i)) {
                            this.previousProductImage();
                        } else if (transcript.match(/first|main/i)) {
                            this.firstProductImage();
                        }
                        return true;
                    }
                }

                // Review navigation
                const reviewPatterns = [
                    /^(view reviews|show reviews|go to reviews|read reviews)$/i,
                    /^(write review|add review|leave review|review this)$/i
                ];
                
                for (const pattern of reviewPatterns) {
                    if (pattern.test(transcript)) {
                        if (transcript.match(/write|add|leave|review this/i)) {
                            this.scrollToReviewForm();
                        } else {
                            this.scrollToReviews();
                        }
                        return true;
                    }
                }

                // Description commands
                const descPatterns = [
                    /^(read description|show description|full description)$/i,
                    /^(read product details|show details)$/i
                ];
                
                for (const pattern of descPatterns) {
                    if (pattern.test(transcript)) {
                        this.readProductDescription();
                        return true;
                    }
                }

                // Add to cart (on product detail page)
                const addToCartPatterns = [
                    /^(add to cart|add this to cart|add it to cart|buy this|add to my cart)$/i
                ];
                
                for (const pattern of addToCartPatterns) {
                    if (pattern.test(transcript)) {
                        this.addCurrentProductToCart();
                        return true;
                    }
                }
            }

            // Phase 7: Dashboard Page commands (check these when on dashboard)
            const isDashboardPage = window.location.pathname === '/auth/dashboard/' || 
                                   window.location.pathname.match(/^\/auth\/dashboard\/?$/);
            
            if (isDashboardPage) {
                // Like product by name
                const likeProductPatterns = [
                    /like (.+?)(?: product)?$/i,
                    /like the (.+?)(?: product)?$/i,
                    /like (.+?)$/i
                ];
                
                for (const pattern of likeProductPatterns) {
                    const match = transcript.match(pattern);
                    if (match) {
                        const productName = match[1].trim();
                        this.likeProductOnDashboard(productName);
                        return true;
                    }
                }

                // Bookmark product by name
                const bookmarkProductPatterns = [
                    /bookmark (.+?)(?: product)?$/i,
                    /save (.+?)(?: product)?$/i,
                    /bookmark the (.+?)(?: product)?$/i,
                    /save the (.+?)(?: product)?$/i
                ];
                
                for (const pattern of bookmarkProductPatterns) {
                    const match = transcript.match(pattern);
                    if (match) {
                        const productName = match[1].trim();
                        this.bookmarkProductOnDashboard(productName);
                        return true;
                    }
                }

                // View product by name
                const viewProductPatterns = [
                    /view (.+?)(?: product)?$/i,
                    /show (.+?)(?: product)?$/i,
                    /open (.+?)(?: product)?$/i,
                    /go to (.+?)(?: product)?$/i,
                    /see (.+?)(?: product)?$/i
                ];
                
                for (const pattern of viewProductPatterns) {
                    const match = transcript.match(pattern);
                    if (match) {
                        const productName = match[1].trim();
                        this.viewProductOnDashboard(productName);
                        return true;
                    }
                }

                // Sort commands
                const sortPatterns = [
                    /^(sort by|order by) (newest|new|latest|recent)$/i,
                    /^(sort by|order by) (price|price low|lowest price|cheapest)$/i,
                    /^(sort by|order by) (price high|highest price|most expensive|expensive)$/i,
                    /^(sort by|order by) (popular|most popular|best selling)$/i,
                    /^(sort by|order by) (rating|highest rated|best rated)$/i,
                    /^(show|display) (newest|new|latest|recent) (first|products)?$/i,
                    /^(show|display) (cheapest|lowest|price low) (first|products)?$/i,
                    /^(show|display) (expensive|highest|price high) (first|products)?$/i,
                    /^(show|display) (popular|most popular) (first|products)?$/i
                ];
                
                for (const pattern of sortPatterns) {
                    const match = transcript.match(pattern);
                    if (match) {
                        let sortType = match[2] || match[1];
                        if (sortType.match(/newest|new|latest|recent/i)) {
                            this.sortDashboard('newest');
                        } else if (sortType.match(/price low|lowest|cheapest/i)) {
                            this.sortDashboard('price_low');
                        } else if (sortType.match(/price high|highest|expensive/i)) {
                            this.sortDashboard('price_high');
                        } else if (sortType.match(/popular|best selling/i)) {
                            this.sortDashboard('popular');
                        } else if (sortType.match(/rating|best rated/i)) {
                            this.sortDashboard('rating');
                        }
                        return true;
                    }
                }

                // Filter by category
                const filterCategoryPatterns = [
                    /^(filter by|show|display) (.+?)(?: category|products)?$/i,
                    /^(show|display) (.+?)(?: only|products)?$/i,
                    /^category (.+?)$/i
                ];
                
                for (const pattern of filterCategoryPatterns) {
                    const match = transcript.match(pattern);
                    if (match) {
                        const category = match[2] || match[1];
                        this.filterDashboardByCategory(category.trim());
                        return true;
                    }
                }

                // Clear filters
                const clearFilterPatterns = [
                    /^(clear filters|remove filters|reset filters|show all)$/i,
                    /^(clear category|remove category|show all products)$/i
                ];
                
                for (const pattern of clearFilterPatterns) {
                    if (pattern.test(transcript)) {
                        this.clearDashboardFilters();
                        return true;
                    }
                }

                // Product navigation
                const nextProductPatterns = [
                    /^(next product|next item|show next)$/i,
                    /^(go to next|move to next)$/i
                ];
                
                for (const pattern of nextProductPatterns) {
                    if (pattern.test(transcript)) {
                        this.navigateToNextProduct();
                        return true;
                    }
                }

                const previousProductPatterns = [
                    /^(previous product|previous item|show previous|last product)$/i,
                    /^(go to previous|move to previous)$/i
                ];
                
                for (const pattern of previousProductPatterns) {
                    if (pattern.test(transcript)) {
                        this.navigateToPreviousProduct();
                        return true;
                    }
                }

                // Pagination
                const paginationPatterns = [
                    /^(next page|show more|load more|more products)$/i,
                    /^(previous page|go back|last page)$/i,
                    /^(first page|go to first)$/i
                ];
                
                for (const pattern of paginationPatterns) {
                    if (pattern.test(transcript)) {
                        if (transcript.match(/next|more|load more/i)) {
                            this.goToNextPage();
                        } else if (transcript.match(/previous|back|last/i)) {
                            this.goToPreviousPage();
                        } else if (transcript.match(/first/i)) {
                            this.goToFirstPage();
                        }
                        return true;
                    }
                }
            }

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
                this.lastCommand = command; // Save for repeat
                this.updateFeedback(`Executing: ${command}`, 'success');
                this.announceToScreenReader(`Executing command: ${command}`);
                
                // Track command usage
                this.trackCommandUsage(command);
                
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
         * Phase 5: Advanced Features Methods
         */

        /**
         * Browser control: Go back
         */
        goBack() {
            if (window.history.length > 1) {
                this.updateFeedback('Going back...', 'processing');
                this.announceToScreenReader('Going back to previous page');
                window.history.back();
            } else {
                this.updateFeedback('Cannot go back', 'error');
                this.announceToScreenReader('Cannot go back. No previous page in history.');
            }
        }

        /**
         * Browser control: Go forward
         */
        goForward() {
            if (window.history.length > 1) {
                this.updateFeedback('Going forward...', 'processing');
                this.announceToScreenReader('Going forward to next page');
                window.history.forward();
            } else {
                this.updateFeedback('Cannot go forward', 'error');
                this.announceToScreenReader('Cannot go forward. No next page in history.');
            }
        }

        /**
         * Browser control: Refresh page
         */
        refreshPage() {
            this.updateFeedback('Refreshing page...', 'processing');
            this.announceToScreenReader('Refreshing page');
            window.location.reload();
        }

        /**
         * Scroll to top of page
         */
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.updateFeedback('Scrolled to top', 'success');
            this.announceToScreenReader('Scrolled to top of page');
        }

        /**
         * Scroll to bottom of page
         */
        scrollToBottom() {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
            this.updateFeedback('Scrolled to bottom', 'success');
            this.announceToScreenReader('Scrolled to bottom of page');
        }

        /**
         * Scroll down by amount
         */
        scrollDown(amount = 300) {
            window.scrollBy({
                top: amount,
                behavior: 'smooth'
            });
            this.updateFeedback('Scrolled down', 'success');
            this.announceToScreenReader('Scrolled down');
        }

        /**
         * Scroll up by amount
         */
        scrollUp(amount = 300) {
            window.scrollBy({
                top: -amount,
                behavior: 'smooth'
            });
            this.updateFeedback('Scrolled up', 'success');
            this.announceToScreenReader('Scrolled up');
        }

        /**
         * Repeat last command
         */
        repeatLastCommand() {
            if (!this.lastCommand) {
                this.updateFeedback('No previous command to repeat', 'error');
                this.announceToScreenReader('No previous command to repeat');
                return;
            }

            this.updateFeedback(`Repeating: ${this.lastCommand}`, 'processing');
            this.announceToScreenReader(`Repeating last command: ${this.lastCommand}`);
            
            // Execute the last command
            if (this.commands.has(this.lastCommand)) {
                this.executeCommand(this.lastCommand);
            } else if (this.customCommands.has(this.lastCommand)) {
                const customCommand = this.customCommands.get(this.lastCommand);
                this.executeCustomCommand(customCommand);
            } else {
                // Try to process as parameter command
                this.processParameterCommand(this.lastCommand);
            }
        }

        /**
         * Track command usage for suggestions
         */
        trackCommandUsage(command) {
            const currentCount = this.commandUsage.get(command) || 0;
            this.commandUsage.set(command, currentCount + 1);
            this.saveCommandUsage();
        }

        /**
         * Save command usage statistics
         */
        saveCommandUsage() {
            try {
                const usageData = Object.fromEntries(this.commandUsage);
                localStorage.setItem('voiceCommandUsage', JSON.stringify(usageData));
            } catch (e) {
                console.warn('Could not save command usage:', e);
            }
        }

        /**
         * Load command usage statistics
         */
        loadCommandUsage() {
            try {
                const saved = localStorage.getItem('voiceCommandUsage');
                if (saved) {
                    const usageData = JSON.parse(saved);
                    this.commandUsage = new Map(Object.entries(usageData));
                }
            } catch (e) {
                console.warn('Could not load command usage:', e);
                this.commandUsage = new Map();
            }
        }

        /**
         * Get most used commands for suggestions
         */
        getMostUsedCommands(limit = 5) {
            const sorted = Array.from(this.commandUsage.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([command]) => command);
            return sorted;
        }

        /**
         * Show command suggestions
         */
        showCommandSuggestions() {
            const mostUsed = this.getMostUsedCommands(5);
            const recent = this.getRecentCommands(5);
            const allCommands = Array.from(this.commands.keys()).slice(0, 10);

            let suggestions = 'Command suggestions: ';
            
            if (mostUsed.length > 0) {
                suggestions += `Most used: ${mostUsed.join(', ')}. `;
            }
            
            if (recent.length > 0) {
                suggestions += `Recent: ${recent.join(', ')}. `;
            }
            
            suggestions += `Popular: ${allCommands.join(', ')}.`;

            this.updateFeedback(suggestions, 'help');
            this.announceToScreenReader(suggestions);
        }

        /**
         * Add custom command
         */
        addCustomCommand(phrase, action, actionType = 'navigate') {
            this.customCommands.set(phrase.toLowerCase(), {
                phrase: phrase,
                action: action,
                type: actionType,
                createdAt: new Date().toISOString()
            });
            this.saveCustomCommands();
            this.updateFeedback(`Custom command "${phrase}" added`, 'success');
            this.announceToScreenReader(`Custom command ${phrase} has been added`);
        }

        /**
         * Remove custom command
         */
        removeCustomCommand(phrase) {
            if (this.customCommands.delete(phrase.toLowerCase())) {
                this.saveCustomCommands();
                this.updateFeedback(`Custom command "${phrase}" removed`, 'success');
                this.announceToScreenReader(`Custom command ${phrase} has been removed`);
                return true;
            }
            return false;
        }

        /**
         * Execute custom command
         */
        executeCustomCommand(customCommand) {
            this.lastCommand = customCommand.phrase;
            this.trackCommandUsage(customCommand.phrase);
            
            try {
                switch(customCommand.type) {
                    case 'navigate':
                        this.navigateTo(customCommand.action);
                        break;
                    case 'search':
                        this.executeSearch(customCommand.action);
                        break;
                    case 'function':
                        // Execute as JavaScript function (if safe)
                        if (typeof window[customCommand.action] === 'function') {
                            window[customCommand.action]();
                        }
                        break;
                    default:
                        this.navigateTo(customCommand.action);
                }
                this.updateFeedback(`Executing custom command: ${customCommand.phrase}`, 'success');
                this.announceToScreenReader(`Executing custom command: ${customCommand.phrase}`);
            } catch (error) {
                console.error('Error executing custom command:', error);
                this.updateFeedback('Error executing custom command', 'error');
                this.announceToScreenReader('Error executing custom command');
            }
        }

        /**
         * Save custom commands to localStorage
         */
        saveCustomCommands() {
            try {
                const commandsData = Array.from(this.customCommands.entries()).map(([phrase, cmd]) => ({
                    phrase: cmd.phrase,
                    action: cmd.action,
                    type: cmd.type,
                    createdAt: cmd.createdAt
                }));
                localStorage.setItem('voiceCustomCommands', JSON.stringify(commandsData));
            } catch (e) {
                console.warn('Could not save custom commands:', e);
            }
        }

        /**
         * Load custom commands from localStorage
         */
        loadCustomCommands() {
            try {
                const saved = localStorage.getItem('voiceCustomCommands');
                if (saved) {
                    const commandsData = JSON.parse(saved);
                    commandsData.forEach(cmd => {
                        this.customCommands.set(cmd.phrase.toLowerCase(), cmd);
                    });
                }
            } catch (e) {
                console.warn('Could not load custom commands:', e);
                this.customCommands = new Map();
            }
        }

        /**
         * Show custom command creation dialog
         */
        showCustomCommandDialog() {
            const phrase = prompt('Enter the voice command phrase (e.g., "my shortcut"):');
            if (!phrase) return;

            const action = prompt('Enter the action (URL or search term):');
            if (!action) return;

            const type = prompt('Command type (navigate/search):', 'navigate');
            
            this.addCustomCommand(phrase, action, type || 'navigate');
        }

        /**
         * Show list of custom commands
         */
        showCustomCommandsList() {
            if (this.customCommands.size === 0) {
                this.updateFeedback('No custom commands defined', 'help');
                this.announceToScreenReader('No custom commands defined. Say "create custom command" to add one.');
                return;
            }

            const commandsList = Array.from(this.customCommands.values())
                .map(cmd => `${cmd.phrase} → ${cmd.action}`)
                .join(', ');

            this.updateFeedback(`Custom commands: ${commandsList}`, 'help');
            this.announceToScreenReader(`Custom commands: ${commandsList}`);
        }

        /**
         * Phase 6: Product Detail Page Commands
         */

        /**
         * Toggle like on current product
         */
        async toggleLikeProduct() {
            const likeBtn = document.querySelector('.like-btn');
            
            if (!likeBtn) {
                this.updateFeedback('Like button not found. You may need to login.', 'error');
                this.announceToScreenReader('Like button not found. Please login to like products.');
                return;
            }

            const postId = likeBtn.getAttribute('data-post-id');
            if (!postId) {
                this.updateFeedback('Product ID not found', 'error');
                return;
            }

            this.updateFeedback('Liking product...', 'processing');
            this.announceToScreenReader('Liking product');

            try {
                const csrfToken = this.getCSRFToken();
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }

                const response = await fetch(`/auth/like-post/${postId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const isLiked = data.liked || data.status === 'liked';
                    
                    this.updateFeedback(isLiked ? 'Product liked' : 'Product unliked', 'success');
                    this.announceToScreenReader(isLiked ? 'Product liked successfully' : 'Product unliked');
                    
                    // Trigger click to update UI
                    likeBtn.click();
                } else if (response.status === 401 || response.status === 403) {
                    this.updateFeedback('Please login to like products', 'error');
                    this.announceToScreenReader('Please login to like products');
                } else {
                    throw new Error('Failed to like product');
                }
            } catch (error) {
                console.error('Error liking product:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error liking product: ${error.message}`);
            }
        }

        /**
         * Toggle bookmark on current product
         */
        async toggleBookmarkProduct() {
            const bookmarkBtn = document.querySelector('.bookmark-btn');
            
            if (!bookmarkBtn) {
                // Check if it's a link (for unauthenticated users)
                const bookmarkLink = document.querySelector('a[href*="login"]');
                if (bookmarkLink) {
                    this.updateFeedback('Please login to bookmark products', 'error');
                    this.announceToScreenReader('Please login to bookmark products');
                    return;
                }
                this.updateFeedback('Bookmark button not found', 'error');
                return;
            }

            const postId = bookmarkBtn.getAttribute('data-post-id');
            if (!postId) {
                this.updateFeedback('Product ID not found', 'error');
                return;
            }

            this.updateFeedback('Bookmarking product...', 'processing');
            this.announceToScreenReader('Bookmarking product');

            try {
                const csrfToken = this.getCSRFToken();
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }

                const response = await fetch(`/auth/bookmark/${postId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const isBookmarked = data.is_bookmarked || data.status === 'added';
                    
                    this.updateFeedback(isBookmarked ? 'Product bookmarked' : 'Bookmark removed', 'success');
                    this.announceToScreenReader(isBookmarked ? 'Product saved to bookmarks' : 'Bookmark removed');
                    
                    // Trigger click to update UI
                    bookmarkBtn.click();
                } else if (response.status === 401 || response.status === 403) {
                    this.updateFeedback('Please login to bookmark products', 'error');
                    this.announceToScreenReader('Please login to bookmark products');
                } else {
                    throw new Error('Failed to bookmark product');
                }
            } catch (error) {
                console.error('Error bookmarking product:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error bookmarking product: ${error.message}`);
            }
        }

        /**
         * Open inquiry modal
         */
        openInquiryModal() {
            const inquiryBtn = document.querySelector('[data-bs-target="#inquiryModal"]');
            
            if (!inquiryBtn) {
                // Check if user needs to login
                const loginLink = document.querySelector('a[href*="login"][href*="inquiry"]');
                if (loginLink) {
                    this.updateFeedback('Please login to send inquiry', 'error');
                    this.announceToScreenReader('Please login to send inquiry');
                    return;
                }
                this.updateFeedback('Inquiry button not found', 'error');
                return;
            }

            // Check if Bootstrap modal is available
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const modalElement = document.getElementById('inquiryModal');
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                    this.updateFeedback('Inquiry form opened', 'success');
                    this.announceToScreenReader('Inquiry form opened. You can now fill the form using voice commands.');
                } else {
                    inquiryBtn.click();
                }
            } else {
                inquiryBtn.click();
            }
        }

        /**
         * Start chat with seller
         */
        startChatWithSeller() {
            const chatLink = document.querySelector('a[href*="chat/start/property"]');
            
            if (!chatLink) {
                // Check if user needs to login
                const loginLink = document.querySelector('a[href*="login"][href*="chat"]');
                if (loginLink) {
                    this.updateFeedback('Please login to start chat', 'error');
                    this.announceToScreenReader('Please login to start chat');
                    return;
                }
                this.updateFeedback('Chat link not found', 'error');
                return;
            }

            this.updateFeedback('Opening chat...', 'processing');
            this.announceToScreenReader('Opening chat with seller');
            chatLink.click();
        }

        /**
         * Share product (copy link)
         */
        shareProduct() {
            const shareBtn = document.querySelector('.share-btn');
            
            if (!shareBtn) {
                this.updateFeedback('Share button not found', 'error');
                return;
            }

            this.updateFeedback('Sharing product...', 'processing');
            this.announceToScreenReader('Sharing product link');
            
            // Trigger click which copies URL to clipboard
            shareBtn.click();
            
            setTimeout(() => {
                this.updateFeedback('Product link copied to clipboard', 'success');
                this.announceToScreenReader('Product link copied to clipboard');
            }, 500);
        }

        /**
         * Navigate to next product image
         */
        nextProductImage() {
            const thumbnails = document.querySelectorAll('.thumbnail-item, .auxiliary-images-container .thumbnail-item');
            const activeThumbnail = document.querySelector('.thumbnail-item.active');
            
            if (thumbnails.length === 0) {
                this.updateFeedback('No additional images available', 'error');
                this.announceToScreenReader('No additional images available');
                return;
            }

            let currentIndex = 0;
            if (activeThumbnail) {
                currentIndex = Array.from(thumbnails).indexOf(activeThumbnail);
            }

            const nextIndex = (currentIndex + 1) % thumbnails.length;
            const nextThumbnail = thumbnails[nextIndex];
            
            if (nextThumbnail) {
                nextThumbnail.click();
                this.updateFeedback(`Showing image ${nextIndex + 1} of ${thumbnails.length}`, 'success');
                this.announceToScreenReader(`Showing image ${nextIndex + 1} of ${thumbnails.length}`);
            }
        }

        /**
         * Navigate to previous product image
         */
        previousProductImage() {
            const thumbnails = document.querySelectorAll('.thumbnail-item, .auxiliary-images-container .thumbnail-item');
            const activeThumbnail = document.querySelector('.thumbnail-item.active');
            
            if (thumbnails.length === 0) {
                this.updateFeedback('No additional images available', 'error');
                this.announceToScreenReader('No additional images available');
                return;
            }

            let currentIndex = 0;
            if (activeThumbnail) {
                currentIndex = Array.from(thumbnails).indexOf(activeThumbnail);
            }

            const prevIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
            const prevThumbnail = thumbnails[prevIndex];
            
            if (prevThumbnail) {
                prevThumbnail.click();
                this.updateFeedback(`Showing image ${prevIndex + 1} of ${thumbnails.length}`, 'success');
                this.announceToScreenReader(`Showing image ${prevIndex + 1} of ${thumbnails.length}`);
            }
        }

        /**
         * Navigate to first/main product image
         */
        firstProductImage() {
            const thumbnails = document.querySelectorAll('.thumbnail-item, .auxiliary-images-container .thumbnail-item');
            
            if (thumbnails.length === 0) {
                this.updateFeedback('No images available', 'error');
                return;
            }

            const firstThumbnail = thumbnails[0];
            if (firstThumbnail) {
                firstThumbnail.click();
                this.updateFeedback('Showing main image', 'success');
                this.announceToScreenReader('Showing main product image');
            }
        }

        /**
         * Scroll to reviews section
         */
        scrollToReviews() {
            const reviewsSection = document.querySelector('#reviews, .reviews-section, [id*="review"]');
            
            if (!reviewsSection) {
                // Try to find by heading
                const headings = Array.from(document.querySelectorAll('h2, h3, h4'));
                const reviewHeading = headings.find(h => 
                    h.textContent.toLowerCase().includes('review') || 
                    h.textContent.toLowerCase().includes('rating')
                );
                
                if (reviewHeading) {
                    reviewHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.updateFeedback('Scrolled to reviews', 'success');
                    this.announceToScreenReader('Scrolled to reviews section');
                    return;
                }
                
                this.updateFeedback('Reviews section not found', 'error');
                this.announceToScreenReader('Reviews section not found on this page');
                return;
            }

            reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.updateFeedback('Scrolled to reviews', 'success');
            this.announceToScreenReader('Scrolled to reviews section');
        }

        /**
         * Scroll to review form
         */
        scrollToReviewForm() {
            const reviewForm = document.querySelector('#review-form, form[id*="review"], .review-form');
            
            if (!reviewForm) {
                // Try to find textarea for review
                const reviewTextarea = document.querySelector('textarea[placeholder*="review"], textarea[name*="review"]');
                if (reviewTextarea) {
                    reviewTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    reviewTextarea.focus();
                    this.updateFeedback('Scrolled to review form', 'success');
                    this.announceToScreenReader('Scrolled to review form. You can now write your review.');
                    return;
                }
                
                this.updateFeedback('Review form not found', 'error');
                this.announceToScreenReader('Review form not found. You may need to login first.');
                return;
            }

            reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on textarea if available
            const textarea = reviewForm.querySelector('textarea');
            if (textarea) {
                setTimeout(() => textarea.focus(), 500);
            }
            
            this.updateFeedback('Scrolled to review form', 'success');
            this.announceToScreenReader('Scrolled to review form. You can now write your review.');
        }

        /**
         * Read product description aloud
         */
        readProductDescription() {
            const description = document.querySelector('.product-description, [class*="description"], p.description');
            
            if (!description) {
                // Try to find description in various places
                const possibleDescriptions = document.querySelectorAll('p, div[class*="desc"]');
                for (const elem of possibleDescriptions) {
                    const text = elem.textContent.trim();
                    if (text.length > 50 && text.length < 2000) {
                        const descText = text.substring(0, 500); // Limit length
                        this.updateFeedback(descText, 'help');
                        this.announceToScreenReader(descText);
                        return;
                    }
                }
                
                this.updateFeedback('Description not found', 'error');
                return;
            }

            const descText = description.textContent.trim();
            const limitedText = descText.length > 500 ? descText.substring(0, 500) + '...' : descText;
            
            this.updateFeedback(limitedText, 'help');
            this.announceToScreenReader(descText);
        }

        /**
         * ============================================
         * DASHBOARD PAGE METHODS
         * ============================================
         */

        /**
         * Find product on dashboard by name
         */
        findProductOnDashboard(productName) {
            // Get all product cards
            const productCards = document.querySelectorAll('.pinterest-card[data-post]');
            
            if (productCards.length === 0) {
                return null;
            }

            // Normalize product name for matching
            const normalizedName = productName.toLowerCase().trim();
            
            // Try to find exact match first
            for (const card of productCards) {
                const titleElement = card.querySelector('.card-title, h3[id^="product-title"]');
                if (titleElement) {
                    const title = titleElement.textContent.toLowerCase().trim();
                    if (title === normalizedName || title.includes(normalizedName) || normalizedName.includes(title)) {
                        return card;
                    }
                }
            }

            // Try partial match
            for (const card of productCards) {
                const titleElement = card.querySelector('.card-title, h3[id^="product-title"]');
                if (titleElement) {
                    const title = titleElement.textContent.toLowerCase().trim();
                    const titleWords = title.split(/\s+/);
                    const nameWords = normalizedName.split(/\s+/);
                    
                    // Check if all words in product name appear in title
                    const allWordsMatch = nameWords.every(word => 
                        titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
                    );
                    
                    if (allWordsMatch && nameWords.length > 0) {
                        return card;
                    }
                }
            }

            return null;
        }

        /**
         * Like a product on dashboard by name
         */
        async likeProductOnDashboard(productName) {
            const productCard = this.findProductOnDashboard(productName);
            
            if (!productCard) {
                this.updateFeedback(`Product "${productName}" not found`, 'error');
                this.announceToScreenReader(`Product "${productName}" not found on this page`);
                return;
            }

            const postId = productCard.getAttribute('data-post');
            if (!postId) {
                this.updateFeedback('Product ID not found', 'error');
                return;
            }

            const likeBtn = productCard.querySelector('button[data-like]');
            if (!likeBtn) {
                this.updateFeedback('Like button not found', 'error');
                return;
            }

            this.updateFeedback(`Liking "${productName}"...`, 'processing');
            this.announceToScreenReader(`Liking ${productName}`);

            try {
                // Trigger the existing toggleLike function
                if (typeof toggleLike === 'function') {
                    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                    likeBtn.dispatchEvent(event);
                    
                    // Also call directly if available
                    toggleLike(postId, event);
                    
                    this.updateFeedback(`"${productName}" liked`, 'success');
                    this.announceToScreenReader(`${productName} liked successfully`);
                } else {
                    // Fallback: direct API call
                    const csrfToken = this.getCSRFToken();
                    if (!csrfToken) {
                        throw new Error('CSRF token not found');
                    }

                    const response = await fetch(`/auth/like-post/${postId}/`, {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrfToken,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const isLiked = data.liked || data.status === 'liked';
                        this.updateFeedback(isLiked ? `"${productName}" liked` : `"${productName}" unliked`, 'success');
                        this.announceToScreenReader(isLiked ? `${productName} liked successfully` : `${productName} unliked`);
                    } else {
                        throw new Error('Failed to like product');
                    }
                }
            } catch (error) {
                console.error('Error liking product:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error liking product: ${error.message}`);
            }
        }

        /**
         * Bookmark a product on dashboard by name
         */
        async bookmarkProductOnDashboard(productName) {
            const productCard = this.findProductOnDashboard(productName);
            
            if (!productCard) {
                this.updateFeedback(`Product "${productName}" not found`, 'error');
                this.announceToScreenReader(`Product "${productName}" not found on this page`);
                return;
            }

            const postId = productCard.getAttribute('data-post');
            if (!postId) {
                this.updateFeedback('Product ID not found', 'error');
                return;
            }

            const bookmarkBtn = productCard.querySelector('button[data-bookmark]');
            if (!bookmarkBtn) {
                this.updateFeedback('Bookmark button not found', 'error');
                return;
            }

            this.updateFeedback(`Bookmarking "${productName}"...`, 'processing');
            this.announceToScreenReader(`Bookmarking ${productName}`);

            try {
                // Trigger the existing toggleBookmark function
                if (typeof toggleBookmark === 'function') {
                    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                    bookmarkBtn.dispatchEvent(event);
                    
                    // Also call directly if available
                    toggleBookmark(postId, event);
                    
                    this.updateFeedback(`"${productName}" bookmarked`, 'success');
                    this.announceToScreenReader(`${productName} saved to bookmarks`);
                } else {
                    // Fallback: direct API call
                    const csrfToken = this.getCSRFToken();
                    if (!csrfToken) {
                        throw new Error('CSRF token not found');
                    }

                    const response = await fetch(`/auth/bookmark/${postId}/`, {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrfToken,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const isBookmarked = data.is_bookmarked || data.status === 'added';
                        this.updateFeedback(isBookmarked ? `"${productName}" bookmarked` : `Bookmark removed`, 'success');
                        this.announceToScreenReader(isBookmarked ? `${productName} saved to bookmarks` : `Bookmark removed`);
                    } else {
                        throw new Error('Failed to bookmark product');
                    }
                }
            } catch (error) {
                console.error('Error bookmarking product:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error bookmarking product: ${error.message}`);
            }
        }

        /**
         * View a product on dashboard by name
         */
        viewProductOnDashboard(productName) {
            const productCard = this.findProductOnDashboard(productName);
            
            if (!productCard) {
                this.updateFeedback(`Product "${productName}" not found`, 'error');
                this.announceToScreenReader(`Product "${productName}" not found on this page`);
                return;
            }

            const postId = productCard.getAttribute('data-post');
            if (!postId) {
                this.updateFeedback('Product ID not found', 'error');
                return;
            }

            this.updateFeedback(`Opening "${productName}"...`, 'processing');
            this.announceToScreenReader(`Opening ${productName}`);

            // Use the existing navigateToProduct function if available
            if (typeof navigateToProduct === 'function') {
                navigateToProduct(postId);
            } else {
                // Fallback: navigate directly
                window.location.href = `/auth/post/${postId}/`;
            }
        }

        /**
         * Sort dashboard products
         */
        sortDashboard(sortType) {
            const sortSelect = document.getElementById('sort');
            
            if (!sortSelect) {
                this.updateFeedback('Sort dropdown not found', 'error');
                return;
            }

            // Map sort types
            const sortValueMap = {
                'newest': 'newest',
                'price_low': 'price_low',
                'price_high': 'price_high',
                'popular': 'popular',
                'rating': 'rating'
            };

            const sortValue = sortValueMap[sortType] || 'newest';
            
            if (sortSelect.value === sortValue) {
                this.updateFeedback(`Already sorted by ${sortType}`, 'idle');
                return;
            }

            sortSelect.value = sortValue;
            
            // Trigger form submission
            if (typeof submitForm === 'function') {
                submitForm();
            } else {
                // Fallback: submit the form manually
                const form = document.getElementById('search-form');
                if (form) {
                    form.submit();
                }
            }

            const sortLabels = {
                'newest': 'newest first',
                'price_low': 'price low to high',
                'price_high': 'price high to low',
                'popular': 'most popular',
                'rating': 'highest rated'
            };

            this.updateFeedback(`Sorting by ${sortLabels[sortType] || sortType}...`, 'processing');
            this.announceToScreenReader(`Sorting products by ${sortLabels[sortType] || sortType}`);
        }

        /**
         * Filter dashboard by category
         */
        filterDashboardByCategory(categoryName) {
            const categoryInput = document.getElementById('category-input');
            const categorySelect = document.querySelector('select[name="category"]');
            
            // Normalize category name
            const normalizedCategory = categoryName.toLowerCase().trim();
            
            // Try to find matching category option
            if (categorySelect) {
                const options = Array.from(categorySelect.options);
                for (const option of options) {
                    const optionText = option.text.toLowerCase().trim();
                    const optionValue = option.value.toLowerCase().trim();
                    
                    if (optionText.includes(normalizedCategory) || 
                        normalizedCategory.includes(optionText) ||
                        optionValue === normalizedCategory) {
                        categorySelect.value = option.value;
                        
                        // Trigger form submission
                        if (typeof submitForm === 'function') {
                            submitForm();
                        } else {
                            const form = document.getElementById('search-form');
                            if (form) {
                                form.submit();
                            }
                        }
                        
                        this.updateFeedback(`Filtering by ${option.text}...`, 'processing');
                        this.announceToScreenReader(`Filtering products by ${option.text}`);
                        return;
                    }
                }
            }

            // Try setting category input if available
            if (categoryInput) {
                categoryInput.value = categoryName;
                
                if (typeof submitForm === 'function') {
                    submitForm();
                } else {
                    const form = document.getElementById('search-form');
                    if (form) {
                        form.submit();
                    }
                }
                
                this.updateFeedback(`Filtering by ${categoryName}...`, 'processing');
                this.announceToScreenReader(`Filtering products by ${categoryName}`);
                return;
            }

            this.updateFeedback(`Category "${categoryName}" not found`, 'error');
            this.announceToScreenReader(`Category "${categoryName}" not found`);
        }

        /**
         * Clear dashboard filters
         */
        clearDashboardFilters() {
            // Reset search form
            const form = document.getElementById('search-form');
            if (!form) {
                this.updateFeedback('Search form not found', 'error');
                return;
            }

            // Clear all inputs
            const inputs = form.querySelectorAll('input[type="text"], input[type="number"], select');
            inputs.forEach(input => {
                if (input.name === 'sort') {
                    input.value = 'newest'; // Keep default sort
                } else {
                    input.value = '';
                }
            });

            // Submit form to show all products
            if (typeof submitForm === 'function') {
                submitForm();
            } else {
                form.submit();
            }

            this.updateFeedback('Clearing filters...', 'processing');
            this.announceToScreenReader('Clearing all filters and showing all products');
        }

        /**
         * Navigate to next product on dashboard
         */
        navigateToNextProduct() {
            const productCards = Array.from(document.querySelectorAll('.pinterest-card[data-post]'));
            
            if (productCards.length === 0) {
                this.updateFeedback('No products found', 'error');
                return;
            }

            // Find currently focused/visible product
            const viewportTop = window.scrollY;
            const viewportBottom = viewportTop + window.innerHeight;
            
            let currentIndex = -1;
            for (let i = 0; i < productCards.length; i++) {
                const rect = productCards[i].getBoundingClientRect();
                const cardTop = rect.top + viewportTop;
                const cardBottom = cardTop + rect.height;
                
                // Check if card is in viewport
                if (cardTop < viewportBottom && cardBottom > viewportTop) {
                    currentIndex = i;
                    break;
                }
            }

            // If no product in viewport, start from first
            if (currentIndex === -1) {
                currentIndex = 0;
            } else {
                currentIndex = (currentIndex + 1) % productCards.length;
            }

            const nextCard = productCards[currentIndex];
            nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on the card for accessibility
            nextCard.focus();
            
            const titleElement = nextCard.querySelector('.card-title, h3[id^="product-title"]');
            const productName = titleElement ? titleElement.textContent : 'product';
            
            this.updateFeedback(`Navigated to ${productName}`, 'success');
            this.announceToScreenReader(`Navigated to ${productName}`);
        }

        /**
         * Navigate to previous product on dashboard
         */
        navigateToPreviousProduct() {
            const productCards = Array.from(document.querySelectorAll('.pinterest-card[data-post]'));
            
            if (productCards.length === 0) {
                this.updateFeedback('No products found', 'error');
                return;
            }

            // Find currently focused/visible product
            const viewportTop = window.scrollY;
            const viewportBottom = viewportTop + window.innerHeight;
            
            let currentIndex = -1;
            for (let i = productCards.length - 1; i >= 0; i--) {
                const rect = productCards[i].getBoundingClientRect();
                const cardTop = rect.top + viewportTop;
                const cardBottom = cardTop + rect.height;
                
                // Check if card is in viewport
                if (cardTop < viewportBottom && cardBottom > viewportTop) {
                    currentIndex = i;
                    break;
                }
            }

            // If no product in viewport, start from last
            if (currentIndex === -1) {
                currentIndex = productCards.length - 1;
            } else {
                currentIndex = (currentIndex - 1 + productCards.length) % productCards.length;
            }

            const prevCard = productCards[currentIndex];
            prevCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on the card for accessibility
            prevCard.focus();
            
            const titleElement = prevCard.querySelector('.card-title, h3[id^="product-title"]');
            const productName = titleElement ? titleElement.textContent : 'product';
            
            this.updateFeedback(`Navigated to ${productName}`, 'success');
            this.announceToScreenReader(`Navigated to ${productName}`);
        }

        /**
         * Go to next page
         */
        goToNextPage() {
            const nextLink = document.querySelector('.pagination a[aria-label*="next"], .pagination a[aria-label*="Next"]');
            
            if (!nextLink) {
                this.updateFeedback('No next page available', 'error');
                this.announceToScreenReader('You are on the last page');
                return;
            }

            this.updateFeedback('Loading next page...', 'processing');
            this.announceToScreenReader('Loading next page');
            window.location.href = nextLink.href;
        }

        /**
         * Go to previous page
         */
        goToPreviousPage() {
            const prevLink = document.querySelector('.pagination a[aria-label*="previous"], .pagination a[aria-label*="Previous"]');
            
            if (!prevLink) {
                this.updateFeedback('No previous page available', 'error');
                this.announceToScreenReader('You are on the first page');
                return;
            }

            this.updateFeedback('Loading previous page...', 'processing');
            this.announceToScreenReader('Loading previous page');
            window.location.href = prevLink.href;
        }

        /**
         * Go to first page
         */
        goToFirstPage() {
            const firstLink = document.querySelector('.pagination a[aria-label*="first"], .pagination a[aria-label*="First"]');
            
            if (!firstLink) {
                this.updateFeedback('Already on first page', 'idle');
                return;
            }

            this.updateFeedback('Loading first page...', 'processing');
            this.announceToScreenReader('Loading first page');
            window.location.href = firstLink.href;
        }

        /**
         * Add current product to cart (on product detail page)
         */
        async addCurrentProductToCart() {
            // Find add to cart form or button
            const addToCartForm = document.querySelector('form[action*="add_to_cart"]');
            const addToCartBtn = document.querySelector('button[type="submit"][form*="cart"], button:has-text("Add to Cart")');
            
            if (!addToCartForm && !addToCartBtn) {
                // Check if it's furniture (only furniture can be added to cart)
                const isFurniture = document.querySelector('[data-property-type="furniture"]');
                if (!isFurniture) {
                    this.updateFeedback('This product cannot be added to cart. Only furniture items can be added.', 'error');
                    this.announceToScreenReader('This product cannot be added to cart. Only furniture items can be added to cart.');
                    return;
                }
                
                // Check if user needs to login
                const loginLink = document.querySelector('a[href*="login"][href*="cart"]');
                if (loginLink) {
                    this.updateFeedback('Please login to add to cart', 'error');
                    this.announceToScreenReader('Please login to add items to cart');
                    return;
                }
                
                this.updateFeedback('Add to cart button not found', 'error');
                return;
            }

            this.updateFeedback('Adding to cart...', 'processing');
            this.announceToScreenReader('Adding product to cart');

            try {
                if (addToCartForm) {
                    // Submit the form
                    const csrfToken = this.getCSRFToken();
                    if (!csrfToken) {
                        throw new Error('CSRF token not found');
                    }

                    const formData = new FormData(addToCartForm);
                    const response = await fetch(addToCartForm.action, {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrfToken
                        },
                        body: formData
                    });

                    if (response.ok || response.redirected) {
                        this.updateFeedback('Product added to cart', 'success');
                        this.announceToScreenReader('Product added to cart successfully');
                        this.updateCartBadge();
                    } else {
                        throw new Error('Failed to add to cart');
                    }
                } else if (addToCartBtn) {
                    addToCartBtn.click();
                    setTimeout(() => {
                        this.updateFeedback('Product added to cart', 'success');
                        this.announceToScreenReader('Product added to cart');
                    }, 500);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.updateFeedback(`Error: ${error.message}`, 'error');
                this.announceToScreenReader(`Error adding to cart: ${error.message}`);
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
            const browserExamples = [
                'Go back',
                'Refresh page',
                'Scroll to top',
                'Scroll down'
            ];
            const customExamples = [
                'Repeat',
                'Create custom command',
                'Show custom commands',
                'Suggest commands'
            ];
            const productDetailExamples = [
                'Like this',
                'Bookmark this',
                'Add to cart',
                'Send inquiry',
                'Start chat',
                'Share product',
                'View reviews',
                'Next image'
            ];
            const dashboardExamples = [
                'Like iPhone',
                'Bookmark furniture',
                'View property',
                'Sort by price',
                'Filter by electronics',
                'Show newest first',
                'Next product',
                'Clear filters'
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
                        
                        <div class="voice-help-section">
                            <h3>Browser Control</h3>
                            <ul class="voice-commands-list">
                                ${browserExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="voice-help-section">
                            <h3>Advanced Features</h3>
                            <ul class="voice-commands-list">
                                ${customExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="voice-help-section">
                            <h3>Product Detail Page</h3>
                            <ul class="voice-commands-list">
                                ${productDetailExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="voice-help-section">
                            <h3>Dashboard Page</h3>
                            <ul class="voice-commands-list">
                                ${dashboardExamples.map(cmd => `<li>"${cmd}"</li>`).join('')}
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

