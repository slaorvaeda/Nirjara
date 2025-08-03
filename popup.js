// Popup functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeTools();
    initializeSnippets();
    initializeSettings();
    loadSettings();
});

// Tab switching functionality
function initializeTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Tool functionality
function initializeTools() {
    const tools = {
        formatCode: () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'formatCode'});
                showStatus('Formatting code...');
            });
        },
        syntaxHighlight: () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'syntaxHighlight'});
                showStatus('Applying syntax highlighting...');
            });
        },
        colorPicker: () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleColorPicker'});
                showStatus('Color picker activated');
            });
        },
        jsonFormatter: () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'formatJSON'});
                showStatus('Formatting JSON...');
            });
        },
        cssValidator: () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'validateCSS'});
                showStatus('Validating CSS...');
            });
        },
        performance: () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'analyzePerformance'});
                showStatus('Analyzing performance...');
            });
        }
    };

    // Add event listeners to tool buttons
    Object.keys(tools).forEach(toolId => {
        const btn = document.getElementById(toolId);
        if (btn) {
            btn.addEventListener('click', tools[toolId]);
        }
    });
}

// Snippet functionality
function initializeSnippets() {
    const snippets = {
        'console-log': 'console.log($1);',
        'function': 'function $1($2) {\n\t$3\n}',
        'arrow-function': '($1) => {\n\t$2\n}',
        'try-catch': 'try {\n\t$1\n} catch (error) {\n\tconsole.error(error);\n}',
        'fetch': 'fetch(\'$1\')\n\t.then(response => response.json())\n\t.then(data => {\n\t\t$2\n\t})\n\t.catch(error => {\n\t\tconsole.error(error);\n\t});',
        'async-await': 'async function $1() {\n\ttry {\n\t\tconst response = await fetch(\'$2\');\n\t\tconst data = await response.json();\n\t\t$3\n\t} catch (error) {\n\t\tconsole.error(error);\n\t}\n}'
    };

    // Add event listeners to snippet buttons
    document.querySelectorAll('.snippet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const snippetType = btn.getAttribute('data-snippet');
            const snippet = snippets[snippetType];
            if (snippet) {
                insertSnippet(snippet);
            }
        });
    });

    // Add new snippet functionality
    document.getElementById('addSnippet').addEventListener('click', () => {
        showAddSnippetDialog();
    });

    loadCustomSnippets();
}

function insertSnippet(snippet) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'insertSnippet',
            snippet: snippet
        });
        showStatus('Snippet inserted');
    });
}

function showAddSnippetDialog() {
    const name = prompt('Enter snippet name:');
    if (!name) return;
    
    const content = prompt('Enter snippet content:');
    if (!content) return;
    
    const snippet = { name, content };
    saveCustomSnippet(snippet);
    loadCustomSnippets();
    showStatus('Snippet added');
}

function saveCustomSnippet(snippet) {
    chrome.storage.local.get(['customSnippets'], function(result) {
        const snippets = result.customSnippets || [];
        snippets.push(snippet);
        chrome.storage.local.set({ customSnippets: snippets });
    });
}

function loadCustomSnippets() {
    chrome.storage.local.get(['customSnippets'], function(result) {
        const snippets = result.customSnippets || [];
        const container = document.getElementById('customSnippets');
        container.innerHTML = '';
        
        snippets.forEach((snippet, index) => {
            const btn = document.createElement('button');
            btn.className = 'snippet-btn';
            btn.textContent = snippet.name;
            btn.addEventListener('click', () => {
                insertSnippet(snippet.content);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.className = 'delete-snippet-btn';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteCustomSnippet(index);
            });
            
            const wrapper = document.createElement('div');
            wrapper.className = 'snippet-wrapper';
            wrapper.appendChild(btn);
            wrapper.appendChild(deleteBtn);
            container.appendChild(wrapper);
        });
    });
}

function deleteCustomSnippet(index) {
    chrome.storage.local.get(['customSnippets'], function(result) {
        const snippets = result.customSnippets || [];
        snippets.splice(index, 1);
        chrome.storage.local.set({ customSnippets: snippets });
        loadCustomSnippets();
        showStatus('Snippet deleted');
    });
}

// Settings functionality
function initializeSettings() {
    const settings = ['autoFormat', 'darkMode', 'syntaxTheme'];
    
    settings.forEach(settingId => {
        const element = document.getElementById(settingId);
        if (element) {
            element.addEventListener('change', () => {
                saveSetting(settingId, element.type === 'checkbox' ? element.checked : element.value);
            });
        }
    });
}

function loadSettings() {
    chrome.storage.local.get(['settings'], function(result) {
        const settings = result.settings || {};
        
        Object.keys(settings).forEach(settingId => {
            const element = document.getElementById(settingId);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[settingId];
                } else {
                    element.value = settings[settingId];
                }
            }
        });
    });
}

function saveSetting(key, value) {
    chrome.storage.local.get(['settings'], function(result) {
        const settings = result.settings || {};
        settings[key] = value;
        chrome.storage.local.set({ settings: settings });
        showStatus('Setting saved');
    });
}

// Utility functions
function showStatus(message) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.classList.add('show');
    
    setTimeout(() => {
        status.classList.remove('show');
        status.textContent = '';
    }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey) {
        switch(e.key) {
            case 'F':
                e.preventDefault();
                document.getElementById('formatCode').click();
                break;
            case 'C':
                e.preventDefault();
                document.getElementById('colorPicker').click();
                break;
        }
    }
}); 