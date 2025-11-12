"""Integration tests for Audio Subtitle Viewer API endpoints."""

import pytest
from io import BytesIO


class TestAudioUploadFlow:
    """Test audio file upload and retrieval flow."""
    
    def test_upload_valid_audio_file(self, client, sample_wav_file):
        """Test uploading a valid WAV audio file."""
        with open(sample_wav_file, 'rb') as f:
            response = client.post(
                "/api/upload/audio",
                files={"file": ("test_audio.wav", f, "audio/wav")}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "filename" in data
        assert "size" in data
        assert data["filename"] == "test_audio.wav"
        assert data["size"] > 0
    
    def test_retrieve_uploaded_audio_file(self, client, sample_wav_file):
        """Test retrieving an uploaded audio file."""
        # First upload the file
        with open(sample_wav_file, 'rb') as f:
            upload_response = client.post(
                "/api/upload/audio",
                files={"file": ("test_audio.wav", f, "audio/wav")}
            )
        
        assert upload_response.status_code == 200
        filename = upload_response.json()["filename"]
        
        # Then retrieve it
        get_response = client.get(f"/api/files/audio/{filename}")
        assert get_response.status_code == 200
        assert get_response.headers["content-type"] == "audio/wav"
        assert len(get_response.content) > 0
    
    def test_upload_invalid_audio_format(self, client, tmp_path):
        """Test uploading a non-WAV file as audio."""
        # Create a text file
        txt_file = tmp_path / "not_audio.txt"
        txt_file.write_text("This is not an audio file")
        
        with open(txt_file, 'rb') as f:
            response = client.post(
                "/api/upload/audio",
                files={"file": ("not_audio.txt", f, "text/plain")}
            )
        
        assert response.status_code == 400
        assert "WAV" in response.json()["detail"]
    
    def test_retrieve_nonexistent_audio_file(self, client):
        """Test retrieving a file that doesn't exist."""
        response = client.get("/api/files/audio/nonexistent.wav")
        assert response.status_code == 404


class TestSubtitleUploadFlow:
    """Test subtitle file upload and parsing flow."""
    
    def test_upload_valid_subtitle_file(self, client, sample_vtt_file):
        """Test uploading a valid VTT subtitle file."""
        with open(sample_vtt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("test_subtitle.vtt", f, "text/vtt")}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "filename" in data
        assert "cues" in data
        assert data["filename"] == "test_subtitle.vtt"
        assert len(data["cues"]) == 3  # Sample file has 3 cues
    
    def test_subtitle_cues_structure(self, client, sample_vtt_file):
        """Test that parsed subtitle cues have correct structure."""
        with open(sample_vtt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("test_subtitle.vtt", f, "text/vtt")}
            )
        
        assert response.status_code == 200
        cues = response.json()["cues"]
        
        # Check first cue
        assert cues[0]["start"] == 0.0
        assert cues[0]["end"] == 2.0
        assert cues[0]["text"] == "First subtitle line"
        
        # Check second cue
        assert cues[1]["start"] == 2.0
        assert cues[1]["end"] == 5.0
        assert cues[1]["text"] == "Second subtitle line"
        
        # Check third cue
        assert cues[2]["start"] == 5.0
        assert cues[2]["end"] == 8.0
        assert cues[2]["text"] == "Third subtitle line"
    
    def test_retrieve_parsed_subtitle_data(self, client, sample_vtt_file):
        """Test retrieving parsed subtitle data."""
        # First upload the file
        with open(sample_vtt_file, 'rb') as f:
            upload_response = client.post(
                "/api/upload/subtitle",
                files={"file": ("test_subtitle.vtt", f, "text/vtt")}
            )
        
        assert upload_response.status_code == 200
        filename = upload_response.json()["filename"]
        
        # Then retrieve parsed data
        get_response = client.get(f"/api/files/subtitle/{filename}")
        assert get_response.status_code == 200
        data = get_response.json()
        assert "cues" in data
        assert len(data["cues"]) == 3
    
    def test_upload_invalid_subtitle_format(self, client, tmp_path):
        """Test uploading a non-VTT file as subtitle."""
        # Create a text file
        txt_file = tmp_path / "not_subtitle.txt"
        txt_file.write_text("This is not a subtitle file")
        
        with open(txt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("not_subtitle.txt", f, "text/plain")}
            )
        
        assert response.status_code == 400
        assert "VTT" in response.json()["detail"]
    
    def test_upload_empty_subtitle_file(self, client, empty_vtt_file):
        """Test uploading an empty VTT file."""
        with open(empty_vtt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("empty.vtt", f, "text/vtt")}
            )
        
        # Empty VTT files may return 400 or 500 depending on parsing behavior
        assert response.status_code in [400, 500]
        detail = response.json()["detail"]
        # Check for error message (empty file, parsing error, or generic error)
        assert "비어있습니다" in detail or "파싱" in detail or "VTT" in detail or "오류" in detail


class TestImageUploadFlow:
    """Test optional image file upload and display flow."""
    
    def test_upload_valid_image_file(self, client, sample_image_file):
        """Test uploading a valid PNG image file."""
        with open(sample_image_file, 'rb') as f:
            response = client.post(
                "/api/upload/image",
                files={"file": ("test_image.png", f, "image/png")}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "filename" in data
        assert "url" in data
        assert data["filename"] == "test_image.png"
        assert "/api/files/image/" in data["url"]
    
    def test_retrieve_uploaded_image_file(self, client, sample_image_file):
        """Test retrieving an uploaded image file."""
        # First upload the file
        with open(sample_image_file, 'rb') as f:
            upload_response = client.post(
                "/api/upload/image",
                files={"file": ("test_image.png", f, "image/png")}
            )
        
        assert upload_response.status_code == 200
        filename = upload_response.json()["filename"]
        
        # Then retrieve it
        get_response = client.get(f"/api/files/image/{filename}")
        assert get_response.status_code == 200
        assert "image" in get_response.headers["content-type"]
        assert len(get_response.content) > 0
    
    def test_upload_jpg_image(self, client, tmp_path):
        """Test uploading a JPG image file."""
        # Create a minimal JPEG file
        jpg_file = tmp_path / "test.jpg"
        # Minimal JPEG header
        jpg_data = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xd9'
        jpg_file.write_bytes(jpg_data)
        
        with open(jpg_file, 'rb') as f:
            response = client.post(
                "/api/upload/image",
                files={"file": ("test.jpg", f, "image/jpeg")}
            )
        
        assert response.status_code == 200
        assert response.json()["filename"] == "test.jpg"
    
    def test_upload_invalid_image_format(self, client, tmp_path):
        """Test uploading a non-image file as image."""
        # Create a text file
        txt_file = tmp_path / "not_image.txt"
        txt_file.write_text("This is not an image")
        
        with open(txt_file, 'rb') as f:
            response = client.post(
                "/api/upload/image",
                files={"file": ("not_image.txt", f, "text/plain")}
            )
        
        assert response.status_code == 400
        assert "이미지" in response.json()["detail"]


class TestSubtitleSynchronization:
    """Test subtitle synchronization logic."""
    
    def test_subtitle_timing_accuracy(self, client, sample_vtt_file):
        """Test that subtitle timing is accurately parsed."""
        with open(sample_vtt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("test_subtitle.vtt", f, "text/vtt")}
            )
        
        cues = response.json()["cues"]
        
        # Verify timing boundaries
        assert cues[0]["start"] == 0.0
        assert cues[0]["end"] == 2.0
        assert cues[1]["start"] == 2.0  # Should start exactly when previous ends
        assert cues[1]["end"] == 5.0
        assert cues[2]["start"] == 5.0
        assert cues[2]["end"] == 8.0
    
    def test_subtitle_text_content(self, client, sample_vtt_file):
        """Test that subtitle text is correctly extracted."""
        with open(sample_vtt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("test_subtitle.vtt", f, "text/vtt")}
            )
        
        cues = response.json()["cues"]
        
        # Verify text content
        assert "First subtitle line" in cues[0]["text"]
        assert "Second subtitle line" in cues[1]["text"]
        assert "Third subtitle line" in cues[2]["text"]
    
    def test_complex_vtt_with_timestamps(self, client, tmp_path):
        """Test VTT file with various timestamp formats."""
        vtt_file = tmp_path / "complex.vtt"
        vtt_content = """WEBVTT

00:00.500 --> 00:02.500
Half second start

01:30.000 --> 01:35.750
Minute and half mark

00:00:45.250 --> 00:00:50.000
With hours format
"""
        vtt_file.write_text(vtt_content)
        
        with open(vtt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("complex.vtt", f, "text/vtt")}
            )
        
        assert response.status_code == 200
        cues = response.json()["cues"]
        assert len(cues) == 3
        
        # Check millisecond precision
        assert cues[0]["start"] == 0.5
        assert cues[0]["end"] == 2.5
        assert cues[1]["start"] == 90.0
        assert cues[1]["end"] == 95.75


class TestErrorHandling:
    """Test error handling for invalid files."""
    
    def test_upload_audio_without_file(self, client):
        """Test uploading audio without providing a file."""
        response = client.post("/api/upload/audio", files={})
        assert response.status_code == 422  # Unprocessable Entity
    
    def test_upload_subtitle_without_file(self, client):
        """Test uploading subtitle without providing a file."""
        response = client.post("/api/upload/subtitle", files={})
        assert response.status_code == 422
    
    def test_upload_image_without_file(self, client):
        """Test uploading image without providing a file."""
        response = client.post("/api/upload/image", files={})
        assert response.status_code == 422
    
    def test_upload_audio_with_wrong_extension(self, client, tmp_path):
        """Test uploading file with wrong extension as audio."""
        mp3_file = tmp_path / "audio.mp3"
        mp3_file.write_bytes(b"fake mp3 data")
        
        with open(mp3_file, 'rb') as f:
            response = client.post(
                "/api/upload/audio",
                files={"file": ("audio.mp3", f, "audio/mpeg")}
            )
        
        assert response.status_code == 400
        assert "WAV" in response.json()["detail"]
    
    def test_upload_subtitle_with_wrong_extension(self, client, tmp_path):
        """Test uploading file with wrong extension as subtitle."""
        srt_file = tmp_path / "subtitle.srt"
        srt_file.write_text("1\n00:00:00,000 --> 00:00:02,000\nSubtitle")
        
        with open(srt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("subtitle.srt", f, "text/plain")}
            )
        
        assert response.status_code == 400
        assert "VTT" in response.json()["detail"]
    
    def test_malformed_vtt_file(self, client, invalid_vtt_file):
        """Test uploading a malformed VTT file."""
        with open(invalid_vtt_file, 'rb') as f:
            response = client.post(
                "/api/upload/subtitle",
                files={"file": ("invalid.vtt", f, "text/vtt")}
            )
        
        # Should fail during parsing
        assert response.status_code == 400
        assert "파싱" in response.json()["detail"] or "VTT" in response.json()["detail"]
    
    def test_delete_nonexistent_file(self, client):
        """Test deleting a file that doesn't exist."""
        response = client.delete("/api/files/nonexistent.wav")
        assert response.status_code == 404


class TestFileManagement:
    """Test file upload, retrieval, and deletion."""
    
    def test_delete_uploaded_audio_file(self, client, sample_wav_file):
        """Test deleting an uploaded audio file."""
        # Upload file
        with open(sample_wav_file, 'rb') as f:
            upload_response = client.post(
                "/api/upload/audio",
                files={"file": ("test_audio.wav", f, "audio/wav")}
            )
        
        filename = upload_response.json()["filename"]
        
        # Delete file
        delete_response = client.delete(f"/api/files/{filename}")
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] is True
        
        # Verify file is gone
        get_response = client.get(f"/api/files/audio/{filename}")
        assert get_response.status_code == 404
    
    def test_complete_workflow(self, client, sample_wav_file, sample_vtt_file, sample_image_file):
        """Test complete workflow: upload audio, subtitle, and image."""
        # Upload audio
        with open(sample_wav_file, 'rb') as f:
            audio_response = client.post(
                "/api/upload/audio",
                files={"file": ("audio.wav", f, "audio/wav")}
            )
        assert audio_response.status_code == 200
        audio_filename = audio_response.json()["filename"]
        
        # Upload subtitle
        with open(sample_vtt_file, 'rb') as f:
            subtitle_response = client.post(
                "/api/upload/subtitle",
                files={"file": ("subtitle.vtt", f, "text/vtt")}
            )
        assert subtitle_response.status_code == 200
        subtitle_filename = subtitle_response.json()["filename"]
        subtitle_cues = subtitle_response.json()["cues"]
        assert len(subtitle_cues) == 3
        
        # Upload image
        with open(sample_image_file, 'rb') as f:
            image_response = client.post(
                "/api/upload/image",
                files={"file": ("image.png", f, "image/png")}
            )
        assert image_response.status_code == 200
        image_filename = image_response.json()["filename"]
        
        # Verify all files can be retrieved
        audio_get = client.get(f"/api/files/audio/{audio_filename}")
        assert audio_get.status_code == 200
        
        subtitle_get = client.get(f"/api/files/subtitle/{subtitle_filename}")
        assert subtitle_get.status_code == 200
        
        image_get = client.get(f"/api/files/image/{image_filename}")
        assert image_get.status_code == 200
        
        # Clean up
        client.delete(f"/api/files/{audio_filename}")
        client.delete(f"/api/files/{subtitle_filename}")
        client.delete(f"/api/files/{image_filename}")
