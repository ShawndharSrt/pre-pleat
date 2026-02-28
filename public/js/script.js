document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Hero Parallax Effect
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        });
    }

    // 3. Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 4. Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const filterPill = document.getElementById('filter-pill');

    // Initialize pill position
    const initPill = () => {
        const activeBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (activeBtn && filterPill) {
            filterPill.style.width = `${activeBtn.offsetWidth}px`;
            // Calculate left position relative to parent
            filterPill.style.transform = `translateX(${activeBtn.offsetLeft - 6}px)`; // -6px for the parent's p-1.5 padding
        }
    };

    // Call on load and resize
    initPill();
    window.addEventListener('resize', initPill);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update sliding pill
            if (filterPill) {
                filterPill.style.width = `${btn.offsetWidth}px`;
                filterPill.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
            }

            // Remove active class from all
            filterBtns.forEach(b => {
                b.classList.remove('text-white');
                b.classList.add('text-ink-muted');
            });

            // Add active class to clicked
            btn.classList.add('text-white');
            btn.classList.remove('text-ink-muted');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1) translateY(0)'; }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95) translateY(20px)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // 5. Lightbox
    const portfolioImages = document.querySelectorAll('.portfolio-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg && lightboxClose) {
        portfolioImages.forEach(img => {
            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                lightboxImg.setAttribute('src', src);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent scrolling
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // 6. FAQ Accordion
    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.ph-caret-down');

            // Close all others
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.nextElementSibling.style.maxHeight = null;
                    otherBtn.querySelector('.ph-caret-down').style.transform = 'rotate(0deg)';
                }
            });

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 7. Form Submission (Demo) & Validation
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        // Indian mobile number validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.pattern = "^[6-9]\\d{9}$";

            // Allow only numbers and restrict length
            phoneInput.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
            });
        }

        // Custom Validation Messages
        const requiredInputs = bookingForm.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            input.addEventListener('invalid', () => {
                if (input.validity.valueMissing) {
                    let fieldName = 'This field';
                    if (input.id === 'name') fieldName = 'Full Name';
                    if (input.id === 'phone') fieldName = 'Phone Number';
                    if (input.id === 'saree-type') fieldName = 'Saree Type';
                    if (input.id === 'date') fieldName = 'Drop-off Date';

                    input.setCustomValidity(`${fieldName} is required.`);
                } else if (input.id === 'phone' && input.validity.patternMismatch) {
                    input.setCustomValidity("Please enter a valid 10-digit mobile number.");
                }
            });

            // Clear custom message on input so the browser can re-evaluate validity
            const clearValidity = () => input.setCustomValidity('');
            input.addEventListener('input', clearValidity);
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', clearValidity);
            }
        });

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Honeypot check for bot protection
            const honeypotField = document.getElementById('bot-field');
            if (honeypotField && honeypotField.value) {
                console.warn('Bot activity detected.');
                bookingForm.reset();
                showSnackbar('Thank you! Your booking request has been received.', 'success');
                return;
            }

            submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin text-xl"></i> Processing...';
            submitBtn.disabled = true;

            // 1. Get the form data
            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('phone', document.getElementById('phone').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('sareeType', document.getElementById('saree-type').value);
            formData.append('date', document.getElementById('date').value);
            formData.append('message', document.getElementById('message').value);

            // 2. PASTE YOUR GOOGLE APP SCRIPT URL HERE
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtNznG-jKYp7FaOYvWZyMsfD2XLEPlFrR8pjlk0TcnSBEjk4CcPKc3jLgTZZd-qAOZ/exec";

            try {
                // Send data to Google Sheets
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });
                console.log("response from google script", response);


                if (response.ok) {
                    showSnackbar('Thank you! Your booking request has been received.', 'success');
                    bookingForm.reset();
                } else {
                    showSnackbar('There was a problem submitting your request. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error!', error.message);
                showSnackbar('We could not save your booking. Please try again or contact us directly.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 8. 3D Scroll Container Animation (Aceternity UI clone)
    const scrollArea = document.querySelector('.scroll-container-area');
    const scrollHeader = document.querySelector('.scroll-header');
    const scrollCard = document.querySelector('.scroll-card');

    if (scrollArea && scrollHeader && scrollCard) {
        let isScrolling = false;

        const updateScrollAnimation = () => {
            const rect = scrollArea.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const elementTop = rect.top;
            const scrollDistance = viewportHeight - elementTop;
            const totalDistance = viewportHeight + rect.height;

            let progress = scrollDistance / totalDistance;

            progress = Math.max(0, Math.min(1, progress));

            const isMobile = window.innerWidth <= 768;

            let rotationProgress = progress * 2;
            rotationProgress = Math.min(1, rotationProgress);

            // Use fixed precision to prevent sub-pixel shaking
            const rotateX = Number((20 - (20 * rotationProgress)).toFixed(2));
            const translateY = Number((-100 * rotationProgress).toFixed(2));

            let scale;
            if (isMobile) {
                scale = Number((0.7 + (0.2 * rotationProgress)).toFixed(3));
            } else {
                scale = Number((1.05 - (0.05 * rotationProgress)).toFixed(3));
            }

            scrollHeader.style.transform = `translateY(${translateY}px)`;
            scrollCard.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;

            isScrolling = false;
        };

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(updateScrollAnimation);
                isScrolling = true;
            }
        }, { passive: true });

        // Initial call to set state
        updateScrollAnimation();
    }

    // 9. Hero Scroll Animation
    const heroScrollArea = document.querySelector('.scroll-container-area-hero');
    const heroScrollHeader = document.querySelector('.scroll-header-hero');
    const heroScrollCard = document.querySelector('.scroll-card-hero');

    if (heroScrollArea && heroScrollHeader && heroScrollCard) {
        let isHeroScrolling = false;

        const updateHeroScrollAnimation = () => {
            const rect = heroScrollArea.getBoundingClientRect();
            const maxScroll = rect.height;

            let progress = window.scrollY / (maxScroll * 0.75);
            progress = Math.max(0, Math.min(1, progress));

            let rotationProgress = progress;
            const isMobile = window.innerWidth <= 768;

            const rotateX = Number((20 * rotationProgress).toFixed(2));
            const translateY = Number((-100 * rotationProgress).toFixed(2));

            let scale;
            if (isMobile) {
                scale = Number((1.0 - (0.2 * rotationProgress)).toFixed(3));
            } else {
                scale = Number((1.0 - (0.05 * rotationProgress)).toFixed(3));
            }

            heroScrollHeader.style.transform = `translateY(${translateY}px)`;
            heroScrollCard.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;

            isHeroScrolling = false;
        };

        window.addEventListener('scroll', () => {
            if (!isHeroScrolling) {
                window.requestAnimationFrame(updateHeroScrollAnimation);
                isHeroScrolling = true;
            }
        }, { passive: true });

        updateHeroScrollAnimation();
    }

    // 10. Snackbar Utility
    const snackbar = document.getElementById('snackbar');
    const snackbarMessage = document.getElementById('snackbar-message');
    const snackbarIcon = document.getElementById('snackbar-icon');
    let snackbarTimeout;

    const showSnackbar = (message, type = 'success') => {
        if (!snackbar || !snackbarMessage || !snackbarIcon) return;

        // Clear existing timeout
        if (snackbarTimeout) clearTimeout(snackbarTimeout);

        // Set message
        snackbarMessage.textContent = message;

        // Set styles based on type
        if (type === 'success') {
            snackbarIcon.innerHTML = '<i class="ph-fill ph-check-circle text-green-500"></i>';
        } else if (type === 'error') {
            snackbarIcon.innerHTML = '<i class="ph-fill ph-warning-circle text-red-500"></i>';
        }

        // Show snackbar
        snackbar.classList.add('show');

        // Hide after 4 seconds
        snackbarTimeout = setTimeout(() => {
            snackbar.classList.remove('show');
        }, 4000);
    };
});
