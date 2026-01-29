# How to Create the Open Graph Image

The Open Graph image is what appears when you share your ResumeForge link on social media (WhatsApp, Facebook, Twitter, LinkedIn, etc.).

## Quick Method:

1. **Visit the OG Image Generator:**
   - Go to: http://localhost:5001/og-image (locally)
   - Or: https://mayarkabaja.pythonanywhere.com/og-image (production)

2. **Take a Screenshot:**
   - Open browser DevTools (F12)
   - Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
   - Set dimensions to: **1200 x 630** pixels
   - Take a screenshot
   - Save as `og-image.png` in this folder (`static/og-image.png`)

3. **Upload to PythonAnywhere:**
   - In PythonAnywhere: Files → Upload
   - Navigate to `/home/YOUR_USERNAME/resumeforge/static/`
   - Upload the `og-image.png` file

## Alternative Methods:

### Option 1: Use an Online Tool
- Visit: https://www.opengraph.xyz/ or https://www.bannerbear.com/tools/og-image-generator/
- Create a 1200x630px image with your branding
- Save as `og-image.png`

### Option 2: Design Your Own
- Use Canva, Figma, or Photoshop
- Create 1200 x 630 pixels image
- Include: Logo, tagline, key features
- Export as PNG
- Name it `og-image.png`

## Verify It Works:

After uploading, test with:
- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Inspector:** https://www.linkedin.com/post-inspector/

Paste your URL: `https://mayarkabaja.pythonanywhere.com`

The preview image should appear!
