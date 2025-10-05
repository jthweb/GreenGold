# GreenGold - AI Farming Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GreenGold is the first-prize winning project from the "Reboot the Earth" Hackathon (Doha Edition), hosted at Carnegie Mellon University in Qatar.**

The hackathon was organized by the UN Office of Information and Communications Technology, the Food and Agriculture Organization (FAO), Salesforce, the Digital Public Goods Alliance, and Carnegie Mellon University.

---

## Overview

GreenGold is an intelligent, multilingual AI-powered assistant designed to empower farmers with actionable insights for sustainable and productive agriculture. By leveraging the power of Google's Gemini API, GreenGold provides a comprehensive suite of tools, from a real-time farm dashboard to an interactive chat assistant that can analyze plant health from images.

Our mission is to bridge the technology gap for farmers, providing them with sophisticated yet easy-to-use tools to optimize resource usage, increase crop yield, and promote sustainable farming practices.

## Key Features

-   **Interactive AI Chat**: Get instant, expert advice on your farming questions. The AI provides context-aware responses based on your specific farm data.
-   **Image Analysis**: Take a picture of your plant, and our AI will analyze its health, identify potential diseases, and suggest remedies.
-   **Comprehensive Dashboard**: A real-time overview of your farm's vital signs, including:
    -   Soil Moisture & Smart Irrigation Control
    -   Weather Forecasts & Analysis
    -   Soil pH & Salinity Levels
    -   NPK (Nitrogen, Phosphorus, Potassium) Nutrient Balance
    -   AI-driven Recommendations and Critical Alerts
    -   Market Analysis for key crops
-   **Multi-language Support**: Fully localized UI and AI responses in 9 languages, including Arabic, Hindi, Spanish, and more.
-   **Data Visualization**: Understand complex data easily through interactive charts and graphs.
-   **Text-to-Speech**: Listen to the AI's responses for a hands-free experience.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: Google Gemini API (`gemini-2.5-flash`)
-   **Charting**: Custom SVG components

## Getting Started

### Prerequisites

-   A modern web browser.
-   A Google Gemini API Key.

### Local Development

This project is set up to run directly in a browser-based development environment that can serve static files and manage environment variables, such as Google AI Studio or a similar platform.

1.  **Set up your environment variables:**
    Ensure your development environment has a variable named `API_KEY` set to your valid Google Gemini API Key. The application reads the key directly from `process.env.API_KEY`.

2.  **Serve the files:**
    Use a simple static file server to serve the `index.html` at the root. All module imports are handled via an import map in `index.html`.

### Deployment

This is a static web application. You can deploy it to any static hosting service.

1.  **Prepare your files:**
    Ensure all your source files (`.tsx`, `.html`, `.json`, etc.) are ready. No build step is required as it uses browser-native ES modules.

2.  **Deploy:**
    Deploy the entire project folder to a static hosting provider like:
    -   Vercel
    -   Netlify
    -   Firebase Hosting
    -   Google Cloud Storage

    **Crucially**, you must configure the `API_KEY` as an environment variable within your hosting provider's settings. The application will not function without it.

## Contributing

Contributions are welcome! This project was born in a hackathon, and we believe in the power of the community to help it grow and make a real impact. Whether you're a developer, a designer, or an agriculture expert, we'd love your help to scale up this project.

Please feel free to fork the repository, make changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License.