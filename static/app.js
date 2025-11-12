/**
 * Audio Subtitle Viewer Application
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
        
        // Application state
        this.subtitles = [];
        this.currentAudioFilename = null;
        this.currentSubtitleFilename = null;
        this.currentImageFilename = null;
        
        // Initialize features
        this.initializeDarkMode();
        this.initializeEventListeners();
        this.initializeKeyboardShortcuts();
    }
    
    /**
     * Initialize dark mode from localStorage
     */
    initializeDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
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
            // Only handle shortcuts when player is visible
            if (this.playerSection.style.display === 'none') return;
            
            // Don't handle shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case ' ':
                case 'Spacebar':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.skipBackward();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.skipForward();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.increaseVolume();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.decreaseVolume();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    this.toggleMute();
                    break;
            }
        });
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
     * Upload audio file via fetch API
     * Requirements: 1.1, 1.2
     */
    async uploadAudio(file) {
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
     * Upload subtitle file via fetch API
     * Requirements: 2.1, 2.2
     */
    async uploadSubtitle(file) {
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
     * Upload optional image file via fetch API
     * Requirements: 4.1, 4.3, 4.4, 4.5
     */
    async uploadImage(file) {
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
    console.log('Audio Subtitle Viewer initialized');
});
