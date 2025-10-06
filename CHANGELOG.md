# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2025-10-06

### Added
- **Desktop Navigation**: Added icons for "Logs" and "Settings" to the main header for easier access on desktop and larger screens.
- **Changelog Access**: Added a "View Changelog" button in the Settings panel to allow users to see the latest project updates.

### Changed
- **Premium UI Polish**: Redesigned the mobile bottom navigation bar with smoother, more modern animations. The active icon now gracefully slides up as its label fades in, removing the old underline indicator.
- **Onboarding Experience**: The transitions between onboarding steps are now smoothly animated for a more polished user flow.

### Fixed
- **Critical Onboarding Bug**: Fixed a major bug where pressing "Enter" in the name field would prematurely submit the form and skip the remaining setup steps.
- **Desktop Layout**: Fixed a critical layout issue where the fixed header would overlap and block content on desktop views. The main content area is now correctly padded.
- **Theme Switching**: The layout fix also resolved an issue where the theme toggle button could become unclickable due to overlapping elements.

## [1.6.0] - 2025-10-06

### Added
- **AI-Powered Personalization**: The app now calls the Gemini API upon user onboarding to determine the ideal moisture and pH ranges for the user's specific crops and soil type.
- **Functional Settings Panel**: Implemented a full settings page where users can update their name, password, and all farm details (size, crops, soil type). Changes are saved persistently.
- **Dynamic Widgets**: The `SoilMoistureWidget`, `PHWidget`, and `IrrigationAdvisorWidget` now use the AI-generated ideal conditions to provide truly personalized advice and visual alerts.
- **Dynamic Crop Widgets**: The `CropDistributionWidget` and `MarketAnalysisWidget` now dynamically display data based on the crops in the user's profile.

### Changed
- **UI/UX Overhaul**: Replaced all major icons with a new, consistent, open-source set (Heroicons) for a more professional look.
- **Improved Animations**:
    - The irrigation-in-progress indicator is now a more visually appealing "wave" animation.
    - The moisture droplet icon now pulses when levels are outside the ideal range.
    - The water bubble animation is more fluid and continuous.
- **Onboarding Flow**: Expanded the onboarding process to be a more comprehensive, multi-step flow that now includes `soilType` selection.
- **Dashboard Layout**: Ensured the main widget area is scrollable on all screen sizes.

### Fixed
- **Draining Logic**: Corrected a critical bug where the "Drain Water" function was not decreasing the moisture level. It now works as expected.
- **Irrigation Advisor Logic**: Fixed a bug where moisture levels above 100% were incorrectly reported as "Optimal". The advisor now correctly identifies this state as "Saturated".

## [1.5.0] - 2025-10-06

### Added
- **User Authentication**: Implemented a full login/sign-up flow with persistent sessions using local storage.
- **Personalized Onboarding**: Added a first-time user setup screen to collect farm name, size, and primary crops.
- **Personalized AI**: The AI assistant now uses the user's specific farm details to provide more accurate and contextual advice.
- **Logging System**: Introduced a "Farm Logs" modal where users can view past entries and create new logs, which are auto-populated with the current dashboard state.
- **Persistent Header**: Added a new header component with the GreenGold logo, theme switcher, and a logout button for authenticated users.

### Changed
- **README**: Removed the outdated mention of the hackathon event.

## [1.4.0] - 2025-10-06

### Added
- **Mobile Navigation**: Implemented a dedicated bottom navigation bar for mobile views, featuring animated transitions for a more app-like experience.
- **AI Feedback**: Added a subtle "breathing" animation to the AI agent icon to indicate when it is processing a request.

### Changed
- **Responsive Layout**: Reworked the application layout to completely hide the dashboard widgets when the chat view is active on mobile, providing a focused, full-screen experience.

## [1.3.0] - 2025-10-05

### Added
- **Dynamic UI**: Added animations for widget loading, chat message appearance, and interactive element hovers to make the interface more lively.
- **Evaporation Simulation**: The Soil Moisture widget now simulates natural water reduction over time due to evaporation and plant usage.
- **Manual Drainage**: Added a "Drain Water" button to the Soil Moisture widget for interactive control.
- **Dynamic Translations**: Upgraded the localization system to support dynamic placeholders in translation strings (e.g., "Weather is {weather}").

### Changed
- **Iconography**: Replaced the generic paperclip icon with a clearer "Upload" icon. The Irrigation Advisor now uses dynamic icons (check mark, exclamation, etc.) to reflect the current advice.
- **Language Switcher**: The language selector in the chat header is now a scrollable dropdown menu to accommodate all languages.
- **Irrigation Advisor**: The advisor widget now populates with dynamic, real-time data from the dashboard.

## [1.2.0] - 2025-10-05

### Added
- **Speech-to-Text**: Integrated the browser's Speech Recognition API for hands-free voice input in the chat.
- **File Upload**: Users can now upload an image file from their device in addition to using the camera.
- **Language-Aware TTS**: The Text-to-Speech feature now uses the currently selected language for more natural-sounding audio playback.
- **Functional Quick Actions**: The "Quick Actions" dashboard widget buttons are now functional and trigger predefined prompts to the AI.
- **Language Expansion**: Added support for 4 new languages: Malayalam, Indonesian, Turkish, and Dutch.
- **Animated Welcome**: The initial language selection screen now features entry animations.

### Changed
- **Responsiveness**: The entire application is now fully responsive and optimized for mobile devices.
- **Documentation**: Significantly updated `README.md` with accurate local deployment instructions, a detailed feature list, and updated AI model information. Re-ordered the language list.
- **Security**: Updated the contact email in `SECURITY.md`.

## [1.1.1] - 2025-10-04

### Added
- **Theme Toggle**: Implemented a manual light/dark mode theme switcher.

### Changed
- **AI Performance**: Optimized the Gemini API call for faster responses by adjusting the model configuration.
- **AI Context**: Updated the default AI context and dashboard widgets to be specific to UK agriculture (e.g., Barley, Rapeseed) for a more focused demo.
- **Documentation**: Added sections on dashboard features and future plans to `README.md`.

## [1.1.0] - 2025-10-04

### Added
- **Language Expansion**: Added support for 5 new languages: German, Italian, Russian, Japanese, and Korean.
- **Project Documentation**: Created `CONTRIBUTING.md`, `CHANGELOG.md`, and `SECURITY.md` files.
- **Branding**: Added a "Made by JThweb" watermark and created a static `assets/logo.svg` file.

### Changed
- **README**: Rewrote the README to have a more human, community-focused tone.
- **Assets**: The app now uses the static SVG file for its logo and favicon.

## [1.0.0] - 2025-10-03

### Added
- Initial release of the GreenGold application.
- Core features including AI Chat, Image Analysis, and Dashboard.
- Support for 9 languages.