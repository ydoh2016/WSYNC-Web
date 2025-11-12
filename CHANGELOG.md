# Changelog

All notable changes to W Sync will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-11-12

### Added - UX Improvements 🎨

#### User Experience
- **Upload Progress Bar** - Real-time progress with speed and ETA display
- **Fullscreen Subtitles** - Dedicated fullscreen mode for better subtitle reading
  - Press `F` to enter fullscreen
  - Press `ESC` or `F` to exit
  - Larger font size in fullscreen mode
- **Default Dark Mode** - App now starts in dark mode by default
- **Improved Keyboard Shortcuts** - More reliable keyboard control
  - Fixed: Shortcuts now only work when player is loaded
  - Fixed: Shortcuts don't interfere with form inputs
  - Added: Visual feedback for keyboard actions

#### Technical Improvements
- XMLHttpRequest for upload progress tracking
- Better error handling for large file uploads
- Responsive fullscreen design for mobile devices

### Fixed
- Keyboard shortcuts not working reliably
- Shortcuts triggering when typing in input fields
- Progress calculation for large files

## [1.0.0] - 2024-11-12

### Added - Initial Release 🎉

#### Core Features
- WAV audio file upload and playback (up to 2GB)
- VTT subtitle file upload and parsing
- Real-time subtitle synchronization with audio
- Optional image display alongside subtitles
- Responsive web interface

#### Enhanced Features ✨
- **Dark Mode** - Toggle between light and dark themes with localStorage persistence
- **Keyboard Shortcuts** - Full keyboard control for efficient playback
  - Space: Play/Pause
  - Arrow keys: Skip, Volume control
  - M: Mute toggle
- **Playback Speed Control** - Adjust speed from 0.5x to 2x
- **Feedback Button** - Direct link to GitHub Issues for user feedback
- **Modern UI** - Beautiful gradient design with smooth transitions

#### Technical
- FastAPI backend with async file handling
- HTML5 Audio API for playback
- webvtt-py for subtitle parsing
- Docker support for easy deployment
- Comprehensive error handling and validation
- AGPL-3.0 license for strong copyleft protection

#### Documentation
- Complete README with setup instructions
- Deployment guide for multiple platforms (Railway, Render, Fly.io, Docker)
- License information and COPYING guide
- Features documentation
- Branding guidelines
- Integration tests

### Security
- File type validation (WAV, VTT, images only)
- File size limits (2GB max)
- Filename sanitization to prevent directory traversal
- CORS configuration for secure cross-origin requests

---

## Future Releases

### [1.1.0] - Planned

#### Potential Features
- [ ] Subtitle font size customization
- [ ] Subtitle color/background customization
- [ ] Recent files history (localStorage)
- [ ] Subtitle search functionality
- [ ] Export edited subtitles
- [ ] Multiple subtitle track support
- [ ] Playlist functionality

#### Improvements
- [ ] Progressive Web App (PWA) support
- [ ] Offline mode
- [ ] Better mobile experience
- [ ] Analytics integration (privacy-respecting)
- [ ] Performance optimizations

### [2.0.0] - Future

#### AI-Powered Features 🤖
- [ ] **AI Subtitle Translation** - Automatic translation with content filtering
- [ ] **Smart Sync Adjustment** - AI-assisted timing correction
- [ ] **Content Analysis** - Automatic topic detection and tagging
- [ ] **Speech Recognition** - Generate subtitles from audio

#### Major Features
- [ ] User accounts (optional)
- [ ] Cloud storage integration
- [ ] Collaborative editing
- [ ] API for third-party integrations
- [ ] Premium features (ad-free, advanced AI)

---

## Version History

- **1.0.0** (2024-11-12) - Initial release with core features and enhancements

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to W Sync.

## License

This project is licensed under AGPL-3.0 - see [LICENSE](LICENSE) for details.
