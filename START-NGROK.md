# Using ngrok to Test on Your Phone

## What is ngrok?

ngrok creates a secure public URL that tunnels to your localhost. This lets you access your local dev server from your phone (or anywhere) over the internet with HTTPS.

## Steps

### 1. Make sure your dev server is running
```bash
npm run dev
# Should show: Local: http://localhost:5174/
```

### 2. In a NEW terminal, start ngrok
```bash
ngrok http 5174
```

### 3. You'll see output like this:
```
ngrok

Session Status                online
Account                       your-account (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:5174

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 4. Use the HTTPS URL on your phone
The URL will look like: `https://abc123xyz.ngrok-free.app`

**Important**: Use the HTTPS URL (not HTTP) - this is required for camera access on mobile!

### 5. Access your pages on your phone

Open these URLs on your phone browser:

- **Landing page**: `https://abc123xyz.ngrok-free.app/takeAnElevatorSelfie`
- **Camera upload** (secret): `https://abc123xyz.ngrok-free.app/qr7f9k2h8d4j6m1p3s5w`

Replace `abc123xyz.ngrok-free.app` with your actual ngrok URL.

## ngrok Warning Page

The first time you visit, you might see an ngrok warning page that says:
```
"You are about to visit abc123xyz.ngrok-free.app, served by..."
```

Just click **"Visit Site"** to continue. This is normal for the free tier.

## Viewing ngrok Web Interface (Optional)

ngrok provides a local web interface to see all requests:
- Open: `http://localhost:4040` in your browser
- You can see all HTTP requests, responses, and replay them

## Stopping ngrok

Press `Ctrl+C` in the terminal where ngrok is running.

## Troubleshooting

### "command not found: ngrok"
If ngrok isn't found, install it:
```bash
brew install ngrok
```

### "ERR_NGROK_108"
You need to sign up for a free ngrok account and authenticate:
```bash
# Sign up at: https://dashboard.ngrok.com/signup
# Then run:
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Camera still not working?
- Make sure you're using the **HTTPS** URL (not HTTP)
- Clear browser cache on phone
- Try in Chrome/Safari on phone
- Grant camera permissions when prompted

### Want a custom domain?
ngrok free tier gives you random URLs. For a consistent URL, upgrade to a paid plan or deploy to Vercel/Netlify.

## Quick Reference

```bash
# Start ngrok (in new terminal while dev server runs)
ngrok http 5174

# Your URL will be: https://RANDOM.ngrok-free.app
# Visit on phone: https://RANDOM.ngrok-free.app/qr7f9k2h8d4j6m1p3s5w
```
