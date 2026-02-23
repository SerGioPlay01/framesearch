/**
 * Framesearch - Search Page JavaScript
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Wait for DB to initialize
    await db.init();
    
    initSearchInput();
    initTags();
    initKeyboardShortcuts();
    initFilters();
    
    // Check for tag parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag');
    
    if (tagParam) {
        // Decode and set search input
        const decodedTag = decodeURIComponent(tagParam);
        const searchInput = document.getElementById('searchInput');
        const clearButton = document.getElementById('clearSearch');
        
        if (searchInput) {
            searchInput.value = decodedTag;
            if (clearButton) {
                clearButton.style.opacity = '1';
            }
        }
        
        // Perform search by tag
        await performSearchByTag(decodedTag);
    } else {
        // Load all videos initially
        await performSearch();
    }
});

// Search Input Interactions
function initSearchInput() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (!searchInput || !clearButton) return;

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            clearButton.style.opacity = '1';
        } else {
            clearButton.style.opacity = '0';
        }
        
        // Debounce search
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Check if we're searching by tag from URL
            const urlParams = new URLSearchParams(window.location.search);
            const tagParam = urlParams.get('tag');
            
            if (tagParam && searchInput.value.trim().toLowerCase() === tagParam.toLowerCase()) {
                // Still searching by the same tag
                performSearchByTag(tagParam);
            } else {
                // Regular search
                performSearch();
            }
        }, 300);
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.opacity = '0';
        searchInput.focus();
        
        // Clear URL parameter
        const url = new URL(window.location);
        url.searchParams.delete('tag');
        window.history.replaceState({}, '', url);
        
        performSearch();
    });
}

// Perform search
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput?.value.trim() || '';
    
    try {
        let videos;
        
        if (query) {
            videos = await db.searchVideos(query);
        } else {
            videos = await db.getAllVideos();
        }
        
        // Apply filters
        videos = applyFilters(videos);
        
        // Update stats
        updateSearchStats(videos.length, query);
        
        // Render results
        renderResults(videos);
        
    } catch (error) {
        logger.error('Error performing search', error);
    }
}

// Perform search by tag
async function performSearchByTag(tag) {
    try {
        const allVideos = await db.getAllVideos();
        
        // Filter videos that have this tag
        const videos = allVideos.filter(video => {
            if (!video.tags || !Array.isArray(video.tags)) return false;
            return video.tags.some(t => t.toLowerCase() === tag.toLowerCase());
        });
        
        // Apply additional filters
        const filtered = applyFilters(videos);
        
        // Update stats
        const statsElement = document.querySelector('.search-stats');
        if (statsElement) {
            statsElement.innerHTML = `Найдено <span class="highlight">${filtered.length}</span> видео с тегом "<span class="query">${tag}</span>"`;
        }
        
        // Render results
        renderResults(filtered);
        
    } catch (error) {
        logger.error('Error performing tag search', error);
    }
}

// Apply filters
function applyFilters(videos) {
    const genreSelect = document.querySelector('.filter-select:nth-of-type(1)');
    const yearSelect = document.querySelector('.filter-select:nth-of-type(2)');
    const ratingSelect = document.querySelector('.filter-select:nth-of-type(3)');
    
    let filtered = [...videos];
    
    // Genre filter
    if (genreSelect && genreSelect.value && genreSelect.value !== 'Все жанры') {
        filtered = filtered.filter(v => v.genre === genreSelect.value);
    }
    
    // Year filter
    if (yearSelect && yearSelect.value && yearSelect.value !== 'Любой год') {
        const year = parseInt(yearSelect.value);
        filtered = filtered.filter(v => v.year === year);
    }
    
    // Rating filter
    if (ratingSelect && ratingSelect.value && ratingSelect.value !== 'Любой рейтинг') {
        const minRating = parseInt(ratingSelect.value);
        filtered = filtered.filter(v => v.rating >= minRating);
    }
    
    return filtered;
}

// Update search stats
function updateSearchStats(count, query) {
    const statsElement = document.querySelector('.search-stats');
    if (!statsElement) return;
    
    if (query) {
        statsElement.innerHTML = `Найдено <span class="highlight">${count}</span> результата по запросу "<span class="query">${query}</span>"`;
    } else {
        statsElement.innerHTML = `Всего <span class="highlight">${count}</span> видео в коллекции`;
    }
}

// Render results
function renderResults(videos) {
    const resultsGrid = document.querySelector('.results-grid');
    if (!resultsGrid) return;
    
    if (videos.length === 0) {
        resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 3rem;">Ничего не найдено</p>';
        return;
    }
    
    resultsGrid.innerHTML = videos.map(video => createVideoCard(video)).join('');
    
    // Add click handlers
    document.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-favorite') && !e.target.closest('.card-actions')) {
                const videoId = card.dataset.id;
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
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
// Create video card
function createVideoCard(video) {
    const posterUrl = video.poster || 'https://via.placeholder.com/300x450?text=No+Poster';
    const favoriteClass = video.isFavorite ? 'active' : '';
    
    return `
        <div class="result-card glass-card animate-fade-in delay-300" data-id="${video.id}">
            <div class="card-image">
                <img src="${posterUrl}" alt="${video.title}">
                <div class="card-rating">${video.rating.toFixed(1)}</div>
                <button class="card-favorite ${favoriteClass}" data-id="${video.id}">
                    <i data-lucide="heart"></i>
                </button>
                <div class="card-actions">
                    <button class="card-action-btn" onclick="editVideo(${video.id})" title="Редактировать">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="card-action-btn" onclick="shareVideo(${video.id})" title="Поделиться">
                        <i data-lucide="share-2"></i>
                    </button>
                    <button class="card-action-btn card-delete-btn" onclick="deleteVideo(${video.id})" title="Удалить">
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
                <p class="card-meta">${video.year} • ${video.genre}</p>
            </div>
        </div>
    `;
}

// Filter Button Interactions
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.parentElement;
            const siblings = parent.querySelectorAll('.filter-btn');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            btn.classList.add('active');
            
            performSearch();
        });
    });
}

// Filters
function initFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            performSearch();
        });
    });
}

// Tag Interactions
function initTags() {
    const tags = document.querySelectorAll('.tag');
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (!searchInput) return;
    
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchText = tag.textContent.trim().substring(2);
            searchInput.value = searchText;
            if (clearButton) {
                clearButton.style.opacity = '1';
            }
            searchInput.focus();
            performSearch();
        });
    });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    document.addEventListener('keydown', (e) => {
        const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                              document.activeElement.tagName === 'TEXTAREA' ||
                              document.activeElement.isContentEditable;
        
        // Ctrl+K - Focus search (prevent browser's default)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isInputFocused) {
            e.preventDefault();
            e.stopPropagation();
            searchInput.focus();
            searchInput.select();
            return;
        }
        
        // Ctrl+N - Add new video (prevent browser's new window)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isInputFocused) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof modal !== 'undefined') {
                modal.open();
            }
            return;
        }
        
        // / - Focus search
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Esc - Blur search
        if (e.key === 'Escape') {
            searchInput.blur();
        }
    });
}


// Edit video
function editVideo(videoId) {
    event.stopPropagation();
    modal.open(videoId);
}

// Delete video
async function deleteVideo(videoId) {
    event.stopPropagation();
    
    if (confirm('Вы уверены, что хотите удалить этот контент?')) {
        try {
            await db.deleteVideo(videoId);
            
            // Delete associated episodes
            const episodes = await db.getEpisodes(videoId);
            for (const episode of episodes) {
                await db.deleteEpisode(episode.id);
            }
            
            performSearch();
        } catch (error) {
            logger.error('Error deleting video', error);
            alert('Ошибка при удалении');
        }
    }
}

// Share video
function shareVideo(videoId) {
    event.stopPropagation();
    shareManager.open(videoId);
}
