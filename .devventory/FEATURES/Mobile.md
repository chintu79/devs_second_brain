# Mobile

> Capture-first mobile experience. Not a desktop port.

---

## Purpose

The mobile app exists for one reason: **capture**. Especially through the native Share Sheet.

## Current Status

**Not yet implemented.** Planned for post-MVP.

## Requirements

### Share Sheet Integration
- Share links → Devventory creates Reference
- Share PDFs/images → Devventory creates Document (future)
- Share text → Devventory creates Note (future)
- One tap to save, optional context field

### Capture-First Design
- No attempt to recreate the desktop three-panel layout
- Quick capture widget as the primary interface
- Simple list of recent captures
- Pull-to-refresh for latest data
- Minimal editing (title, notes, folder assignment)

### What We WON'T Build
- Full workspace editing on mobile
- Complex folder management
- Project management
- Knowledge graph exploration

## Technical Approach

- React Native or Expo (to be decided)
- Share Sheet extension native module
- Same API as browser extension

## Future Roadmap

- Push notifications for weekly digest
- Quick capture from notification
- Offline capture queue (save now, sync later)
- Voice capture (transcribe with AI)

## Known Limitations

- Not started — requires dedicated mobile engineer
- Share Sheet behavior varies between iOS and Android
