# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2024-08-01

### Added
- **User Authentication**: Implemented a full login/sign-up flow with persistent sessions using local storage.
- **Personalized Onboarding**: Added a first-time user setup screen to collect farm name, size, and primary crops.
- **Personalized AI**: The AI assistant now uses the user's specific farm details to provide more accurate and contextual advice.
- **Logging System**: Introduced a "Farm Logs" modal where users can view past entries and create new logs, which are auto-populated with the current dashboard state.
- **Persistent Header**: Added a new header component with the GreenGold logo, theme switcher, and a logout button for authenticated users.

### Changed
- **UI/UX Overhaul**: Replaced all major icons (AI Agent, Settings, Logs, Home, Chat, etc.) with a new, custom-designed SVG set for a more unique and polished visual identity.
- **Animations**: Improved the water bubble animation for a more realistic effect and added new hover and click animations throughout the app.
- **Widget Logic**: Updated the "Drain Water" button to be enabled whenever moisture is above 30%. Updated the "Start Irrigation" button to allow irrigation up to 110% moisture.
- **README**: Removed the outdated mention of the hackathon event.

## [1.4.0] - 2024-07-31

### Added
- **Mobile Navigation**: Implemented a dedicated bottom navigation bar for mobile views, featuring animated transitions for a more app-like experience.
- **AI Feedback**: Added a subtle "breathing" animation to the AI agent icon to indicate when it is processing a request.
- **Scrolling**: Enabled vertical scrolling on the main dashboard to ensure all widgets are accessible on any screen size.

### Changed
- **Responsive Layout**: Reworked the application layout to completely hide the dashboard widgets when the chat view is active on mobile, providing a focused, full-screen experience.

## [1.3.0] - 2024-07-30

### Added
- **Dynamic UI**: Added animations for widget loading, chat message appearance, and interactive element hovers to make the interface more lively.
- **Evaporation Simulation**: The Soil Moisture widget now simulates natural water reduction over time due to evaporation and plant usage.
- **Manual Drainage**: Added a "Drain Water" button to the Soil Moisture widget for interactive control.
- **Dynamic Translations**: Upgraded the localization system to support dynamic placeholders in translation strings (e.g., "Weather is {weather}").

### Changed
- **Iconography**: Replaced the generic paperclip icon with a clearer "Upload" icon. The Irrigation Advisor now uses dynamic icons (check mark, exclamation, etc.) to reflect the current advice.
- **Language Switcher**: The language selector in the chat header is now a scrollable dropdown menu to accommodate all languages.
- **Irrigation Advisor**: The advisor widget now populates with dynamic, real-time data from the dashboard.

## [1.2.0] - 2024-07-30

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

## [1.1.1] - 2024-07-29

### Added
- **Theme Toggle**: Implemented a manual light/dark mode theme switcher.

### Changed
- **AI Performance**: Optimized the Gemini API call for faster responses by adjusting the model configuration.
- **AI Context**: Updated the default AI context and dashboard widgets to be specific to UK agriculture (e.g., Barley, Rapeseed) for a more focused demo.
- **Documentation**: Added sections on dashboard features and future plans to `README.md`.

## [1.1.0] - 2024-07-29

### Added
- **Language Expansion**: Added support for 5 new languages: German, Italian, Russian, Japanese, and Korean.
- **Project Documentation**: Created `CONTRIBUTING.md`, `CHANGELOG.md`, and `SECURITY.md` files.
- **Branding**: Added a "Made by JThweb" watermark and created a static `assets/logo.svg` file.

### Changed
- **README**: Rewrote the README to have a more human, community-focused tone.
- **Assets**: The app now uses the static SVG file for its logo and favicon.

## [1.0.0] - 2024-05-18

### Added
- Initial release of the GreenGold application.
- Core features including AI Chat, Image Analysis, and Dashboard.
- Support for 9 languages.
