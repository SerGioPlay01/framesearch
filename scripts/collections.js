/**
 * Framesearch - Collections Manager
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class CollectionsManager {
    constructor() {
        this.modal = null;
        this.editMode = false;
        this.editCollectionId = null;
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        // Check if modal already exists
        if (document.getElementById('collectionModal')) {
            this.modal = document.getElementById('collectionModal');
            return;
        }
        
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
        const modalHTML = `
            <div id="collectionModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content modal-small">
                    <div class="modal-header">
                        <h2 data-i18n="collections.create">${t('collections.create')}</h2>
                        <button class="modal-close" onclick="collectionsManager.close()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group">
                            <label data-i18n="collections.name.required">${t('collections.name.required')}</label>
                            <input type="text" id="collectionName" placeholder="${t('collections.name.placeholder')}" data-i18n="collections.name.placeholder" required>
                        </div>

                        <div class="form-group">
                            <label data-i18n="collections.description">${t('collections.description')}</label>
                            <textarea id="collectionDescription" placeholder="${t('collections.description.placeholder')}" data-i18n="collections.description.placeholder" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <label data-i18n="collections.poster">${t('collections.poster')}</label>
                            <div class="poster-upload">
                                <input type="file" id="collectionPosterFile" accept="image/*" style="display: none;">
                                <input type="text" id="collectionPosterUrl" placeholder="${t('collections.poster.url')}" data-i18n="collections.poster.url">
                                <button type="button" class="btn-secondary" id="uploadCollectionPosterBtn">
                                    <i data-lucide="upload"></i> <span data-i18n="collections.poster.upload">${t('collections.poster.upload')}</span>
                                </button>
                            </div>
                            <div id="collectionPosterPreview" class="poster-preview"></div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="collectionsManager.close()" data-i18n="collections.cancel">${t('collections.cancel')}</button>
                        <button type="button" class="btn-primary" onclick="collectionsManager.save()">
                            <i data-lucide="save"></i> <span data-i18n="collections.save">${t('collections.save')}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('collectionModal');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        const uploadBtn = document.getElementById('uploadCollectionPosterBtn');
        const posterFile = document.getElementById('collectionPosterFile');
        const posterUrl = document.getElementById('collectionPosterUrl');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                posterFile.click();
            });
        }
        
        if (posterFile) {
            posterFile.addEventListener('change', (e) => this.handlePosterUpload(e));
        }
        
        if (posterUrl) {
            posterUrl.addEventListener('input', (e) => this.handlePosterUrl(e));
        }

        const overlay = this.modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
    }

    async open(collectionId = null) {
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (collectionId) {
            this.editMode = true;
            this.editCollectionId = collectionId;
            await this.loadCollectionData(collectionId);
            document.querySelector('#collectionModal .modal-header h2').textContent = t('collections.edit');
        } else {
            this.editMode = false;
            this.editCollectionId = null;
            this.reset();
            document.querySelector('#collectionModal .modal-header h2').textContent = t('collections.create');
        }
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.reset();
    }

    reset() {
        this.editMode = false;
        this.editCollectionId = null;
        document.getElementById('collectionName').value = '';
        document.getElementById('collectionDescription').value = '';
        document.getElementById('collectionPosterUrl').value = '';
        document.getElementById('collectionPosterPreview').innerHTML = '';
    }

    async loadCollectionData(collectionId) {
        try {
            const collection = await db.getCollection(collectionId);
            if (!collection) return;

            document.getElementById('collectionName').value = collection.name || '';
            document.getElementById('collectionDescription').value = collection.description || '';
            document.getElementById('collectionPosterUrl').value = collection.poster || '';
            
            if (collection.poster) {
                document.getElementById('collectionPosterPreview').innerHTML = `<img src="${collection.poster}" alt="Poster">`;
            }
        } catch (error) {
            logger.error('Failed to load collection data', error);
        }
    }

    async save() {
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        const name = document.getElementById('collectionName').value.trim();
        
        if (!name) {
            await dialog.alert(t('collections.error.name'), t('collections.error.validation'));
            return;
        }

        const collectionData = {
            name: name,
            description: document.getElementById('collectionDescription').value.trim(),
            poster: document.getElementById('collectionPosterPreview').querySelector('img')?.src || ''
        };

        try {
            if (this.editMode && this.editCollectionId) {
                await db.updateCollection(this.editCollectionId, collectionData);
                logger.collection('Collection updated');
            } else {
                await db.addCollection(collectionData);
                logger.collection('Collection created');
            }

            this.close();
            
            if (typeof loadCollections === 'function') {
                loadCollections();
            }
        } catch (error) {
            logger.error('Error saving collection', error);
            await dialog.alert(t('import.error.message') + ': ' + error.message, t('import.error.title'));
        }
    }

    handlePosterUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.showPosterPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    handlePosterUrl(e) {
        const url = e.target.value.trim();
        if (url) {
            this.showPosterPreview(url);
        }
    }

    showPosterPreview(src) {
        const preview = document.getElementById('collectionPosterPreview');
        preview.innerHTML = `<img src="${src}" alt="Poster preview">`;
    }
}

// Create global instance
const collectionsManager = new CollectionsManager();
window.collectionsManager = collectionsManager;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    collectionsManager.init();
});
