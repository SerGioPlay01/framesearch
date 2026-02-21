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
        
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
        const modalHTML = `
            <div id="importModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 data-i18n="import.content">${t('import.content')}</h2>
                        <button class="modal-close" onclick="importManager.close()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="import-container">
                            <div class="import-tabs">
                                <button class="import-tab active" data-tab="file" onclick="importManager.switchTab('file')">
                                    <i data-lucide="file-up"></i>
                                    <span data-i18n="import.fromFile">${t('import.fromFile')}</span>
                                </button>
                                <button class="import-tab" data-tab="link" onclick="importManager.switchTab('link')">
                                    <i data-lucide="share-2"></i>
                                    <span data-i18n="import.fromCode">${t('import.fromCode')}</span>
                                </button>
                            </div>
                            
                            <!-- File Import Tab -->
                            <div id="fileImportTab" class="import-tab-content active">
                                <div class="import-icon">
                                    <i data-lucide="file-up"></i>
                                </div>
                                
                                <h3 data-i18n="import.uploadFile">${t('import.uploadFile')}</h3>
                                <p data-i18n="import.supportedFormats">${t('import.supportedFormats')}</p>
                                
                                <input type="file" id="importFileInput" accept=".json,.framesearch" style="display: none;">
                                
                                <button class="btn btn-primary btn-large" onclick="document.getElementById('importFileInput').click()">
                                    <i data-lucide="upload"></i>
                                    <span data-i18n="import.chooseFile">${t('import.chooseFile')}</span>
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
                                        <span data-i18n="import.fileProtected">${t('import.fileProtected')}</span>
                                    </p>
                                    <input type="password" id="importPasswordInput" placeholder="${t('import.enterPassword')}" data-i18n="import.enterPassword" class="form-input">
                                    <button class="btn btn-primary" onclick="importManager.importWithPassword()" style="margin-top: 1rem;">
                                        <i data-lucide="check"></i>
                                        <span data-i18n="import.importBtn">${t('import.importBtn')}</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Code Import Tab -->
                            <div id="linkImportTab" class="import-tab-content">
                                <div class="import-icon">
                                    <i data-lucide="share-2"></i>
                                </div>
                                
                                <h3 data-i18n="import.byCode">${t('import.byCode')}</h3>
                                <p data-i18n="import.byCode.desc">${t('import.byCode.desc')}</p>
                                
                                <textarea id="importCodeInput" placeholder="${t('import.pasteCode')}" data-i18n="import.pasteCode" class="form-input code-textarea" rows="4" style="margin-bottom: 1rem;"></textarea>
                                
                                <button class="btn btn-primary btn-large" onclick="importManager.importFromCode()">
                                    <i data-lucide="download"></i>
                                    <span data-i18n="import.importBtn">${t('import.importBtn')}</span>
                                </button>
                            </div>
                            
                            <div class="import-warning">
                                <i data-lucide="info"></i>
                                <p data-i18n="import.warning">${t('import.warning')}</p>
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
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
        try {
            const codeInput = document.getElementById('importCodeInput');
            const code = codeInput.value.trim();
            
            if (!code) {
                await dialog.alert(t('import.error.noCode'), t('import.error.title'));
                return;
            }
            
            // Try import without password first
            try {
                await db.importFromShareCode(code, null);
                await dialog.alert(t('import.success.message'), t('import.success.title'));
                this.close();
                window.location.reload();
            } catch (error) {
                console.log('Import failed, checking if password needed:', error);
                
                // If password required, ask for it
                if (error.message.includes('Требуется пароль') || error.message.includes('Password required')) {
                    const password = await dialog.prompt(t('import.enterPasswordPrompt'), '', t('import.passwordRequired'), true);
                    if (password) {
                        await db.importFromShareCode(code, password);
                        await dialog.alert(t('import.success.message'), t('import.success.title'));
                        this.close();
                        window.location.reload();
                    } else {
                        await dialog.alert(t('import.cancelled'), t('import.error.title'));
                    }
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Import from code failed:', error);
            await dialog.alert(t('import.error.message') + ': ' + error.message, t('import.error.title'));
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
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
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
                        await dialog.alert(t('import.success.message'), t('import.success.title'));
                        this.close();
                        
                        // Reload page to refresh everything
                        window.location.reload();
                    } catch (error) {
                        console.error('Import failed:', error);
                        await dialog.alert(t('import.error.message') + ': ' + error.message, t('import.error.title'));
                    }
                }
            } catch (error) {
                console.error('Import failed:', error);
                await dialog.alert(t('import.error.message') + ': ' + error.message, t('import.error.title'));
            }
        };
        reader.readAsText(this.selectedFile);
    }

    async importWithPassword() {
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
        try {
            const password = document.getElementById('importPasswordInput').value;
            
            if (!password) {
                await dialog.alert(t('import.error.noPassword'), t('import.error.title'));
                return;
            }

            await db.importData(this.importData, password);
            console.log('Import successful');
            await dialog.alert(t('import.success.message'), t('import.success.title'));
            this.close();
            
            // Reload page to refresh everything
            window.location.reload();
        } catch (error) {
            console.error('Import failed:', error);
            
            // Show user-friendly error message
            let errorMessage = t('import.error.wrongPassword');
            if (error.message.includes('Неверный формат') || error.message.includes('Invalid format')) {
                errorMessage = t('import.error.invalidFormat');
            } else if (error.message.includes('Неверный пароль') || error.message.includes('Wrong password')) {
                errorMessage = t('import.error.wrongPasswordRetry');
            } else if (error.message.includes('Поврежденные') || error.message.includes('Corrupted')) {
                errorMessage = t('import.error.corrupted');
            }
            
            await dialog.alert(errorMessage, t('import.error.title'));
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
