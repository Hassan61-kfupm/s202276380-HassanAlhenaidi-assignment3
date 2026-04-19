// script.js - Optimized and Efficient

// ============= STATE MANAGEMENT =============
class PortfolioState {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.projects = [];
        this.filterValue = 'all';
        this.sortValue = 'default';
        this.searchTerm = '';
    }

    saveTheme() {
        localStorage.setItem('theme', this.theme);
    }

    getTheme() {
        return this.theme;
    }

    setTheme(theme) {
        this.theme = theme;
        this.saveTheme();
    }
}

// ============= PROJECT DATA =============
const projectsData = [
    {
        id: 1,
        title: "LabTrack",
        description: "A comprehensive programming lab organization platform for managing student assignments and tracking progress.",
        category: "web",
        image: "assets/project1.jpg"
    },
    {
        id: 2,
        title: "Todo List",
        description: "Feature-rich task management application with add, delete, complete, and filter functionality.",
        category: "app",
        image: "assets/project2.jpg"
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "Real-time weather application showing current conditions and forecasts for any city worldwide.",
        category: "web",
        image: "assets/project3.jpg"
    },
    {
        id: 4,
        title: "Portfolio Analyzer",
        description: "Financial portfolio analysis tool with interactive charts and investment tracking.",
        category: "app",
        image: "assets/project4.jpg"
    }
];

// ============= UTILITY FUNCTIONS =============
function showToast(message, type = 'success') {
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============= THEME MANAGEMENT =============
function initTheme() {
    const state = new PortfolioState();
    const savedTheme = state.getTheme();

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    addThemeToggle();
}

function addThemeToggle() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const existingToggle = document.querySelector('.theme-toggle');
    if (existingToggle) return;

    const themeLi = document.createElement('li');
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle theme');

    themeToggle.addEventListener('click', toggleTheme);
    themeLi.appendChild(themeToggle);
    navLinks.appendChild(themeLi);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    const themeToggle = document.querySelector('.theme-toggle');

    if (themeToggle) {
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(`${isDark ? 'Dark' : 'Light'} mode activated!`, 'success');
}

// ============= DYNAMIC GREETING =============
function updateGreeting() {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;

    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) greeting = 'Good Morning!';
    else if (hour < 18) greeting = 'Good Afternoon!';
    else greeting = 'Good Evening!';

    tagline.textContent = `${greeting} Building creative web solutions`;
}

// ============= VISIT COUNTER (State Management) =============
function initVisitCounter() {
    let visitCount = localStorage.getItem('visitCount');

    if (visitCount === null) {
        visitCount = 1;
    } else {
        visitCount = parseInt(visitCount) + 1;
    }

    localStorage.setItem('visitCount', visitCount);

    const counterElement = document.getElementById('visit-counter');
    if (counterElement) {
        counterElement.textContent = `✨ You've visited ${visitCount} time${visitCount !== 1 ? 's' : ''}`;
    }
}

// ============= PROJECTS RENDERING =============
function renderProjects() {
    const filter = document.getElementById('project-filter')?.value || 'all';
    const sort = document.getElementById('project-sort')?.value || 'default';
    const searchTerm = document.getElementById('project-search')?.value.toLowerCase() || '';

    let filteredProjects = [...projectsData];

    // Apply filter
    if (filter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.category === filter);
    }

    // Apply search
    if (searchTerm) {
        filteredProjects = filteredProjects.filter(project =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply sort
    if (sort === 'name-asc') {
        filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'name-desc') {
        filteredProjects.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Render to DOM
    const container = document.getElementById('projects-grid');
    const noResultsDiv = document.getElementById('no-results');

    if (!container) return;

    if (filteredProjects.length === 0) {
        container.innerHTML = '';
        if (noResultsDiv) noResultsDiv.classList.remove('hidden');
        return;
    }

    if (noResultsDiv) noResultsDiv.classList.add('hidden');

    container.innerHTML = filteredProjects.map(project => `
        <div class="project-card" data-id="${project.id}" data-category="${project.category}">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <span class="project-badge">${project.category === 'web' ? 'Web Development' : 'Application'}</span>
        </div>
    `).join('');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============= GITHUB API INTEGRATION =============
async function fetchGitHubRepos() {
    const container = document.getElementById('github-repos');
    if (!container) return;

    try {
        // Using my GitHub username - replace with your actual GitHub username
        const response = await fetch('https://api.github.com/users/octocat/repos?per_page=6');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const repos = await response.json();

        if (repos.length === 0) {
            container.innerHTML = '<div class="error-message">No public repositories found.</div>';
            return;
        }

        container.innerHTML = repos.map(repo => `
            <div class="github-card">
                <h3>${escapeHtml(repo.name)}</h3>
                <p>${escapeHtml(repo.description || 'No description available')}</p>
                <div class="github-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>📝 ${repo.language || 'N/A'}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-link">View Repository →</a>
            </div>
        `).join('');

        showToast('GitHub repositories loaded successfully!', 'success');
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        container.innerHTML = '<div class="error-message">Unable to load GitHub repositories. Please try again later.</div>';
        showToast('Failed to load GitHub repositories', 'error');
    }
}

// ============= CONTACT FORM HANDLING =============
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (message.length < 10) {
            showFormMessage('Message must be at least 10 characters long.', 'error');
            return;
        }

        // Simulate form submission
        showFormMessage(`Thanks ${escapeHtml(name)}! I'll get back to you soon.`, 'success');
        form.reset();

        // Log to console for demonstration
        console.log('Form submitted:', { name, email, message });
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `msg-${type}`;

    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = '';
    }, 3000);
}

// ============= NAVIGATION & SMOOTH SCROLL =============
function initNavigation() {
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

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============= PROJECT CONTROLS WITH DEBOUNCE =============
function initProjectControls() {
    const searchInput = document.getElementById('project-search');
    const filterSelect = document.getElementById('project-filter');
    const sortSelect = document.getElementById('project-sort');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(renderProjects, 300));
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', renderProjects);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', renderProjects);
    }
}

// ============= LAZY LOADING OBSERVER =============
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.loading = 'lazy';
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initTheme();
    updateGreeting();
    initVisitCounter();
    initNavigation();
    initContactForm();
    initProjectControls();
    fetchGitHubRepos();
    initLazyLoading();

    // Initial render
    renderProjects();

    // Performance logging
    if (process.env.NODE_ENV !== 'production') {
        console.log('Portfolio initialized successfully');
    }
});

// ============= EXPORT FOR TESTING (if needed) =============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderProjects, showToast, escapeHtml };
}