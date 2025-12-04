// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Handle index bounds
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const carousel = document.querySelector('.carousel-container');

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            stopAutoSlide();
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startAutoSlide();
        }
    }

    // Start auto slide
    startAutoSlide();

    // Pause auto slide on hover
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        heroCarousel.addEventListener('mouseenter', stopAutoSlide);
        heroCarousel.addEventListener('mouseleave', startAutoSlide);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;

        // Create WhatsApp message
        let whatsappMessage = `¡Hola! Me contacto desde tu web.\n\n`;
        whatsappMessage += `*Nombre:* ${nombre}\n`;
        if (telefono) whatsappMessage += `*Teléfono:* ${telefono}\n`;
        whatsappMessage += `*Email:* ${email}\n`;
        whatsappMessage += `*Mensaje:* ${mensaje}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Open WhatsApp with the message (replace with your number)
        window.open(`https://wa.me/5491168758285?text=${encodedMessage}`, '_blank');

        // Reset form
        contactForm.reset();
        
        // Show success message
        alert('¡Gracias por tu mensaje! Te redirigimos a WhatsApp.');
    });
}

// Devices Mockup Scroll Animation - Laptop, Tablet, Phone
function initDevicesScroll() {
    const devices = [
        { 
            screen: document.querySelector('.laptop-display'), 
            screenshot: document.querySelector('.laptop-screenshot'),
            name: 'laptop',
            duration: 45
        },
        { 
            screen: document.querySelector('.tablet-screen'), 
            screenshot: document.querySelector('.tablet-screenshot'),
            name: 'tablet',
            duration: 50
        },
        { 
            screen: document.querySelector('.phone-screen'), 
            screenshot: document.querySelector('.phone-screenshot'),
            name: 'phone',
            duration: 55
        }
    ];

    devices.forEach(device => {
        if (device.screen && device.screenshot) {
            const images = device.screenshot.querySelectorAll('img');
            let imagesLoaded = 0;
            
            images.forEach(img => {
                if (img.complete) {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        setupDeviceAnimation(device);
                    }
                } else {
                    img.addEventListener('load', () => {
                        imagesLoaded++;
                        if (imagesLoaded === images.length) {
                            setupDeviceAnimation(device);
                        }
                    });
                }
            });
        }
    });

    function setupDeviceAnimation(device) {
        const screenHeight = device.screen.offsetHeight;
        const totalHeight = device.screenshot.scrollHeight;
        const scrollDistance = totalHeight - screenHeight;
        
        if (scrollDistance > 0) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ${device.name}ScrollAnimation {
                    0%, 8% { transform: translateY(0); }
                    42%, 58% { transform: translateY(-${scrollDistance}px); }
                    92%, 100% { transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
            
            device.screenshot.style.animation = `${device.name}ScrollAnimation ${device.duration}s ease-in-out infinite`;
        }
    }
}

// Initialize devices scroll after DOM is ready
initDevicesScroll();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.ventaja-card, .tip-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add staggered delay to cards
document.querySelectorAll('.ventaja-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.tip-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
});
