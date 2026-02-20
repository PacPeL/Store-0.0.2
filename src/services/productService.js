// src/services/productService.js

/**
 * Service de productos
 * - Lee desde /data/products.json (en public/) si existe.
 * - Si falla, usa un fallback con datos mock.
 * - Devuelve SIEMPRE objetos con el schema:
 *   { id:number, title:string, price:number, description:string, category:string, image:string }
 */

const PRODUCT_SOURCE = "/data/products.json"; // coloca el JSON en public/data/products.json
let _cache = null;

/** Normaliza un item al schema esperado. */
function normalizeItem(it, fallbackId = null) {
  return {
    id: Number(it?.id ?? fallbackId ?? 0),
    title: String(it?.title ?? "Produto"),
    price: Number(it?.price ?? 0),
    description: String(it?.description ?? ""),
    category: String(it?.category ?? ""),
    image: String(it?.image ?? "/images/placeholder.png"),
  };
}

/** Datos de fallback para desarrollo (no dependes del JSON) */
function getFallbackProducts() {
  return [
    {
      id: 1,
      title: "GMA D’or",
      price: 1609.0,
      description:
        "Domine a quadra com a GMA D’or – performance e estilo em uma edição especial.",
      category: "Chuteira Campo",
      image: "/images/golden_boots.png",
    },
    {
      id: 2,
      title: "Chuteira Campo",
      price: 709.99,
      description: "Conforto, leveza e tração para todos os jogos.",
      category: "Chuteira Campo",
      image: "/images/boots.png",
    },
  ];
}

/**
 * Intenta cargar /data/products.json desde public/.
 * Si falla, lanza error para que el caller decida fallback.
 */
async function fetchFromPublicJson() {
  const res = await fetch(PRODUCT_SOURCE, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao carregar ${PRODUCT_SOURCE}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error(`Conteúdo inválido em ${PRODUCT_SOURCE}: não é um array`);
  }
  // Normaliza cada item
  return data.map((it, idx) => normalizeItem(it, idx + 1));
}

/**
 * Obtiene TODOS los productos (con cache en memoria).
 * - Primero intenta /data/products.json
 * - Si falla, usa FALLBACK
 */
export async function getProducts() {
  if (_cache) return _cache;

  try {
    const arr = await fetchFromPublicJson();
    _cache = arr;
    return _cache;
  } catch (err) {
    console.warn(
      "[productService] Falha ao ler /data/products.json. Usando fallback.",
      err
    );
    _cache = getFallbackProducts();
    return _cache;
  }
}

/** Busca un producto por ID (string o number) */
export async function getProductById(id) {
  const list = await getProducts();
  return list.find((p) => String(p.id) === String(id)) || null;
}

/** Fuerza recarga (limpia cache y vuelve a cargar) */
export async function reloadProducts() {
  _cache = null;
  return getProducts();
}