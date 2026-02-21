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

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    initVideoPlayer();
    initProgressBar();
    initKeyboardShortcuts();
});

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
