// FIRST LINE in script.js
document.documentElement.classList.add('loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(navLink => {
        navLink.addEventListener('click', function(e) {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
            
            if (this.getAttribute('href') === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scrolling with offset for navbar
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

    // Enhanced Form submission with Formspree
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
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="ms-2">Sending...</span>
            `;
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    successMessage.style.display = 'block';
                    successMessage.classList.add('show');
                    form.reset();
                    
                    // Smoothly scroll to message (without jumping to top)
                    successMessage.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                    
                    // Hide after 5 seconds with fade out
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 300); // Match this with CSS transition duration
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showError('There was a problem sending your message. Please try again later.');
                console.error('Error:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
            }
        });
        
        // Add real-time validation
        addFormValidation(contactForm);
    }

    // Form validation functions
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
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
        
        // Required field validation
        if (input.required && !value) {
            showFieldError(input, errorElement, 'This field is required');
            return false;
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(input, errorElement, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Minimum length validation
        if (input.minLength && value.length < input.minLength) {
            showFieldError(input, errorElement, `Minimum ${input.minLength} characters required`);
            return false;
        }
        
        return true;
    }
    
    function createErrorElement(input) {
        const errorElement = document.createElement('div');
        errorElement.id = `${input.name}-error`;
        errorElement.className = 'invalid-feedback';
        input.parentNode.appendChild(errorElement);
        return errorElement;
    }
    
    function showFieldError(input, errorElement, message) {
        errorElement.textContent = message;
        input.classList.add('is-invalid');
    }
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
        `;
        errorDiv.style.display = 'block';
        
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(errorDiv, form.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 5000);
    }
    
    function addFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            // Clear error when typing
            input.addEventListener('input', () => {
                const errorElement = document.getElementById(`${input.name}-error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    input.classList.remove('is-invalid');
                }
            });
        });
    }

    // Add scroll event for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });

    // Update copyright year automatically
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const button = this.querySelector('button');
            
            if (email) {
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }
                
                // Here you would typically send to your email service
                console.log('Subscribed email:', email);
                
                // Show visual feedback
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.backgroundColor = '#4CAF50';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    button.style.backgroundColor = '';
                    emailInput.value = '';
                }, 2000);
            }
        });
    }

    // Lightbox functionality
    const galleryImages = document.querySelectorAll('.grid-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-btn');

    // Add click event to each gallery image
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            captionText.textContent = this.alt;
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox when clicking the close button
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Add navigation arrows functionality
    let currentImageIndex = 0;
    const prevBtn = document.createElement('div');
    const nextBtn = document.createElement('div');
    
    prevBtn.className = 'prev';
    prevBtn.innerHTML = '&#10094;';
    nextBtn.className = 'next';
    nextBtn.innerHTML = '&#10095;';
    
    lightbox.appendChild(prevBtn);
    lightbox.appendChild(nextBtn);

    // Update current image index when opening lightbox
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
        });
    });

    // Previous button functionality
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    });

    // Next button functionality
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                updateLightboxImage();
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                updateLightboxImage();
            }
        }
    });

    function updateLightboxImage() {
        const img = galleryImages[currentImageIndex];
        lightboxImg.src = img.src;
        captionText.textContent = img.alt;
        
        // Add zoom-in animation
        lightboxImg.style.animation = 'none';
        void lightboxImg.offsetWidth; // Trigger reflow
        lightboxImg.style.animation = 'zoomIn 0.3s';
    }

    // Auto-sliding carousel
    const myCarousel = new bootstrap.Carousel('#carouselExampleCaptions', {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover'
    });
});