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

    // Section reveal animations
    const animateOnScroll = function() {
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.remove('section-hidden');
            }
        });
    };

    // Initialize sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-hidden');
    });

    // Trigger animations
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = this;
            const submitButton = form.querySelector('button[type="submit"]');
            const successMessage = document.getElementById('successMessage');
            
            // Show loading state
            form.classList.add('form-loading');
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="ms-2">Sending...</span>
            `;
            
            fetch("/", {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    successMessage.classList.add('show');
                    form.reset();
                    
                    // Scroll to message
                    window.scrollTo({
                        top: successMessage.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Hide after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                form.classList.add('form-error');
                setTimeout(() => {
                    form.classList.remove('form-error');
                }, 2000);
                console.error('Error:', error);
            })
            .finally(() => {
                form.classList.remove('form-loading');
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
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
});