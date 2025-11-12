"""VTT Parser Service for parsing WebVTT subtitle files."""

from dataclasses import dataclass
from typing import List
import webvtt


@dataclass
class SubtitleCue:
    """Represents a single subtitle entry with timing and text."""
    
    start_time: float  # Start time in seconds
    end_time: float    # End time in seconds
    text: str          # Subtitle text content
    
    def to_dict(self) -> dict:
        """
        Convert SubtitleCue to JSON-serializable dictionary.
        
        Returns:
            Dictionary with start, end, and text fields
        """
        return {
            "start": self.start_time,
            "end": self.end_time,
            "text": self.text
        }
    
    def is_active(self, current_time: float) -> bool:
        """
        Check if subtitle should be displayed at given time.
        
        Args:
            current_time: Current playback time in seconds
            
        Returns:
            True if subtitle is active at current time
        """
        return self.start_time <= current_time < self.end_time


class VTTParserService:
    """Service for parsing VTT subtitle files."""
    
    def parse_vtt_file(self, file_path: str) -> List[SubtitleCue]:
        """
        Parse VTT file using webvtt-py library.
        
        Args:
            file_path: Path to VTT file
            
        Returns:
            List of SubtitleCue objects
            
        Raises:
            FileNotFoundError: If file does not exist
            ValueError: If VTT file is malformed
        """
        try:
            vtt = webvtt.read(file_path)
            return self._convert_captions_to_cues(vtt)
        except Exception as e:
            raise ValueError(f"Failed to parse VTT file: {str(e)}")
    
    def parse_vtt_content(self, content: str) -> List[SubtitleCue]:
        """
        Parse VTT content string.
        
        Args:
            content: VTT file content as string
            
        Returns:
            List of SubtitleCue objects
            
        Raises:
            ValueError: If VTT content is malformed
        """
        try:
            vtt = webvtt.from_string(content)
            return self._convert_captions_to_cues(vtt)
        except Exception as e:
            raise ValueError(f"Failed to parse VTT content: {str(e)}")
    
    def _convert_captions_to_cues(self, vtt) -> List[SubtitleCue]:
        """
        Convert webvtt captions to SubtitleCue objects.
        
        Args:
            vtt: WebVTT object from webvtt-py
            
        Returns:
            List of SubtitleCue objects
        """
        cues = []
        for caption in vtt:
            start_seconds = self.time_to_seconds(caption.start)
            end_seconds = self.time_to_seconds(caption.end)
            text = caption.text
            
            cues.append(SubtitleCue(
                start_time=start_seconds,
                end_time=end_seconds,
                text=text
            ))
        
        return cues
    
    @staticmethod
    def time_to_seconds(time_str: str) -> float:
        """
        Convert VTT timestamp to seconds.
        
        VTT timestamps can be in format:
        - HH:MM:SS.mmm
        - MM:SS.mmm
        
        Args:
            time_str: VTT timestamp string
            
        Returns:
            Time in seconds as float
        """
        parts = time_str.split(':')
        
        if len(parts) == 3:
            # HH:MM:SS.mmm format
            hours = int(parts[0])
            minutes = int(parts[1])
            seconds = float(parts[2])
            return hours * 3600 + minutes * 60 + seconds
        elif len(parts) == 2:
            # MM:SS.mmm format
            minutes = int(parts[0])
            seconds = float(parts[1])
            return minutes * 60 + seconds
        else:
            raise ValueError(f"Invalid time format: {time_str}")
