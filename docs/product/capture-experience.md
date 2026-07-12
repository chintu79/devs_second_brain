# Capture Experience

## Why Capture Matters

Capture is Devventory's first impression. Users don't care about the architecture, the AI pipeline, or the database. They care about one thing: "Can I save this in less than five seconds?"

Every capture interaction is a contract: the user found something valuable, and Devventory promises to keep it safe, organized, and retrievable. Breaking that contract — by being slow, asking too many questions, or losing context — means the user won't come back.

This document defines the product experience before implementation begins.

---

## Product Philosophy

| Principle | Meaning |
|---|---|
| **Zero friction** | The default capture requires one click or one share action. Everything else is optional. |
| **Context-aware** | The system infers type, title, and relevance. The user never answers "what is this?" |
| **Instant confirmation** | Feedback in under 500ms. Never block on processing. |
| **Forgiving** | Undo, restore, recover. No irreversible actions. |
| **Interruptible** | Users return to what they were doing immediately. Devventory works in the background. |
| **Progressive disclosure** | First capture is one tap. Advanced features appear only when needed. |

---

## Capture Moments

Every surface has a native capture gesture:

| Surface | Capture Gesture | Friction |
|---|---|---|
| **Browser** | Right-click → Devventory, or Ctrl+Shift+S | 1 click / 1 shortcut |
| **Mobile** | Share Sheet → Devventory | 2 taps (share, select) |
| **Web** | Paste URL, or Cmd+K → paste | 2 actions |
| **Desktop (future)** | Global hotkey, drag & drop | 1 action |
| **Clipboard (future)** | Copy → notification → save | 0 actions (auto-detect) |
| **Email (future)** | Forward to save@devventory.app | 1 action |
| **Voice (future)** | "Hey Devventory, save this" | 1 action |

The benchmark: every source should require at most 2 user actions from discovery to confirmation.

---

## Default Capture Flow

```mermaid
flowchart LR
    DISC[Discover] --> CAP[Capture Action]
    CAP --> CONF[Instant Confirmation]
    CONF --> RETURN[Return to Context]
    
    note_right of CONF
        < 500ms
        Toast / Haptic
        No modal
    end
    
    style DISC fill:#1a1a2e,stroke:#6366F1,color:#fff
    style CAP fill:#0f3460,stroke:#e94560,color:#fff
    style CONF fill:#16c79a,stroke:#1a1a2e,color:#fff
    style RETURN fill:#1a1a2e,stroke:#6366F1,color:#fff
```

The default flow has four stages. The user never leaves their context.

---

## Platform Flows

### Browser Extension

```mermaid
flowchart TD
    FIND[User finds something worth saving] --> INT{Interaction}
    
    INT -->|Right-click page| RCLICK[Context Menu → Save to Devventory]
    INT -->|Right-click link| RLINK[Context Menu → Save Link]
    INT -->|Right-click image| RIMG[Context Menu → Save Image]
    INT -->|Select text → Right-click| RTEXT[Context Menu → Save Selection]
    INT -->|Keyboard shortcut| KBD[Ctrl+Shift+S → Inline Popup]
    
    RCLICK --> SAVE[Save URL + page title]
    RLINK --> SAVE
    RIMG --> SAVE
    RTEXT --> SAVE
    KBD --> POPUP[Show inline popup with preview]
    
    SAVE --> DONE[Toast: "Saved" + Undo]
    POPUP --> OPT{User action}
    OPT -->|Save| DONE
    OPT -->|Add note| NOTE[Type quick note → Save]
    OPT -->|Select collection| COL[Choose from recent → Save]
    OPT -->|Cancel| CLOSE[Close popup]
    NOTE --> DONE
    COL --> DONE
    
    style DONE fill:#16c79a,stroke:#1a1a2e,color:#fff
    style CLOSE fill:#e94560,stroke:#1a1a2e,color:#fff
```

Key decisions:
- Right-click saves silently (no popup). Context is preserved in the backend.
- Keyboard shortcut shows a minimal inline popup for optional context.
- The popup appears near the cursor, never as a full tab.
- No React in content script. The popup is a small pre-built UI.

### Mobile Share Sheet

```mermaid
flowchart TD
    FIND[User finds content in any app] --> SHARE[Tap Share]
    SHARE --> SELECT[Select Devventory from share sheet]
    SELECT --> NORM[Devventory receives intent]
    NORM --> PREVIEW[Show preview sheet]
    
    PREVIEW --> SAVE[Tap Save]
    PREVIEW --> NOTE[Tap note field → type → Save]
    PREVIEW --> COL[Select collection → Save]
    PREVIEW --> CANCEL[Swipe away]
    
    SAVE --> DONE[Haptic + Toast: "Saved"]
    NOTE --> DONE
    COL --> DONE
    CANCEL --> DISMISS[No capture recorded]
    
    style SAVE fill:#16c79a,stroke:#1a1a2e,color:#fff
    style CANCEL fill:#e94560,stroke:#1a1a2e,color:#fff
```

Key decisions:
- Preview sheet is the only UI between user and saved capture.
- Collection and note are optional. Saving with neither is valid.
- After save, the share sheet dismisses automatically. User returns to source app.
- Offline? Queue locally. Confirm immediately. Sync later.

### Web App

```mermaid
flowchart TD
    FIND[User has a URL or idea] --> INT{How?}
    
    INT -->|Paste URL| PASTE[Cmd+V in search bar]
    INT -->|Cmd+K| PALETTE[Open command palette → "capture"]
    INT -->|Quick Capture button| BUTTON[Click + in sidebar]
    
    PASTE --> DETECT{Detect input}
    PALETTE --> DETECT
    BUTTON --> PROMPT[Prompt for URL]
    
    DETECT -->|URL| URL[Save as reference]
    DETECT -->|Text| NOTE[Save as note]
    DETECT -->|File| DOC[Upload as document]
    
    URL --> RESPOND[Toast: "Saved"]
    NOTE --> RESPOND
    DOC --> RESPOND
    PROMPT --> RESPOND
    
    RESPOND --> REFRESH[List updates with new item]
    
    style RESPOND fill:#16c79a,stroke:#1a1a2e,color:#fff
```

Key decisions:
- Pasting a URL in the search bar triggers capture (not search) when it looks like a URL.
- The sidebar "+" button prompts for a URL with a simple browser `prompt()`.
- No modal dialogs. No multi-step forms. No required fields.

---

## Capture States

Every capture request moves through these states:

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> Capturing: User initiates capture
    Capturing --> Queued: Device offline
    Capturing --> Processing: Sent to server
    Queued --> Processing: Device online
    Processing --> Ready: Pipeline complete
    Processing --> Failed: Pipeline error
    
    Ready --> [*]: User sees item in list
    Failed --> Capturing: User taps retry
    Failed --> [*]: User dismisses
    
    note right of Capturing
        < 500ms
        Optimistic UI
    end
    
    note right of Processing
        Background
        1-10 seconds
        No user action needed
    end
```

### State UX

| State | Duration | User Sees | User Can |
|---|---|---|---|
| **Idle** | — | Normal UI | Initiate capture |
| **Capturing** | <500ms | Button spinner, then toast | Nothing (instant) |
| **Queued** | Variable (offline) | Badge: "Will save when online" | Continue browsing |
| **Processing** | 1-10s | Item appears dimmed/skeleton | Open item (may show "Summarizing...") |
| **Ready** | Permanent | Full item in list | Read, edit, organize, share |
| **Failed** | Until retry | Error toast + retry button | Retry or dismiss |

### Processing State in Detail

When an item is in "processing" state:

```
In the list:

┌──────────────────────────────────────┐
│  📄 How DNS Works                    │
│  dev.to · 2 min ago                  │
│  ────────────────────────────────    │
│  Generating summary...        (spin) │
└──────────────────────────────────────┘

When opened in reader:

┌──────────────────────────────────────┐
│  How DNS Works                       │
│  ────────────────────────────────    │
│  Title, URL, metadata are visible.   │
│                                      │
│  Summary:                            │
│  ⏳ Generating...                     │
│                                      │
│  Everything else is editable.        │
└──────────────────────────────────────┘
```

The item is usable immediately. Only AI-dependent features show loading state.

---

## Success Feedback

### Confirmation Types

| Channel | Feedback | Duration |
|---|---|---|
| **Web** | Toast: "Saved to Devventory" + Undo | 3s auto-dismiss |
| **Mobile** | Haptic (success) + Toast | 2s auto-dismiss |
| **Extension** | Toast: "Saved" + Undo | 2s auto-dismiss |
| **Desktop (future)** | Notification center | 4s auto-dismiss |

### Toast Design

```
┌──────────────────────────────────┐
│  ✓ Saved to Devventory    [Undo] │
└──────────────────────────────────┘
```

- No icons. No avatars. No animation beyond a subtle slide-in.
- "Undo" moves the item to trash (or removes the queue entry).
- Tapping the toast opens the item in Devventory.
- Auto-dismisses. Never requires user action to disappear.

### What Success Feels Like

1. User taps save
2. Haptic feedback (mobile) or subtle toast (desktop)
3. Item appears in list within 2 seconds (skeleton state if processing)
4. User returns to what they were doing
5. Devventory processes in the background

The item is "saved" the moment the toast appears. Processing is a detail.

---

## Failure UX

### Failure Matrix

| Failure | Cause | UX | User Action |
|---|---|---|---|
| **Offline** | No network | Toast: "Saved offline. Will sync when connected." + queue badge | None (auto) |
| **Auth expired** | API key revoked or session expired | Toast: "Please reconnect Devventory" + settings redirect | Re-authenticate |
| **Network failure** | Server unreachable | Same as offline (queue locally) | None (auto) |
| **Server error** | 5xx | Toast: "Couldn't save. Retrying..." | Wait or retry |
| **Duplicate** | Same URL already saved | Toast: "Already saved" + "Open" action | Open existing or ignore |
| **Invalid URL** | Malformed URL | Toast: "Couldn't read this link. Try again." | Fix URL or cancel |
| **Unsupported content** | Binary format not supported | Toast: "This type isn't supported yet." | Dismiss |
| **Rate limited** | Too many captures | Toast: "Saving too fast. Wait a moment." | Wait |

### Failure UX Principles

1. Never show raw error messages. Translate every error to user language.
2. Always offer a path forward. Even if it's just "try again."
3. Offline is not an error. It's a state. Queue and continue.
4. No blocking dialogs for failures. Toasts only.
5. Failed captures appear in a "Failed" system collection for retry.

---

## Duplicate Handling

### Detection

Duplicates are detected by canonical URL matching (references) or content hash (notes/documents).

| Content Type | Match Criteria |
|---|---|
| Reference | Normalized URL (strip protocol, trailing slash, UTM params) |
| Note | Content hash (SHA-256 of first 500 chars) |
| Document | File hash (SHA-256 of binary) |

### UX Flow

```mermaid
flowchart TD
    CAP[User captures URL] --> CHECK{Already saved?}
    CHECK -->|No| SAVE[Save normally]
    CHECK -->|Yes| DUPE[Show duplicate toast]
    
    DUPE --> OPEN[Tap "Open" → view existing]
    DUPE --> IGNORE[Dismiss → do nothing]
    DUPE --> SAVE_ANYWAY[Save as new item]
    
    SAVE --> DONE[Toast: "Saved"]
    OPEN --> REDIRECT[Navigate to existing item]
    SAVE_ANYWAY --> DONE
    
    style SAVE fill:#16c79a,stroke:#1a1a2e,color:#fff
    style OPEN fill:#0f3460,stroke:#1a1a2e,color:#fff
```

### Duplicate Toast

```
┌──────────────────────────────────────┐
│  ⚡ Already saved        [Open] [X]  │
└──────────────────────────────────────┘
```

- The toast appears in place of the normal "Saved" toast.
- "Open" navigates to the existing item.
- "X" dismisses. The item is not duplicated.
- If the user insists, they can "Save anyway" from the existing item's page.

### Why Not Block

Blocking the save with a modal dialog punishes the user for doing the right thing (saving something valuable). A passive toast preserves flow while preventing accidental duplicates.

---

## Progressive Disclosure

### First-Time User

- No collection selector visible
- No tag input
- No type selector
- Default collection is "Uncategorized" (or recent)
- Save button is the only primary action

### Returning User

- Recent collections appear in capture flow
- Quick note field is visible but collapsed
- Tags appear after 5 saves
- Advanced options under "..." menu

### Power User

- All fields visible
- Keyboard shortcuts memorized
- Default collection remembered per domain
- Auto-tags enabled

### Disclosure Timeline

| Milestone | What Appears |
|---|---|
| First capture | Save button only |
| 3rd capture | Collection picker (collapsed) |
| 10th capture | Quick note field |
| 25th capture | Tag suggestions |
| 50th capture | All advanced options |
| Manual toggle | User can enable all at any time in settings |

---

## Intelligent Suggestions

### Collection Suggestion

After capture, the system suggests a collection based on:

| Signal | Example |
|---|---|
| **Domain** | `dev.to` → "Frontend" |
| **Content topic** | AI-detected → "AI" |
| **Time of day** | Evening → "Reading Later" |
| **Recent activity** | Last 3 saves to "Frontend" → suggest "Frontend" |
| **Existing items** | Similar titles in "React" → suggest "React" |

```mermaid
flowchart LR
    SAVE[Item saved] --> SUG{Confidence > 70%?}
    SUG -->|Yes| SHOW[Show suggestion in toast]
    SUG -->|No| HIDE[No suggestion]
    
    SHOW --> ACCEPT[Toast: "Saved to Frontend" ↔ "Change"]
    SHOW --> IGNORE[Dismiss → item stays uncategorized]
    
    ACCEPT --> KEEP[Item appears in Frontend]
    ACCEPT --> CHANGE[Show collection picker]
    
    style SHOW fill:#0f3460,stroke:#1a1a2e,color:#fff
```

### Suggestion Toast

```
┌──────────────────────────────────────┐
│  ✓ Saved to "Frontend"    [Change]   │
└──────────────────────────────────────┘
```

- The collection name is shown inline in the confirmation toast.
- "Change" opens the collection picker to re-assign.
- Suggestions disappear if ignored. No follow-up.
- Users can disable suggestions in settings.

### When NOT to Suggest

- If the user manually selected a collection before saving (respect their choice)
- If confidence is below 50%
- If the user has disabled suggestions

---

## Context Preservation

Every capture preserves:

| Context | Source | Example |
|---|---|---|
| **URL** | Share intent / extension | `https://example.com/article` |
| **Title** | Page metadata / OG tags | "How DNS Works" |
| **Selection** | User highlighted text | "DNS resolves domain names..." |
| **Page text** | Readability extraction | Full article content |
| **Provider** | Domain detection | dev.to |
| **Timestamp** | Server time | 2026-07-09T14:30:00Z |
| **Capture source** | Client identifier | `extension` / `mobile` / `web` |
| **OG image** | OpenGraph tags | `https://example.com/og.jpg` |
| **Favicon** | Site favicon | `https://example.com/favicon.ico` |
| **Referrer** | From context | User was reading "React Hooks" collection |

The user should never have to reconstruct why they saved something. The system captures context automatically.

### Context Display

In the reader, captured context appears as:

```
┌──────────────────────────────────────┐
│  How DNS Works                       │
│  dev.to · Saved from Extension       │
│  ─────────────────────────────────   │
│                                      │
│  "I need this for the DNS deep dive  │
│   I'm writing next week."            │
│                                      │
│  ─────────────────────────────────   │
│  www.dev.to/dns-explained            │
│  Saved: 2 min ago                    │
│  From: Browser Extension             │
│  While viewing: "React Hooks"        │
└──────────────────────────────────────┘
```

---

## Undo

### Undo Window

Every capture has a 5-second undo window:

| Action | Undo Behavior |
|---|---|
| **Save** | Move to trash (soft delete) |
| **Delete** | Restore (set status back to active) |
| **Archive** | Unarchive (set status back to active) |
| **Move to collection** | Remove from collection |
| **Favorite** | Unfavorite |

### Undo UX

```
Toast: "Saved" [Undo]
        ↓ (tap Undo within 5s)
Toast: "Undone" (fades)
```

After 5 seconds, the undo option disappears. The action is permanent (but recoverable from Trash).

---

## Capture Metrics

### Success Metrics

| Metric | Target | Why |
|---|---|---|
| **Average capture time** | < 3 seconds | Measures friction |
| **Capture completion rate** | > 95% | Measures abandonment |
| **Capture abandonment** | < 5% | Measures confusion/friction |
| **Duplicate rate** | < 10% | Measures awareness |
| **Optional fields used** | < 30% | Measures if defaults are correct |
| **Offline queue success** | > 99% | Measures queue reliability |
| **Processing completion** | > 98% | Measures pipeline health |
| **Undo usage** | < 5% | Measures regret rate |

### Tracking

Every capture event logs:

| Field | Purpose |
|---|---|
| `source` | Platform (extension, mobile, web) |
| `type` | reference, note, document |
| `duration` | Time from initiate to confirmation |
| `fields_used` | Which optional fields were filled |
| `collection_selected` | Manual or suggested or none |
| `status` | Final capture status |
| `duplicate` | Was this a duplicate? |
| `offline` | Was it queued offline? |

These metrics drive product decisions. If "optional fields used" is high, the defaults are wrong. If "abandonment" is high, the flow has too much friction.

---

## Zero-Friction Checklist

Before shipping any capture flow, verify:

- [ ] Can the user save in under 5 seconds?
- [ ] Is every optional field truly optional?
- [ ] Does the system infer everything it can?
- [ ] Is the confirmation instant (<500ms)?
- [ ] Does the user return to their original context?
- [ ] Is the failure path non-blocking?
- [ ] Is there an undo path?
- [ ] Is context preserved?
- [ ] Would a first-time user understand it?
- [ ] Would a power user be annoyed by it?

If any answer is "no," the flow needs simplification.

---

## Future Capture Opportunities

### Clipboard Detection

The app watches the clipboard for URLs. When a URL is detected (and the app is in focus), a subtle notification appears:

```
┌──────────────────────────┐
│  Copy a link?  [Save] [X]│
└──────────────────────────┘
```

- One tap to save. No interaction required to dismiss.
- Only activates when the user has copied a URL in the last 30 seconds.
- Can be disabled in settings.

### Voice Capture

"Hey Devventory, save this for later."

- Listens for trigger phrase + content
- Transcribes and saves as a note
- Returns audio confirmation

### Email Capture

- User forwards email to `save@devventory.app`
- Email content is parsed and saved as a reference or note
- Subject becomes title, body becomes content

### Drag & Drop

- Desktop: drag URL from address bar onto Devventory window
- Mobile: drag text into Devventory (future gesture)

### Watch Capture (Apple Watch)

- Minimal UI: one button to capture current audio note
- Syncs to phone, then to server

---

## Open Questions

| Question | Decision Needed |
|---|---|
| Should the collection suggestion be shown in the toast or as a separate step? | Toast — preserves flow, allows change. |
| Should duplicate detection warn first or save silently? | Warn with toast. Silent save creates confusing duplicates. |
| Should the undo window be fixed 5s or configurable? | Fixed 5s. Configurable adds complexity for marginal value. |
| Should the processing skeleton show specific progress (e.g., "Summarizing...") or a generic spinner? | Specific progress. Builds trust, shows system is working. |
| Should the capture toast show on every save or only on the first save of a session? | Every save. Confirmation is reassurance. |
| Should clipboard detection work in the background? | No — only when app is focused. Background clipboard access is a privacy concern. |

---

## Success Criteria

After reading this document, every engineer, designer, and product manager should understand:

- What great capture feels like (one tap, instant, invisible)
- Why every interaction exists (minimum friction, maximum context)
- How friction is minimized (progressive disclosure, intelligent defaults)
- How Devventory differs from traditional bookmarking (context preservation, instant confirmation, background processing)
- How every platform provides a native capture experience (extension, mobile, web)
- How failures are handled without interrupting the user (toast, queue, retry)

The Capture Experience should become one of Devventory's defining characteristics — not simply another upload flow.
