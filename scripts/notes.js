/**
 * Framesearch - Notes & Timecodes Manager
 * Система заметок и таймкодов
 * 
 * Автор: SerGioPlay
 * © 2026 Framesearch
 */

class NotesManager {
    constructor() {
        this.currentVideoId = null;
    }

    // Получить заметки видео
    async getVideoNotes(videoId) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return [];

        const video = await dbInstance.getVideo(videoId);
        return video?.notes || [];
    }

    // Добавить заметку
    async addNote(videoId, text, timecode = null) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return false;

        const video = await dbInstance.getVideo(videoId);
        if (!video) return false;

        if (!video.notes) video.notes = [];

        // Format date properly
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const note = {
            id: Date.now(),
            text,
            timecode, // в секундах
            timestamp: Date.now(),
            date: `${dateStr}, ${timeStr}`
        };

        video.notes.push(note);
        await dbInstance.updateVideo(video.id, { notes: video.notes });

        if (typeof logger !== 'undefined') {
            logger.info('📝 Заметки', 'Заметка добавлена');
        }
        return note;
    }

    // Удалить заметку
    async deleteNote(videoId, noteId) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return false;

        const video = await dbInstance.getVideo(videoId);
        if (!video || !video.notes) return false;

        video.notes = video.notes.filter(note => note.id !== noteId);
        await dbInstance.updateVideo(video.id, { notes: video.notes });

        if (typeof logger !== 'undefined') {
            logger.info('📝 Заметки', 'Заметка удалена');
        }
        return true;
    }

    // Обновить заметку
    async updateNote(videoId, noteId, newText) {
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) return false;

        const video = await dbInstance.getVideo(videoId);
        if (!video || !video.notes) return false;

        const note = video.notes.find(n => n.id === noteId);
        if (note) {
            note.text = newText;
            note.edited = new Date().toLocaleString('ru-RU');
            await dbInstance.updateVideo(video.id, { notes: video.notes });
            if (typeof logger !== 'undefined') {
                logger.info('📝 Заметки', 'Заметка обновлена');
            }
            return true;
        }

        return false;
    }

    // Форматировать таймкод
    formatTimecode(seconds) {
        if (!seconds) return null;

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Открыть панель заметок
    async openNotesPanel(videoId) {
        // Ensure videoId is a number
        videoId = parseInt(videoId, 10);
        
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        if (!dbInstance) {
            alert('База данных недоступна. Заметки работают только на страницах с видео.');
            return;
        }
        
        this.currentVideoId = videoId;
        const notes = await this.getVideoNotes(videoId);
        const video = await dbInstance.getVideo(videoId);
        
        // Helper function for translation
        const t = (key) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return key;
        };

        const modalHTML = `
            <div id="notesModal" class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>
                            <i data-lucide="file-text"></i>
                            <span>${t('notes.title')}</span>
                        </h2>
                        <button class="modal-close" onclick="notesManager.closeNotesPanel()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div style="margin-bottom: 1rem;">
                            <strong>${video?.title || 'Видео'}</strong>
                        </div>

                        <!-- Добавить заметку -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">
                                ${t('notes.new')}
                            </label>
                            <textarea 
                                id="newNoteText" 
                                placeholder="${t('notes.placeholder')}"
                                style="width: 100%; min-height: 80px; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; resize: vertical;"
                            ></textarea>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center;">
                                <input 
                                    type="text" 
                                    id="newNoteTimecode" 
                                    placeholder="${t('notes.timecode')}"
                                    style="width: 120px; padding: 0.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;"
                                >
                                <button onclick="notesManager.addNoteFromPanel()" class="btn btn-primary">
                                    <i data-lucide="plus"></i>
                                    ${t('notes.add')}
                                </button>
                            </div>
                        </div>

                        <!-- Список заметок -->
                        <div id="notesListContainer">
                            ${notes.length === 0 ? `
                                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                                    <i data-lucide="file-text" style="width: 48px; height: 48px; opacity: 0.3; margin-bottom: 1rem;"></i>
                                    <p>${t('notes.noNotes')}</p>
                                </div>
                            ` : `
                                <div class="notes-list">
                                    ${notes.sort((a, b) => b.timestamp - a.timestamp).map(note => `
                                        <div class="note-item" data-note-id="${note.id}">
                                            <div class="note-header">
                                                ${note.timecode ? `
                                                    <span class="note-timecode" onclick="notesManager.jumpToTimecode(${note.timecode})">
                                                        <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                                                        ${this.formatTimecode(note.timecode)}
                                                    </span>
                                                ` : ''}
                                                <span class="note-date">${note.date}</span>
                                                <button onclick="notesManager.deleteNoteFromPanel(${note.id})" class="note-delete">
                                                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                                                </button>
                                            </div>
                                            <div class="note-text">${note.text}</div>
                                            ${note.edited ? `<div class="note-edited">${t('notes.edited')} ${note.edited}</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button onclick="notesManager.importNotes()" class="btn btn-secondary">
                            <i data-lucide="upload"></i>
                            ${t('notes.import')}
                        </button>
                        <button onclick="notesManager.exportNotes()" class="btn btn-secondary">
                            <i data-lucide="download"></i>
                            ${t('notes.export')}
                        </button>
                        <button onclick="notesManager.closeNotesPanel()" class="btn btn-primary">
                            ${t('btn.close')}
                        </button>
                    </div>
                </div>
            </div>
        `;

        const oldModal = document.getElementById('notesModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Добавить заметку из панели
    async addNoteFromPanel() {
        const textArea = document.getElementById('newNoteText');
        const timecodeInput = document.getElementById('newNoteTimecode');

        const text = textArea.value.trim();
        if (!text) {
            const t = (key) => {
                if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                    return i18n.t(key);
                }
                return key;
            };
            
            if (typeof dialog !== 'undefined' && dialog.alert) {
                await dialog.alert(t('notes.enterText'), t('msg.error'));
            } else {
                alert(t('notes.enterText'));
            }
            return;
        }

        let timecode = null;
        if (timecodeInput.value.trim()) {
            timecode = this.parseTimecode(timecodeInput.value.trim());
        }

        await this.addNote(this.currentVideoId, text, timecode);
        
        textArea.value = '';
        timecodeInput.value = '';
        
        this.openNotesPanel(this.currentVideoId); // Обновить панель
    }

    // Удалить заметку из панели
    async deleteNoteFromPanel(noteId) {
        const t = (key) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return key;
        };
        
        let confirmed = false;
        if (typeof dialog !== 'undefined' && dialog.confirm) {
            confirmed = await dialog.confirm(t('notes.delete'), t('msg.deleteConfirm'));
        } else {
            confirmed = confirm(t('notes.delete'));
        }
        
        if (confirmed) {
            await this.deleteNote(this.currentVideoId, noteId);
            this.openNotesPanel(this.currentVideoId); // Обновить панель
        }
    }

    // Парсинг таймкода
    parseTimecode(str) {
        const parts = str.split(':').map(p => parseInt(p, 10));
        
        if (parts.length === 2) {
            // мм:сс
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            // чч:мм:сс
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        
        return null;
    }

    // Перейти к таймкоду (если есть видеоплеер)
    jumpToTimecode(seconds) {
        // Попытаться найти iframe с видео
        const iframe = document.querySelector('iframe');
        if (iframe) {
            if (typeof logger !== 'undefined') {
                logger.info('📝 Заметки', `Переход к таймкоду ${this.formatTimecode(seconds)}`);
            }
            // Для некоторых плееров можно отправить postMessage
            // Это зависит от конкретного балансера
        }
    }

    // Экспорт заметок в текстовый файл
    async exportNotes() {
        const notes = await this.getVideoNotes(this.currentVideoId);
        const dbInstance = typeof db !== 'undefined' ? db : (typeof window.db !== 'undefined' ? window.db : null);
        const video = dbInstance ? await dbInstance.getVideo(this.currentVideoId) : null;

        if (notes.length === 0) {
            const t = (key) => {
                if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                    return i18n.t(key);
                }
                return key;
            };
            
            if (typeof dialog !== 'undefined' && dialog.alert) {
                await dialog.alert(t('notes.noNotes'), t('notes.export'));
            }
            return;
        }

        let content = `Заметки к видео: ${video?.title || 'Неизвестно'}\n`;
        content += `Дата экспорта: ${new Date().toLocaleString('ru-RU')}\n`;
        content += `\n${'='.repeat(50)}\n\n`;

        notes.sort((a, b) => a.timestamp - b.timestamp).forEach((note, index) => {
            content += `${index + 1}. `;
            if (note.timecode) {
                content += `[${this.formatTimecode(note.timecode)}] `;
            }
            content += `${note.text}\n`;
            content += `   Дата: ${note.date}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes-${video?.title || 'video'}-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        if (typeof logger !== 'undefined') {
            logger.success('Заметки экспортированы');
        }
    }

    // Импорт заметок из текстового файла
    async importNotes() {
        const t = (key) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return key;
        };

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const lines = text.split('\n');
                let importedCount = 0;

                // Простой парсинг: ищем строки с таймкодами [MM:SS] или [HH:MM:SS]
                const timecodeRegex = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line || line.startsWith('=') || line.startsWith('Заметки') || line.startsWith('Дата')) {
                        continue;
                    }

                    const match = line.match(timecodeRegex);
                    let timecode = null;
                    let noteText = line;

                    if (match) {
                        // Извлекаем таймкод
                        const hours = match[3] ? parseInt(match[1]) : 0;
                        const minutes = match[3] ? parseInt(match[2]) : parseInt(match[1]);
                        const seconds = match[3] ? parseInt(match[3]) : parseInt(match[2]);
                        timecode = hours * 3600 + minutes * 60 + seconds;
                        
                        // Убираем таймкод и номер из текста
                        noteText = line.replace(/^\d+\.\s*/, '').replace(timecodeRegex, '').trim();
                    } else {
                        // Убираем только номер
                        noteText = line.replace(/^\d+\.\s*/, '').trim();
                    }

                    if (noteText && !noteText.startsWith('Дата:')) {
                        await this.addNote(this.currentVideoId, noteText, timecode);
                        importedCount++;
                    }
                }

                if (importedCount > 0) {
                    if (typeof logger !== 'undefined') {
                        logger.success(`Импортировано заметок: ${importedCount}`);
                    }
                    
                    // Обновить панель заметок
                    this.openNotesPanel(this.currentVideoId);
                    
                    if (typeof dialog !== 'undefined' && dialog.alert) {
                        await dialog.alert(
                            `${t('notes.imported')}: ${importedCount}`,
                            t('notes.import')
                        );
                    }
                } else {
                    if (typeof dialog !== 'undefined' && dialog.alert) {
                        await dialog.alert(
                            t('notes.noNotesFound'),
                            t('notes.import')
                        );
                    }
                }

            } catch (error) {
                console.error('Error importing notes:', error);
                if (typeof dialog !== 'undefined' && dialog.alert) {
                    await dialog.alert(
                        t('notes.importError'),
                        t('notes.import')
                    );
                }
            }
        };

        input.click();
    }

    closeNotesPanel() {
        const modal = document.getElementById('notesModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
        
        // Обновить отображение заметок на странице видео если она открыта
        if (this.currentVideoId && typeof loadVideoNotes === 'function') {
            loadVideoNotes(this.currentVideoId);
        }
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('notesUpdated', { 
            detail: { videoId: this.currentVideoId } 
        }));
        
        this.currentVideoId = null;
    }
}

// Создать глобальный экземпляр
const notesManager = new NotesManager();
window.notesManager = notesManager;

if (typeof logger !== 'undefined') {
    logger.success('Notes Manager initialized');
}
