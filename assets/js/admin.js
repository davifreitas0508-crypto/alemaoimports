const loginSection = document.getElementById("login-section");
const panelSection = document.getElementById("panel-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const tableBody = document.getElementById("admin-table-body");
const adminCountEl = document.getElementById("admin-count");
const newProductBtn = document.getElementById("new-product-btn");

const productModalOverlay = document.getElementById("product-modal-overlay");
const productModalTitle = document.getElementById("product-modal-title");
const productForm = document.getElementById("product-form");
const productFormError = document.getElementById("product-form-error");
const deleteProductBtn = document.getElementById("delete-product-btn");
const saveProductBtn = document.getElementById("save-product-btn");

let currentProducts = [];
let pendingImages = []; // { url } for existing photos, { file, previewUrl } for new uploads
let editingId = null;

function formatPrice(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// --- Autenticação ---
async function checkSession() {
  showLogin();
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      showPanel();
    }
  } catch (err) {
    console.error("Não foi possível conectar ao Supabase:", err);
    loginError.textContent = "Não foi possível conectar ao servidor. Tente novamente em instantes.";
    loginError.hidden = false;
  }
}

function showLogin() {
  loginSection.hidden = false;
  panelSection.hidden = true;
  logoutBtn.hidden = true;
}

function showPanel() {
  loginSection.hidden = true;
  panelSection.hidden = false;
  logoutBtn.hidden = false;
  loadTable();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  let result;
  try {
    result = await supabaseClient.auth.signInWithPassword({ email, password });
  } catch (err) {
    loginError.textContent = "Não foi possível conectar ao servidor. Tente novamente em instantes.";
    loginError.hidden = false;
    return;
  }
  if (result.error) {
    loginError.textContent = "E-mail ou senha inválidos.";
    loginError.hidden = false;
    return;
  }
  showPanel();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

// --- Tabela de produtos ---
async function loadTable() {
  currentProducts = await loadProducts();
  adminCountEl.textContent = `${currentProducts.length} produto${currentProducts.length === 1 ? "" : "s"}`;
  tableBody.innerHTML = currentProducts.map(rowHtml).join("");
  tableBody.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openProductModal(btn.dataset.edit));
  });
}

function rowHtml(p) {
  const thumb =
    p.images && p.images[0]
      ? `<img src="${p.images[0]}" alt="" />`
      : `<div style="width:100%;height:100%;background:${p.colorHex}"></div>`;
  return `
    <tr>
      <td><div class="admin-row-thumb">${thumb}</div></td>
      <td>
        <div class="admin-row-model">${p.model}</div>
        <div class="admin-row-meta">${p.memory} · ${p.color}</div>
      </td>
      <td>${p.condition === "novo" ? "Novo" : "Seminovo"}</td>
      <td>${formatPrice(p.price)}</td>
      <td>
        <div class="admin-row-actions">
          <button type="button" data-edit="${p.id}">Editar</button>
        </div>
      </td>
    </tr>
  `;
}

// --- Modal de produto ---
newProductBtn.addEventListener("click", () => openProductModal(null));
document.getElementById("product-modal-close").addEventListener("click", closeProductModal);
productModalOverlay.addEventListener("click", (e) => {
  if (e.target === productModalOverlay) closeProductModal();
});

function closeProductModal() {
  productModalOverlay.classList.remove("open");
}

function openProductModal(id) {
  editingId = id;
  productFormError.hidden = true;
  const p = id ? currentProducts.find((item) => item.id === id) : null;

  document.getElementById("field-id").value = p ? p.id : "";
  document.getElementById("field-category").value = p ? p.category : "iphone";
  document.getElementById("field-condition").value = p ? p.condition : "novo";
  document.getElementById("field-model").value = p ? p.model : "";
  document.getElementById("field-memory").value = p ? p.memory : "";
  document.getElementById("field-color").value = p ? p.color : "";
  document.getElementById("field-colorhex").value = p ? p.colorHex : "#1c1c1e";
  document.getElementById("field-battery").value = p && p.battery ? p.battery : "";
  document.getElementById("field-price").value = p ? p.price : "";
  document.getElementById("field-oldprice").value = p && p.oldPrice ? p.oldPrice : "";
  document.getElementById("field-badges").value = p ? p.badges.join(", ") : "";
  document.getElementById("field-images").value = "";

  pendingImages = p && p.images ? p.images.map((url) => ({ url })) : [];
  renderImageList();

  productModalTitle.textContent = p ? "Editar produto" : "Adicionar produto";
  deleteProductBtn.hidden = !p;

  productModalOverlay.classList.add("open");
}

function renderImageList() {
  const list = document.getElementById("admin-image-list");
  list.innerHTML = pendingImages
    .map(
      (img, i) => `
      <div class="admin-image-thumb">
        <img src="${img.previewUrl || img.url}" alt="" />
        <button type="button" data-remove="${i}">&times;</button>
      </div>
    `
    )
    .join("");
  list.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      pendingImages.splice(Number(btn.dataset.remove), 1);
      renderImageList();
    });
  });
}

document.getElementById("field-images").addEventListener("change", (e) => {
  const files = Array.from(e.target.files || []);
  files.forEach((file) => {
    pendingImages.push({ file, previewUrl: URL.createObjectURL(file) });
  });
  renderImageList();
  e.target.value = "";
});

async function uploadPendingImages() {
  const urls = [];
  for (const img of pendingImages) {
    if (img.url) {
      urls.push(img.url);
      continue;
    }
    const ext = img.file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseClient.storage.from("product-images").upload(path, img.file);
    if (error) throw error;
    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  productFormError.hidden = true;
  saveProductBtn.disabled = true;
  saveProductBtn.textContent = "Salvando...";

  try {
    const images = await uploadPendingImages();
    const model = document.getElementById("field-model").value.trim();
    const color = document.getElementById("field-color").value.trim();
    const id = editingId || `${slugify(model)}-${slugify(color)}-${Date.now()}`;
    const badgesRaw = document.getElementById("field-badges").value;
    const existing = editingId ? currentProducts.find((item) => item.id === editingId) : null;

    const product = {
      id,
      category: document.getElementById("field-category").value,
      condition: document.getElementById("field-condition").value,
      model,
      memory: document.getElementById("field-memory").value.trim(),
      color,
      colorHex: document.getElementById("field-colorhex").value,
      battery: document.getElementById("field-battery").value.trim() || null,
      price: parseFloat(document.getElementById("field-price").value),
      oldPrice: document.getElementById("field-oldprice").value
        ? parseFloat(document.getElementById("field-oldprice").value)
        : null,
      badges: badgesRaw
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      images,
      position: existing ? existing.position : currentProducts.length,
    };

    const { error } = await supabaseClient.from("products").upsert(productToRow(product));
    if (error) throw error;

    closeProductModal();
    loadTable();
  } catch (err) {
    productFormError.textContent = "Erro ao salvar: " + (err.message || err);
    productFormError.hidden = false;
  } finally {
    saveProductBtn.disabled = false;
    saveProductBtn.textContent = "Salvar";
  }
});

deleteProductBtn.addEventListener("click", async () => {
  if (!editingId) return;
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  const { error } = await supabaseClient.from("products").delete().eq("id", editingId);
  if (error) {
    alert("Erro ao excluir: " + error.message);
    return;
  }
  closeProductModal();
  loadTable();
});

checkSession();
