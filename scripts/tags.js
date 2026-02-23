/**
 * Framesearch - Smart Tags Manager
 * Система умных тегов и автозаполнения
 * 
 * Автор: SerGioPlay
 * © 2026 Framesearch
 */

class TagsManager {
    constructor() {
        this.popularTags = [
            'балансер', 'прямая ссылка', 'соцсети', 'музыка', 'custom',
            'iframe', 'видео', 'сериал', 'аниме', 'документальный',
            'обучающий', 'лекция', 'курс', 'трейлер', 'клип',
            'живой', 'стрим', 'онлайн', 'оффлайн', 'архив'
        ];
    }

    // Получить теги видео
    getVideoTags(video) {
        return video.tags || [];
    }

    // Установить теги видео
    async setVideoTags(videoId, tags) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return false;

        const video = await dbInstance.getVideo(videoId);
        if (!video) return false;

        video.tags = tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);
        await dbInstance.updateVideo(video.id, { tags: video.tags });

        if (typeof logger !== 'undefined') {
            logger.info('🏷️ Теги', `Обновлены теги для видео ${videoId}`);
        }
        return true;
    }

    // Добавить тег
    async addTag(videoId, tag) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        
        if (!dbInstance) {
            return false;
        }

        const video = await dbInstance.getVideo(videoId);
        
        if (!video) {
            return false;
        }

        if (!video.tags) video.tags = [];
        
        const normalizedTag = tag.toLowerCase().trim();
        
        if (!video.tags.includes(normalizedTag)) {
            video.tags.push(normalizedTag);
            await dbInstance.updateVideo(video.id, { tags: video.tags });
            if (typeof logger !== 'undefined') {
                logger.info('🏷️ Теги', `Добавлен тег "${tag}"`);
            }
            return true;
        }

        return false;
    }

    // Удалить тег
    async removeTag(videoId, tag) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return false;

        const video = await dbInstance.getVideo(videoId);
        if (!video) return false;

        if (video.tags) {
            video.tags = video.tags.filter(t => t !== tag.toLowerCase().trim());
            await dbInstance.updateVideo(video.id, { tags: video.tags });
            if (typeof logger !== 'undefined') {
                logger.info('🏷️ Теги', `Удален тег "${tag}"`);
            }
            return true;
        }

        return false;
    }

    // Получить все уникальные теги
    async getAllTags() {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return [];

        const videos = await dbInstance.getAllVideos();
        const tagsSet = new Set();

        videos.forEach(video => {
            if (video.tags) {
                video.tags.forEach(tag => tagsSet.add(tag));
            }
        });

        return Array.from(tagsSet).sort();
    }

    // Получить облако тегов с частотой
    async getTagCloud() {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return [];

        const videos = await dbInstance.getAllVideos();
        const tagCount = {};

        videos.forEach(video => {
            if (video.tags) {
                video.tags.forEach(tag => {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            }
        });

        return Object.entries(tagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
    }

    // Предложить теги на основе названия и описания
    suggestTags(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        const suggestions = [];

        this.popularTags.forEach(tag => {
            if (text.includes(tag)) {
                suggestions.push(tag);
            }
        });

        return suggestions;
    }

    // Поиск видео по тегу
    async searchByTag(tag) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return [];

        const videos = await dbInstance.getAllVideos();
        const normalizedTag = tag.toLowerCase().trim();

        return videos.filter(video => 
            video.tags && video.tags.includes(normalizedTag)
        );
    }

    // Открыть редактор тегов
    async openTagEditor(videoId) {
        // Ensure videoId is a number
        videoId = parseInt(videoId, 10);
        
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) {
            alert('База данных недоступна. Редактор тегов работает только на страницах с видео.');
            return;
        }

        const video = await dbInstance.getVideo(videoId);
        if (!video) return;

        const currentTags = video.tags || [];
        const allTags = await this.getAllTags();
        const suggestions = this.suggestTags(video.title, video.description || '');
        
        // Helper function for translation
        const t = (key) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return key;
        };

        const modalHTML = `
            <div id="tagEditorModal" class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>
                            <i data-lucide="tag"></i>
                            <span>${t('tags.title')}</span>
                        </h2>
                        <button class="modal-close" onclick="tagsManager.closeTagEditor()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div style="margin-bottom: 1rem;">
                            <strong>${video.title}</strong>
                        </div>

                        <!-- Текущие теги -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">
                                ${t('tags.current')}
                            </label>
                            <div id="currentTagsContainer" class="card-tags" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${currentTags.map(tag => `
                                    <span class="card-tag" style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: rgba(165, 180, 252, 0.15); border: 1px solid rgba(165, 180, 252, 0.3); border-radius: 20px; color: var(--accent-primary); font-size: 0.875rem;">
                                        ${tag}
                                        <button onclick="tagsManager.removeTagFromEditor(${videoId}, '${tag}')" class="tag-remove" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 0; margin-left: 0.25rem; display: inline-flex; align-items: center; transition: all 0.2s ease;">
                                            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                                        </button>
                                    </span>
                                `).join('')}
                                ${currentTags.length === 0 ? `<span style="color: var(--text-secondary);">${t('tags.noTags')}</span>` : ''}
                            </div>
                        </div>

                        <!-- Добавить тег -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">
                                ${t('tags.add')}
                            </label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input 
                                    type="text" 
                                    id="newTagInput" 
                                    placeholder="${t('tags.placeholder')}"
                                    style="flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;"
                                    onkeypress="if(event.key==='Enter') tagsManager.addTagFromEditor(${videoId})"
                                >
                                <button onclick="tagsManager.addTagFromEditor(${videoId})" class="btn btn-primary">
                                    <i data-lucide="plus"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Шаблонные теги -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">
                                ${t('tags.suggestions')}
                            </label>
                            <div class="tag-suggestions" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${['балансер', 'прямая ссылка', 'соцсети', 'музыка', 'избранное', 'посмотреть позже'].filter(tag => !currentTags.includes(tag)).map(tag => `
                                    <button class="tag-suggestion" onclick="tagsManager.addSuggestedTag(${videoId}, '${tag}')" style="padding: 0.5rem 1rem; background: rgba(165, 180, 252, 0.1); border: 1px solid rgba(165, 180, 252, 0.3); border-radius: 20px; color: var(--accent-primary); font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;">
                                        ${tag}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button onclick="tagsManager.closeTagEditor()" class="btn btn-secondary">
                            ${t('btn.close')}
                        </button>
                    </div>
                </div>
            </div>
        `;

        const oldModal = document.getElementById('tagEditorModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async addTagFromEditor(videoId) {
        const input = document.getElementById('newTagInput');
        const tag = input.value.trim();

        // Ensure videoId is a number
        videoId = parseInt(videoId, 10);

        if (tag) {
            const result = await this.addTag(videoId, tag);
            input.value = '';
            
            // Wait a bit for DB to update, then reload the tag editor
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.openTagEditor(videoId);
            
            // Also update video page tags if we're on video page
            if (typeof window.loadVideoTags === 'function' && window.currentVideoId === videoId) {
                await window.loadVideoTags(videoId);
            }
        }
    }

    async addSuggestedTag(videoId, tag) {
        // Ensure videoId is a number
        videoId = parseInt(videoId, 10);
        await this.addTag(videoId, tag);
        
        // Wait a bit for DB to update, then reload the tag editor
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.openTagEditor(videoId);
        
        // Also update video page tags if we're on video page
        if (typeof window.loadVideoTags === 'function' && window.currentVideoId === videoId) {
            await window.loadVideoTags(videoId);
        }
    }

    async removeTagFromEditor(videoId, tag) {
        // Ensure videoId is a number
        videoId = parseInt(videoId, 10);
        await this.removeTag(videoId, tag);
        
        // Wait a bit for DB to update, then reload the tag editor
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.openTagEditor(videoId);
        
        // Also update video page tags if we're on video page
        if (typeof window.loadVideoTags === 'function' && window.currentVideoId === videoId) {
            await window.loadVideoTags(videoId);
        }
    }

    closeTagEditor() {
        const modal = document.getElementById('tagEditorModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
        
        // Обновить главную страницу если она открыта
        if (typeof loadVideos === 'function') {
            loadVideos();
        }
    }

    // Открыть облако тегов
    async openTagCloud() {
        const tagCloud = await this.getTagCloud();
        
        // Helper function for translation
        const t = (key) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return key;
        };

        if (tagCloud.length === 0) {
            if (typeof dialog !== 'undefined' && dialog.alert) {
                await dialog.alert(
                    t('tags.noTagsYet'),
                    t('tags.cloud')
                );
            } else {
                alert(t('tags.noTagsYet'));
            }
            return;
        }

        const maxCount = Math.max(...tagCloud.map(t => t.count));

        const modalHTML = `
            <div id="tagCloudModal" class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h2>
                            <i data-lucide="cloud"></i>
                            <span>${t('tags.cloud')}</span>
                        </h2>
                        <button class="modal-close" onclick="tagsManager.closeTagCloud()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="tag-cloud">
                            ${tagCloud.map(({ tag, count }) => {
                                const size = 0.8 + (count / maxCount) * 1.5;
                                const opacity = 0.6 + (count / maxCount) * 0.4;
                                return `
                                    <span 
                                        class="cloud-tag" 
                                        style="font-size: ${size}rem; opacity: ${opacity};"
                                        onclick="tagsManager.searchByTagAndShow('${tag}')"
                                        title="${count} ${t('stats.views')}"
                                    >
                                        ${tag}
                                    </span>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const oldModal = document.getElementById('tagCloudModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async searchByTagAndShow(tag) {
        this.closeTagCloud();
        // Перенаправить на страницу поиска с тегом
        window.location.href = `search_results.html?tag=${encodeURIComponent(tag)}`;
    }

    closeTagCloud() {
        const modal = document.getElementById('tagCloudModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
}

// Создать глобальный экземпляр
const tagsManager = new TagsManager();
window.tagsManager = tagsManager;

if (typeof logger !== 'undefined') {
    logger.success('Tags Manager initialized');
}
