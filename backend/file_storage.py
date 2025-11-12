"""File Storage Service for managing file uploads and storage."""

import os
import aiofiles
from pathlib import Path
from typing import Optional
from fastapi import UploadFile
import mimetypes


class FileStorageService:
    """Service for managing file uploads, validation, and storage."""
    
    # File validation constants
    MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024  # 2GB in bytes
    ALLOWED_AUDIO_EXTENSIONS = {'.wav'}
    ALLOWED_AUDIO_MIMETYPES = {'audio/wav', 'audio/x-wav', 'audio/wave'}
    ALLOWED_SUBTITLE_EXTENSIONS = {'.vtt'}
    ALLOWED_SUBTITLE_MIMETYPES = {'text/vtt', 'text/plain'}
    ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    ALLOWED_IMAGE_MIMETYPES = {
        'image/jpeg', 'image/png', 'image/gif', 'image/webp'
    }
    
    def __init__(self, upload_dir: str = "uploads"):
        """
        Initialize FileStorageService.
        
        Args:
            upload_dir: Directory path for storing uploaded files
        """
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(exist_ok=True)
    
    def validate_audio(self, file: UploadFile) -> tuple[bool, str]:
        """
        Validate audio file format and size.
        
        Checks:
        - File exists and has a filename
        - File extension is .wav
        - MIME type is audio/wav or related
        - File size is within limits (up to 2GB)
        
        Args:
            file: Uploaded file object
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if file exists
        if not file or not file.filename:
            return False, "오디오 파일이 선택되지 않았습니다"
        
        # Check for empty filename
        if not file.filename.strip():
            return False, "올바른 파일명이 아닙니다"
        
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if not file_ext:
            return False, "파일 확장자가 없습니다. WAV 파일을 업로드해주세요"
        
        if file_ext not in self.ALLOWED_AUDIO_EXTENSIONS:
            return False, f"WAV 형식만 지원됩니다 (업로드된 파일: {file_ext})"
        
        # Check MIME type
        content_type = file.content_type
        if content_type and content_type not in self.ALLOWED_AUDIO_MIMETYPES:
            return False, f"올바른 오디오 형식이 아닙니다. WAV 파일을 업로드해주세요 (현재 타입: {content_type})"
        
        return True, ""
    
    def validate_subtitle(self, file: UploadFile) -> tuple[bool, str]:
        """
        Validate VTT subtitle file format.
        
        Checks:
        - File exists and has a filename
        - File extension is .vtt
        - MIME type is text/vtt or text/plain
        
        Args:
            file: Uploaded file object
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if file exists
        if not file or not file.filename:
            return False, "자막 파일이 선택되지 않았습니다"
        
        # Check for empty filename
        if not file.filename.strip():
            return False, "올바른 파일명이 아닙니다"
        
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if not file_ext:
            return False, "파일 확장자가 없습니다. VTT 파일을 업로드해주세요"
        
        if file_ext not in self.ALLOWED_SUBTITLE_EXTENSIONS:
            return False, f"VTT 형식만 지원됩니다 (업로드된 파일: {file_ext})"
        
        # Check MIME type
        content_type = file.content_type
        if content_type and content_type not in self.ALLOWED_SUBTITLE_MIMETYPES:
            return False, f"올바른 자막 형식이 아닙니다. VTT 파일을 업로드해주세요 (현재 타입: {content_type})"
        
        return True, ""
    
    def validate_image(self, file: UploadFile) -> tuple[bool, str]:
        """
        Validate image file format.
        
        Checks:
        - File exists and has a filename
        - File extension is .jpg, .jpeg, .png, .gif, or .webp
        - MIME type matches image format
        
        Args:
            file: Uploaded file object
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if file exists
        if not file or not file.filename:
            return False, "이미지 파일이 선택되지 않았습니다"
        
        # Check for empty filename
        if not file.filename.strip():
            return False, "올바른 파일명이 아닙니다"
        
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if not file_ext:
            return False, "파일 확장자가 없습니다. 이미지 파일을 업로드해주세요"
        
        if file_ext not in self.ALLOWED_IMAGE_EXTENSIONS:
            allowed = ', '.join(self.ALLOWED_IMAGE_EXTENSIONS)
            return False, f"지원되지 않는 이미지 형식입니다 (업로드된 파일: {file_ext}, 지원 형식: {allowed})"
        
        # Check MIME type
        content_type = file.content_type
        if content_type and content_type not in self.ALLOWED_IMAGE_MIMETYPES:
            return False, f"올바른 이미지 형식이 아닙니다. JPG, PNG, GIF, WebP 파일을 업로드해주세요 (현재 타입: {content_type})"
        
        return True, ""

    async def save_file(self, file: UploadFile, filename: str) -> Path:
        """
        Save uploaded file to disk asynchronously.
        
        Args:
            file: Uploaded file object
            filename: Sanitized filename to save as
            
        Returns:
            Path to saved file
            
        Raises:
            IOError: If file cannot be saved
            ValueError: If file size exceeds maximum allowed size
        """
        file_path = self.upload_dir / filename
        
        # Save file in chunks to handle large files
        chunk_size = 1024 * 1024  # 1MB chunks
        total_size = 0
        
        try:
            async with aiofiles.open(file_path, 'wb') as f:
                while True:
                    chunk = await file.read(chunk_size)
                    if not chunk:
                        break
                    
                    total_size += len(chunk)
                    
                    # Check file size limit
                    if total_size > self.MAX_FILE_SIZE:
                        # Delete partially written file
                        await self._delete_file_async(file_path)
                        max_size_gb = self.MAX_FILE_SIZE / (1024**3)
                        raise ValueError(
                            f"파일 크기가 너무 큽니다 (최대 {max_size_gb:.1f}GB)"
                        )
                    
                    await f.write(chunk)
            
            # Verify file was written successfully
            if not file_path.exists() or file_path.stat().st_size == 0:
                raise IOError("파일이 제대로 저장되지 않았습니다")
            
            return file_path
            
        except ValueError:
            # Re-raise ValueError for file size limit
            raise
        except Exception as e:
            # Clean up on error
            if file_path.exists():
                await self._delete_file_async(file_path)
            raise IOError(f"파일 저장 실패: {str(e)}")
    
    def get_file_path(self, filename: str) -> Optional[Path]:
        """
        Get path to stored file.
        
        Args:
            filename: Name of the file
            
        Returns:
            Path object if file exists, None otherwise
        """
        file_path = self.upload_dir / filename
        
        if file_path.exists() and file_path.is_file():
            return file_path
        
        return None
    
    async def delete_file(self, filename: str) -> bool:
        """
        Delete file from storage.
        
        Args:
            filename: Name of the file to delete
            
        Returns:
            True if file was deleted, False if file doesn't exist
            
        Raises:
            IOError: If file cannot be deleted
        """
        file_path = self.upload_dir / filename
        
        if not file_path.exists():
            return False
        
        try:
            await self._delete_file_async(file_path)
            return True
        except Exception as e:
            raise IOError(f"Failed to delete file: {str(e)}")
    
    async def _delete_file_async(self, file_path: Path) -> None:
        """
        Delete file asynchronously.
        
        Args:
            file_path: Path to file to delete
        """
        # Use os.remove in async context
        # aiofiles doesn't provide async remove, so we use sync version
        # For production, consider using aiofiles.os.remove if available
        if file_path.exists():
            os.remove(file_path)
    
    def sanitize_filename(self, filename: str) -> str:
        """
        Sanitize filename to prevent directory traversal and other issues.
        
        Args:
            filename: Original filename
            
        Returns:
            Sanitized filename safe for storage
        """
        # Get just the filename without path components
        filename = os.path.basename(filename)
        
        # Remove any potentially dangerous characters
        # Keep alphanumeric, dots, hyphens, and underscores
        safe_chars = []
        for char in filename:
            if char.isalnum() or char in '.-_':
                safe_chars.append(char)
            else:
                safe_chars.append('_')
        
        sanitized = ''.join(safe_chars)
        
        # Ensure filename is not empty
        if not sanitized or sanitized == '.':
            sanitized = 'unnamed_file'
        
        return sanitized
