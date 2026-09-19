# Tanvir Zone

A responsive, easy-to-understand online clothing store built with:

- HTML
- Tailwind CSS via CDN
- DaisyUI via CDN
- Vanilla JavaScript modules

## Folder structure

```text
tanvir-zone/
├── index.html
├── js/
│   ├── app.js
│   └── productData.js
└── resources/
    ├── logo.svg
    └── placeholder.svg
```

## Run

You can open `index.html` directly in a browser.

For the best development experience, use VS Code + Live Server.

## Where to edit

### Products
Edit:

`js/productData.js`

This is intentionally separated from the UI logic so you can later replace the local product array with an API call.

### Functionality
Edit:

`js/app.js`

It contains filtering, searching, sorting, cart logic, product details and checkout placeholders.

### Design
Edit:

`index.html`

Tailwind utility classes are kept directly beside the elements they style to make the project easy to understand.

## API-ready idea

Later, you can replace:

```js
import { products } from "./productData.js";
```

with something like:

```js
const response = await fetch("https://your-api.com/products");
const products = await response.json();
```

Then connect `addToCart()` and the checkout button to your backend.

## Important

The current product images use public Unsplash image URLs. Replace them with your own images or API image URLs for production.
