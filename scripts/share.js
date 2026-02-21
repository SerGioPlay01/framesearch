/**
 * Framesearch - Share Manager
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class ShareManager {
    constructor() {
        this.modal = null;
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        // Check if modal already exists
        if (document.getElementById('shareModal')) {
            this.modal = document.getElementById('shareModal');
            return;
        }
        
        const modalHTML = `
            <div id="shareModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Поделиться контентом</h2>
                        <button class="modal-close" onclick="shareManager.close()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="share-options">
                            <div class="share-option">
                                <h3>
                                    <i data-lucide="file-down"></i>
                                    Экспорт в файл
                                </h3>
                                <p>Сохраните контент в файл для передачи</p>
                                
                                <div class="form-group">
                                    <label>
                                        <input type="checkbox" id="exportEncrypt">
                                        Защитить паролем
                                    </label>
                                </div>
                                
                                <div class="form-group" id="exportPasswordGroup" style="display: none;">
                                    <input type="password" id="exportPassword" placeholder="Введите пароль">
                                </div>
                                
                                <button class="btn btn-primary" onclick="shareManager.exportToFile()">
                                    <i data-lucide="download"></i>
                                    Скачать файл
                                </button>
                            </div>

                            <div class="share-option">
                                <h3>
                                    <i data-lucide="share-2"></i>
                                    Создать код для шаринга
                                </h3>
                                <p>Создайте код для передачи контента другим пользователям</p>
                                
                                <div class="form-group">
                                    <label>
                                        <input type="checkbox" id="codeEncrypt">
                                        Защитить паролем
                                    </label>
                                </div>
                                
                                <div class="form-group" id="codePasswordGroup" style="display: none;">
                                    <input type="password" id="codePassword" placeholder="Введите пароль">
                                </div>
                                
                                <button class="btn btn-primary" onclick="shareManager.generateCode()">
                                    <i data-lucide="share-2"></i>
                                    Создать код
                                </button>
                                
                                <div id="generatedCode" class="generated-code" style="display: none;">
                                    <p class="code-hint">Скопируйте код и отправьте его другому пользователю</p>
                                    <textarea id="shareCodeText" class="code-textarea" readonly></textarea>
                                    <button class="btn btn-secondary" onclick="shareManager.copyCode(event)">
                                        <i data-lucide="copy"></i>
                                        Копировать код
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('shareModal');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        // Export encryption toggle
        const exportEncrypt = document.getElementById('exportEncrypt');
        if (exportEncrypt) {
            exportEncrypt.addEventListener('change', (e) => {
                const passwordGroup = document.getElementById('exportPasswordGroup');
                if (passwordGroup) {
                    passwordGroup.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }

        // Code encryption toggle
        const codeEncrypt = document.getElementById('codeEncrypt');
        if (codeEncrypt) {
            codeEncrypt.addEventListener('change', (e) => {
                const passwordGroup = document.getElementById('codePasswordGroup');
                if (passwordGroup) {
                    passwordGroup.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }

        // Close on overlay click
        const overlay = this.modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
    }

    open(videoId = null) {
        this.videoId = videoId;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.reset();
    }

    reset() {
        const exportEncrypt = document.getElementById('exportEncrypt');
        const codeEncrypt = document.getElementById('codeEncrypt');
        const exportPasswordGroup = document.getElementById('exportPasswordGroup');
        const codePasswordGroup = document.getElementById('codePasswordGroup');
        const exportPassword = document.getElementById('exportPassword');
        const codePassword = document.getElementById('codePassword');
        const generatedCode = document.getElementById('generatedCode');
        const shareCodeText = document.getElementById('shareCodeText');
        
        if (exportEncrypt) exportEncrypt.checked = false;
        if (codeEncrypt) codeEncrypt.checked = false;
        if (exportPasswordGroup) exportPasswordGroup.style.display = 'none';
        if (codePasswordGroup) codePasswordGroup.style.display = 'none';
        if (exportPassword) exportPassword.value = '';
        if (codePassword) codePassword.value = '';
        if (generatedCode) generatedCode.style.display = 'none';
        if (shareCodeText) shareCodeText.value = '';
    }

    async exportToFile() {
        try {
            const encrypt = document.getElementById('exportEncrypt').checked;
            const password = document.getElementById('exportPassword').value;

            // Проверяем пароль только если шифрование включено
            if (encrypt && !password) {
                await dialog.alert('Введите пароль для шифрования', 'Ошибка');
                return;
            }

            let data;
            if (this.videoId) {
                // Export single video data
                data = await db.exportVideoData(this.videoId, encrypt ? password : null);
            } else {
                // Export all data
                data = await db.exportData(encrypt ? password : null);
            }

            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `framesearch-export-${Date.now()}.framesearch`;
            a.click();
            URL.revokeObjectURL(url);

            console.log('Export successful');
            this.close();
        } catch (error) {
            console.error('Export failed:', error);
            await dialog.alert('Ошибка экспорта: ' + error.message, 'Ошибка');
        }
    }

    async generateCode() {
        try {
            if (!this.videoId) {
                await dialog.alert('Выберите видео для создания кода', 'Ошибка');
                return;
            }

            const encrypt = document.getElementById('codeEncrypt').checked;
            const password = document.getElementById('codePassword').value;

            // Проверяем пароль только если шифрование включено
            if (encrypt && !password) {
                await dialog.alert('Введите пароль для шифрования', 'Ошибка');
                return;
            }

            const code = await db.generateShareCode(this.videoId, encrypt ? password : null);
            
            document.getElementById('shareCodeText').textContent = code;
            document.getElementById('generatedCode').style.display = 'block';
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            console.log('Code generated successfully:', code);
        } catch (error) {
            console.error('Code generation failed:', error);
            await dialog.alert('Ошибка создания кода: ' + error.message, 'Ошибка');
        }
    }

    copyCode(event) {
        const codeTextarea = document.getElementById('shareCodeText');
        codeTextarea.select();
        
        // Copy to clipboard
        navigator.clipboard.writeText(codeTextarea.value).then(() => {
            const btn = event ? event.target.closest('button') : document.querySelector('#generatedCode button');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i data-lucide="check"></i> Скопировано';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback for older browsers
            codeTextarea.select();
            document.execCommand('copy');
        });
    }

}

// Create global instance
const shareManager = new ShareManager();
window.shareManager = shareManager;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    shareManager.init();
});
