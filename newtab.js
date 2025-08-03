// New Tab Page JavaScript for Developer Helper Extension

document.addEventListener('DOMContentLoaded', function() {
    initializeTime();
    initializeWeather();
    initializeTools();
    initializeParticles();
    initializeWelcomeMessage();
    initializeSearch();
});

// Time and Date Display
function initializeTime() {
    function updateTime() {
        const now = new Date();
        
        // Update time
        const timeElement = document.getElementById('time');
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        timeElement.textContent = timeString;
        
        // Update date
        const dateElement = document.getElementById('date');
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.textContent = dateString;
    }
    
    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

// Weather Display (Placeholder - you can integrate with a weather API)
function initializeWeather() {
    // This is a placeholder. You can integrate with OpenWeatherMap or similar API
    const weatherCard = document.querySelector('.weather-card');
    
    // Check if weather card exists (it might be commented out)
    if (!weatherCard) {
        // console.log('Weather card not found - skipping weather initialization');
        return;
    }
    
    // Simulate weather data (replace with real API call)
    const weatherData = {
        temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
        condition: '☀️',
        location: 'Your City'
    };
    
    const temperatureElement = weatherCard.querySelector('.temperature');
    const locationElement = weatherCard.querySelector('.location');
    const iconElement = weatherCard.querySelector('.weather-icon');
    
    if (temperatureElement) temperatureElement.textContent = `${weatherData.temperature}°C`;
    if (locationElement) locationElement.textContent = weatherData.location;
    if (iconElement) iconElement.textContent = weatherData.condition;
    
    // Add click to refresh
    weatherCard.addEventListener('click', function() {
        // You can add weather API integration here
        // console.log('Weather refresh clicked');
    });
}

// Developer Tools Integration
function initializeTools() {
    const tools = {
        formatCode: () => {
            // This would work if there's code on the page
            console.log('Format Code clicked');
            showNotification('Format Code tool activated');
        },
        syntaxHighlight: () => {
            console.log('Syntax Highlight clicked');
            showNotification('Syntax Highlight tool activated');
        },
        colorPicker: () => {
            console.log('Color Picker clicked');
            showNotification('Color Picker tool activated');
        },
        jsonFormatter: () => {
            // console.log('JSON Formatter clicked');
            showNotification('JSON Formatter tool activated');
        }
    };
    
    // Add event listeners to tool buttons
    Object.keys(tools).forEach(toolId => {
        const btn = document.getElementById(toolId);
        if (btn) {
            btn.addEventListener('click', tools[toolId]);
        } else {
            // console.log(`Tool button ${toolId} not found - skipping`);
        }
    });
}

// Particle Animation Enhancement
function initializeParticles() {
    const particles = document.querySelectorAll('.particle');
    
    // Add mouse interaction to particles
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
            );
            
            if (distance < 100) {
                particle.style.transform = `scale(1.5)`;
                particle.style.background = 'rgba(255, 255, 255, 0.9)';
            } else {
                particle.style.transform = `scale(1)`;
                particle.style.background = 'rgba(255, 255, 255, 0.6)';
            }
        });
    });
}

// Dynamic Welcome Message
function initializeWelcomeMessage() {
    const welcomeTitle = document.querySelector('.welcome-title');
    const hour = new Date().getHours();
    
    let greeting = 'Welcome, Developer!';
    
    if (hour < 12) {
        greeting = 'Good Morning, Developer!';
    } else if (hour < 17) {
        greeting = 'Good Afternoon, Developer!';
    } else if (hour < 21) {
        greeting = 'Good Evening, Developer!';
    } else {
        greeting = 'Good Night, Developer!';
    }
    
    welcomeTitle.textContent = greeting;
    
    // Add typing effect
    typeWriter(welcomeTitle, greeting, 0);
}

// Typing Effect
function typeWriter(element, text, i) {
    if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        setTimeout(() => typeWriter(element, text, i + 1), 100);
    }
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
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
`;
document.head.appendChild(style);

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N to open new tab (already handled by browser)
    // Ctrl/Cmd + T to open new tab (already handled by browser)
    
    // Custom shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'g':
                e.preventDefault();
                window.open('https://github.com', '_blank');
                break;
            case 's':
                e.preventDefault();
                window.open('https://stackoverflow.com', '_blank');
                break;
            case 'm':
                e.preventDefault();
                window.open('https://developer.mozilla.org', '_blank');
                break;
            case 'c':
                e.preventDefault();
                window.open('https://codepen.io', '_blank');
                break;
        }
    }
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    // console.log('Search elements found:', {
    //     searchInput: !!searchInput,
    //     searchBtn: !!searchBtn,
    //     searchSuggestions: !!searchSuggestions
    // });
    
    let selectedIndex = -1;
    let suggestions = [];
    
    // Common developer websites and shortcuts
    const quickSites = {
        'github': 'https://github.com',
        'gh': 'https://github.com',
        'stackoverflow': 'https://stackoverflow.com',
        'so': 'https://stackoverflow.com',
        'mdn': 'https://developer.mozilla.org',
        'docs': 'https://developer.mozilla.org',
        'codepen': 'https://codepen.io',
        'cp': 'https://codepen.io',
        'jsfiddle': 'https://jsfiddle.net',
        'jsf': 'https://jsfiddle.net',
        'replit': 'https://replit.com',
        'repl': 'https://replit.com',
        'npm': 'https://www.npmjs.com',
        'youtube': 'https://www.youtube.com',
        'yt': 'https://www.youtube.com',
        'reddit': 'https://www.reddit.com',
        'r/': 'https://www.reddit.com/r/',
        'twitter': 'https://twitter.com',
        'tw': 'https://twitter.com',
        'linkedin': 'https://linkedin.com',
        'gmail': 'https://mail.google.com',
        'drive': 'https://drive.google.com',
        'maps': 'https://maps.google.com',
        'translate': 'https://translate.google.com',
        'calendar': 'https://calendar.google.com'
    };
    
    // Developer tools and resources
    const devTools = [
        { name: 'GitHub', url: 'https://github.com', icon: '📚' },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '❓' },
        { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📖' },
        { name: 'CodePen', url: 'https://codepen.io', icon: '✏️' },
        { name: 'JSFiddle', url: 'https://jsfiddle.net', icon: '🎻' },
        { name: 'Replit', url: 'https://replit.com', icon: '🚀' },
        { name: 'NPM', url: 'https://www.npmjs.com', icon: '📦' },
        { name: 'Dev.to', url: 'https://dev.to', icon: '💻' },
        { name: 'CSS-Tricks', url: 'https://css-tricks.com', icon: '🎨' },
        { name: 'Web.dev', url: 'https://web.dev', icon: '🌐' },
        { name: 'Can I Use', url: 'https://caniuse.com', icon: '✅' },
        { name: 'W3Schools', url: 'https://www.w3schools.com', icon: '🎓' }
    ];
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;
        
        // Check if it's a quick site shortcut
        const lowerQuery = query.toLowerCase();
        if (quickSites[lowerQuery]) {
            window.open(quickSites[lowerQuery], '_blank');
            return;
        }
        
        // Check if it's a URL
        if (isValidUrl(query)) {
            let url = query;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
            return;
        }
        
        // Default to Google search
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
    
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    function generateSuggestions(query) {
        // console.log('generateSuggestions called with:', query);
        if (!query.trim()) {
            suggestions = [];
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        suggestions = [];
        
        // Add quick site matches
        Object.keys(quickSites).forEach(key => {
            if (key.includes(lowerQuery)) {
                suggestions.push({
                    text: `Go to ${key}`,
                    url: quickSites[key],
                    icon: '🌐',
                    type: 'Quick Site'
                });
            }
        });
        
        // Add developer tools matches
        devTools.forEach(tool => {
            if (tool.name.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: tool.name,
                    url: tool.url,
                    icon: tool.icon,
                    type: 'Developer Tool'
                });
            }
        });
        
        // Add Google search suggestion
        suggestions.push({
            text: `Search Google for "${query}"`,
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            icon: '🔍',
            type: 'Google Search'
        });
        
        // console.log('Generated suggestions:', suggestions.length);
    }
    
    function showSuggestions() {
        // console.log('showSuggestions called, suggestions length:', suggestions.length);
        if (suggestions.length === 0) {
            searchSuggestions.style.display = 'none';
            return;
        }
        
        searchSuggestions.innerHTML = '';
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.innerHTML = `
                <div class="suggestion-icon">${suggestion.icon}</div>
                <div class="suggestion-text">${suggestion.text}</div>
                <div class="suggestion-type">${suggestion.type}</div>
            `;
            
            item.addEventListener('click', () => {
                window.open(suggestion.url, '_blank');
                searchSuggestions.style.display = 'none';
                searchInput.value = '';
            });
            
            item.addEventListener('mouseenter', () => {
                selectedIndex = index;
                updateSelectedSuggestion();
            });
            
            searchSuggestions.appendChild(item);
        });
        
        searchSuggestions.style.display = 'block';
        // console.log('Suggestions displayed, count:', suggestions.length);
        selectedIndex = -1;
    }
    
    function updateSelectedSuggestion() {
        const items = searchSuggestions.querySelectorAll('.search-suggestion-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    }
    
    function hideSuggestions() {
        searchSuggestions.style.display = 'none';
        selectedIndex = -1;
    }
    
    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('input', function() {
        // console.log('Input event triggered:', this.value);
        generateSuggestions(this.value);
        showSuggestions();
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                window.open(suggestions[selectedIndex].url, '_blank');
                hideSuggestions();
                this.value = '';
            } else {
                performSearch();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
            updateSelectedSuggestion();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelectedSuggestion();
        } else if (e.key === 'Escape') {
            hideSuggestions();
            this.blur();
        }
    });
    
    searchInput.addEventListener('focus', function() {
        if (suggestions.length > 0) {
            showSuggestions();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            hideSuggestions();
        }
    });
    
    // Focus search input on page load
    setTimeout(() => {
        searchInput.focus();
    }, 500);
}

// Performance optimization
window.addEventListener('load', function() {
    // Preload common developer sites
    const links = [
        'https://github.com',
        'https://stackoverflow.com',
        'https://developer.mozilla.org'
    ];
    
    links.forEach(link => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preconnect';
        preloadLink.href = link;
        document.head.appendChild(preloadLink);
    });
});

// Add some interactivity to action cards
document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// console.log('New Tab Page loaded successfully!'); 