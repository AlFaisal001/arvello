import { products, categories } from "./productData.js";

// ------------------------------------------------------------
// App state
// Keep this simple so an API can replace it later.
// ------------------------------------------------------------
let activeCategory = "All";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("tanvirZoneCart") || "[]");

// ------------------------------------------------------------
// DOM references
// ------------------------------------------------------------
const productGrid = document.querySelector("#productGrid");
const newProducts = document.querySelector("#newProducts");
const categoryGrid = document.querySelector("#categoryGrid");
const filterButtons = document.querySelector("#filterButtons");
const sortSelect = document.querySelector("#sortSelect");
const emptyState = document.querySelector("#emptyState");
const cartCount = document.querySelector("#cartCount");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartModal = document.querySelector("#cartModal");
const productModal = document.querySelector("#productModal");
const productDetail = document.querySelector("#productDetail");
const searchPanel = document.querySelector("#searchPanel");
const searchInput = document.querySelector("#searchInput");

// ------------------------------------------------------------
// Currency helper
// ------------------------------------------------------------
function formatPrice(price) {
  return `৳${Number(price).toLocaleString("en-BD")}`;
}

// ------------------------------------------------------------
// Save cart locally
// Replace this later with an API/cart endpoint.
// ------------------------------------------------------------
function saveCart() {
  localStorage.setItem("tanvirZoneCart", JSON.stringify(cart));
}

// ------------------------------------------------------------
// Product card component
// ------------------------------------------------------------
function productCard(product) {
  return `
    <!-- Product card -->
    <article class="product-card group">
      <!-- Product image wrapper -->
      <div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
        <!-- Product image -->
        <img src="${product.image}" alt="${product.name}" loading="lazy" class="h-full w-full object-cover">
        ${product.badge ? `
          <!-- Product badge -->
          <span class="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider">${product.badge}</span>
        ` : ""}
        <!-- Quick view button -->
        <button data-action="view" data-id="${product.id}" class="absolute bottom-3 left-3 right-3 translate-y-3 rounded-xl bg-white/95 px-4 py-3 text-sm font-bold opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
          Quick view
        </button>
      </div>

      <!-- Product information -->
      <div class="pt-3">
        <!-- Product category -->
        <p class="text-xs font-medium uppercase tracking-wider text-neutral-500">${product.category}</p>
        <!-- Product name -->
        <h3 class="mt-1 line-clamp-1 font-semibold">${product.name}</h3>
        <!-- Product price row -->
        <div class="mt-2 flex items-center gap-2">
          <!-- Current price -->
          <span class="font-bold">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `
            <!-- Old price -->
            <span class="text-sm text-neutral-400 line-through">${formatPrice(product.oldPrice)}</span>
          ` : ""}
        </div>
        <!-- Add to cart button -->
        <button data-action="add" data-id="${product.id}" class="btn btn-sm mt-3 w-full border-neutral-300 bg-white hover:bg-neutral-950 hover:text-white">
          Add to cart
        </button>
      </div>
    </article>
  `;
}

// ------------------------------------------------------------
// Render category cards
// ------------------------------------------------------------
function renderCategories() {
  categoryGrid.innerHTML = categories.map(category => `
    <!-- Category card -->
    <button data-category="${category.name}" class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900 text-left">
      <!-- Category image -->
      <img src="${category.image}" alt="${category.name}" loading="lazy" class="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-60">
      <!-- Category overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
      <!-- Category name -->
      <span class="absolute bottom-4 left-4 text-lg font-bold text-white">${category.name}</span>
    </button>
  `).join("");
}

// ------------------------------------------------------------
// Render filter buttons
// ------------------------------------------------------------
function renderFilters() {
  const allCategories = ["All", ...categories.map(item => item.name)];

  filterButtons.innerHTML = allCategories.map(category => `
    <!-- Filter button -->
    <button data-filter="${category}" class="btn btn-sm ${activeCategory === category ? "bg-neutral-950 text-white hover:bg-neutral-800" : "bg-white text-neutral-700"} border-neutral-300">
      ${category}
    </button>
  `).join("");
}

// ------------------------------------------------------------
// Filter and sort products
// This is the part you can later replace with API query params.
// ------------------------------------------------------------
function getVisibleProducts() {
  let result = [...products];

  if (activeCategory !== "All") {
    result = result.filter(product => product.category === activeCategory);
  }

  if (searchTerm) {
    const query = searchTerm.toLowerCase();
    result = result.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  switch (sortSelect.value) {
    case "low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    default:
      break;
  }

  return result;
}

// ------------------------------------------------------------
// Render main product grid
// ------------------------------------------------------------
function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productGrid.innerHTML = visibleProducts.map(productCard).join("");
  emptyState.classList.toggle("hidden", visibleProducts.length !== 0);
}

// ------------------------------------------------------------
// Render new arrivals
// ------------------------------------------------------------
function renderNewArrivals() {
  const newest = [...products]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  newProducts.innerHTML = newest.map(productCard).join("");
}

// ------------------------------------------------------------
// Open product details
// ------------------------------------------------------------
function openProduct(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;

  productDetail.innerHTML = `
    <!-- Detail image -->
    <div class="aspect-[4/5] bg-neutral-100">
      <!-- Product image -->
      <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover">
    </div>

    <!-- Detail content -->
    <div class="p-7 sm:p-10">
      <!-- Detail category -->
      <p class="text-xs font-bold uppercase tracking-widest text-accent">${product.category}</p>
      <!-- Detail name -->
      <h2 class="mt-3 text-3xl font-extrabold">${product.name}</h2>
      <!-- Detail price -->
      <div class="mt-5 flex items-center gap-3">
        <!-- Current price -->
        <span class="text-2xl font-bold">${formatPrice(product.price)}</span>
        ${product.oldPrice ? `
          <!-- Detail old price -->
          <span class="text-neutral-400 line-through">${formatPrice(product.oldPrice)}</span>
        ` : ""}
      </div>
      <!-- Detail description -->
      <p class="mt-6 leading-7 text-neutral-600">${product.description}</p>

      <!-- Size selection -->
      <div class="mt-7">
        <!-- Size label -->
        <p class="mb-3 text-sm font-bold">Size</p>
        <!-- Size buttons -->
        <div class="flex gap-2">
          <button class="btn btn-sm">S</button>
          <button class="btn btn-sm">M</button>
          <button class="btn btn-sm">L</button>
          <button class="btn btn-sm">XL</button>
        </div>
      </div>

      <!-- Detail add button -->
      <button data-action="add" data-id="${product.id}" class="btn btn-neutral mt-8 w-full">Add to cart</button>
    </div>
  `;

  productModal.showModal();
}

// ------------------------------------------------------------
// Add product to cart
// ------------------------------------------------------------
function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  renderCart();

  // Close product modal after adding.
  if (productModal.open) productModal.close();

  // Open cart so the user sees the result.
  cartModal.showModal();
}

// ------------------------------------------------------------
// Change cart quantity
// ------------------------------------------------------------
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === Number(id));
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== Number(id));
  }

  saveCart();
  renderCart();
}

// ------------------------------------------------------------
// Render cart
// ------------------------------------------------------------
function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartCount.classList.toggle("hidden", totalItems === 0);
  cartTotal.textContent = formatPrice(totalPrice);

  if (!cart.length) {
    cartItems.innerHTML = `
      <!-- Empty cart -->
      <div class="py-10 text-center">
        <!-- Empty cart title -->
        <p class="font-semibold">Your cart is empty.</p>
        <!-- Empty cart text -->
        <p class="mt-1 text-sm text-neutral-500">Add something you like and it will appear here.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <!-- Cart item -->
    <div class="flex gap-3 rounded-xl border border-neutral-200 p-3">
      <!-- Cart item image -->
      <img src="${item.image}" alt="${item.name}" class="h-20 w-16 rounded-lg object-cover">
      <!-- Cart item information -->
      <div class="min-w-0 flex-1">
        <!-- Cart item name -->
        <p class="truncate font-semibold">${item.name}</p>
        <!-- Cart item price -->
        <p class="mt-1 text-sm text-neutral-500">${formatPrice(item.price)}</p>
        <!-- Cart quantity controls -->
        <div class="mt-2 flex items-center gap-2">
          <!-- Decrease button -->
          <button data-action="quantity" data-id="${item.id}" data-amount="-1" class="btn btn-xs">−</button>
          <!-- Quantity -->
          <span class="min-w-5 text-center text-sm font-bold">${item.quantity}</span>
          <!-- Increase button -->
          <button data-action="quantity" data-id="${item.id}" data-amount="1" class="btn btn-xs">+</button>
        </div>
      </div>
      <!-- Cart item subtotal -->
      <p class="font-bold">${formatPrice(item.price * item.quantity)}</p>
    </div>
  `).join("");
}

// ------------------------------------------------------------
// Global click handling
// ------------------------------------------------------------
document.addEventListener("click", event => {
  const actionTarget = event.target.closest("[data-action]");
  const filterTarget = event.target.closest("[data-filter]");
  const categoryTarget = event.target.closest("[data-category]");

  if (actionTarget) {
    const action = actionTarget.dataset.action;
    const id = actionTarget.dataset.id;

    if (action === "add") addToCart(id);
    if (action === "view") openProduct(id);

    if (action === "quantity") {
      changeQuantity(id, Number(actionTarget.dataset.amount));
    }
  }

  if (filterTarget) {
    activeCategory = filterTarget.dataset.filter;
    renderFilters();
    renderProducts();
  }

  if (categoryTarget) {
    activeCategory = categoryTarget.dataset.category;
    renderFilters();
    renderProducts();
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  }
});

// ------------------------------------------------------------
// Search controls
// ------------------------------------------------------------
document.querySelector("#searchButton").addEventListener("click", () => {
  searchPanel.classList.toggle("hidden");
  if (!searchPanel.classList.contains("hidden")) {
    searchInput.focus();
  }
});

document.querySelector("#closeSearch").addEventListener("click", () => {
  searchPanel.classList.add("hidden");
  searchInput.value = "";
  searchTerm = "";
  renderProducts();
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

// ------------------------------------------------------------
// Sort control
// ------------------------------------------------------------
sortSelect.addEventListener("change", renderProducts);

// ------------------------------------------------------------
// Cart button
// ------------------------------------------------------------
document.querySelector("#cartButton").addEventListener("click", () => {
  renderCart();
  cartModal.showModal();
});

// ------------------------------------------------------------
// Checkout placeholder
// Replace this with your backend / SSLCommerz API later.
// ------------------------------------------------------------
document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  alert("Checkout is ready to connect to your backend/payment API.");
});

// ------------------------------------------------------------
// Newsletter placeholder
// Replace this with an API/email service later.
// ------------------------------------------------------------
document.querySelector("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.querySelector("#newsletterEmail").value;
  alert(`Thanks! ${email} has been added to the demo newsletter.`);
  event.target.reset();
});

// ------------------------------------------------------------
// Initial render
// ------------------------------------------------------------
renderCategories();
renderFilters();
renderNewArrivals();
renderProducts();
renderCart();
