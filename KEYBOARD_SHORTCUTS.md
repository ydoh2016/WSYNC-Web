# ⌨️ Keyboard Shortcuts Guide

W Sync supports comprehensive keyboard shortcuts for efficient playback control.

## 🎮 Available Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `Space` | Play/Pause | Toggle audio playback |
| `←` | Skip Backward | Jump back 5 seconds |
| `→` | Skip Forward | Jump forward 5 seconds |
| `↑` | Volume Up | Increase volume by 10% |
| `↓` | Volume Down | Decrease volume by 10% |
| `M` | Mute/Unmute | Toggle audio mute |
| `F` | Fullscreen | Toggle subtitle fullscreen mode |
| `ESC` | Exit Fullscreen | Exit subtitle fullscreen mode |

## 💡 Tips

### Visual Feedback
When you press a keyboard shortcut, you'll see a small notification in the top-right corner showing which action was triggered.

### When Shortcuts Work
- ✅ After audio and subtitles are loaded
- ✅ When player is visible
- ✅ Even when audio player has focus
- ✅ Even when buttons have focus

### When Shortcuts Don't Work
- ❌ When typing in text input fields
- ❌ When typing in file upload fields
- ❌ When using Ctrl/Alt/Cmd modifier keys
- ❌ Before files are uploaded

## 🎯 Best Practices

### For Language Learning
1. Use `Space` to pause at difficult parts
2. Use `←` to replay sections
3. Use `↓` to lower volume when focusing on subtitles
4. Use `F` for fullscreen subtitles to focus on reading

### For Transcription Work
1. Use `Space` for quick pause/resume
2. Use `←` and `→` to navigate precisely
3. Use `F` for fullscreen to see subtitles clearly
4. Use speed control (dropdown) to slow down audio

### For Content Review
1. Use `→` to skip through familiar parts
2. Use `Space` to pause at important moments
3. Use `M` to mute when reading subtitles only
4. Use `F` for distraction-free subtitle reading

## 🔧 Troubleshooting

### Shortcuts Not Working?

**Problem:** Keyboard shortcuts don't respond

**Solutions:**
1. **Click anywhere on the page** - This ensures the page has focus
2. **Check if player is loaded** - Shortcuts only work after files are uploaded
3. **Check if you're typing** - Shortcuts are disabled in text input fields
4. **Refresh the page** - Sometimes a refresh helps

**Problem:** Space bar scrolls the page instead of pausing

**Solution:** ✅ Fixed! Space bar now always controls playback when player is loaded.

**Problem:** Arrow keys scroll the page

**Solution:** ✅ Fixed! Arrow keys now control playback/volume when player is loaded.

**Problem:** Left/Right arrow keys don't skip (Known Issue - FIXED!)

**Solution:** ✅ Fixed! This was a conflict with HTML5 audio player's default keyboard handling. We now:
- Prevent audio player from handling keyboard events
- Use multiple event listeners with capture phase
- Add `stopImmediatePropagation()` to prevent event bubbling
- Set audio player `tabindex="-1"` to prevent focus

If you still experience issues:
1. Click anywhere outside the audio player controls
2. Check browser console (F12) for "Skip backward/forward to:" messages
3. Try refreshing the page

### Still Having Issues?

1. Open browser console (F12)
2. Check for JavaScript errors
3. Report the issue on [GitHub](https://github.com/YOUR-USERNAME/w-sync/issues)

## 🎨 Customization

Want different keyboard shortcuts? You can modify them in `static/app.js`:

```javascript
// Find the initializeKeyboardShortcuts() function
// Modify the switch statement to add/change shortcuts

switch(e.key) {
    case 'k':  // Add custom shortcut
        e.preventDefault();
        this.togglePlayPause();
        break;
    // ... other shortcuts
}
```

## 📱 Mobile Support

Keyboard shortcuts are designed for desktop use. On mobile devices:
- Use on-screen controls
- Fullscreen mode still works (tap the button)
- Touch gestures may be added in future updates

## 🚀 Future Enhancements

Planned keyboard shortcut features:
- [ ] Customizable key bindings
- [ ] Subtitle navigation (jump to next/previous subtitle)
- [ ] Speed control shortcuts (faster/slower)
- [ ] Bookmark shortcuts
- [ ] Loop section shortcuts

---

**Pro Tip:** Print this guide or keep it handy while using W Sync for maximum productivity! 🎵
