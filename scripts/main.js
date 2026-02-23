/**
 * Framesearch - Main JavaScript
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

let currentFilter = 'all';
let currentCollectionId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Wait for DB to initialize
    await db.init();
    
    // Now it's safe to update page content with i18n
    if (window.i18n) {
        window.i18n.updatePageContent();
    }
    
    // Check for share link
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    if (shareData) {
        await handleShareLink(shareData);
        return;
    }
    
    initNavbar();
    initFilters();
    initSearch();
    initHotkeys();
    
    // Load collections and videos from database
    await loadCollections();
    await loadVideos();
    
    // Initialize responsive features for filter buttons
    if (typeof initFilterButtonsScroll === 'function') {
        initFilterButtonsScroll();
    }
    
    // Check if we need to open a collection from URL hash
    if (window.location.hash) {
        const match = window.location.hash.match(/#collection-(\d+)/);
        if (match) {
            const collectionId = parseInt(match[1]);
            await openCollection(collectionId);
        }
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', async (event) => {
    if (event.state && event.state.collectionId) {
        // Going to a collection
        await openCollection(event.state.collectionId);
    } else {
        // Going back to main view
        if (currentCollectionId) {
            await closeCollectionView();
        }
    }
});

// Helper function to close collection view
async function closeCollectionView() {
    currentCollectionId = null;
    
    const t = (key) => window.i18n ? window.i18n.t(key) : key;
    
    // Show action buttons
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'block';
    }
    
    // Restore section header with filters
    const sectionHeader = document.getElementById('mainSectionHeader');
    if (sectionHeader) {
        sectionHeader.innerHTML = `
            <h2 class="section-title" data-i18n="nav.collections">${t('nav.collections')}</h2>
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all" data-i18n="filter.all">${t('filter.all')}</button>
                <button class="filter-btn" data-filter="balancer" data-i18n="filter.balancer">${t('filter.balancer')}</button>
                <button class="filter-btn" data-filter="direct" data-i18n="filter.direct">${t('filter.direct')}</button>
                <button class="filter-btn" data-filter="social" data-i18n="filter.social">${t('filter.social')}</button>
                <button class="filter-btn" data-filter="custom" data-i18n="filter.custom">${t('filter.custom')}</button>
                <button class="filter-btn" data-filter="favorites" data-i18n="filter.favorites">${t('filter.favorites')}</button>
            </div>
        `;
        sectionHeader.style.display = 'flex';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // Show collections
    const collectionsContainer = document.querySelector('.collections-container');
    if (collectionsContainer) {
        collectionsContainer.style.display = 'block';
    }
    
    // Show cards grid
    const cardsGrid = document.querySelector('.cards-grid');
    if (cardsGrid) {
        cardsGrid.style.display = 'grid';
    }
    
    // Reload collections and videos
    await loadCollections();
    await loadVideos();
    
    // Reinitialize filters
    initFilters();
    
    // Reinitialize responsive features
    if (typeof initFilterButtonsScroll === 'function') {
        initFilterButtonsScroll();
    }
}


// Navbar scroll effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScroll > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Load videos from database
async function loadVideos(filter = 'all') {
    const cardsGrid = document.querySelector('.cards-grid');
    const emptyState = document.querySelector('.empty-state');
    const sectionHeader = document.getElementById('mainSectionHeader');
    const actionButtons = document.querySelector('.action-buttons');
    
    if (!cardsGrid) return;
    
    try {
        let videos = await db.getAllVideos();
        
        // Show empty state if no videos
        if (videos.length === 0) {
            if (cardsGrid) cardsGrid.style.display = 'none';
            if (sectionHeader) sectionHeader.style.display = 'none';
            if (actionButtons) actionButtons.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        // Hide empty state and show content
        if (cardsGrid) cardsGrid.style.display = 'grid';
        if (sectionHeader) sectionHeader.style.display = 'flex';
        if (actionButtons) actionButtons.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        
        // Reinitialize responsive features when showing content
        if (sectionHeader && sectionHeader.style.display !== 'none') {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                if (typeof initFilterButtonsScroll === 'function') {
                    initFilterButtonsScroll();
                }
            }, 50);
        }
        
        // Apply filter
        if (filter !== 'all') {
            if (filter === 'balancer') {
                videos = videos.filter(v => v.type === 'balancer');
            } else if (filter === 'direct') {
                videos = videos.filter(v => v.type === 'direct');
            } else if (filter === 'social') {
                videos = videos.filter(v => v.type === 'social');
            } else if (filter === 'custom') {
                videos = videos.filter(v => v.type === 'custom');
            } else if (filter === 'favorites') {
                videos = videos.filter(v => v.isFavorite === true);
            }
        }
        
        // Sort by date added (newest first)
        videos.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        
        // Render cards
        cardsGrid.innerHTML = videos.map(video => createVideoCard(video)).join('');
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Add click handlers
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-favorite')) {
                    const videoId = parseInt(card.dataset.id);
                    window.location.href = `video_id.html?id=${videoId}`;
                }
            });
        });
        
        // Add favorite handlers
        document.querySelectorAll('.card-favorite').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const videoId = parseInt(btn.dataset.id);
                await db.toggleFavorite(videoId);
                await loadVideos(currentFilter);
            });
        });
        
        // Update collection count
        if (window.viewModesManager) {
            viewModesManager.updateCollectionCount(videos.length);
        }
        
        // Dispatch event for view modes manager
        window.dispatchEvent(new CustomEvent('videosLoaded', { detail: { count: videos.length } }));
        
    } catch (error) {
        logger.error('Error loading videos', error);
    }
}

// Create video card HTML
function createVideoCard(video) {
    const posterUrl = video.poster || 'https://via.placeholder.com/300x450?text=No+Poster';
    const favoriteClass = video.isFavorite ? 'active' : '';
    
    // Get translated type name
    const getTypeName = (type) => {
        if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
            return i18n.t(`type.${type}`) || type;
        }
        return type;
    };
    
    const typeName = getTypeName(video.type) || getTypeName('movie');
    
    return `
        <div class="card glass-card animate-fade-in" data-id="${video.id}">
            <div class="card-image">
                <img src="${posterUrl}" 
                     alt="${video.title}"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x450?text=No+Poster';">
                <div class="card-rating">${video.rating.toFixed(1)}</div>
                <button class="card-favorite ${favoriteClass}" data-id="${video.id}">
                    <i data-lucide="heart"></i>
                </button>
                <div class="card-actions">
                    <button class="card-action-btn" onclick="event.stopPropagation(); editVideo(${video.id})" title="Редактировать">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="card-action-btn" onclick="event.stopPropagation(); if(typeof tagsManager !== 'undefined') tagsManager.openTagEditor(${video.id})" title="Теги">
                        <i data-lucide="tag"></i>
                    </button>
                    <button class="card-action-btn" onclick="event.stopPropagation(); if(typeof notesManager !== 'undefined') notesManager.openNotesPanel(${video.id})" title="Заметки">
                        <i data-lucide="file-text"></i>
                    </button>
                    <button class="card-action-btn" onclick="event.stopPropagation(); shareVideo(${video.id})" title="Поделиться">
                        <i data-lucide="share-2"></i>
                    </button>
                    <button class="card-action-btn card-delete-btn" onclick="event.stopPropagation(); deleteVideo(${video.id})" title="Удалить">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="card-gradient"></div>
                <div class="card-play">
                    <div class="play-button">
                        <i data-lucide="play"></i>
                    </div>
                </div>
            </div>
            <div class="card-info">
                <h3 class="card-title">${video.title}</h3>
                <p class="card-meta">${video.genre} • ${video.year}</p>
                ${video.tags && video.tags.length > 0 ? `
                    <div class="card-tags">
                        ${video.tags.slice(0, 3).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                        ${video.tags.length > 3 ? `<span class="card-tag-more">+${video.tags.length - 3}</span>` : ''}
                    </div>
                ` : ''}
                <div class="card-details">
                    <span>${video.duration || 'N/A'}</span>
                    <span class="card-badge">${typeName}</span>
                    ${video.notes && video.notes.length > 0 ? `<span class="card-notes-badge" title="${video.notes.length} заметок"><i data-lucide="file-text" style="width: 14px; height: 14px;"></i> ${video.notes.length}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Filter buttons
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter') || 'all';
            currentFilter = filter;
            await loadVideos(filter);
            
            // Reinitialize responsive features after filter change
            if (typeof initFilterButtonsScroll === 'function') {
                initFilterButtonsScroll();
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();
            if (query) {
                const results = await db.searchVideos(query);
                renderSearchResults(results);
            } else {
                await loadVideos(currentFilter);
            }
        }, 300);
    });
}

// Keyboard shortcuts
function initHotkeys() {
    document.addEventListener('keydown', (e) => {
        // Only handle shortcuts on Framesearch pages, not in Google search
        const isGoogleSearch = window.location.hostname.includes('google');
        const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                              document.activeElement.tagName === 'TEXTAREA' ||
                              document.activeElement.isContentEditable;
        
        // Ctrl+K - Open search (prevent browser's default search)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isGoogleSearch) {
            if (!isInputFocused) {
                e.preventDefault();
                e.stopPropagation();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        }
        
        // Ctrl+N - Add new video (prevent browser's new window)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isInputFocused) {
            e.preventDefault();
            e.stopPropagation();
            modal.open();
        }
        
        // Esc - Close modal
        if (e.key === 'Escape') {
            // Check if any modal is open
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                e.preventDefault();
                
                // Close the appropriate modal
                if (activeModal.id === 'addContentModal') {
                    modal.close();
                } else if (activeModal.id === 'collectionsModal') {
                    collectionsManager.close();
                } else if (activeModal.id === 'shareModal') {
                    shareManager.close();
                } else if (activeModal.id === 'importModal') {
                    importManager.close();
                } else if (activeModal.id === 'instructionsModal') {
                    closeInstructions();
                } else {
                    // Generic close for any other modal
                    activeModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }
    });
}

// Render search results
function renderSearchResults(videos) {
    const cardsGrid = document.querySelector('.cards-grid');
    if (!cardsGrid) return;
    
    if (videos.length === 0) {
        cardsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #9ca3af;">Ничего не найдено</p>';
        return;
    }
    
    cardsGrid.innerHTML = videos.map(video => createVideoCard(video)).join('');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Make loadVideos available globally
window.loadVideos = loadVideos;

// Show instructions
window.showInstructions = function() {
    const lang = i18n.getCurrentLanguage();
    const t = (key) => i18n.t(key);
    
    const instructionsHTML = `
        <div id="instructionsModal" class="modal active">
            <div class="modal-overlay"></div>
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>
                        <i data-lucide="book-open"></i>
                        ${t('guide.title')}
                    </h2>
                    <button class="modal-close" onclick="closeInstructions()">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="modal-body" style="padding: 2rem;">
                    <!-- Основы -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="play-circle"></i>
                            ${t('guide.getting_started')}
                        </h3>
                        <div class="instruction-content">
                            <div class="instruction-step">
                                <div class="step-number">1</div>
                                <div class="step-text">
                                    <h4>${t('guide.step1')}</h4>
                                    <p>${t('guide.step1.desc')}</p>
                                </div>
                            </div>
                            <div class="instruction-step">
                                <div class="step-number">2</div>
                                <div class="step-text">
                                    <h4>${t('guide.step2')}</h4>
                                    <p>${t('guide.step2.desc')}</p>
                                </div>
                            </div>
                            <div class="instruction-step">
                                <div class="step-number">3</div>
                                <div class="step-text">
                                    <h4>${t('guide.step3')}</h4>
                                    <p>${t('guide.step3.desc')}</p>
                                </div>
                            </div>
                            <div class="instruction-step">
                                <div class="step-number">4</div>
                                <div class="step-text">
                                    <h4>${t('guide.step4')}</h4>
                                    <p>${t('guide.step4.desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Типы источников -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="link"></i>
                            ${t('guide.sources')}
                        </h3>
                        <div class="instruction-content">
                            <p>${t('guide.sources.desc')}</p>
                            <div class="balancer-list">
                                <div class="balancer-item">
                                    <strong>1. ${t('modal.source.balancer')}</strong>
                                    <p>${t('modal.source.balancer.desc')}</p>
                                </div>
                                <div class="balancer-item">
                                    <strong>2. ${t('modal.source.direct')}</strong>
                                    <p>${t('modal.source.direct.desc')}</p>
                                </div>
                                <div class="balancer-item">
                                    <strong>3. ${t('modal.source.social')}</strong>
                                    <p>${t('modal.source.social.desc')}</p>
                                </div>
                                <div class="balancer-item">
                                    <strong>4. ${t('modal.source.custom')}</strong>
                                    <p>${t('modal.source.custom.desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Фильтры -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="filter"></i>
                            ${t('guide.filters')}
                        </h3>
                        <div class="instruction-content">
                            <p>${t('guide.filters.desc')}</p>
                            <ul>
                                <li><strong>${t('filter.all')}</strong></li>
                                <li><strong>${t('filter.balancer')}</strong></li>
                                <li><strong>${t('filter.direct')}</strong></li>
                                <li><strong>${t('filter.social')}</strong></li>
                                <li><strong>${t('filter.custom')}</strong></li>
                                <li><strong>${t('filter.favorites')}</strong></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Полезные советы -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="lightbulb"></i>
                            ${t('guide.tips')}
                        </h3>
                        <div class="instruction-content">
                            <ul>
                                <li>${t('guide.tip1')}</li>
                                <li>${t('guide.tip2')}</li>
                                <li>${t('guide.tip3')}</li>
                                <li>${t('guide.tip4')}</li>
                                <li>${t('guide.tip5')}</li>
                            </ul>
                        </div>
                    </div>

                    <!-- PWA -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="smartphone"></i>
                            ${t('guide.pwa')}
                        </h3>
                        <div class="instruction-content">
                            <p><strong>${t('guide.pwa.benefits')}</strong></p>
                            <ul>
                                <li>${t('guide.pwa.benefit1')}</li>
                                <li>${t('guide.pwa.benefit2')}</li>
                                <li>${t('guide.pwa.benefit3')}</li>
                                <li>${t('guide.pwa.benefit4')}</li>
                            </ul>
                            <p><strong>${t('guide.pwa.install')}</strong></p>
                            <ul>
                                <li>${t('guide.pwa.install1')}</li>
                                <li>${t('guide.pwa.install2')}</li>
                                <li>${t('guide.pwa.install3')}</li>
                                <li>${t('guide.pwa.install4')}</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Конфиденциальность -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="shield"></i>
                            ${t('guide.privacy')}
                        </h3>
                        <div class="instruction-content">
                            <p><strong>${t('guide.privacy.storage')}</strong></p>
                            <ul>
                                <li>${t('guide.privacy.storage1')}</li>
                                <li>${t('guide.privacy.storage2')}</li>
                                <li>${t('guide.privacy.storage3')}</li>
                            </ul>
                            <p><strong>${t('guide.privacy.manage')}</strong></p>
                            <ul>
                                <li>${t('guide.privacy.manage1')}</li>
                                <li>${t('guide.privacy.manage2')}</li>
                                <li>${t('guide.privacy.manage3')}</li>
                                <li>${t('guide.privacy.manage4')}</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Советы -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="lightbulb"></i>
                            ${t('guide.tips.advanced')}
                        </h3>
                        <div class="instruction-content">
                            <div class="tips-list">
                                <div class="tip-card">
                                    <i data-lucide="star"></i>
                                    <div>
                                        <strong>${t('guide.tips.favorites')}</strong>
                                        <p>${t('guide.tips.favorites.desc')}</p>
                                    </div>
                                </div>
                                <div class="tip-card">
                                    <i data-lucide="folder-tree"></i>
                                    <div>
                                        <strong>${t('guide.tips.organize')}</strong>
                                        <p>${t('guide.tips.organize.desc')}</p>
                                    </div>
                                </div>
                                <div class="tip-card">
                                    <i data-lucide="download"></i>
                                    <div>
                                        <strong>${t('guide.tips.export')}</strong>
                                        <p>${t('guide.tips.export.desc')}</p>
                                    </div>
                                </div>
                                <div class="tip-card">
                                    <i data-lucide="image"></i>
                                    <div>
                                        <strong>${t('guide.tips.dragdrop')}</strong>
                                        <p>${t('guide.tips.dragdrop.desc')}</p>
                                    </div>
                                </div>
                                <div class="tip-card">
                                    <i data-lucide="tag"></i>
                                    <div>
                                        <strong>${t('guide.tips.descriptions')}</strong>
                                        <p>${t('guide.tips.descriptions.desc')}</p>
                                    </div>
                                </div>
                                <div class="tip-card">
                                    <i data-lucide="keyboard"></i>
                                    <div>
                                        <strong>${t('guide.tips.hotkeys')}</strong>
                                        <p>${t('guide.tips.hotkeys.desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Горячие клавиши -->
                    <div class="instruction-section">
                        <h3 class="instruction-title">
                            <i data-lucide="keyboard"></i>
                            ${t('guide.shortcuts')}
                        </h3>
                        <div class="instruction-content">
                            <div class="keyboard-shortcuts">
                                <div class="shortcut-item">
                                    <kbd>Ctrl</kbd> + <kbd>K</kbd>
                                    <span>${t('guide.shortcuts.search')}</span>
                                </div>
                                <div class="shortcut-item">
                                    <kbd>Ctrl</kbd> + <kbd>N</kbd>
                                    <span>${t('guide.shortcuts.add')}</span>
                                </div>
                                <div class="shortcut-item">
                                    <kbd>Esc</kbd>
                                    <span>${t('guide.shortcuts.close')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeInstructions()">
                        <i data-lucide="check"></i>
                        ${t('guide.close')}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', instructionsHTML);
    document.body.style.overflow = 'hidden';

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

window.closeInstructions = function() {
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    }
};

// Show stats
window.showStats = async function() {
    const stats = await db.getStats();
    await dialog.alert(`Всего видео: ${stats.total}\nВидео: ${stats.movies}\nСериалов: ${stats.series}\nАниме: ${stats.anime}\nВ избранном: ${stats.favorites}\nПросмотров: ${stats.totalViews}`, 'Статистика коллекции');
};

// Export data - open share manager
window.exportData = function() {
    shareManager.open();
};


// Edit video
function editVideo(videoId) {
    event.stopPropagation();
    modal.open(videoId);
}

// Delete video
async function deleteVideo(videoId) {
    event.stopPropagation();
    
    if (await dialog.confirm('Вы уверены, что хотите удалить этот контент?', 'Удаление видео')) {
        try {
            await db.deleteVideo(videoId);
            
            // Delete associated episodes
            const episodes = await db.getEpisodes(videoId);
            for (const episode of episodes) {
                await db.deleteEpisode(episode.id);
            }
            
            loadVideos();
        } catch (error) {
            logger.error('Error deleting video', error);
            await dialog.alert('Ошибка при удалении', 'Ошибка');
        }
    }
}

// Share video
function shareVideo(videoId) {
    event.stopPropagation();
    shareManager.open(videoId);
}


// Filter by type from navigation
window.filterByType = function(type) {
    // Find and click the corresponding filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        const filterType = btn.getAttribute('data-filter');
        if (filterType === type) {
            btn.click();
        }
    });
};


// Load collections
async function loadCollections() {
    const collectionsContainer = document.querySelector('.collections-container');
    if (!collectionsContainer) return;
    
    try {
        const collections = await db.getAllCollections();
        
        if (collections.length === 0) {
            collectionsContainer.style.display = 'none';
            return;
        }
        
        collectionsContainer.style.display = 'block';
        const collectionsGrid = collectionsContainer.querySelector('.collections-grid');
        
        collectionsGrid.innerHTML = collections.map(collection => createCollectionCard(collection)).join('');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        logger.error('Error loading collections', error);
    }
}

// Create collection card
function createCollectionCard(collection) {
    const posterUrl = collection.poster || 'https://via.placeholder.com/300x450?text=Collection';
    
    return `
        <div class="collection-card glass-card animate-fade-in" onclick="openCollection(${collection.id})">
            <div class="collection-image">
                <img src="${posterUrl}" alt="${collection.name}">
                <div class="collection-overlay">
                    <div class="collection-name">${collection.name}</div>
                    <div class="collection-actions">
                        <button class="collection-action-btn" onclick="editCollection(${collection.id}); event.stopPropagation();" title="Редактировать">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="collection-action-btn collection-delete-btn" onclick="deleteCollection(${collection.id}); event.stopPropagation();" title="Удалить">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Open collection
async function openCollection(collectionId) {
    currentCollectionId = collectionId;
    const collection = await db.getCollection(collectionId);
    
    if (!collection) {
        logger.error('Collection not found', { collectionId });
        return;
    }
    
    const t = (key) => window.i18n ? window.i18n.t(key) : key;
    
    // Add to browser history (only if not already in history)
    if (!window.location.hash.includes(`collection-${collectionId}`)) {
        history.pushState({ collectionId: collectionId }, '', `#collection-${collectionId}`);
    }
    
    // Hide action buttons
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
    
    // Hide collections container
    const collectionsContainer = document.querySelector('.collections-container');
    if (collectionsContainer) {
        collectionsContainer.style.display = 'none';
    }
    
    // Update section header with collection info
    const sectionHeader = document.getElementById('mainSectionHeader');
    if (sectionHeader) {
        sectionHeader.style.display = 'block';
        sectionHeader.classList.remove('delay-100');
        sectionHeader.innerHTML = `
            <div style="width: 100%;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                    <button class="btn-icon" onclick="closeCollection()" style="flex-shrink: 0;" title="${t('collections.back')}">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h2 style="margin: 0; color: white; font-size: 1.75rem; font-weight: 600;">${collection.name}</h2>
                </div>
                ${collection.description ? `<p style="color: #9ca3af; margin: 0; padding-left: 3.5rem; font-size: 0.95rem;">${collection.description}</p>` : ''}
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } else {
        logger.error('Section header not found');
    }
    
    // Load videos from this collection
    const videos = await db.getVideosByCollection(collectionId);
    const cardsGrid = document.querySelector('.cards-grid');
    
    if (!cardsGrid) {
        logger.error('Cards grid not found');
        return;
    }
    
    if (videos.length === 0) {
        cardsGrid.innerHTML = `<p style="color: #9ca3af; text-align: center; padding: 2rem;">${t('collections.empty.content')}</p>`;
    } else {
        cardsGrid.innerHTML = videos.map(video => createVideoCard(video)).join('');
    }
    
    cardsGrid.style.display = 'grid';
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add click handlers
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-favorite') && !e.target.closest('.card-actions')) {
                const videoId = parseInt(card.dataset.id);
                window.location.href = `video_id.html?id=${videoId}`;
            }
        });
    });
    
    // Add favorite button handlers
    document.querySelectorAll('.card-favorite').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const videoId = parseInt(btn.dataset.id);
            await db.toggleFavorite(videoId);
            btn.classList.toggle('active');
        });
    });
}

// Close collection
async function closeCollection() {
    // Update browser history
    if (window.location.hash) {
        history.back();
    } else {
        // If no hash, directly close the collection view
        await closeCollectionView();
    }
}

// Edit collection
function editCollection(collectionId) {
    collectionsManager.open(collectionId);
}

// Delete collection
async function deleteCollection(collectionId) {
    if (await dialog.confirm('Вы уверены, что хотите удалить эту коллекцию? Видео останутся в библиотеке.', 'Удаление коллекции')) {
        try {
            await db.deleteCollection(collectionId);
            loadCollections();
        } catch (error) {
            logger.error('Error deleting collection', error);
            await dialog.alert('Ошибка при удалении', 'Ошибка');
        }
    }
}

// Handle share link
async function handleShareLink(shareData) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const isEncrypted = urlParams.get('encrypted') === '1';
        
        if (isEncrypted) {
            // For encrypted data, prompt for password first
            const password = await dialog.prompt('Введите пароль для расшифровки:', '', 'Защищенная ссылка', true);
            if (!password) {
                window.location.href = window.location.pathname;
                return;
            }
            
            try {
                // Don't decode encrypted data, pass as is
                const videoId = await db.importFromShare(shareData, password, true);
                await dialog.alert('Видео успешно импортировано!', 'Успех');
                window.location.href = `video_id.html?id=${videoId}`;
            } catch (error) {
                logger.error('Encrypted import error', error);
                await dialog.alert('Неверный пароль или поврежденные данные', 'Ошибка');
                window.location.href = window.location.pathname;
            }
        } else {
            try {
                const videoId = await db.importFromShare(shareData, null, false);
                await dialog.alert('Видео успешно импортировано!', 'Успех');
                window.location.href = `video_id.html?id=${videoId}`;
            } catch (error) {
                logger.error('Import error', error);
                await dialog.alert('Ошибка импорта: ' + error.message, 'Ошибка');
                window.location.href = window.location.pathname;
            }
        }
    } catch (error) {
        logger.error('Share link error', error);
        await dialog.alert('Ошибка обработки ссылки: ' + error.message, 'Ошибка');
        window.location.href = window.location.pathname;
    }
}


// Listen for language changes to update dynamic content
window.addEventListener('languageChanged', (e) => {
    // Reload videos only if DB is ready
    if (window.db && window.db.db) {
        loadVideos();
    }
    
    // Update any open modals or dialogs
    const instructionsModal = document.getElementById('instructionsModal');
    if (instructionsModal) {
        closeInstructions();
    }
});


// Haptic feedback for mobile devices
function triggerHapticFeedback(type = 'light') {
    if ('vibrate' in navigator) {
        switch(type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(30);
                break;
            case 'success':
                navigator.vibrate([10, 50, 10]);
                break;
            case 'error':
                navigator.vibrate([20, 100, 20]);
                break;
        }
    }
}

// Add haptic feedback to card action buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add haptic feedback on touch
    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.card-action-btn')) {
            triggerHapticFeedback('light');
        }
        if (e.target.closest('.card-favorite')) {
            triggerHapticFeedback('light');
        }
        if (e.target.closest('.card-delete-btn')) {
            triggerHapticFeedback('medium');
        }
    });
    
    // Success feedback on favorite toggle
    document.addEventListener('click', (e) => {
        if (e.target.closest('.card-favorite')) {
            setTimeout(() => triggerHapticFeedback('success'), 100);
        }
    });
});
