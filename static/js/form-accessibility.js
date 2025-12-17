/**
 * Form Accessibility Module for Voice Assistants
 * 
 * This module enhances form accessibility for blind users and voice assistants
 * by providing:
 * - Live regions for error announcements
 * - Real-time validation feedback
 * - ARIA attribute management
 * - Screen reader announcements
 */

(function() {
    'use strict';

    /**
     * Form Accessibility Manager
     */
    class FormAccessibility {
        constructor(formElement) {
            this.form = formElement;
            this.liveRegion = null;
            this.errorSummary = null;
            this.init();
        }

        /**
         * Initialize accessibility features
         */
        init() {
            // Create live region for announcements
            this.createLiveRegion();
            
            // Create error summary region
            this.createErrorSummary();
            
            // Enhance form fields
            this.enhanceFormFields();
            
            // Setup validation listeners
            this.setupValidationListeners();
            
            // Setup form submission handler
            this.setupFormSubmission();
        }

        /**
         * Create ARIA live region for screen reader announcements
         */
        createLiveRegion() {
            // Check if live region already exists
            this.liveRegion = document.getElementById('form-live-region');
            
            if (!this.liveRegion) {
                this.liveRegion = document.createElement('div');
                this.liveRegion.id = 'form-live-region';
                this.liveRegion.setAttribute('role', 'status');
                this.liveRegion.setAttribute('aria-live', 'polite');
                this.liveRegion.setAttribute('aria-atomic', 'true');
                this.liveRegion.className = 'sr-only';
                this.liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
                document.body.appendChild(this.liveRegion);
            }
        }

        /**
         * Create error summary region
         */
        createErrorSummary() {
            // Check if error summary already exists
            this.errorSummary = document.getElementById('form-error-summary');
            
            if (!this.errorSummary && this.form) {
                this.errorSummary = document.createElement('div');
                this.errorSummary.id = 'form-error-summary';
                this.errorSummary.setAttribute('role', 'alert');
                this.errorSummary.setAttribute('aria-live', 'assertive');
                this.errorSummary.setAttribute('aria-atomic', 'true');
                this.errorSummary.className = 'form-error-summary sr-only';
                
                // Insert at the beginning of the form
                this.form.insertBefore(this.errorSummary, this.form.firstChild);
            }
        }

        /**
         * Enhance form fields with accessibility attributes
         */
        enhanceFormFields() {
            if (!this.form) return;

            const fields = this.form.querySelectorAll('input, textarea, select');
            
            fields.forEach((field, index) => {
                // Skip hidden fields
                if (field.type === 'hidden') return;

                // Get associated label
                const label = this.getLabelForField(field);
                
                // Add aria-describedby for help text
                const helpText = this.getHelpText(field);
                if (helpText) {
                    const helpId = `${field.id || field.name}-help`;
                    helpText.id = helpId;
                    if (field.getAttribute('aria-describedby')) {
                        field.setAttribute('aria-describedby', 
                            `${field.getAttribute('aria-describedby')} ${helpId}`);
                    } else {
                        field.setAttribute('aria-describedby', helpId);
                    }
                }

                // Add aria-required if field is required
                if (field.hasAttribute('required') && !field.hasAttribute('aria-required')) {
                    field.setAttribute('aria-required', 'true');
                }

                // Add aria-invalid when field has errors
                if (field.classList.contains('is-invalid') || 
                    field.classList.contains('input-error')) {
                    field.setAttribute('aria-invalid', 'true');
                } else {
                    field.setAttribute('aria-invalid', 'false');
                }

                // Link error messages with aria-describedby
                const errorElement = this.getErrorElement(field);
                if (errorElement) {
                    const errorId = `${field.id || field.name}-error`;
                    errorElement.id = errorId;
                    if (field.getAttribute('aria-describedby')) {
                        field.setAttribute('aria-describedby', 
                            `${field.getAttribute('aria-describedby')} ${errorId}`);
                    } else {
                        field.setAttribute('aria-describedby', errorId);
                    }
                }
            });
        }

        /**
         * Get label element for a field
         */
        getLabelForField(field) {
            if (field.id) {
                return document.querySelector(`label[for="${field.id}"]`);
            }
            // Try to find label by name
            const name = field.getAttribute('name');
            if (name) {
                return document.querySelector(`label[for="${name}"]`);
            }
            return null;
        }

        /**
         * Get help text element for a field
         */
        getHelpText(field) {
            const fieldContainer = field.closest('.mb-3, .mb-4, .form-group, .form-field');
            if (fieldContainer) {
                return fieldContainer.querySelector('.form-text, .help-text, .field-help');
            }
            return null;
        }

        /**
         * Get error element for a field
         */
        getErrorElement(field) {
            const fieldContainer = field.closest('.mb-3, .mb-4, .form-group, .form-field');
            if (fieldContainer) {
                return fieldContainer.querySelector('.form-error, .field-error-message, .invalid-feedback');
            }
            return null;
        }

        /**
         * Setup validation listeners for real-time feedback
         */
        setupValidationListeners() {
            if (!this.form) return;

            const fields = this.form.querySelectorAll('input, textarea, select');
            
            fields.forEach(field => {
                // Validate on blur (when user leaves field)
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });

                // Clear errors when user starts typing
                field.addEventListener('input', () => {
                    if (field.getAttribute('aria-invalid') === 'true') {
                        this.clearFieldError(field);
                    }
                });
            });
        }

        /**
         * Validate a single field
         */
        validateField(field) {
            const isValid = field.checkValidity();
            
            if (!isValid) {
                this.setFieldError(field, field.validationMessage || 'This field has an error');
            } else {
                this.clearFieldError(field);
            }
        }

        /**
         * Set error state on a field
         */
        setFieldError(field, errorMessage) {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('is-invalid', 'input-error');
            
            // Announce error to screen reader
            const label = this.getLabelForField(field);
            const fieldName = label ? label.textContent.trim() : field.name || 'Field';
            this.announce(`${fieldName}: ${errorMessage}`, 'assertive');
        }

        /**
         * Clear error state on a field
         */
        clearFieldError(field) {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('is-invalid', 'input-error');
            
            const errorElement = this.getErrorElement(field);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        }

        /**
         * Setup form submission handler
         */
        setupFormSubmission() {
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => {
                // Validate all fields before submission
                const errors = this.validateForm();
                
                if (errors.length > 0) {
                    e.preventDefault();
                    this.announceErrors(errors);
                    this.focusFirstError();
                    return false;
                }
            });
        }

        /**
         * Validate entire form
         */
        validateForm() {
            const errors = [];
            const fields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
            
            fields.forEach(field => {
                if (!field.checkValidity()) {
                    const label = this.getLabelForField(field);
                    const fieldName = label ? label.textContent.trim() : field.name || 'Field';
                    const errorMsg = field.validationMessage || `${fieldName} is required`;
                    errors.push({
                        field: field,
                        name: fieldName,
                        message: errorMsg
                    });
                    this.setFieldError(field, errorMsg);
                }
            });
            
            return errors;
        }

        /**
         * Announce errors to screen reader
         */
        announceErrors(errors) {
            if (errors.length === 0) return;

            let errorSummary = `Form has ${errors.length} error${errors.length > 1 ? 's' : ''}. `;
            errors.forEach((error, index) => {
                errorSummary += `${index + 1}. ${error.name}: ${error.message}. `;
            });

            // Update error summary
            if (this.errorSummary) {
                this.errorSummary.innerHTML = `<strong>Form Errors:</strong> ${errorSummary}`;
                this.errorSummary.style.display = 'block';
                this.errorSummary.classList.remove('sr-only');
            }

            // Announce to screen reader
            this.announce(errorSummary, 'assertive');
        }

        /**
         * Focus first error field
         */
        focusFirstError() {
            const firstError = this.form.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
                // Scroll to error
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        /**
         * Announce message to screen reader
         */
        announce(message, priority = 'polite') {
            if (!this.liveRegion) return;

            // Use appropriate live region based on priority
            const region = priority === 'assertive' ? 
                (this.errorSummary || this.liveRegion) : 
                this.liveRegion;
            
            if (region) {
                region.setAttribute('aria-live', priority);
                region.textContent = message;
                
                // Clear after announcement (for polite announcements)
                if (priority === 'polite') {
                    setTimeout(() => {
                        region.textContent = '';
                    }, 1000);
                }
            }
        }

        /**
         * Announce success message
         */
        announceSuccess(message) {
            this.announce(message, 'polite');
        }
    }

    /**
     * Initialize form accessibility for all forms on page load
     */
    function initFormAccessibility() {
        const forms = document.querySelectorAll('form[id], form[class*="form"]');
        
        forms.forEach(form => {
            // Skip if already initialized
            if (form.dataset.accessibilityInitialized) return;
            
            new FormAccessibility(form);
            form.dataset.accessibilityInitialized = 'true';
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormAccessibility);
    } else {
        initFormAccessibility();
    }

    // Re-initialize for dynamically loaded forms
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'FORM') {
                        new FormAccessibility(node);
                    } else {
                        const forms = node.querySelectorAll && node.querySelectorAll('form');
                        if (forms) {
                            forms.forEach(form => {
                                if (!form.dataset.accessibilityInitialized) {
                                    new FormAccessibility(form);
                                    form.dataset.accessibilityInitialized = 'true';
                                }
                            });
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Export for global access
    window.FormAccessibility = FormAccessibility;
})();

