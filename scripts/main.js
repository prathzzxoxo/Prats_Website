/**
 * Main JavaScript Orchestrator
 * Cybersecurity Portfolio Website
 * Coordinates all modules and initializes the application
 */

// Global data storage
let portfolioData = {
    skills: null,
    experience: null,
    certifications: null
};

/**
 * Initialize the application
 */
async function init() {
    try {
        // Set current year in footer
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        // Load all data first
        await loadData();

        // Initialize all modules
        if (typeof initMatrix === 'function') {
            initMatrix();
        }

        if (typeof initAnimations === 'function') {
            initAnimations();
        }

        if (typeof initGlitchEffects === 'function') {
            initGlitchEffects();
        }

        if (typeof initNavigation === 'function') {
            initNavigation();
        }

        // Detect page based on which containers exist (more reliable than pathname)
        const isExperiencePage = document.getElementById('experience-timeline') !== null;
        const isSkillsPage = document.getElementById('skills-container') !== null;
        const isBlogsPage = document.getElementById('blogs-container') !== null;
        const isIndexPage = !isExperiencePage && !isSkillsPage && !isBlogsPage;

        console.log('Page detection:', { isIndexPage, isExperiencePage, isSkillsPage, isBlogsPage });

        // Render content based on detected page
        if (isIndexPage) {
            // Home page
            console.log('Rendering index page content');
            renderHero();
            renderAbout();
            renderCertifications();
            setupContactForm();
        }

        if (isExperiencePage) {
            // Experience page
            console.log('Rendering experience page content');
            renderExperience();
        }

        if (isSkillsPage) {
            // Skills page
            console.log('Rendering skills page content');
            renderSkills();
        }

        if (isBlogsPage) {
            // Blogs page
            console.log('Rendering blogs page content');
            if (typeof initBlogLoader === 'function') {
                await initBlogLoader();
            }
        }

        console.log('Initialization complete');

        // Setup scroll animations
        setupScrollAnimations();

    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

/**
 * Load all JSON data files
 */
async function loadData() {
    try {
        const [skills, experience, certifications] = await Promise.all([
            fetch('assets/data/skills.json').then(res => {
                if (!res.ok) throw new Error('Fetch failed');
                return res.json();
            }).catch(() => null),
            fetch('assets/data/experience.json').then(res => {
                if (!res.ok) throw new Error('Fetch failed');
                return res.json();
            }).catch(() => null),
            fetch('assets/data/certifications.json').then(res => {
                if (!res.ok) throw new Error('Fetch failed');
                return res.json();
            }).catch(() => null)
        ]);

        // If any fetch fails, use inline fallback data
        if (!skills || !experience || !certifications) {
            console.warn('Using inline fallback data (file:// protocol detected)');
            loadInlineData();
            return;
        }

        portfolioData.skills = skills;
        portfolioData.experience = experience;
        portfolioData.certifications = certifications;

        console.log('✓ Data loaded successfully from files');
    } catch (error) {
        console.warn('Error loading data, using fallback:', error);
        loadInlineData();
    }
}

/**
 * Fallback inline data (for local file:// viewing)
 */
function loadInlineData() {
    portfolioData.skills = {"categories":[{"name":"SIEM Platforms","skills":[{"name":"Microsoft Sentinel","level":90,"description":"Advanced KQL queries, custom analytics rules"},{"name":"Elastic SIEM","level":85,"description":"On-premises deployment, threat hunting"},{"name":"LevelBlue USM","level":80,"description":"Unified security monitoring"}]},{"name":"EDR / Endpoint Security","skills":[{"name":"CrowdStrike Falcon","level":85,"description":"Endpoint monitoring, threat detection"},{"name":"Microsoft Defender","level":90,"description":"Advanced threat protection"},{"name":"Malwarebytes","level":80,"description":"Malware detection and remediation"},{"name":"Trend Micro","level":75,"description":"Suspicious process analysis"}]},{"name":"Email Security","skills":[{"name":"Mimecast","level":85,"description":"Email threat analysis, phishing investigation"}]},{"name":"Vulnerability Assessment & Penetration Testing","skills":[{"name":"Nessus","level":80,"description":"Vulnerability scanning"},{"name":"Burp Suite","level":75,"description":"Web application security testing"},{"name":"NMAP","level":70,"description":"Network discovery"},{"name":"Wireshark","level":70,"description":"Network traffic analysis"}]},{"name":"Security Operations","skills":[{"name":"Incident Response","level":85,"description":"Alert triage, containment"},{"name":"Threat Detection","level":85,"description":"Security alert monitoring"},{"name":"SIEM Engineering","level":80,"description":"Detection content development"},{"name":"Alert Triage","level":90,"description":"False positive reduction"},{"name":"Reporting","level":85,"description":"Weekly and monthly security reports"}]},{"name":"Programming & Scripting","skills":[{"name":"KQL","level":90,"description":"Advanced queries for Azure Sentinel"},{"name":"Python","level":70,"description":"Security automation"},{"name":"PowerShell","level":65,"description":"Windows automation"}]},{"name":"Cloud & Infrastructure","skills":[{"name":"Azure Security","level":80,"description":"Azure Sentinel, security monitoring"},{"name":"Active Directory","level":75,"description":"User account monitoring"},{"name":"System Monitoring","level":80,"description":"Server health monitoring"}]}]};

    portfolioData.experience = {"timeline":[{"id":"di-2024","company":"Digital Insights","location":"Dubai, UAE","position":"Cybersecurity Analyst L1","duration":"July 2024 - Present","current":true,"responsibilities":["Monitored, analyzed, and investigated security incidents using SIEM, EDR, and email security platforms","Performed alert triage, root cause analysis, and escalation","Collaborated with IT and security teams on incident response workflows","Managed multiple client environments with tailored detection and response","Supported SIEM onboarding and detection content development","Prepared weekly and monthly security reports for stakeholders"],"technologies":[{"name":"Microsoft Sentinel","category":"SIEM"},{"name":"Elastic SIEM","category":"SIEM"},{"name":"LevelBlue USM","category":"SIEM"},{"name":"CrowdStrike Falcon","category":"EDR"},{"name":"Microsoft Defender","category":"EDR"},{"name":"Malwarebytes","category":"EDR"},{"name":"Mimecast","category":"Email Security"}],"highlights":["Managed security for multiple high-profile clients","Reduced false positive rate through custom detection rules"]},{"id":"sol-2023","company":"Soliton Technologies","location":"India","position":"Project Engineer","duration":"June 2023 - June 2024","current":false,"responsibilities":["Performed system health monitoring including Active Directory","Monitored hardware health and system availability","Identified and escalated performance issues","Supported user-related system issues"],"technologies":[{"name":"Active Directory","category":"Infrastructure"},{"name":"Windows Server","category":"Infrastructure"},{"name":"PowerShell","category":"Scripting"}]},{"id":"sol-intern-2023","company":"Soliton Technologies","location":"India","position":"Project Engineer Intern","duration":"January - June 2023","current":false,"responsibilities":["Assisted during SIEM and EDR tool deployment","Worked with Elastic Stack for security monitoring","Handled basic security alerts","Supported incident response activities"],"technologies":[{"name":"Elastic SIEM","category":"SIEM"},{"name":"EDR Tools","category":"EDR"}]}]};

    portfolioData.certifications = {"certifications":[{"name":"CompTIA Security+","issuer":"CompTIA","issueDate":"2023","skills":["Network Security","Threat Management","Security Operations"]},{"name":"CRIBLE Certified User","issuer":"CRIBLE","issueDate":"2024","skills":["Threat Intelligence","Incident Response"]}]};

    console.log('✓ Inline data loaded');
}

/**
 * Render Hero Section
 */
function renderHero() {
    const heroText = document.getElementById('hero-text');
    if (!heroText) return;

    const lines = [
        '> Initializing security protocols...',
        '> Access granted: Prathana Mahendran',
        '> Role: Security Engineer | SIEM Specialist',
        '> Expertise: SIEM | EDR | Threat Detection | Incident Response',
        '> Status: Monitoring threats, protecting systems',
        '> Location: Dubai, UAE',
        '> Welcome to my digital fortress_'
    ];

    // Use terminal typer if available, otherwise show text immediately
    if (typeof TerminalTyper !== 'undefined') {
        const typer = new TerminalTyper(heroText, lines);
        typer.typeMultiline();
    } else {
        heroText.innerHTML = lines.map(line => `<p class="mb-2 text-gray-300">${line}</p>`).join('');
    }
}

/**
 * Render About Section
 */
function renderAbout() {
    const aboutContent = document.getElementById('about-content');
    if (!aboutContent) return;

    const aboutText = `
        <p class="mb-4 text-gray-300 leading-relaxed">Security-focused professional with hands-on experience across <span class="text-cyan-400 font-semibold">SIEM, EDR, email security, and vulnerability management</span>, supporting both cloud and on-premises security operations.</p>

        <p class="mb-4 text-gray-300 leading-relaxed">Proven ability in <span class="text-purple-400 font-semibold">incident investigation, alert triage, SIEM engineering, and content development</span>, with strong exposure to <span class="text-cyan-400">Azure Sentinel</span> and <span class="text-cyan-400">Elastic SIEM</span>.</p>

        <p class="mb-4 text-gray-300 leading-relaxed">Experienced in delivering clear <span class="text-purple-400 font-semibold">weekly and monthly security reports</span> to stakeholders and collaborating with cross-functional teams to improve <span class="text-cyan-400 font-semibold">detection coverage and response readiness</span>.</p>

        <div class="mt-6 p-4 bg-gray-800/50 border-l-4 border-cyan-500 rounded">
            <h4 class="text-purple-400 font-semibold mb-2 font-orbitron text-sm">CORE COMPETENCIES</h4>
            <p class="text-gray-300 text-sm leading-relaxed">Information management and strategy planning • Defining requirements and business processes • Exceptional time management • Strong communication skills • Dedicated self-learner continuously acquiring new skills</p>
        </div>

        <div class="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded">
            <h4 class="text-cyan-400 font-semibold mb-2 font-orbitron text-sm">EDUCATION</h4>
            <p class="text-gray-300"><span class="text-purple-400 font-semibold">Bachelor of Technology</span> in Electronics and Communication Engineering</p>
            <p class="text-gray-400 text-sm">Amrita School of Engineering, Coimbatore | 2019 - 2023</p>
        </div>

        <div class="mt-6">
            <h4 class="text-cyan-400 font-semibold mb-3 font-orbitron text-sm">LANGUAGES</h4>
            <div class="flex flex-wrap gap-3">
                <span class="px-4 py-2 bg-cyan-900/20 text-cyan-300 rounded-full text-sm border border-cyan-500/50">English (Fluent)</span>
                <span class="px-4 py-2 bg-cyan-900/20 text-cyan-300 rounded-full text-sm border border-cyan-500/50">Hindi (Fluent)</span>
                <span class="px-4 py-2 bg-cyan-900/20 text-cyan-300 rounded-full text-sm border border-cyan-500/50">Tamil (Fluent)</span>
            </div>
        </div>
    `;

    aboutContent.innerHTML = aboutText;
}

/**
 * Render Skills Section
 */
function renderSkills() {
    console.log('renderSkills called');
    const container = document.getElementById('skills-container');
    console.log('Skills container:', container);
    console.log('Skills data:', portfolioData.skills);

    if (!container) {
        console.error('Skills container not found');
        return;
    }

    if (!portfolioData.skills) {
        console.error('Skills data not loaded');
        return;
    }

    // Category icons mapping
    const categoryIcons = {
        'SIEM Platforms': '🛡️',
        'EDR/Endpoint Security': '🔒',
        'Email Security': '📧',
        'VAPT': '🔍',
        'Security Operations': '⚡',
        'Programming & Scripting': '💻',
        'Cloud & Infrastructure': '☁️'
    };

    // Tool/Tech icons and colors mapping
    const techLogos = {
        // SIEM & Security
        'Azure Sentinel': { icon: '☁️', color: 'from-blue-400 to-blue-600' },
        'Microsoft Sentinel': { icon: '☁️', color: 'from-blue-400 to-blue-600' },
        'Elastic SIEM': { icon: '🔍', color: 'from-yellow-400 to-pink-500' },
        'Wazuh': { icon: '🛡️', color: 'from-blue-500 to-cyan-400' },
        'Splunk': { icon: '📊', color: 'from-green-400 to-teal-500' },

        // EDR
        'CrowdStrike': { icon: '🦅', color: 'from-red-500 to-red-600' },
        'Microsoft Defender': { icon: '🛡️', color: 'from-blue-500 to-cyan-500' },
        'SentinelOne': { icon: '🤖', color: 'from-purple-500 to-pink-500' },

        // Email Security
        'Mimecast': { icon: '✉️', color: 'from-orange-400 to-red-500' },
        'Proofpoint': { icon: '📨', color: 'from-blue-500 to-indigo-500' },

        // Programming
        'Python': { icon: '🐍', color: 'from-blue-400 to-yellow-400' },
        'PowerShell': { icon: '⚡', color: 'from-blue-500 to-blue-700' },
        'Bash': { icon: '💻', color: 'from-green-400 to-green-600' },
        'KQL': { icon: '📝', color: 'from-cyan-400 to-blue-500' },
        'SQL': { icon: '🗄️', color: 'from-orange-400 to-red-500' },

        // Cloud
        'Azure': { icon: '☁️', color: 'from-blue-400 to-blue-600' },
        'AWS': { icon: '☁️', color: 'from-orange-400 to-yellow-500' },
        'Docker': { icon: '🐳', color: 'from-blue-400 to-cyan-500' },

        // Tools
        'Nessus': { icon: '🔍', color: 'from-red-400 to-orange-500' },
        'Qualys': { icon: '🔐', color: 'from-red-500 to-red-600' },
        'Burp Suite': { icon: '🕷️', color: 'from-orange-500 to-red-500' },
        'Wireshark': { icon: '🦈', color: 'from-blue-400 to-teal-500' },
        'MITRE ATT&CK': { icon: '🎯', color: 'from-red-500 to-purple-500' }
    };

    const getToolIcon = (skillName) => {
        const tool = techLogos[skillName];
        if (tool) {
            return `<div class="w-6 h-6 rounded-md bg-gradient-to-br ${tool.color} flex items-center justify-center text-sm flex-shrink-0">${tool.icon}</div>`;
        }
        return `<div class="w-6 h-6 rounded-md bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs flex-shrink-0">⚙️</div>`;
    };

    container.innerHTML = portfolioData.skills.categories.map((category, categoryIndex) => `
        <div class="skill-category slide-up mb-8">
            <!-- Category Header - Compact -->
            <div class="flex items-center gap-3 mb-3">
                <div class="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/40">
                    <span class="text-lg">${categoryIcons[category.name] || '⚙️'}</span>
                </div>
                <h3 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-orbitron">
                    ${category.name}
                </h3>
            </div>

            <!-- Skills Grid - Compact -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                ${category.skills.map((skill, skillIndex) => `
                    <div class="group bg-gray-900/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-gray-900/80 transition-all duration-300">
                        <!-- Skill Header - Compact with Logo -->
                        <div class="flex items-center gap-2 mb-2">
                            ${getToolIcon(skill.name)}
                            <h4 class="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors flex-1 truncate">
                                ${skill.name}
                            </h4>
                            <span class="text-xs font-bold text-purple-400 px-2 py-0.5 bg-purple-500/20 rounded-full whitespace-nowrap">
                                ${skill.level}%
                            </span>
                        </div>

                        <!-- Skill Bar - Compact -->
                        <div class="skill-bar-container bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
                            <div class="skill-bar bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style="width: 0%" data-width="${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Animate skill bars when they come into view
    setTimeout(() => animateSkillBars(), 100);
}

/**
 * Animate skill bars on scroll
 */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.width;
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

/**
 * Render Experience Timeline
 */
function renderExperience() {
    console.log('renderExperience called');
    const container = document.getElementById('experience-timeline');
    console.log('Experience container:', container);
    console.log('Experience data:', portfolioData.experience);

    if (!container) {
        console.error('Experience container not found');
        return;
    }

    if (!portfolioData.experience) {
        console.error('Experience data not loaded');
        return;
    }

    container.innerHTML = `
        <div class="timeline relative">
            ${portfolioData.experience.timeline.map((job, index) => `
                <div class="timeline-item mb-12 relative pl-8 slide-up" style="transition-delay: ${index * 0.1}s">
                    <!-- Timeline dot -->
                    <div class="timeline-dot absolute left-0 top-0 w-4 h-4 bg-cyan-500 rounded-full border-4 border-gray-950"></div>

                    <div class="timeline-content bg-gray-900/50 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 transition-all duration-300">
                        <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-cyan-400 mb-1 font-orbitron">${job.position}</h3>
                                <p class="text-purple-400 font-semibold">${job.company}</p>
                                <p class="text-gray-500 text-sm">${job.location}</p>
                            </div>
                            <div class="mt-2 md:mt-0 flex flex-col items-start md:items-end gap-2">
                                <span class="inline-block px-4 py-2 bg-cyan-900/50 text-cyan-300 rounded-full text-sm font-mono">
                                    ${job.duration}
                                </span>
                                ${job.current ? '<span class="inline-block px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs font-semibold">● CURRENT</span>' : ''}
                            </div>
                        </div>

                        ${job.description ? `<p class="text-gray-300 mb-4 italic">${job.description}</p>` : ''}

                        <div class="mb-4">
                            <h4 class="text-purple-400 font-semibold mb-2 text-sm font-orbitron">RESPONSIBILITIES:</h4>
                            <ul class="space-y-2">
                                ${job.responsibilities.map(resp => `
                                    <li class="text-gray-300 flex items-start text-sm">
                                        <span class="text-cyan-500 mr-2 mt-1">▸</span>
                                        <span>${resp}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        ${job.highlights && job.highlights.length > 0 ? `
                            <div class="mb-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                                <h4 class="text-purple-400 font-semibold mb-2 text-sm font-orbitron">KEY ACHIEVEMENTS:</h4>
                                <ul class="space-y-1">
                                    ${job.highlights.map(highlight => `
                                        <li class="text-cyan-300 flex items-start text-sm">
                                            <span class="text-yellow-500 mr-2">★</span>
                                            <span>${highlight}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}

                        <div class="mt-4">
                            <h4 class="text-cyan-400 font-semibold mb-3 text-sm font-orbitron">TECHNOLOGIES & TOOLS:</h4>
                            <div class="flex flex-wrap gap-2">
                                ${job.technologies.map(tech => `
                                    <span class="tech-badge px-3 py-1 bg-cyan-900/20 text-cyan-300 rounded-full text-xs border border-cyan-500/50 font-mono hover:bg-cyan-900/30 transition-colors">
                                        ${tech.category ? `<span class="text-purple-400">[${tech.category}]</span> ` : ''}${tech.name || tech}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render Certifications
 */
function renderCertifications() {
    const container = document.getElementById('certifications-container');
    if (!container || !portfolioData.certifications) return;

    container.innerHTML = portfolioData.certifications.certifications.map(cert => `
        <div class="cert-badge flex-1 min-w-[200px]">
            <div class="text-center">
                <div class="text-2xl mb-2">🎓</div>
                <h4 class="text-purple-400 font-semibold mb-1 text-sm font-orbitron">${cert.name}</h4>
                <p class="text-gray-400 text-xs mb-2">${cert.issuer}</p>
                ${cert.issueDate ? `<p class="text-gray-500 text-xs mb-2">Issued: ${cert.issueDate}</p>` : ''}
                ${cert.description ? `<p class="text-gray-400 text-xs mt-2">${cert.description}</p>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Setup contact form
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        // Create mailto link
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:prathanamahendran@gmail.com?subject=${subject}&body=${body}`;

        // Open mailto link
        window.location.href = mailtoLink;

        // Show success message
        showFormMessage('Opening your email client...', 'success');

        // Reset form
        setTimeout(() => {
            form.reset();
            formMessage.classList.add('hidden');
        }, 3000);
    });
}

/**
 * Show form message
 */
function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `mt-4 text-center p-3 rounded ${
        type === 'success'
            ? 'bg-green-900/50 text-green-300 border border-green-500'
            : 'bg-red-900/50 text-red-300 border border-red-500'
    }`;
    formMessage.classList.remove('hidden');
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.slide-up, .fade-in, .slide-left, .slide-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
