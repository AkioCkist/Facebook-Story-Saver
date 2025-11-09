# Story Saver - Browser Extension

A Chrome browser extension that allows users to easily download and save stories from Facebook, Instagram, and WhatsApp.

## Features

- 📥 Download stories from Facebook, Instagram, and WhatsApp
- 💾 Save stories directly to your device
- 🎯 Easy-to-use popup interface
- ⚡ Fast and reliable performance
- 🔒 Respects user privacy

## Installation

### For End Users

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/AkioCkist/Facebook-Story-Saver.git
   cd Facebook-Story-Saver
   ```

2. **Open Chrome Extensions Page**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Enable "Developer mode" toggle in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to the repository folder
   - Select the extension folder and click "Select Folder"

4. **Verify Installation**
   - You should see "Story Saver" in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Development

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Chrome Browser** - [Download](https://google.com/chrome/)
- **A code editor** - VSCode recommended: [Download](https://code.visualstudio.com/)

### Project Structure

```
Facebook-Story-Saver/
├── manifest.json              # Extension configuration (Manifest V3)
├── background.js              # Service worker for background tasks
├── index.html                 # Main popup interface
├── d.html                     # Additional page
├── login.html                 # Login page
├── tsconfig.json              # TypeScript configuration
├── content_scripts/           # Scripts injected into web pages
│   ├── facebook.js            # Facebook story handler
│   ├── facebook-video.js      # Facebook video handling
│   ├── facebookx.js           # Additional Facebook features
│   ├── fixfacebook.js         # Facebook fixes/patches
│   ├── instagram.js           # Instagram story handler
│   ├── instagram-video.js     # Instagram video handling
│   ├── instagramdowhand.js    # Instagram download handler
│   ├── whatsapp.js            # WhatsApp story handler
│   ├── showPopup.js           # Popup display logic
│   ├── showPopupthankwait.js  # Alternate popup handler
│   └── sweetalert2.all.min.js # Alert library (minified)
├── css/                       # Stylesheets
│   ├── styles.css             # Main styles
│   └── fonts.css              # Font definitions
├── icons/                     # Extension icons
│   ├── icon_16.png            # 16x16 icon
│   ├── icon_48.png            # 48x48 icon
│   └── icon_128.png           # 128x128 icon
└── .git/                      # Git repository
```

### Setup for Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AkioCkist/Facebook-Story-Saver.git
   cd Facebook-Story-Saver
   ```

2. **Open in Your Editor**
   ```bash
   code .  # If using VSCode
   ```

3. **Install the Extension in Development Mode**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

4. **Enable Extension Reloading**
   - In Chrome DevTools (F12), use the extension's refresh button
   - Or manually click the refresh icon on `chrome://extensions/`

### Development Workflow

1. **Make Changes**
   - Edit files in `content_scripts/`, `css/`, or `manifest.json`
   - Modify popup layouts in `index.html`, `d.html`, or `login.html`

2. **Test Changes**
   - Go to `chrome://extensions/`
   - Click the refresh icon next to "Story Saver"
   - Test the extension on Facebook, Instagram, or WhatsApp

3. **Check Console**
   - Right-click the extension icon → "Inspect popup" (for popup issues)
   - Right-click on a webpage → "Inspect" (for content script issues)
   - Use DevTools Console to debug

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

### Key Files to Know

| File | Purpose |
|------|---------|
| `manifest.json` | Extension metadata and permissions (Manifest V3) |
| `background.js` | Background service worker for persistent operations |
| `content_scripts/instagram.js` | Injects story download functionality on Instagram |
| `content_scripts/facebook.js` | Injects story download functionality on Facebook |
| `content_scripts/whatsapp.js` | Injects story download functionality on WhatsApp |
| `css/styles.css` | Extension UI styling |
| `index.html` | Main popup interface |

## Configuration

### Manifest V3

This extension uses **Manifest V3**, which is the latest Chrome extension format. Key differences from V2:
- Background scripts are now service workers (`background.js`)
- No content security policy inline scripts
- Different permission model

For more info: [Chrome Extension Manifest V3 Docs](https://developer.chrome.com/docs/extensions/mv3/)

## Troubleshooting

### Extension Not Loading
- Ensure you're using an updated version of Chrome
- Check that the manifest.json is valid JSON
- Review the Chrome extension console for errors

### Content Scripts Not Working
- Open DevTools (F12) on the target website
- Check the Console tab for JavaScript errors
- Verify the website matches patterns in `manifest.json`

### Stories Not Downloading
- Ensure you have granted necessary permissions
- Try refreshing the webpage and the extension
- Check browser Downloads folder and settings

## Testing

To test the extension:

1. Navigate to Instagram, Facebook, or WhatsApp
2. Click the extension icon in the Chrome toolbar
3. Use the popup interface to download stories
4. Check your Downloads folder for saved content

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly on all three platforms (Instagram, Facebook, WhatsApp)
5. Push to your fork: `git push origin feature/your-feature`
6. Create a Pull Request

## License

Please check the repository for license information.

## Support

For issues, feature requests, or questions:
- Open an issue on [GitHub Issues](https://github.com/AkioCkist/Facebook-Story-Saver/issues)
- Check existing issues for similar problems

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Content Scripts Guide](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

---

**Current Version:** 2.9.29  
**Repository:** [Facebook-Story-Saver](https://github.com/AkioCkist/Facebook-Story-Saver)
