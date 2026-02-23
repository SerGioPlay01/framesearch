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
