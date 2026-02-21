# 🍳 CookEasy: Bridge the "Video Gap"

**CookEasy** is a cross-platform mobile application designed to turn culinary inspiration into reality. By leveraging high-speed AI, we eliminate the friction between watching a cooking video and actually preparing the meal.

## 🚀 The Problem: The "Video Gap"

Amateur cooks often face "information overload" from unorganized bookmarks and screenshots. There is currently no seamless way to extract a structured grocery list from a YouTube or social media video without tedious manual transcription. This disconnect leads to "piles" of recipes that are never cooked.

## ✨ Key Features

* **AI Video Extraction:** Paste a YouTube link, and our Llama-powered backend parses the transcript to generate an instant, categorized grocery list.
* **Inventory-First Engine:** Suggests recipes based on what you already have in your pantry (minimum 75% match rate).
* **Hands-Free Assistant:** Step-by-step guidance with integrated automated timers to prevent execution failure.
* **Integrated Marketplace:** Buy missing ingredients directly from local retailers via our built-in API.

## 📱 App Preview

| Extraction Screen | Pantry Inventory |
| --- | --- |
|  |  |
| *Paste link & parse* | *Track your ingredients* |

## 🛠️ Tech Stack

* **Frontend:** React, Ionic Framework, TypeScript (Cross-platform iOS/Android)
* **Backend:** Node.js
* **AI Engine:** Llama 3 via **Groq API** (High-speed NLP)
* **Monetization:** RevenueCat (Subscription management)
* **Database:** PostgreSQL (User data & Recipe management)

## 🏗️ How It Works

1. **Input:** User provides a video URL.
2. **Process:** Node.js fetches the transcript and sends it to the **Groq API**.
3. **Inference:** Llama extracts ingredients and steps, returning a structured JSON object.
4. **Action:** The app compares the list to the user's digital pantry and offers a "one-tap" purchase for missing items.

## 📈 What's Next

* **Live Testing:** Onboarding our first local grocery partner to validate the "Buy Missing Ingredients" API.
* **Community Cookbook:** Expanding the database to allow users to share their AI-extracted recipes with friends.

---

### 🎥 Video Demo

Check out the full walkthrough of CookEasy here: [https://youtu.be/0Yw5qaIrCcA](https://youtu.be/0Yw5qaIrCcA)

---

### How to use this README:

1. **Screenshots:** Upload your 4 screenshots to a folder named `screenshots` in your repository.
2. **Update Links:** Replace the placeholder image URLs (e.g., `https://via.placeholder.com/...`) with the relative path to your images, like `./screenshots/home.png`.
3. **License:** If you have a specific license (MIT, Apache), feel free to add a section at the bottom!






























🛒 Cook Easy
A mobile-first React application built with Ionic Framework and Capacitor.
🚀 Getting Started
Prerequisites

Before you begin, ensure you have the following installed:

    Node.js (v16.x or higher)

    npm or yarn

    Ionic CLI (npm install -g @ionic/cli)

Installation

    Clone the repository:
    Bash

    git clone https://github.com/your-username/grocery-deals-app.git
    cd grocery-deals-app

    Install dependencies:
    Bash

    npm install

    Run the App in the Browser:
    Bash

    ionic serve
