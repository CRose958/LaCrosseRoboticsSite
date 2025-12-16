document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MOBILE MENU TOGGLE (Runs on all pages)
       ========================================= */
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
            
            // Optional: Animate hamburger bars to an X
            // You can add a .toggle class in CSS to rotate bars if desired
            mobileMenu.classList.toggle('toggle');
        });
    }


    /* =========================================
       2. STATS COUNTER (Home Page Only)
       ========================================= */
    const counters = document.querySelectorAll('.counter');
    
    // Only run this if we actually found counters on the page
    if (counters.length > 0) {
        
        const speed = 200; // Base speed divisor

        const observerOptions = {
            threshold: 0.5 // Start animation when 50% of the section is visible
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        
                        // Calculate step size
                        let inc = target / speed;

                        // SPECIAL RULE: For small numbers (like 3), force increment to be 1
                        if (target < 20) {
                            inc = 1; 
                        }

                        if (count < target) {
                            // Determine delay: slow for small numbers, fast for big numbers
                            let timeDelay = (target < 20) ? 600 : 10; 

                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, timeDelay);
                        } else {
                            counter.innerText = target;
                        }
                    };

                    updateCount();
                    observer.unobserve(counter); // Run only once
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            statsObserver.observe(counter);
        });
    }


    /* =========================================
       3. GALLERY LIGHTBOX (Photos Page Only)
       ========================================= */
    const lightbox = document.getElementById("lightbox");
    
    // Only run if the lightbox exists on this page
    if (lightbox) {
        const lightboxImg = document.getElementById("lightbox-img");
        const closeBtn = document.querySelector(".close-btn");
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");
        
        // Grab all images inside the gallery grid
        const images = Array.from(document.querySelectorAll(".gallery-item img"));
        let currentIndex = 0;

        // --- Functions ---
        
        function openLightbox(index) {
            lightbox.style.display = "block";
            lightboxImg.src = images[index].src;
            currentIndex = index;
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        }

        function closeLightbox() {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto'; // Restore background scrolling
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length; // Loop back to start
            
            // Add a quick fade effect
            lightboxImg.style.opacity = 0;
            setTimeout(() => {
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.style.opacity = 1;
            }, 100);
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop to end
            
            // Add a quick fade effect
            lightboxImg.style.opacity = 0;
            setTimeout(() => {
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.style.opacity = 1;
            }, 100);
        }

        // --- Event Listeners ---

        // 1. Click on grid images to open
        images.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        // 2. Click X button to close
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        // 3. Click outside image (on black background) to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                closeLightbox();
            }
        });

        // 4. On-Screen Navigation Buttons
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

        // 5. Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === "block") {
                if (e.key === "ArrowLeft") showPrev();
                else if (e.key === "ArrowRight") showNext();
                else if (e.key === "Escape") closeLightbox();
            }
        });
    }

});