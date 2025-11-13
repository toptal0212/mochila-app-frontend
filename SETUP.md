# Mochila Frontend Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   cd mochila
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   
   The default configuration points to `http://localhost:3000/api/send-verification-email` which is correct for development.
   
   If your backend is running on a different port or URL, update `.env`:
   ```env
   EXPO_PUBLIC_EMAIL_API_URL=http://localhost:3000/api/send-verification-email
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## Connecting to Backend

### Development Setup

1. **Start Backend Server:**
   ```bash
   cd ../mochila-backend
   npm start
   ```
   Backend should be running on `http://localhost:3000`

2. **Start Frontend:**
   ```bash
   cd mochila
   npm start
   ```
   Frontend will run on Expo's default port (usually 8081)

3. **Verify Connection:**
   - Open the app in your browser/emulator
   - Try to sign in with an email
   - Check backend console for email sending logs

### Troubleshooting CORS Issues

If you encounter CORS errors:

1. **Check backend is running:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Verify backend CORS configuration:**
   - Backend should have `app.use(cors())` which allows all origins
   - Check `mochila-backend/index.js` line 10

3. **Check environment variable:**
   - Make sure `.env` file exists in `mochila/` directory
   - Verify `EXPO_PUBLIC_EMAIL_API_URL` is set correctly
   - Restart Expo after changing `.env` file

4. **For web development:**
   - If testing on web, make sure backend allows requests from `http://localhost:8081`
   - Backend CORS is configured to allow all origins by default

### Production Setup

For production, update `.env`:
```env
EXPO_PUBLIC_EMAIL_API_URL=https://your-production-backend.com/api/send-verification-email
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_EMAIL_API_URL` | Backend API endpoint for sending emails | `http://localhost:3000/api/send-verification-email` |

## Notes

- Environment variables prefixed with `EXPO_PUBLIC_` are exposed to the client-side code
- After changing `.env`, restart the Expo development server
- The `.env` file should be in `.gitignore` (never commit sensitive data)






