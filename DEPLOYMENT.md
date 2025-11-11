# GitHub Pages Deployment Guide

## ✨ Automatic Deployment with GitHub Actions

Your project is configured for **automatic deployment** - no manual building required!

## 🚀 How It Works

Every time you push to the `main` branch:

1. **GitHub Actions** automatically runs
2. Builds your React demo (`npm run build`)
3. Deploys built demo to GitHub Pages root
4. Copies docs/ directory for timeline access

**You never need to run `npm run build` manually!**

The React app includes the landing page as its root route, keeping everything in one place.

## 📋 One-Time Setup

### Enable GitHub Pages

1. Go to your repo: https://github.com/murnanedaniel/Collider-2031
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment**, select:
   - **Source**: GitHub Actions ⚠️ (NOT "Deploy from a branch")
4. GitHub will show "Your site is live at..." once deployed
5. Enable **Enforce HTTPS** in Settings → Pages

## 💻 Making Changes

### Update the Demo or Landing Page

```bash
# 1. Make changes in demo/src/
#    - Landing page: demo/src/screens/Landing.jsx
#    - Other screens: demo/src/screens/*.jsx

# 2. Commit and push
git add .
git commit -m "Update demo feature X"
git push

# 3. GitHub Actions automatically builds and deploys!
# Check progress: https://github.com/murnanedaniel/Collider-2031/actions
```

## 📁 Repository Structure

```
collider2031/
├── .github/
│   └── workflows/
│       └── deploy.yml         # 🤖 GitHub Actions workflow
├── demo/                      # 💻 React app (includes landing page)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Landing.jsx   # 🌐 Landing page at root
│   │   │   ├── Login.jsx
│   │   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js         # ⚙️  base: '/Collider-2031/'
├── docs/
│   └── timeline.md
├── README.md
├── CITATION.cff
└── LICENSE

# NOT in repo (auto-generated):
├── demo/dist/                 # Ignored (built by CI)
├── demo/node_modules/         # Ignored
└── _site/                     # Ignored (deployment artifact)
```

## 🌐 Live URLs

- **Landing/Demo**: https://murnanedaniel.github.io/Collider-2031/
- **Timeline**: https://murnanedaniel.github.io/Collider-2031/docs/timeline
- **GitHub**: https://github.com/murnanedaniel/Collider-2031
- **Zenodo**: https://doi.org/10.5281/zenodo.17578821

## 🔍 Monitoring Deployments

- **Check build status**: https://github.com/murnanedaniel/Collider-2031/actions
- **Typical build time**: 1-2 minutes

## 🐛 Troubleshooting

**Build fails?** Check Actions tab for logs, fix error, push again

**Demo blank?** Check console for errors, verify React Router is loading correctly

**404 errors for assets?** Verify `base: '/Collider-2031/'` in vite.config.js matches your repo name exactly

## ⚡ Local Testing

```bash
# Run the demo (includes landing page at root)
cd demo && npm run dev       # http://localhost:5173

# Landing page is at: /
# Enter demo at: /login
```

---

**Ready!** Just: `git push` → Auto-deploys! ✨
