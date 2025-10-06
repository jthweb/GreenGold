<p align="center">
  <img src="./assets/logo.svg" alt="GreenGold Logo" width="150">
</p>
<h1 align="center">GreenGold - Your AI Farming Assistant</h1>

<p align="center">
  <em>Originally conceived at the "Reboot the Earth" Hackathon in Doha, hosted at Carnegie Mellon University in Qatar.</em>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  </a>
</p>

---

## About The Project

GreenGold started as a passion project during a hackathon, born from a desire to make modern technology accessible and useful for farmers everywhere. Our goal is to empower farmers with a smart, easy-to-use tool that provides real, actionable advice for sustainable and productive agriculture. We believe that by bridging the technology gap, we can help optimize resources, increase crop yields, and promote a healthier planet.

This isn't just an app; it's a partner for your farm. It combines a real-time dashboard of your farm's vital signs with an intelligent chat assistant that's always ready to help.

## Key Features

-   **User Accounts & Personalized Farms**: Sign up and save your unique farm details—size, crops, and conditions—for a truly tailored AI experience.
-   **Interactive AI Chat**: Have a conversation with an AI that understands your farm's live data. Ask questions, get advice, and receive clear, actionable steps.
-   **Voice-to-Text Input**: Speak your questions directly to the AI in your selected language.
-   **Visual Plant Health Analysis**: Snap a photo of a plant or upload an image file, and our AI will analyze its health, identify potential issues, and suggest solutions.
-   **All-in-One Farm Dashboard**: See everything at a glance with our comprehensive suite of widgets.
-   **Multi-Language Support**: The interface and AI responses are available in over a dozen languages to support farmers globally.
-   **Language-Aware Text-to-Speech**: Listen to the AI's advice in the selected language, perfect for when you're busy in the field.
-   **Light & Dark Modes**: Choose the theme that works best for your environment.

## The Dashboard at a Glance

Our dashboard provides a live, interactive overview of your farm's key metrics:

-   **Time & Weather**: Personalized greetings based on the time of day and live, simulated weather conditions that affect the entire dashboard.
-   **Irrigation Advisor**: An AI-powered summary that tells you exactly what irrigation action to take (or not take) based on all available data.
-   **Soil Moisture**: A live look at your soil's hydration levels, complete with an interactive irrigation and drainage simulation.
-   **NPK Nutrient Levels**: Track the balance of Nitrogen (N), Phosphorus (P), and Potassium (K), and simulate fertigation to correct imbalances.
-   **Soil Health**: Monitor Soil pH and Salinity (EC) levels to ensure optimal growing conditions.
-   **Critical Alerts & Recommendations**: Get immediate, AI-driven alerts for urgent issues and proactive recommendations for improving your farm's health.
-   **Farm Analytics**: Visualize your crop distribution, track market price trends for your key crops, and see your positive impact on yield and water savings.
-   **Quick Actions**: Easily access common tasks like logging new data or initiating a soil test.

## Supported Languages

The app is currently available in: English, Arabic, Hindi, Malayalam, Bengali, Chinese (Mandarin), Dutch, French, German, Indonesian, Italian, Japanese, Kannada, Korean, Portuguese, Russian, Spanish, and Turkish.

## Built With

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: gemma3:latest (trained with multiple opensource datasets from Kaggle)
-   **Charting**: Custom SVG components

## Future Plans

We're always thinking about what's next. Here are some features on our roadmap:

-   **IoT Device Integration**: The ultimate goal is to connect GreenGold to real-world IoT sensors for fully automated, live data tracking from your fields.
-   **Historical Data & Trend Analysis**: Go beyond real-time data to view historical trends for weather, soil conditions, and crop yields.
-   **Expanded Crop Database**: Add a wider variety of crops with specific data models for each.

## Getting Started

Want to run GreenGold on your own machine? Here’s how.

### Prerequisites

You'll need an API key. This project is configured to read it from an environment variable named `API_KEY`.

### Local Development

This project is built with TypeScript and React, but it uses a modern browser-based setup with import maps, so there's no complex build step required for development.

1.  **Set up your environment variable**: In the environment where you will serve the files, ensure the `API_KEY` variable is set to your valid API key. The application will not work without it.

2.  **Serve the project folder**: Use a simple local web server to serve the project's root directory.
    -   **Using VS Code's Live Server Extension**: Simply right-click on `index.html` and select "Open with Live Server".
    -   **Using Python**: In your terminal, run `python -m http.server`.
    -   **Using Node.js**: Install `serve` globally (`npm install -g serve`) and run `serve` in the project directory.

Once the server is running, open your browser to the provided local address.

## How to Contribute

We welcome contributions with open arms! This project thrives on community involvement. Please read our **[Contributing Guidelines](CONTRIBUTING.md)** to get started.

## Changelog

Curious about what's new? Check out our **[Changelog](CHANGELOG.md)** to see the latest updates.

## Security

Found a security issue? Please review our **[Security Policy](SECURITY.md)** for information on how to report it.

## The GreenGold Team

This project was brought to life by a team of passionate individuals:
-   Jonathan Oommen Easow
-   Amitesh Vijayan Radhika
-   Biswajit Mishra
-   Mohammed Ali
-   Robin Thomas

## License

Distributed under the MIT License. See `LICENSE` for more information.