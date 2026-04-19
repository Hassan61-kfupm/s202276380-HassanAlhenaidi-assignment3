// js/script.js - Enhanced version with all advanced features

document.addEventListener('DOMContentLoaded', function() {
    // ============ NAVIGATION & HAMBURGER MENU ============
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scroll for navigation
    const navAnchors = document.querySelectorAll('nav a');
    navAnchors.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============ STATE MANAGEMENT - THEME ============
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle theme');

    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        const themeLi = document.createElement('li');
        themeLi.appendChild(themeToggle);
        navLinksContainer.appendChild(themeLi);
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showToast(`${isDark ? 'Dark' : 'Light'} mode activated!`, 'success');
    });

    // ============ STATE MANAGEMENT - VISITOR NAME ============
    let visitorName = localStorage.getItem('visitorName');
    if (!visitorName) {
        visitorName = prompt('Welcome! What should I call you?', 'Guest');
        if (visitorName && visitorName.trim()) {
            localStorage.setItem('visitorName', visitorName.trim());
        } else {
            visitorName = 'Guest';
        }
    }
    showToast(`Welcome back, ${visitorName}! 👋`, 'success');

    // ============ COMPLEX LOGIC - SESSION TIMER ============
    let startTime = sessionStorage.getItem('sessionStart');
    if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem('sessionStart', startTime);
    }

    function updateTimer() {
        const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        const timerDisplay = document.getElementById('session-timer');
        if (timerDisplay) {
            timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
    updateTimer();
    setInterval(updateTimer, 1000);

    // ============ COMPLEX LOGIC - SKILL LEVEL SELECTOR ============
    const levelBtns = document.querySelectorAll('.level-btn');
    const skillMessage = document.getElementById('skill-message');

    const skillMessages = {
        beginner: "🌟 Great starting point! Check out my beginner-friendly projects like the Todo List app.",
        intermediate: "📚 You're at the right level! Explore my LabTrack project and Portfolio website.",
        advanced: "🚀 Awesome! Let's dive into advanced topics like API integration and state management."
    };

    levelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            levelBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const level = this.getAttribute('data-level');
            if (skillMessage) {
                skillMessage.textContent = skillMessages[level];
                skillMessage.style.background = '#3498db20';
            }
            localStorage.setItem('skillLevel', level);
        });
    });

    // Load saved skill level
    const savedLevel = localStorage.getItem('skillLevel');
    if (savedLevel) {
        const savedBtn = document.querySelector(`.level-btn[data-level="${savedLevel}"]`);
        if (savedBtn) {
            savedBtn.click();
        }
    }

    // ============ API INTEGRATION - GITHUB REPOS ============
    async function fetchGitHubRepos() {
        const githubContainer = document.getElementById('github-repos-grid');
        const loadingSpinner = document.getElementById('github-loading');
        const errorDiv = document.getElementById('github-error');

        if (!githubContainer) return;

        loadingSpinner.style.display = 'block';
        errorDiv.style.display = 'none';

        try {
            // Using a public GitHub API endpoint - replace 'yourusername' with actual GitHub username
            const response = await fetch('https://api.github.com/users/octocat/repos?per_page=6');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const repos = await response.json();
            loadingSpinner.style.display = 'none';

            if (repos.length === 0) {
                githubContainer.innerHTML = '<p class="no-results">No public repositories found.</p>';
                return;
            }

            githubContainer.innerHTML = repos.map(repo => `
                <div class="project-card">
                    <div class="project-card-content">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available.'}</p>
                        <div class="repo-stats">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                            <span><i class="fas fa-language"></i> ${repo.language || 'N/A'}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="repo-link">View on GitHub <i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            loadingSpinner.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Failed to load GitHub repositories: ${error.message}. Please try again later.`;
            console.error('GitHub API Error:', error);
        }
    }

    fetchGitHubRepos();

    // ============ API INTEGRATION - INSPIRATIONAL QUOTES ============
    async function fetchQuote() {
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');

        if (!quoteText) return;

        try {
            // Using a free quotes API
            const response = await fetch('https://api.quotable.io/random');

            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }

            const data = await response.json();
            quoteText.textContent = `"${data.content}"`;
            quoteAuthor.textContent = `— ${data.author}`;

        } catch (error) {
            console.error('Quote API Error:', error);
            quoteText.textContent = "The only limit is your imagination.";
            quoteAuthor.textContent = "— Anonymous";
        }
    }

    fetchQuote();

    const refreshQuoteBtn = document.getElementById('refresh-quote');
    if (refreshQuoteBtn) {
        refreshQuoteBtn.addEventListener('click', fetchQuote);
    }

    // ============ COMPLEX LOGIC - FILTER AND SORT PROJECTS ============
    const featuredProjectsGrid = document.getElementById('featured-projects-grid');
    let currentFilter = 'all';
    let currentSort = 'default';

    function filterAndSortProjects() {
        if (!featuredProjectsGrid) return;

        const projectCards = Array.from(document.querySelectorAll('#featured-projects-grid .project-card'));
        const searchTerm = document.getElementById('project-search')?.value.toLowerCase() || '';

        // Filter projects
        let visibleProjects = projectCards.filter(card => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';

            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);

            return matchesFilter && matchesSearch;
        });

        // Sort projects
        if (currentSort === 'name-asc') {
            visibleProjects.sort((a, b) => {
                const nameA = a.querySelector('h3')?.textContent || '';
                const nameB = b.querySelector('h3')?.textContent || '';
                return nameA.localeCompare(nameB);
            });
        } else if (currentSort === 'name-desc') {
            visibleProjects.sort((a, b) => {
                const nameA = a.querySelector('h3')?.textContent || '';
                const nameB = b.querySelector('h3')?.textContent || '';
                return nameB.localeCompare(nameA);
            });
        }

        // Update display
        projectCards.forEach(card => card.style.display = 'none');
        visibleProjects.forEach(card => card.style.display = 'block');

        // Reorder DOM elements
        visibleProjects.forEach(card => featuredProjectsGrid.appendChild(card));

        // Show/hide no results message
        const noResultsDiv = document.getElementById('no-results');
        if (noResultsDiv) {
            noResultsDiv.style.display = visibleProjects.length === 0 ? 'block' : 'none';
        }
    }

    // Filter button handlers
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            filterAndSortProjects();
        });
    });

    // Sort handler
    const sortSelect = document.getElementById('sort-projects');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            filterAndSortProjects();
        });
    }

    // Search handler
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterAndSortProjects);
    }

    // ============ CONTACT FORM WITH ADVANCED VALIDATION ============
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    function validateField(fieldId, errorId, validationFn, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(errorId);

        if (!field || !errorSpan) return true;

        const isValid = validationFn(field.value.trim());

        if (!isValid) {
            errorSpan.textContent = errorMessage;
            field.classList.add('error');
            return false;
        } else {
            errorSpan.textContent = '';
            field.classList.remove('error');
            return true;
        }
    }

    function validateName(name) {
        return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateMessage(message) {
        return message.length >= 10 && message.length <= 500;
    }

    if (contactForm) {
        // Real-time validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                validateField('name', 'name-error', validateName, 'Name must be at least 2 letters and contain only letters and spaces.');
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                validateField('email', 'email-error', validateEmail, 'Please enter a valid email address (e.g., name@example.com).');
            });
        }

        if (messageInput) {
            messageInput.addEventListener('blur', () => {
                validateField('message', 'message-error', validateMessage, 'Message must be between 10 and 500 characters.');
            });
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const isNameValid = validateField('name', 'name-error', validateName, 'Name must be at least 2 letters and contain only letters and spaces.');
            const isEmailValid = validateField('email', 'email-error', validateEmail, 'Please enter a valid email address (e.g., name@example.com).');
            const isMessageValid = validateField('message', 'message-error', validateMessage, 'Message must be between 10 and 500 characters.');

            if (isNameValid && isEmailValid && isMessageValid) {
                const name = document.getElementById('name').value.trim();
                formMessage.textContent = `Thank you ${name}! Your message has been sent successfully. I'll get back to you within 24 hours.`;
                formMessage.className = 'msg-success';
                contactForm.reset();

                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = '';
                }, 5000);
            } else {
                formMessage.textContent = 'Please fix the errors above before submitting.';
                formMessage.className = 'msg-error';
                setTimeout(() => {
                    if (formMessage.textContent === 'Please fix the errors above before submitting.') {
                        formMessage.textContent = '';
                        formMessage.className = '';
                    }
                }, 4000);
            }
        });
    }

    // ============ DYNAMIC GREETING BASED ON TIME ============
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const hour = new Date().getHours();
        let greeting;
        if (hour < 12) {
            greeting = 'Good Morning!';
        } else if (hour < 18) {
            greeting = 'Good Afternoon!';
        } else {
            greeting = 'Good Evening!';
        }
        tagline.textContent = `${greeting} I'm Hassan, building creative web solutions`;
    }

    // ============ TOAST NOTIFICATION FUNCTION ============
    function showToast(message, type) {
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ============ PERFORMANCE: LAZY LOADING FOR IMAGES ============
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});