const categories = ["Plushies", "Models", "3D Printing", "Tech", "Food", "Experiences", "Medieval"];

const starterGifts = [
  {
    name: "Savathun Plushie",
    description: "The Destiny: Savathûn plush brings the Witch Queen to life with a soft, sinister look and a lot of cosmic personality.",
    image: "images/Savathun_Destiny_Plushie_PL_1.jpg",
    link: "https://numskull.com/collections/destiny/products/destiny-plush-savathun-the-witch-queen",
    tag: "Plushies",
    category: "Plushies"
  },
  {
    name: "Starhorse Plushie",
    description: "A soft celestial companion inspired by Destiny 2’s mysterious starhorse, perfect for brave collectors and very cozy shelves.",
    image: "images/Starhorse_Destiny2_Plush_PL_1.jpg",
    link: "https://numskull.com/collections/destiny/products/destiny-plush-starhorse",
    tag: "Plushies",
    category: "Plushies"
  },
  {
    name: "Atheon Plushie",
    description: "An adorable take on Atheon with a soft, glow-detail design that turns a raid boss into a collectible cuddle buddy.",
    image: "images/Atheon_Destiny_Plush_PL_7.webp",
    link: "https://numskull.com/collections/destiny/products/destiny-plush-atheon-time-s-conflux",
    tag: "Plushies",
    category: "Plushies"
  },
  {
    name: "Pouka Plushie",
    description: "A cute, comforting little companion from Destiny 2 that feels like the perfect cozy collectible for long gaming nights.",
    image: "images/Pouka_Destiny_Plush_WB_2000x_3-ezgif.com-resize.webp",
    link: "https://numskull.com/collections/destiny/products/destiny-plush-pouka",
    tag: "Plushies",
    category: "Plushies"
  },
  {
    name: "Oryx Plushie",
    description: "A soft, detailed plush version of the Taken King that captures his intimidating presence in a much friendlier form.",
    image: "images/Oryx_Destiny_Plush_PL_1.jpg",
    link: "https://numskull.com/collections/destiny/products/official-destiny-2-oryx-the-taken-king-plush",
    tag: "Plushies",
    category: "Plushies"
  },
  {
    name: "Fallen Baby Plushie",
    description: "A tiny, weirdly adorable Fallen plush that feels equal parts creepy, charming, and perfect for a Destiny fan collection.",
    image: "images/fallen-baby-plush-destiny-1_bea4bcae-8929-4984-831c-d3f8827d6556.jpg",
    link: "https://numskull.com/collections/destiny/products/destiny-plush-fallen-baby",
    tag: "Plushies",
    category: "Plushies"
  }
];

const storageKey = "gifts-for-kaz-list";
let gifts = loadGifts();

const grid = document.querySelector("#gift-grid");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#item-count");
const searchInput = document.querySelector("#search-input");
const categoryNav = document.querySelector("#category-nav");

document.querySelector("#footer-year").textContent = new Date().getFullYear();
searchInput.addEventListener("input", render);
categoryNav.addEventListener("click", handleCategoryNavClick);
grid.addEventListener("click", handleCardClick);

function loadGifts() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return starterGifts;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.removeItem(storageKey);
      return starterGifts;
    }

    return parsed.map((gift) => ({ ...gift, category: gift.category || categories[0] }));
  } catch {
    return starterGifts;
  }
}

function saveGifts() {
  localStorage.setItem(storageKey, JSON.stringify(gifts));
}

function handleCategoryNavClick(event) {
  const link = event.target.closest("[data-category]");
  if (!link) return;

  const buttons = categoryNav.querySelectorAll(".category-button");
  buttons.forEach((button) => {
    const isActive = button.dataset.category === link.dataset.category;
    button.classList.toggle("is-active", isActive);
  });
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredGifts = gifts.filter((gift) => {
    const haystack = `${gift.name} ${gift.description} ${gift.tag}`.toLowerCase();
    return haystack.includes(query);
  });

  const totalVisible = filteredGifts.length;
  count.textContent = totalVisible;
  emptyState.hidden = totalVisible !== 0;

  grid.innerHTML = categories.map((category) => {
    const categoryGifts = filteredGifts.filter((gift) => gift.category === category);
    const sectionId = `category-${category.replace(/\s+/g, "-")}`;

    return `
      <section class="category-page" id="${sectionId}">
        <h2 class="category-heading">${escapeHtml(category)}</h2>
        <div class="category-items">
          ${categoryGifts.length > 0 ? categoryGifts.map((gift) => {
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
          }).join("") : `<p class="category-empty">No items in this category yet.</p>`}
        </div>
      </section>
    `;
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
