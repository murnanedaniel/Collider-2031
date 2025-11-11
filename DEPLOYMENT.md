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

### Step 1: Enable GitHub Pages

1. Go to your repo: https://github.com/murnanedaniel/collider2031
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment**, select:
   - **Source**: GitHub Actions ⚠️ (NOT "Deploy from a branch")
4. GitHub will show "Your site is live at..." once deployed

### Step 2: Configure DNS for collider-2031.com

At your domain registrar, add a **CNAME record**:

```
Type: CNAME
Name: @ (or leave blank for root)
Value: murnanedaniel.github.io
TTL: 3600
```

**Alternative (if CNAME doesn't work for root):** Use A records pointing to:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### Step 3: Wait for DNS Propagation

- Takes 15-30 minutes usually
- Check status: https://dnschecker.org/#CNAME/collider-2031.com
- Once ready, enable **Enforce HTTPS** in Settings → Pages

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
# Check progress: https://github.com/murnanedaniel/collider2031/actions
```

## 📁 Repository Structure

```
collider2031/
├── .github/
│   └── workflows/
│       └── deploy.yml         # 🤖 GitHub Actions workflow
├── CNAME                      # 🌐 Domain config
├── demo/                      # 💻 React app (includes landing page)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Landing.jsx   # 🌐 Landing page at root
│   │   │   ├── Login.jsx
│   │   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js         # ⚙️  base: '/'
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

- **Landing/Demo**: https://collider-2031.com (React app with landing page at root)
- **Timeline**: https://collider-2031.com/docs/timeline
- **GitHub**: https://github.com/murnanedaniel/collider2031
- **Zenodo**: https://doi.org/10.5281/zenodo.17578821

## 🔍 Monitoring Deployments

- **Check build status**: https://github.com/murnanedaniel/collider2031/actions
- **Typical build time**: 1-2 minutes

## 🐛 Troubleshooting

**Build fails?** Check Actions tab for logs, fix error, push again

**Demo blank?** Check console for errors, verify React Router is loading correctly

**Domain not working?** Check DNS, wait 30 mins, verify CNAME file

## ⚡ Local Testing

```bash
# Run the demo (includes landing page at root)
cd demo && npm run dev       # http://localhost:5173

# Landing page is at: /
# Enter demo at: /login
```

---

**Ready!** Just: `git push` → Auto-deploys! ✨
