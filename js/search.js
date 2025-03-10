
const searchEngines = {
    google: 'https://www.google.com/search?q=',
    yandex: 'https://yandex.ru/search/?text=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q='
};

const searchInput = document.getElementById('search-input');
const searchEngine = document.getElementById('search-engine');
const searchButton = document.getElementById('search-button');

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

searchButton.addEventListener('click', performSearch);

function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        const selectedEngine = searchEngine.value;
        const searchUrl = searchEngines[selectedEngine] + encodeURIComponent(query);
        window.location.href = searchUrl;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const searchEngine = document.getElementById('search-engine');
    

    const updateSelectStyles = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--surface-color').trim();
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        

        const styleSheet = document.createElement('style');
        styleSheet.id = 'select-styles';
        

        const existingStyle = document.getElementById('select-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        styleSheet.textContent = `
            #search-engine, #search-engine option {
                background-color: ${surfaceColor};
                color: ${textColor};
            }
            #search-engine option:checked,
            #search-engine option:hover {
                background-color: var(--primary-color);
                color: white;
            }
        `;
        
        document.head.appendChild(styleSheet);
    };
    

    updateSelectStyles();
    

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateSelectStyles();
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
}); 