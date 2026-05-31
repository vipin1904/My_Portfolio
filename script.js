let clickCount = 0;
let clickTimer;

// Triple click to toggle fullscreen
document.addEventListener("click", () => {
    clickCount++;

    if (clickCount === 1) {
        clickTimer = setTimeout(() => (clickCount = 0), 500);
    }

    if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;

        const elem = document.documentElement;

        if (!document.fullscreenElement) {
            elem.requestFullscreen?.() ||
                elem.webkitRequestFullscreen?.() ||
                elem.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() ||
                document.webkitExitFullscreen?.() ||
                document.msExitFullscreen?.();
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Dark mode toggle
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle?.querySelector("i");

    if (themeToggle && themeIcon) {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            themeIcon.className = "fa-solid fa-sun";
        } else {
            themeIcon.className = "fa-solid fa-moon";
        }

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }

    // Mobile navigation menu
    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");
    const icon = menuIcon?.querySelector("i");

    if (menuIcon && navbar && icon) {
        menuIcon.onclick = () => {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
            navbar.classList.toggle("active");
        };
    }

    // Hero text typing animation
    if (document.querySelector(".typing-text")) {
        new Typed(".typing-text", {
            strings: [
                "B.Tech Computer Science Student",
                "Systems Programmer",
                "Full-Stack Web Developer",
                "AI & NLP Data Pipeline Builder"
            ],
            typeSpeed: 60,
            backSpeed: 40,
            loop: true,
            showCursor: true,
            cursorChar: "|"
        });
    }

    // Scroll animations observer
    const scrollObserver = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        }),
        { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll")
        .forEach(el => scrollObserver.observe(el));

    // Sticky header
    const header = document.querySelector("header");
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:50px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;";
    document.body.prepend(sentinel);

    const headerObserver = new IntersectionObserver((entries) => {
        header?.classList.toggle("sticky", !entries[0].isIntersecting);
    });

    headerObserver.observe(sentinel);

    // Project category filters
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                if (card.classList.contains('more-projects')) return;
                
                const match = filterValue === "all" ||
                    card.getAttribute("data-category") === filterValue;

                card.classList.toggle("show", match);
                card.classList.toggle("hide", !match);
            });
        });
    });

    // Load more projects on mobile
    const loadMoreBtn = document.querySelector(".load-more-btn");

    if (loadMoreBtn) {
        const itemsToShow = 3;
        const allCards = [...document.querySelectorAll(".project-card")].filter(c => !c.classList.contains('more-projects'));

        if (window.innerWidth <= 768 && allCards.length > itemsToShow) {
            allCards.slice(itemsToShow).forEach(card => {
                card.classList.add("mobile-hidden");
                card.style.display = "none";
            });
        }

        loadMoreBtn.addEventListener("click", () => {
            document.querySelectorAll(".mobile-hidden").forEach(card => {
                card.classList.remove("mobile-hidden");
                card.style.display = "flex";
                card.classList.add("animate-visible");
            });

            loadMoreBtn.style.display = "none";
        });
    }

    // EmailJS keys and initialization
    const EMAILJS_PUBLIC_KEY  = "QdPHznZHEMKdV87vw";
    const EMAILJS_SERVICE_ID  = "service_byr3mli";
    const EMAILJS_TEMPLATE_ID = "template_gpeai2r";

    if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const form      = document.getElementById("contact-form");
    const result    = document.getElementById("form-result");
    const submitBtn = document.getElementById("submit-btn");
    const btnText   = document.getElementById("btn-text");

    function getBtnIcon() { return document.getElementById("btn-icon"); }

    function showResult(type, icon, message) {
        result.className = `${type} visible`;
        result.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setTimeout(() => {
            result.className = "";
            result.innerHTML = "";
        }, 7000);
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = "Sending…";
            getBtnIcon().outerHTML = `<span class="spinner" id="btn-icon"></span>`;
        } else {
            btnText.textContent = "Send Message";
            getBtnIcon().outerHTML = `<i class="fa-solid fa-paper-plane" id="btn-icon"></i>`;
        }
    }

    if (form && result && submitBtn) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name    = document.getElementById("form-name")?.value.trim();
            const email   = document.getElementById("form-email")?.value.trim();
            const subject = document.getElementById("form-subject")?.value.trim();
            const message = document.getElementById("form-message")?.value.trim();

            if (!name || !email || !message) {
                showResult("error", "fa-triangle-exclamation", "Please fill in all required fields.");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showResult("error", "fa-triangle-exclamation", "Please enter a valid email address.");
                return;
            }

            if (typeof emailjs === "undefined" || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
                showResult(
                    "error",
                    "fa-circle-xmark",
                    "Email service not configured yet. Please email: vp755523900@gmail.com"
                );
                return;
            }

            setLoading(true);

            try {
                const now = new Date();
                const timeString = now.toLocaleString("en-IN", {
                    dateStyle: "medium", timeStyle: "short"
                });

                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    name:     name,
                    email:    email,
                    reply_to: email,
                    subject:  subject || "Portfolio Inquiry",
                    message:  message,
                    time:     timeString
                });

                showResult(
                    "success",
                    "fa-circle-check",
                    `Thanks ${name}! 🎉 Your message was sent. I'll reply to ${email} shortly.`
                );
                form.reset();

            } catch (error) {
                console.error("EmailJS error:", error);
                showResult(
                    "error",
                    "fa-circle-xmark",
                    "Message couldn't be sent right now. Please email me at vp755523900@gmail.com"
                );
            } finally {
                setLoading(false);
            }
        });
    }

    // Credentials & Certificates Viewer
    const certificates = [
        { 
            title: "AWS Skill Builder - Cloud Foundations", 
            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23111827'/><text x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%238b5cf6' font-family='Outfit, sans-serif' font-size='22' font-weight='bold'>AWS SKILL BUILDER</text><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%23f3f4f6' font-family='Inter, sans-serif' font-size='15'>Cloud Foundations</text><text x='50%25' y='70%25' dominant-baseline='middle' text-anchor='middle' fill='%2306b6d4' font-family='Inter, sans-serif' font-size='12'>Credential Completed</text></svg>" 
        },
        { 
            title: "AWS Skill Builder - Generative AI", 
            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23111827'/><text x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%238b5cf6' font-family='Outfit, sans-serif' font-size='22' font-weight='bold'>AWS SKILL BUILDER</text><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%23f3f4f6' font-family='Inter, sans-serif' font-size='15'>Generative AI Concepts</text><text x='50%25' y='70%25' dominant-baseline='middle' text-anchor='middle' fill='%2306b6d4' font-family='Inter, sans-serif' font-size='12'>Credential Completed</text></svg>" 
        },
        { 
            title: "LeetCode 500+ DSA Solved", 
            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23111827'/><text x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffa116' font-family='Outfit, sans-serif' font-size='24' font-weight='bold'>LEETCODE ALGORITHMS</text><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%23f3f4f6' font-family='Inter, sans-serif' font-size='16'>500+ DSA Problems Solved</text><text x='50%25' y='70%25' dominant-baseline='middle' text-anchor='middle' fill='%2306b6d4' font-family='Inter, sans-serif' font-size='12'>Competitive Programming</text></svg>" 
        },
        { 
            title: "GEHU Graphethon software solution", 
            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23111827'/><text x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%238b5cf6' font-family='Outfit, sans-serif' font-size='22' font-weight='bold'>GRAPHETHON HACKATHON</text><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%23f3f4f6' font-family='Inter, sans-serif' font-size='14'>Real-world Software Builder</text><text x='50%25' y='70%25' dominant-baseline='middle' text-anchor='middle' fill='%2306b6d4' font-family='Inter, sans-serif' font-size='12'>Graphic Era Hill University</text></svg>" 
        }
    ];

    const mainview = document.querySelector(".main-view img");
    const certificatesmall = document.querySelector(".certificates-small");

    if (certificatesmall && mainview) {
        certificatesmall.innerHTML = "";

        certificates.forEach(certificate => {
            const card = document.createElement("div");
            card.classList.add("certificate-card");

            const img = document.createElement("img");
            img.src = certificate.src;
            img.alt = certificate.title;
            img.title = certificate.title;

            card.appendChild(img);
            certificatesmall.appendChild(card);

            card.addEventListener("click", () => {
                mainview.src = certificate.src;
                mainview.alt = certificate.title;
            });
        });

        // Load initial certificate
        mainview.src = certificates[0].src;
        mainview.alt = certificates[0].title;
    }

    // Zoom modal for certificates
    let zoomModal = document.querySelector(".certificate-zoom-modal");

    if (!zoomModal) {
        zoomModal = document.createElement("div");
        zoomModal.className = "certificate-zoom-modal";
        zoomModal.innerHTML = `<img src="">`;
        document.body.appendChild(zoomModal);
    }

    document.addEventListener("click", e => {
        if (e.target.closest(".certificate-card img") || e.target.closest(".main-view img")) {
            zoomModal.querySelector("img").src = e.target.src;
            zoomModal.classList.add("active");
        } else if (e.target === zoomModal) {
            zoomModal.classList.remove("active");
        }
    });

    // Circular progress skill bar animation
    const progressBars = document.querySelectorAll(".progress");

    if (progressBars.length > 0) {
        const skillObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const progress = entry.target;
                if (progress.classList.contains("animated")) return;

                progress.classList.add("animated");

                const targetValue = parseInt(progress.getAttribute("data-value")) || 0;
                const numberText = progress.querySelector("h3");

                let current = 0;
                const duration = 1200;
                const intervalTime = 16;
                const steps = duration / intervalTime;
                const increment = targetValue / steps;

                const interval = setInterval(() => {
                    current += increment;

                    if (current >= targetValue) {
                        current = targetValue;
                        clearInterval(interval);
                    }

                    const isDarkMode = document.body.classList.contains("dark-mode");
                    const trackColor = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
                    progress.style.background = `conic-gradient(var(--clr) ${current * 3.6}deg, ${trackColor} 0deg)`;
                    if (numberText) {
                        numberText.innerHTML = `${Math.round(current)}<span>%</span>`;
                    }
                }, intervalTime);

                skillObserver.unobserve(progress);
            });
        }, { threshold: 0.1 });

        progressBars.forEach(bar => skillObserver.observe(bar));
    }
});
