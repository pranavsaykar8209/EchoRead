# EchoRead - Synchronization Architecture

> **Purpose**
>
> This document describes the proposed synchronization architecture for EchoRead.
>
> It focuses on the overall approach and design decisions.
> Implementation details will be documented separately during development.

---

# Problem Statement

EchoRead synchronizes a PDF book with its audiobook.

The challenge is that:

* A PDF contains pages and text.
* An audiobook only contains audio.
* There is no direct mapping between a page and its audio timestamp.

The synchronization engine is responsible for creating this mapping.

---

# Goals

Our architecture should:

* Allow users to upload a PDF and audiobook only once.
* Let users start reading as quickly as possible.
* Support jumping to any page.
* Continue synchronization in the background.
* Cache synchronization data locally.
* Avoid repeating the same work.

---

# High-Level Architecture

```text
                Upload PDF + Audiobook
                         │
                         ▼
               Extract PDF Text
                         │
                         ▼
      Generate Initial Synchronization
      (First few pages only)
                         │
                         ▼
             Reader Ready to Use
                         │
                         ▼
          Generate Audio Anchors
      (Approximate locations in audio)
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
 Start Reading                    Jump To Any Page
        │                                 │
        ▼                                 ▼
 Background Sync              Use Nearest Anchor
        │                                 │
        └────────────────┬────────────────┘
                         ▼
             Generate Page Synchronization
                         │
                         ▼
             Save Everything Locally
```

---

# Synchronization Flow

The synchronization process happens in three stages.

## Stage 1 — Initial Synchronization

After upload, EchoRead synchronizes only the beginning of the book.

This allows users who start reading from Page 1 to begin immediately without waiting for the full audiobook to be processed.

---

## Stage 2 — Audio Anchors

EchoRead generates lightweight anchor points throughout the audiobook.

These anchors provide approximate navigation points that help users quickly access different parts of the book.

> **Note**
>
> The exact anchor generation algorithm will be finalized during implementation.

---

## Stage 3 — Background Synchronization

Once the reader is open, EchoRead continues synchronizing the remaining audiobook in the background.

As synchronization progresses, more pages become instantly available.

Eventually, the entire book is synchronized.

---

# Reading Scenarios

## Scenario 1 — Start From Beginning

* User uploads a book.
* Initial pages are already synchronized.
* Reading starts immediately.
* Remaining pages synchronize in the background.

---

## Scenario 2 — Jump To Any Page

* User opens any page.
* If the page is already synchronized, it opens immediately.
* Otherwise, EchoRead uses the nearest available anchor to synchronize only the required section.
* Background synchronization continues independently.

---

# Local Storage

EchoRead is designed as a local-first application.

Synchronization data is stored on the user's device.

This may include:

* Book metadata
* Reading progress
* Generated transcript
* Audio anchors
* Synchronization data
* Bookmarks
* User settings

The exact storage implementation will be decided during development.

---

# Benefits

This architecture provides several advantages:

* Fast startup experience
* Immediate reading from the beginning
* Supports jumping to any page
* Background processing improves the experience over time
* Fully offline
* No backend required
* No cloud storage required
* Synchronization is generated only once and reused

---

# Future Improvements

Possible enhancements include:

* Smarter anchor generation
* Chapter-aware synchronization
* Better matching accuracy
* Synchronization recovery
* EPUB support
* Export/Import synchronization cache

These improvements are outside the scope of the initial implementation.

---

# Summary

EchoRead uses a hybrid synchronization approach.

Instead of waiting for the complete audiobook to be processed, the application prepares only what is immediately required, provides lightweight navigation anchors, and continues synchronizing the remaining content in the background.

This architecture prioritizes a smooth user experience while keeping the system simple, offline-first, and scalable.
