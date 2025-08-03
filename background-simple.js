// Simplified background service worker for Developer Helper extension

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
        
        console.log('Developer Helper extension installed successfully!');
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener(function(tab) {
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
            console.log('Developer page detected:', tab.url);
        }
    }
});

// Error handling
chrome.runtime.onSuspend.addListener(function() {
    console.log('Extension is being suspended');
});

console.log('Developer Helper background service worker loaded successfully!'); 