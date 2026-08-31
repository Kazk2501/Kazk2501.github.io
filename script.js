const starterGifts = [
  {
    name: "A really good lamp",
    description: "For making late-night reading feel like a small, luxurious event.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    link: "https://www.etsy.com/search?q=table%20lamp",
    tag: "For the home"
  },
  {
    name: "Noise-cancelling headphones",
    description: "A little bubble of focus for trains, planes, and pretending not to hear the blender.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    link: "https://www.sony.com/headphones",
    tag: "Everyday luxury"
  },
  {
    name: "A weekend somewhere",
    description: "The best kind of present: a change of scenery and a story to bring home.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    link: "https://www.airbnb.com/",
    tag: "Experiences"
  },
  {
    name: "A beautiful notebook",
    description: "For thoughts that deserve more than a half-remembered note in my phone.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85",
    link: "https://www.papier.com/",
    tag: "Little things"
  },
  {
    name: "The perfect sweater",
    description: "Soft, oversized, and destined to become the most-worn thing I own.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",
    link: "https://www.uniqlo.com/",
    tag: "Wear it well"
  },
  {
    name: "A long dinner",
    description: "Good food, good company, and absolutely no reason to check the time.",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
    link: "https://www.opentable.com/",
    tag: "Experiences"
  }
];

const storageKey = "gifts-for-kaz-list";
let gifts = loadGifts();

const grid = document.querySelector("#gift-grid");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#item-count");
const searchInput = document.querySelector("#search-input");

document.querySelector("#footer-year").textContent = new Date().getFullYear();
searchInput.addEventListener("input", render);
grid.addEventListener("click", handleCardClick);

function loadGifts() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : starterGifts;
  } catch {
    return starterGifts;
  }
}

function saveGifts() {
  localStorage.setItem(storageKey, JSON.stringify(gifts));
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleGifts = gifts.filter((gift) => `${gift.name} ${gift.description} ${gift.tag}`.toLowerCase().includes(query));
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
