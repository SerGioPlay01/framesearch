/**
 * Framesearch - Slideshow & Presentation Mode
 * Режим презентации и слайдшоу
 * 
 * Автор: SerGioPlay
 * © 2026 Framesearch
 */

class SlideshowManager {
    constructor() {
        this.isPlaying = false;
        this.currentIndex = 0;
        this.videos = [];
        this.interval = null;
        this.settings = {
            duration: 5000, // 5 секунд
            shuffle: false,
            showInfo: true,
            autoplay: true
        };
    }

    // Начать слайдшоу
    async start(videos = null, settings = {}) {
        if (!videos) {
            // Check if db is available
            if (typeof db !== 'undefined' && db.getAllVideos) {
                videos = await db.getAllVideos();
            } else if (typeof window.db !== 'undefined' && window.db.getAllVideos) {
                videos = await window.db.getAllVideos();
            } else {
                console.error('Database not available');
                const t = (key) => {
                    if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                        return i18n.t(key);
                    }
                    return key;
                };
                
                if (typeof dialog !== 'undefined' && dialog.alert) {
                    await dialog.alert(
                        t('slideshow.dbUnavailable'),
                        t('slideshow.title')
                    );
                } else {
                    alert(t('slideshow.dbUnavailable'));
                }
                return;
            }
        }

        if (!videos || videos.length === 0) {
            const t = (key) => {
                if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                    return i18n.t(key);
                }
                return key;
            };
            
            if (typeof dialog !== 'undefined' && dialog.alert) {
                await dialog.alert(t('slideshow.noVideos'), t('slideshow.title'));
            } else {
                alert(t('slideshow.noVideos'));
            }
            return;
        }

        this.videos = videos;
        this.settings = { ...this.settings, ...settings };
        this.currentIndex = 0;

        if (this.settings.shuffle) {
            this.shuffleVideos();
        }

        this.createSlideshowUI();
        this.isPlaying = this.settings.autoplay;
        
        // Показать первый слайд сразу
        this.showSlide(0);
        
        if (this.isPlaying) {
            this.play();
        }

        if (typeof logger !== 'undefined') {
            logger.info('🎭 Слайдшоу', 'Запущено');
        }
    }

    // Перемешать видео
    shuffleVideos() {
        for (let i = this.videos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.videos[i], this.videos[j]] = [this.videos[j], this.videos[i]];
        }
    }

    // Создать UI слайдшоу
    createSlideshowUI() {
        const html = `
            <div id="slideshowContainer" class="slideshow-fullscreen">
                <div class="slideshow-background"></div>
                
                <!-- Слайд -->
                <div class="slideshow-slide" id="slideshowSlide">
                    <img id="slideshowImage" src="" alt="Poster">
                </div>

                <!-- Информация -->
                <div class="slideshow-info ${this.settings.showInfo ? '' : 'hidden'}" id="slideshowInfo">
                    <h2 id="slideshowTitle"></h2>
                    <p id="slideshowMeta"></p>
                    <p id="slideshowDescription"></p>
                </div>

                <!-- Управление -->
                <div class="slideshow-controls">
                    <button onclick="slideshowManager.previous()" class="slideshow-btn" title="Предыдущий">
                        <i data-lucide="chevron-left"></i>
                    </button>
                    
                    <button onclick="slideshowManager.togglePlay()" class="slideshow-btn" id="slideshowPlayBtn" title="Пауза/Воспроизведение">
                        <i data-lucide="${this.isPlaying ? 'pause' : 'play'}"></i>
                    </button>
                    
                    <button onclick="slideshowManager.next()" class="slideshow-btn" title="Следующий">
                        <i data-lucide="chevron-right"></i>
                    </button>
                    
                    <button onclick="slideshowManager.toggleInfo()" class="slideshow-btn" title="Показать/Скрыть информацию">
                        <i data-lucide="info"></i>
                    </button>
                    
                    <button onclick="slideshowManager.openSettings()" class="slideshow-btn" title="Настройки">
                        <i data-lucide="settings"></i>
                    </button>
                    
                    <button onclick="slideshowManager.stop()" class="slideshow-btn" title="Выход">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <!-- Прогресс -->
                <div class="slideshow-progress">
                    <div class="slideshow-progress-bar" id="slideshowProgressBar"></div>
                </div>

                <!-- Счетчик -->
                <div class="slideshow-counter" id="slideshowCounter">
                    1 / ${this.videos.length}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Клавиатурные события
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    // Показать слайд
    showSlide(index) {
        if (index < 0) index = this.videos.length - 1;
        if (index >= this.videos.length) index = 0;

        this.currentIndex = index;
        const video = this.videos[index];

        // Обновить изображение
        const img = document.getElementById('slideshowImage');
        if (img) {
            img.src = video.poster || 'https://via.placeholder.com/1920x1080?text=No+Poster';
            img.alt = video.title;
        }

        // Обновить информацию
        if (this.settings.showInfo) {
            const title = document.getElementById('slideshowTitle');
            const meta = document.getElementById('slideshowMeta');
            const desc = document.getElementById('slideshowDescription');

            if (title) title.textContent = video.title;
            if (meta) meta.textContent = `${video.year || ''} • ${video.genre || ''} • ⭐ ${video.rating.toFixed(1)}`;
            if (desc) desc.textContent = video.description || '';
        }

        // Обновить счетчик
        const counter = document.getElementById('slideshowCounter');
        if (counter) {
            counter.textContent = `${index + 1} / ${this.videos.length}`;
        }

        // Анимация появления
        const slide = document.getElementById('slideshowSlide');
        if (slide) {
            slide.style.animation = 'none';
            setTimeout(() => {
                slide.style.animation = 'slideshow-fade-in 0.5s ease';
            }, 10);
        }
    }

    // Воспроизведение
    play() {
        // Если только одно видео, не запускаем автопроигрывание
        if (this.videos.length === 1) {
            this.isPlaying = false;
            this.updatePlayButton();
            return;
        }
        
        this.isPlaying = true;
        this.updatePlayButton();
        
        this.interval = setInterval(() => {
            this.next();
        }, this.settings.duration);

        this.startProgressBar();
    }

    // Пауза
    pause() {
        this.isPlaying = false;
        this.updatePlayButton();
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.stopProgressBar();
    }

    // Переключить воспроизведение
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    // Обновить кнопку воспроизведения
    updatePlayButton() {
        const btn = document.getElementById('slideshowPlayBtn');
        if (btn) {
            btn.innerHTML = `<i data-lucide="${this.isPlaying ? 'pause' : 'play'}"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // Следующий слайд
    next() {
        // Если только одно видео, не переключаем
        if (this.videos.length === 1) {
            if (this.isPlaying) {
                this.restartProgressBar();
            }
            return;
        }
        
        const nextIndex = this.currentIndex + 1;
        
        // Если достигли конца и не в режиме shuffle, останавливаем
        if (nextIndex >= this.videos.length && !this.settings.shuffle) {
            this.pause();
            this.showSlide(0); // Вернуться к первому
            return;
        }
        
        this.showSlide(nextIndex);
        if (this.isPlaying) {
            this.restartProgressBar();
        }
    }

    // Предыдущий слайд
    previous() {
        this.showSlide(this.currentIndex - 1);
        if (this.isPlaying) {
            this.restartProgressBar();
        }
    }

    // Переключить информацию
    toggleInfo() {
        this.settings.showInfo = !this.settings.showInfo;
        const info = document.getElementById('slideshowInfo');
        if (info) {
            info.classList.toggle('hidden');
        }
    }

    // Прогресс-бар
    startProgressBar() {
        const bar = document.getElementById('slideshowProgressBar');
        if (bar) {
            bar.style.transition = `width ${this.settings.duration}ms linear`;
            bar.style.width = '100%';
        }
    }

    stopProgressBar() {
        const bar = document.getElementById('slideshowProgressBar');
        if (bar) {
            const currentWidth = bar.offsetWidth;
            const containerWidth = bar.parentElement.offsetWidth;
            const percentage = (currentWidth / containerWidth) * 100;
            bar.style.transition = 'none';
            bar.style.width = `${percentage}%`;
        }
    }

    restartProgressBar() {
        const bar = document.getElementById('slideshowProgressBar');
        if (bar) {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = `width ${this.settings.duration}ms linear`;
                bar.style.width = '100%';
            }, 50);
        }
    }

    // Настройки
    openSettings() {
        this.pause();

        const settingsHTML = `
            <div id="slideshowSettings" class="slideshow-settings-panel">
                <h3>Настройки слайдшоу</h3>
                
                <label>
                    <span>Длительность слайда:</span>
                    <select id="slideshowDuration">
                        <option value="3000" ${this.settings.duration === 3000 ? 'selected' : ''}>3 секунды</option>
                        <option value="5000" ${this.settings.duration === 5000 ? 'selected' : ''}>5 секунд</option>
                        <option value="10000" ${this.settings.duration === 10000 ? 'selected' : ''}>10 секунд</option>
                        <option value="15000" ${this.settings.duration === 15000 ? 'selected' : ''}>15 секунд</option>
                        <option value="30000" ${this.settings.duration === 30000 ? 'selected' : ''}>30 секунд</option>
                    </select>
                </label>

                <label>
                    <input type="checkbox" id="slideshowShuffle" ${this.settings.shuffle ? 'checked' : ''}>
                    <span>Случайный порядок</span>
                </label>

                <label>
                    <input type="checkbox" id="slideshowShowInfo" ${this.settings.showInfo ? 'checked' : ''}>
                    <span>Показывать информацию</span>
                </label>

                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button onclick="slideshowManager.applySettings()" class="btn btn-primary">Применить</button>
                    <button onclick="slideshowManager.closeSettings()" class="btn btn-secondary">Отмена</button>
                </div>
            </div>
        `;

        const container = document.getElementById('slideshowContainer');
        if (container) {
            const oldSettings = document.getElementById('slideshowSettings');
            if (oldSettings) oldSettings.remove();
            
            container.insertAdjacentHTML('beforeend', settingsHTML);
        }
    }

    applySettings() {
        const duration = document.getElementById('slideshowDuration')?.value;
        const shuffle = document.getElementById('slideshowShuffle')?.checked;
        const showInfo = document.getElementById('slideshowShowInfo')?.checked;

        if (duration) this.settings.duration = parseInt(duration, 10);
        if (shuffle !== undefined) this.settings.shuffle = shuffle;
        if (showInfo !== undefined) this.settings.showInfo = showInfo;

        if (shuffle && !this.settings.shuffle) {
            this.shuffleVideos();
            this.showSlide(0);
        }

        this.closeSettings();
        this.play();
    }

    closeSettings() {
        const settings = document.getElementById('slideshowSettings');
        if (settings) settings.remove();
    }

    // Обработка клавиш
    handleKeyPress(e) {
        if (!this.isPlaying && e.key !== 'Escape') return;

        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.next();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previous();
                break;
            case 'Escape':
                e.preventDefault();
                this.stop();
                break;
            case 'p':
            case 'P':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'i':
            case 'I':
                e.preventDefault();
                this.toggleInfo();
                break;
        }
    }

    // Остановить слайдшоу
    stop() {
        this.pause();
        
        const container = document.getElementById('slideshowContainer');
        if (container) {
            container.remove();
        }

        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeyPress);

        this.videos = [];
        this.currentIndex = 0;

        if (typeof logger !== 'undefined') {
            logger.info('🎭 Слайдшоу', 'Остановлено');
        }
    }
}

// Создать глобальный экземпляр
const slideshowManager = new SlideshowManager();
window.slideshowManager = slideshowManager;

if (typeof logger !== 'undefined') {
    logger.success('Slideshow Manager initialized');
}
