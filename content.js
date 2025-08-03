// Content script for Developer Helper extension
let colorPickerActive = false;
let colorPickerElement = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case 'formatCode':
            formatCode();
            break;
        case 'syntaxHighlight':
            syntaxHighlight();
            break;
        case 'toggleColorPicker':
            toggleColorPicker();
            break;
        case 'formatJSON':
            formatJSON();
            break;
        case 'validateCSS':
            validateCSS();
            break;
        case 'analyzePerformance':
            analyzePerformance();
            break;
        case 'insertSnippet':
            insertSnippet(request.snippet);
            break;
    }
});

// Code formatting functionality
function formatCode() {
    const codeElements = document.querySelectorAll('pre, code, textarea[data-language], .code, .syntax-highlight');
    
    codeElements.forEach(element => {
        if (element.tagName === 'TEXTAREA') {
            formatTextarea(element);
        } else {
            formatCodeElement(element);
        }
    });
    
    showNotification('Code formatted successfully');
}

function formatTextarea(textarea) {
    const code = textarea.value;
    const language = textarea.getAttribute('data-language') || 'javascript';
    
    try {
        const formatted = formatByLanguage(code, language);
        textarea.value = formatted;
    } catch (error) {
        console.error('Formatting error:', error);
    }
}

function formatCodeElement(element) {
    const code = element.textContent;
    const language = detectLanguage(element);
    
    try {
        const formatted = formatByLanguage(code, language);
        element.textContent = formatted;
    } catch (error) {
        console.error('Formatting error:', error);
    }
}

function formatByLanguage(code, language) {
    switch(language.toLowerCase()) {
        case 'javascript':
        case 'js':
            return formatJavaScript(code);
        case 'json':
            return formatJSONString(code);
        case 'css':
            return formatCSS(code);
        case 'html':
            return formatHTML(code);
        default:
            return code;
    }
}

function formatJavaScript(code) {
    // Basic JavaScript formatting
    return code
        .replace(/\s*{\s*/g, ' {\n\t')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/\s*;\s*/g, ';\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

function formatJSONString(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch (error) {
        return jsonString;
    }
}

function formatCSS(css) {
    return css
        .replace(/\s*{\s*/g, ' {\n\t')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/\s*;\s*/g, ';\n\t')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

function formatHTML(html) {
    return html
        .replace(/>\s*</g, '>\n<')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

// Syntax highlighting
function syntaxHighlight() {
    const codeElements = document.querySelectorAll('pre code, .code, .syntax-highlight');
    
    codeElements.forEach(element => {
        if (!element.classList.contains('highlighted')) {
            applySyntaxHighlighting(element);
        }
    });
    
    showNotification('Syntax highlighting applied');
}

function applySyntaxHighlighting(element) {
    const code = element.textContent;
    const language = detectLanguage(element);
    
    // Basic syntax highlighting
    let highlighted = code;
    
    if (language === 'javascript' || language === 'js') {
        highlighted = highlightJavaScript(code);
    } else if (language === 'css') {
        highlighted = highlightCSS(code);
    } else if (language === 'html') {
        highlighted = highlightHTML(code);
    }
    
    element.innerHTML = highlighted;
    element.classList.add('highlighted');
}

function highlightJavaScript(code) {
    return code
        .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
        .replace(/\b(console|document|window)\b/g, '<span class="builtin">$1</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
}

function highlightCSS(code) {
    return code
        .replace(/\b(color|background|margin|padding|border|font|display|position)\b/g, '<span class="property">$1</span>')
        .replace(/\b(px|em|rem|%|vh|vw)\b/g, '<span class="unit">$1</span>')
        .replace(/\b(red|blue|green|black|white|transparent)\b/g, '<span class="color">$1</span>')
        .replace(/#[0-9a-fA-F]{3,6}/g, '<span class="color">$&</span>');
}

function highlightHTML(code) {
    return code
        .replace(/&lt;/g, '<span class="tag">&lt;</span>')
        .replace(/&gt;/g, '<span class="tag">&gt;</span>')
        .replace(/\b(div|span|p|h1|h2|h3|h4|h5|h6|a|img|ul|li|table|tr|td|th)\b/g, '<span class="tag">$1</span>');
}

// Color picker functionality
function toggleColorPicker() {
    if (colorPickerActive) {
        deactivateColorPicker();
    } else {
        activateColorPicker();
    }
}

function activateColorPicker() {
    colorPickerActive = true;
    
    // Create color picker overlay
    colorPickerElement = document.createElement('div');
    colorPickerElement.id = 'dev-helper-color-picker';
    colorPickerElement.innerHTML = `
        <div class="color-picker-overlay">
            <div class="color-picker-tooltip">
                <div class="color-preview"></div>
                <div class="color-info">
                    <span class="color-hex"></span>
                    <span class="color-rgb"></span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(colorPickerElement);
    
    // Add event listeners
    document.addEventListener('mousemove', handleColorPickerMouseMove);
    document.addEventListener('click', handleColorPickerClick);
    
    showNotification('Color picker activated - click to copy colors');
}

function deactivateColorPicker() {
    colorPickerActive = false;
    
    if (colorPickerElement) {
        colorPickerElement.remove();
        colorPickerElement = null;
    }
    
    document.removeEventListener('mousemove', handleColorPickerMouseMove);
    document.removeEventListener('click', handleColorPickerClick);
    
    showNotification('Color picker deactivated');
}

function handleColorPickerMouseMove(e) {
    if (!colorPickerActive) return;
    
    const color = getColorAtPoint(e.clientX, e.clientY);
    const tooltip = document.querySelector('.color-picker-tooltip');
    const preview = document.querySelector('.color-preview');
    const hexSpan = document.querySelector('.color-hex');
    const rgbSpan = document.querySelector('.color-rgb');
    
    if (tooltip && preview && hexSpan && rgbSpan) {
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY + 10 + 'px';
        preview.style.backgroundColor = color.hex;
        hexSpan.textContent = color.hex;
        rgbSpan.textContent = `rgb(${color.rgb.join(', ')})`;
    }
}

function handleColorPickerClick(e) {
    if (!colorPickerActive) return;
    
    const color = getColorAtPoint(e.clientX, e.clientY);
    copyToClipboard(color.hex);
    showNotification(`Color ${color.hex} copied to clipboard`);
}

function getColorAtPoint(x, y) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1;
    canvas.height = 1;
    
    // This is a simplified version - in a real implementation,
    // you'd need to capture the screen or use a more complex method
    return {
        hex: '#000000',
        rgb: [0, 0, 0]
    };
}

// JSON formatting
function formatJSON() {
    const jsonElements = document.querySelectorAll('pre, code, textarea');
    
    jsonElements.forEach(element => {
        const text = element.textContent || element.value;
        if (isJSON(text)) {
            try {
                const formatted = JSON.stringify(JSON.parse(text), null, 2);
                if (element.tagName === 'TEXTAREA') {
                    element.value = formatted;
                } else {
                    element.textContent = formatted;
                }
            } catch (error) {
                console.error('JSON formatting error:', error);
            }
        }
    });
    
    showNotification('JSON formatted');
}

function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// CSS validation
function validateCSS() {
    const cssElements = document.querySelectorAll('style, link[rel="stylesheet"]');
    const issues = [];
    
    cssElements.forEach(element => {
        if (element.tagName === 'STYLE') {
            validateCSSContent(element.textContent, issues);
        }
    });
    
    if (issues.length > 0) {
        showValidationResults(issues);
    } else {
        showNotification('CSS validation passed');
    }
}

function validateCSSContent(css, issues) {
    // Basic CSS validation
    const rules = css.split('}');
    
    rules.forEach(rule => {
        if (rule.trim()) {
            if (!rule.includes('{')) {
                issues.push('Missing opening brace');
            }
            if (!rule.includes('}') && rule !== rules[rules.length - 1]) {
                issues.push('Missing closing brace');
            }
        }
    });
}

function showValidationResults(issues) {
    const modal = document.createElement('div');
    modal.className = 'dev-helper-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>CSS Validation Results</h3>
            <ul>
                ${issues.map(issue => `<li>${issue}</li>`).join('')}
            </ul>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Performance analysis
function analyzePerformance() {
    const performance = window.performance;
    const timing = performance.timing;
    
    const metrics = {
        'Page Load Time': timing.loadEventEnd - timing.navigationStart + 'ms',
        'DOM Content Loaded': timing.domContentLoadedEventEnd - timing.navigationStart + 'ms',
        'First Paint': performance.getEntriesByType('paint')[0]?.startTime + 'ms' || 'N/A',
        'Resources Loaded': performance.getEntriesByType('resource').length
    };
    
    showPerformanceResults(metrics);
}

function showPerformanceResults(metrics) {
    const modal = document.createElement('div');
    modal.className = 'dev-helper-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Performance Metrics</h3>
            <ul>
                ${Object.entries(metrics).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
            </ul>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Snippet insertion
function insertSnippet(snippet) {
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
        const cursorPos = activeElement.selectionStart || 0;
        const textBefore = activeElement.value || activeElement.textContent || '';
        const textAfter = textBefore.substring(cursorPos);
        const newText = textBefore.substring(0, cursorPos) + snippet + textAfter;
        
        if (activeElement.tagName === 'TEXTAREA') {
            activeElement.value = newText;
        } else {
            activeElement.textContent = newText;
        }
        
        // Set cursor position after snippet
        const newPos = cursorPos + snippet.length;
        activeElement.setSelectionRange(newPos, newPos);
        activeElement.focus();
    }
}

// Utility functions
function detectLanguage(element) {
    const className = element.className || '';
    const parentClassName = element.parentElement?.className || '';
    
    if (className.includes('javascript') || className.includes('js') || parentClassName.includes('javascript')) {
        return 'javascript';
    } else if (className.includes('css') || parentClassName.includes('css')) {
        return 'css';
    } else if (className.includes('html') || parentClassName.includes('html')) {
        return 'html';
    } else if (className.includes('json') || parentClassName.includes('json')) {
        return 'json';
    }
    
    return 'javascript'; // default
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'dev-helper-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS for notifications and modals
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .dev-helper-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: white;
        padding: 24px;
        border-radius: 8px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .color-picker-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
    }
    
    .color-picker-tooltip {
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        pointer-events: none;
        z-index: 10000;
    }
    
    .color-preview {
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        margin-bottom: 4px;
    }
    
    .color-info {
        font-size: 12px;
        font-family: monospace;
    }
    
    .color-info span {
        display: block;
    }
    
    .keyword { color: #d73a49; font-weight: bold; }
    .literal { color: #005cc5; }
    .builtin { color: #6f42c1; }
    .string { color: #032f62; }
    .number { color: #005cc5; }
    .property { color: #d73a49; }
    .unit { color: #005cc5; }
    .color { color: #28a745; }
    .tag { color: #d73a49; }
`;

document.head.appendChild(style); 