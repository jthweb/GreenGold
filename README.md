<p align="center">
  <img src="data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='goldGradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23D4A22E;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23FBBF24;stop-opacity:1'/%3E%3C/linearGradient%3E%3ClinearGradient id='greenGradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234A5C50;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%2338483E;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50 2 C23.49 2 2 23.49 2 50 C2 76.51 23.49 98 50 98 S98 76.51 98 50 C98 23.49 76.51 2 50 2 Z' fill='url(%23greenGradient)'/%3E%3Cpath d='M50 15 C69.33 15 85 30.67 85 50 C85 55.62 83.2 60.83 80.1 65.17 C75 52.8 63.6 44 50 44 S25 52.8 19.9 65.17 C16.8 60.83 15 55.62 15 50 C15 30.67 30.67 15 50 15 Z' fill='url(%23goldGradient)'/%3E%3C/svg%3E" alt="GreenGold Logo" width="150">
</p>

# GreenGold - AI Farming Assistant for Sustainable Agriculture

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GreenGold is the first-prize winning project from the "Reboot the Earth" Hackathon (Doha Edition), hosted at Carnegie Mellon University in Qatar.**

The hackathon was organized by the UN Office of Information and Communications Technology, the Food and Agriculture Organization (FAO), Salesforce, the Digital Public Goods Alliance, and Carnegie Mellon University.

---

## Overview

**GreenGold is an intelligent, multilingual AI-powered assistant designed to empower farmers with actionable insights for sustainable and productive agriculture.** Our mission is to bridge the technology gap for farmers, providing them with sophisticated yet easy-to-use tools to optimize resource usage, increase crop yield, and promote sustainable farming practices like smart irrigation and integrated pest management.

By leveraging cutting-edge AI, GreenGold provides a comprehensive suite of tools, from a real-time farm dashboard to an interactive chat assistant that can analyze plant health from images and provide expert agritech advice.

## AI Model & Training

GreenGold's intelligence is built upon the powerful open-source **Gemma** model family.

The model is continuously being trained and fine-tuned on a diverse collection of open-source agricultural datasets from platforms like Kaggle, covering topics such as crop health, soil science, pest identification, and crop management.

To ensure reliability even in areas with poor connectivity, GreenGold also incorporates a robust rule-based system. This has been trained on thousands of common farming questions, enabling an edge-based service that provides instant answers for frequently asked questions without requiring internet access.

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
-   **AI Model**: Open-source Gemma family models
-   **Charting**: Custom SVG components

## Getting Started

### Prerequisites

-   A modern web browser.
-   An API Key from a cloud provider that serves the AI model.

### Local Development

This project is set up to run directly in a browser-based development environment that can serve static files and manage environment variables.

1.  **Set up your environment variables:**
    Ensure your development environment has a variable named `API_KEY` set to your valid API Key. The application reads the key directly from `process.env.API_KEY`.

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

## The GreenGold Team

-   Jonathan Oommen Easow
-   Amitesh Vijayan Radhika
-   Biswajit Mishra
-   Mohammed Ali
-   Robin Thomas

## License

Distributed under the MIT License.
