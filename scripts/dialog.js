/**
 * Framesearch - Custom Dialog System
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class DialogManager {
    constructor() {
        this.createDialogContainer();
    }

    createDialogContainer() {
        if (document.getElementById('customDialog')) return;
        
        const dialogHTML = `
            <div id="customDialog" class="custom-dialog" style="display: none;">
                <div class="custom-dialog-overlay"></div>
                <div class="custom-dialog-content">
                    <div class="custom-dialog-header">
                        <h3 id="dialogTitle"></h3>
                    </div>
                    <div class="custom-dialog-body">
                        <p id="dialogMessage"></p>
                        <input type="text" id="dialogInput" style="display: none;">
                        <input type="password" id="dialogPasswordInput" style="display: none;">
                    </div>
                    <div class="custom-dialog-footer">
                        <button class="btn-secondary" id="dialogCancelBtn">Отмена</button>
                        <button class="btn-primary" id="dialogConfirmBtn">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
    }

    alert(message, title = 'Уведомление') {
        return new Promise((resolve) => {
            const dialog = document.getElementById('customDialog');
            const titleEl = document.getElementById('dialogTitle');
            const messageEl = document.getElementById('dialogMessage');
            const input = document.getElementById('dialogInput');
            const passwordInput = document.getElementById('dialogPasswordInput');
            const cancelBtn = document.getElementById('dialogCancelBtn');
            const confirmBtn = document.getElementById('dialogConfirmBtn');
            
            titleEl.textContent = title;
            messageEl.textContent = message;
            input.style.display = 'none';
            passwordInput.style.display = 'none';
            cancelBtn.style.display = 'none';
            confirmBtn.textContent = 'OK';
            
            dialog.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            const handleConfirm = () => {
                dialog.style.display = 'none';
                document.body.style.overflow = '';
                confirmBtn.removeEventListener('click', handleConfirm);
                resolve(true);
            };
            
            confirmBtn.addEventListener('click', handleConfirm);
            confirmBtn.focus();
        });
    }

    confirm(message, title = 'Подтверждение') {
        return new Promise((resolve) => {
            const dialog = document.getElementById('customDialog');
            const titleEl = document.getElementById('dialogTitle');
            const messageEl = document.getElementById('dialogMessage');
            const input = document.getElementById('dialogInput');
            const passwordInput = document.getElementById('dialogPasswordInput');
            const cancelBtn = document.getElementById('dialogCancelBtn');
            const confirmBtn = document.getElementById('dialogConfirmBtn');
            
            titleEl.textContent = title;
            messageEl.textContent = message;
            input.style.display = 'none';
            passwordInput.style.display = 'none';
            cancelBtn.style.display = 'inline-flex';
            confirmBtn.textContent = 'Да';
            cancelBtn.textContent = 'Нет';
            
            dialog.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            const handleConfirm = () => {
                dialog.style.display = 'none';
                document.body.style.overflow = '';
                cleanup();
                resolve(true);
            };
            
            const handleCancel = () => {
                dialog.style.display = 'none';
                document.body.style.overflow = '';
                cleanup();
                resolve(false);
            };
            
            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
            };
            
            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            confirmBtn.focus();
        });
    }

    prompt(message, defaultValue = '', title = 'Ввод данных', isPassword = false) {
        return new Promise((resolve) => {
            const dialog = document.getElementById('customDialog');
            const titleEl = document.getElementById('dialogTitle');
            const messageEl = document.getElementById('dialogMessage');
            const input = document.getElementById('dialogInput');
            const passwordInput = document.getElementById('dialogPasswordInput');
            const cancelBtn = document.getElementById('dialogCancelBtn');
            const confirmBtn = document.getElementById('dialogConfirmBtn');
            
            titleEl.textContent = title;
            messageEl.textContent = message;
            
            const activeInput = isPassword ? passwordInput : input;
            const inactiveInput = isPassword ? input : passwordInput;
            
            activeInput.style.display = 'block';
            inactiveInput.style.display = 'none';
            activeInput.value = defaultValue;
            
            cancelBtn.style.display = 'inline-flex';
            confirmBtn.textContent = 'OK';
            cancelBtn.textContent = 'Отмена';
            
            dialog.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                activeInput.focus();
                activeInput.select();
            }, 100);
            
            const handleConfirm = () => {
                const value = activeInput.value;
                dialog.style.display = 'none';
                document.body.style.overflow = '';
                activeInput.value = '';
                cleanup();
                resolve(value || null);
            };
            
            const handleCancel = () => {
                dialog.style.display = 'none';
                document.body.style.overflow = '';
                activeInput.value = '';
                cleanup();
                resolve(null);
            };
            
            const handleKeyPress = (e) => {
                if (e.key === 'Enter') {
                    handleConfirm();
                } else if (e.key === 'Escape') {
                    handleCancel();
                }
            };
            
            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
                activeInput.removeEventListener('keypress', handleKeyPress);
            };
            
            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            activeInput.addEventListener('keypress', handleKeyPress);
        });
    }
}

// Create global instance
const dialog = new DialogManager();
window.dialog = dialog;

// Override native functions (optional)
window.customAlert = (message, title) => dialog.alert(message, title);
window.customConfirm = (message, title) => dialog.confirm(message, title);
window.customPrompt = (message, defaultValue, title, isPassword) => dialog.prompt(message, defaultValue, title, isPassword);
