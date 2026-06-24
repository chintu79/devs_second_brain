# Dev Second Brain

## Overview

Dev Second Brain is a personal knowledge management platform designed specifically for developers.

The goal is not to replace note-taking applications but to solve a common developer problem:

* Forgetting useful GitHub repositories
* Losing valuable prompts
* Forgetting project ideas
* Losing track of learning resources
* Forgetting implementation plans
* Missing important open-source trends

The platform acts as a centralized developer memory system where knowledge can be captured, organized, searched, rediscovered, and later enhanced with AI.

---

# Vision

A single platform where a developer can:

* Save resources
* Save prompts
* Save notes
* Manage projects
* Track open-source trends
* Rediscover forgotten knowledge
* Search across all saved information
* Eventually interact with their entire knowledge base using AI

---

# Tech Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Next.js API Routes

Database:

* PostgreSQL
* Prisma ORM

Authentication:

* NextAuth / Clerk

Deployment:

* Vercel
* Supabase PostgreSQL

---

# Phase 1 (MVP)

## Resource Vault

Purpose:

Store useful links from:

* GitHub
* Blogs
* Documentation
* YouTube
* Reddit
* Hacker News

Fields:

* id
* title
* url
* category
* tags
* notes
* createdAt

Features:

* Add resource
* Edit resource
* Delete resource
* Search resources
* Filter by category
* Filter by tags

---

## Prompt Vault

Purpose:

Store reusable AI prompts.

Fields:

* id
* title
* prompt
* category
* tags
* useCase
* favorite
* createdAt

Features:

* Save prompt
* Copy prompt
* Search prompt
* Favorite prompt

---

## Notes Vault

Purpose:

Store markdown-based technical notes.

Fields:

* id
* title
* content
* category
* tags
* createdAt

Features:

* Markdown editor
* Markdown preview
* Search notes
* Categorization

---

## Project Vault

Purpose:

Store project ideas and implementation plans.

Fields:

* id
* title
* description
* status
* techStack
* tags

Each project contains:

* Overview
* Notes
* Resources
* plan.md

Folder Example:

projects/
├── zonecast/
│   ├── plan.md
│   ├── notes.md
│   └── resources.json

Features:

* Create project
* Update project
* Attach resources
* View plan.md
* Project status tracking

Status Options:

* Idea
* Research
* Planning
* Building
* Completed
* Archived

---

## Open Source Radar

Purpose:

Track trending open-source projects.

Sources:

* GitHub Trending
* GitHub Search API

Features:

* Trending Today
* Trending This Week
* AI Repositories
* Flutter Repositories
* Web Development Repositories
* Good First Issues

Users can bookmark repositories directly into Resource Vault.

---

## Global Search

Search across:

* Resources
* Prompts
* Notes
* Projects

Search Methods:

* Title
* Tags
* Category
* Content

---

# Database Design

Tables:

users

resources

prompts

notes

projects

project_resources

saved_repositories

tags

---

# Phase 2 (Automation)

## Automatic Metadata Extraction

Input:

URL

System automatically extracts:

* Title
* Description
* Keywords
* Source

---

## AI Tag Generation

Generate:

* Categories
* Relevant Tags

Automatically.

---

## AI Summaries

Generate summaries for:

* GitHub Repositories
* Articles
* Blogs
* YouTube Videos

Output:

* Summary
* Key Learnings
* Use Cases

---

## Daily Developer Feed

Aggregate:

* GitHub Trending
* Hacker News
* Dev.to
* Reddit

Single dashboard.

---

# Phase 3 (AI Layer)

## Semantic Search

Search using meaning instead of keywords.

Example:

Search:

"speech recognition"

Returns:

* Whisper repositories
* Vosk notes
* Jarvis project

Even when exact words are absent.

Technology:

* pgvector
* Embeddings
* Ollama

---

## AI Assistant

Chat with entire knowledge base.

Examples:

"What AI projects have I saved?"

"Show Flutter resources from last month."

"What projects are still in planning stage?"

---

## Project Advisor

AI can analyze projects and provide:

* Current status
* Missing tasks
* Recommended next steps
* Related saved resources

---

# Phase 4 (Capture Layer)

## Browser Extension

Purpose:

One-click saving.

Supported Sites:

* GitHub
* YouTube
* Reddit
* Dev.to
* Blogs
* Documentation

Actions:

Save Resource

Save Prompt

Save Note

---

## Smart Categorization

Automatically classify saved content.

Example:

GitHub Repository

→ AI

→ Machine Learning

→ Python

---

## Developer Workspace

Quick access dashboard.

Categories:

AI

Flutter

Web Development

Linux

DevOps

Each category contains:

* Saved Resources
* Trending Content
* Important Links

---

# Future Features

## Forgotten Gems

Daily resurfacing system.

Examples:

"You saved this repository 8 months ago."

"You bookmarked this article while building Jarvis."

Purpose:

Rediscover forgotten knowledge.

---

## Learning Tracker

Track progress for:

* Flutter
* AI/ML
* DSA
* DevOps

---

## Knowledge Timeline

Visual history of:

* Saved resources
* Projects
* Notes
* Prompts

---

# Guiding Principle

The system should optimize for:

1. Fast Capture
2. Easy Retrieval
3. Knowledge Rediscovery

Saving information is not enough.

The platform must help developers find the right information at the right time.
