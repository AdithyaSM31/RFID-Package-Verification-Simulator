# Deployment Guide - Vercel

Complete guide to deploy the RFID Package Verification System to Vercel.

## Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) 18+ installed
- [Vercel Account](https://vercel.com/signup) (free)
- [GitHub Account](https://github.com/signup)

---

## Step 1: Prepare Your Local Project

### 1.1 Initialize Git Repository (if not already done)

Open PowerShell in your project directory:

```powershell
cd 'C:\Users\adith\Downloads\AI\RFID Web App'
git init
```

### 1.2 Configure Git (first time only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.3 Add All Files

```powershell
git add .
```

### 1.4 Create Initial Commit

```powershell
git commit -m "Initial commit: RFID Package Verification System v1.0"
```

---

## Step 2: Create GitHub Repository

### 2.1 Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `rfid-verification-system` (or your choice)
3. Description: `Modern RFID Package Verification System`
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### 2.2 Connect Local to GitHub

Copy the commands from GitHub (they'll look like this):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/rfid-verification-system.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 2.3 Verify Upload

Refresh your GitHub repository page - you should see all your files!

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

#### 3.1 Go to Vercel

1. Visit https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

#### 3.2 Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Find your repository: `rfid-verification-system`
3. Click **"Import"**

#### 3.3 Configure Project

Vercel will auto-detect settings. Verify:

- **Framework Preset**: Vite ✅
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

#### 3.4 Environment Variables (Optional)

If you need environment variables:
1. Click **"Environment Variables"**
2. Add variables from `.env.example`
3. Example:
   - Name: `VITE_APP_NAME`
   - Value: `RFID Package Verification System`

#### 3.5 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll see: **"Congratulations! 🎉"**

#### 3.6 View Your Site

- Production URL: `https://your-project-name.vercel.app`
- Click **"Visit"** to see your live site!

---

### Option B: Deploy via Vercel CLI

#### 3.1 Install Vercel CLI

```powershell
npm install -g vercel
```

#### 3.2 Login to Vercel

```powershell
vercel login
```

Follow the prompts to authenticate.

#### 3.3 Deploy

```powershell
cd 'C:\Users\adith\Downloads\AI\RFID Web App'
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? (choose your account)
- Link to existing project? **N**
- Project name? **rfid-verification-system** (or press Enter)
- Directory? **./** (press Enter)
- Override settings? **N** (Vercel auto-detects Vite)

#### 3.4 Production Deployment

```powershell
vercel --prod
```

---

## Step 4: Post-Deployment

### 4.1 Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### 4.2 Update Project Settings

**In Vercel Dashboard:**

- **Project Settings** → **General**
  - Update project name
  - Add description
  - Upload project icon (optional)

- **Project Settings** → **Git**
  - Configure auto-deploy branches
  - Default: deploys on every push to `main`

### 4.3 Environment Variables

If you need to add/update environment variables:

1. Go to **Settings** → **Environment Variables**
2. Add new variables
3. Redeploy for changes to take effect

---

## Step 5: Continuous Deployment

### Automatic Deployments

Every time you push to GitHub:

```powershell
# Make changes to your code
git add .
git commit -m "Description of changes"
git push
```

Vercel automatically:
1. Detects the push
2. Builds your project
3. Deploys to production
4. Updates your live site

### Preview Deployments

- Every pull request gets a preview URL
- Test changes before merging to main
- Perfect for collaboration

---

## Project Structure

After deployment, your project will have:

```
rfid-verification-system/
├── .github/              # GitHub Actions (optional)
├── .vercel/             # Vercel config (auto-generated, gitignored)
├── backend/             # Python backend (if used separately)
├── dist/                # Build output (gitignored)
├── node_modules/        # Dependencies (gitignored)
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── data/           # Product database
│   ├── hooks/          # Custom hooks
│   └── types/          # TypeScript types
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── eslint.config.js    # ESLint config
├── index.html          # Entry point
├── package.json        # Dependencies & scripts
├── postcss.config.js   # PostCSS config
├── README.md           # Project documentation
├── tailwind.config.js  # Tailwind CSS config
├── tsconfig.json       # TypeScript config
├── vercel.json         # Vercel config
└── vite.config.ts      # Vite config
```

---

## Troubleshooting

### Build Fails

**Error: "Command 'npm run build' failed"**

1. Test build locally:
   ```powershell
   npm run build
   ```

2. Fix any TypeScript errors:
   ```powershell
   npm run type-check
   ```

3. Check ESLint:
   ```powershell
   npm run lint
   ```

4. Push fixes and redeploy

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel Dashboard logs

### 404 Errors on Routes

- Verify `vercel.json` has correct rewrites
- Check that SPA routing is configured

### Build Taking Too Long

- Normal build time: 1-3 minutes
- Check Vercel status: https://vercel-status.com
- Review build logs in Vercel Dashboard

---

## Vercel Configuration

### vercel.json Explained

```json
{
  "buildCommand": "npm run build",        // Build script
  "outputDirectory": "dist",              // Build output
  "framework": "vite",                    // Framework detection
  "installCommand": "npm install",        // Dependency installation
  "devCommand": "npm run dev",           // Local dev command
  "rewrites": [                          // SPA routing
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [                           // Caching for assets
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Production Optimizations

### Already Configured

✅ **Code Splitting**: Vite automatically splits code  
✅ **Tree Shaking**: Unused code removed  
✅ **Minification**: JS/CSS minified  
✅ **Asset Optimization**: Images/fonts optimized  
✅ **Gzip Compression**: Enabled by Vercel  
✅ **CDN**: Global edge network  
✅ **HTTPS**: Automatic SSL certificates  

### Performance Features

- **Edge Functions**: Run at the edge (if needed later)
- **Image Optimization**: Automatic with Vercel Image
- **Analytics**: Free analytics in Vercel Dashboard
- **Web Vitals**: Monitor Core Web Vitals

---

## Deployment Checklist

Before deploying, ensure:

- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Build succeeds locally (`npm run build`)
- [ ] All environment variables documented in `.env.example`
- [ ] `.gitignore` properly configured
- [ ] `README.md` updated with project info
- [ ] Git repository initialized and pushed to GitHub
- [ ] Vercel account created and connected to GitHub
- [ ] Project imported to Vercel
- [ ] First deployment successful
- [ ] Production URL verified and working

---

## Monitoring & Maintenance

### Vercel Analytics

1. Go to your project dashboard
2. Click **"Analytics"** tab
3. View traffic, performance, and errors

### Logs

1. Go to **"Deployments"**
2. Click on any deployment
3. View **"Build Logs"** and **"Function Logs"**

### Rollback

If a deployment breaks:

1. Go to **"Deployments"**
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

---

## Cost

**Free Tier Includes:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- 100GB bandwidth/month
- Preview deployments
- Analytics (basic)

**Perfect for this project!**

---

## Next Steps

After successful deployment:

1. **Share Your URL**: `https://your-project.vercel.app`
2. **Add Custom Domain** (optional)
3. **Set up monitoring** (Vercel Analytics)
4. **Enable Web Vitals** tracking
5. **Configure alerts** for errors

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## Support

If you encounter issues:

1. Check [Vercel Status](https://vercel-status.com)
2. Review [Vercel Discussions](https://github.com/vercel/vercel/discussions)
3. Check build logs in Vercel Dashboard
4. Test locally with `npm run build && npm run preview`

---

**Congratulations on deploying your RFID Package Verification System! 🚀**
