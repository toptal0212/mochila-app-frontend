# Fix 404 Error on Vercel

If you're seeing a 404 page after deployment, follow these steps:

## Step 1: Check Build Output Directory

1. Go to your Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the build logs to see what directory was created
4. Look for lines like:
   - `Output directory: dist`
   - `Exporting static files to: dist`

## Step 2: Verify Output Directory in vercel.json

Make sure `outputDirectory` in `vercel.json` matches what Expo actually creates.

**Common output directories:**
- `dist` (most common for Expo Router)
- `web-build` (older Expo versions)
- `.expo/web-build` (some configurations)

## Step 3: Test Build Locally

Test the build command locally to see the output:

```powershell
cd mochila
npx expo export --platform web
```

Then check what directory was created:
- Look for `dist/` folder
- Verify `dist/index.html` exists

## Step 4: Update vercel.json if Needed

If the output directory is different, update `vercel.json`:

```json
{
  "outputDirectory": "dist"  // Change this to match actual output
}
```

## Step 5: Check Vercel Project Settings

1. Go to Vercel Dashboard → Your Project → Settings → General
2. Verify:
   - **Build Command**: `npx expo export --platform web` (or leave empty if in vercel.json)
   - **Output Directory**: `dist` (or leave empty if in vercel.json)
   - **Install Command**: `npm install`

## Step 6: Redeploy

After making changes:

```powershell
cd mochila
vercel --prod
```

Or push to Git if using Git integration.

## Common Issues

### Issue: Files not found
**Solution**: Check if `dist/index.html` exists after build. If not, the build might be failing silently.

### Issue: Wrong output directory
**Solution**: Check Vercel build logs to see actual output directory, then update `vercel.json`.

### Issue: Rewrites not working
**Solution**: Make sure `vercel.json` is in the `mochila/` directory (project root), not in parent directory.

### Issue: Build succeeds but 404 persists
**Solution**: 
1. Check browser console for errors
2. Verify `index.html` exists in output directory
3. Check if routes are being generated correctly
4. Try accessing root URL: `https://your-app.vercel.app/` (not a sub-route)

## Quick Debug Checklist

- [ ] `vercel.json` exists in `mochila/` directory
- [ ] `outputDirectory` matches actual build output
- [ ] `index.html` exists in output directory
- [ ] Rewrites are configured correctly
- [ ] Build command runs successfully
- [ ] Environment variables are set (if needed)

## Still Having Issues?

1. Check Vercel build logs for errors
2. Test build locally: `npx expo export --platform web`
3. Verify file structure in `dist/` folder
4. Check Vercel Dashboard → Functions tab for any errors

