# Prathana Mahendran - Cybersecurity Portfolio

A cyberpunk-themed personal portfolio website showcasing security engineering expertise, technical skills, and cybersecurity insights.

## 🚀 Features

- **Cyberpunk Aesthetic**: Matrix rain background, glitch effects, neon colors, and terminal-style UI
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dynamic Blog System**: Markdown-based blog posts with client-side rendering
- **Interactive Animations**: Scroll-triggered animations, typing effects, and smooth transitions
- **Accessibility**: Respects reduced-motion preferences, keyboard navigation support
- **SEO Optimized**: Structured data, meta tags, and semantic HTML

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom properties, animations, responsive design
- **Tailwind CSS** - Utility-first styling (via CDN)
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Markdown** - Blog content format

## 📁 Project Structure

```
Prats_Website/
├── index.html              # Main HTML file
├── assets/
│   ├── data/              # JSON data files
│   │   ├── skills.json
│   │   ├── experience.json
│   │   └── certifications.json
│   └── icons/             # SVG icons (if added)
├── styles/
│   ├── main.css          # Core styles and theme
│   ├── animations.css    # Animation definitions
│   └── glitch.css        # Glitch effects
├── scripts/
│   ├── main.js           # Main orchestrator
│   ├── matrix.js         # Matrix rain animation
│   ├── animations.js     # Scroll and typing animations
│   ├── glitch.js         # Glitch effect triggers
│   ├── navigation.js     # Navigation and scroll handling
│   ├── blog-loader.js    # Markdown blog system
│   └── utils.js          # Utility functions
├── blogs/
│   ├── index.json        # Blog metadata
│   └── *.md              # Blog posts in markdown
├── .gitignore
└── README.md
```

## 🎨 Color Palette

- **Primary Background**: #050816 (deep space blue)
- **Neon Cyan**: #00ff9f (primary accent)
- **Neon Purple**: #bd00ff (secondary accent)
- **Neon Blue**: #00d9ff (tertiary accent)
- **Text Primary**: #e0e7ff (light blue-white)

## ✏️ Customization Guide

### Adding a New Blog Post

1. Create a new markdown file in the `blogs/` folder:
   ```
   blogs/your-blog-title.md
   ```

2. Write your content using markdown syntax

3. Update `blogs/index.json` with the new post metadata:
   ```json
   {
     "id": "unique-id",
     "title": "Your Blog Title",
     "description": "Brief description",
     "date": "YYYY-MM-DD",
     "tags": ["Tag1", "Tag2"],
     "filename": "your-blog-title.md",
     "readTime": "X min read"
   }
   ```

### Updating Skills

Edit `assets/data/skills.json`:
```json
{
  "name": "Skill Name",
  "level": 85,
  "description": "Description of your proficiency"
}
```

### Updating Experience

Edit `assets/data/experience.json` to add or modify work experience entries.

### Updating Certifications

Edit `assets/data/certifications.json` to add or modify certifications.

### Customizing Colors

Edit CSS custom properties in `styles/main.css`:
```css
:root {
  --color-neon-cyan: #00ff9f;
  --color-neon-purple: #bd00ff;
  /* ... other colors ... */
}
```

## 🚀 Deployment to GitHub Pages

### Initial Setup

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Cybersecurity portfolio website"
   ```

2. **Connect to GitHub**:
   ```bash
   git remote add origin https://github.com/prathzzxoxo/Prats_Website.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Under "Source", select `main` branch and `/  (root)` folder
   - Click "Save"
   - Your site will be published at: `https://prathzzxoxo.github.io/Prats_Website`

### Updating the Site

After making changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild and deploy your site.

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the root directory with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use custom domain

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚡ Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3.5s
- **Matrix Animation**: 60fps on modern hardware

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels where appropriate
- Keyboard navigation support
- Reduced motion support (`prefers-reduced-motion`)
- High contrast text (WCAG AA compliant)

## 🔧 Troubleshooting

### Blog Posts Not Loading

- Check that `blogs/index.json` is valid JSON
- Verify markdown filenames match exactly in `index.json`
- Check browser console for errors

### Animations Not Working

- Check if user has `prefers-reduced-motion` enabled
- Verify JavaScript files are loaded (check browser console)
- Clear browser cache

### Matrix Rain Not Showing

- Check canvas element exists in HTML
- Verify `scripts/matrix.js` is loaded
- Check for JavaScript errors in console

## 📞 Contact

- **Email**: prathanamahendran@gmail.com
- **LinkedIn**: [Prathana Mahendran](https://www.linkedin.com/in/prathana-mahendran-16b65319a/)

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- Matrix effect inspired by "The Matrix" (1999)
- Cyberpunk aesthetic influenced by modern security operations centers
- Built with attention to accessibility and performance

---

**Built with** `</>` **and cybersecurity in mind** 🔒

Last updated: January 2026
