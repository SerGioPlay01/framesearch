/**
 * Framesearch - Import Manager
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class ImportManager {
    constructor() {
        this.modal = null;
        this.selectedFile = null;
        this.importData = null;
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        // Check if modal already exists
        if (document.getElementById('importModal')) {
            this.modal = document.getElementById('importModal');
            return;
        }
        
        const modalHTML = `
            <div id="importModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Импорт контента</h2>
                        <button class="modal-close" onclick="importManager.close()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="import-container">
                            <div class="import-tabs">
                                <button class="import-tab active" data-tab="file" onclick="importManager.switchTab('file')">
                                    <i data-lucide="file-up"></i>
                                    Из файла
                                </button>
                                <button class="import-tab" data-tab="link" onclick="importManager.switchTab('link')">
                                    <i data-lucide="share-2"></i>
                                    По коду
                                </button>
                            </div>
                            
                            <!-- File Import Tab -->
                            <div id="fileImportTab" class="import-tab-content active">
                                <div class="import-icon">
                                    <i data-lucide="file-up"></i>
                                </div>
                                
                                <h3>Загрузите файл с контентом</h3>
                                <p>Поддерживаются файлы .framesearch и .json</p>
                                
                                <input type="file" id="importFileInput" accept=".json,.framesearch" style="display: none;">
                                
                                <button class="btn btn-primary btn-large" onclick="document.getElementById('importFileInput').click()">
                                    <i data-lucide="upload"></i>
                                    Выбрать файл
                                </button>
                                
                                <div id="importFileInfo" class="file-info" style="display: none;">
                                    <div class="file-info-content">
                                        <i data-lucide="file"></i>
                                        <div>
                                            <div class="file-name"></div>
                                            <div class="file-size"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="importPasswordSection" style="display: none; margin-top: 1.5rem;">
                                    <p style="color: #fbbf24; margin-bottom: 1rem;">
                                        <i data-lucide="lock"></i>
                                        Файл защищен паролем
                                    </p>
                                    <input type="password" id="importPasswordInput" placeholder="Введите пароль для расшифровки" class="form-input">
                                    <button class="btn btn-primary" onclick="importManager.importWithPassword()" style="margin-top: 1rem;">
                                        <i data-lucide="check"></i>
                                        Импортировать
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Code Import Tab -->
                            <div id="linkImportTab" class="import-tab-content">
                                <div class="import-icon">
                                    <i data-lucide="share-2"></i>
                                </div>
                                
                                <h3>Импорт по коду</h3>
                                <p>Вставьте код, полученный от другого пользователя</p>
                                
                                <textarea id="importCodeInput" placeholder="Вставьте код сюда..." class="form-input code-textarea" rows="4" style="margin-bottom: 1rem;"></textarea>
                                
                                <button class="btn btn-primary btn-large" onclick="importManager.importFromCode()">
                                    <i data-lucide="download"></i>
                                    Импортировать
                                </button>
                            </div>
                            
                            <div class="import-warning">
                                <i data-lucide="info"></i>
                                <p>Импортированные данные будут добавлены к вашей коллекции</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('importModal');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        // File selection
        const importFileInput = document.getElementById('importFileInput');
        if (importFileInput) {
            importFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.selectedFile = e.target.files[0];
                    this.showFileInfo();
                    this.tryImport();
                }
            });
        }

        // Close on overlay click
        const overlay = this.modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.reset();
    }

    reset() {
        this.selectedFile = null;
        this.importData = null;
        
        const importFileInput = document.getElementById('importFileInput');
        const importFileInfo = document.getElementById('importFileInfo');
        const importPasswordSection = document.getElementById('importPasswordSection');
        const importPasswordInput = document.getElementById('importPasswordInput');
        const importCodeInput = document.getElementById('importCodeInput');
        
        if (importFileInput) importFileInput.value = '';
        if (importFileInfo) importFileInfo.style.display = 'none';
        if (importPasswordSection) importPasswordSection.style.display = 'none';
        if (importPasswordInput) importPasswordInput.value = '';
        if (importCodeInput) importCodeInput.value = '';
        
        // Reset to file tab
        this.switchTab('file');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.import-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.import-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}ImportTab`)?.classList.add('active');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async importFromCode() {
        try {
            const codeInput = document.getElementById('importCodeInput');
            const code = codeInput.value.trim();
            
            if (!code) {
                await dialog.alert('Вставьте код для импорта', 'Ошибка');
                return;
            }
            
            // Try import without password first
            try {
                await db.importFromShareCode(code, null);
                await dialog.alert('Контент успешно добавлен!', 'Успех');
                this.close();
                window.location.reload();
            } catch (error) {
                console.log('Import failed, checking if password needed:', error);
                
                // If password required, ask for it
                if (error.message.includes('Требуется пароль')) {
                    const password = await dialog.prompt('Введите пароль для расшифровки:', '', 'Требуется пароль', true);
                    if (password) {
                        await db.importFromShareCode(code, password);
                        await dialog.alert('Контент успешно добавлен!', 'Успех');
                        this.close();
                        window.location.reload();
                    } else {
                        await dialog.alert('Импорт отменен', 'Отмена');
                    }
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Import from code failed:', error);
            await dialog.alert('Ошибка импорта: ' + error.message, 'Ошибка');
        }
    }

    showFileInfo() {
        const fileInfo = document.getElementById('importFileInfo');
        const fileName = fileInfo.querySelector('.file-name');
        const fileSize = fileInfo.querySelector('.file-size');
        
        fileName.textContent = this.selectedFile.name;
        fileSize.textContent = this.formatFileSize(this.selectedFile.size);
        
        fileInfo.style.display = 'block';
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    async tryImport() {
        if (!this.selectedFile) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = e.target.result;
                
                // Check if data is encrypted
                // Encrypted data will be base64 string that doesn't parse as valid JSON
                // or parses but doesn't have the expected structure
                let isEncrypted = false;
                try {
                    const parsed = JSON.parse(data);
                    // Check if it has the expected structure for unencrypted data
                    if (!parsed.version || (!parsed.videos && !parsed.video)) {
                        // Doesn't have expected structure, likely encrypted
                        isEncrypted = true;
                    }
                } catch (parseError) {
                    // JSON parse failed, definitely encrypted
                    isEncrypted = true;
                }
                
                if (isEncrypted) {
                    // Show password input for encrypted data
                    this.importData = data;
                    document.getElementById('importPasswordSection').style.display = 'block';
                    
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                } else {
                    // Try import without password
                    try {
                        await db.importData(data);
                        console.log('Import successful');
                        await dialog.alert('Импорт выполнен успешно!', 'Успех');
                        this.close();
                        
                        // Reload page to refresh everything
                        window.location.reload();
                    } catch (error) {
                        console.error('Import failed:', error);
                        await dialog.alert('Ошибка импорта: ' + error.message, 'Ошибка');
                    }
                }
            } catch (error) {
                console.error('Import failed:', error);
                await dialog.alert('Ошибка импорта: ' + error.message, 'Ошибка');
            }
        };
        reader.readAsText(this.selectedFile);
    }

    async importWithPassword() {
        try {
            const password = document.getElementById('importPasswordInput').value;
            
            if (!password) {
                await dialog.alert('Введите пароль для расшифровки', 'Ошибка');
                return;
            }

            await db.importData(this.importData, password);
            console.log('Import successful');
            await dialog.alert('Импорт выполнен успешно!', 'Успех');
            this.close();
            
            // Reload page to refresh everything
            window.location.reload();
        } catch (error) {
            console.error('Import failed:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Неверный пароль или поврежденный файл';
            if (error.message.includes('Неверный формат')) {
                errorMessage = 'Неверный формат зашифрованных данных';
            } else if (error.message.includes('Неверный пароль')) {
                errorMessage = 'Неверный пароль. Попробуйте еще раз.';
            } else if (error.message.includes('Поврежденные')) {
                errorMessage = 'Файл поврежден или неполный';
            }
            
            await dialog.alert(errorMessage, 'Ошибка импорта');
        }
    }
}

// Create global instance
const importManager = new ImportManager();
window.importManager = importManager;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    importManager.init();
});
