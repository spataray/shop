# Shop - Project Context

Shop is a classy, bilingual (Thai/English) shopping calculator and currency exchange tool designed for quick discount and tax calculations, as well as USD/THB exchange rate tracking.

## 🚀 Project Overview

*   **Purpose:** Helps users calculate final prices after discounts and taxes, and track currency exchange trends between USD and THB.
*   **Core Technology:** Static Web Stack (HTML5, CSS3, ES6 JavaScript, Chart.js).
*   **Key Features:**
    *   **Bilingual Toggle:** Instant switch between Thai and English (Thai default).
    *   **Discount & Tax Calculation:** Simple inputs for price, discount %, and optional tax.
    *   **Money Exchange Mode:** Real-time USD/THB conversion and historical trend graphs (1, 3, 6, 9, 12 months).
    *   **Classy UI:** Elegant "Gold & Noir" aesthetic for a high-end luxury feel.
    *   **Persistence:** Remembers the last used tax rate and font size.
*   **Architecture:** Single-page application (SPA).

## 🛠️ Building and Running

Since this is a static web application, it does not require a compilation step.

*   **Local Development:** Open `index.html` directly in any modern web browser.
*   **Deployment:** Host via GitHub Pages or any static web server.

## 📂 Key Files

*   `index.html`: UI structure, language containers, and mode sections.
*   `style.css`: Luxury-themed styling (Gold & Noir) and responsive layout.
*   `script.js`: Calculation logic, exchange rate fetching, and chart rendering.
*   `GEMINI.md`: Project-specific context and development guidelines.

## 📜 Development Conventions

*   **Bilingual Content:** Use the `data-i18n` attribute in HTML and the `i18n` object in `script.js` for all text.
*   **Version Tracking:** Update the version tag in `index.html` (`#version-tag`) when making changes. The format is `vX.X.X (YYYY-MM-DD HH:mm TIMEZONE)`.
*   **Aesthetics:** Maintain the "Gold & Noir" (gold and charcoal) high-end look.
*   **Charts:** Uses Chart.js via CDN for trend graphs.

## 🧪 Testing

Testing is performed manually by:
1.  Verifying the math for various discount and tax scenarios.
2.  Checking the currency exchange rate accuracy against live sources.
3.  Ensuring the trend graph updates correctly for different timeframes.
4.  Checking the language toggle for consistency across all labels in both modes.
5.  Ensuring mobile responsiveness on phone-sized browser views.
