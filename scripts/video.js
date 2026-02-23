/**
 * Framesearch - Video Page JavaScript
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
    if (typeof db !== 'undefined' && db.init) {
        await db.init();
    }
    
    // Load video data
    await loadVideoData();
    
    initVideoPlayer();
    initProgressBar();
    initKeyboardShortcuts();
    
    // Listen for notes updates
    window.addEventListener('notesUpdated', async (e) => {
        if (e.detail && e.detail.videoId && window.currentVideoId === e.detail.videoId) {
            await loadVideoNotes(e.detail.videoId);
        }
    });
});

// Load video data and notes
async function loadVideoData() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'), 10);
    
    console.log('Loading video data for ID:', videoId);
    
    if (!videoId || isNaN(videoId)) {
        console.error('Invalid video ID');
        return;
    }
    
    // Store globally for other functions
    window.currentVideoId = videoId;
    
    try {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) {
            console.error('Database not available');
            return;
        }
        
        const video = await dbInstance.getVideo(videoId);
        if (!video) {
            console.error('Video not found');
            return;
        }
        
        console.log('Video loaded:', video);
        console.log('Video notes:', video.notes);
        
        // Load and display notes
        await loadVideoNotes(videoId);
        
    } catch (error) {
        console.error('Error loading video data:', error);
    }
}

// Load and display notes for video
async function loadVideoNotes(videoId) {
    console.log('loadVideoNotes called for videoId:', videoId);
    
    try {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) {
            console.error('Database not available in loadVideoNotes');
            return;
        }
        
        const video = await dbInstance.getVideo(videoId);
        console.log('Video in loadVideoNotes:', video);
        
        if (!video || !video.notes || video.notes.length === 0) {
            console.log('No notes found, hiding section');
            // Hide notes section if no notes
            const notesSection = document.getElementById('videoNotesSection');
            if (notesSection) {
                notesSection.style.display = 'none';
            }
            return;
        }
        
        console.log('Notes found:', video.notes.length);
        
        // Show notes section
        const notesSection = document.getElementById('videoNotesSection');
        if (notesSection) {
            notesSection.style.display = 'block';
            console.log('Notes section shown');
        } else {
            console.error('Notes section element not found!');
        }
        
        // Render notes
        const notesList = document.getElementById('videoNotesList');
        if (!notesList) {
            console.error('Notes list element not found!');
            return;
        }
        
        const t = (key) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return key;
        };
        
        notesList.innerHTML = video.notes.map(note => {
            // Format timecode
            let formattedTimecode = '';
            if (note.timecode) {
                const seconds = note.timecode;
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = Math.floor(seconds % 60);
                
                if (hours > 0) {
                    formattedTimecode = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                } else {
                    formattedTimecode = `${minutes}:${secs.toString().padStart(2, '0')}`;
                }
            }
            
            return `
                <div class="note-item">
                    <div class="note-header">
                        ${note.timecode ? `
                            <span class="note-timecode" onclick="seekToTimecode('${note.timecode}')">
                                <i data-lucide="clock"></i>
                                ${formattedTimecode}
                            </span>
                        ` : ''}
                        <span class="note-date">${note.date}</span>
                    </div>
                    <div class="note-text">${note.text}</div>
                    ${note.edited ? `<div class="note-edited">${t('notes.edited')} ${note.edited}</div>` : ''}
                </div>
            `;
        }).join('');
        
        console.log('Notes rendered');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Make loadVideoNotes globally accessible
window.loadVideoNotes = loadVideoNotes;

// Seek to timecode (placeholder - implement based on your player)
function seekToTimecode(timecode) {
    console.log('Seeking to:', timecode);
    // TODO: Implement actual video seeking based on your player
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
        isPlaying = !isPlaying;
        const icon = playControlBtn.querySelector('i');
        if (icon) {
            if (isPlaying) {
                icon.setAttribute('data-lucide', 'pause');
            } else {
                icon.setAttribute('data-lucide', 'play');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

// Progress Bar Interaction
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressFilled = document.getElementById('progressFilled');

    if (!progressBar || !progressFilled) return;

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        progressFilled.style.width = `${percent}%`;
    });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    const playControlBtn = document.getElementById('playControlBtn');
    
    document.addEventListener('keydown', (e) => {
        // Space - Play/Pause
        if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (playControlBtn) {
                playControlBtn.click();
            }
        }
        
        // F - Fullscreen
        if (e.code === 'KeyF') {
            const fullscreenBtn = document.querySelector('[data-lucide="maximize"]');
            if (fullscreenBtn) {
                fullscreenBtn.closest('button').click();
            }
        }
        
        // M - Mute
        if (e.code === 'KeyM') {
            const volumeBtn = document.querySelector('[data-lucide="volume-2"]');
            if (volumeBtn) {
                volumeBtn.closest('button').click();
            }
        }
        
        // Arrow Left - Rewind 10s
        if (e.code === 'ArrowLeft') {
            // Rewind logic
        }
        
        // Arrow Right - Forward 10s
        if (e.code === 'ArrowRight') {
            // Forward logic
        }
    });
}


// ===== QUICK ACTIONS FUNCTIONALITY =====

// Initialize quick actions
document.addEventListener('DOMContentLoaded', () => {
    initQuickActions();
});

function initQuickActions() {
    // Quick Add Note button
    const quickAddNoteBtn = document.getElementById('quickAddNoteBtn');
    if (quickAddNoteBtn) {
        quickAddNoteBtn.addEventListener('click', () => {
            if (typeof notesManager !== 'undefined' && window.currentVideoId) {
                // Open notes panel without timecode - user will specify it
                notesManager.openNotesPanel(window.currentVideoId);
            }
        });
    }
    
    // Quick Add Tag button
    const quickAddTagBtn = document.getElementById('quickAddTagBtn');
    if (quickAddTagBtn) {
        quickAddTagBtn.addEventListener('click', async () => {
            if (typeof tagsManager !== 'undefined' && window.currentVideoId) {
                await showQuickTagDialog();
            }
        });
    }
}

// Show quick tag dialog
async function showQuickTagDialog() {
    const t = (key, fallback) => {
        if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
            return i18n.t(key);
        }
        return fallback || key;
    };
    
    // Create dialog HTML
    const dialogHTML = `
        <div class="modal active" id="quickTagModal">
            <div class="modal-overlay"></div>
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>
                        <i data-lucide="tag"></i>
                        ${t('tags.add', 'Добавить тег')}
                    </h2>
                    <button class="modal-close" onclick="closeQuickTagDialog()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label for="quickTagInput">${t('tags.name', 'Название тега')}</label>
                        <input 
                            type="text" 
                            id="quickTagInput" 
                            class="form-input" 
                            placeholder="${t('tags.placeholder', 'Введите название тега')}"
                            maxlength="50"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label>${t('tags.suggestions', 'Популярные теги')}</label>
                        <div class="tag-suggestions" id="tagSuggestions">
                            <button class="tag-suggestion" data-tag="балансер">балансер</button>
                            <button class="tag-suggestion" data-tag="прямая ссылка">прямая ссылка</button>
                            <button class="tag-suggestion" data-tag="соцсети">соцсети</button>
                            <button class="tag-suggestion" data-tag="музыка">музыка</button>
                            <button class="tag-suggestion" data-tag="избранное">избранное</button>
                            <button class="tag-suggestion" data-tag="посмотреть позже">посмотреть позже</button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeQuickTagDialog()">
                        ${t('btn.cancel', 'Отмена')}
                    </button>
                    <button class="btn btn-primary" onclick="saveQuickTag()">
                        <i data-lucide="check"></i>
                        ${t('btn.add', 'Добавить')}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    document.body.style.overflow = 'hidden';
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Focus input
    setTimeout(() => {
        const input = document.getElementById('quickTagInput');
        if (input) input.focus();
    }, 100);
    
    // Add suggestion click handlers
    const suggestions = document.querySelectorAll('.tag-suggestion');
    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById('quickTagInput');
            if (input) {
                input.value = btn.dataset.tag;
                input.focus();
            }
        });
    });
    
    // Enter key to save
    const input = document.getElementById('quickTagInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveQuickTag();
            }
        });
    }
}

// Close quick tag dialog
window.closeQuickTagDialog = function() {
    const modal = document.getElementById('quickTagModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    }
};

// Save quick tag
window.saveQuickTag = async function() {
    const input = document.getElementById('quickTagInput');
    if (!input || !input.value.trim()) {
        return;
    }
    
    const tagName = input.value.trim();
    
    try {
        if (typeof tagsManager !== 'undefined' && window.currentVideoId) {
            await tagsManager.addTag(window.currentVideoId, tagName);
            showNotification('Тег добавлен', 'success');
            closeQuickTagDialog();
        }
    } catch (error) {
        console.error('Error adding tag:', error);
        showNotification('Ошибка при добавлении тега', 'error');
    }
};

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--accent-primary)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
