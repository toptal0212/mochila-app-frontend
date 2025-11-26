# Fixing EAS Build Issues

## Current Problems Found

### ❌ Missing Required Asset Files

Your `app.json` references these files that don't exist:
- `./assets/images/icon.png` - App icon (required)
- `./assets/images/splash-icon.png` - Splash screen icon (required)
- `./assets/images/android-icon-foreground.png` - Android adaptive icon (required)
- `./assets/images/android-icon-background.png` - Android adaptive icon background (required)
- `./assets/images/android-icon-monochrome.png` - Android monochrome icon (required)
- `./assets/images/favicon.png` - Web favicon (optional for mobile)

**Current status:** Only `logo.png` exists in `assets/images/`

---

## Solution: Fix Missing Assets

### Option 1: Create Placeholder Icons (Quick Fix)

1. **Create App Icon** (`icon.png`):
   - Size: **1024x1024px**
   - Format: PNG with transparency
   - Use your logo or create a simple icon

2. **Create Splash Icon** (`splash-icon.png`):
   - Size: **200x200px** (or larger, will be resized)
   - Format: PNG
   - Should match your app branding

3. **Create Android Icons**:
   - `android-icon-foreground.png`: **1024x1024px** (foreground only, transparent background)
   - `android-icon-background.png`: **1024x1024px** (solid color background)
   - `android-icon-monochrome.png`: **1024x1024px** (monochrome version)

4. **Create Favicon** (optional):
   - `favicon.png`: **48x48px** or **32x32px`

### Option 2: Use Online Icon Generator

1. Go to https://www.appicon.co/ or https://www.favicon-generator.org/
2. Upload your logo
3. Generate all required sizes
4. Download and place in `assets/images/`

### Option 3: Temporarily Comment Out Missing Assets

If you want to test the build quickly, you can temporarily comment out missing assets in `app.json`:

```json
{
  "expo": {
    // ... other config ...
    "icon": "./assets/images/logo.png",  // Use existing logo temporarily
    "ios": {
      // ... other config ...
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/logo.png",  // Use logo temporarily
        // Comment out missing images temporarily
        // "backgroundImage": "./assets/images/android-icon-background.png",
        // "monochromeImage": "./assets/images/android-icon-monochrome.png"
      }
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/logo.png",  // Use logo temporarily
          // ... other config ...
        }
      ]
    ]
  }
}
```

---

## Other Potential Issues

### 1. Bundle Identifier

Your current bundle identifier is `com.anonymous.mochila`. For production builds, you should change this:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.mochila"  // Change this
    },
    "android": {
      "package": "com.yourcompany.mochila"  // Change this
    }
  }
}
```

### 2. React Native Version

Your `package.json` shows `react-native: "^0.81.5"` which seems unusual. Latest stable is around 0.76. This might cause compatibility issues.

**Check compatibility:**
- Expo SDK 54 should work with React Native 0.76.x
- Consider updating to a compatible version

### 3. EAS CLI Version

Your `eas.json` requires CLI version `>= 16.28.0`. Make sure you have the latest:

```bash
npm install -g eas-cli@latest
eas --version
```

---

## Step-by-Step Fix Process

### Step 1: Create Missing Icons

```bash
cd mochila/assets/images
# Add your icon files here
```

### Step 2: Verify Files Exist

```bash
# Check all required files exist
ls assets/images/icon.png
ls assets/images/splash-icon.png
ls assets/images/android-icon-foreground.png
ls assets/images/android-icon-background.png
ls assets/images/android-icon-monochrome.png
```

### Step 3: Validate Configuration

```bash
cd mochila
npx expo-doctor
```

This will check for common configuration issues.

### Step 4: Test Build Locally First

```bash
# Test if configuration is valid
npx expo prebuild --clean
```

### Step 5: Try EAS Build

```bash
# Login to EAS
eas login

# Build for iOS (development)
eas build --platform ios --profile development

# Or build for Android
eas build --platform android --profile development
```

---

## Quick Fix Script

If you want to use your existing `logo.png` as a temporary solution:

1. Copy `logo.png` to create all required files
2. Or update `app.json` to use `logo.png` for all icon references

---

## Common EAS Build Errors

### Error: "Missing icon file"
- **Fix:** Create the missing icon file or update `app.json` path

### Error: "Invalid bundle identifier"
- **Fix:** Change `com.anonymous.mochila` to a proper identifier like `com.yourcompany.mochila`

### Error: "EAS CLI version mismatch"
- **Fix:** Update EAS CLI: `npm install -g eas-cli@latest`

### Error: "Missing credentials"
- **Fix:** Run `eas build:configure` to set up credentials

### Error: "Asset validation failed"
- **Fix:** Ensure all image files exist and are valid PNG files

---

## Recommended Next Steps

1. ✅ Create all missing icon files
2. ✅ Update bundle identifier if needed
3. ✅ Run `npx expo-doctor` to check for issues
4. ✅ Test with `eas build --platform ios --profile development`
5. ✅ Check build logs in EAS dashboard if build fails

---

## Need Help?

If build still fails after fixing assets:
1. Check EAS build logs: https://expo.dev/accounts/[your-account]/projects/mochila/builds
2. Run `eas build --platform ios --profile development --local` to see detailed errors
3. Check Expo documentation: https://docs.expo.dev/build/introduction/

