/**
 * Mangalam HDPE Pipes - Main Script
 * Handles Sticky Header, Carousel, Tabs, and FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Sticky Header Logic
    // ==========================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add solid background when scrolled past top
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide header on scroll down, show on scroll up (optional enhancement for UX)
        // User requested: "When user scrolls down, show a sticky header smoothly... When user scrolls up, hide the header again"
        // Interpreting this as: When scrolled past 50px, show the solid header. 
        // If they strictly meant scroll direction based hiding:
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // ==========================================
    // 2. Manufacturing Process Tabs Logic
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding tab content
            // Note: In HTML we only have 'raw-material' complete. 
            // This logic will work if other tabs are added.
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ==========================================
    // 3. Applications Carousel Logic
    // ==========================================
    const track = document.getElementById('appCarousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (track && prevBtn && nextBtn) {
        let scrollPosition = 0;
        const cardWidth = 320; // 300px card + 20px gap
        
        // Auto-scroll feature parameters
        let autoScrollInterval;
        const autoScrollDelay = 3000;

        // Function to scroll carousel
        const scrollCarousel = (direction) => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            
            if (direction === 'next') {
                scrollPosition += cardWidth;
                if (scrollPosition > maxScroll) {
                    scrollPosition = 0; // Loop back to start
                }
            } else if (direction === 'prev') {
                scrollPosition -= cardWidth;
                if (scrollPosition < 0) {
                    scrollPosition = maxScroll; // Loop to end
                }
            }
            
            track.style.transform = `translateX(-${scrollPosition}px)`;
        };

        // Event listeners for next/prev buttons
        nextBtn.addEventListener('click', () => {
            scrollCarousel('next');
            resetAutoScroll();
        });

        prevBtn.addEventListener('click', () => {
            scrollCarousel('prev');
            resetAutoScroll();
        });

        // Drag to Scroll Logic
        let isDown = false;
        let startX;
        let scrollLeftPos;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.classList.add('dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeftPos = scrollPosition;
            clearInterval(autoScrollInterval);
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.classList.remove('dragging');
            startAutoScroll();
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.classList.remove('dragging');
            startAutoScroll();
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            scrollPosition = scrollLeftPos - walk;
            
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (scrollPosition < 0) scrollPosition = 0;
            if (scrollPosition > maxScroll) scrollPosition = maxScroll;
            
            track.style.transform = `translateX(-${scrollPosition}px)`;
        });


        // Start Auto-Scroll
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                scrollCarousel('next');
            }, autoScrollDelay);
        };

        // Reset Auto-Scroll when user interacts manually
        const resetAutoScroll = () => {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        };

        // Initialize Auto-scroll
        startAutoScroll();

        // Pause auto-scroll on hover for better UX
        track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        track.addEventListener('mouseleave', startAutoScroll);
    }

    // ==========================================
    // 4. FAQ Accordion Logic
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Close all other open items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = item.classList.contains('active');
            header.setAttribute('aria-expanded', isExpanded);
        });
    });

    // ==========================================
    // 5. Mobile Menu Toggle (Optional enhancement)
    // ==========================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.backgroundColor = 'var(--bg-white)';
            nav.style.padding = '20px';
            nav.style.boxShadow = 'var(--shadow-md)';
        });
    }
});
