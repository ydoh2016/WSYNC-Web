"""
W Sync - WAV Audio & Subtitle Synchronizer
FastAPI backend for synchronizing audio with subtitles.

Copyright (C) 2024 [Your Name]

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import os

from backend.file_storage import FileStorageService
from backend.vtt_parser import VTTParserService

# Configuration from environment variables
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", "2147483648"))  # 2GB default
UPLOAD_TIMEOUT = int(os.getenv("UPLOAD_TIMEOUT", "300"))  # 5 minutes default
ENVIRONMENT = os.getenv("ENVIRONMENT", "production")

# Initialize FastAPI app
app = FastAPI(
    title="W Sync",
    description="WAV Audio & Subtitle Synchronizer - Sync audio files with VTT subtitles",
    version="1.0.0"
)

# Configure CORS middleware for large file support
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)

# Initialize services
file_storage = FileStorageService(upload_dir="uploads")
vtt_parser = VTTParserService()

# Create static directory if it doesn't exist
static_dir = Path("static")
static_dir.mkdir(exist_ok=True)

# Mount static files for CSS and JavaScript
app.mount("/static", StaticFiles(directory="static"), name="static")


# Pydantic models for API responses
class AudioUploadResponse(BaseModel):
    """Response for audio upload."""
    filename: str
    size: int
    duration: Optional[float] = None


class SubtitleUploadResponse(BaseModel):
    """Response for subtitle upload."""
    filename: str
    cues: List[dict]


class ImageUploadResponse(BaseModel):
    """Response for image upload."""
    filename: str
    url: str


class DeleteResponse(BaseModel):
    """Response for file deletion."""
    success: bool
    message: str


@app.post("/api/upload/audio", response_model=AudioUploadResponse)
async def upload_audio(file: UploadFile = File(...)):
    """
    Upload WAV audio file.
    
    Args:
        file: Uploaded WAV file
        
    Returns:
        AudioUploadResponse with filename, size, and optional duration
        
    Raises:
        HTTPException: If file validation fails or upload fails
    """
    # Validate audio file
    is_valid, error_message = file_storage.validate_audio(file)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=error_message
        )
    
    # Sanitize filename
    sanitized_filename = file_storage.sanitize_filename(file.filename)
    
    try:
        # Save file
        file_path = await file_storage.save_file(file, sanitized_filename)
        
        # Get file size
        file_size = file_path.stat().st_size
        
        return AudioUploadResponse(
            filename=sanitized_filename,
            size=file_size,
            duration=None  # Duration can be calculated client-side
        )
    
    except ValueError as e:
        raise HTTPException(status_code=413, detail=str(e))
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 실패: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"예상치 못한 오류가 발생했습니다: {str(e)}")


@app.post("/api/upload/subtitle", response_model=SubtitleUploadResponse)
async def upload_subtitle(file: UploadFile = File(...)):
    """
    Upload VTT subtitle file and parse it.
    
    Args:
        file: Uploaded VTT file
        
    Returns:
        SubtitleUploadResponse with filename and parsed cues
        
    Raises:
        HTTPException: If file validation fails or parsing fails
    """
    # Validate subtitle file
    is_valid, error_message = file_storage.validate_subtitle(file)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=error_message
        )
    
    # Sanitize filename
    sanitized_filename = file_storage.sanitize_filename(file.filename)
    
    try:
        # Save file
        file_path = await file_storage.save_file(file, sanitized_filename)
        
        # Parse VTT file
        cues = vtt_parser.parse_vtt_file(str(file_path))
        
        # Check if VTT file is empty
        if not cues:
            await file_storage.delete_file(sanitized_filename)
            raise HTTPException(
                status_code=400,
                detail="자막 파일이 비어있습니다. 올바른 VTT 파일을 업로드해주세요"
            )
        
        # Convert cues to dictionaries
        cues_dict = [cue.to_dict() for cue in cues]
        
        return SubtitleUploadResponse(
            filename=sanitized_filename,
            cues=cues_dict
        )
    
    except ValueError as e:
        # Delete file if parsing fails
        if file_storage.get_file_path(sanitized_filename):
            await file_storage.delete_file(sanitized_filename)
        raise HTTPException(status_code=400, detail=f"VTT 파싱 실패: {str(e)}")
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 실패: {str(e)}")
    except Exception as e:
        # Clean up on unexpected error
        if file_storage.get_file_path(sanitized_filename):
            await file_storage.delete_file(sanitized_filename)
        raise HTTPException(status_code=500, detail=f"예상치 못한 오류가 발생했습니다: {str(e)}")


@app.post("/api/upload/image", response_model=ImageUploadResponse)
async def upload_image(file: UploadFile = File(...)):
    """
    Upload optional image file (JPG, PNG, GIF, WebP).
    
    Args:
        file: Uploaded image file
        
    Returns:
        ImageUploadResponse with filename and URL to access the image
        
    Raises:
        HTTPException: If file validation fails or upload fails
    """
    # Validate image file
    is_valid, error_message = file_storage.validate_image(file)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=error_message
        )
    
    # Sanitize filename
    sanitized_filename = file_storage.sanitize_filename(file.filename)
    
    try:
        # Save file
        file_path = await file_storage.save_file(file, sanitized_filename)
        
        # Generate URL to access the image
        image_url = f"/api/files/image/{sanitized_filename}"
        
        return ImageUploadResponse(
            filename=sanitized_filename,
            url=image_url
        )
    
    except ValueError as e:
        raise HTTPException(status_code=413, detail=str(e))
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 실패: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"예상치 못한 오류가 발생했습니다: {str(e)}")


@app.get("/api/files/audio/{filename}")
async def get_audio(filename: str):
    """
    Serve audio file for streaming.
    
    Args:
        filename: Name of the audio file
        
    Returns:
        FileResponse with audio file stream
        
    Raises:
        HTTPException: If file not found
    """
    file_path = file_storage.get_file_path(filename)
    
    if not file_path:
        raise HTTPException(status_code=404, detail="오디오 파일을 찾을 수 없습니다")
    
    return FileResponse(
        file_path,
        media_type="audio/wav",
        filename=filename
    )


@app.get("/api/files/subtitle/{filename}")
async def get_subtitle(filename: str):
    """
    Get parsed subtitle data as JSON.
    
    Args:
        filename: Name of the subtitle file
        
    Returns:
        JSONResponse with parsed subtitle cues
        
    Raises:
        HTTPException: If file not found or parsing fails
    """
    file_path = file_storage.get_file_path(filename)
    
    if not file_path:
        raise HTTPException(status_code=404, detail="자막 파일을 찾을 수 없습니다")
    
    try:
        # Parse VTT file
        cues = vtt_parser.parse_vtt_file(str(file_path))
        
        # Convert cues to dictionaries
        cues_dict = [cue.to_dict() for cue in cues]
        
        return JSONResponse(content={"cues": cues_dict})
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"VTT 파싱 실패: {str(e)}")


@app.get("/api/files/image/{filename}")
async def get_image(filename: str):
    """
    Serve image file.
    
    Args:
        filename: Name of the image file
        
    Returns:
        FileResponse with image file
        
    Raises:
        HTTPException: If file not found
    """
    file_path = file_storage.get_file_path(filename)
    
    if not file_path:
        raise HTTPException(status_code=404, detail="이미지 파일을 찾을 수 없습니다")
    
    # Determine media type from file extension
    import mimetypes
    media_type, _ = mimetypes.guess_type(str(file_path))
    
    return FileResponse(
        file_path,
        media_type=media_type or "application/octet-stream",
        filename=filename
    )


@app.delete("/api/files/{filename}", response_model=DeleteResponse)
async def delete_file(filename: str):
    """
    Delete uploaded file.
    
    Args:
        filename: Name of the file to delete
        
    Returns:
        DeleteResponse with success status and message
        
    Raises:
        HTTPException: If deletion fails
    """
    try:
        success = await file_storage.delete_file(filename)
        
        if success:
            return DeleteResponse(
                success=True,
                message=f"파일 '{filename}'이(가) 삭제되었습니다"
            )
        else:
            raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")
    
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"파일 삭제 실패: {str(e)}")


@app.get("/")
async def serve_frontend():
    """Serve main HTML page."""
    index_path = static_dir / "index.html"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="Frontend not found")
    return FileResponse(index_path)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        timeout_keep_alive=UPLOAD_TIMEOUT
    )
