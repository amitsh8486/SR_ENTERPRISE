# S R Enterprise – Company Website

## 1. Project overview

A static, responsive business-profile website for **S R Enterprise**, a wooden materials supplier and dealer based in Jorabagan, Howrah, Kolkata.

- Pure HTML5, CSS3 and JavaScript – no build step, no framework, no dependencies.
- **No database and no backend.** Enquiries are sent by opening WhatsApp with a pre-filled message; nothing is stored anywhere.
- Sections: Home, About Us, Products, Why Choose Us, Our Materials, Business Process, Contact, Footer.

## 2. Folder structure

```
SR_ENTERPRISE/
├── index.html            Page content and SEO metadata
├── README.md             This file
├── css/
│   └── style.css         All styling (colours are variables at the top)
├── js/
│   └── script.js         Company configuration + interactivity
└── assets/
    ├── images/           Hero, product and gallery images
    └── icons/            favicon.svg
```

## 3. How to run locally

No installation is required.

- **Simplest:** double-click `index.html` to open it in your browser.
- **Optional local server** (if you have Python installed): run `python -m http.server 8000` inside the folder and open <http://localhost:8000>.
- In VS Code you can also use the *Live Server* extension.

## 4. How to change company information

Open [js/script.js](js/script.js). The block at the very top is the single place for company details:

```javascript
const COMPANY = {
  name: 'S R Enterprise',
  phone: '+91 9876543212',
  whatsapp: '+91 9876543212',
  email: 'srenterprise170701@gmail.com',
  address: 'Jorabagan, Howrah, Kolkata',
  hours: '9:00 AM - 9:00 PM',
  whatsappMessage: 'Hello S R Enterprise, I would like to enquire about ...'
};
```

On page load the script fills every `data-company="..."` text and every `data-link="..."` link (phone, email, WhatsApp, map) from these values.

The same details are also written as plain text in `index.html` so the page still shows them if JavaScript is disabled. For a complete change, also search `index.html` for the old value and replace it. The `<meta>` description and the copyright line are plain HTML too.

## 5. How to change the WhatsApp number

Edit `whatsapp` in `COMPANY` (any format works, e.g. `'+91 9876543212'`). The script strips spaces and symbols to build `https://wa.me/<digits>`. Always include the country code (`91` for India).

## 6. How to change the phone number

Edit `phone` in `COMPANY`. The clickable `tel:` link is generated automatically. Then replace the old number in `index.html` where it is written as fallback text and in `href="tel:..."`.

## 7. How to change the email

Edit `email` in `COMPANY`. The `mailto:` links are generated automatically. Also update the fallback text/`href` in `index.html`.

## 8. How to change the address

Edit `address` in `COMPANY`. The "View on Google Maps" link is generated from it. Update the fallback text in `index.html`, and the location mentioned in the `<meta name="description">` if needed.

## 9. How to change products

Products are plain HTML cards inside `<section id="products">` in `index.html`. Each card looks like this:

```html
<article class="card product reveal">
  <div class="product__media"><img src="assets/images/boards.svg" alt="..." ...></div>
  <div class="product__body">
    <h3 class="product__title">Wooden Boards</h3>
    <p>Description text...</p>
    <a class="btn btn--primary btn--block" href="#" data-product="Wooden Boards" ...>Enquire Now</a>
  </div>
</article>
```

- **Edit:** change the title, description, image and `data-product` (the name that appears in the WhatsApp message).
- **Add:** copy a whole `<article>` and edit it.
- **Remove:** delete the `<article>`.
- Also update the `<select id="f-product">` options in the enquiry form so the dropdown matches your product list.
- The product grid is 4 columns on wide screens; if you add more products it wraps to new rows automatically.

## 10. How to replace images

All images are in `assets/images/`. The supplied images are illustrations drawn as SVG so the site has no external or watermarked images.

To use real photographs:

1. Copy your photo into `assets/images/` (JPG, WebP or PNG; about 1200 px wide is enough).
2. In `index.html` change the `src` of the matching `<img>` (for example `src="assets/images/boards.svg"` → `src="assets/images/my-boards.jpg"`).
3. Update the `alt` text to describe the photo.

| File | Used for |
| --- | --- |
| `hero.svg` | Home page background (wide landscape image, wood on the right side works best) |
| `boards.svg`, `gulli.svg`, `blocks.svg`, `other-materials.svg` | Product cards and gallery |
| `pieces.svg` | About Us and gallery |

Product and gallery images display at a 4:3 ratio and are cropped to fit automatically.

The favicon is `assets/icons/favicon.svg`. The header logo is text/CSS (`.logo__mark` in `css/style.css`).

## 11. How WhatsApp enquiry works

- **Floating button, header, hero, contact and footer links:** open `https://wa.me/<number>?text=<message>` using the default `whatsappMessage`.
- **Product "Enquire Now":** opens WhatsApp with *"Hello S R Enterprise, I am interested in <Product>. Please share the details."*
- **Enquiry form:** name, phone and product are required (email is optional but must be valid if entered). On submit the details are assembled into a message and WhatsApp opens in a new tab/app. The visitor must press *Send* in WhatsApp. A confirmation message with a fallback link appears on the page.

Nothing is submitted to a server, stored in a database, or saved in the browser.

## 12. How to deploy the static website

Upload the whole folder contents (keeping the structure) to any static host:

- **Netlify:** drag and drop the folder at app.netlify.com/drop.
- **GitHub Pages:** push the files to a repository and enable Pages in the repository settings.
- **Cloudflare Pages / Vercel / Firebase Hosting:** create a project with no build command, and the folder as the output directory.
- **Traditional web hosting (cPanel etc.):** upload everything into `public_html` (or the domain's web root).

After going live with a domain, you may add an `og:image` tag (full URL of a 1200×630 JPG/PNG) to the `<head>` in `index.html` so links shared on social media show a preview picture.

---

## Current design notes

This section is current; older sections above describe earlier versions.

- Business: timber and timber products (round logs and sized timber in Sal, Sagun Teak, Sheesham, Siris, Mahogany and Meguni).
- Sections: Hero, Introduction, Our Timber (`#timber`), What We Supply (`#products`), Business strip, Why Us (`#why-us`), image band, Process, Contact (quote form), Footer.
- Species and product tiles are in `index.html`; each Inquire link carries a `data-product` value that `js/script.js` turns into a WhatsApp message. Company details are edited in the `COMPANY` block at the top of `js/script.js`.
- Images in `assets/images/`: `species-*.svg` (wood grain illustrations), `product-*.svg` (door frame, Diwan bed, gate, furniture illustrations), `round-logs.jpg`, `hero-timber.jpg`, `timber-band.jpg` (CC0 photos). To use real photos, see `docs/image-prompts.md`.
- Fonts are self-hosted in `assets/fonts/`; the site makes no third-party requests except when a visitor clicks the WhatsApp or map links.
- The enquiry form checks a 10-digit phone number (the +91 prefix is added automatically) and opens WhatsApp with the enquiry.
