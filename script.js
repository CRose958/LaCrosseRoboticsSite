document.addEventListener('DOMContentLoaded', () => {
    // --- Calendar Grid Logic ---
    const calendarTitle = document.getElementById('calendar-title');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    // Only run calendar logic if all required elements exist
    if (calendarTitle && calendarDays && prevMonthBtn && nextMonthBtn) {
        // Current date - Set to January 2026 to show our events
        let currentDate = new Date(2026, 0, 1); // January 2026 (months are 0-based)

        function renderCalendar() {
            // Clear previous days
            calendarDays.innerHTML = '';

            // Set calendar title
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            calendarTitle.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

            // Get first day of month and number of days
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            // Previous month days
            const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

            // Calculate number of days for next month grid
            const totalCells = 42; // 6 rows x 7 columns
            const daysInNextMonthGrid = totalCells - (daysInMonth + startingDayOfWeek);

            // Add previous month days
            for (let i = 0; i < startingDayOfWeek; i++) {
                createDayElement(prevMonthLastDay - startingDayOfWeek + i + 1, 'other-month', []);
            }

            // Add current month days
            const today = new Date();
            for (let i = 1; i <= daysInMonth; i++) {
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                const dateKey = `${dayDate.getFullYear()}-${dayDate.getMonth()+1}-${dayDate.getDate()}`;
                const dayEvents = [];
                if (window.sampleEvents[dateKey]) {
                    dayEvents.push(window.sampleEvents[dateKey]);
                }
                let dayClass = 'calendar-day';
                if (i === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear()) {
                    dayClass += ' today';
                }
                createDayElement(i, dayClass, dayEvents, dateKey);
            }

            // Add next month days
            for (let i = 1; i <= daysInNextMonthGrid; i++) {
                createDayElement(i, 'other-month', []);
            }
        }

        function createDayElement(day, dayClass, events, dateKey) {
            const dayDiv = document.createElement('div');
            dayDiv.className = dayClass;
            if (dateKey) dayDiv.setAttribute('data-date', dateKey);
            const numDiv = document.createElement('div');
            numDiv.className = 'calendar-day-number';
            numDiv.textContent = day;
            dayDiv.appendChild(numDiv);
            // Add event marker if there are events
            if (events && events.length > 0) {
                const marker = document.createElement('div');
                marker.className = 'calendar-event-markers';
                marker.innerHTML = '<span class="event-dot robotics"></span>';
                dayDiv.appendChild(marker);
            }
            calendarDays.appendChild(dayDiv);
        }

        // Month navigation
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        // Initial render
        renderCalendar();
    }
            // Sample events data - dates that exist in January 2026
            window.sampleEvents = {
                '2026-1-13': { category: 'Robotics' },
                '2026-1-15': { category: 'Robotics' },
                '2026-1-20': { category: 'Robotics' },
                '2026-1-22': { category: 'Robotics' },
                '2026-1-27': { category: 'Robotics' },
                '2026-1-29': { category: 'Robotics' },
                '2026-2-3': { category: 'Robotics' },
                '2026-2-5': { category: 'Robotics' },
                '2026-2-10': { category: 'Robotics' },
                '2026-2-12': { category: 'Robotics' },
                '2026-2-17': { category: 'Robotics' },
                '2026-2-19': { category: 'Robotics' },
                '2026-2-24': { category: 'Robotics' },
                '2026-2-26': { category: 'Robotics' },
                '2026-3-3': { category: 'Robotics' },
                '2026-3-5': { category: 'Robotics' },
                '2026-3-10': { category: 'Robotics' },
                '2026-3-12': { category: 'Robotics' },
                '2026-3-17': { category: 'Robotics' },
                '2026-3-19': { category: 'Robotics' },
                '2026-3-20': { category: 'FIRST' },
                '2026-3-21': { category: 'FIRST' },
                '2026-3-22': { category: 'FIRST' },
                '2026-3-24': { category: 'Robotics' },
                '2026-3-26': { category: 'Robotics' },
                '2026-3-31': { category: 'Robotics' },
                '2026-4-2': { category: 'Robotics' },
                '2026-4-7': { category: 'Robotics' },
                '2026-4-9': { category: 'Robotics' },
                '2026-4-14': { category: 'Robotics' },
                '2026-4-16': { category: 'Robotics' },
                '2026-4-21': { category: 'Robotics' },
                '2026-4-23': { category: 'Robotics' },
                '2026-4-28': { category: 'Robotics' },
                '2026-4-30': { category: 'Robotics' },
                '2026-5-5': { category: 'Robotics' },
                '2026-5-7': { category: 'Robotics' },
                '2026-5-12': { category: 'Robotics' },
                '2026-5-14': { category: 'Robotics' },
                '2026-5-19': { category: 'Robotics' },
                '2026-5-21': { category: 'Robotics' },
                '2026-5-26': { category: 'Robotics' },
                '2026-5-28': { category: 'Robotics' },
            };
        // --- CardNav-inspired Event Navigation ---
        function buildCardNavEvents() {
            const cardnavTabs = document.getElementById('cardnav-tabs');
            const cardnavList = document.getElementById('cardnav-list');
            if (!cardnavTabs || !cardnavList) return;

            // Gather all events and sort by date
            let allEvents = [];
            for (const [date, event] of Object.entries(window.sampleEvents)) {
                if (Array.isArray(event)) {
                    event.forEach(e => allEvents.push({date, event: e}));
                } else {
                    allEvents.push({date, event});
                }
            }
            allEvents.sort((a, b) => {
                const [ay, am, ad] = a.date.split('-').map(Number);
                const [by, bm, bd] = b.date.split('-').map(Number);
                return new Date(ay, am-1, ad) - new Date(by, bm-1, bd);
            });

            // Group events by month and meeting type
            const months = {};
            allEvents.forEach(({date, event}) => {
                const d = new Date(date);
                const monthKey = `${d.getFullYear()}-${d.getMonth()+1}`;
                if (!months[monthKey]) months[monthKey] = [];
                months[monthKey].push({date, event});
            });

            // Build tabs for each month
            cardnavTabs.innerHTML = '';
            const monthKeys = Object.keys(months).sort();
            monthKeys.forEach((monthKey, idx) => {
                const d = new Date(monthKey + '-01');
                const tab = document.createElement('button');
                tab.className = 'cardnav-tab' + (idx === 0 ? ' active' : '');
                tab.textContent = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                tab.setAttribute('data-month', monthKey);
                cardnavTabs.appendChild(tab);
            });

            // Render events for selected month
            function renderMonthEvents(monthKey) {
                cardnavList.innerHTML = '';
                // Group by meeting type
                const meetings = {};
                months[monthKey].forEach(({date, event}) => {
                    const type = event.category || 'Meeting';
                    if (!meetings[type]) meetings[type] = [];
                    meetings[type].push({date, event});
                });
                Object.keys(meetings).forEach(type => {
                    // Meeting type header
                    const typeHeader = document.createElement('div');
                    typeHeader.className = 'cardnav-type-header';
                    typeHeader.textContent = type === 'FIRST' ? 'FIRST Events' : (type === 'Robotics' ? 'Robotics Meetings' : 'Team Meetings');
                    cardnavList.appendChild(typeHeader);
                    // Cards
                    meetings[type].forEach(({date, event}) => {
                        const card = document.createElement('div');
                        card.className = 'cardnav-card';
                        // Date
                        const d = new Date(date);
                        const dateDiv = document.createElement('div');
                        dateDiv.className = 'cardnav-date';
                        dateDiv.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        card.appendChild(dateDiv);
                        // Title
                        const titleDiv = document.createElement('div');
                        titleDiv.className = 'cardnav-title';
                        titleDiv.textContent = event.title || (type === 'FIRST' ? 'FIRST Competition' : 'Team Meeting');
                        card.appendChild(titleDiv);
                        // Time
                        const timeDiv = document.createElement('div');
                        timeDiv.className = 'cardnav-time';
                        timeDiv.textContent = event.time || (type === 'FIRST' ? 'All Day' : '4:00 PM - 8:00 PM');
                        card.appendChild(timeDiv);
                        // Location
                        const locDiv = document.createElement('div');
                        locDiv.className = 'cardnav-location';
                        locDiv.textContent = event.location || (type === 'FIRST' ? 'Appleton East High School' : 'Room 196 @ Logan High School');
                        card.appendChild(locDiv);
                        cardnavList.appendChild(card);
                    });
                });
            }

            // Tab click handler
            cardnavTabs.querySelectorAll('.cardnav-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    cardnavTabs.querySelectorAll('.cardnav-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    renderMonthEvents(tab.getAttribute('data-month'));
                });
            });
            // Initial render
            if (monthKeys.length > 0) renderMonthEvents(monthKeys[0]);
        }

        // Run CardNav event builder
        buildCardNavEvents();
    // --- 1. CONFIGURATION: IMAGE GALLERIES ---
    const ACCOUNT_HASH = "CaN6tPHwuX-NOcXEjJG0lg";

    // LIST A: MAIN GALLERY IDs (Current Year / Competition)
    const galleryImageIds = [
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

    // LIST B: ARCHIVE IDs (Past Years)
    // REPLACE these IDs with your older photos when you have them!
    const archiveImageIds = [
        "5af60ec2-34f7-47a5-9894-02a327c79700",
        "95e22222-d128-43fd-7004-6f68f4fcc800",
        "1892658d-e6bd-4f2a-6774-619f11a9de00",
        "3517fcc7-6ccd-429b-dfc2-d8754579cc00"
    ];

    // --- HELPER FUNCTION TO BUILD GRIDS ---
    function buildGrid(containerId, ids, itemClass) {
        const container = document.getElementById(containerId);
        if (container) {
            ids.forEach(id => {
                const div = document.createElement('div');
                div.className = itemClass; // e.g. 'gallery-item' or 'archive-item'

                const img = document.createElement('img');
                img.src = `https://imagedelivery.net/${ACCOUNT_HASH}/${id}/public`;
                img.loading = 'lazy';
                img.alt = 'Team Photo';

                div.appendChild(img);
                container.appendChild(div);
            });
        }
    }

    // --- GENERATE THE GALLERIES ---
    buildGrid('gallery-container', galleryImageIds, 'gallery-item');
    buildGrid('archive-container', archiveImageIds, 'archive-item');


    // --- 2. GOOEY NAV ANIMATION ---
    const navList = document.querySelector('.nav-list');
    const navItems = document.querySelectorAll('.nav-list li');
    
    function updateGooeyNav(targetItem) {
        const item = targetItem || document.querySelector('.nav-list li.active');
        if (item && navList) {
            const itemRect = item.getBoundingClientRect();
            const navRect = navList.getBoundingClientRect();
            
            // Calculate position relative to nav container
            let left = itemRect.left - navRect.left;
            let width = itemRect.width;
            const height = itemRect.height;
            
            // Constrain to stay within nav bounds (accounting for padding)
            const padding = 8;
            const maxLeft = navRect.width - width - padding;
            left = Math.max(padding, Math.min(left, maxLeft));
            
            // Use CSS custom properties to animate the blob
            navList.style.setProperty('--blob-left', `${left}px`);
            navList.style.setProperty('--blob-width', `${width}px`);
            navList.style.setProperty('--blob-height', `${height}px`);
            
            // Mark as initialized to show the blob
            if (!navList.classList.contains('initialized')) {
                navList.classList.add('initialized');
            }
        }
    }

    // Set active state based on current page
    if (navList && navItems.length > 0) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let foundActive = false;
        
        // Clear any existing active classes first
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        navItems.forEach(item => {
            const link = item.querySelector('a');
            const href = link.getAttribute('href');
            
            // More robust matching - check both with and without .html
            const pageName = currentPage.replace('.html', '');
            const linkName = href.replace('.html', '');
            
            if (href === currentPage || 
                linkName === pageName ||
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                item.classList.add('active');
                foundActive = true;
            }
        });

        // If no active found, activate first item
        if (!foundActive && navItems.length > 0) {
            navItems[0].classList.add('active');
        }

        // Initialize gooey nav position with multiple attempts to ensure fonts/layout loaded
        requestAnimationFrame(() => {
            const activeItem = document.querySelector('.nav-list li.active');
            if (activeItem) {
                updateGooeyNav(activeItem);
            }
            setTimeout(() => {
                const activeItem = document.querySelector('.nav-list li.active');
                if (activeItem) updateGooeyNav(activeItem);
            }, 100);
            setTimeout(() => {
                const activeItem = document.querySelector('.nav-list li.active');
                if (activeItem) updateGooeyNav(activeItem);
            }, 300);
        });

        // Add hover effect - temporarily move blob
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                updateGooeyNav(item);
            });
        });

        // Return blob to active page when mouse leaves entire nav
        navList.addEventListener('mouseleave', () => {
            // Small delay to ensure smooth transition back
            setTimeout(() => {
                const activeItem = document.querySelector('.nav-list li.active');
                if (activeItem) {
                    updateGooeyNav(activeItem);
                }
            }, 50);
        });

        // Update on window resize
        window.addEventListener('resize', () => {
            const activeItem = document.querySelector('.nav-list li.active');
            if (activeItem) {
                updateGooeyNav(activeItem);
            }
        });
    }


    // --- 3. MOBILE MENU TOGGLE ---
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // --- 3. SCROLL ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));


    // --- 4. NUMBER COUNTER ANIMATION ---
    const statsSection = document.querySelector('.stats-banner');
    let statsAnimated = false;

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
        const speed = 200;
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

    // --- 5. LIGHTBOX FUNCTIONALITY (UPDATED FOR BOTH GALLERIES) ---
    const modal = document.getElementById("lightbox");

    if (modal) {
        const modalImg = document.getElementById("lightbox-img");
        const closeBtn = document.querySelector(".close-btn");
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");

        // SELECT ALL IMAGES (Both Main Gallery AND Archive)
        // This effectively creates one big slideshow of everything on the page
        // Use a short timeout to ensure the grid is built before selecting images
        setTimeout(() => {
            const images = Array.from(document.querySelectorAll(".gallery-item img, .archive-item img"));
            let currentIndex = 0;

            function openLightbox(index) {
                modal.style.display = "block";
                modalImg.src = images[index].src;
                currentIndex = index;
                document.body.style.overflow = 'hidden';
            }

            function closeLightbox() {
                modal.style.display = "none";
                document.body.style.overflow = 'auto';
            }

            function showNext() {
                currentIndex = (currentIndex + 1) % images.length;
                modalImg.src = images[currentIndex].src;
            }

            function showPrev() {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                modalImg.src = images[currentIndex].src;
            }

            // Add Click Events
            images.forEach((img, index) => {
                img.addEventListener('click', () => openLightbox(index));
            });

            closeBtn.addEventListener('click', closeLightbox);

            modal.addEventListener('click', function (e) {
                if (e.target === modal || e.target.classList.contains('lightbox-content-wrapper')) {
                    closeLightbox();
                }
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showNext();
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrev();
            });

            document.addEventListener('keydown', function (e) {
                if (modal.style.display === "block") {
                    if (e.key === "ArrowLeft") {
                        showPrev();
                    } else if (e.key === "ArrowRight") {
                        showNext();
                    } else if (e.key === "Escape") {
                        closeLightbox();
                    }
                }
            });
        }, 100); // Small delay to ensure DOM is ready

        // --- POPUP LOGIC (merged) ---
        const popupOverlay = document.getElementById('popup-overlay');
        const popupCloseBtn = document.getElementById('popup-close-btn');

        if (popupOverlay && popupCloseBtn) {
            popupCloseBtn.addEventListener('click', () => {
                popupOverlay.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === popupOverlay) {
                    popupOverlay.style.display = 'none';
                }
            });
        }
    }

    // --- CLICK SPARK ANIMATION ---
    // Configuration
    const sparkConfig = {
        sparkColor: '#8f2b40', // Match primary color
        sparkSize: 25,
        sparkRadius: 40,
        sparkCount: 8,
        duration: 400,
        easing: 'ease-out',
        extraScale: 1
    };

    function createClickSpark(x, y) {
        const sparkContainer = document.createElement('div');
        sparkContainer.className = 'spark-container';
        sparkContainer.style.left = `${x}px`;
        sparkContainer.style.top = `${y}px`;
        document.body.appendChild(sparkContainer);

        // Create multiple spark lines
        for (let i = 0; i < sparkConfig.sparkCount; i++) {
            const angle = (360 / sparkConfig.sparkCount) * i;
            const spark = document.createElement('div');
            spark.className = 'spark';
            
            // Set CSS custom properties for each spark
            spark.style.setProperty('--angle', `${angle}deg`);
            spark.style.setProperty('--spark-color', sparkConfig.sparkColor);
            spark.style.setProperty('--spark-size', `${sparkConfig.sparkSize}px`);
            spark.style.setProperty('--spark-radius', `${sparkConfig.sparkRadius * sparkConfig.extraScale}px`);
            spark.style.setProperty('--duration', `${sparkConfig.duration}ms`);
            spark.style.setProperty('--easing', sparkConfig.easing);
            
            sparkContainer.appendChild(spark);
        }

        // Remove spark container after animation completes
        setTimeout(() => {
            sparkContainer.remove();
        }, sparkConfig.duration);
    }

    // Add click event listener to document
    document.addEventListener('click', (e) => {
        createClickSpark(e.clientX, e.clientY);
    });
});
