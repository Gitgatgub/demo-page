// Main JavaScript - SMB Version
document.addEventListener('DOMContentLoaded', function() {
    
    // Count-up Stats Animation
    function animateValue(element, start, end, duration, suffix = '') {
        const range = end - start;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += 1;
            element.textContent = current + suffix;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Intersection Observer for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                // Extract number and suffix
                if (text.includes('%')) {
                    const num = parseInt(text);
                    element.textContent = '0%';
                    animateValue(element, 0, num, 1500, '%');
                } else if (text.includes('£')) {
                    element.textContent = '£0';
                    animateValue(element, 0, 47, 1500, 'K');
                }
                
                // Only animate once
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all stat numbers
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Industry Tabs Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const industryCards = document.querySelectorAll('.industry-card');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and cards
            tabButtons.forEach(btn => btn.classList.remove('active'));
            industryCards.forEach(card => card.classList.remove('active'));
            
            // Add active class to clicked button and corresponding card
            this.classList.add('active');
            const targetCard = document.getElementById(targetTab);
            if (targetCard) {
                targetCard.classList.add('active');
            }
        });
    });
    
    // Form Handling with White-label Support
    const optinForm = document.querySelector('[data-form="lead-gen"]');
    if (optinForm) {
        optinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Track form submission
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'lead_submitted',
                    'agency': data.source,
                    'variant': data.variant,
                    'business_name': data.business_name
                });
            }
            
            // Show success state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '✓ Check Your Email!';
            submitButton.disabled = true;
            
            // Reset form after delay
            setTimeout(() => {
                this.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 3000);
            
            // In production, submit to actual endpoint
            // await fetch(this.action, { method: 'POST', body: formData });
        });
    }
    
    // Smooth scroll to form when CTA clicked
    const ctaLinks = document.querySelectorAll('a[href="#get-started"], a[href="#hero-form"]');
    ctaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const heroForm = document.querySelector('.hero-optin');
            if (heroForm) {
                heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus first input after scroll
                setTimeout(() => {
                    const firstInput = heroForm.querySelector('input[type="text"]');
                    if (firstInput) firstInput.focus();
                }, 500);
            }
        });
    });
    
    // Mobile menu toggle (existing code enhanced)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    
    mobileMenuToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
        navActions.classList.toggle('mobile-active');
        
        // Animate hamburger to X
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Add scroll-based navbar styling
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
    
    // Exit Intent Popup (for white-label customization)
    let exitIntentShown = false;
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            // Trigger exit intent modal here
            // Can be customized by agencies
        }
    });
    
    // Track phone number clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'phone_click',
                    'phone_number': this.getAttribute('href').replace('tel:', '')
                });
            }
        });
    });
    
    // Video lazy loading
    const videoContainers = document.querySelectorAll('.hero-video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && !iframe.src) {
                    iframe.src = iframe.dataset.src || iframe.getAttribute('src');
                }
                videoObserver.unobserve(entry.target);
            }
        });
    });
    
    videoContainers.forEach(container => {
        videoObserver.observe(container);
    });
});

// Add navbar scroll styles
const navbarStyles = `
    .navbar.scrolled {
        padding: 0.5rem 0;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .navbar.hidden {
        transform: translateY(-100%);
    }
    
    .navbar {
        transition: all 0.3s ease;
    }
    
    .mobile-active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--color-bg-primary);
        flex-direction: column;
        padding: var(--spacing-lg);
        border-top: 1px solid var(--color-border);
    }
    
    .nav-menu.mobile-active {
        gap: var(--spacing-lg);
    }
    
    .mobile-menu-toggle span {
        transition: all 0.3s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = navbarStyles;
document.head.appendChild(styleSheet);