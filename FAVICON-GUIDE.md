# Adding a Favicon

The browser tab icon (favicon) has been configured in `index.html`.

## Where to put your favicon image:

Put your favicon file in the **`public/`** directory:

```
public/
  └── favicon.ico    ← Put your icon here
```

## Favicon requirements:

### Format options:
1. **favicon.ico** (classic, most compatible)
   - 16x16 or 32x32 pixels
   - .ico format

2. **favicon.png** (modern, easier to create)
   - 32x32 or 64x64 pixels
   - .png format

3. **favicon.svg** (modern, scalable)
   - Vector format
   - Looks sharp at any size

## Quick ways to create a favicon:

### Option 1: Convert an existing image
If you have a square image (logo, photo, etc.):
```bash
# Resize to 32x32 and save as PNG
# Use Preview on Mac, or any image editor
```

### Option 2: Use an online generator
1. Go to: https://favicon.io/
2. Choose:
   - Text (make an emoji or letter favicon)
   - Image (upload your image)
   - Generate from text

### Option 3: Use an emoji as favicon
Create a simple SVG favicon with an emoji:

```bash
# Create this file: public/favicon.svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y="0.9em" font-size="90">🚀</text>
</svg>
```

Then update `index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

### Option 4: No favicon (use default)
Just delete the line from `index.html`:
```html
<!-- Remove this line if you don't want a custom favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

## Current configuration:

The site is currently set to use **`/favicon.ico`**

To change the format, update `index.html`:

```html
<!-- For .ico -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- For .png -->
<link rel="icon" type="image/png" href="/favicon.png">

<!-- For .svg -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

## Advanced: Multiple sizes (best practice)

For best compatibility across all devices:

```html
<head>
  <title>Jake Simonds</title>

  <!-- Standard favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">

  <!-- Modern browsers -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

  <!-- Apple Touch Icon (iOS home screen) -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Android -->
  <link rel="manifest" href="/site.webmanifest">
</head>
```

## Quick test:

After adding your favicon to `public/`, refresh the browser tab and you should see your icon!

If it doesn't update immediately:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Close and reopen the tab
