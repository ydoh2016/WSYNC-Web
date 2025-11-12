# Integration Tests for Audio Subtitle Viewer

This directory contains comprehensive integration tests for the Audio Subtitle Viewer application.

## Test Coverage

The integration tests cover the following functionality:

### 1. Audio Upload Flow (`TestAudioUploadFlow`)
- Upload valid WAV audio files
- Retrieve uploaded audio files
- Handle invalid audio formats
- Handle non-existent file requests

### 2. Subtitle Upload Flow (`TestSubtitleUploadFlow`)
- Upload valid VTT subtitle files
- Parse and validate subtitle cue structure
- Retrieve parsed subtitle data
- Handle invalid subtitle formats
- Handle empty subtitle files

### 3. Image Upload Flow (`TestImageUploadFlow`)
- Upload valid image files (PNG, JPG)
- Retrieve uploaded image files
- Handle invalid image formats

### 4. Subtitle Synchronization (`TestSubtitleSynchronization`)
- Verify subtitle timing accuracy
- Validate subtitle text content
- Test complex VTT files with various timestamp formats

### 5. Error Handling (`TestErrorHandling`)
- Missing file uploads
- Wrong file extensions
- Malformed VTT files
- Non-existent file deletion

### 6. File Management (`TestFileManagement`)
- Delete uploaded files
- Complete workflow (upload audio, subtitle, and image)

## Running the Tests

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run All Tests

```bash
pytest tests/test_integration.py -v
```

### Run Specific Test Class

```bash
pytest tests/test_integration.py::TestAudioUploadFlow -v
```

### Run Specific Test

```bash
pytest tests/test_integration.py::TestAudioUploadFlow::test_upload_valid_audio_file -v
```

### Run with Coverage

```bash
pytest tests/test_integration.py --cov=backend --cov=main --cov-report=html
```

## Test Fixtures

The tests use the following fixtures defined in `conftest.py`:

- `test_upload_dir`: Temporary directory for file uploads during tests
- `client`: FastAPI test client with mocked upload directory
- `sample_wav_file`: Minimal valid WAV file for testing
- `sample_vtt_file`: Valid VTT subtitle file with 3 cues
- `sample_image_file`: Minimal valid PNG image
- `invalid_vtt_file`: Malformed VTT file for error testing
- `empty_vtt_file`: Empty VTT file for edge case testing

## Test Requirements

All tests verify the following requirements from the specification:

- **Requirement 1.1, 1.2**: Audio file upload and validation
- **Requirement 2.1, 2.2, 2.3**: Subtitle file upload, parsing, and synchronization
- **Requirement 4.1, 4.3**: Optional image file upload and display

## Notes

- Tests use temporary directories that are automatically cleaned up after each test
- The test client patches the upload directory to avoid polluting the actual uploads folder
- All file validation and error handling is tested with real file operations
- Tests verify both successful operations and error conditions
