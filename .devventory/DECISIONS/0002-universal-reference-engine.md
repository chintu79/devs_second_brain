# ADR 0002 — Universal Reference Engine

**Status:** Accepted

**Date:** 2026-07-08

---

## Context

The application had separate models for different content types (Resource for URLs, Note for personal notes, Prompt for AI prompts). This split made it hard to build cross-cutting features like search, tags, folders, and backlinks.

Additionally, the MVP philosophy focuses on References (external knowledge) as the primary content type.

## Decision

Build a universal reference model that handles any URL uniformly. No provider-specific workflows in the MVP.

The `Resource` model serves as the reference engine:
- Any URL is treated the same way
- Common schema: URL, title, description, category, tags, notes, reason
- Provider-specific metadata (GitHub stars, YouTube duration) goes into a generic `metadata` field (future)
- AI enrichment is provider-agnostic

## Consequences

Positive:
- Single model to maintain
- All cross-cutting features (search, folders, tags, backlinks) work uniformly
- Simpler extension API
- Easier to add new URL types

Negative:
- Provider-specific features (e.g., showing GitHub stars) require extra work
- Cannot optimize UX for specific providers without adding conditional logic
- Some metadata is lost (e.g., YouTube video duration) in MVP

## Alternatives Considered

1. **Per-provider models** — Rejected: too complex for MVP, would need migrations for each new provider
2. **Content-addressable storage** — Rejected: over-engineering for MVP
3. **Webhook-based enrichment** — Rejected: adds latency, not needed for MVP
