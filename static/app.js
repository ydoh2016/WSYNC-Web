/**
 * W Sync - WAV Audio & Subtitle Synchronizer
 * Handles audio playback with synchronized subtitle display
 */

class AudioSubtitleViewer {
    constructor() {
        // DOM element references
        this.audioFileInput = document.getElementById('audioFile');
        this.subtitleFileInput = document.getElementById('subtitleFile');
        this.imageFileInput = document.getElementById('imageFile');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.uploadStatus = document.getElementById('uploadStatus');
        this.playerSection = document.getElementById('playerSection');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.subtitleDisplay = document.getElementById('subtitleDisplay');
        this.imageDisplay = document.getElementById('imageDisplay');
        this.imageContainer = document.getElementById('imageContainer');
        this.audioFileName = document.getElementById('audioFileName');
        this.subtitleFileName = document.getElementById('subtitleFileName');
        this.imageFileName = document.getElementById('imageFileName');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.speedControl = document.getElementById('speedControl');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.progressPercent = document.getElementById('progressPercent');
        this.uploadSpeed = document.getElementById('uploadSpeed');
        this.uploadETA = document.getElementById('uploadETA');
        this.subtitleContainer = document.getElementById('subtitleContainer');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        // Application state
        this.subtitles = [];
        this.currentAudioFilename = null;
        this.currentSubtitleFilename = null;
        this.currentImageFilename = null;
        this.uploadStartTime = null;
        this.uploadedBytes = 0;
        this.isFullscreen = false;
        
        // Initialize features
        this.initializeDarkMode();
        this.initializeEventListeners();
        this.initializeKeyboardShortcuts();
    }
    
    /**
     * Initialize dark mode from localStorage (default: dark mode)
     */
    initializeDarkMode() {
        // Default to dark mode if no preference is saved
        const savedPreference = localStorage.getItem('darkMode');
        const isDarkMode = savedPreference === null ? true : savedPreference === 'true';
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            this.updateDarkModeIcon(true);
        }
    }
    
    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        this.updateDarkModeIcon(isDarkMode);
    }
    
    /**
     * Update dark mode toggle icon
     */
    updateDarkModeIcon(isDarkMode) {
        const sunIcon = this.darkModeToggle.querySelector('.icon-sun');
        const moonIcon = this.darkModeToggle.querySelector('.icon-moon');
        
        if (isDarkMode) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline';
        } else {
            sunIcon.style.display = 'inline';
            moonIcon.style.display = 'none';
        }
    }
    
    /**
     * Initialize keyboard shortcuts
     */
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when player is visible and audio is loaded
            if (this.playerSection.style.display === 'none') return;
            if (!this.audioPlayer.src) return;
            
            // Don't handle shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.tagName === 'SELECT') return;
            
            // Don't handle if any modifier key is pressed (Ctrl, Alt, Cmd)
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            
            let handled = false;
            
            switch(e.key) {
                case ' ':
                case 'Spacebar':
                    e.preventDefault();
                    this.togglePlayPause();
                    handled = true;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.skipBackward();
                    handled = true;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.skipForward();
                    handled = true;
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.increaseVolume();
                    handled = true;
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.decreaseVolume();
                    handled = true;
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    this.toggleMute();
                    handled = true;
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    handled = true;
                    break;
            }
            
            if (handled) {
                // Visual feedback
                this.showKeyboardFeedback(e.key);
            }
        });
    }
    
    /**
     * Show visual feedback for keyboard shortcuts
     */
    showKeyboardFeedback(key) {
        // Optional: Add visual feedback when keyboard shortcuts are used
        // This helps users know their input was registered
    }
    
    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
        } else {
            this.audioPlayer.pause();
        }
    }
    
    /**
     * Skip backward 5 seconds
     */
    skipBackward() {
        this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - 5);
    }
    
    /**
     * Skip forward 5 seconds
     */
    skipForward() {
        this.audioPlayer.currentTime = Math.min(
            this.audioPlayer.duration, 
            this.audioPlayer.currentTime + 5
        );
    }
    
    /**
     * Increase volume by 10%
     */
    increaseVolume() {
        this.audioPlayer.volume = Math.min(1, this.audioPlayer.volume + 0.1);
    }
    
    /**
     * Decrease volume by 10%
     */
    decreaseVolume() {
        this.audioPlayer.volume = Math.max(0, this.audioPlayer.volume - 0.1);
    }
    
    /**
     * Toggle mute
     */
    toggleMute() {
        this.audioPlayer.muted = !this.audioPlayer.muted;
    }
    
    /**
     * Toggle fullscreen mode for subtitles
     */
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        
        if (this.isFullscreen) {
            this.subtitleContainer.classList.add('fullscreen');
            this.fullscreenBtn.innerHTML = '<span class="fullscreen-icon">✕</span>';
            this.fullscreenBtn.title = '전체화면 종료 (F 또는 ESC)';
        } else {
            this.subtitleContainer.classList.remove('fullscreen');
            this.fullscreenBtn.innerHTML = '<span class="fullscreen-icon">⛶</span>';
            this.fullscreenBtn.title = '전체화면 (F)';
        }
    }
    
    /**
     * Set up event listeners for file upload and audio playback
     * Requirements: 1.3, 2.3, 3.1
     */
    initializeEventListeners() {
        // File input change listeners to show selected filenames
        this.audioFileInput.addEventListener('change', (e) => {
            this.audioFileName.textContent = e.target.files[0]?.name || 'No file selected';
        });
        
        this.subtitleFileInput.addEventListener('change', (e) => {
            this.subtitleFileName.textContent = e.target.files[0]?.name || 'No file selected';
        });
        
        this.imageFileInput.addEventListener('change', (e) => {
            this.imageFileName.textContent = e.target.files[0]?.name || 'No file selected';
        });
        
        // Upload button click listener
        this.uploadBtn.addEventListener('click', () => this.handleUpload());
        
        // Dark mode toggle listener
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        
        // Speed control listener
        this.speedControl.addEventListener('change', (e) => {
            this.audioPlayer.playbackRate = parseFloat(e.target.value);
        });
        
        // Fullscreen button listener
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // ESC key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
        });
        
        // Audio player time update listener for subtitle synchronization
        this.audioPlayer.addEventListener('timeupdate', () => this.updateSubtitle());
        
        // Audio player seek listener to update subtitle when user seeks
        this.audioPlayer.addEventListener('seeked', () => this.updateSubtitle());
        
        // Audio player ended listener
        this.audioPlayer.addEventListener('ended', () => {
            this.subtitleDisplay.textContent = '';
        });
        
        // Audio player error listener
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            let errorMsg = '오디오 재생 중 오류가 발생했습니다';
            
            if (this.audioPlayer.error) {
                switch (this.audioPlayer.error.code) {
                    case MediaError.MEDIA_ERR_ABORTED:
                        errorMsg = '오디오 로드가 중단되었습니다';
                        break;
                    case MediaError.MEDIA_ERR_NETWORK:
                        errorMsg = '네트워크 오류로 오디오를 로드할 수 없습니다';
                        break;
                    case MediaError.MEDIA_ERR_DECODE:
                        errorMsg = '오디오 파일이 손상되었거나 지원되지 않는 형식입니다';
                        break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMsg = '오디오 형식이 지원되지 않습니다';
                        break;
                }
            }
            
            this.showStatus('error', errorMsg);
        });
    }
    
    /**
     * Handle file upload process
     * Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 4.3, 4.4, 4.5
     */
    async handleUpload() {
        // Validate that required files are selected
        const audioFile = this.audioFileInput.files[0];
        const subtitleFile = this.subtitleFileInput.files[0];
        const imageFile = this.imageFileInput.files[0];
        
        // Validate required files
        if (!audioFile || !subtitleFile) {
            this.showStatus('error', '오디오 파일과 자막 파일을 모두 선택해주세요');
            return;
        }
        
        // Validate file types on client side
        if (!audioFile.name.toLowerCase().endsWith('.wav')) {
            this.showStatus('error', 'WAV 형식의 오디오 파일만 업로드 가능합니다');
            return;
        }
        
        if (!subtitleFile.name.toLowerCase().endsWith('.vtt')) {
            this.showStatus('error', 'VTT 형식의 자막 파일만 업로드 가능합니다');
            return;
        }
        
        // Validate audio file size (client-side check)
        const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
        if (audioFile.size > maxSize) {
            this.showStatus('error', '오디오 파일 크기가 너무 큽니다 (최대 2GB)');
            return;
        }
        
        // Validate subtitle file is not empty
        if (subtitleFile.size === 0) {
            this.showStatus('error', '자막 파일이 비어있습니다');
            return;
        }
        
        // Validate image file if provided
        if (imageFile) {
            const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const imageExt = imageFile.name.toLowerCase().match(/\.[^.]+$/)?.[0];
            if (!imageExt || !validImageExtensions.includes(imageExt)) {
                this.showStatus('error', '지원되는 이미지 형식: JPG, PNG, GIF, WebP');
                return;
            }
            
            // Validate image file size
            if (imageFile.size > maxSize) {
                this.showStatus('error', '이미지 파일 크기가 너무 큽니다 (최대 2GB)');
                return;
            }
            
            // Validate image file is not empty
            if (imageFile.size === 0) {
                this.showStatus('error', '이미지 파일이 비어있습니다');
                return;
            }
        }
        
        // Disable upload button and inputs during upload
        this.uploadBtn.disabled = true;
        this.audioFileInput.disabled = true;
        this.subtitleFileInput.disabled = true;
        this.imageFileInput.disabled = true;
        this.setLoadingState(true);
        
        try {
            // Upload audio file
            this.showStatus('loading', '오디오 파일 업로드 중...');
            await this.uploadAudio(audioFile);
            
            // Upload subtitle file
            this.showStatus('loading', '자막 파일 업로드 중...');
            await this.uploadSubtitle(subtitleFile);
            
            // Upload image file if selected
            if (imageFile) {
                this.showStatus('loading', '이미지 파일 업로드 중...');
                await this.uploadImage(imageFile);
            } else {
                // Hide image container if no image
                this.imageContainer.style.display = 'none';
            }
            
            // Show success message
            this.showStatus('success', '파일 업로드 완료! 재생을 시작하세요');
            
            // Display player section
            this.playerSection.style.display = 'block';
            
            // Scroll to player section
            this.playerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            // Display detailed error message
            const errorMessage = error.message || '파일 업로드 중 오류가 발생했습니다';
            this.showStatus('error', errorMessage);
            console.error('Upload error:', error);
            
            // Clean up on error - hide player if it was shown
            this.playerSection.style.display = 'none';
            
        } finally {
            // Re-enable upload button and inputs
            this.uploadBtn.disabled = false;
            this.audioFileInput.disabled = false;
            this.subtitleFileInput.disabled = false;
            this.imageFileInput.disabled = false;
            this.setLoadingState(false);
        }
    }
    
    /**
     * Upload audio file via fetch API with progress tracking
     * Requirements: 1.1, 1.2
     */
    async uploadAudio(file) {
        return this.uploadFileWithProgress(file, '/api/upload/audio', 'Audio');
    }
    
    /**
     * Generic file upload with progress tracking
     */
    async uploadFileWithProgress(file, endpoint, fileType) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Show progress bar
        this.uploadProgress.style.display = 'block';
        this.progressText.textContent = `Uploading ${fileType}...`;
        this.uploadStartTime = Date.now();
        this.uploadedBytes = 0;
        
        try {
            // Use XMLHttpRequest for progress tracking
            const response = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        this.updateProgress(percentComplete, e.loaded, e.total);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve({
                            ok: true,
                            status: xhr.status,
                            json: () => Promise.resolve(JSON.parse(xhr.responseText))
                        });
                    } else {
                        resolve({
                            ok: false,
                            status: xhr.status,
                            json: () => Promise.resolve(JSON.parse(xhr.responseText))
                        });
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });
                
                xhr.open('POST', endpoint);
                xhr.send(formData);
            });
            
            // Hide progress bar
            this.uploadProgress.style.display = 'none';
            
            if (!response.ok) {
                let errorMessage = `${fileType} upload failed`;
                try {
                    const error = await response.json();
                    errorMessage = error.detail || errorMessage;
                } catch (e) {
                    if (response.status === 413) {
                        errorMessage = `${fileType} file size too large`;
                    } else if (response.status === 500) {
                        errorMessage = 'Server error. Please try again later';
                    } else {
                        errorMessage = `${errorMessage} (${response.status})`;
                    }
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            
            // Handle audio-specific logic
            if (endpoint.includes('/audio')) {
                this.currentAudioFilename = data.filename;
                this.audioPlayer.src = `/api/files/audio/${data.filename}`;
                this.audioPlayer.load();
                
                this.audioPlayer.onerror = () => {
                    throw new Error('Failed to load audio file');
                };
            }
            
            return data;
            
        } catch (error) {
            this.uploadProgress.style.display = 'none';
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Check your network connection');
            }
            throw error;
        }
    }
    
    /**
     * Update progress bar
     */
    updateProgress(percent, loaded, total) {
        // Update progress bar
        this.progressBar.style.width = `${percent}%`;
        this.progressPercent.textContent = `${Math.round(percent)}%`;
        
        // Calculate upload speed
        const elapsed = (Date.now() - this.uploadStartTime) / 1000; // seconds
        const speed = loaded / elapsed; // bytes per second
        const speedMB = (speed / (1024 * 1024)).toFixed(2); // MB/s
        this.uploadSpeed.textContent = `${speedMB} MB/s`;
        
        // Calculate ETA
        const remaining = total - loaded;
        const eta = remaining / speed; // seconds
        if (eta < 60) {
            this.uploadETA.textContent = `${Math.round(eta)}s remaining`;
        } else {
            const minutes = Math.floor(eta / 60);
            const seconds = Math.round(eta % 60);
            this.uploadETA.textContent = `${minutes}m ${seconds}s remaining`;
        }
    }
    
    /**
     * Original upload audio (kept for compatibility, now uses progress version)
     */
    async _uploadAudioOld(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload/audio', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                let errorMessage = '오디오 파일 업로드 실패';
                try {
                    const error = await response.json();
                    errorMessage = error.detail || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    if (response.status === 413) {
                        errorMessage = '오디오 파일 크기가 너무 큽니다';
                    } else if (response.status === 500) {
                        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
                    } else {
                        errorMessage = `${errorMessage} (${response.status})`;
                    }
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            this.currentAudioFilename = data.filename;
            
            // Set audio source
            this.audioPlayer.src = `/api/files/audio/${data.filename}`;
            this.audioPlayer.load();
            
            // Add error handler for audio loading
            this.audioPlayer.onerror = () => {
                throw new Error('오디오 파일을 로드할 수 없습니다. 파일이 손상되었을 수 있습니다');
            };
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요');
            }
            throw error;
        }
    }
    
    /**
     * Upload subtitle file via fetch API with progress
     * Requirements: 2.1, 2.2
     */
    async uploadSubtitle(file) {
        const data = await this.uploadFileWithProgress(file, '/api/upload/subtitle', 'Subtitle');
        
        this.currentSubtitleFilename = data.filename;
        this.subtitles = data.cues;
        
        if (!this.subtitles || this.subtitles.length === 0) {
            throw new Error('Subtitle file contains no valid subtitles');
        }
        
        return data;
    }
    
    /**
     * Original upload subtitle (kept for reference)
     */
    async _uploadSubtitleOld(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload/subtitle', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                let errorMessage = '자막 파일 업로드 실패';
                try {
                    const error = await response.json();
                    errorMessage = error.detail || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    if (response.status === 400) {
                        errorMessage = '올바른 VTT 자막 파일이 아닙니다';
                    } else if (response.status === 500) {
                        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
                    } else {
                        errorMessage = `${errorMessage} (${response.status})`;
                    }
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            this.currentSubtitleFilename = data.filename;
            
            // Store parsed subtitle cues
            this.subtitles = data.cues;
            
            // Validate that we have subtitles
            if (!this.subtitles || this.subtitles.length === 0) {
                throw new Error('자막 파일에 유효한 자막이 없습니다');
            }
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요');
            }
            throw error;
        }
    }
    
    /**
     * Upload optional image file via fetch API with progress
     * Requirements: 4.1, 4.3, 4.4, 4.5
     */
    async uploadImage(file) {
        const data = await this.uploadFileWithProgress(file, '/api/upload/image', 'Image');
        
        this.currentImageFilename = data.filename;
        this.imageDisplay.src = data.url;
        this.imageContainer.style.display = 'flex';
        
        this.imageDisplay.onerror = () => {
            this.imageContainer.style.display = 'none';
            console.warn('Failed to load image');
        };
        
        return data;
    }
    
    /**
     * Original upload image (kept for reference)
     */
    async _uploadImageOld(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                let errorMessage = '이미지 파일 업로드 실패';
                try {
                    const error = await response.json();
                    errorMessage = error.detail || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    if (response.status === 400) {
                        errorMessage = '올바른 이미지 파일이 아닙니다';
                    } else if (response.status === 413) {
                        errorMessage = '이미지 파일 크기가 너무 큽니다';
                    } else if (response.status === 500) {
                        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
                    } else {
                        errorMessage = `${errorMessage} (${response.status})`;
                    }
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            this.currentImageFilename = data.filename;
            
            // Display image
            this.imageDisplay.src = data.url;
            this.imageContainer.style.display = 'flex';
            
            // Add error handler for image loading
            this.imageDisplay.onerror = () => {
                this.imageContainer.style.display = 'none';
                console.warn('이미지를 로드할 수 없습니다');
            };
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요');
            }
            throw error;
        }
    }
    
    /**
     * Update subtitle display based on current playback time
     * Requirements: 2.3, 2.4, 2.5
     */
    updateSubtitle() {
        const currentTime = this.audioPlayer.currentTime;
        const activeCue = this.findActiveCue(currentTime);
        
        if (activeCue) {
            this.subtitleDisplay.textContent = activeCue.text;
        } else {
            // Handle cases where no subtitle matches current time
            this.subtitleDisplay.textContent = '';
        }
    }
    
    /**
     * Find active subtitle cue based on current playback time
     * Requirements: 2.3, 2.4, 2.5
     */
    findActiveCue(time) {
        return this.subtitles.find(cue => 
            cue.start <= time && time < cue.end
        );
    }
    
    /**
     * Show status message to user
     */
    showStatus(type, message) {
        this.uploadStatus.className = `upload-status ${type}`;
        
        // Add loading spinner for loading state
        if (type === 'loading') {
            this.uploadStatus.innerHTML = `${message} <span class="loading-spinner"></span>`;
        } else {
            this.uploadStatus.textContent = message;
        }
        
        this.uploadStatus.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.uploadStatus.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * Set loading state for upload button
     */
    setLoadingState(isLoading) {
        if (isLoading) {
            this.uploadBtn.classList.add('loading');
            this.uploadBtn.innerHTML = '업로드 중... <span class="loading-spinner"></span>';
        } else {
            this.uploadBtn.classList.remove('loading');
            this.uploadBtn.textContent = 'Upload Files';
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AudioSubtitleViewer();
    console.log('W Sync initialized');
});
