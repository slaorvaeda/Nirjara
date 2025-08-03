# Developer Helper Chrome Extension

A comprehensive Chrome extension designed to boost developer productivity with essential tools for coding, debugging, and web development.

## Features

### 🛠️ Developer Tools
- **Code Formatting**: Automatically format JavaScript, CSS, HTML, and JSON code
- **Syntax Highlighting**: Apply syntax highlighting to code blocks on any webpage
- **Color Picker**: Pick colors from any webpage and copy hex/RGB values
- **JSON Formatter**: Format and validate JSON data
- **CSS Validator**: Validate CSS syntax and identify issues
- **Performance Analysis**: Analyze page performance metrics

### 📝 Code Snippets
- **Quick Snippets**: Pre-built snippets for common code patterns
- **Custom Snippets**: Create and save your own code snippets
- **Easy Insertion**: Insert snippets directly into textareas and code editors

### ⚙️ Settings & Customization
- **Auto-format on paste**: Automatically format code when pasting
- **Dark mode support**: Toggle between light and dark themes
- **Syntax themes**: Choose from different syntax highlighting themes
- **Keyboard shortcuts**: Quick access to tools via keyboard shortcuts

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download or Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** and select the folder containing this extension
5. **Pin the extension** to your toolbar for easy access

### Method 2: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon for easy installation.

## Usage

### Basic Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Navigate between tabs**:
   - **Tools**: Access developer tools like code formatting and color picker
   - **Snippets**: Use pre-built and custom code snippets
   - **Settings**: Configure extension preferences

### Developer Tools

#### Code Formatting
- Click the "Format Code" button to format code on the current page
- Works with `<pre>`, `<code>`, and `<textarea>` elements
- Supports JavaScript, CSS, HTML, and JSON

#### Syntax Highlighting
- Click "Syntax Highlight" to apply syntax highlighting
- Automatically detects code language
- Supports JavaScript, CSS, and HTML

#### Color Picker
- Click "Color Picker" to activate the color picker
- Hover over any color on the page to see its value
- Click to copy the color value to clipboard

#### JSON Formatter
- Automatically detects and formats JSON content
- Validates JSON syntax
- Works with any JSON data on the page

#### CSS Validator
- Validates CSS syntax in `<style>` tags
- Identifies common CSS issues
- Shows validation results in a modal

#### Performance Analysis
- Analyzes page load performance
- Shows metrics like load time, DOM content loaded, and resource count
- Displays results in an easy-to-read format

### Code Snippets

#### Using Pre-built Snippets
1. Go to the "Snippets" tab
2. Click on any snippet button (e.g., "console.log()", "function()")
3. The snippet will be inserted at the cursor position in the active textarea

#### Creating Custom Snippets
1. Click "Add New Snippet" in the Snippets tab
2. Enter a name for your snippet
3. Enter the snippet content (use `$1`, `$2`, etc. for placeholders)
4. Click "Add" to save

#### Managing Snippets
- Custom snippets appear in the "Custom Snippets" section
- Click the "×" button to delete a snippet
- Snippets are saved locally and persist between sessions

### Settings

#### General Settings
- **Auto-format on paste**: Automatically format code when pasting into textareas
- **Dark mode**: Toggle dark theme for the extension popup
- **Syntax theme**: Choose syntax highlighting theme

#### Keyboard Shortcuts
- **Ctrl+Shift+F**: Format code
- **Ctrl+Shift+C**: Toggle color picker

### Context Menu

Right-click on any webpage to access:
- **Format Code**: Format selected code
- **Syntax Highlight**: Apply syntax highlighting to selection
- **Validate CSS**: Validate CSS on the page
- **Performance Analysis**: Analyze page performance

## File Structure

```
developer-helper/
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content script for webpage interaction
├── content.css            # Content script styling
├── background.js          # Background service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Technical Details

### Permissions
- `activeTab`: Access the currently active tab
- `storage`: Save settings and custom snippets
- `scripting`: Execute scripts in web pages
- `tabs`: Access tab information
- `contextMenus`: Create right-click context menu
- `notifications`: Show installation notifications

### Supported Languages
- JavaScript/JSX
- CSS/SCSS
- HTML
- JSON
- TypeScript (basic support)

### Browser Compatibility
- Chrome 88+
- Edge 88+ (Chromium-based)
- Other Chromium-based browsers

## Development

### Prerequisites
- Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development
1. Clone the repository
2. Make your changes
3. Go to `chrome://extensions/`
4. Click "Reload" on the extension
5. Test your changes

### Building for Production
1. Replace placeholder icon files with actual PNG icons
2. Update version number in `manifest.json`
3. Test thoroughly on different websites
4. Package for Chrome Web Store (if publishing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Extension Not Working
1. Check if the extension is enabled in `chrome://extensions/`
2. Ensure you're on a supported website (http/https)
3. Try refreshing the page
4. Check the browser console for errors

### Code Formatting Issues
1. Make sure the code is in a supported element (`<pre>`, `<code>`, `<textarea>`)
2. Check if the language is properly detected
3. Verify the code syntax is valid

### Snippets Not Inserting
1. Ensure you have a textarea or contenteditable element focused
2. Check if the page allows script injection
3. Try refreshing the page and trying again

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions for improvements:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Contact the development team

## Changelog

### Version 1.0.0
- Initial release
- Code formatting and syntax highlighting
- Color picker tool
- JSON formatter and CSS validator
- Performance analysis
- Code snippets system
- Settings and customization options
- Context menu integration
- Keyboard shortcuts

---

**Note**: This extension is designed to help developers and should be used responsibly. Always respect website terms of service and privacy policies when using developer tools. 