const products = [
  {
    id: 1,
    name: "Aero Watch Pro",
    category: "tech",
    price: 189,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    tag: "Bestseller",
    description: "Track workouts, connect to your phone, and stay on time in style."
  },
  {
    id: 2,
    name: "Velocity Sneaker",
    category: "fashion",
    price: 120,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    tag: "New",
    description: "Responsive cushioning and a lightweight feel for everyday movement."
  },
  {
    id: 3,
    name: "Luma Headphones",
    category: "tech",
    price: 99,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    tag: "Top rated",
    description: "Immersive sound with deep bass and all-day comfort."
  },
  {
    id: 4,
    name: "Harbor Lamp",
    category: "home",
    price: 64,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    tag: "Home pick",
    description: "Warm ambient lighting to soften any room and add a cozy glow."
  },
  {
    id: 5,
    name: "Drift Bottle",
    category: "wellness",
    price: 26,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    tag: "Wellness",
    description: "A stainless steel bottle designed to keep hydration easy on the go."
  },
  {
    id: 6,
    name: "Summit Backpack",
    category: "fashion",
    price: 88,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    tag: "Travel",
    description: "Spacious, durable, and polished for daily commutes and weekend escapes."
  },
  {
    id: 7,
    name: "Sora Speaker",
    category: "tech",
    price: 145,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80",
    tag: "Popular",
    description: "Rich, room-filling sound with a modern silhouette for any desk."
  },
  {
    id: 8,
    name: "Cove Throw",
    category: "home",
    price: 52,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    tag: "Cozy",
    description: "A soft knit blanket that brings comfort and warmth to every corner."
  }
];

const productGrid = document.getElementById("productGrid");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTotalEl = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const cartPanel = document.getElementById("cartPanel");
const cartToggleBtn = document.getElementById("cartToggle");
const closeCartBtn = document.getElementById("closeCart");
const toastEl = document.getElementById("toast");
const chips = document.querySelectorAll(".chip");

let activeCategory = "all";
let cart = [];

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (!filteredProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>No products match your search.</h3>
        <p>Try another keyword or switch categories.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <span class="product-tag">${product.tag}</span>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span class="rating">★ ${product.rating}</span>
              <span>${product.category}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-footer">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to cart`);
}

function updateCartItem(productId, amount) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== productId);
  }

  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItemsEl.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty.</p>
      </div>
    `;
  } else {
    cartItemsEl.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <h4>${item.name}</h4>
              <p>${item.category}</p>
              <div class="item-actions">
                <div class="qty-controls">
                  <button class="qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                  <span>${item.quantity}</span>
                  <button class="qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                </div>
                <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".qty-minus").forEach((button) => {
      button.addEventListener("click", () => updateCartItem(Number(button.dataset.id), -1));
    });

    document.querySelectorAll(".qty-plus").forEach((button) => {
      button.addEventListener("click", () => updateCartItem(Number(button.dataset.id), 1));
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartSubtotalEl.textContent = formatPrice(subtotal);
  cartTotalEl.textContent = formatPrice(total);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 1600);
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeCategory = chip.dataset.filter;
    chips.forEach((btn) => btn.classList.toggle("active", btn === chip));
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

cartToggleBtn.addEventListener("click", () => {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
});

closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
});

document.addEventListener("DOMContentLoaded", () => {
  const driftTargets = document.querySelectorAll(".nav-actions, .cta-row, .deal-banner");

  driftTargets.forEach((element, index) => {
    element.style.position = "relative";
    element.style.left = `${(index + 1) * 18}px`;
    element.style.top = `${index * 8}px`;
  });

  const heroCopy = document.querySelector(".hero-copy");
  if (heroCopy) {
    heroCopy.style.marginLeft = "35px";
  }
});

renderProducts();
renderCart();
