# 🚀 Deployment Guide for Talent Pipeline Portal

This guide covers multiple deployment options for the Talent Pipeline Portal.

## 📦 Deployment Options

### 1. Replit Deployment (Recommended for Quick Setup)

#### Option A: Import from GitHub (Easiest)
1. Go to [Replit](https://replit.com)
2. Click "Create Repl" → "Import from GitHub"
3. Enter: `https://github.com/Josz009/talent-pipeline-portal`
4. Replit will auto-detect the project type
5. Click "Import from GitHub"

#### Option B: Fork the Repl
1. Visit: [https://replit.com/@YourUsername/talent-pipeline-portal](https://replit.com)
2. Click "Fork" button
3. The project will be copied to your account

#### Configuration on Replit:
1. **Environment Variables**: 
   - Go to "Secrets" (🔒 icon in left sidebar)
   - Add all variables from `.env.example`:
     ```
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     ```

2. **Run the Project**:
   - Click "Run" button
   - Replit will install dependencies and start the server
   - Your app will be available at: `https://talent-pipeline-portal.YOUR-USERNAME.repl.co`

3. **Always On (Optional)**:
   - For production use, enable "Always On" in Replit
   - This keeps your app running 24/7

### 2. Render Deployment

1. **Connect GitHub**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `talent-pipeline-portal` repository

2. **Configure Service**:
   - **Name**: talent-pipeline-portal
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**:
   - Add all Firebase environment variables
   - Render will auto-deploy on every push

### 3. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and add environment variables in Vercel dashboard
```

### 4. Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 5. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize (already configured)
firebase init

# Deploy
npm run build
firebase deploy
```

## 🔧 Environment Variables

All deployment platforms require these environment variables:

```env
VITE_FIREBASE_API_KEY=AIzaSyDbV_Wmk52Fnv36qPJ2kElJTreLnej2D9Y
VITE_FIREBASE_AUTH_DOMAIN=taskmanagerapp-1c5a7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=taskmanagerapp-1c5a7
VITE_FIREBASE_STORAGE_BUCKET=taskmanagerapp-1c5a7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=441686834090
VITE_FIREBASE_APP_ID=1:441686834090:web:fc60717249bd401dff89d3
```

## 🎯 Post-Deployment Steps

1. **Initialize Demo Data**:
   - Visit your deployed URL
   - Create an admin account or use: admin@talentpipeline.com / admin123
   - Go to Settings → Initialize Demo Data

2. **Test Features**:
   - Login with different user roles
   - Test onboarding workflow
   - Upload documents
   - Check analytics

3. **Custom Domain** (Optional):
   - Most platforms support custom domains
   - Configure in platform settings

## 🐛 Troubleshooting

### Replit Issues:
- **Port errors**: Make sure to use `--host 0.0.0.0`
- **Build failures**: Check Node.js version (should be 18+)
- **Environment variables**: Use Secrets tab, not .env file

### General Issues:
- **Blank page**: Check browser console for errors
- **Firebase errors**: Verify environment variables
- **Build errors**: Run `npm install` locally first

## 📊 Performance Tips

1. **Enable caching** in your deployment platform
2. **Use CDN** for static assets
3. **Enable compression** (gzip/brotli)
4. **Set proper headers** for caching

## 🔗 Useful Links

- [Replit Docs](https://docs.replit.com)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)

---

Choose the platform that best fits your needs. Replit is great for quick demos and development, while Render/Vercel/Netlify are better for production deployments.