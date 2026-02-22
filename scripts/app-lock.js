/**
 * Framesearch - App Lock Manager
 * Управление защитой приложения паролем
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class AppLockManager {
    constructor() {
        this.storageKey = 'framesearch-app-lock';
        this.sessionKey = 'framesearch-session-unlocked';
        this.sessionTimeKey = 'framesearch-session-time';
        this.sessionTimeout = 30 * 60 * 1000; // 30 минут
        // Не вызываем init() в конструкторе, будем вызывать после загрузки DOM
    }

    init() {
        logger.security('🔐 Initializing App Lock Manager');
        
        // Проверяем временную разблокировку после обновления PWA
        this.checkTempUnlock();
        
        // Логируем текущее состояние
        const lockData = this.getLockData();
        logger.security(`Lock data in localStorage: ${lockData ? 'EXISTS' : 'NOT FOUND'}`);
        if (lockData) {
            logger.security(`Lock enabled: ${lockData.enabled}`);
        }
        
        // Проверяем, нужна ли разблокировка при загрузке страницы
        if (this.isLockEnabled() && !this.isSessionUnlocked()) {
            logger.security('Showing unlock screen');
            this.showUnlockScreen();
        } else {
            logger.security('No unlock needed - either disabled or already unlocked');
        }
    }

    // Проверка временной разблокировки после обновления
    checkTempUnlock() {
        const tempUnlock = localStorage.getItem('framesearch-temp-unlock');
        if (tempUnlock) {
            const unlockTime = parseInt(tempUnlock);
            const currentTime = Date.now();
            
            // Если прошло менее 10 секунд с момента обновления, восстанавливаем сессию
            if (currentTime - unlockTime < 10000) {
                sessionStorage.setItem(this.sessionKey, 'true');
                logger.security('Session restored after PWA update');
            }
            
            // Удаляем временную метку
            localStorage.removeItem('framesearch-temp-unlock');
        }
    }

    // Проверка, включена ли защита
    isLockEnabled() {
        const lockData = this.getLockData();
        const enabled = lockData && lockData.enabled === true;
        logger.security(`Lock enabled check: ${enabled}`);
        return enabled;
    }

    // Проверка, разблокирована ли текущая сессия
    isSessionUnlocked() {
        const unlocked = sessionStorage.getItem(this.sessionKey) === 'true';
        
        if (unlocked) {
            // Проверяем время последней активности
            const lastActivityTime = sessionStorage.getItem(this.sessionTimeKey);
            if (lastActivityTime) {
                const timeSinceActivity = Date.now() - parseInt(lastActivityTime);
                
                // Если прошло больше sessionTimeout, сбрасываем сессию
                if (timeSinceActivity > this.sessionTimeout) {
                    logger.security(`Session expired (${Math.round(timeSinceActivity / 1000 / 60)} minutes inactive)`);
                    sessionStorage.removeItem(this.sessionKey);
                    sessionStorage.removeItem(this.sessionTimeKey);
                    return false;
                }
                
                // Обновляем время последней активности
                sessionStorage.setItem(this.sessionTimeKey, Date.now().toString());
            }
        }
        
        logger.security(`Session unlocked check: ${unlocked}`);
        return unlocked;
    }

    // Получение данных о блокировке
    getLockData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error('Error reading lock data:', error);
            return null;
        }
    }

    // Сохранение данных о блокировке
    saveLockData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            logger.security('Lock data saved');
        } catch (error) {
            logger.error('Error saving lock data:', error);
        }
    }

    // Генерация соли
    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Хеширование пароля с солью (PBKDF2)
    async hashPassword(password, salt = null) {
        // Если соль не передана, генерируем новую
        if (!salt) {
            salt = this.generateSalt();
        }

        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password + salt);
        
        // Импортируем ключ
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordData,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        // Деривация ключа с использованием PBKDF2
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000, // 100,000 итераций для безопасности
                hash: 'SHA-256'
            },
            keyMaterial,
            256 // 256 бит
        );

        const hashArray = Array.from(new Uint8Array(derivedBits));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return { hash: hashHex, salt };
    }

    // Установка пароля
    async setPassword(password) {
        if (!password || password.length < 4) {
            throw new Error('Пароль должен содержать минимум 4 символа');
        }

        const { hash, salt } = await this.hashPassword(password);
        this.saveLockData({
            enabled: true,
            hash: hash,
            salt: salt,
            createdAt: Date.now()
        });

        logger.security('Password set successfully - lock enabled');
        return true;
    }

    // Отключение защиты
    async disableLock(password) {
        const lockData = this.getLockData();
        if (!lockData) {
            logger.security('No lock data found - already disabled');
            return true;
        }

        const { hash } = await this.hashPassword(password, lockData.salt);
        if (hash !== lockData.hash) {
            throw new Error('Неверный пароль');
        }

        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.sessionKey);
        logger.security('Lock PERMANENTLY disabled - data removed from localStorage');
        return true;
    }

    // Проверка пароля
    async verifyPassword(password) {
        const lockData = this.getLockData();
        if (!lockData) {
            return false;
        }

        const { hash } = await this.hashPassword(password, lockData.salt);
        return hash === lockData.hash;
    }

    // Разблокировка сессии
    async unlockSession(password) {
        const isValid = await this.verifyPassword(password);
        if (isValid) {
            sessionStorage.setItem(this.sessionKey, 'true');
            sessionStorage.setItem(this.sessionTimeKey, Date.now().toString());
            logger.security('Session unlocked (temporary - until browser/tab close or 30 min inactivity)');
            return true;
        }
        throw new Error('Неверный пароль');
    }

    // Блокировка сессии
    lockSession() {
        sessionStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionTimeKey);
        logger.security('Session locked');
        window.location.reload();
    }

    // Показать экран разблокировки
    showUnlockScreen() {
        const overlay = document.createElement('div');
        overlay.className = 'app-lock-overlay';
        overlay.innerHTML = `
            <div class="app-lock-container glass">
                <div class="app-lock-icon">
                    <i data-lucide="lock"></i>
                </div>
                <h2 data-i18n="appLock.unlockTitle">Приложение заблокировано</h2>
                <p data-i18n="appLock.unlockDescription">Введите пароль для доступа</p>
                <form id="unlockForm" class="app-lock-form">
                    <div class="form-group">
                        <input 
                            type="password" 
                            id="unlockPassword" 
                            class="form-input" 
                            placeholder="Пароль"
                            data-i18n-placeholder="appLock.passwordPlaceholder"
                            autocomplete="current-password"
                            required
                        >
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">
                        <i data-lucide="unlock"></i>
                        <span data-i18n="appLock.unlockButton">Разблокировать</span>
                    </button>
                    <div class="app-lock-error" id="unlockError"></div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Инициализация иконок с задержкой для загрузки Lucide
        setTimeout(() => {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }, 100);

        // Применение переводов
        if (window.i18n) {
            i18n.updatePageContent();
        }

        // Обработка формы
        const form = document.getElementById('unlockForm');
        const passwordInput = document.getElementById('unlockPassword');
        const errorDiv = document.getElementById('unlockError');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;

            try {
                await this.unlockSession(password);
                overlay.remove();
                logger.security('App unlocked successfully');
            } catch (error) {
                errorDiv.textContent = error.message;
                passwordInput.value = '';
                passwordInput.focus();
                
                // Анимация ошибки
                errorDiv.style.display = 'block';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            }
        });

        passwordInput.focus();
    }

    // Показать модальное окно настроек
    showSettingsModal() {
        const isEnabled = this.isLockEnabled();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-container glass animate-scale-in">
                <div class="modal-header">
                    <h2>
                        <i data-lucide="shield"></i>
                        <span data-i18n="appLock.settingsTitle">Защита приложения</span>
                    </h2>
                    <button class="modal-close" id="closeLockSettings">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="lock-status">
                        <div class="lock-status-indicator ${isEnabled ? 'active' : ''}">
                            <i data-lucide="${isEnabled ? 'lock' : 'unlock'}"></i>
                        </div>
                        <div class="lock-status-text">
                            <h3 data-i18n="appLock.status">Статус</h3>
                            <p data-i18n="appLock.status${isEnabled ? 'Enabled' : 'Disabled'}">
                                ${isEnabled ? 'Защита включена' : 'Защита отключена'}
                            </p>
                        </div>
                    </div>

                    ${isEnabled ? `
                        <div class="alert alert-info">
                            <i data-lucide="info"></i>
                            <span data-i18n="appLock.enabledInfo">
                                Приложение будет запрашивать пароль при каждом открытии в новой вкладке или после закрытия браузера
                            </span>
                        </div>

                        <form id="disableLockForm" class="lock-form">
                            <h3 data-i18n="appLock.disableTitle">Отключить защиту</h3>
                            <div class="form-group">
                                <label data-i18n="appLock.currentPassword">Текущий пароль</label>
                                <input 
                                    type="password" 
                                    id="disablePassword" 
                                    class="form-input" 
                                    placeholder="Введите пароль"
                                    data-i18n-placeholder="appLock.passwordPlaceholder"
                                    autocomplete="current-password"
                                    required
                                >
                            </div>
                            <button type="submit" class="btn btn-danger btn-block">
                                <i data-lucide="shield-off"></i>
                                <span data-i18n="appLock.disableButton">Отключить защиту</span>
                            </button>
                        </form>
                    ` : `
                        <div class="alert alert-warning">
                            <i data-lucide="alert-triangle"></i>
                            <span data-i18n="appLock.disabledInfo">
                                Установите пароль для защиты доступа к вашей видеоколлекции
                            </span>
                        </div>

                        <form id="enableLockForm" class="lock-form">
                            <h3 data-i18n="appLock.enableTitle">Установить пароль</h3>
                            <div class="form-group">
                                <label data-i18n="appLock.newPassword">Новый пароль</label>
                                <input 
                                    type="password" 
                                    id="newPassword" 
                                    class="form-input" 
                                    placeholder="Минимум 4 символа"
                                    data-i18n-placeholder="appLock.newPasswordPlaceholder"
                                    autocomplete="new-password"
                                    minlength="4"
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label data-i18n="appLock.confirmPassword">Подтвердите пароль</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    class="form-input" 
                                    placeholder="Повторите пароль"
                                    data-i18n-placeholder="appLock.confirmPasswordPlaceholder"
                                    autocomplete="new-password"
                                    minlength="4"
                                    required
                                >
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                <i data-lucide="shield-check"></i>
                                <span data-i18n="appLock.enableButton">Включить защиту</span>
                            </button>
                        </form>
                    `}

                    <div class="lock-error" id="lockError"></div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Инициализация иконок с задержкой для загрузки Lucide
        setTimeout(() => {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }, 100);

        // Применение переводов
        if (window.i18n) {
            i18n.updatePageContent();
        }

        // Закрытие модального окна
        const closeBtn = document.getElementById('closeLockSettings');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Обработка форм
        const errorDiv = document.getElementById('lockError');

        if (isEnabled) {
            // Форма отключения
            const disableForm = document.getElementById('disableLockForm');
            disableForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const password = document.getElementById('disablePassword').value;

                try {
                    await this.disableLock(password);
                    modal.remove();
                    this.showSuccessMessage('Защита отключена');
                } catch (error) {
                    this.showError(errorDiv, error.message);
                }
            });
        } else {
            // Форма включения
            const enableForm = document.getElementById('enableLockForm');
            enableForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (newPassword !== confirmPassword) {
                    this.showError(errorDiv, 'Пароли не совпадают');
                    return;
                }

                try {
                    await this.setPassword(newPassword);
                    modal.remove();
                    this.showSuccessMessage('Защита включена');
                } catch (error) {
                    this.showError(errorDiv, error.message);
                }
            });
        }
    }

    showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }

    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `
            <i data-lucide="check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }, 50);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Глобальный экземпляр
const appLock = new AppLockManager();

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        appLock.init();
    });
} else {
    // DOM уже загружен
    appLock.init();
}
