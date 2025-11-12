# W Sync - New Features Guide

This document describes the newly added features to W Sync (WAV Audio & Subtitle Synchronizer).

## 1. Favicon 🎨

A custom SVG favicon has been added to give the app a professional look in browser tabs.

**Location**: `static/favicon.svg`

The favicon features:
- Audio waveform visualization
- Subtitle lines
- Gradient colors matching the app theme

## 2. Dark Mode 🌓

Users can toggle between light and dark themes for comfortable viewing in any lighting condition.

**Features**:
- Toggle button in the top-right corner
- Preference saved in localStorage (persists across sessions)
- Smooth transitions between themes
- All UI elements adapt to the selected theme

**Implementation**:
- CSS variables for easy theme switching
- JavaScript localStorage for persistence
- Accessible color contrast in both modes

## 3. Keyboard Shortcuts ⌨️

Efficient keyboard controls for power users.

**Available Shortcuts**:
- `Space` - Play/Pause audio
- `←` (Left Arrow) - Skip backward 5 seconds
- `→` (Right Arrow) - Skip forward 5 seconds
- `↑` (Up Arrow) - Increase volume by 10%
- `↓` (Down Arrow) - Decrease volume by 10%
- `M` - Toggle mute

**Features**:
- Only active when player is visible
- Doesn't interfere with typing in input fields
- Visual guide available in the player section

## 4. Playback Speed Control ⚡

Adjust audio playback speed for different use cases.

**Speed Options**:
- 0.5x - Slow (great for difficult content)
- 0.75x - Slightly slow
- 1x - Normal speed (default)
- 1.25x - Slightly fast
- 1.5x - Fast
- 2x - Very fast (time-saving)

**Use Cases**:
- Language learning (slow down to catch every word)
- Quick review (speed up familiar content)
- Accessibility (adjust to comfortable pace)

## 5. Feedback Button 💬

Direct communication channel with the developer.

**Features**:
- Email link in the top-right corner
- Pre-filled subject line
- Easy to customize

**Customization**:
To change the feedback email address, edit `static/index.html`:

```html
<a href="mailto:YOUR-EMAIL@example.com?subject=Audio Subtitle Viewer 피드백" 
   class="feedback-btn" 
   title="개발자에게 피드백 보내기">
    💬 피드백
</a>
```

Replace `YOUR-EMAIL@example.com` with your actual email address.

## Technical Implementation

### Dark Mode
- Uses CSS custom properties (variables) for theming
- JavaScript toggles `dark-mode` class on body
- localStorage API for persistence

### Keyboard Shortcuts
- Event listener on document for keydown events
- Prevents default browser behavior for used keys
- Checks if player is visible before handling shortcuts

### Playback Speed
- HTML5 Audio API `playbackRate` property
- Select dropdown for user-friendly control
- Instant speed changes without audio interruption

### Feedback Button
- Simple mailto link
- Can be easily replaced with a form or external service
- Styled to match the app's design language

## Browser Compatibility

All features are compatible with modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Future Enhancements

Potential additions based on these features:
- Custom keyboard shortcut configuration
- More granular speed control (0.1x increments)
- Subtitle font size/style customization
- Recent files history (localStorage)
- Subtitle search functionality

