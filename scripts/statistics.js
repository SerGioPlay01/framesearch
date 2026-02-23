/**
 * Framesearch - Statistics & Analytics Manager
 * Система статистики и аналитики просмотров
 * 
 * Автор: SerGioPlay
 * © 2026 Framesearch
 */

class StatisticsManager {
    constructor() {
        this.storageKey = 'framesearch-statistics';
        this.stats = this.loadStats();
    }

    loadStats() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            views: [],
            totalWatchTime: 0,
            lastUpdated: Date.now()
        };
    }

    saveStats() {
        this.stats.lastUpdated = Date.now();
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }

    // Записать просмотр
    recordView(videoId, duration = 0) {
        const view = {
            videoId,
            timestamp: Date.now(),
            duration, // в секундах
            date: new Date().toISOString().split('T')[0]
        };

        this.stats.views.push(view);
        this.stats.totalWatchTime += duration;
        this.saveStats();

        if (typeof logger !== 'undefined') {
            logger.info('📊 Статистика', `Просмотр записан: ${videoId}`);
        }
    }

    // Получить статистику по видео
    getVideoStats(videoId) {
        const views = this.stats.views.filter(v => v.videoId === videoId);
        const totalViews = views.length;
        const totalTime = views.reduce((sum, v) => sum + v.duration, 0);
        const lastView = views.length > 0 ? views[views.length - 1].timestamp : null;

        return {
            totalViews,
            totalTime,
            lastView,
            averageTime: totalViews > 0 ? totalTime / totalViews : 0
        };
    }

    // Топ просматриваемых видео
    async getTopVideos(limit = 10) {
        const videoViews = {};
        
        this.stats.views.forEach(view => {
            if (!videoViews[view.videoId]) {
                videoViews[view.videoId] = {
                    videoId: view.videoId,
                    count: 0,
                    totalTime: 0
                };
            }
            videoViews[view.videoId].count++;
            videoViews[view.videoId].totalTime += view.duration;
        });

        const sorted = Object.values(videoViews)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);

        // Получить данные видео из БД
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        
        if (dbInstance && dbInstance.getAllVideos) {
            const videos = await dbInstance.getAllVideos();
            return sorted.map(stat => {
                const video = videos.find(v => v.id === stat.videoId);
                return {
                    ...stat,
                    video
                };
            }).filter(item => item.video);
        }

        return sorted;
    }

    // Статистика по дням
    getViewsByDate(days = 30) {
        const now = new Date();
        const dateMap = {};

        // Инициализация дат
        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dateMap[dateStr] = { views: 0, time: 0 };
        }

        // Подсчет просмотров
        this.stats.views.forEach(view => {
            if (dateMap[view.date]) {
                dateMap[view.date].views++;
                dateMap[view.date].time += view.duration;
            }
        });

        return Object.entries(dateMap)
            .map(([date, data]) => ({ date, ...data }))
            .reverse();
    }

    // Общая статистика
    getOverallStats() {
        const totalViews = this.stats.views.length;
        const uniqueVideos = new Set(this.stats.views.map(v => v.videoId)).size;
        const totalTime = this.stats.totalWatchTime;
        const avgTimePerView = totalViews > 0 ? totalTime / totalViews : 0;

        // Статистика за последние 7 дней
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const weekViews = this.stats.views.filter(v => v.timestamp > weekAgo);

        return {
            totalViews,
            uniqueVideos,
            totalTime,
            avgTimePerView,
            weekViews: weekViews.length,
            weekTime: weekViews.reduce((sum, v) => sum + v.duration, 0)
        };
    }

    // Форматирование времени
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}ч ${minutes}м`;
        }
        return `${minutes}м`;
    }

    // Открыть модальное окно статистики
    async openModal() {
        const stats = this.getOverallStats();
        
        // Check if there's any data
        if (stats.totalViews === 0) {
            const t = (key) => {
                if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                    return i18n.t(key);
                }
                return key;
            };
            
            if (typeof dialog !== 'undefined' && dialog.alert) {
                await dialog.alert(
                    t('stats.noData'),
                    t('stats.title')
                );
            } else {
                alert(t('stats.noData'));
            }
            return;
        }
        
        const topVideos = await this.getTopVideos(5);
        const viewsByDate = this.getViewsByDate(14);
        
        // Helper function for translation
        const t = (key) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return key;
        };

        const modalHTML = `
            <div id="statisticsModal" class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h2>
                            <i data-lucide="bar-chart-2"></i>
                            <span>${t('stats.title')}</span>
                        </h2>
                        <button class="modal-close" onclick="statisticsManager.closeModal()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <!-- Общая статистика -->
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon stat-icon-primary">
                                    <i data-lucide="eye"></i>
                                </div>
                                <div class="stat-value">${stats.totalViews}</div>
                                <div class="stat-label">${t('stats.totalViews')}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon stat-icon-secondary">
                                    <i data-lucide="film"></i>
                                </div>
                                <div class="stat-value">${stats.uniqueVideos}</div>
                                <div class="stat-label">${t('stats.uniqueVideos')}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon stat-icon-purple">
                                    <i data-lucide="clock"></i>
                                </div>
                                <div class="stat-value">${this.formatTime(stats.totalTime)}</div>
                                <div class="stat-label">${t('stats.watchTime')}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon stat-icon-cyan">
                                    <i data-lucide="trending-up"></i>
                                </div>
                                <div class="stat-value">${stats.weekViews}</div>
                                <div class="stat-label">${t('stats.thisWeek')}</div>
                            </div>
                        </div>

                        <!-- Топ видео -->
                        <div class="stats-section">
                            <h3>
                                <i data-lucide="trophy" class="trophy-icon"></i>
                                ${t('stats.topVideos')}
                            </h3>
                            <div class="top-videos-list">
                                ${topVideos.map((item, index) => `
                                    <div class="top-video-item">
                                        <div class="top-video-rank">#${index + 1}</div>
                                        <img src="${item.video?.poster || 'https://via.placeholder.com/60x90'}" alt="${item.video?.title || 'Видео'}">
                                        <div class="top-video-info">
                                            <div class="top-video-title">${item.video?.title || 'Неизвестно'}</div>
                                            <div class="top-video-stats">
                                                <span><i data-lucide="eye"></i> ${item.count} ${t('stats.views')}</span>
                                                <span><i data-lucide="clock"></i> ${this.formatTime(item.totalTime)}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- График активности -->
                        <div class="stats-section">
                            <h3>
                                <i data-lucide="activity"></i>
                                ${t('stats.activity')}
                            </h3>
                            <div class="activity-chart">
                                ${viewsByDate.map(day => {
                                    const maxViews = Math.max(...viewsByDate.map(d => d.views), 1);
                                    const height = (day.views / maxViews) * 100;
                                    return `
                                        <div class="chart-bar" title="${day.date}: ${day.views} ${t('stats.views')}">
                                            <div class="chart-bar-fill" style="height: ${height}%"></div>
                                            <div class="chart-bar-label">${new Date(day.date).getDate()}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Удалить старое модальное окно если есть
        const oldModal = document.getElementById('statisticsModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    closeModal() {
        const modal = document.getElementById('statisticsModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    // Очистить статистику
    clearStats() {
        if (confirm('Вы уверены, что хотите очистить всю статистику?')) {
            this.stats = {
                views: [],
                totalWatchTime: 0,
                lastUpdated: Date.now()
            };
            this.saveStats();
            if (typeof logger !== 'undefined') {
                logger.success('Статистика очищена');
            }
        }
    }
}

// Создать глобальный экземпляр
const statisticsManager = new StatisticsManager();
window.statisticsManager = statisticsManager;

if (typeof logger !== 'undefined') {
    logger.success('Statistics Manager initialized');
}
