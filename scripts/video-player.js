/**
 * Framesearch - Video Player Page JavaScript
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

// Ensure logger is available
if (typeof logger === 'undefined') {
    console.error('Logger not loaded! Please ensure logger.js is included before video-player.js');
    window.logger = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        success: console.log.bind(console),
        debug: console.debug.bind(console),
        video: console.log.bind(console),
        music: console.log.bind(console),
        database: console.log.bind(console),
        search: console.log.bind(console),
        theme: console.log.bind(console),
        importData: console.log.bind(console),
        exportData: console.log.bind(console),
        collection: console.log.bind(console),
        settings: console.log.bind(console)
    };
}

let currentVideo = null;
let currentEpisodes = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Wait for DB to initialize
    await db.init();
    
    // Get video ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'));
    
    if (videoId) {
        await loadVideo(videoId);
    } else {
        window.location.href = '/app';
    }
});

// Load video from database
async function loadVideo(videoId) {
    try {
        currentVideo = await db.getVideo(videoId);
        
        if (!currentVideo) {
            alert('Видео не найдено');
            window.location.href = '/app';
            return;
        }
        
        // Increment views
        await db.incrementViews(videoId);
        
        // Render video info
        renderVideoInfo();
        
        // Load video player
        loadVideoPlayer();
        
        // Load episodes if series/anime
        if (currentVideo.type === 'series' || currentVideo.type === 'anime') {
            currentEpisodes = await db.getEpisodes(videoId);
            renderEpisodes();
        }
        
        // Initialize action buttons
        initActionButtons();
        
    } catch (error) {
        logger.error('Error loading video', error);
        
        // Show user-friendly error message
        const errorContainer = document.querySelector('.video-section');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="glass" style="padding: 2rem; text-align: center;">
                    <i data-lucide="alert-circle" style="width: 64px; height: 64px; color: var(--danger-color); margin-bottom: 1rem;"></i>
                    <h2 style="color: var(--danger-color); margin-bottom: 1rem;">Ошибка при загрузке контента</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                        ${error.message || 'Не удалось загрузить контент. Попробуйте обновить страницу.'}
                    </p>
                    <button class="btn btn-primary" onclick="window.location.href='/app'">
                        <i data-lucide="arrow-left"></i>
                        Вернуться на главную
                    </button>
                </div>
            `;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

// Render video info
function renderVideoInfo() {
    document.title = `${currentVideo.title} - Framesearch`;
    
    document.querySelector('.video-title').textContent = currentVideo.title;
    
    const metaHtml = `
        <span class="meta-badge">${currentVideo.genre}</span>
        <span>${currentVideo.year}</span>
        <span>${currentVideo.duration}</span>
        <span class="meta-rating">
            <i data-lucide="star"></i> ${currentVideo.rating.toFixed(1)}
        </span>
    `;
    document.querySelector('.video-meta').innerHTML = metaHtml;
    
    const description = document.querySelector('.description-card p');
    if (description) {
        description.textContent = currentVideo.description;
    }
    
    // Update favorite button
    const favoriteBtn = document.querySelector('.action-btn-primary');
    if (favoriteBtn) {
        if (currentVideo.isFavorite) {
            favoriteBtn.innerHTML = '<i data-lucide="heart"></i> В избранном';
            favoriteBtn.style.background = '#ef4444';
        }
        
        favoriteBtn.addEventListener('click', async () => {
            await db.toggleFavorite(currentVideo.id);
            currentVideo = await db.getVideo(currentVideo.id);
            
            if (currentVideo.isFavorite) {
                favoriteBtn.innerHTML = '<i data-lucide="heart"></i> В избранном';
                favoriteBtn.style.background = '#ef4444';
            } else {
                favoriteBtn.innerHTML = '<i data-lucide="heart"></i> В избранное';
                favoriteBtn.style.background = '#6366f1';
            }
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load video player
function loadVideoPlayer() {
    const videoContainer = document.querySelector('.video-placeholder');
    if (!videoContainer) return;
    
    // Determine content type for logging
    const isMusic = currentVideo.sourceType === 'music' || currentVideo.sourceCategory === 'music';
    const logMethod = isMusic ? 'music' : 'video';
    const contentType = isMusic ? 'музыкальный плеер' : 'видеоплеер';
    
    logger[logMethod](`Загрузка ${contentType}`, { sourceType: currentVideo.sourceType, video: currentVideo });
    
    // Check if it's music
    if (isMusic) {
        logger.music('Loading music player', currentVideo);
        
        // Add music-player class for adaptive styling
        videoContainer.classList.add('music-player');
        
        if (currentVideo.musicPlatform === 'direct') {
            // Direct audio file
            videoContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; min-height: 200px; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 2rem;">
                    <audio controls style="width: 90%; max-width: 600px;">
                        <source src="${currentVideo.sourceUrl}" type="${currentVideo.audioType || 'audio/mpeg'}">
                        Ваш браузер не поддерживает аудио элемент.
                    </audio>
                </div>
            `;
        } else if (currentVideo.musicEmbedCode) {
            // Use provided embed code directly
            videoContainer.innerHTML = currentVideo.musicEmbedCode;
        } else if (currentVideo.sourceUrl) {
            // Check if sourceUrl is an iframe code or URL
            if (currentVideo.sourceUrl.includes('<iframe')) {
                // It's an embed code
                videoContainer.innerHTML = currentVideo.sourceUrl;
            } else {
                // It's a URL - create iframe with adaptive height
                videoContainer.innerHTML = `
                    <iframe 
                        src="${currentVideo.sourceUrl}" 
                        frameborder="0" 
                        allowtransparency="true"
                        allow="encrypted-media; autoplay; clipboard-write; fullscreen; picture-in-picture"
                        loading="lazy"
                        style="border-radius: 12px; width: 100%; height: 380px; display: block;"
                    ></iframe>
                `;
            }
        } else {
            videoContainer.innerHTML = '<p style="color: var(--danger-color); text-align: center; padding: 2rem;">Не удалось загрузить музыкальный плеер</p>';
        }
        return;
    }
    
    if (currentVideo.sourceType === 'file' || currentVideo.sourceType === 'url' || currentVideo.sourceType === 'direct') {
        // Local file or direct URL
        videoContainer.innerHTML = `
            <video id="videoPlayer" class="video-player">
                <source src="${currentVideo.sourceUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    } else {
        // Iframe
        videoContainer.innerHTML = `
            <iframe 
                src="${currentVideo.sourceUrl}" 
                class="video-player"
                frameborder="0" 
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        `;
    }
}

// Render episodes
function renderEpisodes() {
    if (currentEpisodes.length === 0) return;
    
    // Create episodes section if it doesn't exist
    const videoInfoContainer = document.querySelector('.video-info-container');
    if (!videoInfoContainer) return;
    
    const episodesSection = document.createElement('div');
    episodesSection.className = 'episodes-section glass-card animate-fade-in delay-200';
    episodesSection.innerHTML = `
        <h3>Эпизоды</h3>
        <div class="episodes-grid"></div>
    `;
    
    videoInfoContainer.appendChild(episodesSection);
    
    const episodesGrid = episodesSection.querySelector('.episodes-grid');
    
    episodesGrid.innerHTML = currentEpisodes.map((episode, index) => `
        <button class="episode-item ${index === 0 ? 'active' : ''}" data-episode-id="${episode.id}">
            <div class="episode-number">${episode.episode}</div>
            <div class="episode-info">
                <p class="episode-title">${episode.title}</p>
                <p class="episode-duration">${episode.duration}</p>
            </div>
            ${index === 0 ? '<i data-lucide="play"></i>' : ''}
        </button>
    `).join('');
    
    // Add click handlers
    episodesGrid.querySelectorAll('.episode-item').forEach(item => {
        item.addEventListener('click', () => {
            const episodeId = parseInt(item.dataset.episodeId);
            playEpisode(episodeId);
        });
    });
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Play episode
function playEpisode(episodeId) {
    const episode = currentEpisodes.find(ep => ep.id === episodeId);
    if (!episode) return;
    
    const videoContainer = document.querySelector('.video-placeholder');
    
    if (episode.sourceType === 'file' || episode.sourceType === 'url') {
        videoContainer.innerHTML = `
            <video id="videoPlayer" class="video-player" autoplay>
                <source src="${episode.sourceUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    } else {
        videoContainer.innerHTML = `
            <iframe 
                src="${episode.sourceUrl}" 
                class="video-player"
                frameborder="0" 
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        `;
    }
    
    // Update active episode
    const episodesGrid = document.querySelector('.episodes-grid');
    if (episodesGrid) {
        episodesGrid.querySelectorAll('.episode-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('i')?.remove();
        });
        
        const activeItem = episodesGrid.querySelector(`[data-episode-id="${episodeId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            activeItem.insertAdjacentHTML('beforeend', '<i data-lucide="play"></i>');
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Video Player Interactions
function initVideoPlayer() {
    const playBtn = document.getElementById('playBtn');
    const playControlBtn = document.getElementById('playControlBtn');
    let isPlaying = false;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            togglePlay();
        });
    }

    if (playControlBtn) {
        playControlBtn.addEventListener('click', () => {
            togglePlay();
        });
    }

    function togglePlay() {
        const video = document.getElementById('videoPlayer');
        if (video) {
            if (video.paused) {
                video.play();
                isPlaying = true;
            } else {
                video.pause();
                isPlaying = false;
            }
            
            const icon = playControlBtn?.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }
}

// Progress Bar Interaction
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressFilled = document.getElementById('progressFilled');
    const video = document.getElementById('videoPlayer');

    if (!progressBar || !progressFilled) return;

    // Update progress
    if (video) {
        video.addEventListener('timeupdate', () => {
            const percent = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = `${percent}%`;
        });
    }

    // Seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        progressFilled.style.width = `${percent}%`;
        
        if (video) {
            video.currentTime = (percent / 100) * video.duration;
        }
    });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    const playControlBtn = document.getElementById('playControlBtn');
    const video = document.getElementById('videoPlayer');
    
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        
        // Space - Play/Pause
        if (e.code === 'Space') {
            e.preventDefault();
            if (playControlBtn) {
                playControlBtn.click();
            }
        }
        
        // F - Fullscreen
        if (e.code === 'KeyF') {
            if (video) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                }
            }
        }
        
        // M - Mute
        if (e.code === 'KeyM') {
            if (video) {
                video.muted = !video.muted;
            }
        }
        
        // Arrow Left - Rewind 10s
        if (e.code === 'ArrowLeft') {
            if (video) {
                video.currentTime = Math.max(0, video.currentTime - 10);
            }
        }
        
        // Arrow Right - Forward 10s
        if (e.code === 'ArrowRight') {
            if (video) {
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
            }
        }
    });
}


// Initialize action buttons
function initActionButtons() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const shareBtn = document.getElementById('shareBtn');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', async () => {
            await db.toggleFavorite(currentVideo.id);
            currentVideo.isFavorite = !currentVideo.isFavorite;
            updateFavoriteButton();
        });
        updateFavoriteButton();
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareManager.open(currentVideo.id);
        });
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            modal.open(currentVideo.id);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Вы уверены, что хотите удалить этот контент?')) {
                try {
                    await db.deleteVideo(currentVideo.id);
                    
                    // Delete associated episodes
                    const episodes = await db.getEpisodes(currentVideo.id);
                    for (const episode of episodes) {
                        await db.deleteEpisode(episode.id);
                    }
                    
                    alert('Контент удален');
                    window.location.href = '/app';
                } catch (error) {
                    logger.error('Error deleting video', error);
                    alert('Ошибка при удалении');
                }
            }
        });
    }
}

function updateFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn && currentVideo) {
        if (currentVideo.isFavorite) {
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = '<i data-lucide="heart"></i> В избранном';
        } else {
            favoriteBtn.classList.remove('active');
            favoriteBtn.innerHTML = '<i data-lucide="heart"></i> В избранное';
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

