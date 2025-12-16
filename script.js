document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU TOGGLE ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    if(mobileMenu){
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }


    // --- 2. SCROLL ANIMATIONS (FADE IN) ---
    const observerOptions = {
        threshold: 0.1 // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));


    // --- 3. NUMBER COUNTER ANIMATION ---
    const statsSection = document.querySelector('.stats-banner');
    let statsAnimated = false; // Ensure it only runs once

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateNumbers();
                statsAnimated = true;
            }
        });
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateNumbers() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // The lower the slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // --- 4. LIGHTBOX GALLERY FUNCTIONALITY ---
    const lightbox = document.getElementById('lightbox');
    
    // Check if lightbox exists on this page before running the code
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-btn');
        // Select all images inside gallery-items
        const galleryImages = document.querySelectorAll('.gallery-item img');

        // Add click event to all gallery images
        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                // 1. Show the lightbox container
                lightbox.classList.add('active');
                // 2. Set the lightbox image source to the clicked image source
                lightboxImg.src = image.src;
                // Optional: use the alt text as a caption if you want later
                lightboxImg.alt = image.alt; 
            });
        });

        // Close Lightbox when clicking the 'X'
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        // Close Lightbox when clicking the dark background overlay
        lightbox.addEventListener('click', (e) => {
            // If the target clicked IS the background container (not the image itself)
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
});