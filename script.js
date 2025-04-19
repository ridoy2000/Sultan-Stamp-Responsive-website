// Section Explanations:
// Mobile Menu Handling: Manages the responsive navbar behavior, automatically closing the mobile menu when a link is clicked and handling smooth scrolling to the top for the home link.

// Smooth Scrolling: Implements smooth scrolling for anchor links with proper offset to account for the fixed navbar height.

// Contact Form Handling: Provides comprehensive form submission handling with validation, loading states, success messages, and error handling using Formspree.

// Form Validation Functions: Contains helper functions that validate form inputs in real-time and display appropriate error messages for required fields, email formats, and minimum lengths.

// Scroll Event: Adds a visual effect to the navbar when scrolling down the page by toggling a 'scrolled' class.

// Copyright Year Update: Automatically updates the copyright year in the footer to the current year.

// Newsletter Form: Handles newsletter subscriptions with basic email validation and provides visual feedback upon submission.

// Lightbox Gallery: Creates an interactive image gallery lightbox with swipe gestures (for touch devices), keyboard navigation, and smooth transitions between images.

// Carousel Initialization: Initializes a Bootstrap carousel component with auto-rotation and hover-pause functionality.

// Add 'loaded' class to HTML element when script loads
document.documentElement.classList.add('loaded');

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    // ========== MOBILE MENU HANDLING ==========
    // Handles mobile menu toggle and navigation link behavior
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(navLink => {
        navLink.addEventListener('click', function(e) {
            // Close mobile menu if open when a link is clicked
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
            
            // Special handling for home link to smoothly scroll to top
            if (this.getAttribute('href') === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== SMOOTH SCROLLING ==========
    // Adds smooth scrolling to all anchor links (except home) with navbar offset
    document.querySelectorAll('a[href^="#"]:not([href="#home"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            window.scrollTo({
                top: target.offsetTop - navbarHeight,
                behavior: 'smooth'
            });
        });
    });

    // ========== CONTACT FORM HANDLING ==========
    // Handles form submission with validation, loading states, and success/error messages
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (!validateForm(contactForm)) {
                return;
            }
            
            const form = this;
            const submitButton = form.querySelector('button[type="submit"]');
            const successMessage = document.getElementById('successMessage');
            
            // Show loading state on submit button
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="ms-2">Sending...</span>
            `;
            
            try {
                // Send form data to server
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                // Handle successful submission
                if (response.ok) {
                    successMessage.style.display = 'block';
                    successMessage.classList.add('show');
                    form.reset();
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                    
                    // Hide success message after delay
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 300);
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showError('There was a problem sending your message. Please try again later.');
                console.error('Error:', error);
            } finally {
                // Reset submit button state
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
            }
        });
        
        // Add real-time validation to form fields
        addFormValidation(contactForm);
    }

    // ========== FORM VALIDATION FUNCTIONS ==========
    // Contains helper functions for form validation and error display
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        // Validate each input field
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateInput(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById(`${input.name}-error`) || createErrorElement(input);
        
        // Clear previous errors
        errorElement.textContent = '';
        input.classList.remove('is-invalid');
        
        // Check required fields
        if (input.required && !value) {
            showFieldError(input, errorElement, 'This field is required');
            return false;
        }
        
        // Validate email format
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(input, errorElement, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Check minimum length
        if (input.minLength && value.length < input.minLength) {
            showFieldError(input, errorElement, `Minimum ${input.minLength} characters required`);
            return false;
        }
        
        return true;
    }
    
    function createErrorElement(input) {
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.id = `${input.name}-error`;
        errorElement.className = 'invalid-feedback';
        input.parentNode.appendChild(errorElement);
        return errorElement;
    }
    
    function showFieldError(input, errorElement, message) {
        // Display field-specific error message
        errorElement.textContent = message;
        input.classList.add('is-invalid');
    }
    
    function showError(message) {
        // Show general error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
        `;
        errorDiv.style.display = 'block';
        
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(errorDiv, form.nextSibling);
        
        // Auto-remove error message
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 5000);
    }
    
    function addFormValidation(form) {
        // Add validation events to form inputs
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validate when leaving field
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            // Clear errors when typing
            input.addEventListener('input', () => {
                const errorElement = document.getElementById(`${input.name}-error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    input.classList.remove('is-invalid');
                }
            });
        });
    }

    // ========== SCROLL EVENT ==========
    // Adds/removes 'scrolled' class to navbar based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });

    // ========== COPYRIGHT YEAR UPDATE ==========
    // Updates copyright year automatically
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // ========== NEWSLETTER FORM ==========
    // Handles newsletter subscription with basic validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const button = this.querySelector('button');
            
            if (email) {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }
                
                // Simulate subscription (would be API call in production)
                console.log('Subscribed email:', email);
                
                // Visual feedback
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.backgroundColor = '#4CAF50';
                
                // Reset form after delay
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    button.style.backgroundColor = '';
                    emailInput.value = '';
                }, 2000);
            }
        });
    }

    // ========== LIGHTBOX GALLERY ==========
    // Creates an interactive image lightbox with swipe and keyboard navigation
    let currentImageIndex = 0;
    let touchStartX = 0;
    let isSwiping = false;
    const swipeThreshold = 50; // pixels

    const galleryImages = document.querySelectorAll('.grid-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-btn');

    // Lightbox navigation functions
    function showImage(index) {
        // Handle circular navigation (wraps around)
        if (index >= galleryImages.length) index = 0;
        if (index < 0) index = galleryImages.length - 1;
        currentImageIndex = index;
        
        // Update lightbox content
        lightboxImg.src = galleryImages[currentImageIndex].src;
        captionText.textContent = galleryImages[currentImageIndex].alt;
        
        // Add swipe animation
        lightboxImg.style.animation = 'none';
        void lightboxImg.offsetWidth; // Trigger reflow
        lightboxImg.style.animation = 'lightboxSwipe 0.3s ease-out';
    }

    function nextImage() {
        showImage(currentImageIndex + 1);
    }

    function prevImage() {
        showImage(currentImageIndex - 1);
    }

    // Open lightbox when gallery image clicked
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            showImage(currentImageIndex);
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Touch events for swipe navigation
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
        lightbox.classList.add('swiping');
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const touchX = e.touches[0].clientX;
        const diff = touchX - touchStartX;
        lightboxImg.style.transform = `translate(calc(-50% + ${diff}px), -50%)`;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        lightbox.classList.remove('swiping');
        
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        
        // Navigate if swipe exceeds threshold
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) prevImage();
            else nextImage();
        }
        lightboxImg.style.transform = 'translate(-50%, -50%)';
    }, { passive: true });

    // Close lightbox when clicking background or pressing Escape
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display !== 'block') return;
        
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });

    // Create navigation arrows
    const prevBtn = document.createElement('div');
    prevBtn.className = 'prev';
    prevBtn.innerHTML = '❮';
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    const nextBtn = document.createElement('div');
    nextBtn.className = 'next';
    nextBtn.innerHTML = '❯';
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    lightbox.appendChild(prevBtn);
    lightbox.appendChild(nextBtn);

    // ========== CAROUSEL INITIALIZATION ==========
    // Initializes Bootstrap carousel with custom settings
    const myCarousel = new bootstrap.Carousel('#carouselExampleCaptions', {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover'
    });
});
