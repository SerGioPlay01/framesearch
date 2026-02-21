/**
 * Framesearch - IndexedDB Manager
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class FramesearchDB {
    constructor() {
        this.dbName = 'FramesearchDB';
        this.version = 3; // Increased for shares support
        this.db = null;
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                logger.error('Database failed to open', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const oldVersion = event.oldVersion;

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains('videos')) {
                    const videoStore = db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
                    videoStore.createIndex('title', 'title', { unique: false });
                    videoStore.createIndex('type', 'type', { unique: false });
                    videoStore.createIndex('genre', 'genre', { unique: false });
                    videoStore.createIndex('year', 'year', { unique: false });
                    videoStore.createIndex('rating', 'rating', { unique: false });
                    videoStore.createIndex('dateAdded', 'dateAdded', { unique: false });
                    videoStore.createIndex('collectionId', 'collectionId', { unique: false });
                } else if (oldVersion < 2) {
                    // Add collectionId index to existing videos store
                    const transaction = event.target.transaction;
                    const videoStore = transaction.objectStore('videos');
                    if (!videoStore.indexNames.contains('collectionId')) {
                        videoStore.createIndex('collectionId', 'collectionId', { unique: false });
                    }
                }

                if (!db.objectStoreNames.contains('episodes')) {
                    const episodeStore = db.createObjectStore('episodes', { keyPath: 'id', autoIncrement: true });
                    episodeStore.createIndex('videoId', 'videoId', { unique: false });
                    episodeStore.createIndex('season', 'season', { unique: false });
                    episodeStore.createIndex('episode', 'episode', { unique: false });
                }

                if (!db.objectStoreNames.contains('collections')) {
                    const collectionStore = db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true });
                    collectionStore.createIndex('name', 'name', { unique: false });
                    collectionStore.createIndex('dateCreated', 'dateCreated', { unique: false });
                }

                if (!db.objectStoreNames.contains('shares')) {
                    const shareStore = db.createObjectStore('shares', { keyPath: 'code' });
                    shareStore.createIndex('dateCreated', 'dateCreated', { unique: false });
                    shareStore.createIndex('expiresAt', 'expiresAt', { unique: false });
                }

                // Database setup complete
            };
        });
    }

    // Add video
    async addVideo(videoData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['videos'], 'readwrite');
            const store = transaction.objectStore('videos');
            
            const video = {
                title: videoData.title,
                description: videoData.description,
                type: videoData.type, // movie, series, anime
                genre: videoData.genre,
                year: videoData.year,
                rating: videoData.rating || 0,
                duration: videoData.duration,
                poster: videoData.poster, // base64 or URL
                sourceType: videoData.sourceType, // 'iframe', 'direct', etc.
                sourceUrl: videoData.sourceUrl, // file URL or iframe URL
                sourceCategory: videoData.sourceCategory, // 'balancer', 'direct', 'social', 'custom'
                // Other fields
                videoType: videoData.videoType, // for direct videos
                collectionId: videoData.collectionId || null,
                dateAdded: new Date().toISOString(),
                views: 0,
                isFavorite: false
            };

            const request = store.add(video);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                logger.error('Error adding video', request.error);
                reject(request.error);
            };
        });
    }

    // Add episode (for series/anime)
    async addEpisode(episodeData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['episodes'], 'readwrite');
            const store = transaction.objectStore('episodes');
            
            const episode = {
                videoId: episodeData.videoId,
                season: episodeData.season,
                episode: episodeData.episode,
                title: episodeData.title,
                duration: episodeData.duration,
                sourceType: episodeData.sourceType,
                sourceUrl: episodeData.sourceUrl,
                dateAdded: new Date().toISOString()
            };

            const request = store.add(episode);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get all videos
    async getAllVideos() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['videos'], 'readonly');
            const store = transaction.objectStore('videos');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get video by ID
    async getVideo(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['videos'], 'readonly');
            const store = transaction.objectStore('videos');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get episodes by video ID
    async getEpisodes(videoId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['episodes'], 'readonly');
            const store = transaction.objectStore('episodes');
            const index = store.index('videoId');
            const request = index.getAll(videoId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Update video
    async updateVideo(id, updates) {
        return new Promise(async (resolve, reject) => {
            const video = await this.getVideo(id);
            if (!video) {
                reject(new Error('Video not found'));
                return;
            }

            const transaction = this.db.transaction(['videos'], 'readwrite');
            const store = transaction.objectStore('videos');
            
            const updatedVideo = { ...video, ...updates };
            const request = store.put(updatedVideo);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Delete video
    async deleteVideo(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['videos'], 'readwrite');
            const store = transaction.objectStore('videos');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Delete episode
    async deleteEpisode(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['episodes'], 'readwrite');
            const store = transaction.objectStore('episodes');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Search videos
    async searchVideos(query) {
        const allVideos = await this.getAllVideos();
        const lowerQuery = query.toLowerCase();
        
        return allVideos.filter(video => 
            video.title.toLowerCase().includes(lowerQuery) ||
            video.description.toLowerCase().includes(lowerQuery) ||
            video.genre.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter videos
    async filterVideos(filters) {
        const allVideos = await this.getAllVideos();
        
        return allVideos.filter(video => {
            if (filters.type && video.type !== filters.type) return false;
            if (filters.genre && video.genre !== filters.genre) return false;
            if (filters.year && video.year !== filters.year) return false;
            if (filters.minRating && video.rating < filters.minRating) return false;
            return true;
        });
    }

    // Toggle favorite
    async toggleFavorite(id) {
        const video = await this.getVideo(id);
        if (video) {
            return this.updateVideo(id, { isFavorite: !video.isFavorite });
        }
    }

    // Increment views
    async incrementViews(id) {
        const video = await this.getVideo(id);
        if (video) {
            return this.updateVideo(id, { views: (video.views || 0) + 1 });
        }
    }

    // Get statistics
    async getStats() {
        const videos = await this.getAllVideos();
        
        return {
            total: videos.length,
            movies: videos.filter(v => v.type === 'movie').length,
            series: videos.filter(v => v.type === 'series').length,
            anime: videos.filter(v => v.type === 'anime').length,
            favorites: videos.filter(v => v.isFavorite).length,
            totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0)
        };
    }

    // Export data with optional encryption
    async exportData(password = null) {
        const videos = await this.getAllVideos();
        const allEpisodes = [];
        const collections = await this.getAllCollections();
        
        for (const video of videos) {
            const episodes = await this.getEpisodes(video.id);
            allEpisodes.push(...episodes);
        }
        
        const data = {
            version: this.version,
            exportDate: new Date().toISOString(),
            videos: videos,
            episodes: allEpisodes,
            collections: collections
        };
        
        let exportString = JSON.stringify(data, null, 2);
        
        // Encrypt if password provided
        if (password) {
            exportString = await this.encrypt(exportString, password);
        }
        
        return exportString;
    }

    // Import data with optional decryption
    async importData(dataString, password = null) {
        try {
            let jsonString = dataString;
            
            // Decrypt if password provided
            if (password) {
                jsonString = await this.decrypt(dataString, password);
            }
            
            const data = JSON.parse(jsonString);
            
            // Import prefix for collections
            const importPrefix = `Импорт ${new Date().toLocaleDateString()} - `;
            
            // Import collections with prefix
            const collectionIdMap = {};
            if (data.collections) {
                for (const collection of data.collections) {
                    const { id, ...collectionData } = collection;
                    collectionData.name = importPrefix + collectionData.name;
                    const newId = await this.addCollection(collectionData);
                    collectionIdMap[id] = newId;
                }
            }
            
            // Import videos with updated collectionId
            const videoIdMap = {};
            for (const video of data.videos) {
                const { id, ...videoData } = video;
                // Update collectionId if video was in a collection
                if (videoData.collectionId && collectionIdMap[videoData.collectionId]) {
                    videoData.collectionId = collectionIdMap[videoData.collectionId];
                }
                const newId = await this.addVideo(videoData);
                videoIdMap[id] = newId;
            }
            
            // Import episodes with updated videoId
            if (data.episodes) {
                for (const episode of data.episodes) {
                    const { id, videoId, ...episodeData } = episode;
                    // Update videoId to match new video id
                    if (videoIdMap[videoId]) {
                        episodeData.videoId = videoIdMap[videoId];
                        await this.addEpisode(episodeData);
                    }
                }
            }
            
            return true;
        } catch (error) {
            logger.error('Import failed', error);
            throw error;
        }
    }

    // Clear all data
    async clearAll() {
        return new Promise((resolve, reject) => {
            try {
                const storeNames = [];
                
                // Only include stores that exist
                if (this.db.objectStoreNames.contains('videos')) {
                    storeNames.push('videos');
                }
                if (this.db.objectStoreNames.contains('episodes')) {
                    storeNames.push('episodes');
                }
                if (this.db.objectStoreNames.contains('collections')) {
                    storeNames.push('collections');
                }
                
                if (storeNames.length === 0) {
                    resolve();
                    return;
                }
                
                const transaction = this.db.transaction(storeNames, 'readwrite');
                
                storeNames.forEach(storeName => {
                    transaction.objectStore(storeName).clear();
                });
                
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Simple encryption using Web Crypto API
    async encrypt(text, password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        // Derive key from password
        const passwordKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );
        
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            passwordKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );
        
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            data
        );
        
        // Combine salt + iv + encrypted data
        const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        result.set(salt, 0);
        result.set(iv, salt.length);
        result.set(new Uint8Array(encrypted), salt.length + iv.length);
        
        // Convert to base64 in chunks to avoid stack overflow
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < result.length; i += chunkSize) {
            const chunk = result.subarray(i, Math.min(i + chunkSize, result.length));
            binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
    }

    // Simple decryption using Web Crypto API
    async decrypt(encryptedText, password) {
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            
            // Clean and prepare the encrypted text
            let cleanText = encryptedText;
            
            // If it's a string, clean it
            if (typeof cleanText === 'string') {
                // Remove whitespace, newlines, and other non-base64 characters
                cleanText = cleanText.trim().replace(/[\r\n\s]/g, '');
                
                // Validate base64 format
                if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanText)) {
                    throw new Error('Неверный формат зашифрованных данных');
                }
            }
            
            // Decode base64 with error handling
            let data;
            try {
                data = Uint8Array.from(atob(cleanText), c => c.charCodeAt(0));
            } catch (e) {
                throw new Error('Неверный формат зашифрованных данных');
            }
            
            // Validate minimum data length (salt + iv + some encrypted data)
            if (data.length < 29) {
                throw new Error('Поврежденные зашифрованные данные');
            }
            
            // Extract salt, iv, and encrypted data
            const salt = data.slice(0, 16);
            const iv = data.slice(16, 28);
            const encrypted = data.slice(28);
            
            // Derive key from password
            const passwordKey = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                passwordKey,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );
            
            return decoder.decode(decrypted);
        } catch (error) {
            if (error.name === 'OperationError' || error.message.includes('decryption')) {
                throw new Error('Неверный пароль');
            }
            throw error;
        }
    }

    // Generate share code (compact base64 encoded data)
    // Helper function to encode Unicode strings to base64
    unicodeToBase64(str) {
        // Encode string to UTF-8 bytes, then to base64
        const utf8Bytes = new TextEncoder().encode(str);
        const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
        return btoa(binaryString);
    }

    // Helper function to decode base64 to Unicode strings
    base64ToUnicode(base64) {
        // Decode base64 to binary string, then to UTF-8
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    }

    async generateShareCode(videoId, password = null) {
        const video = await this.getVideo(videoId);
        if (!video) throw new Error('Video not found');
        
        const episodes = await this.getEpisodes(videoId);
        
        const shareData = {
            v: 1, // version
            d: new Date().toISOString(), // date
            video: video,
            episodes: episodes
        };
        
        let dataString = JSON.stringify(shareData);
        
        // Encrypt if password provided
        if (password) {
            dataString = await this.encrypt(dataString, password);
            // Add encryption marker
            return 'E:' + dataString;
        }
        
        // Compress and encode for non-encrypted data using Unicode-safe encoding
        return 'P:' + this.unicodeToBase64(dataString);
    }

    // Import from share code
    async importFromShareCode(code, password = null) {
        try {
            if (!code || code.length < 3) {
                throw new Error('Неверный код');
            }
            
            const type = code.substring(0, 2);
            const data = code.substring(2);
            
            let jsonString;
            
            if (type === 'E:') {
                // Encrypted data
                if (!password) {
                    throw new Error('Требуется пароль');
                }
                jsonString = await this.decrypt(data, password);
            } else if (type === 'P:') {
                // Plain base64 data - use Unicode-safe decoding
                jsonString = this.base64ToUnicode(data);
            } else {
                throw new Error('Неверный формат кода');
            }
            
            const shareData = JSON.parse(jsonString);
            
            // Validate data structure
            if (!shareData.video) {
                throw new Error('Неверный формат данных');
            }
            
            // Add video
            const { id, ...videoData } = shareData.video;
            const newVideoId = await this.addVideo(videoData);
            
            // Add episodes
            if (shareData.episodes && shareData.episodes.length > 0) {
                for (const episode of shareData.episodes) {
                    const { id, videoId, ...episodeData } = episode;
                    await this.addEpisode({ ...episodeData, videoId: newVideoId });
                }
            }
            
            return newVideoId;
        } catch (error) {
            logger.error('Import from code failed', error);
            throw error;
        }
    }

    // Generate shareable link (deprecated - kept for compatibility)
    async generateShareLink(videoId, password = null) {
        const video = await this.getVideo(videoId);
        if (!video) throw new Error('Video not found');
        
        const episodes = await this.getEpisodes(videoId);
        
        const shareData = {
            video: video,
            episodes: episodes,
            sharedDate: new Date().toISOString()
        };
        
        let dataString = JSON.stringify(shareData);
        
        if (password) {
            dataString = await this.encrypt(dataString, password);
            // For encrypted data, use URL encoding
            const encoded = encodeURIComponent(dataString);
            return `${window.location.origin}${window.location.pathname}?share=${encoded}&encrypted=1`;
        } else {
            // For non-encrypted data, use Unicode-safe base64 encoding
            const encoded = this.unicodeToBase64(dataString);
            return `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(encoded)}`;
        }
    }

    // Export single video data (for file download)
    async exportVideoData(videoId, password = null) {
        const video = await this.getVideo(videoId);
        if (!video) throw new Error('Video not found');
        
        const episodes = await this.getEpisodes(videoId);
        
        const shareData = {
            version: this.version,
            exportDate: new Date().toISOString(),
            videos: [video],
            episodes: episodes,
            collections: []
        };
        
        let dataString = JSON.stringify(shareData, null, 2);
        
        // Encrypt if password provided
        if (password) {
            dataString = await this.encrypt(dataString, password);
        }
        
        return dataString;
    }

    // Import from share link
    async importFromShare(shareData, password = null, isEncrypted = false) {
        try {
            let jsonString = shareData;
            
            if (isEncrypted) {
                if (!password) {
                    throw new Error('Требуется пароль для расшифровки');
                }
                // Decrypt encrypted data
                jsonString = await this.decrypt(decodeURIComponent(shareData), password);
            } else {
                // Decode base64 for non-encrypted data using Unicode-safe decoding
                try {
                    jsonString = this.base64ToUnicode(decodeURIComponent(shareData));
                } catch (e) {
                    // If decoding fails, try to parse as is (for backward compatibility)
                    jsonString = shareData;
                }
            }
            
            const data = JSON.parse(jsonString);
            
            // Validate data structure
            if (!data.video) {
                throw new Error('Неверный формат данных: отсутствует информация о видео');
            }
            
            // Add video
            const { id, ...videoData } = data.video;
            const newVideoId = await this.addVideo(videoData);
            
            // Add episodes
            if (data.episodes && data.episodes.length > 0) {
                for (const episode of data.episodes) {
                    const { id, videoId, ...episodeData } = episode;
                    await this.addEpisode({ ...episodeData, videoId: newVideoId });
                }
            }
            
            return newVideoId;
        } catch (error) {
            logger.error('Import from share failed', error);
            throw new Error(`Ошибка импорта: ${error.message}`);
        }
    }

    // ===== COLLECTIONS METHODS =====
    
    // Add collection
    async addCollection(collectionData) {
        return new Promise((resolve, reject) => {
            if (!this.db.objectStoreNames.contains('collections')) {
                reject(new Error('Collections store not available. Please refresh the page.'));
                return;
            }
            
            const transaction = this.db.transaction(['collections'], 'readwrite');
            const store = transaction.objectStore('collections');
            
            const collection = {
                name: collectionData.name,
                description: collectionData.description || '',
                poster: collectionData.poster || '',
                dateCreated: new Date().toISOString()
            };

            const request = store.add(collection);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get all collections
    async getAllCollections() {
        return new Promise((resolve, reject) => {
            if (!this.db.objectStoreNames.contains('collections')) {
                resolve([]);
                return;
            }
            
            const transaction = this.db.transaction(['collections'], 'readonly');
            const store = transaction.objectStore('collections');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get collection by ID
    async getCollection(id) {
        return new Promise((resolve, reject) => {
            if (!this.db.objectStoreNames.contains('collections')) {
                resolve(null);
                return;
            }
            
            const transaction = this.db.transaction(['collections'], 'readonly');
            const store = transaction.objectStore('collections');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Update collection
    async updateCollection(id, updates) {
        return new Promise(async (resolve, reject) => {
            if (!this.db.objectStoreNames.contains('collections')) {
                reject(new Error('Collections store not available'));
                return;
            }
            
            const collection = await this.getCollection(id);
            if (!collection) {
                reject(new Error('Collection not found'));
                return;
            }

            const transaction = this.db.transaction(['collections'], 'readwrite');
            const store = transaction.objectStore('collections');
            
            const updatedCollection = { ...collection, ...updates };
            const request = store.put(updatedCollection);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Delete collection
    async deleteCollection(id) {
        return new Promise(async (resolve, reject) => {
            if (!this.db.objectStoreNames.contains('collections')) {
                reject(new Error('Collections store not available'));
                return;
            }
            
            // Remove collectionId from all videos in this collection
            const videos = await this.getVideosByCollection(id);
            for (const video of videos) {
                await this.updateVideo(video.id, { collectionId: null });
            }

            const transaction = this.db.transaction(['collections'], 'readwrite');
            const store = transaction.objectStore('collections');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get videos by collection
    async getVideosByCollection(collectionId) {
        const allVideos = await this.getAllVideos();
        return allVideos.filter(video => video.collectionId === collectionId);
    }

    // Add video to collection
    async addVideoToCollection(videoId, collectionId) {
        return this.updateVideo(videoId, { collectionId: collectionId });
    }

    // Remove video from collection
    async removeVideoFromCollection(videoId) {
        return this.updateVideo(videoId, { collectionId: null });
    }
}

// Create global instance
const db = new FramesearchDB();

// Initialize on load
db.init().catch(err => {
    logger.error('Failed to initialize database', err);
});

