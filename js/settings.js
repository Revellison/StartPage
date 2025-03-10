class Settings {
    constructor() {

        this.settingsBtn = document.getElementById('settings-btn');
        this.modal = document.getElementById('settings-modal');
        this.closeBtn = document.getElementById('close-settings');
        this.tabs = document.querySelectorAll('.tab-btn');
        
        this.bgUrlInput = document.getElementById('bg-url');
        this.applyBgBtn = document.getElementById('apply-bg');
        this.resetBgBtn = document.getElementById('reset-bg');
        this.bgBlurCheckbox = document.getElementById('bg-blur');
        this.bgOpacitySlider = document.getElementById('bg-opacity');
        

        this.sourceTabBtns = document.querySelectorAll('.source-tab');
        this.sourceContents = document.querySelectorAll('.source-content');
        this.bgFileInput = document.getElementById('bg-file');
        this.filePreview = document.querySelector('.file-preview');
        this.filePreviewImg = document.getElementById('file-preview-img');
        this.fileName = document.getElementById('file-name');
        

        this.themeButtons = document.querySelectorAll('.theme-btn');
        this.customThemeSettings = document.querySelector('.custom-theme-settings');
        this.customColorInputs = document.querySelectorAll('.custom-theme-settings input[type="color"]');
        

        this.hoverAnimationToggle = document.getElementById('hover-animation');
        this.transitionAnimationToggle = document.getElementById('transition-animation');
        this.backgroundAnimationToggle = document.getElementById('background-animation');
        

        this.uiScale = document.getElementById('ui-scale');
        this.layoutMode = document.getElementById('layout-mode');
        this.bookmarksPerRow = document.getElementById('bookmarks-per-row');
        this.searchPosition = document.getElementById('search-position');
        this.bookmarksPosition = document.getElementById('bookmarks-position');
        this.showBookmarks = document.getElementById('show-bookmarks');
        this.bookmarksStyle = document.getElementById('bookmarks-style');
        

        this.init();
    }

    init() {

        document.querySelector('.settings-content').classList.add('preload-tabs');
        

        this.loadSettings();
        

        this.settingsBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
        

        if (this.sourceTabBtns) {
            this.sourceTabBtns.forEach(tab => {
                tab.addEventListener('click', () => this.switchSourceTab(tab));
            });
        }
        
        this.applyBgBtn.addEventListener('click', () => this.applyBackground());
        this.resetBgBtn.addEventListener('click', () => this.resetBackground());
        this.bgBlurCheckbox.addEventListener('change', () => this.updateBackground());
        this.bgOpacitySlider.addEventListener('input', () => this.updateBackground());
        
        if (this.bgFileInput) {
            this.bgFileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setTheme(btn.dataset.theme));
        });
        

        this.customColorInputs.forEach(input => {
            input.addEventListener('input', () => this.updateCustomTheme());
        });
        

        this.hoverAnimationToggle.addEventListener('change', () => this.updateAnimations());
        this.transitionAnimationToggle.addEventListener('change', () => this.updateAnimations());
        this.backgroundAnimationToggle.addEventListener('change', () => this.updateAnimations());

        if (this.uiScale) {
            this.uiScale.addEventListener('change', () => this.updateDisplaySettings());
        }
        if (this.layoutMode) {
            this.layoutMode.addEventListener('change', () => this.updateDisplaySettings());
        }
        if (this.bookmarksPerRow) {
            this.bookmarksPerRow.addEventListener('change', () => this.updateDisplaySettings());
        }
        if (this.searchPosition) {
            this.searchPosition.addEventListener('change', () => this.updateDisplaySettings());
        }
        if (this.bookmarksPosition) {
            this.bookmarksPosition.addEventListener('change', () => this.updateDisplaySettings());
        }
        if (this.showBookmarks) {
            this.showBookmarks.addEventListener('change', () => this.updateDisplaySettings());
        }
        if (this.bookmarksStyle) {
            this.bookmarksStyle.addEventListener('change', () => this.updateDisplaySettings());
        }

        if (this.bgOpacitySlider) {
            const opacityValueElement = document.getElementById('opacity-value');
            if (opacityValueElement) {

                opacityValueElement.textContent = `${this.bgOpacitySlider.value}%`;

                this.bgOpacitySlider.addEventListener('input', () => {
                    opacityValueElement.textContent = `${this.bgOpacitySlider.value}%`;
                });
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    loadSettings() {

        const backgroundSettings = JSON.parse(localStorage.getItem('backgroundSettings') || '{}');
        
        if (backgroundSettings.image) {
            document.body.classList.add('has-background');
            document.body.style.setProperty('--bg-image', `url('${backgroundSettings.image}')`);
            
            if (backgroundSettings.blur) {
                document.body.style.setProperty('--bg-blur', `${backgroundSettings.blur}px`);
                this.bgBlurCheckbox.checked = true;
            }
            
            if (backgroundSettings.opacity) {
                document.body.style.setProperty('--bg-opacity', backgroundSettings.opacity);
                this.bgOpacitySlider.value = backgroundSettings.opacity * 100;
            }
            

            if (backgroundSettings.source === 'url' && backgroundSettings.url) {
                this.bgUrlInput.value = backgroundSettings.url;
                this.switchSourceTab('url');
            } else if (backgroundSettings.source === 'local' && backgroundSettings.dataUrl) {
                this.switchSourceTab('local');
                this.applyLocalBackground(backgroundSettings.dataUrl);
            }
        }
        

        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        

        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        if (theme === 'custom') {
            this.customThemeSettings.classList.add('show');
            
            const customColors = JSON.parse(localStorage.getItem('customColors') || '{}');
            
            for (const [varName, colorInput] of Object.entries(this.colorInputs)) {
                if (customColors[varName]) {
                    colorInput.value = customColors[varName];
                    document.documentElement.style.setProperty(varName, customColors[varName]);
                }
            }
        } else {
            this.customThemeSettings.classList.remove('show');
        }
        
        const animationsSettings = JSON.parse(localStorage.getItem('animationsSettings') || '{"hover":true,"transition":true,"background":false}');

        if (this.hoverAnimationToggle) {
            this.hoverAnimationToggle.checked = animationsSettings.hover;
        }
        if (this.transitionAnimationToggle) {
            this.transitionAnimationToggle.checked = animationsSettings.transition;
        }
        if (this.backgroundAnimationToggle) {
            this.backgroundAnimationToggle.checked = animationsSettings.background;
        }

        document.documentElement.setAttribute('data-hover', animationsSettings.hover);
        document.documentElement.setAttribute('data-transitions', animationsSettings.transition);
        document.documentElement.setAttribute('data-background', animationsSettings.background);
        
        if (animationsSettings.background) {
            document.body.classList.add('animated-background');
        }
        
        const displaySettings = JSON.parse(localStorage.getItem('displaySettings') || '{}');
        const defaultDisplaySettings = {
            scale: '1',
            layout: 'standard',
            bookmarksCount: '5',
            searchPos: 'center',
            bookmarksPos: 'middle',
            showBookmarks: true,
            bookmarksStyle: 'default'
        };

        const mergedSettings = { ...defaultDisplaySettings, ...displaySettings };
        
        this.applyDisplaySettings(
            mergedSettings.scale,
            mergedSettings.layout,
            mergedSettings.bookmarksCount,
            mergedSettings.searchPos,
            mergedSettings.bookmarksPos,
            mergedSettings.showBookmarks,
            mergedSettings.bookmarksStyle
        );
        
        if (this.uiScale) {
            this.uiScale.value = mergedSettings.scale;
        }
        if (this.layoutMode) {
            this.layoutMode.value = mergedSettings.layout;
        }
        if (this.bookmarksPerRow) {
            this.bookmarksPerRow.value = mergedSettings.bookmarksCount;
        }
        if (this.searchPosition) {
            this.searchPosition.value = mergedSettings.searchPos;
        }
        if (this.bookmarksPosition) {
            this.bookmarksPosition.value = mergedSettings.bookmarksPos;
        }
        if (this.showBookmarks) {
            this.showBookmarks.checked = mergedSettings.showBookmarks;
        }
        if (this.bookmarksStyle) {
            this.bookmarksStyle.value = mergedSettings.bookmarksStyle;
        }
    }

    openModal() {

        this.modal.classList.add('show');
        

        document.body.style.overflow = 'hidden';
        

        this.switchTab('appearance');

        this.modal.addEventListener('click', this.handleOutsideClick.bind(this));

        document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    closeModal() {

        this.modal.classList.remove('show');

        document.body.style.overflow = '';

        this.modal.removeEventListener('click', this.handleOutsideClick.bind(this));
        document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    handleOutsideClick(event) {

        if (event.target === this.modal) {
            this.closeModal();
        }
    }

    handleEscapeKey(event) {

        if (event.key === 'Escape') {
            this.closeModal();
        }
    }

    switchTab(tab) {

        const tabName = typeof tab === 'string' ? tab : tab.dataset.tab;
        

        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        

        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
            content.style.transform = 'translateX(10px)'; 
        });
        

        const activeButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');

            if (window.innerWidth <= 768) {
                activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
        
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
            
            if (window.innerWidth <= 768) {
                activeContent.parentElement.scrollTop = 0;
            }
            
            setTimeout(() => {
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateX(0)';
            }, 10);
            
            if (tabName === 'themes') {
                const isCustomTheme = document.documentElement.getAttribute('data-theme') === 'custom';
                if (isCustomTheme) {
                    this.customThemeSettings.classList.add('show');
                } else {
                    this.customThemeSettings.classList.remove('show');
                }
            }
        }
    }

    switchSourceTab(tab) {
        this.sourceTabBtns.forEach(t => t.classList.remove('active'));
        
        tab.classList.add('active');
        
        const sourceId = tab.dataset.source;
        
        this.sourceContents.forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`source-${sourceId}`).classList.add('active');
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите файл изображения');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            this.filePreviewImg.src = event.target.result;
            this.fileName.textContent = file.name;
            this.filePreview.classList.add('show');
            
            this.applyLocalBackground(event.target.result);
        };
        
        reader.readAsDataURL(file);
    }

    applyLocalBackground(dataUrl) {
        document.body.classList.add('has-background');
        document.body.style.setProperty('--bg-image', `url(${dataUrl})`);
        
        this.saveBackgroundSettings(dataUrl);
    }

    applyBackground() {
        const url = this.bgUrlInput.value.trim();
        if (!url) return;
        
        document.body.classList.add('has-background');
        document.body.style.setProperty('--bg-image', `url(${url})`);
        this.saveBackgroundSettings(url);
    }

    resetBackground() {
        this.bgUrlInput.value = '';
        document.body.classList.remove('has-background');
        document.body.style.removeProperty('--bg-image');
        this.saveBackgroundSettings();
    }

    updateBackground() {
        const blurEnabled = this.bgBlurCheckbox.checked;
        const opacityValue = this.bgOpacitySlider.value;
        
        const opacityValueElement = document.getElementById('opacity-value');
        if (opacityValueElement) {
            opacityValueElement.textContent = `${opacityValue}%`;
        }
        
        document.body.style.setProperty('--bg-blur', blurEnabled ? '10px' : '0px');
        document.body.style.setProperty('--bg-opacity', opacityValue / 100);
        
        this.saveBackgroundSettings();
    }

    saveBackgroundSettings(imageSource = null) {
        const url = imageSource || this.bgUrlInput.value;
        const settings = {
            url: url,
            blur: this.bgBlurCheckbox.checked,
            opacity: this.bgOpacitySlider.value,
            isLocal: !!imageSource
        };
        
        localStorage.setItem('bgSettings', JSON.stringify(settings));
    }

    setTheme(theme) {
        localStorage.setItem('theme', theme);
        
        document.documentElement.setAttribute('data-theme', theme);
        
        this.themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        if (theme === 'custom') {
            this.customThemeSettings.classList.add('show');
        } else {
            this.customThemeSettings.classList.remove('show');
        }
    }

    updateCustomTheme() {
        const customTheme = {};
        
        this.customColorInputs.forEach(input => {
            const cssVar = input.dataset.var;
            const color = input.value;
            
            document.documentElement.style.setProperty(cssVar, color);
            customTheme[cssVar] = color;
        });
        
        localStorage.setItem('customTheme', JSON.stringify(customTheme));
    }

    updateAnimations() {
        const hoverAnimation = this.hoverAnimationToggle.checked;
        const transitionAnimation = this.transitionAnimationToggle.checked;
        const backgroundAnimation = this.backgroundAnimationToggle.checked;
        
        const animationsSettings = {
            hover: hoverAnimation,
            transition: transitionAnimation,
            background: backgroundAnimation
        };
        
        localStorage.setItem('animationsSettings', JSON.stringify(animationsSettings));
        
        document.documentElement.setAttribute('data-hover', hoverAnimation);
        document.documentElement.setAttribute('data-transitions', transitionAnimation);
        document.documentElement.setAttribute('data-background', backgroundAnimation);
        
        if (backgroundAnimation) {
            document.body.classList.add('animated-background');
        } else {
            document.body.classList.remove('animated-background');
        }
    }

    updateDisplaySettings() {
        const scale = this.uiScale.value;
        const layout = this.layoutMode.value;
        const bookmarksCount = this.bookmarksPerRow.value;
        const searchPos = this.searchPosition.value;
        const bookmarksPos = this.bookmarksPosition.value;
        const showBookmarks = this.showBookmarks.checked;
        const bookmarksStyle = this.bookmarksStyle.value;
        
        localStorage.setItem('displaySettings', JSON.stringify({
            scale, layout, bookmarksCount, searchPos, bookmarksPos, showBookmarks, bookmarksStyle
        }));
        
        this.applyDisplaySettings(
            scale, 
            layout, 
            bookmarksCount, 
            searchPos, 
            bookmarksPos, 
            showBookmarks,
            bookmarksStyle
        );
    }

    applyDisplaySettings(scale, layout, bookmarksCount, searchPos, bookmarksPos, showBookmarks, bookmarksStyle) {
        document.documentElement.style.setProperty('--ui-scale', scale);
        
        document.documentElement.classList.add('layout-transition');
        
        document.documentElement.setAttribute('data-layout', layout);
        document.documentElement.setAttribute('data-search-position', searchPos);
        document.documentElement.setAttribute('data-bookmarks-position', bookmarksPos);
        document.documentElement.setAttribute('data-show-bookmarks', showBookmarks);
        
        document.documentElement.setAttribute('data-bookmarks-style', bookmarksStyle);
        
        if (bookmarksCount === 'auto') {
            document.documentElement.style.removeProperty('--bookmark-columns');
        } else {
            document.documentElement.style.setProperty('--bookmark-columns', bookmarksCount);
            
            const bookmarksGrid = document.querySelector('.bookmarks-grid');
            if (bookmarksGrid) {
                const containerWidth = document.querySelector('.bookmarks-container').offsetWidth;
                const gapSize = 16;
                const itemWidth = Math.floor((containerWidth - (gapSize * (bookmarksCount - 1))) / bookmarksCount);
                document.documentElement.style.setProperty('--bookmark-item-width', `${itemWidth}px`);
            }
        }
        
        setTimeout(() => {
            document.documentElement.classList.remove('layout-transition');
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new Settings();
}); 