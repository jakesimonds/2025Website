# CC Website - Elevator Selfie Camera App

React-based camera app that posts selfies to Bluesky with fun filters.

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

## Building for Production (AWS Amplify)

```bash
# 1. Build
npm run build

# 2. Zip for Amplify (from dist folder)
cd dist && zip -r ../amplify-deploy.zip .

# 3. Upload amplify-deploy.zip to AWS Amplify
```

**Important**: The zip must have files at root level (not inside a `dist/` folder). See CLAUDE.md for detailed deployment docs.

## Tech Stack

- React + Vite
- React Router
- Tailwind CSS
- Canvas API (for real-time filter previews)

## Features

- Real-time camera with 4 filters (Normal, Vintage, Warhol, Inverted)
- 100% faithful previews (preview = upload, same pixel manipulation algorithms)
- Auto-posts to Bluesky via Lambda
- Clean, minimal mobile-first UI
