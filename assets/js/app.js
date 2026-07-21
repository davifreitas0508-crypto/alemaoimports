const WHATSAPP_NUMBER = "5531990674033";

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
const categoryToggle = document.getElementById("category-toggle");
const categoryChipsWrap = document.getElementById("category-chips");

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

function renderCard(p, index) {
  const badges = p.badges.map((b) => `<span class="${badgeClass(b)}">${b}</span>`).join("");
  const oldPrice = p.oldPrice ? `<span class="product-old-price">${formatPrice(p.oldPrice)}</span>` : "";
  const batteryLine = p.battery ? ` · Bateria ${p.battery}` : "";
  return `
    <article class="product-card" data-id="${p.id}" style="--i:${index}" tabindex="0">
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

  grid.innerHTML = filtered.map((p, i) => renderCard(p, i)).join("");
  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.dataset.id);
      }
    });
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

function updateCategoryToggleLabel() {
  if (!categoryToggle) return;
  const active = document.querySelector("[data-category].active");
  categoryToggle.querySelector(".filter-toggle-label").textContent = active ? active.textContent : "Categoria";
}

categoryChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    categoryChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    state.category = chip.dataset.category;
    updateCategoryToggleLabel();
    if (categoryChipsWrap) categoryChipsWrap.classList.remove("open");
    if (categoryToggle) categoryToggle.setAttribute("aria-expanded", "false");
    render();
  });
});

if (categoryToggle && categoryChipsWrap) {
  categoryToggle.addEventListener("click", () => {
    const isOpen = categoryChipsWrap.classList.toggle("open");
    categoryToggle.setAttribute("aria-expanded", String(isOpen));
  });
  updateCategoryToggleLabel();
}

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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ticker: trust signals scrolling strip (duplicated once for a seamless loop)
function initTicker() {
  const track = document.getElementById("ticker-track");
  const items = [
    "Garantia Apple",
    "Entrega em BH",
    "Seminovos revisados",
    "Pix com desconto",
    "+10.000 aparelhos vendidos",
    "Avaliamos seu usado",
  ];
  const html = items.map((item) => `<span class="ticker-item">${item}</span>`).join("");
  track.innerHTML = html + html;
}

// Contagem animada dos números do hero
function animateCount(el) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  if (prefersReducedMotion) {
    el.textContent = `${prefix}${target}${suffix}`;
    return;
  }
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(eased * target).toLocaleString("pt-BR")}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Fade-in ao rolar para os cartões "info-card"
function initRevealOnScroll() {
  const targets = document.querySelectorAll(".info-card");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => observer.observe(el));
}

// Rede de partículas animada no fundo do hero (efeito "tech")
function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero");
  let width, height, particles;

  function resize() {
    width = canvas.width = hero.clientWidth;
    height = canvas.height = hero.clientHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.round((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(10, 10, 10, ${0.09 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    particles.forEach((p) => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.35)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  resize();
  createParticles();
  step();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
    if (prefersReducedMotion) step();
  });
}

initTicker();
initRevealOnScroll();
initHeroCanvas();
document.querySelectorAll("[data-count]").forEach(animateCount);

render();
