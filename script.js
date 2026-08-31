const categories = ["Plushies", "Models", "3D Printing", "Tech", "Food", "Experiences", "Medieval"];

const starterGifts = [
  {
    name: "A huggable plush dragon",
    description: "The kind of creature that makes a shelf feel a little more magical.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    link: "https://www.etsy.com/search?q=dragon+plush",
    tag: "Plushies",
    category: "Plushies"
  },
  {
    name: "A model train set",
    description: "Tiny stations, tiny villages, and a surprisingly big dose of calm.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85",
    link: "https://www.amazon.com/s?k=model+train+set",
    tag: "Models",
    category: "Models"
  },
  {
    name: "A tiny 3D printer",
    description: "For turning strange little ideas into real objects with very little patience.",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=85",
    link: "https://www.creality.com/",
    tag: "3D Printing",
    category: "3D Printing"
  },
  {
    name: "Noise-cancelling headphones",
    description: "A little bubble of focus for trains, planes, and pretending not to hear the blender.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    link: "https://www.sony.com/headphones",
    tag: "Tech",
    category: "Tech"
  },
  {
    name: "An excellent dinner date",
    description: "Good food, good company, and absolutely no reason to check the time.",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
    link: "https://www.opentable.com/",
    tag: "Food",
    category: "Food"
  },
  {
    name: "A weekend somewhere",
    description: "The best kind of present: a change of scenery and a story to bring home.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    link: "https://www.airbnb.com/",
    tag: "Experiences",
    category: "Experiences"
  },
  {
    name: "A handcrafted medieval replica",
    description: "A cathedral-level object for anyone who likes their decor with a little drama.",
    image: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=900&q=85",
    link: "https://www.etsy.com/search?q=medieval+decor",
    tag: "Medieval",
    category: "Medieval"
  }
];

const storageKey = "gifts-for-kaz-list";
let gifts = loadGifts();
let selectedCategory = "Plushies";

const grid = document.querySelector("#gift-grid");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#item-count");
const searchInput = document.querySelector("#search-input");
const categoryNav = document.querySelector("#category-nav");

document.querySelector("#footer-year").textContent = new Date().getFullYear();
searchInput.addEventListener("input", render);
categoryNav.addEventListener("click", handleCategoryChange);
grid.addEventListener("click", handleCardClick);

function loadGifts() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return starterGifts;
    const parsed = JSON.parse(saved);
    return parsed.map((gift) => ({ ...gift, category: gift.category || categories[0] }));
  } catch {
    return starterGifts;
  }
}

function saveGifts() {
  localStorage.setItem(storageKey, JSON.stringify(gifts));
}

function handleCategoryChange(event) {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  updateCategoryButtons();
  render();
}

function updateCategoryButtons() {
  const buttons = categoryNav.querySelectorAll(".category-button");
  buttons.forEach((button) => {
    const isActive = button.dataset.category === selectedCategory;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleGifts = gifts.filter((gift) => {
    const matchesCategory = gift.category === selectedCategory;
    const haystack = `${gift.name} ${gift.description} ${gift.tag}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });

  count.textContent = visibleGifts.length;
  emptyState.hidden = visibleGifts.length !== 0;
  grid.innerHTML = visibleGifts.map((gift) => {
    const index = gifts.indexOf(gift);
    return `<article class="gift-card" style="animation-delay: ${Math.min(index, 7) * 50}ms">
      <div class="gift-image">
        <img src="${escapeAttribute(gift.image || fallbackImage)}" alt="${escapeAttribute(gift.name)}" onerror="this.src='${fallbackImage}'">
        <span class="gift-tag">${escapeHtml(gift.tag || "New idea")}</span>
      </div>
      <div class="gift-info">
        <button class="delete-button" type="button" data-delete="${index}" aria-label="Remove ${escapeAttribute(gift.name)}">×</button>
        <h2>${escapeHtml(gift.name)}</h2>
        <p>${escapeHtml(gift.description)}</p>
        <a class="gift-link" href="${safeUrl(gift.link)}" target="_blank" rel="noopener noreferrer">See the original <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }).join("");
}

const fallbackImage = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=85";
function handleCardClick(event) {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  gifts.splice(Number(button.dataset.delete), 1);
  saveGifts();
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}
function escapeAttribute(value) { return escapeHtml(value); }
function safeUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? escapeAttribute(url.href) : "#";
  } catch {
    return "#";
  }
}

render();
