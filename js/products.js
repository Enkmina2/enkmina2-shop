/**
 * ENKMINA2 SHOP - Catálogo de zapatillas
 *
 * Elegido de "Los más vendidos" de Amazon.es el 31-10-2026 (revisar cada mes).
 * Cada producto guarda sus ASIN por versión: hombre, mujer o unisex.
 * Los enlaces a Amazon.es se generan en app.js con amazonUrl(asin).
 * No se guardan precios, valoraciones ni fotos de Amazon.
 */

// Fecha de la consulta de las listas, para los badges
const LISTAS_FECHA = "oct. 2026";

const PRODUCTS_DATA = [
  // ---------------- RUNNING ----------------
  {
    id: 1,
    name: "Galaxy 8",
    brand: "adidas",
    categories: ["running", "novedades"],
    asins: { hombre: "B0FW3S4RS2", mujer: "B0FT34NRT8" },
    badge: `Nº 1 en running · ${LISTAS_FECHA}`,
    description: "Zapatilla de running de adidas. Sucesora de la Galaxy 7. Fue la nº 1 en las listas de running de hombre y de mujer de Amazon.es."
  },
  {
    id: 2,
    name: "Runfalcon 6",
    brand: "adidas",
    categories: ["running", "novedades"],
    asins: { hombre: "B0FW7VC98Z", mujer: "B0FXMHY6TT" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de running de adidas. Sucesora de la Runfalcon 5. Estaba en el top 10 de running de hombre y de mujer de Amazon.es."
  },
  {
    id: 3,
    name: "Duramo SL 2",
    brand: "adidas",
    categories: ["running"],
    asins: { hombre: "B0CYTFH5X8", mujer: "B0CYTB7TXW" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de running de adidas para correr en carretera. Estaba en el top 5 de running de hombre y de mujer de Amazon.es."
  },
  {
    id: 4,
    name: "Gel-Contend 10",
    brand: "Asics",
    categories: ["running"],
    asins: { hombre: "B0G44ZG67G", mujer: "B0H4WGL936" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de running de Asics. Estaba en el top 10 de running de hombre y de mujer de Amazon.es."
  },
  {
    id: 5,
    name: "Charged Surge 4",
    brand: "Under Armour",
    categories: ["running"],
    asins: { hombre: "B0BZXMVK68", mujer: "B0BZXL5TTB" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de running de Under Armour para correr en carretera. Estaba en las listas de running de hombre y de mujer de Amazon.es."
  },
  {
    id: 6,
    name: "Vomero 18",
    brand: "Nike",
    categories: ["running"],
    asins: { mujer: "B0DTKN5JCJ" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de running de Nike. Estaba en el top 10 de running de mujer de Amazon.es."
  },

  // ---------------- URBANO ----------------
  {
    id: 7,
    name: "Uno Stand On Air",
    brand: "Skechers",
    categories: ["urbano"],
    asins: { hombre: "B082N4NRCN", mujer: "B07H61JFTV" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla urbana de Skechers. Estaba en el top 10 de zapatillas de hombre y de mujer de Amazon.es."
  },
  {
    id: 8,
    name: "VL Court 3.0",
    brand: "adidas",
    categories: ["urbano"],
    asins: { hombre: "B0CKLX4612", mujer: "B0C59CXZVX" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de calle de adidas con estilo de pista clásico. Estaba en las listas de zapatillas de hombre y de mujer de Amazon.es."
  },
  {
    id: 9,
    name: "Smash 3.0 L",
    brand: "Puma",
    categories: ["urbano"],
    asins: { unisex: "B09YXPM5BJ" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla urbana de Puma, de estilo clásico. Estaba en la lista de zapatillas de hombre de Amazon.es."
  },
  {
    id: 10,
    name: "Club II Era",
    brand: "Puma",
    categories: ["urbano"],
    asins: { unisex: "B0CKJK36MD" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla urbana de Puma de inspiración retro. Estaba en el top 5 de zapatillas de hombre de Amazon.es."
  },
  {
    id: 11,
    name: "Graceful – Get Connected",
    brand: "Skechers",
    categories: ["urbano"],
    asins: { mujer: "B01M01K39E" },
    badge: `Nº 1 en zapatillas mujer · ${LISTAS_FECHA}`,
    description: "Zapatilla de Skechers. Fue la nº 1 de la lista de zapatillas de mujer de Amazon.es."
  },
  {
    id: 12,
    name: "Breaknet Sleek",
    brand: "adidas",
    categories: ["urbano"],
    asins: { mujer: "B0FT3XYNNW" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla urbana de adidas. Estaba en el top 10 de zapatillas de mujer de Amazon.es."
  },

  // ---------------- BALONCESTO ----------------
  {
    id: 13,
    name: "Own The Game 3",
    brand: "adidas",
    categories: ["baloncesto"],
    asins: { hombre: "B0CKY1FL9G" },
    badge: `Nº 1 en baloncesto · ${LISTAS_FECHA}`,
    description: "Zapatilla de baloncesto de adidas. Fue la nº 1 de la lista de baloncesto de hombre de Amazon.es."
  },
  {
    id: 14,
    name: "Court Vision Low Next Nature",
    brand: "Nike",
    categories: ["baloncesto", "urbano"],
    asins: { hombre: "B0983LCM84" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de Nike de inspiración baloncesto, muy usada como zapatilla urbana. Fue la nº 2 de la lista de baloncesto de hombre de Amazon.es."
  },
  {
    id: 15,
    name: "Court Pro 3",
    brand: "Puma",
    categories: ["baloncesto"],
    asins: { unisex: "B0FV8QQKLP" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de baloncesto de Puma. Estaba en el top 10 de la lista de baloncesto de hombre de Amazon.es."
  },
  {
    id: 16,
    name: "Tatum 3",
    brand: "Jordan",
    categories: ["baloncesto"],
    asins: { hombre: "B0DP2S2JJD" },
    badge: `Top ventas Amazon.es · ${LISTAS_FECHA}`,
    description: "Zapatilla de baloncesto de la línea Jordan de Nike. Estaba en la lista de baloncesto de hombre de Amazon.es."
  }
];

// Producto de la tarjeta destacada de la portada
const HERO_PRODUCT_ID = 1;

// Marcas disponibles
const AVAILABLE_BRANDS = ["Todas", "adidas", "Nike", "Puma", "Asics", "Jordan", "Skechers", "Under Armour"];

// Colores de la tarjeta propia de cada marca (degradado)
const BRAND_COLORS = {
  "adidas": ["#111827", "#475569"],
  "Nike": ["#ea580c", "#9a3412"],
  "Puma": ["#dc2626", "#7f1d1d"],
  "Asics": ["#1d4ed8", "#1e3a8a"],
  "Jordan": ["#b91c1c", "#111827"],
  "Skechers": ["#0284c7", "#1e3a8a"],
  "Under Armour": ["#334155", "#020617"]
};

// Categorías disponibles
const AVAILABLE_CATEGORIES = [
  { id: "todas", label: "Todas las zapatillas" },
  { id: "novedades", label: "Novedades" },
  { id: "running", label: "Running" },
  { id: "baloncesto", label: "Baloncesto" },
  { id: "urbano", label: "Estilo Urbano" }
];

// Compatibilidad con entorno navegador y Node.js para testing
if (typeof window !== "undefined") {
  window.PRODUCTS_DATA = PRODUCTS_DATA;
  window.AVAILABLE_BRANDS = AVAILABLE_BRANDS;
  window.AVAILABLE_CATEGORIES = AVAILABLE_CATEGORIES;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCTS_DATA, AVAILABLE_BRANDS, AVAILABLE_CATEGORIES, BRAND_COLORS, HERO_PRODUCT_ID };
}
