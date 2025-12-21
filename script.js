document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURATION: IMAGE GALLERY ---
    // Your Cloudflare Account Hash (This is constant for all your images)
    const ACCOUNT_HASH = "CaN6tPHwuX-NOcXEjJG0lg"; 
    
    // LIST OF IMAGE IDs: Add new IDs here to update the gallery!
    const imageIds = [
        "bbee9c6b-d0e7-41cb-fb05-bf5ca781e500",
        "6cf892f3-a7c5-46ec-2ecf-40b7565da400",
        "ef6dd922-b884-4a58-be66-37265ae70200",
        "29968b1a-d617-42a3-d408-04b7af92ef00",
        "e56aadae-b6c3-4108-81b3-49d7834c5d00",
        "d5eb62e3-f3f9-432d-b412-a8d7ef334200",
        "f868db75-aca6-4d41-4449-b1a93cc87400",
        "cdaa5d0a-5fb7-48c0-2c8a-8a87a76fb100",
        "d7f11bc4-ea3e-4d7f-3ab1-7823dcdf7000",
        "4d70b1fa-5e31-400a-49e6-960a0d946c00",
        "2958ba77-590f-4ac1-a041-401776211800",
        "a4de9c35-16bb-4949-3f75-a08282adf800",
        "552c3898-b1fe-452c-04e7-a131b84e7c00",
        "dce2bf84-5795-4a2a-66f6-94fc6a926200",
        "35123e97-ec69-4433-58b6-2830a886a600"
       
    ];

    // --- GENERATE GALLERY HTML ---
    const galleryContainer = document.getElementById('gallery-container');
    
    // Only run this logic if the container exists (i.e., we are on the Photos page)
    if (galleryContainer) {
        imageIds.forEach(id => {
            // Create the wrapper div
            const div = document.createElement('div');
            div.className = 'gallery-item';
            
            // Create the img element
            const img = document.createElement('img');
            // Construct the Cloudflare URL automatically
            img.src = `https://imagedelivery.net/${ACCOUNT_HASH}/${id}/public`;
            img.loading = 'lazy';
            img.alt = 'Team Photo'; 
            
            // Put image inside div, and div inside container
            div.appendChild(img);
            galleryContainer.appendChild(div);
        });
    }

    // --- 2. MOBILE MENU TOGGLE ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    if(mobileMenu){
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // --- 3. SCROLL ANIMATIONS (FADE IN) ---
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


    // --- 4. NUMBER COUNTER ANIMATION ---
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

    // --- 5. LIGHTBOX GALLERY FUNCTIONALITY ---
    const modal = document.getElementById("lightbox");
    
    // Check if lightbox exists on this page
    if (modal) {
        const modalImg = document.getElementById("lightbox-img");
        const closeBtn = document.querySelector(".close-btn");
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");
        
        // RE-SELECT images now that JS has created them!
        const images = Array.from(document.querySelectorAll(".gallery-item img"));
        let currentIndex = 0;

        function openLightbox(index) {
            modal.style.display = "block";
            modalImg.src = images[index].src;
            currentIndex = index;
            document.body.style.overflow = 'hidden'; // Disable background scroll
        }

        function closeLightbox() {
            modal.style.display = "none";
            document.body.style.overflow = 'auto'; // Re-enable scroll
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length; // Loops to start
            modalImg.src = images[currentIndex].src;
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length; // Loops to end
            modalImg.src = images[currentIndex].src;
        }

        // Add Click Events to the newly generated images
        images.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        // Close events
        closeBtn.addEventListener('click', closeLightbox);
        
        // Close when clicking outside the image wrapper
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('lightbox-content-wrapper')) {
                 closeLightbox();
            }
        });

        // Navigation Button Clicks
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

        // Keyboard Navigation
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === "block") {
                if (e.key === "ArrowLeft") showPrev();
                else if (e.key === "ArrowRight") showNext();
                else if (e.key === "Escape") closeLightbox();
            }
        });
    }
});