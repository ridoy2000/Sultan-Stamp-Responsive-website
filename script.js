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
                        }, 300);
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

    // Enhanced Lightbox with Swipe Functionality
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
        if (index >= galleryImages.length) index = 0;
        if (index < 0) index = galleryImages.length - 1;
        currentImageIndex = index;
        
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

    // Event listeners for gallery images
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            showImage(currentImageIndex);
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Touch events for swipe
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
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) prevImage();
            else nextImage();
        }
        lightboxImg.style.transform = 'translate(-50%, -50%)';
    }, { passive: true });

    // Close and keyboard controls
    lightbox.addEventListener('click', function(e) {
        // Check if click is directly on the lightbox background (not on image or buttons)
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

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

    // Navigation arrows
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

    // Auto-sliding carousel
    const myCarousel = new bootstrap.Carousel('#carouselExampleCaptions', {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover'
    });
});