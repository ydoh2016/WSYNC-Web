# Contributing to W Sync

Thank you for your interest in contributing to W Sync! 🎉

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to make W Sync better.

## How to Contribute

### Reporting Bugs 🐛

1. Check if the bug has already been reported in [Issues](https://github.com/YOUR-USERNAME/w-sync/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Python version)

### Suggesting Features 💡

1. Check [existing feature requests](https://github.com/YOUR-USERNAME/w-sync/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
2. Create a new issue with:
   - Clear use case
   - Why this feature would be useful
   - Possible implementation approach

### Pull Requests 🔧

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/w-sync.git
   cd w-sync
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Set up development environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   pip install pre-commit pytest-cov black flake8
   pre-commit install
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation

5. **Run tests**
   ```bash
   # Run all tests
   pytest tests/ -v
   
   # Run with coverage
   pytest tests/ --cov=backend --cov=main --cov-report=html
   
   # Check code style
   black .
   flake8 .
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

7. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a Pull Request on GitHub with:
   - Clear description of changes
   - Link to related issues
   - Screenshots/GIFs for UI changes

## Development Guidelines

### Python Code Style

- Follow PEP 8
- Use type hints
- Maximum line length: 127 characters
- Use Black for formatting
- Use isort for import sorting

```python
# Good
def upload_file(file: UploadFile, filename: str) -> Path:
    """Upload file to storage."""
    sanitized_name = sanitize_filename(filename)
    return save_file(file, sanitized_name)

# Bad
def upload_file(file,filename):
    sanitized_name=sanitize_filename(filename)
    return save_file(file,sanitized_name)
```

### JavaScript Code Style

- Use ES6+ features
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

```javascript
// Good
/**
 * Toggle play/pause state
 */
togglePlayPause() {
    if (this.audioPlayer.paused) {
        this.audioPlayer.play();
    } else {
        this.audioPlayer.pause();
    }
}

// Bad
function tpp(){if(this.audioPlayer.paused){this.audioPlayer.play()}else{this.audioPlayer.pause()}}
```

### CSS Code Style

- Use CSS variables for theming
- Mobile-first responsive design
- Use meaningful class names
- Group related properties

```css
/* Good */
.upload-btn {
    padding: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    transition: transform 0.2s ease;
}

/* Bad */
.btn{padding:15px;background:#667eea;border-radius:8px}
```

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Test both success and error cases
- Use descriptive test names

```python
# Good
def test_upload_valid_audio_file(client, sample_wav_file):
    """Test uploading a valid WAV audio file."""
    with open(sample_wav_file, 'rb') as f:
        response = client.post("/api/upload/audio", files={"file": f})
    assert response.status_code == 200

# Bad
def test1(client):
    response = client.post("/api/upload/audio")
    assert response.status_code == 200
```

## Project Structure

```
w-sync/
├── backend/              # Backend services
│   ├── file_storage.py   # File upload/storage
│   └── vtt_parser.py     # VTT parsing
├── static/               # Frontend files
│   ├── index.html        # Main HTML
│   ├── style.css         # Styles
│   ├── app.js            # JavaScript
│   └── favicon.svg       # Icon
├── tests/                # Test files
│   ├── conftest.py       # Test fixtures
│   └── test_integration.py
├── main.py               # FastAPI app
├── requirements.txt      # Dependencies
└── README.md             # Documentation
```

## Areas for Contribution

### High Priority
- 🤖 AI translation features
- 📱 Mobile app (React Native/Flutter)
- 🌍 Internationalization (i18n)
- ♿ Accessibility improvements
- 🎨 UI/UX enhancements

### Medium Priority
- 📊 Analytics dashboard
- 🔐 User authentication
- ☁️ Cloud storage integration
- 🎵 Multiple audio format support
- 📝 Subtitle editing features

### Good First Issues
- 📚 Documentation improvements
- 🐛 Bug fixes
- 🧪 Additional tests
- 🎨 CSS improvements
- 🌐 Translations

## Questions?

- 💬 Open a [Discussion](https://github.com/YOUR-USERNAME/w-sync/discussions)
- 🐛 Report bugs in [Issues](https://github.com/YOUR-USERNAME/w-sync/issues)
- 📧 Email: [Your Email]

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.

---

Thank you for contributing to W Sync! 🎵✨
