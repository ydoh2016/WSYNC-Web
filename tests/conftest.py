"""Pytest configuration and fixtures for integration tests."""

import pytest
import os
import shutil
from pathlib import Path
from fastapi.testclient import TestClient
from main import app
from backend.file_storage import FileStorageService


@pytest.fixture(scope="function")
def test_upload_dir(tmp_path):
    """Create a temporary upload directory for tests."""
    upload_dir = tmp_path / "test_uploads"
    upload_dir.mkdir()
    yield upload_dir
    # Cleanup after test
    if upload_dir.exists():
        shutil.rmtree(upload_dir)


@pytest.fixture(scope="function")
def client(test_upload_dir, monkeypatch):
    """Create a test client with temporary upload directory."""
    # Patch the upload directory in the app
    from main import file_storage
    monkeypatch.setattr(file_storage, "upload_dir", test_upload_dir)
    
    # Create test client without context manager for compatibility
    test_client = TestClient(app)
    yield test_client
    # Cleanup is handled automatically by TestClient


@pytest.fixture
def sample_wav_file(tmp_path):
    """Create a minimal valid WAV file for testing."""
    wav_path = tmp_path / "test_audio.wav"
    
    # Create a minimal WAV file (44 bytes header + 1 sample)
    # RIFF header
    wav_data = b'RIFF'
    wav_data += (36).to_bytes(4, 'little')  # File size - 8
    wav_data += b'WAVE'
    
    # fmt chunk
    wav_data += b'fmt '
    wav_data += (16).to_bytes(4, 'little')  # fmt chunk size
    wav_data += (1).to_bytes(2, 'little')   # Audio format (PCM)
    wav_data += (1).to_bytes(2, 'little')   # Number of channels
    wav_data += (44100).to_bytes(4, 'little')  # Sample rate
    wav_data += (88200).to_bytes(4, 'little')  # Byte rate
    wav_data += (2).to_bytes(2, 'little')   # Block align
    wav_data += (16).to_bytes(2, 'little')  # Bits per sample
    
    # data chunk
    wav_data += b'data'
    wav_data += (0).to_bytes(4, 'little')   # Data size
    
    wav_path.write_bytes(wav_data)
    return wav_path


@pytest.fixture
def sample_vtt_file(tmp_path):
    """Create a valid VTT subtitle file for testing."""
    vtt_path = tmp_path / "test_subtitle.vtt"
    vtt_content = """WEBVTT

00:00:00.000 --> 00:00:02.000
First subtitle line

00:00:02.000 --> 00:00:05.000
Second subtitle line

00:00:05.000 --> 00:00:08.000
Third subtitle line
"""
    vtt_path.write_text(vtt_content)
    return vtt_path


@pytest.fixture
def sample_image_file(tmp_path):
    """Create a minimal valid PNG image for testing."""
    png_path = tmp_path / "test_image.png"
    
    # Minimal 1x1 PNG image (67 bytes)
    png_data = (
        b'\x89PNG\r\n\x1a\n'  # PNG signature
        b'\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
        b'\x08\x02\x00\x00\x00\x90wS\xde'  # IHDR chunk
        b'\x00\x00\x00\x0cIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01'
        b'\r\n-\xb4'  # IDAT chunk
        b'\x00\x00\x00\x00IEND\xaeB`\x82'  # IEND chunk
    )
    
    png_path.write_bytes(png_data)
    return png_path


@pytest.fixture
def invalid_vtt_file(tmp_path):
    """Create an invalid VTT file for testing error handling."""
    vtt_path = tmp_path / "invalid.vtt"
    vtt_content = """This is not a valid VTT file
Just some random text
"""
    vtt_path.write_text(vtt_content)
    return vtt_path


@pytest.fixture
def empty_vtt_file(tmp_path):
    """Create an empty VTT file for testing."""
    vtt_path = tmp_path / "empty.vtt"
    vtt_content = """WEBVTT

"""
    vtt_path.write_text(vtt_content)
    return vtt_path
