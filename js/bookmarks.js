const bookmarksContainer = document.getElementById('bookmarks');
const addBookmarkBtn = document.getElementById('add-bookmark');
const bookmarkModal = document.getElementById('bookmark-modal');
const bookmarkTitleInput = document.getElementById('bookmark-title');
const bookmarkUrlInput = document.getElementById('bookmark-url');
const bookmarkIconInput = document.getElementById('bookmark-icon');
const saveBookmarkBtn = document.getElementById('save-bookmark');
const cancelBookmarkBtn = document.getElementById('cancel-bookmark');

let bookmarks = [];

function init() {
    loadBookmarks();
    
    addBookmarkBtn.addEventListener('click', openBookmarkModal);
    saveBookmarkBtn.addEventListener('click', addBookmark);
    cancelBookmarkBtn.addEventListener('click', closeBookmarkModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === bookmarkModal) {
            closeBookmarkModal();
        }
    });

    bookmarkUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addBookmark();
        }
    });

    bookmarkTitleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addBookmark();
        }
    });

    bookmarkUrlInput.addEventListener('blur', autoFillBookmarkDetails);
}

function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
        renderBookmarks();
    }
}

function openBookmarkModal() {
    clearBookmarkForm();
    bookmarkModal.classList.add('show');
    setTimeout(() => bookmarkTitleInput.focus(), 300);
}

function closeBookmarkModal() {
    bookmarkModal.classList.remove('show');
    clearBookmarkForm();
}

function clearBookmarkForm() {
    bookmarkTitleInput.value = '';
    bookmarkUrlInput.value = '';
    bookmarkIconInput.value = '';
}

function autoFillBookmarkDetails() {
    const url = bookmarkUrlInput.value.trim();
    
    if (!url) return;
    
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
        bookmarkUrlInput.value = fullUrl;
    }

    try {
        const domain = new URL(fullUrl).hostname;
        
        if (!bookmarkTitleInput.value) {
            const cleanDomain = domain.replace(/^www\./, '');
            bookmarkTitleInput.value = cleanDomain;
        }
        
        if (!bookmarkIconInput.value) {
            bookmarkIconInput.value = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        }
    } catch (e) {
        console.error('Неверный URL:', e);
    }
}

function addBookmark() {
    const title = bookmarkTitleInput.value.trim();
    let url = bookmarkUrlInput.value.trim();
    let iconUrl = bookmarkIconInput.value.trim();
    
    if (!title || !url) {
        showValidationError();
        return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    try {
        new URL(url);
        
        if (!iconUrl) {
            const domain = new URL(url).hostname;
            iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        }
        
        const newBookmark = {
            id: Date.now(),
            title,
            url,
            icon: iconUrl
        };
        
        bookmarks.push(newBookmark);
        saveBookmarks();
        renderBookmarks();
        closeBookmarkModal();
        
    } catch (e) {
        showValidationError('Неверный URL. Пожалуйста, проверьте адрес.');
    }
}

function showValidationError(message = 'Пожалуйста, заполните все обязательные поля') {
    alert(message);
}

function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function deleteBookmark(id) {
    if (confirm('Вы уверены, что хотите удалить эту закладку?')) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        saveBookmarks();
        renderBookmarks();
    }
}

function renderBookmarks() {
    bookmarksContainer.innerHTML = '';
    
    if (bookmarks.length === 0) {
        bookmarksContainer.innerHTML = '<div class="empty-bookmarks">У вас пока нет закладок</div>';
        return;
    }
    
    bookmarks.forEach(bookmark => {
        const bookmarkElement = createBookmarkElement(bookmark);
        bookmarksContainer.appendChild(bookmarkElement);
    });
}

function createBookmarkElement(bookmark) {
    const bookmarkElement = document.createElement('a');
    bookmarkElement.href = bookmark.url;
    bookmarkElement.className = 'bookmark-item';
    bookmarkElement.target = '_blank';
    bookmarkElement.rel = 'noopener noreferrer';
    
    const iconElement = document.createElement('img');
    iconElement.src = bookmark.icon || 'images/default-icon.png';
    iconElement.alt = bookmark.title;
    iconElement.className = 'bookmark-icon';
    iconElement.onerror = function() {
        this.src = 'https://placehold.co/48x48/4f46e5/ffffff?text=' + bookmark.title.charAt(0).toUpperCase();
    };
    
    const titleElement = document.createElement('span');
    titleElement.className = 'bookmark-title';
    titleElement.textContent = bookmark.title;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-bookmark';
    deleteButton.innerHTML = '<i class="fas fa-times"></i>';
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteBookmark(bookmark.id);
    });
    
    bookmarkElement.appendChild(iconElement);
    bookmarkElement.appendChild(titleElement);
    bookmarkElement.appendChild(deleteButton);
    
    return bookmarkElement;
}

init(); 