document.addEventListener('DOMContentLoaded', function() {
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

    const navAnchors = document.querySelectorAll('nav a');

    navAnchors.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

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

    const tagline = document.querySelector('.tagline');
    const hour = new Date().getHours();

    if (hour < 12) {
        tagline.textContent = 'Good Morning! Building creative web solutions';
    } else if (hour < 18) {
        tagline.textContent = 'Good Afternoon! Building creative web solutions';
    } else {
        tagline.textContent = 'Good Evening! Building creative web solutions';
    }

    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.className = 'msg-error';
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = '';
                }, 3000);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'msg-error';
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = '';
                }, 3000);
                return;
            }

            formMessage.textContent = `Thanks ${name}! I'll get back to you soon.`;
            formMessage.className = 'msg-success';
            contactForm.reset();

            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = '';
            }, 3000);
        });
    }
});



const projectsContainer = document.querySelector('.projects-grid');
const originalProjects = [...document.querySelectorAll('.project-card')].map(card => ({
    element: card,
    title: card.querySelector('h3').textContent.toLowerCase(),
    description: card.querySelector('p').textContent.toLowerCase()
}));

let searchContainer = document.querySelector('.search-container');
if (!searchContainer) {
    searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    projectsContainer.parentNode.insertBefore(searchContainer, projectsContainer);
}

searchContainer.innerHTML = `
    <input type="text" 
           id="project-search" 
           placeholder="Search projects">
`;

const searchInput = document.getElementById('project-search');
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();

    originalProjects.forEach(project => {
        const matches = project.title.includes(searchTerm) ||
            project.description.includes(searchTerm);
        project.element.style.display = matches ? 'block' : 'none';
    });

    let noResultsMsg = document.getElementById('no-results');
    const visibleProjects = originalProjects.filter(p => p.element.style.display !== 'none');

    if (visibleProjects.length === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('p');
            noResultsMsg.id = 'no-results';
            noResultsMsg.className = 'no-results';
            noResultsMsg.textContent = 'No projects found matching your search.';
            projectsContainer.parentNode.insertBefore(noResultsMsg, projectsContainer.nextSibling);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
});