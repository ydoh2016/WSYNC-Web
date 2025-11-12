# Technical Notes - Keyboard Shortcuts Implementation

## Problem: HTML5 Audio Player Keyboard Conflicts

### The Issue

HTML5 `<audio>` elements have built-in keyboard controls that conflict with custom shortcuts:

1. **Arrow Keys Behavior**
   - `←` / `→` are interpreted as "previous/next track" in a playlist
   - When no playlist exists, it seeks to 0:00 (beginning)
   - This overrides our custom 5-second skip functionality

2. **Focus Stealing**
   - When audio player receives focus (via click or Space key)
   - All keyboard events are captured by the player
   - Custom shortcuts stop working entirely

3. **Event Propagation**
   - Audio player handles events before our listeners
   - `preventDefault()` alone is insufficient
   - Events need to be stopped at capture phase

### Our Solution

#### 1. Complete Keyboard Event Blocking

```javascript
// Block ALL keyboard events on audio player
audioPlayer.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
}, true); // Capture phase
```

Applied to: `keydown`, `keyup`, `keypress`

#### 2. Automatic Focus Removal

```javascript
// Remove focus immediately when audio player is clicked
audioPlayer.addEventListener('click', () => {
    audioPlayer.blur();
    document.body.focus();
});

// Prevent focus from being set
audioPlayer.addEventListener('focus', () => {
    audioPlayer.blur();
    document.body.focus();
});
```

#### 3. Intentional Seek Tracking

```javascript
// Track whether seek is intentional (our code) or unwanted (browser default)
this.isIntentionalSeek = false;

audioPlayer.addEventListener('seeking', (e) => {
    if (!this.isIntentionalSeek) {
        console.warn('Unwanted seek detected');
        e.preventDefault();
        e.stopPropagation();
    }
});

// Set flag before our seeks
skipForward() {
    this.isIntentionalSeek = true;
    this.audioPlayer.currentTime = newTime;
}
```

This prevents the "jump to 0:00" issue when arrow keys are pressed.

#### 4. Multiple Event Listeners

```javascript
// Capture at multiple levels to ensure we catch events
window.addEventListener('keydown', handler, true);
document.addEventListener('keydown', handler, true);
playerSection.addEventListener('keydown', handler, true);
```

#### 5. HTML Attributes

```html
<audio controls tabindex="-1" disablekeyboardcontrols></audio>
```

- `tabindex="-1"`: Prevents focus via Tab key
- `disablekeyboardcontrols`: Custom attribute (not standard, but doesn't hurt)

#### 6. CSS Focus Prevention

```css
#audioPlayer:focus,
#audioPlayer:focus-within,
#audioPlayer:focus-visible {
    outline: none !important;
}
```

### Why This Works

1. **Capture Phase**: Events are caught before reaching audio player
2. **stopImmediatePropagation()**: Prevents other listeners on same element
3. **Focus Management**: Audio player never maintains focus
4. **Seek Tracking**: Distinguishes our seeks from browser's default behavior

### Testing

Open browser console and test:

```javascript
// Should see these logs:
"ArrowLeft key pressed"
"Skip backward from 10.5 to 5.5"

// Should NOT see:
"Unwanted seek detected" (unless there's a bug)
```

### Known Limitations

1. **Timeline Interaction**: Users can still click/drag timeline (this is intentional)
2. **Browser Differences**: Some browsers may handle events differently
3. **Mobile**: Touch events work differently (keyboard shortcuts are desktop-only)

### Alternative Approaches Considered

#### Option A: Custom Audio Controls
- Remove `controls` attribute
- Build custom play/pause/seek buttons
- **Rejected**: Too much work, native controls are better UX

#### Option B: Iframe Isolation
- Put audio player in iframe
- Isolate keyboard events
- **Rejected**: Overcomplicated, CORS issues

#### Option C: Shadow DOM
- Use Shadow DOM to isolate player
- **Rejected**: Browser support issues, complexity

### Future Improvements

1. **Custom Controls**: If native controls continue to cause issues
2. **Configurable Shortcuts**: Let users customize key bindings
3. **Visual Feedback**: Show current time when seeking
4. **Seek Preview**: Show subtitle at seek position

### Browser Compatibility

Tested and working on:
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

### References

- [MDN: HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [HTML5 Audio Keyboard Controls](https://www.w3.org/TR/html5/embedded-content-0.html#media-elements)
- [Event Capture vs Bubbling](https://javascript.info/bubbling-and-capturing)

---

**Last Updated**: 2024-11-12
**Author**: W Sync Development Team
