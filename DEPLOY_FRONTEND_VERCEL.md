# Deploy Frontend (Expo App) to Vercel

This guide shows you how to deploy your Expo app's web version to Vercel.

## 🚀 Quick Deploy (3 Steps)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
vercel login
```

### Step 3: Deploy
```powershell
cd mochila
vercel --prod
```

That's it! Your app will be deployed to Vercel.

---

## 📋 Detailed Setup

### Option A: Deploy via Vercel CLI (Recommended)

1. **Navigate to frontend directory**:
   ```powershell
   cd mochila
   ```

2. **Login to Vercel** (if not already):
   ```powershell
   vercel login
   ```

3. **Link to project or create new**:
   ```powershell
   vercel link
   ```
   - Choose "Create new project" or "Link to existing project"
   - Enter project name (e.g., `mochila-frontend`)

4. **Set environment variables** (if needed):
   ```powershell
   vercel env add EXPO_PUBLIC_API_URL
   vercel env add EXPO_PUBLIC_EMAIL_API_URL
   ```
   - Enter values when prompted:
     - `EXPO_PUBLIC_API_URL`: `https://mochila-app-backend.vercel.app/api`
     - `EXPO_PUBLIC_EMAIL_API_URL`: `https://mochila-app-backend.vercel.app/api/send-verification-email`

5. **Deploy to production**:
   ```powershell
   vercel --prod
   ```

6. **Get your URL**:
   - Vercel will show your deployment URL (e.g., `https://mochila-frontend.vercel.app`)
   - Or check Vercel Dashboard: https://vercel.com/dashboard

### Option B: Deploy via Vercel Dashboard (Git Integration)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to Vercel Dashboard**: https://vercel.com/dashboard

3. **Click "Add New Project"**

4. **Import your repository**:
   - Select your Git provider
   - Choose the repository
   - **Root Directory**: Set to `mochila` (if repo is at root level)

5. **Configure Project Settings**:
   - **Framework Preset**: Other
   - **Build Command**: `npx expo export:web` (or leave empty, `vercel.json` handles it)
   - **Output Directory**: `web-build` (or leave empty, `vercel.json` handles it)
   - **Install Command**: `npm install`

6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add:
     - `EXPO_PUBLIC_API_URL` = `https://mochila-app-backend.vercel.app/api`
     - `EXPO_PUBLIC_EMAIL_API_URL` = `https://mochila-app-backend.vercel.app/api/send-verification-email`

7. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

---

## ✅ Verify Deployment

1. **Visit your Vercel URL** (e.g., `https://mochila-frontend.vercel.app`)
2. **Test the app**:
   - Check if it loads correctly
   - Test API connections
   - Verify environment variables are working

---

## 🔧 Troubleshooting

### Build Fails: "Cannot find module"

**Solution**: Make sure all dependencies are in `package.json`:
```powershell
cd mochila
npm install
```

### Build Fails: "expo export:web" not found

**Solution**: Make sure Expo CLI is installed:
```powershell
npm install -g expo-cli
# Or use npx (already in vercel.json)
```

### Environment Variables Not Working

**Solution**: 
1. Check variables are set in Vercel Dashboard → Project → Settings → Environment Variables
2. Make sure variable names start with `EXPO_PUBLIC_` (required for Expo)
3. Redeploy after adding variables: `vercel --prod`

### App Loads but API Calls Fail

**Solution**:
1. Check `EXPO_PUBLIC_API_URL` is set correctly
2. Verify backend is deployed and accessible
3. Check browser console for CORS errors
4. Verify backend CORS allows your Vercel domain

### Routes Not Working (404 on refresh)

**Solution**: The `vercel.json` already includes rewrites for client-side routing. If issues persist:
- Check `vercel.json` exists in `mochila/` directory
- Verify rewrites configuration is correct

---

## 🔄 Update Deployment

After making changes:

```powershell
cd mochila
vercel --prod
```

Or push to Git (if using Git integration) - Vercel will auto-deploy.

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `https://mochila-app-backend.vercel.app/api` |
| `EXPO_PUBLIC_EMAIL_API_URL` | Email verification endpoint | `https://mochila-app-backend.vercel.app/api/send-verification-email` |

**Important**: All Expo environment variables must start with `EXPO_PUBLIC_` to be accessible in the client.

---

## 🎯 Quick Commands Reference

```powershell
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove
```

---

## 💡 Tips

1. **Preview Deployments**: Use `vercel` (without `--prod`) to test before production
2. **Custom Domain**: Add your domain in Vercel Dashboard → Project → Settings → Domains
3. **Auto-Deploy**: Connect Git repo for automatic deployments on push
4. **Environment Variables**: Use Vercel Dashboard for easier management

---

## 📚 Next Steps

- Share your Vercel URL with the client: `https://your-app.vercel.app`
- For mobile app (iOS/Android), use EAS Build + TestFlight (see `CLIENT_DEMO.md`)
- Monitor deployments in Vercel Dashboard

