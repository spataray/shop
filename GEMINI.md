# Shop - Project Context

Shop is a classy, bilingual (Thai/English) shopping calculator designed for quick discount and tax calculations.

## 🚀 Project Overview

*   **Purpose:** Helps users calculate final prices after discounts and taxes while shopping.
*   **Core Technology:** Static Web Stack (HTML5, CSS3, ES6 JavaScript).
*   **Key Features:**
    *   **Bilingual Toggle:** Instant switch between Thai and English (Thai default).
    *   **Discount & Tax Calculation:** Simple inputs for price, discount %, and optional tax.
    *   **Classy UI:** Elegant "Gold & Noir" aesthetic for a premium shopping feel.
    *   **Persistence:** Remembers the last used tax rate.
*   **Architecture:** Single-page application (SPA).

## 🛠️ Building and Running

Since this is a static web application, it does not require a compilation step.

*   **Local Development:** Open `index.html` directly in any modern web browser.
*   **Deployment:** Host via GitHub Pages or any static web server.

## 📂 Key Files

*   `index.html`: UI structure and language containers.
*   `style.css`: Luxury-themed styling and responsive layout.
*   `script.js`: Calculation logic and language state management.
*   `GEMINI.md`: Project-specific context and development guidelines.

## 📜 Development Conventions

*   **Bilingual Content:** Use the `data-i18n` attribute in HTML and the `i18n` object in `script.js` for all text.
*   **Version Tracking:** Update the version tag in `index.html` (`#version-tag`) when making changes. The format is `vX.X.X (YYYY-MM-DD HH:mm TIMEZONE)`.
*   **Aesthetics:** Maintain the gold and charcoal high-end look.

## 🧪 Testing

Testing is performed manually by:
1.  Verifying the math for various discount and tax scenarios.
2.  Checking the language toggle for consistency across all labels.
3.  Ensuring mobile responsiveness on phone-sized browser views.
