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
    
    if (!videoId || isNaN(videoId)) {
        return;
    }
    
    // Store globally for other functions
    window.currentVideoId = videoId;
    
    try {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) {
            return;
        }
        
        const video = await dbInstance.getVideo(videoId);
        if (!video) {
            return;
        }
        
        // Load and display notes
        await loadVideoNotes(videoId);
        
        // Load and display tags
        await loadVideoTags(videoId);
        
    } catch (error) {
        console.error('Error loading video data:', error);
    }
}

// Load and display notes for video
async function loadVideoNotes(videoId) {
    try {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) {
            return;
        }
        
        const video = await dbInstance.getVideo(videoId);
        
        if (!video || !video.notes || video.notes.length === 0) {
            // Hide notes section if no notes
            const notesSection = document.getElementById('videoNotesSection');
            if (notesSection) {
                notesSection.style.display = 'none';
            }
            return;
        }
        
        // Show notes section
        const notesSection = document.getElementById('videoNotesSection');
        if (notesSection) {
            notesSection.style.display = 'block';
        }
        
        // Render notes
        const notesList = document.getElementById('videoNotesList');
        if (!notesList) {
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
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Make loadVideoNotes globally accessible
window.loadVideoNotes = loadVideoNotes;

// Load and display tags for video
async function loadVideoTags(videoId) {
    try {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) {
            return;
        }
        
        const video = await dbInstance.getVideo(videoId);
        if (!video) {
            return;
        }
        
        // Update tags in video meta section (top of page)
        const videoMeta = document.querySelector('.video-meta');
        if (videoMeta && video.tags && video.tags.length > 0) {
            // Remove old tags
            const oldTags = videoMeta.querySelectorAll('.video-tag');
            oldTags.forEach(tag => tag.remove());
            
            // Add new tags
            video.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'video-tag';
                tagElement.textContent = tag;
                tagElement.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    padding: 0.25rem 0.75rem;
                    background: rgba(165, 180, 252, 0.15);
                    border: 1px solid rgba(165, 180, 252, 0.3);
                    border-radius: 20px;
                    color: var(--accent-primary);
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                `;
                tagElement.onclick = () => {
                    window.location.href = `search_results.html?tag=${encodeURIComponent(tag)}`;
                };
                videoMeta.appendChild(tagElement);
            });
        }
        
        // Update tags section (below description)
        const tagsSection = document.getElementById('videoTagsSection');
        const tagsDisplay = document.getElementById('videoTagsDisplay');
        
        if (tagsSection && tagsDisplay) {
            if (video.tags && video.tags.length > 0) {
                // Show tags section
                tagsSection.style.display = 'block';
                
                // Render tags
                tagsDisplay.innerHTML = video.tags.map(tag => `
                    <span class="card-tag" style="display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; background: rgba(165, 180, 252, 0.15); border: 1px solid rgba(165, 180, 252, 0.3); border-radius: 20px; color: var(--accent-primary); font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;" onclick="window.location.href='search_results.html?tag=${encodeURIComponent(tag)}'">
                        ${tag}
                    </span>
                `).join('');
            } else {
                // Hide tags section if no tags
                tagsSection.style.display = 'none';
            }
        }
        
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

// Make loadVideoTags globally accessible
window.loadVideoTags = loadVideoTags;

// Seek to timecode (placeholder - implement based on your player)
function seekToTimecode(timecode) {
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
}

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
