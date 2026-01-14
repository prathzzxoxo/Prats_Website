/**
 * Blog Loader System
 * Loads and renders markdown blog posts
 */

/**
 * Simple Markdown Parser
 * Converts markdown to HTML without dependencies
 */
class MarkdownParser {
    constructor() {
        this.rules = [];
    }

    parse(markdown) {
        let html = markdown;

        // Headers (must come before other parsing)
        html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold mt-6 mb-3 text-cyan-400 font-orbitron">$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4 text-cyan-300 font-orbitron">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-5 text-purple-400 font-orbitron">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-6 text-purple-300 font-orbitron">$1</h1>');

        // Code blocks (before inline code)
        html = html.replace(/```([\s\S]*?)```/gim, (match, code) => {
            return `<pre class="bg-gray-950/50 border border-cyan-500/30 rounded-lg p-4 overflow-x-auto my-4"><code class="text-cyan-300 text-sm">${this.escapeHtml(code.trim())}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/gim, '<code class="bg-cyan-900/20 border border-cyan-500/50 px-2 py-1 rounded text-cyan-300 text-sm font-mono">$1</code>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/gim, '<strong class="font-bold text-purple-300">$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/gim, '<em class="italic text-gray-300">$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-lg shadow-lg my-6 max-w-full" loading="lazy">');

        // Unordered lists
        html = html.replace(/^\* (.+)$/gim, '<li class="ml-6 mb-2">$1</li>');
        html = html.replace(/^- (.+)$/gim, '<li class="ml-6 mb-2">$1</li>');

        // Wrap consecutive list items
        html = html.replace(/(<li>.*<\/li>\n?)+/gs, (match) => {
            return `<ul class="list-disc my-4 text-gray-300">${match}</ul>`;
        });

        // Blockquotes
        html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-cyan-500 pl-4 italic my-4 text-gray-400">$1</blockquote>');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-700">');

        // Paragraphs (split by double newlines)
        const lines = html.split('\n\n');
        html = lines.map(line => {
            // Don't wrap if already wrapped in block-level tags
            if (line.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr|div)/)) {
                return line;
            }
            return `<p class="mb-4 leading-relaxed text-gray-300">${line}</p>`;
        }).join('\n');

        return html;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

/**
 * Blog Loader Class
 * Manages blog loading and rendering
 */
class BlogLoader {
    constructor() {
        this.parser = new MarkdownParser();
        this.blogs = [];
        this.modal = null;
    }

    async loadIndex() {
        try {
            // Get the base path (works for both root and GitHub Pages subdirectory)
            const basePath = window.location.pathname.includes('/Prats_Website/')
                ? '/Prats_Website/'
                : '/';

            const response = await fetch(`${basePath}blogs/index.json`);
            if (!response.ok) throw new Error('Fetch failed');
            const data = await response.json();
            this.blogs = data.blogs || [];
            return this.blogs;
        } catch (error) {
            console.warn('Loading blog index from inline data (file:// protocol or fetch failed):', error);
            // Inline fallback data for local viewing
            this.blogs = [
                {
                    "id": "rag-agents-soc-automation",
                    "title": "Building RAG Agents for SOC Automation",
                    "description": "A practical guide to implementing Retrieval-Augmented Generation systems for automating threat intelligence gathering and analysis in Security Operations Centers.",
                    "date": "2025-01-10",
                    "tags": ["Automation", "SOC", "RAG", "AI", "Threat Intelligence"],
                    "filename": "rag-agents-soc-automation.md",
                    "readTime": "12 min read"
                },
                {
                    "id": "ioc-sweep-grep-vs-python",
                    "title": "IOC Sweep: GREP vs Python Performance Comparison",
                    "description": "Head-to-head comparison of traditional GREP and Python for hunting indicators of compromise across large log datasets. Real-world performance results and practical recommendations.",
                    "date": "2024-12-18",
                    "tags": ["Incident Response", "Tools", "Python", "GREP", "Performance"],
                    "filename": "ioc-sweep-grep-vs-python.md",
                    "readTime": "10 min read"
                },
                {
                    "id": "home-server-infrastructure-setup",
                    "title": "Building a Home Lab: My Personal SOC Infrastructure",
                    "description": "Complete guide to building a home security operations lab with Proxmox, monitoring tools, network segmentation, and enterprise-grade security stack on consumer hardware.",
                    "date": "2024-11-05",
                    "tags": ["Home Lab", "Infrastructure", "Proxmox", "SIEM", "Networking"],
                    "filename": "home-server-infrastructure-setup.md",
                    "readTime": "15 min read"
                },
                {
                    "id": "kql-threat-hunting",
                    "title": "KQL for Threat Hunting: Advanced Queries for Security Operations",
                    "description": "Practical Kusto Query Language (KQL) techniques for threat hunting in Azure Sentinel and Microsoft security products, with real-world detection queries.",
                    "date": "2024-10-22",
                    "tags": ["KQL", "Threat Hunting", "Azure Sentinel", "SIEM", "Detection Engineering"],
                    "filename": "kql-threat-hunting.md",
                    "readTime": "11 min read"
                },
                {
                    "id": "elastic-rally-benchmarking-guide",
                    "title": "Benchmarking Elasticsearch with Rally: A Practical Guide",
                    "description": "Learn how to use Elastic Rally for performance benchmarking and optimization of Elasticsearch clusters. Includes real-world SIEM performance tuning results.",
                    "date": "2024-10-08",
                    "tags": ["Elasticsearch", "Performance", "Rally", "Benchmarking", "Optimization"],
                    "filename": "elastic-rally-benchmarking-guide.md",
                    "readTime": "14 min read"
                },
                {
                    "id": "redkey-usb-data-wiping",
                    "title": "Secure Data Wiping with RedKey Pro: A Security Engineer's Review",
                    "description": "Detailed review of the RedKey Pro USB data destroyer for secure drive sanitization. Includes performance tests, compliance considerations, and best practices.",
                    "date": "2024-09-25",
                    "tags": ["Data Security", "Hardware", "Compliance", "Data Destruction", "Tools"],
                    "filename": "redkey-usb-data-wiping.md",
                    "readTime": "13 min read"
                },
                {
                    "id": "multi-client-soc-operations",
                    "title": "Managing Security Operations Across Multiple Client Environments",
                    "description": "Strategies for operating as a security analyst in MSSP environments, managing multiple clients simultaneously while maintaining consistent security monitoring.",
                    "date": "2024-09-10",
                    "tags": ["SOC", "MSSP", "Operations", "Client Management", "Best Practices"],
                    "filename": "multi-client-soc-operations.md",
                    "readTime": "10 min read"
                }
            ];
            return this.blogs;
        }
    }

    async loadBlogContent(filename) {
        try {
            // Get the base path (works for both root and GitHub Pages subdirectory)
            const basePath = window.location.pathname.includes('/Prats_Website/')
                ? '/Prats_Website/'
                : '/';

            const response = await fetch(`${basePath}blogs/${filename}`);
            if (!response.ok) throw new Error('Fetch failed');
            const markdown = await response.text();
            return this.parser.parse(markdown);
        } catch (error) {
            console.warn(`Error loading blog ${filename}:`, error);

            // Return helpful message for local viewing
            return `
                <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                    <h3 class="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        Local Viewing Limitation
                    </h3>
                    <p class="text-gray-300 mb-4">
                        Blog content cannot be loaded when viewing locally (file:// protocol) due to browser security restrictions.
                    </p>
                    <p class="text-gray-300 mb-4">
                        <strong>To view this blog post:</strong>
                    </p>
                    <ol class="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                        <li>Navigate to <code class="bg-gray-800 px-2 py-1 rounded text-cyan-400">blogs/${filename}</code> to view the markdown file directly</li>
                        <li>Deploy to GitHub Pages to view with full functionality</li>
                        <li>Run a local web server (e.g., <code class="bg-gray-800 px-2 py-1 rounded text-cyan-400">python -m http.server</code>)</li>
                    </ol>
                    <p class="text-sm text-gray-400">
                        Once deployed to GitHub Pages at <code class="text-cyan-400">https://prathzzxoxo.github.io/Prats_Website</code>, all blog posts will load correctly.
                    </p>
                </div>
            `;
        }
    }

    renderBlogCards(container) {
        if (!container) return;

        if (this.blogs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-400 text-lg">No blog posts available yet. Check back soon!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.blogs.map(blog => `
            <div class="blog-card" data-blog-id="${blog.id}">
                <div class="flex items-start justify-between mb-4">
                    <h3 class="text-xl font-bold text-cyan-400 font-orbitron flex-1 glitch" data-text="${blog.title}">
                        ${blog.title}
                    </h3>
                </div>

                <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>📅 ${blog.date}</span>
                    ${blog.readTime ? `<span class="text-gray-600">•</span><span>⏱️ ${blog.readTime}</span>` : ''}
                </div>

                <p class="text-gray-400 mb-4 text-sm leading-relaxed">${blog.description}</p>

                <div class="flex flex-wrap gap-2 mb-4">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>

                <button class="read-more text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-2 group" data-filename="${blog.filename}" data-blog-id="${blog.id}">
                    Read More
                    <span class="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        `).join('');

        this.attachHandlers();
    }

    attachHandlers() {
        const buttons = document.querySelectorAll('.read-more');
        const isLocalFile = window.location.protocol === 'file:';

        buttons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const filename = e.currentTarget.dataset.filename;
                const blogId = e.currentTarget.dataset.blogId;
                const blogData = this.blogs.find(b => b.id === blogId);

                if (blogData) {
                    // If viewing locally via file://, open markdown in new tab
                    if (isLocalFile) {
                        window.open(`blogs/${filename}`, '_blank');
                        // Also show a helpful modal
                        this.showLocalViewingModal(blogData);
                    } else {
                        await this.openBlog(blogData);
                    }
                }
            });
        });
    }

    showLocalViewingModal(blogData) {
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-overlay" onclick="this.remove(); document.body.style.overflow = '';"></div>
            <div class="blog-modal-content" style="max-width: 600px;">
                <button class="close-modal" onclick="this.closest('.blog-modal').remove(); document.body.style.overflow = '';" aria-label="Close">
                    ×
                </button>

                <div class="p-8">
                    <div class="flex items-center gap-3 mb-4">
                        <svg class="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        <h2 class="text-2xl font-bold text-cyan-400 font-orbitron">Local Viewing Mode</h2>
                    </div>

                    <p class="text-gray-300 mb-4 leading-relaxed">
                        The markdown file for <strong class="text-purple-400">"${blogData.title}"</strong> has been opened in a new tab.
                    </p>

                    <div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                        <p class="text-sm text-gray-300 mb-2">
                            <strong class="text-cyan-400">Why?</strong> Browser security prevents loading files when viewing via <code class="bg-gray-800 px-2 py-1 rounded text-yellow-400">file://</code> protocol.
                        </p>
                    </div>

                    <p class="text-gray-400 text-sm mb-4">
                        <strong class="text-cyan-400">For full functionality:</strong>
                    </p>
                    <ul class="list-disc list-inside text-gray-400 text-sm space-y-2 mb-6">
                        <li>Deploy to GitHub Pages</li>
                        <li>Run local server: <code class="bg-gray-800 px-2 py-1 rounded text-cyan-400">python -m http.server</code></li>
                    </ul>

                    <button onclick="this.closest('.blog-modal').remove(); document.body.style.overflow = '';"
                            class="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        Got it!
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
                document.body.style.overflow = '';
            }
        }, 5000);
    }

    async openBlog(blogData) {
        const htmlContent = await this.loadBlogContent(blogData.filename);
        this.showBlogModal(blogData, htmlContent);
    }

    showBlogModal(blogData, htmlContent) {
        // Create modal
        this.modal = document.createElement('div');
        this.modal.className = 'blog-modal';
        this.modal.innerHTML = `
            <div class="blog-modal-overlay" onclick="this.parentElement.remove(); document.body.style.overflow = '';"></div>
            <div class="blog-modal-content">
                <button class="close-modal" onclick="this.closest('.blog-modal').remove(); document.body.style.overflow = '';" aria-label="Close">
                    ×
                </button>

                <header class="blog-header mb-8 pb-6 border-b border-gray-700">
                    <h1 class="text-4xl font-bold text-purple-300 mb-4 font-orbitron glitch" data-text="${blogData.title}">
                        ${blogData.title}
                    </h1>
                    <div class="flex flex-wrap gap-4 text-gray-400 mb-4 text-sm">
                        <span class="flex items-center gap-2">
                            📅 ${blogData.date}
                        </span>
                        ${blogData.readTime ? `
                            <span class="flex items-center gap-2">
                                ⏱️ ${blogData.readTime}
                            </span>
                        ` : ''}
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${blogData.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                </header>

                <article class="blog-article">
                    ${htmlContent}
                </article>

                <footer class="blog-footer mt-12 pt-8 border-t border-gray-700">
                    <button class="back-btn px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold" onclick="this.closest('.blog-modal').remove(); document.body.style.overflow = '';">
                        ← Back to Blogs
                    </button>
                </footer>
            </div>
        `;

        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';

        // Add escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Re-initialize glitch effects for modal content
        if (typeof initGlitchEffects === 'function') {
            const modalGlitchElements = this.modal.querySelectorAll('.glitch');
            modalGlitchElements.forEach(el => {
                if (el.textContent) {
                    el.setAttribute('data-text', el.textContent.trim());
                }
            });
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.remove();
            document.body.style.overflow = '';
        }
    }
}

/**
 * Initialize blog loader
 */
async function initBlogLoader() {
    const container = document.getElementById('blogs-container');
    if (!container) {
        console.warn('Blog container not found');
        return;
    }

    const blogLoader = new BlogLoader();
    await blogLoader.loadIndex();
    blogLoader.renderBlogCards(container);

    // Expose globally
    window.blogLoader = blogLoader;
}
