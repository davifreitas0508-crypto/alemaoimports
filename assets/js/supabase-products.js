// Cliente Supabase compartilhado entre o site e o painel admin.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function rowToProduct(row) {
  return {
    id: row.id,
    category: row.category,
    model: row.model,
    memory: row.memory,
    color: row.color,
    colorHex: row.color_hex,
    condition: row.condition,
    battery: row.battery,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    badges: row.badges || [],
    images: row.images || [],
    position: row.position ?? 0,
  };
}

function productToRow(product) {
  return {
    id: product.id,
    category: product.category,
    model: product.model,
    memory: product.memory,
    color: product.color,
    color_hex: product.colorHex,
    condition: product.condition,
    battery: product.battery || null,
    price: product.price,
    old_price: product.oldPrice || null,
    badges: product.badges || [],
    images: product.images || [],
    position: product.position ?? 0,
  };
}

// Busca os produtos do banco; usa o catálogo estático como fallback se o Supabase falhar.
async function loadProducts() {
  try {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("position", { ascending: true });
    if (error) throw error;
    return data.map(rowToProduct);
  } catch (err) {
    console.error("Não foi possível carregar os produtos do Supabase, usando catálogo local:", err);
    return typeof PRODUCTS_FALLBACK !== "undefined" ? PRODUCTS_FALLBACK : [];
  }
}
