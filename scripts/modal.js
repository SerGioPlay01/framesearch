/**
 * Framesearch - Modal Manager for Adding/Editing Content
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class ModalManager {
    constructor() {
        this.modal = null;
        this.currentStep = 1;
        this.videoData = {};
        this.episodes = [];
        this.editMode = false;
        this.editVideoId = null;
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        // Check if modal already exists
        if (document.getElementById('addContentModal')) {
            this.modal = document.getElementById('addContentModal');
            return;
        }
        
        const modalHTML = `
            <div id="addContentModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>
                            <i data-lucide="film"></i>
                            <span data-i18n="modal.title.add">Добавить контент</span>
                        </h2>
                        <button class="modal-close" id="closeModal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <!-- Step Progress Indicator -->
                    <div class="step-progress">
                        <div class="step-indicator">
                            <div class="step-dot active" data-step="1">1</div>
                            <div class="step-label" data-i18n="modal.step1">Информация</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-indicator">
                            <div class="step-dot" data-step="2">2</div>
                            <div class="step-label" data-i18n="modal.step2">Источник</div>
                        </div>
                    </div>

                    <div class="modal-body">
                        <!-- Step 1: Basic Info -->
                        <div class="modal-step" id="step1">
                            <div class="form-group">
                                <label data-i18n="modal.name.required">Название *</label>
                                <input type="text" id="videoTitle" data-i18n="modal.name.placeholder" placeholder="Введите название" required>
                            </div>

                            <div class="form-group">
                                <label data-i18n="modal.description">Описание</label>
                                <textarea id="videoDescription" data-i18n="modal.description.placeholder" placeholder="Краткое описание" rows="3"></textarea>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label data-i18n="modal.year">Год выпуска</label>
                                    <input type="number" id="videoYear" data-i18n="modal.year.placeholder" placeholder="2026" min="1900" max="2100">
                                </div>

                                <div class="form-group">
                                    <label data-i18n="modal.rating">Рейтинг (0-10)</label>
                                    <input type="number" id="videoRating" data-i18n="modal.rating.placeholder" placeholder="8.5" min="0" max="10" step="0.1">
                                </div>

                                <div class="form-group">
                                    <label data-i18n="modal.duration">Длительность</label>
                                    <input type="text" id="videoDuration" data-i18n="modal.duration.placeholder" placeholder="2ч 14мин">
                                </div>
                            </div>
                            
                            <!-- Hidden field for type - will be set automatically based on source -->
                            <input type="hidden" id="videoType" value="">
                            <input type="hidden" id="videoGenre" value="Разное">

                            <div class="form-group">
                                <label data-i18n="modal.collection">Коллекция</label>
                                <select id="videoCollection">
                                    <option value="" data-i18n="modal.collection.none">Без коллекции</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label data-i18n="modal.poster">Постер</label>
                                <div class="poster-upload">
                                    <input type="file" id="posterFile" accept="image/*" style="display: none;">
                                    <input type="text" id="posterUrl" data-i18n="modal.poster.url" placeholder="Или вставьте URL изображения">
                                    <button type="button" class="btn-secondary" id="uploadPosterBtn">
                                        <i data-lucide="upload"></i> <span data-i18n="modal.poster.upload">Выбрать файл</span>
                                    </button>
                                </div>
                                <div id="posterPreview" class="poster-preview"></div>
                            </div>
                        </div>

                        <!-- Step 2: Video Source -->
                        <div class="modal-step" id="step2" style="display: none;">
                            <h3 style="margin-bottom: 1.5rem; color: white;">Источник видео</h3>
                            
                            <!-- Source Type Tabs -->
                            <div class="source-tabs">
                                <button class="source-tab active" data-source="balancer">
                                    <i data-lucide="tv"></i>
                                    Видеобалансеры
                                </button>
                                <button class="source-tab" data-source="direct">
                                    <i data-lucide="file-video"></i>
                                    Прямая ссылка
                                </button>
                                <button class="source-tab" data-source="social">
                                    <i data-lucide="share-2"></i>
                                    Соцсети
                                </button>
                                <button class="source-tab" data-source="custom">
                                    <i data-lucide="code"></i>
                                    Кастомный iframe
                                </button>
                            </div>

                            <!-- Balancer Source -->
                            <div class="source-content active" id="balancerSource">
                                <div class="form-group">
                                    <label>Выберите балансер</label>
                                    <select id="balancerType" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;">
                                        <option value="iframe">Iframe URL (Kodik, Collaps, Alloha, HDRezka)</option>
                                        <option value="vibix">Vibix (по ID фильма/сериала)</option>
                                    </select>
                                </div>
                                
                                <!-- Iframe URL -->
                                <div class="balancer-option" id="iframeBalancer">
                                    <div class="form-group">
                                        <label>URL видеобалансера (iframe)</label>
                                        <input type="url" id="iframeUrl" placeholder="https://kodik.info/seria/123456/hash/720p">
                                        <p class="help-text">Вставьте ссылку на видео из Kodik, Collaps, Alloha или HDRezka</p>
                                    </div>
                                    <div id="iframePreview" class="iframe-preview"></div>
                                </div>
                                
                                <!-- Vibix Source -->
                                <div class="balancer-option" id="vibixBalancer" style="display: none;">
                                    <div class="form-group">
                                        <label>Тип контента</label>
                                        <select id="vibixType" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;">
                                            <option value="movie">Фильм (movie)</option>
                                            <option value="series">Сериал (series)</option>
                                            <option value="kp">По ID Кинопоиска (kp)</option>
                                            <option value="imdb">По IMDB ID (imdb)</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>ID контента</label>
                                        <input type="text" id="vibixId" placeholder="Например: 187471 или tt0111161">
                                        <p class="help-text">ID фильма/сериала из базы Vibix, Кинопоиска или IMDB</p>
                                    </div>
                                    
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Дизайн плеера (1-6)</label>
                                            <input type="number" id="vibixDesign" min="1" max="6" value="1">
                                        </div>
                                        <div class="form-group">
                                            <label>ID озвучки (опционально)</label>
                                            <input type="text" id="vibixVoiceover" placeholder="Например: 4">
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                            <input type="checkbox" id="vibixPoster">
                                            <span>Показать постер перед воспроизведением</span>
                                        </label>
                                    </div>
                                    
                                    <div id="vibixPreview" class="iframe-preview"></div>
                                </div>
                            </div>

                            <!-- Direct Link Source -->
                            <div class="source-content" id="directSource" style="display: none;">
                                <div class="form-group">
                                    <label>Прямая ссылка на видеофайл</label>
                                    <input type="url" id="directUrl" placeholder="https://example.com/video.mp4">
                                    <p class="help-text">Поддерживаются форматы: MP4, WebM, OGG</p>
                                </div>
                                <div class="form-group">
                                    <label>Тип видео</label>
                                    <select id="directVideoType" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;">
                                        <option value="video/mp4">MP4</option>
                                        <option value="video/webm">WebM</option>
                                        <option value="video/ogg">OGG</option>
                                    </select>
                                </div>
                                <div id="directPreview" class="iframe-preview"></div>
                            </div>

                            <!-- Social Media Source -->
                            <div class="source-content" id="socialSource" style="display: none;">
                                <div class="form-group">
                                    <label>Платформа</label>
                                    <select id="socialPlatform" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;">
                                        <option value="youtube">YouTube</option>
                                        <option value="vk">VK Видео</option>
                                        <option value="rutube">RuTube</option>
                                    </select>
                                </div>
                                
                                <!-- YouTube -->
                                <div class="social-option" id="youtubeOption">
                                    <div class="form-group">
                                        <label>YouTube Video ID или URL</label>
                                        <input type="text" id="youtubeId" placeholder="dQw4w9WgXcQ или https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                                        <p class="help-text">Вставьте ID видео или полную ссылку YouTube</p>
                                    </div>
                                </div>
                                
                                <!-- VK Video -->
                                <div class="social-option" id="vkOption" style="display: none;">
                                    <div class="form-group">
                                        <label>VK Video URL или embed код</label>
                                        <input type="text" id="vkUrl" placeholder="https://vk.com/video-123456_789012">
                                        <p class="help-text">Вставьте ссылку на видео VK или embed код</p>
                                    </div>
                                </div>
                                
                                <!-- RuTube -->
                                <div class="social-option" id="rutubeOption" style="display: none;">
                                    <div class="form-group">
                                        <label>RuTube Video ID или URL</label>
                                        <input type="text" id="rutubeId" placeholder="abc123def456 или https://rutube.ru/video/abc123def456/">
                                        <p class="help-text">Вставьте ID видео или полную ссылку RuTube</p>
                                    </div>
                                </div>
                                
                                <div id="socialPreview" class="iframe-preview"></div>
                            </div>

                            <!-- Custom Iframe Source -->
                            <div class="source-content" id="customSource" style="display: none;">
                                <div class="form-group">
                                    <label>Кастомный iframe код</label>
                                    <textarea id="customIframe" rows="6" placeholder='<iframe src="https://example.com/player" width="100%" height="500" frameborder="0" allowfullscreen></iframe>' style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-family: monospace; resize: vertical;"></textarea>
                                    <p class="help-text">Вставьте полный HTML код iframe</p>
                                </div>
                                <div id="customPreview" class="iframe-preview"></div>
                            </div>
                        </div>

                        <!-- Step 3: Episodes (for series/anime) -->
                        <div class="modal-step" id="step3" style="display: none;">
                            <div class="episodes-header">
                                <h3>Добавить эпизоды</h3>
                                <button type="button" class="btn-secondary" id="addEpisodeBtn">
                                    <i data-lucide="plus"></i> Добавить эпизод
                                </button>
                            </div>

                            <div id="episodesList" class="episodes-list">
                                <!-- Episodes will be added here -->
                            </div>

                            <div id="episodeForm" class="episode-form" style="display: none;">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Сезон</label>
                                        <input type="number" id="episodeSeason" min="1" value="1">
                                    </div>
                                    <div class="form-group">
                                        <label>Эпизод</label>
                                        <input type="number" id="episodeNumber" min="1" value="1">
                                    </div>
                                    <div class="form-group">
                                        <label>Длительность</label>
                                        <input type="text" id="episodeDuration" placeholder="45мин">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>Название эпизода</label>
                                    <input type="text" id="episodeTitle" placeholder="Название эпизода">
                                </div>

                                <div class="form-group">
                                    <label>URL видеобалансера</label>
                                    <input type="url" id="episodeIframeUrl" placeholder="https://kodik.info/seria/123456/hash/720p">
                                </div>

                                <div class="form-actions">
                                    <button type="button" class="btn-secondary" id="cancelEpisodeBtn">Отмена</button>
                                    <button type="button" class="btn-primary" id="saveEpisodeBtn">Сохранить эпизод</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" id="prevStepBtn" style="display: none;">
                            <i data-lucide="arrow-left"></i> <span data-i18n="btn.back">Назад</span>
                        </button>
                        <div style="flex: 1;"></div>
                        <button type="button" class="btn-secondary" id="cancelBtn" data-i18n="btn.cancel">Отмена</button>
                        <button type="button" class="btn-primary" id="nextStepBtn">
                            <span data-i18n="btn.next">Далее</span> <i data-lucide="arrow-right"></i>
                        </button>
                        <button type="button" class="btn-primary" id="saveBtn" style="display: none;">
                            <i data-lucide="save"></i> <span data-i18n="btn.save">Сохранить</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('addContentModal');
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => this.close());
        document.getElementById('cancelBtn').addEventListener('click', () => this.close());
        document.querySelector('.modal-overlay').addEventListener('click', () => this.close());

        // Navigation
        document.getElementById('nextStepBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevStepBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('saveBtn').addEventListener('click', () => this.save());

        // Poster upload
        document.getElementById('uploadPosterBtn').addEventListener('click', () => {
            document.getElementById('posterFile').click();
        });
        document.getElementById('posterFile').addEventListener('change', (e) => this.handlePosterUpload(e));
        document.getElementById('posterUrl').addEventListener('input', (e) => this.handlePosterUrl(e));

        // Source tabs
        document.querySelectorAll('.source-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleSourceTabChange(e));
        });

        // Balancer type selector
        document.getElementById('balancerType').addEventListener('change', (e) => this.handleBalancerTypeChange(e));

        // Social platform selector
        document.getElementById('socialPlatform').addEventListener('change', (e) => this.handleSocialPlatformChange(e));

        // Iframe preview
        const iframeUrlInput = document.getElementById('iframeUrl');
        if (iframeUrlInput) {
            iframeUrlInput.addEventListener('input', (e) => this.previewIframe(e));
        }
        
        // Vibix preview
        document.getElementById('vibixId').addEventListener('input', () => this.previewVibix());
        document.getElementById('vibixType').addEventListener('change', () => this.previewVibix());
        document.getElementById('vibixDesign').addEventListener('input', () => this.previewVibix());
        document.getElementById('vibixVoiceover').addEventListener('input', () => this.previewVibix());
        document.getElementById('vibixPoster').addEventListener('change', () => this.previewVibix());

        // Direct video preview
        document.getElementById('directUrl').addEventListener('input', () => this.previewDirect());

        // Social media preview
        document.getElementById('youtubeId').addEventListener('input', () => this.previewSocial());
        document.getElementById('vkUrl').addEventListener('input', () => this.previewSocial());
        document.getElementById('rutubeId').addEventListener('input', () => this.previewSocial());

        // Custom iframe preview
        document.getElementById('customIframe').addEventListener('input', () => this.previewCustom());

        // Episodes
        document.getElementById('addEpisodeBtn').addEventListener('click', () => this.showEpisodeForm());
        document.getElementById('cancelEpisodeBtn').addEventListener('click', () => this.hideEpisodeForm());
        document.getElementById('saveEpisodeBtn').addEventListener('click', () => this.saveEpisode());

        // Video type change
        document.getElementById('videoType').addEventListener('change', (e) => {
            this.videoData.type = e.target.value;
        });
        
        // Real-time validation
        this.initRealTimeValidation();
        
        // Drag & Drop for poster
        this.initPosterDragDrop();
    }
    
    initRealTimeValidation() {
        // Title validation
        const titleInput = document.getElementById('videoTitle');
        titleInput.addEventListener('blur', () => {
            const value = titleInput.value.trim();
            const formGroup = titleInput.closest('.form-group');
            
            if (!value) {
                formGroup.classList.add('has-error');
                titleInput.classList.add('error');
            } else {
                formGroup.classList.remove('has-error');
                titleInput.classList.remove('error');
                titleInput.classList.add('success');
            }
        });
        
        titleInput.addEventListener('input', () => {
            if (titleInput.value.trim()) {
                titleInput.classList.remove('error');
                titleInput.closest('.form-group').classList.remove('has-error');
            }
        });
    }
    
    initPosterDragDrop() {
        const posterUrl = document.getElementById('posterUrl');
        const posterPreview = document.getElementById('posterPreview');
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
        // Create drop zone if it doesn't exist
        if (!document.querySelector('.poster-drop-zone')) {
            const dropZone = document.createElement('div');
            dropZone.className = 'poster-drop-zone';
            dropZone.innerHTML = `
                <i data-lucide="image"></i>
                <p data-i18n="modal.poster.drag">${t('modal.poster.drag')}</p>
                <p class="text-small" data-i18n="modal.poster.or">${t('modal.poster.or')}</p>
            `;
            
            const posterGroup = posterUrl.closest('.form-group');
            posterGroup.appendChild(dropZone);
            
            // Click to select file
            dropZone.addEventListener('click', () => {
                document.getElementById('posterFile').click();
            });
            
            // Drag events
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.add('drag-over');
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.remove('drag-over');
                });
            });
            
            dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const file = files[0];
                    if (file.type.startsWith('image/')) {
                        this.handlePosterFile(file);
                    }
                }
            });
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    handlePosterFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const posterPreview = document.getElementById('posterPreview');
            posterPreview.innerHTML = `
                <img src="${e.target.result}" alt="Poster">
                <button class="remove-poster" onclick="modal.removePoster()">
                    <i data-lucide="x"></i>
                </button>
            `;
            this.videoData.poster = e.target.result;
            
            // Hide drag & drop zone after poster is loaded
            const dropZone = document.querySelector('.poster-drop-zone');
            if (dropZone) {
                dropZone.style.display = 'none';
            }
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        };
        reader.readAsDataURL(file);
    }
    
    removePoster() {
        event.stopPropagation();
        const posterPreview = document.getElementById('posterPreview');
        posterPreview.innerHTML = '';
        document.getElementById('posterUrl').value = '';
        document.getElementById('posterFile').value = '';
        this.videoData.poster = '';
        
        // Show drag & drop zone again after poster is removed
        const dropZone = document.querySelector('.poster-drop-zone');
        if (dropZone) {
            dropZone.style.display = 'flex';
        }
    }

    async open(videoId = null) {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load collections into select
        await this.loadCollectionsSelect();
        
        const titleSpan = document.querySelector('.modal-header h2 span');
        if (videoId) {
            // Edit mode
            this.editMode = true;
            this.editVideoId = videoId;
            await this.loadVideoData(videoId);
            const title = window.i18n ? window.i18n.t('modal.title.edit') : 'Редактировать контент';
            if (titleSpan) {
                titleSpan.textContent = title;
                titleSpan.setAttribute('data-i18n', 'modal.title.edit');
            }
        } else {
            // Add mode
            this.editMode = false;
            this.editVideoId = null;
            this.reset();
            const title = window.i18n ? window.i18n.t('modal.title.add') : 'Добавить контент';
            if (titleSpan) {
                titleSpan.textContent = title;
                titleSpan.setAttribute('data-i18n', 'modal.title.add');
            }
        }
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.reset();
    }

    reset() {
        this.currentStep = 1;
        this.videoData = {};
        this.episodes = [];
        this.editMode = false;
        this.editVideoId = null;
        this.showStep(1);
        
        // Clear form
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoDescription').value = '';
        document.getElementById('videoType').value = '';
        document.getElementById('videoGenre').value = '';
        document.getElementById('videoYear').value = '';
        document.getElementById('videoRating').value = '';
        document.getElementById('videoDuration').value = '';
        document.getElementById('posterUrl').value = '';
        document.getElementById('posterPreview').innerHTML = '';
        document.getElementById('iframeUrl').value = '';
        document.getElementById('episodesList').innerHTML = '';
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.modal-step').forEach(s => s.style.display = 'none');
        
        // Show current step
        document.getElementById(`step${step}`).style.display = 'block';
        
        // Update progress indicator
        document.querySelectorAll('.step-dot').forEach((dot, index) => {
            const dotStep = index + 1;
            dot.classList.remove('active', 'completed');
            
            if (dotStep < step) {
                dot.classList.add('completed');
            } else if (dotStep === step) {
                dot.classList.add('active');
            }
        });
        
        // Update progress lines
        document.querySelectorAll('.step-line').forEach((line, index) => {
            const lineStep = index + 1;
            if (lineStep < step) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });
        
        // Update buttons
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const saveBtn = document.getElementById('saveBtn');
        
        prevBtn.style.display = step > 1 ? 'block' : 'none';
        
        // Simplified: only 2 steps now (Info and Source)
        if (step === 1) {
            nextBtn.style.display = 'block';
            saveBtn.style.display = 'none';
        } else if (step === 2) {
            nextBtn.style.display = 'none';
            saveBtn.style.display = 'block';
        }
        
        this.currentStep = step;
    }

    async nextStep() {
        if (this.currentStep === 1) {
            if (!(await this.validateStep1())) return;
            this.collectStep1Data();
        }
        
        if (this.currentStep === 2) {
            if (!(await this.validateStep2())) return;
            this.collectStep2Data();
        }
        
        // Move to next step (max 2 steps now)
        if (this.currentStep < 2) {
            this.showStep(this.currentStep + 1);
        }
    }

    prevStep() {
        this.showStep(this.currentStep - 1);
    }

    async validateStep1() {
        const title = document.getElementById('videoTitle').value.trim();
        
        if (!title) {
            await dialog.alert('Пожалуйста, введите название', 'Ошибка валидации');
            return false;
        }
        
        return true;
    }

    async validateStep2() {
        // Get active source tab
        const activeTab = document.querySelector('.source-tab.active');
        const sourceType = activeTab ? activeTab.dataset.source : 'balancer';
        
        if (sourceType === 'balancer') {
            const balancerType = document.getElementById('balancerType').value;
            
            if (balancerType === 'vibix') {
                const vibixId = document.getElementById('vibixId').value.trim();
                if (!vibixId) {
                    await dialog.alert('Пожалуйста, введите ID контента для Vibix', 'Ошибка валидации');
                    return false;
                }
            } else {
                const url = document.getElementById('iframeUrl').value.trim();
                if (!url) {
                    await dialog.alert('Пожалуйста, введите URL видеобалансера', 'Ошибка валидации');
                    return false;
                }
            }
        } else if (sourceType === 'direct') {
            const url = document.getElementById('directUrl').value.trim();
            if (!url) {
                await dialog.alert('Пожалуйста, введите прямую ссылку на видеофайл', 'Ошибка валидации');
                return false;
            }
        } else if (sourceType === 'social') {
            const platform = document.getElementById('socialPlatform').value;
            let hasValue = false;
            
            if (platform === 'youtube') {
                hasValue = !!document.getElementById('youtubeId').value.trim();
            } else if (platform === 'vk') {
                hasValue = !!document.getElementById('vkUrl').value.trim();
            } else if (platform === 'rutube') {
                hasValue = !!document.getElementById('rutubeId').value.trim();
            }
            
            if (!hasValue) {
                await dialog.alert('Пожалуйста, введите ID или URL видео', 'Ошибка валидации');
                return false;
            }
        } else if (sourceType === 'custom') {
            const iframeCode = document.getElementById('customIframe').value.trim();
            if (!iframeCode) {
                await dialog.alert('Пожалуйста, введите код iframe', 'Ошибка валидации');
                return false;
            }
        }
        
        return true;
    }

    collectStep1Data() {
        const collectionSelect = document.getElementById('videoCollection');
        const collectionId = collectionSelect.value ? parseInt(collectionSelect.value) : null;
        
        this.videoData = {
            title: document.getElementById('videoTitle').value.trim(),
            description: document.getElementById('videoDescription').value.trim(),
            type: document.getElementById('videoType').value,
            genre: document.getElementById('videoGenre').value,
            year: parseInt(document.getElementById('videoYear').value) || new Date().getFullYear(),
            rating: parseFloat(document.getElementById('videoRating').value) || 0,
            duration: document.getElementById('videoDuration').value.trim(),
            poster: document.getElementById('posterPreview').querySelector('img')?.src || '',
            collectionId: collectionId
        };
    }

    collectStep2Data() {
        // Get active source tab
        const activeTab = document.querySelector('.source-tab.active');
        const sourceType = activeTab ? activeTab.dataset.source : 'balancer';
        
        this.videoData.sourceCategory = sourceType;
        
        if (sourceType === 'balancer') {
            const balancerType = document.getElementById('balancerType').value;
            this.videoData.sourceType = balancerType;
            
            if (balancerType === 'vibix') {
                this.videoData.vibixType = document.getElementById('vibixType').value;
                this.videoData.vibixId = document.getElementById('vibixId').value.trim();
                this.videoData.vibixDesign = document.getElementById('vibixDesign').value;
                this.videoData.vibixVoiceover = document.getElementById('vibixVoiceover').value.trim();
                this.videoData.vibixPoster = document.getElementById('vibixPoster').checked;
            } else {
                this.videoData.sourceUrl = document.getElementById('iframeUrl').value.trim();
            }
        } else if (sourceType === 'direct') {
            this.videoData.sourceType = 'direct';
            this.videoData.sourceUrl = document.getElementById('directUrl').value.trim();
            this.videoData.videoType = document.getElementById('directVideoType').value;
        } else if (sourceType === 'social') {
            const platform = document.getElementById('socialPlatform').value;
            this.videoData.sourceType = 'social';
            this.videoData.socialPlatform = platform;
            
            if (platform === 'youtube') {
                let youtubeId = document.getElementById('youtubeId').value.trim();
                const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
                const match = youtubeId.match(youtubeRegex);
                if (match) youtubeId = match[1];
                this.videoData.sourceUrl = `https://www.youtube.com/embed/${youtubeId}`;
            } else if (platform === 'vk') {
                let vkUrl = document.getElementById('vkUrl').value.trim();
                const vkRegex = /video(-?\d+)_(\d+)/;
                const match = vkUrl.match(vkRegex);
                if (match) {
                    this.videoData.sourceUrl = `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}`;
                } else {
                    this.videoData.sourceUrl = vkUrl;
                }
            } else if (platform === 'rutube') {
                let rutubeId = document.getElementById('rutubeId').value.trim();
                const rutubeRegex = /rutube\.ru\/video\/([a-zA-Z0-9]+)/;
                const match = rutubeId.match(rutubeRegex);
                if (match) rutubeId = match[1];
                this.videoData.sourceUrl = `https://rutube.ru/play/embed/${rutubeId}`;
            }
        } else if (sourceType === 'custom') {
            this.videoData.sourceType = 'custom';
            this.videoData.sourceUrl = document.getElementById('customIframe').value.trim();
        }
    }

    async save() {
        try {
            this.collectStep1Data();
            this.collectStep2Data();
            
            if (this.editMode && this.editVideoId) {
                // Update existing video
                await db.updateVideo(this.editVideoId, this.videoData);
                
                // Update episodes if any
                // Note: For simplicity, we'll delete old episodes and add new ones
                const oldEpisodes = await db.getEpisodes(this.editVideoId);
                for (const ep of oldEpisodes) {
                    await db.deleteEpisode(ep.id);
                }
                
                for (const episode of this.episodes) {
                    episode.videoId = this.editVideoId;
                    await db.addEpisode(episode);
                }
                
                console.log('Контент успешно обновлен!');
            } else {
                // Add new video
                const videoId = await db.addVideo(this.videoData);
                
                // Add episodes if any
                for (const episode of this.episodes) {
                    episode.videoId = videoId;
                    await db.addEpisode(episode);
                }
                
                console.log('Контент успешно добавлен!');
            }
            
            // Close modal
            this.close();
            
            // Reload content
            if (window.loadVideos) {
                window.loadVideos();
            }
        } catch (error) {
            console.error('Error saving video:', error);
            await dialog.alert('Ошибка при сохранении: ' + error.message, 'Ошибка');
        }
    }

    handlePosterUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.handlePosterFile(file);
        }
    }

    handlePosterUrl(e) {
        const url = e.target.value.trim();
        if (url) {
            this.showPosterPreview(url);
        }
    }

    showPosterPreview(src) {
        const posterPreview = document.getElementById('posterPreview');
        posterPreview.innerHTML = `
            <img src="${src}" alt="Poster">
            <button class="remove-poster" onclick="modal.removePoster()">
                <i data-lucide="x"></i>
            </button>
        `;
        this.videoData.poster = src;
        
        // Hide drag & drop zone after poster is loaded
        const dropZone = document.querySelector('.poster-drop-zone');
        if (dropZone) {
            dropZone.style.display = 'none';
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    switchSourceType(e) {
        const btn = e.currentTarget;
        const type = btn.dataset.type;
        
        // Update active button
        const container = btn.closest('.source-type-selector');
        container.querySelectorAll('.source-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show/hide content
        document.getElementById('fileSource').style.display = 'none';
        document.getElementById('urlSource').style.display = 'none';
        document.getElementById('iframeSource').style.display = 'none';
        
        if (type === 'file') {
            document.getElementById('fileSource').style.display = 'block';
        } else if (type === 'url') {
            document.getElementById('urlSource').style.display = 'block';
        } else if (type === 'iframe') {
            document.getElementById('iframeSource').style.display = 'block';
        }
    }
    
    switchEpisodeSourceType(e) {
        const btn = e.currentTarget;
        const type = btn.dataset.type;
        
        // Update active button
        const container = btn.closest('.source-type-selector');
        container.querySelectorAll('.source-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show/hide content
        document.getElementById('episodeFileSource').style.display = 'none';
        document.getElementById('episodeUrlSource').style.display = 'none';
        document.getElementById('episodeIframeSource').style.display = 'none';
        
        if (type === 'file') {
            document.getElementById('episodeFileSource').style.display = 'block';
        } else if (type === 'url') {
            document.getElementById('episodeUrlSource').style.display = 'block';
        } else if (type === 'iframe') {
            document.getElementById('episodeIframeSource').style.display = 'block';
        }
    }

    handleVideoFile(e) {
        const file = e.target.files[0];
        if (file) {
            const fileInfo = document.getElementById('fileInfo');
            const size = (file.size / (1024 * 1024)).toFixed(2);
            fileInfo.innerHTML = `
                <div class="file-info-content">
                    <i data-lucide="file-video"></i>
                    <div>
                        <p class="file-name">${file.name}</p>
                        <p class="file-size">${size} MB</p>
                    </div>
                    <button type="button" class="btn-icon" onclick="document.getElementById('videoFile').value=''; this.parentElement.parentElement.style.display='none';">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            `;
            fileInfo.style.display = 'block';
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    previewIframe(e) {
        const url = e.target.value.trim();
        const preview = document.getElementById('iframePreview');
        
        if (url) {
            preview.innerHTML = `
                <iframe src="${url}" frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            preview.innerHTML = '';
        }
    }
    
    handleSourceTypeChange(e) {
        const sourceType = e.target.value;
        const iframeSource = document.getElementById('iframeSource');
        const vibixSource = document.getElementById('vibixSource');
        
        if (sourceType === 'vibix') {
            iframeSource.style.display = 'none';
            vibixSource.style.display = 'block';
            this.previewVibix();
        } else {
            iframeSource.style.display = 'block';
            vibixSource.style.display = 'none';
        }
    }
    
    previewVibix() {
        const vibixId = document.getElementById('vibixId').value.trim();
        const vibixType = document.getElementById('vibixType').value;
        const vibixDesign = document.getElementById('vibixDesign').value;
        const vibixVoiceover = document.getElementById('vibixVoiceover').value.trim();
        const vibixPoster = document.getElementById('vibixPoster').checked;
        const preview = document.getElementById('vibixPreview');
        
        if (vibixId) {
            let insTag = `<ins data-publisher-id="675593060" data-type="${vibixType}" data-id="${vibixId}"`;
            
            // Add responsive dimensions
            insTag += ` data-width="100%" data-height="100%"`;
            
            if (vibixDesign) {
                insTag += ` data-design="${vibixDesign}"`;
            }
            if (vibixVoiceover) {
                insTag += ` data-voiceover="${vibixVoiceover}"`;
            }
            if (vibixPoster) {
                insTag += ` data-poster="true"`;
            }
            
            insTag += `></ins>`;
            
            preview.innerHTML = insTag;
            
            // Reinitialize Vibix SDK for the new element
            if (window.RendexSDK) {
                setTimeout(() => {
                    window.RendexSDK.init();
                }, 100);
            }
        } else {
            preview.innerHTML = '';
        }
    }
    
    previewDirectUrl(e) {
        const url = e.target.value.trim();
        const preview = document.getElementById('urlPreview');
        
        if (url) {
            preview.innerHTML = `
                <video controls style="width: 100%; max-height: 300px; border-radius: 0.5rem; background: #000;">
                    <source src="${url}">
                    Ваш браузер не поддерживает воспроизведение видео.
                </video>
            `;
        } else {
            preview.innerHTML = '';
        }
    }

    showEpisodeForm() {
        document.getElementById('episodeForm').style.display = 'block';
        document.getElementById('addEpisodeBtn').style.display = 'none';
    }

    hideEpisodeForm() {
        document.getElementById('episodeForm').style.display = 'none';
        document.getElementById('addEpisodeBtn').style.display = 'block';
        
        // Clear form
        document.getElementById('episodeTitle').value = '';
        document.getElementById('episodeFile').value = '';
        document.getElementById('episodeDirectUrl').value = '';
        document.getElementById('episodeIframeUrl').value = '';
        
        // Reset to file source
        const episodeForm = document.getElementById('episodeForm');
        episodeForm.querySelectorAll('.source-type-btn').forEach(btn => {
            if (btn.dataset.type === 'file') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        document.getElementById('episodeFileSource').style.display = 'block';
        document.getElementById('episodeUrlSource').style.display = 'none';
        document.getElementById('episodeIframeSource').style.display = 'none';
    }

    async saveEpisode() {
        const season = parseInt(document.getElementById('episodeSeason').value);
        const episode = parseInt(document.getElementById('episodeNumber').value);
        const title = document.getElementById('episodeTitle').value.trim();
        const duration = document.getElementById('episodeDuration').value.trim();
        const sourceUrl = document.getElementById('episodeIframeUrl').value.trim();
        
        if (!sourceUrl) {
            await dialog.alert('Введите URL видеобалансера', 'Ошибка валидации');
            return;
        }
        
        const episodeData = {
            season,
            episode,
            title: title || `Эпизод ${episode}`,
            duration,
            sourceType: 'iframe',
            sourceUrl
        };
        
        this.episodes.push(episodeData);
        this.renderEpisodes();
        this.hideEpisodeForm();
    }

    renderEpisodes() {
        const list = document.getElementById('episodesList');
        list.innerHTML = this.episodes.map((ep, index) => `
            <div class="episode-item">
                <div class="episode-info">
                    <span class="episode-number">S${ep.season}E${ep.episode}</span>
                    <span class="episode-title">${ep.title}</span>
                    <span class="episode-duration">${ep.duration}</span>
                </div>
                <button type="button" class="btn-icon" onclick="modal.removeEpisode(${index})">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `).join('');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    removeEpisode(index) {
        this.episodes.splice(index, 1);
        this.renderEpisodes();
    }

    async loadCollectionsSelect() {
        const select = document.getElementById('videoCollection');
        if (!select) return;
        
        try {
            const collections = await db.getAllCollections();
            
            // Keep "Без коллекции" option and add collections
            select.innerHTML = '<option value="">Без коллекции</option>';
            
            collections.forEach(collection => {
                const option = document.createElement('option');
                option.value = collection.id;
                option.textContent = collection.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load collections:', error);
        }
    }

    async loadVideoData(videoId) {
        try {
            const video = await db.getVideo(videoId);
            if (!video) return;

            // Fill form with video data
            document.getElementById('videoTitle').value = video.title || '';
            document.getElementById('videoDescription').value = video.description || '';
            document.getElementById('videoType').value = video.type || '';
            document.getElementById('videoGenre').value = video.genre || '';
            document.getElementById('videoYear').value = video.year || '';
            document.getElementById('videoRating').value = video.rating || '';
            document.getElementById('videoDuration').value = video.duration || '';
            document.getElementById('posterUrl').value = video.poster || '';
            document.getElementById('videoCollection').value = video.collectionId || '';
            
            if (video.poster) {
                document.getElementById('posterPreview').innerHTML = `<img src="${video.poster}" alt="Poster">`;
            }
            
            // Load source data
            if (video.sourceType === 'vibix') {
                document.getElementById('sourceType').value = 'vibix';
                document.getElementById('iframeSource').style.display = 'none';
                document.getElementById('vibixSource').style.display = 'block';
                
                document.getElementById('vibixType').value = video.vibixType || 'movie';
                document.getElementById('vibixId').value = video.vibixId || '';
                document.getElementById('vibixDesign').value = video.vibixDesign || '1';
                document.getElementById('vibixVoiceover').value = video.vibixVoiceover || '';
                document.getElementById('vibixPoster').checked = video.vibixPoster || false;
            } else {
                document.getElementById('sourceType').value = 'iframe';
                document.getElementById('iframeUrl').value = video.sourceUrl || '';
            }

            this.videoData = { ...video };

            // Load episodes if series/anime
            if (video.type === 'series' || video.type === 'anime') {
                const episodes = await db.getEpisodes(videoId);
                this.episodes = episodes;
            }
        } catch (error) {
            console.error('Failed to load video data:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Notification removed - silent operation
        console.log(`${type}: ${message}`);
    }

    // Handle source tab change
    handleSourceTabChange(e) {
        const tab = e.currentTarget;
        const sourceType = tab.dataset.source;

        // Update active tab
        document.querySelectorAll('.source-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.source-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        const targetContent = document.getElementById(`${sourceType}Source`);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block';
        }
        
        // Auto-set type based on source
        this.setTypeBySource(sourceType);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // Auto-determine type based on source
    setTypeBySource(sourceType) {
        const typeInput = document.getElementById('videoType');
        
        // Map source types to video types
        const sourceTypeMap = {
            'balancer': 'balancer',      // Видеобалансер
            'direct': 'direct',          // Прямая ссылка
            'social': 'social',          // Соцсети
            'custom': 'custom'           // Кастомный iframe
        };
        
        typeInput.value = sourceTypeMap[sourceType] || 'balancer';
        this.videoData.type = typeInput.value;
    }

    // Handle balancer type change
    handleBalancerTypeChange(e) {
        const balancerType = e.target.value;

        document.querySelectorAll('.balancer-option').forEach(option => {
            option.style.display = 'none';
        });

        if (balancerType === 'iframe') {
            document.getElementById('iframeBalancer').style.display = 'block';
        } else if (balancerType === 'vibix') {
            document.getElementById('vibixBalancer').style.display = 'block';
        }
    }

    // Handle social platform change
    handleSocialPlatformChange(e) {
        const platform = e.target.value;

        document.querySelectorAll('.social-option').forEach(option => {
            option.style.display = 'none';
        });

        document.getElementById(`${platform}Option`).style.display = 'block';
    }

    // Preview direct video
    previewDirect() {
        const url = document.getElementById('directUrl').value;
        const videoType = document.getElementById('directVideoType').value;
        const preview = document.getElementById('directPreview');

        if (!url) {
            preview.innerHTML = '';
            return;
        }

        preview.innerHTML = `
            <video controls style="width: 100%; max-height: 400px; border-radius: 8px;">
                <source src="${url}" type="${videoType}">
                Ваш браузер не поддерживает видео тег.
            </video>
        `;
    }

    // Preview social media
    previewSocial() {
        const platform = document.getElementById('socialPlatform').value;
        const preview = document.getElementById('socialPreview');
        let embedUrl = '';

        if (platform === 'youtube') {
            let youtubeId = document.getElementById('youtubeId').value.trim();
            if (!youtubeId) {
                preview.innerHTML = '';
                return;
            }

            // Extract ID from URL if full URL provided
            const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
            const match = youtubeId.match(youtubeRegex);
            if (match) {
                youtubeId = match[1];
            }

            embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
        } else if (platform === 'vk') {
            let vkUrl = document.getElementById('vkUrl').value.trim();
            if (!vkUrl) {
                preview.innerHTML = '';
                return;
            }

            // Extract video ID from VK URL
            const vkRegex = /video(-?\d+)_(\d+)/;
            const match = vkUrl.match(vkRegex);
            if (match) {
                embedUrl = `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}`;
            } else {
                embedUrl = vkUrl;
            }
        } else if (platform === 'rutube') {
            let rutubeId = document.getElementById('rutubeId').value.trim();
            if (!rutubeId) {
                preview.innerHTML = '';
                return;
            }

            // Extract ID from URL if full URL provided
            const rutubeRegex = /rutube\.ru\/video\/([a-zA-Z0-9]+)/;
            const match = rutubeId.match(rutubeRegex);
            if (match) {
                rutubeId = match[1];
            }

            embedUrl = `https://rutube.ru/play/embed/${rutubeId}`;
        }

        if (embedUrl) {
            preview.innerHTML = `
                <iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allowfullscreen style="border-radius: 8px;"></iframe>
            `;
        }
    }

    // Preview custom iframe
    previewCustom() {
        const iframeCode = document.getElementById('customIframe').value.trim();
        const preview = document.getElementById('customPreview');

        if (!iframeCode) {
            preview.innerHTML = '';
            return;
        }

        // Sanitize and display
        preview.innerHTML = iframeCode;
    }
}

// Create global instance
const modal = new ModalManager();
window.modal = modal;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    modal.init();
});


// Listen for language changes
window.addEventListener('languageChanged', () => {
    // Update collection select default option
    const collectionSelect = document.getElementById('videoCollection');
    if (collectionSelect && window.i18n) {
        const defaultOption = collectionSelect.querySelector('option[value=""]');
        if (defaultOption) {
            defaultOption.textContent = window.i18n.t('modal.collection.none');
        }
    }
});
