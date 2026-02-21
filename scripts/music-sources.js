/**
 * Framesearch - Music Sources Manager
 * Поддержка музыкальных файлов и плейлистов
 * 
 * Автор: SerGioPlay
 * © 2026 Framesearch
 */

// Ensure logger is available
if (typeof logger === 'undefined') {
    console.error('Logger not loaded! Please ensure logger.js is included before music-sources.js');
    window.logger = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        success: console.log.bind(console),
        debug: console.debug.bind(console),
        music: console.log.bind(console)
    };
}

class MusicSourcesManager {
    constructor() {
        this.supportedPlatforms = {
            spotify: {
                name: 'Spotify',
                icon: 'music',
                embedBase: 'https://open.spotify.com/embed/',
                patterns: {
                    track: /spotify\.com\/track\/([a-zA-Z0-9]+)/,
                    playlist: /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
                    album: /spotify\.com\/album\/([a-zA-Z0-9]+)/,
                    artist: /spotify\.com\/artist\/([a-zA-Z0-9]+)/
                }
            },
            yandex: {
                name: 'Яндекс.Музыка',
                icon: 'music',
                embedBase: 'https://music.yandex.ru/iframe/',
                patterns: {
                    track: /music\.yandex\.ru\/album\/(\d+)\/track\/(\d+)/,
                    album: /music\.yandex\.ru\/album\/(\d+)/,
                    playlist: /music\.yandex\.ru\/users\/([^\/]+)\/playlists\/(\d+)/,
                    artist: /music\.yandex\.ru\/artist\/(\d+)/
                }
            },
            soundcloud: {
                name: 'SoundCloud',
                icon: 'music',
                embedBase: 'https://w.soundcloud.com/player/?url=',
                patterns: {
                    track: /soundcloud\.com\/([^\/]+)\/([^\/\?]+)/,
                    playlist: /soundcloud\.com\/([^\/]+)\/sets\/([^\/\?]+)/
                }
            },
            vk: {
                name: 'VK Музыка',
                icon: 'music',
                embedBase: 'https://vk.com/audio',
                patterns: {
                    audio: /vk\.com\/audio(-?\d+)_(\d+)/,
                    playlist: /vk\.com\/music\/playlist\/(-?\d+)_(\d+)/
                }
            },
            apple: {
                name: 'Apple Music',
                icon: 'music',
                embedBase: 'https://embed.music.apple.com/',
                patterns: {
                    song: /music\.apple\.com\/([a-z]{2})\/album\/[^\/]+\/(\d+)\?i=(\d+)/,
                    album: /music\.apple\.com\/([a-z]{2})\/album\/[^\/]+\/(\d+)/,
                    playlist: /music\.apple\.com\/([a-z]{2})\/playlist\/[^\/]+\/pl\.([a-zA-Z0-9]+)/
                }
            },
            deezer: {
                name: 'Deezer',
                icon: 'music',
                embedBase: 'https://widget.deezer.com/widget/',
                patterns: {
                    track: /deezer\.com\/track\/(\d+)/,
                    album: /deezer\.com\/album\/(\d+)/,
                    playlist: /deezer\.com\/playlist\/(\d+)/
                }
            }
        };
    }

    /**
     * Определяет платформу и тип контента по URL
     */
    detectSource(url) {
        for (const [platform, config] of Object.entries(this.supportedPlatforms)) {
            for (const [type, pattern] of Object.entries(config.patterns)) {
                const match = url.match(pattern);
                if (match) {
                    return {
                        platform,
                        type,
                        match,
                        config
                    };
                }
            }
        }
        return null;
    }

    /**
     * Генерирует embed URL для Spotify
     */
    generateSpotifyEmbed(url, type, match) {
        const id = match[1];
        return `https://open.spotify.com/embed/${type}/${id}`;
    }

    /**
     * Генерирует embed URL для Яндекс.Музыки
     */
    generateYandexEmbed(url, type, match) {
        if (type === 'track') {
            const albumId = match[1];
            const trackId = match[2];
            return `https://music.yandex.ru/iframe/#track/${trackId}/${albumId}/`;
        } else if (type === 'album') {
            const albumId = match[1];
            return `https://music.yandex.ru/iframe/#album/${albumId}/`;
        } else if (type === 'playlist') {
            const username = match[1];
            const playlistId = match[2];
            return `https://music.yandex.ru/iframe/#playlist/${username}/${playlistId}/`;
        } else if (type === 'artist') {
            const artistId = match[1];
            return `https://music.yandex.ru/iframe/#artist/${artistId}/`;
        }
        return null;
    }

    /**
     * Генерирует embed URL для SoundCloud
     */
    generateSoundCloudEmbed(url, type, match) {
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    }

    /**
     * Генерирует embed URL для VK Музыки
     */
    generateVKEmbed(url, type, match) {
        if (type === 'audio') {
            const ownerId = match[1];
            const audioId = match[2];
            return `https://vk.com/audio${ownerId}_${audioId}`;
        } else if (type === 'playlist') {
            const ownerId = match[1];
            const playlistId = match[2];
            return `https://vk.com/music/playlist/${ownerId}_${playlistId}`;
        }
        return null;
    }

    /**
     * Генерирует embed URL для Apple Music
     */
    generateAppleMusicEmbed(url, type, match) {
        if (type === 'song') {
            const country = match[1];
            const albumId = match[2];
            const songId = match[3];
            return `https://embed.music.apple.com/${country}/album/${albumId}?i=${songId}`;
        } else if (type === 'album') {
            const country = match[1];
            const albumId = match[2];
            return `https://embed.music.apple.com/${country}/album/${albumId}`;
        } else if (type === 'playlist') {
            const country = match[1];
            const playlistId = match[2];
            return `https://embed.music.apple.com/${country}/playlist/${playlistId}`;
        }
        return null;
    }

    /**
     * Генерирует embed URL для Deezer
     */
    generateDeezerEmbed(url, type, match) {
        const id = match[1];
        return `https://widget.deezer.com/widget/dark/${type}/${id}`;
    }

    /**
     * Генерирует embed код для музыкального источника
     */
    generateEmbed(url) {
        const source = this.detectSource(url);
        
        if (!source) {
            logger.warn('Unknown music source', url);
            return null;
        }

        logger.music('Detected music source', source);

        let embedUrl = null;

        switch (source.platform) {
            case 'spotify':
                embedUrl = this.generateSpotifyEmbed(url, source.type, source.match);
                break;
            case 'yandex':
                embedUrl = this.generateYandexEmbed(url, source.type, source.match);
                break;
            case 'soundcloud':
                embedUrl = this.generateSoundCloudEmbed(url, source.type, source.match);
                break;
            case 'vk':
                embedUrl = this.generateVKEmbed(url, source.type, source.match);
                break;
            case 'apple':
                embedUrl = this.generateAppleMusicEmbed(url, source.type, source.match);
                break;
            case 'deezer':
                embedUrl = this.generateDeezerEmbed(url, source.type, source.match);
                break;
        }

        if (!embedUrl) {
            logger.error('Failed to generate embed URL', source);
            return null;
        }

        return {
            platform: source.platform,
            type: source.type,
            embedUrl: embedUrl,
            originalUrl: url,
            platformName: source.config.name
        };
    }

    /**
     * Создает iframe для музыкального плеера
     */
    createIframe(embedData, width = '100%', height = '380') {
        if (!embedData || !embedData.embedUrl) {
            return null;
        }

        // Специальные высоты для разных платформ
        const heights = {
            spotify: embedData.type === 'track' ? '152' : '380',
            yandex: '400',
            soundcloud: '166',
            vk: '400',
            apple: '450',
            deezer: embedData.type === 'track' ? '155' : '400'
        };

        const iframeHeight = heights[embedData.platform] || height;

        return `<iframe 
            src="${embedData.embedUrl}" 
            width="${width}" 
            height="${iframeHeight}" 
            frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media; autoplay; clipboard-write; fullscreen; picture-in-picture"
            loading="lazy"
            style="border-radius: 12px;"
        ></iframe>`;
    }

    /**
     * Проверяет, является ли URL музыкальным источником
     */
    isMusicSource(url) {
        return this.detectSource(url) !== null;
    }

    /**
     * Получает информацию о платформе
     */
    getPlatformInfo(platform) {
        return this.supportedPlatforms[platform] || null;
    }

    /**
     * Получает список поддерживаемых платформ
     */
    getSupportedPlatforms() {
        return Object.entries(this.supportedPlatforms).map(([key, config]) => ({
            id: key,
            name: config.name,
            icon: config.icon
        }));
    }
}

// Create global instance
const musicSourcesManager = new MusicSourcesManager();
window.musicSourcesManager = musicSourcesManager;

// Export for use in other scripts
window.MusicSourcesManager = MusicSourcesManager;

logger.success('Music Sources Manager initialized');
