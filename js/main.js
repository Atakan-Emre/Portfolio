// Fetch GitHub repositories
async function fetchGitHubRepos() {
    try {
        const response = await fetch('https://api.github.com/users/Atakan-Emre/repos');
        const repos = await response.json();
        
        // Sort repositories by stars and update time
        const sortedRepos = repos.sort((a, b) => {
            return (b.stargazers_count - a.stargazers_count) || 
                   (new Date(b.updated_at) - new Date(a.updated_at));
        });

        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = ''; // Clear existing content

        sortedRepos.forEach(repo => {
            if (!repo.fork) { // Only show non-forked repositories
                const card = createProjectCard(repo);
                projectsContainer.appendChild(card);
            }
        });

        // Add animation classes after content is loaded
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 100);
        });

    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        document.getElementById('projects-container').innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Unable to load projects. Please try again later.</p>
            </div>
        `;
    }
}

// Create project card element
function createProjectCard(repo) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';

    const technologies = repo.topics ? repo.topics.map(topic => 
        `<span class="skill-tag">${topic}</span>`
    ).join('') : '';

    col.innerHTML = `
        <div class="project-card card h-100">
            <div class="card-body d-flex flex-column">
                <h3 class="card-title h5 mb-3">${repo.name}</h3>
                <p class="card-text flex-grow-1">${repo.description || 'No description available'}</p>
                <div class="technologies mb-3">
                    ${technologies}
                </div>
                <div class="project-stats mb-3">
                    <span class="me-3">
                        <i class="bi bi-star-fill text-warning"></i> ${repo.stargazers_count}
                    </span>
                    <span>
                        <i class="bi bi-code-slash"></i> ${repo.language || 'N/A'}
                    </span>
                </div>
                <div class="d-flex gap-2 mt-auto">
                    <a href="${repo.html_url}" target="_blank" class="btn btn-custom-black btn-sm">
                        <i class="bi bi-github me-1"></i> View Code
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="btn btn-custom-grey btn-sm">
                            <i class="bi bi-box-arrow-up-right me-1"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    return col;
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
