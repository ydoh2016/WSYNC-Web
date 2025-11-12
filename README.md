# 🎵 W Sync

**WAV Audio & Subtitle Synchronizer**

> Sync your audio with subtitles in perfect harmony 🎵

A powerful, lightweight web application for synchronizing and playing WAV audio files with VTT subtitle files. Perfect for language learning, transcription work, and audio content creation.

[![CI](https://github.com/YOUR-USERNAME/w-sync/workflows/CI/badge.svg)](https://github.com/YOUR-USERNAME/w-sync/actions)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/tests-25%20passed-success.svg)](tests/)

## Features

### Core Features
- 📁 Upload WAV audio files (up to 2GB)
- 📝 Upload VTT subtitle files with automatic parsing
- 🖼️ Optional image display alongside subtitles
- ▶️ HTML5 audio player with standard controls
- 🔄 Real-time subtitle synchronization
- 🎨 Clean, responsive UI
- 🐳 Docker support for easy deployment

### Enhanced Features ✨
- **🌓 Dark Mode** - Default dark theme with toggle (preference saved locally)
- **⌨️ Keyboard Shortcuts** - Full keyboard control for efficient playback
  - `Space` - Play/Pause
  - `←` / `→` - Skip backward/forward 5 seconds
  - `↑` / `↓` - Volume up/down
  - `M` - Mute/Unmute
  - `F` - Fullscreen subtitles
  - `ESC` - Exit fullscreen
- **⚡ Playback Speed Control** - Adjust speed from 0.5x to 2x (perfect for language learning!)
- **📊 Upload Progress** - Real-time progress bar with speed and ETA
- **🖥️ Fullscreen Subtitles** - Focus mode for better reading
- **💬 Feedback Button** - Send feedback directly via GitHub
- **🎯 Modern UI** - Beautiful gradient design with smooth transitions

## 🎬 Demo

Try it live: [Coming Soon]

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Start the application
docker-compose up

# Access at http://localhost:8000
```

### Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn main:app --reload --port 8000

# Access at http://localhost:8000
```

## Usage

1. **Upload Files**
   - Select a WAV audio file
   - Select a VTT subtitle file
   - Optionally select an image file (JPG, PNG, GIF, WebP)
   - Click "Upload Files"

2. **Play Audio**
   - Use the audio player controls to play/pause
   - Subtitles will automatically sync with the audio
   - Use the seek bar to navigate through the audio
   - **Keyboard shortcuts available!** (see Features section)

3. **Customize Experience**
   - Toggle dark mode with the 🌙 button (top right)
   - Adjust playback speed (0.5x - 2x) for language learning
   - Use keyboard shortcuts for efficient control

4. **View Content**
   - Subtitles display below the audio player
   - If an image was uploaded, it displays alongside subtitles

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:

- 🚂 Railway (Easiest)
- 🎨 Render
- ✈️ Fly.io
- 🐳 Docker

## Configuration

Environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MAX_UPLOAD_SIZE` | Maximum file upload size in bytes | `2147483648` (2GB) |
| `UPLOAD_TIMEOUT` | Upload timeout in seconds | `300` (5 minutes) |
| `ENVIRONMENT` | Environment mode | `production` |
| `PORT` | Port to run on | `8000` |

## Why W Sync?

- 🎯 **Simple & Focused** - Does one thing and does it well
- 🚀 **Fast & Lightweight** - No heavy frameworks, pure performance
- 🌐 **Works Everywhere** - Just a web browser needed
- 🎓 **Perfect for Learning** - Ideal for language learners and students
- 🤖 **AI-Powered** - Smart features coming soon
- 💰 **Free & Open Source** - AGPL-3.0 licensed

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTML5 + CSS + Vanilla JavaScript
- **Audio**: HTML5 Audio API
- **Subtitle Parsing**: webvtt-py

## Project Structure

```
.
├── backend/
│   ├── file_storage.py      # File upload and storage service
│   └── vtt_parser.py         # VTT subtitle parser
├── static/
│   ├── index.html            # Frontend HTML
│   ├── style.css             # Styles
│   ├── app.js                # Frontend JavaScript
│   └── favicon.svg           # App icon
├── uploads/                  # Uploaded files directory
├── main.py                   # FastAPI application
├── requirements.txt          # Python dependencies
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
└── DEPLOYMENT.md             # Deployment guide

```

## Requirements

- Python 3.10+
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Development

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run with hot-reload
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `POST /api/upload/audio` - Upload audio file
- `POST /api/upload/subtitle` - Upload subtitle file
- `POST /api/upload/image` - Upload image file
- `GET /api/files/audio/{filename}` - Stream audio file
- `GET /api/files/subtitle/{filename}` - Get parsed subtitles
- `GET /api/files/image/{filename}` - Serve image file
- `DELETE /api/files/{filename}` - Delete file

## License

**AGPL-3.0** - see [LICENSE](LICENSE) file for details.

### What does this mean?

- ✅ **Free to use** for personal and educational purposes
- ✅ **Free to modify** and improve
- ✅ **Must share** - If you run this as a web service, you must make your source code available
- ✅ **Attribution required** - Keep the original author credits
- 💼 **Commercial license available** - Contact for commercial use without AGPL restrictions

This strong copyleft license ensures that improvements to this project benefit the entire community, while preventing unauthorized commercial exploitation.

### Why AGPL-3.0?

This license protects against someone simply copying this code and running a competing service without contributing back to the community. If you use this code for a web service, you must share your modifications.

**⚠️ Important for Commercial Users:**
If you want to run this as a service without sharing your source code, you need a commercial license. Contact the author for licensing options.

See [COPYING.md](COPYING.md) for detailed license information and examples.

## Roadmap 🗺️

### Coming Soon
- 🤖 **AI-Powered Translation** - Automatic subtitle translation with content filtering
- 🎯 **Smart Subtitle Sync** - AI-assisted timing adjustment
- 📊 **Usage Analytics** - Understand how you use W Sync

### Future Plans
- Multiple subtitle track support
- Playlist functionality
- User accounts (optional)
- Cloud storage integration
- Mobile app
