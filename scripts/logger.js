/**
 * Framesearch - Beautiful Console Logger
 * Централизованная система логирования с красивым выводом
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class Logger {
    constructor() {
        this.appName = 'Framesearch';
        this.version = '4.5.0';
        this.isDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' ||
                            window.location.hostname.includes('192.168');
        
        // Стили для разных типов сообщений
        this.styles = {
            header: 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px;',
            success: 'background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;',
            error: 'background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;',
            warning: 'background: #f59e0b; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;',
            info: 'background: #3b82f6; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;',
            debug: 'background: #6b7280; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;',
            event: 'background: #8b5cf6; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;',
            data: 'background: #06b6d4; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;',
            label: 'color: #6366f1; font-weight: 600;',
            value: 'color: #10b981; font-weight: 500;',
            time: 'color: #6b7280; font-size: 11px;'
        };
        
        this.emoji = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            debug: '🔧',
            event: '📡',
            data: '📊',
            rocket: '🚀',
            fire: '🔥',
            star: '⭐',
            check: '✓',
            cross: '✗',
            arrow: '→',
            time: '⏱️',
            database: '💾',
            video: '🎬',
            music: '🎵',
            search: '🔍',
            theme: '🎨',
            import: '📥',
            export: '📤',
            collection: '📁',
            settings: '⚙️',
            cookie: '🍪'
        };
        
        this.startTime = Date.now();
        this.logHistory = [];
        this.maxHistorySize = 100;
    }

    // Инициализация с приветствием
    init() {
        if (!this.isDevelopment) return;
        
        console.clear();
        this.printWelcome();
        this.printSystemInfo();
    }

    // Красивое приветствие
    printWelcome() {
        const gradient = 'background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); color: white; padding: 20px; border-radius: 12px; font-size: 16px; font-weight: bold; text-align: center;';
        
        console.log('%c' + `
╔═══════════════════════════════════════════╗
║                                           ║
║         🎬 FRAMESEARCH v${this.version}         ║
║                                           ║
║     Менеджер видеоконтента нового         ║
║              поколения                    ║
║                                           ║
╚═══════════════════════════════════════════╝
        `, gradient);
        
        console.log('%c' + `${this.emoji.rocket} Система запущена успешно!`, this.styles.success);
        console.log('');
    }

    // Информация о системе
    printSystemInfo() {
        const info = {
            'Версия': this.version,
            'Режим': this.isDevelopment ? 'Development' : 'Production',
            'Браузер': this.getBrowserInfo(),
            'Платформа': navigator.platform,
            'Язык': navigator.language,
            'Экран': `${window.screen.width}x${window.screen.height}`,
            'Viewport': `${window.innerWidth}x${window.innerHeight}`
        };
        
        console.group('%c' + `${this.emoji.info} Информация о системе`, this.styles.info);
        Object.entries(info).forEach(([key, value]) => {
            console.log(`%c${key}:%c ${value}`, this.styles.label, this.styles.value);
        });
        console.groupEnd();
        console.log('');
    }

    // Получить информацию о браузере
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    // Форматирование времени
    getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            fractionalSecondDigits: 3
        });
    }

    // Добавить в историю
    addToHistory(type, message, data) {
        this.logHistory.push({
            type,
            message,
            data,
            timestamp: Date.now()
        });
        
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }
    }

    // Успешное действие
    success(message, data = null) {
        if (!this.isDevelopment) return;
        
        console.log(
            `%c${this.emoji.success} SUCCESS %c${message} %c${this.getTimestamp()}`,
            this.styles.success,
            'color: #10b981; font-weight: 500;',
            this.styles.time
        );
        
        if (data) {
            console.log('%cДанные:', this.styles.label, data);
        }
        
        this.addToHistory('success', message, data);
    }

    // Ошибка
    error(message, error = null) {
        if (!this.isDevelopment) return;
        
        console.log(
            `%c${this.emoji.error} ERROR %c${message} %c${this.getTimestamp()}`,
            this.styles.error,
            'color: #ef4444; font-weight: 500;',
            this.styles.time
        );
        
        if (error) {
            console.error(error);
        }
        
        this.addToHistory('error', message, error);
    }

    // Предупреждение
    warning(message, data = null) {
        if (!this.isDevelopment) return;
        
        console.log(
            `%c${this.emoji.warning} WARNING %c${message} %c${this.getTimestamp()}`,
            this.styles.warning,
            'color: #f59e0b; font-weight: 500;',
            this.styles.time
        );
        
        if (data) {
            console.log('%cДанные:', this.styles.label, data);
        }
        
        this.addToHistory('warning', message, data);
    }

    // Алиас для warning
    warn(message, data = null) {
        this.warning(message, data);
    }

    // Информация
    info(message, data = null) {
        if (!this.isDevelopment) return;
        
        console.log(
            `%c${this.emoji.info} INFO %c${message} %c${this.getTimestamp()}`,
            this.styles.info,
            'color: #3b82f6; font-weight: 500;',
            this.styles.time
        );
        
        if (data) {
            console.log('%cДанные:', this.styles.label, data);
        }
        
        this.addToHistory('info', message, data);
    }

    // Отладка
    debug(message, data = null) {
        if (!this.isDevelopment) return;
        
        console.log(
            `%c${this.emoji.debug} DEBUG %c${message} %c${this.getTimestamp()}`,
            this.styles.debug,
            'color: #6b7280; font-weight: 500;',
            this.styles.time
        );
        
        if (data) {
            console.log('%cДанные:', this.styles.label, data);
        }
        
        this.addToHistory('debug', message, data);
    }

    // События
    event(eventName, data = null) {
        if (!this.isDevelopment) return;
        
        console.log(
            `%c${this.emoji.event} EVENT %c${eventName} %c${this.getTimestamp()}`,
            this.styles.event,
            'color: #8b5cf6; font-weight: 500;',
            this.styles.time
        );
        
        if (data) {
            console.log('%cДанные события:', this.styles.label, data);
        }
        
        this.addToHistory('event', eventName, data);
    }

    // Данные
    data(label, data) {
        if (!this.isDevelopment) return;
        
        console.log(
            `%c${this.emoji.data} DATA %c${label} %c${this.getTimestamp()}`,
            this.styles.data,
            'color: #06b6d4; font-weight: 500;',
            this.styles.time
        );
        
        console.table(data);
        
        this.addToHistory('data', label, data);
    }

    // Группа сообщений
    group(title, callback) {
        if (!this.isDevelopment) return;
        
        console.group(`%c${this.emoji.star} ${title}`, this.styles.header);
        if (callback) callback();
        console.groupEnd();
    }

    // Таймер
    time(label) {
        if (!this.isDevelopment) return;
        console.time(`${this.emoji.time} ${label}`);
    }

    timeEnd(label) {
        if (!this.isDevelopment) return;
        console.timeEnd(`${this.emoji.time} ${label}`);
    }

    // Производительность
    performance(label, duration) {
        if (!this.isDevelopment) return;
        
        const color = duration < 100 ? '#10b981' : duration < 500 ? '#f59e0b' : '#ef4444';
        console.log(
            `%c${this.emoji.time} PERFORMANCE %c${label}: ${duration.toFixed(2)}ms`,
            this.styles.info,
            `color: ${color}; font-weight: 600;`
        );
    }

    // Специальные методы для разных модулей
    
    database(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.database} База данных: ${action}`, data);
    }

    video(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.video} Видео: ${action}`, data);
    }

    music(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.music} Музыка: ${action}`, data);
    }

    security(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`🔐 Безопасность: ${action}`, data);
    }

    analytics(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`📊 Аналитика: ${action}`, data);
    }

    search(query, results = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.search} Поиск: "${query}"`, results);
    }

    theme(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.theme} Тема: ${action}`, data);
    }

    importData(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.import} Импорт: ${action}`, data);
    }

    exportData(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.export} Экспорт: ${action}`, data);
    }

    collection(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.collection} Коллекция: ${action}`, data);
    }

    settings(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.settings} Настройки: ${action}`, data);
    }

    cookie(action, data = null) {
        if (!this.isDevelopment) return;
        this.info(`${this.emoji.cookie} Cookies: ${action}`, data);
    }

    // Показать историю логов
    showHistory() {
        if (!this.isDevelopment) return;
        
        console.group('%c' + `${this.emoji.data} История логов (последние ${this.logHistory.length})`, this.styles.header);
        this.logHistory.forEach((log, index) => {
            const time = new Date(log.timestamp).toLocaleTimeString('ru-RU');
            console.log(`${index + 1}. [${time}] ${log.type.toUpperCase()}: ${log.message}`);
        });
        console.groupEnd();
    }

    // Очистить историю
    clearHistory() {
        this.logHistory = [];
        if (this.isDevelopment) {
            console.log('%c' + `${this.emoji.check} История логов очищена`, this.styles.success);
        }
    }

    // Статистика
    showStats() {
        if (!this.isDevelopment) return;
        
        const uptime = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const stats = {
            'Время работы': `${uptime}s`,
            'Всего логов': this.logHistory.length,
            'Успешных': this.logHistory.filter(l => l.type === 'success').length,
            'Ошибок': this.logHistory.filter(l => l.type === 'error').length,
            'Предупреждений': this.logHistory.filter(l => l.type === 'warning').length,
            'События': this.logHistory.filter(l => l.type === 'event').length
        };
        
        console.group('%c' + `${this.emoji.data} Статистика`, this.styles.header);
        Object.entries(stats).forEach(([key, value]) => {
            console.log(`%c${key}:%c ${value}`, this.styles.label, this.styles.value);
        });
        console.groupEnd();
    }

    // Красивая таблица
    table(title, data) {
        if (!this.isDevelopment) return;
        
        console.log(`%c${this.emoji.data} ${title}`, this.styles.data);
        console.table(data);
    }

    // ASCII Art
    ascii(text) {
        if (!this.isDevelopment) return;
        console.log(`%c${text}`, 'font-family: monospace; color: #6366f1; font-size: 12px;');
    }
}

// Создать глобальный экземпляр
const logger = new Logger();
window.logger = logger;

// Инициализировать при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        logger.init();
    });
} else {
    logger.init();
}

// Добавить глобальные команды для консоли
window.logHistory = () => logger.showHistory();
window.logStats = () => logger.showStats();
window.logClear = () => logger.clearHistory();

// Экспорт
window.Logger = Logger;
