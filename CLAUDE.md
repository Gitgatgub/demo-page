# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website for AiArmyAgents - an AI phone answering service for SMBs. The site includes a white-label configuration system that allows agencies to customize the branding and content for their clients.

## Architecture

### Core Structure
- **Static HTML pages**: Main content pages are mostly empty placeholder files, with the primary content in `index.html`
- **JavaScript modules**:
  - `js/main.js` - Main site functionality including stats animations and intersection observers
  - `js/calculator.js` - ROI calculator functionality
  - `js/white-label-config.js` - White-label configuration system for agencies
- **CSS files**:
  - `css/styles.css` - Main styles
  - `css/responsive.css` - Responsive design styles

### White Label System
The site uses a configuration-based white-label system in `js/white-label-config.js` that allows agencies to customize:
- Brand name and agency name
- Logo URL
- Contact phone numbers
- Form endpoints
- Video URLs
- Agency ID for tracking

### Key Pages
- `index.html` - Main landing page with full content (34KB)
- `privacy.html` - Privacy policy page (3.6KB)
- `terms.html` - Terms of service page (31KB)
- `thank-you.html` - Thank you page (1.7KB)
- Other pages (`about.html`, `case-studies.html`, `contact.html`, `features.html`, `pricing.html`) are placeholder files (0 bytes)

## Development Commands

This is a static website with no build system or package.json. Development involves:
- Direct file editing of HTML, CSS, and JavaScript
- Opening `index.html` in a browser for testing
- No compilation or build steps required

## Key Components

### ROI Calculator
Interactive calculator in `js/calculator.js` that calculates missed leads and lost revenue based on:
- Weekly calls input
- Close rate percentage
- Average deal value

### Stats Animation
Count-up animations for statistics using Intersection Observer API in `js/main.js`

### Form Integration
Forms submit to Formspree endpoint configured in white-label config

## Important Notes

- The site is designed to be easily customizable through the white-label config
- Most HTML pages are placeholders - the main content is in `index.html`
- No package manager or build tools are used
- Images are stored in `/images` directory
- The site targets SMB clients for AI phone answering services