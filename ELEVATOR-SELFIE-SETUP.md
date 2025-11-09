# Elevator Selfie Pages Setup Guide

## What Was Created

Two new pages have been added to your React site:

### 1. Landing Page
- **Route**: `/takeAnElevatorSelfie`
- **URL (local)**: `http://localhost:5174/takeAnElevatorSelfie`
- **Description**: Simple filler landing page with centered text
- **File**: `src/pages/ElevatorSelfie.jsx`

### 2. Camera Upload Page (Secret)
- **Route**: `/qr7f9k2h8d4j6m1p3s5w` (random-looking string)
- **URL (local)**: `http://localhost:5174/qr7f9k2h8d4j6m1p3s5w`
- **Description**: Full camera upload functionality to post to Bluesky
- **File**: `src/pages/CameraUpload.jsx`
- **Features**:
  - Mobile-friendly camera interface
  - Front-facing camera (selfie mode)
  - Image compression to < 1MB
  - Direct upload to Lambda endpoint
  - Posts to @takeAnElevatorSelfie.jakesimonds.com on Bluesky

## Local Testing

### On Desktop Browser
1. Dev server is running at: `http://localhost:5174/`
2. Test landing page: `http://localhost:5174/takeAnElevatorSelfie`
3. Test camera page: `http://localhost:5174/qr7f9k2h8d4j6m1p3s5w`

### On Mobile Phone (Same WiFi Network)
1. Find your computer's local IP address:
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet "

   # On Windows
   ipconfig
   ```

2. Look for your local IP (usually `192.168.x.x` or `10.0.x.x`)

3. Start dev server with network access:
   ```bash
   npm run dev -- --host
   ```

4. On your phone, visit:
   - Landing: `http://YOUR_LOCAL_IP:5174/takeAnElevatorSelfie`
   - Camera: `http://YOUR_LOCAL_IP:5174/qr7f9k2h8d4j6m1p3s5w`

## Important Notes

- **No navigation links**: Both pages are standalone (no nav bar)
- **Home page link**: Added link to `/takeAnElevatorSelfie` on main home page
- **Secret route**: `/qr7f9k2h8d4j6m1p3s5w` is NOT linked anywhere (secret!)
- **Mobile only**: Camera functionality requires HTTPS for mobile Safari (works in dev with localhost)

## Lambda API Endpoint

Camera upload posts to:
```
https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/
```

Posts to Bluesky account: `@takeAnElevatorSelfie.jakesimonds.com`

## Production Deployment Notes

### When you're ready to deploy:

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Deploy to hosting** (Vercel, Netlify, AWS Amplify, etc.)

3. **Domain Configuration**:

   **Option A: Subdomain (Recommended)**
   - Buy domain: `yourdomain.com`
   - Create DNS record:
     ```
     CNAME takeAnElevatorSelfie -> your-app.vercel.app
     ```
   - Landing page: `takeAnElevatorSelfie.yourdomain.com`
   - Camera: `takeAnElevatorSelfie.yourdomain.com/qr7f9k2h8d4j6m1p3s5w`

   **Option B: Main Domain + Paths**
   - Deploy to `yourdomain.com`
   - Landing page: `yourdomain.com/takeAnElevatorSelfie`
   - Camera: `yourdomain.com/qr7f9k2h8d4j6m1p3s5w`

### HTTPS Requirement
Camera access on mobile Safari REQUIRES HTTPS. This means:
- Local testing: Works with `localhost` (special exception)
- Production: Must use HTTPS domain (all hosting providers provide this free)

## File Structure

```
src/
├── pages/
│   ├── ElevatorSelfie.jsx    # Landing page
│   ├── CameraUpload.jsx       # Camera upload page
│   ├── Home.jsx
│   ├── Blog.jsx
│   ├── RFID.jsx
│   └── Services.jsx
├── components/
│   └── Layout.jsx             # Updated to use <Outlet />
└── App.jsx                    # Updated routing
```

## Routes Overview

**With Navigation (Layout)**:
- `/` - Home
- `/blog` - Blog
- `/RFID` - RFID page
- `/services` - Services

**Without Navigation (Standalone)**:
- `/takeAnElevatorSelfie` - Landing page
- `/qr7f9k2h8d4j6m1p3s5w` - Camera upload (secret)

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] Camera page loads on desktop
- [ ] Camera permission request works on mobile
- [ ] Front-facing camera opens
- [ ] Photo capture works
- [ ] Preview shows captured image
- [ ] Image uploads to Lambda
- [ ] Success message shows Bluesky post link
- [ ] Error handling works
- [ ] Retake button works
- [ ] "Take Another Photo" resets app

## Troubleshooting

### Camera not working on mobile?
- Make sure you're using HTTPS or localhost
- Check browser permissions for camera
- Try on different browser (Safari, Chrome)

### Can't access from phone?
- Make sure phone and computer on same WiFi
- Run with `--host` flag: `npm run dev -- --host`
- Check firewall settings

### Image too large error?
- Current compression: 1200px width, 80% JPEG quality
- If still too large, can reduce further in code

## Future Enhancements

Possible features to add later:
- QR code that links to camera page
- Caption/text input before posting
- Location tagging
- Multiple photo support
- Gallery of past uploads
- Analytics tracking
