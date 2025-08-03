// Background service worker for Developer Helper extension

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        // Set default settings
        chrome.storage.local.set({
            settings: {
                autoFormat: false,
                darkMode: false,
                syntaxTheme: 'default'
            },
            customSnippets: []
        });
        
        // Show welcome message (only if notifications permission is available)
        if (chrome.notifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Developer Helper',
                message: 'Extension installed successfully! Click the extension icon to get started.'
            });
        }
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener(function(tab) {
    // This will open the popup automatically due to manifest configuration
    console.log('Extension icon clicked on tab:', tab.id);
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case 'getTabInfo':
            getTabInfo(sender.tab.id, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'executeScript':
            executeScript(sender.tab.id, request.script, sendResponse);
            return true;
            
        case 'getStorageData':
            getStorageData(request.key, sendResponse);
            return true;
            
        case 'setStorageData':
            setStorageData(request.key, request.value, sendResponse);
            return true;
            
        case 'openOptionsPage':
            chrome.runtime.openOptionsPage();
            break;
            
        case 'createTab':
            createTab(request.url, sendResponse);
            return true;
    }
});

// Get information about the current tab
function getTabInfo(tabId, callback) {
    chrome.tabs.get(tabId, function(tab) {
        if (chrome.runtime.lastError) {
            callback({ error: chrome.runtime.lastError.message });
            return;
        }
        
        const info = {
            id: tab.id,
            url: tab.url,
            title: tab.title,
            isDeveloperPage: isDeveloperPage(tab.url),
            canInjectScripts: tab.url.startsWith('http') || tab.url.startsWith('file://')
        };
        
        callback(info);
    });
}

// Check if the current page is a developer-related page
function isDeveloperPage(url) {
    const developerDomains = [
        'github.com',
        'stackoverflow.com',
        'developer.mozilla.org',
        'css-tricks.com',
        'codepen.io',
        'jsfiddle.net',
        'replit.com',
        'codesandbox.io',
        'glitch.com',
        'dev.to',
        'medium.com',
        'web.dev',
        'developer.chrome.com',
        'firefox-source-docs.mozilla.org'
    ];
    
    const developerKeywords = [
        'documentation',
        'api',
        'reference',
        'tutorial',
        'guide',
        'docs',
        'developer',
        'programming',
        'coding',
        'development'
    ];
    
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.toLowerCase();
        const path = urlObj.pathname.toLowerCase();
        
        // Check if domain is in developer domains
        if (developerDomains.some(devDomain => domain.includes(devDomain))) {
            return true;
        }
        
        // Check if path contains developer keywords
        if (developerKeywords.some(keyword => path.includes(keyword))) {
            return true;
        }
        
        return false;
    } catch (e) {
        return false;
    }
}

// Execute script in content script context
function executeScript(tabId, script, callback) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function(scriptToExecute) {
            try {
                return eval(scriptToExecute);
            } catch (error) {
                return { error: error.message };
            }
        },
        args: [script]
    }, function(results) {
        if (chrome.runtime.lastError) {
            callback({ error: chrome.runtime.lastError.message });
            return;
        }
        
        if (results && results[0]) {
            callback(results[0].result);
        } else {
            callback({ error: 'No results returned' });
        }
    });
}

// Get data from storage
function getStorageData(key, callback) {
    chrome.storage.local.get([key], function(result) {
        if (chrome.runtime.lastError) {
            callback({ error: chrome.runtime.lastError.message });
            return;
        }
        
        callback(result[key]);
    });
}

// Set data in storage
function setStorageData(key, value, callback) {
    const data = {};
    data[key] = value;
    
    chrome.storage.local.set(data, function() {
        if (chrome.runtime.lastError) {
            callback({ error: chrome.runtime.lastError.message });
            return;
        }
        
        callback({ success: true });
    });
}

// Create a new tab
function createTab(url, callback) {
    chrome.tabs.create({ url: url }, function(tab) {
        if (chrome.runtime.lastError) {
            callback({ error: chrome.runtime.lastError.message });
            return;
        }
        
        callback({ tabId: tab.id, success: true });
    });
}

// Handle tab updates to inject content scripts when needed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if this is a developer page and inject additional features
        if (isDeveloperPage(tab.url)) {
            // You could inject additional developer-specific features here
            console.log('Developer page detected:', tab.url);
        }
    }
});

// Handle keyboard shortcuts
if (chrome.commands) {
    chrome.commands.onCommand.addListener(function(command) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                switch(command) {
                    case 'format-code':
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'formatCode'});
                        break;
                    case 'toggle-color-picker':
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleColorPicker'});
                        break;
                    case 'syntax-highlight':
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'syntaxHighlight'});
                        break;
                }
            }
        });
    });
}

// Context menu for developer tools
chrome.runtime.onInstalled.addListener(function() {
    // Only create context menus if the API is available
    if (chrome.contextMenus) {
        chrome.contextMenus.create({
            id: 'dev-helper-menu',
            title: 'Developer Helper',
            contexts: ['all']
        });
        
        chrome.contextMenus.create({
            id: 'format-code',
            parentId: 'dev-helper-menu',
            title: 'Format Code',
            contexts: ['selection']
        });
        
        chrome.contextMenus.create({
            id: 'syntax-highlight',
            parentId: 'dev-helper-menu',
            title: 'Syntax Highlight',
            contexts: ['selection']
        });
        
        chrome.contextMenus.create({
            id: 'validate-css',
            parentId: 'dev-helper-menu',
            title: 'Validate CSS',
            contexts: ['all']
        });
        
        chrome.contextMenus.create({
            id: 'performance-analysis',
            parentId: 'dev-helper-menu',
            title: 'Performance Analysis',
            contexts: ['all']
        });
    }
});

// Handle context menu clicks
if (chrome.contextMenus) {
    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        switch(info.menuItemId) {
            case 'format-code':
                chrome.tabs.sendMessage(tab.id, {action: 'formatCode'});
                break;
            case 'syntax-highlight':
                chrome.tabs.sendMessage(tab.id, {action: 'syntaxHighlight'});
                break;
            case 'validate-css':
                chrome.tabs.sendMessage(tab.id, {action: 'validateCSS'});
                break;
            case 'performance-analysis':
                chrome.tabs.sendMessage(tab.id, {action: 'analyzePerformance'});
                break;
        }
    });
}

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener(function() {
    chrome.runtime.reload();
});

// Error handling
chrome.runtime.onSuspend.addListener(function() {
    console.log('Extension is being suspended');
});

// Keep service worker alive
if (chrome.alarms) {
    chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === 'keepAlive') {
            // Service worker stays alive
            console.log('Service worker kept alive');
        }
    });
} 