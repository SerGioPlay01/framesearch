/**
 * Framesearch - View Modes Manager
 * Manages List / Grid / Poster view modes
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class ViewModesManager {
    constructor() {
        this.currentMode = localStorage.getItem('framesearch-view-mode') || 'grid';
        this.cardsGrid = null;
    }

    async init() {
        this.cardsGrid = document.querySelector('.cards-grid');
        if (!this.cardsGrid) return;

        // Apply saved view mode immediately without animation
        this.cardsGrid.classList.add(`view-${this.currentMode}`);
        
        this.createViewModeToggle();
        this.attachEventListeners();
    }

    createViewModeToggle() {
        const sectionHeader = document.getElementById('mainSectionHeader');
        if (!sectionHeader) return;

        // Check if toggle already exists
        if (document.querySelector('.view-mode-toggle')) return;

        const toggleHTML = `
            <div class="view-mode-toggle">
                <button class="view-mode-btn ${this.currentMode === 'list' ? 'active' : ''}" 
                        data-mode="list" 
                        title="Список">
                    <i data-lucide="list"></i>
                </button>
                <button class="view-mode-btn ${this.currentMode === 'grid' ? 'active' : ''}" 
                        data-mode="grid" 
                        title="Плитка">
                    <i data-lucide="grid"></i>
                </button>
                <button class="view-mode-btn ${this.currentMode === 'poster' ? 'active' : ''}" 
                        data-mode="poster" 
                        title="Постеры">
                    <i data-lucide="image"></i>
                </button>
            </div>
        `;

        // Insert after section title
        const sectionTitle = sectionHeader.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.insertAdjacentHTML('afterend', toggleHTML);
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    attachEventListeners() {
        const viewModeButtons = document.querySelectorAll('.view-mode-btn');
        viewModeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.switchViewMode(mode);
            });
        });
    }

    async switchViewMode(mode) {
        if (mode === this.currentMode) return;

        // Update active button immediately
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Apply view mode without delay
        await this.applyViewMode(mode);
        this.currentMode = mode;
        localStorage.setItem('framesearch-view-mode', mode);

        // Reinitialize responsive features
        if (typeof initFilterButtonsScroll === 'function') {
            initFilterButtonsScroll();
        }
    }

    async applyViewMode(mode) {
        if (!this.cardsGrid) return;

        // Add transitioning class for smooth animation
        this.cardsGrid.style.opacity = '0';
        
        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 150));

        // Remove all view mode classes
        this.cardsGrid.classList.remove('view-list', 'view-grid', 'view-poster');
        
        // Add new view mode class
        this.cardsGrid.classList.add(`view-${mode}`);

        // Regenerate cards with appropriate structure
        await this.regenerateCards(mode);

        // Fade in
        this.cardsGrid.style.opacity = '1';
    }

    async regenerateCards(mode) {
        // Get current videos from cards
        const cards = this.cardsGrid.querySelectorAll('.card');
        const videosData = [];

        cards.forEach(card => {
            const videoId = card.dataset.id;
            if (videoId) {
                videosData.push({
                    id: videoId,
                    element: card
                });
            }
        });

        // Clear grid
        this.cardsGrid.innerHTML = '';

        // Regenerate cards based on mode
        for (const { element } of videosData) {
            const newCard = await this.createCardForMode(element, mode);
            this.cardsGrid.appendChild(newCard);
        }

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Reattach event listeners
        this.reattachCardListeners();
    }

    async createCardForMode(originalCard, mode) {
        const videoId = parseInt(originalCard.dataset.id);
        const img = originalCard.querySelector('.card-image img');
        const title = originalCard.querySelector('.card-title');
        const rating = originalCard.querySelector('.card-rating');
        const favorite = originalCard.querySelector('.card-favorite');
        const isFavorite = favorite?.classList.contains('active');

        const posterUrl = img?.src || '';
        const titleText = title?.textContent || '';
        const ratingText = rating?.textContent || '0.0';

        // Fetch actual video data from database
        let videoData = null;
        try {
            videoData = await db.getVideo(videoId);
        } catch (error) {
            logger.error('Error fetching video data', error);
        }

        // Check if description exists and is not empty
        let description = 'Описание отсутствует';
        if (videoData && videoData.description && videoData.description.trim() !== '') {
            description = videoData.description;
        }
        
        const year = videoData?.year || '';
        const duration = videoData?.duration || '';

        const card = document.createElement('div');
        card.className = 'card glass-card';
        card.dataset.id = videoId;

        if (mode === 'list') {
            card.innerHTML = `
                <div class="card-image">
                    <img src="${posterUrl}" alt="${titleText}">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${titleText}</h3>
                        <div class="card-rating">${ratingText}</div>
                    </div>
                    <div class="card-meta">
                        ${year ? `<div class="card-meta-item">
                            <i data-lucide="calendar"></i>
                            <span>${year}</span>
                        </div>` : ''}
                        ${duration ? `<div class="card-meta-item">
                            <i data-lucide="clock"></i>
                            <span>${duration}</span>
                        </div>` : ''}
                    </div>
                    <p class="card-description">${description}</p>
                    <div class="card-actions-row">
                        <button class="card-favorite ${isFavorite ? 'active' : ''}" data-id="${videoId}">
                            <i data-lucide="heart"></i>
                        </button>
                        <div class="card-actions">
                            <button class="card-action-btn" onclick="editVideo(${videoId})" title="Редактировать">
                                <i data-lucide="edit-2"></i>
                            </button>
                            <button class="card-action-btn" onclick="shareVideo(${videoId})" title="Поделиться">
                                <i data-lucide="share-2"></i>
                            </button>
                            <button class="card-action-btn" onclick="deleteVideo(${videoId})" title="Удалить">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else if (mode === 'poster') {
            card.innerHTML = `
                <div class="card-image">
                    <img src="${posterUrl}" alt="${titleText}">
                    <div class="card-gradient"></div>
                    <div class="card-rating">${ratingText}</div>
                    <button class="card-favorite ${isFavorite ? 'active' : ''}" data-id="${videoId}">
                        <i data-lucide="heart"></i>
                    </button>
                    <div class="card-actions">
                        <button class="card-action-btn" onclick="editVideo(${videoId})" title="Редактировать">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="card-action-btn" onclick="shareVideo(${videoId})" title="Поделиться">
                            <i data-lucide="share-2"></i>
                        </button>
                        <button class="card-action-btn" onclick="deleteVideo(${videoId})" title="Удалить">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${titleText}</h3>
                    ${year ? `<p class="card-year">${year}</p>` : ''}
                </div>
            `;
        } else {
            // Grid mode - create full structure with all info
            card.innerHTML = `
                <div class="card-image">
                    <img src="${posterUrl}" alt="${titleText}">
                    <div class="card-gradient"></div>
                    <div class="card-rating">${ratingText}</div>
                    <button class="card-favorite ${isFavorite ? 'active' : ''}" data-id="${videoId}">
                        <i data-lucide="heart"></i>
                    </button>
                    <div class="card-actions">
                        <button class="card-action-btn" onclick="editVideo(${videoId})" title="Редактировать">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="card-action-btn" onclick="shareVideo(${videoId})" title="Поделиться">
                            <i data-lucide="share-2"></i>
                        </button>
                        <button class="card-action-btn" onclick="deleteVideo(${videoId})" title="Удалить">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <h3 class="card-title">${titleText}</h3>
                <div class="card-meta">
                    ${year ? `${year}` : ''}${year && duration ? ' • ' : ''}${duration ? `${duration}` : ''}
                </div>
            `;
        }

        return card;
    }

    reattachCardListeners() {
        // Card click handlers
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-favorite') && !e.target.closest('.card-actions')) {
                    const videoId = parseInt(card.dataset.id);
                    window.location.href = `video_id.html?id=${videoId}`;
                }
            });
        });

        // Favorite button handlers
        document.querySelectorAll('.card-favorite').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const videoId = parseInt(btn.dataset.id);
                if (typeof db !== 'undefined' && db.toggleFavorite) {
                    await db.toggleFavorite(videoId);
                    btn.classList.toggle('active');
                }
            });
        });
    }

    updateCollectionCount(count) {
        const sectionTitle = document.querySelector('.section-title');
        if (!sectionTitle) return;

        let countSpan = sectionTitle.querySelector('.collection-count');
        if (!countSpan) {
            countSpan = document.createElement('span');
            countSpan.className = 'collection-count';
            sectionTitle.appendChild(countSpan);
        }

        countSpan.textContent = `(${count})`;
    }
}

// Create global instance
const viewModesManager = new ViewModesManager();
window.viewModesManager = viewModesManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for cards to be loaded
    setTimeout(async () => {
        await viewModesManager.init();
    }, 500);
});

// Reinitialize when videos are loaded
window.addEventListener('videosLoaded', async () => {
    await viewModesManager.init();
});
