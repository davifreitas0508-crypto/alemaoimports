const WHATSAPP_NUMBER = "5531900000000"; // TODO: substituir pelo número real (formato 55DDDNÚMERO)

const state = {
  search: "",
  category: "todos",
  condition: "todos",
  sort: "relevancia",
};

const grid = document.getElementById("product-grid");
const countEl = document.getElementById("catalog-count");
const searchInput = document.getElementById("search-input");
const categoryChips = document.querySelectorAll("[data-category]");
const conditionChips = document.querySelectorAll("[data-condition]");
const sortSelect = document.getElementById("sort-select");
const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function waLink(product) {
  const text = `Olá! Tenho interesse no ${product.model} (${product.memory}, ${product.color}) por ${formatPrice(product.price)}. Ainda está disponível?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function badgeClass(label) {
  const key = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return `badge badge-${key.split(" ")[0]}`;
}

function phoneIllustration(product) {
  const isAccessory = product.category === "acessorio";
  return `<div class="phone-illustration${isAccessory ? " accessory" : ""}" style="background:${product.colorHex}"></div>`;
}

function matchesFilters(p) {
  const q = state.search.trim().toLowerCase();
  const searchable = `${p.model} ${p.memory} ${p.color}`.toLowerCase();
  const matchesSearch = !q || searchable.includes(q);
  const matchesCategory = state.category === "todos" || p.category === state.category;
  const matchesCondition = state.condition === "todos" || p.condition === state.condition;
  return matchesSearch && matchesCategory && matchesCondition;
}

function sortProducts(list) {
  const sorted = [...list];
  if (state.sort === "menor-preco") sorted.sort((a, b) => a.price - b.price);
  if (state.sort === "maior-preco") sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

function renderCard(p) {
  const badges = p.badges.map((b) => `<span class="${badgeClass(b)}">${b}</span>`).join("");
  const oldPrice = p.oldPrice ? `<span class="product-old-price">${formatPrice(p.oldPrice)}</span>` : "";
  const batteryLine = p.battery ? ` · Bateria ${p.battery}` : "";
  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media">${phoneIllustration(p)}</div>
      <div class="product-badges">${badges}</div>
      <h3 class="product-title">${p.model}</h3>
      <div class="product-meta">${p.memory} · ${p.color}${batteryLine}</div>
      <div class="product-price-row">
        <span class="product-price">${formatPrice(p.price)}</span>
        ${oldPrice}
      </div>
      <div class="product-actions">
        <a class="btn btn-primary btn-small" href="${waLink(p)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Falar no WhatsApp</a>
      </div>
    </article>
  `;
}

function render() {
  const filtered = sortProducts(PRODUCTS.filter(matchesFilters));
  countEl.textContent = `${filtered.length} produto${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">Nenhum produto encontrado com esses filtros. Tente ajustar a busca.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(renderCard).join("");
  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.id));
  });
}

function openModal(id) {
  const p = PRODUCTS.find((item) => item.id === id);
  if (!p) return;

  const badges = p.badges.map((b) => `<span class="${badgeClass(b)}">${b}</span>`).join("");
  const oldPrice = p.oldPrice ? `<span class="product-old-price">${formatPrice(p.oldPrice)}</span>` : "";
  const batteryRow = p.battery ? `<li><strong>Bateria:</strong> ${p.battery}</li>` : "";

  modalBody.innerHTML = `
    <div class="modal-media">${phoneIllustration(p)}</div>
    <div class="product-badges">${badges}</div>
    <h2>${p.model}</h2>
    <ul class="modal-specs">
      <li><strong>Armazenamento:</strong> ${p.memory}</li>
      <li><strong>Cor:</strong> ${p.color}</li>
      ${batteryRow}
      <li><strong>Condição:</strong> ${p.condition === "novo" ? "Novo lacrado" : "Seminovo revisado"}</li>
    </ul>
    <div class="modal-price">${formatPrice(p.price)} ${oldPrice}</div>
    <a class="btn btn-primary" style="width:100%;justify-content:center" href="${waLink(p)}" target="_blank" rel="noopener">Falar no WhatsApp</a>
  `;
  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  render();
});

categoryChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    categoryChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    state.category = chip.dataset.category;
    render();
  });
});

conditionChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    conditionChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    state.condition = chip.dataset.condition;
    render();
  });
});

sortSelect.addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.getElementById("modal-close").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

render();
