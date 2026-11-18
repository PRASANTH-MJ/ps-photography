# PS Photography — website

Multi-page static site. Open `index.html` in a browser, or upload the whole folder to any static host (Hostinger, Netlify, GitHub Pages).

Pages: index (home), shoots, portfolio, albums (albums & frames), packages, contact.

## Editing
The pages are generated. Edit the source, then run `python3 build.py`.
- Header, footer, logo, page titles, home-only sections: `build.py`
- Page sections (shoots, portfolio, albums, frames, packages, FAQ, booking form…): `src/sections/*.html`
- Styles: `styles.css` · Behaviour: `script.js`
- WhatsApp number: `WHATSAPP_NUMBER` in script.js and `WA`/`PHONE` in build.py
- Frame sizes/prices: `SIZES` and `STYLES` in script.js

## Placeholders to replace before going live
Phone, email, Anna Nagar address, all prices, testimonials, social links, and the photos in images/ (Unsplash stock).
Links like `contact.html?type=Wedding` pre-select the shoot type in the booking form.
