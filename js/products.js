/**
 * ENKMINA2 SHOP - Productos de DEMOSTRACIÓN
 *
 * Estos 16 productos se conservan solo para mantener el diseño del catálogo
 * mientras se incorporan productos reales verificados.
 *
 * - NO son ofertas reales.
 * - NO tienen precio, descuento, valoraciones ni enlace de afiliado.
 * - Las imágenes son ilustrativas (Unsplash) y pueden no corresponder al modelo indicado.
 * - Los textos descriptivos son de ejemplo y no están verificados.
 *
 * La versión original completa (con los datos ficticios de precios y valoraciones)
 * se conserva en _backup/2026-10-30/js/products.js.
 *
 * Los productos REALES no se añaden aquí: se añaden en data/catalogo.csv
 * y se generan con `node scripts/actualizar-catalogo.mjs`.
 */

const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    name: "Air Jordan 1 Retro High OG",
    brand: "Jordan",
    categories: ["baloncesto", "urbano", "novedades"],
    featured: true,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    description: "Texto de ejemplo: silueta clásica de baloncesto muy utilizada como zapatilla urbana."
  },
  {
    id: "demo-2",
    name: "Nike Air Max 270",
    brand: "Nike",
    categories: ["urbano", "novedades"],
    featured: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Texto de ejemplo: zapatilla de estilo urbano con cámara de aire visible en el talón."
  },
  {
    id: "demo-3",
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    categories: ["running", "novedades"],
    featured: true,
    image: "",
    description: "Texto de ejemplo: zapatilla de running con mediasuela amortiguada."
  },
  {
    id: "demo-4",
    name: "New Balance 550 Vintage White",
    brand: "New Balance",
    categories: ["urbano", "baloncesto", "novedades"],
    featured: true,
    image: "",
    description: "Texto de ejemplo: modelo de inspiración retro procedente del baloncesto."
  },
  {
    id: "demo-5",
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    categories: ["urbano"],
    featured: true,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    description: "Texto de ejemplo: clásico de la calle con origen en las pistas de baloncesto."
  },
  {
    id: "demo-6",
    name: "Puma MB.02",
    brand: "Puma",
    categories: ["baloncesto", "novedades"],
    featured: false,
    image: "",
    description: "Texto de ejemplo: zapatilla de baloncesto de la línea signature de LaMelo Ball."
  },
  {
    id: "demo-7",
    name: "Asics Gel-Kayano 30",
    brand: "Asics",
    categories: ["running"],
    featured: true,
    image: "",
    description: "Texto de ejemplo: zapatilla de running orientada a la estabilidad."
  },
  {
    id: "demo-8",
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    categories: ["urbano", "baloncesto"],
    featured: true,
    image: "",
    description: "Texto de ejemplo: silueta baja de origen universitario, muy usada en estilo urbano."
  },
  {
    id: "demo-9",
    name: "Nike Zoom Freak 5",
    brand: "Nike",
    categories: ["baloncesto"],
    featured: false,
    image: "",
    description: "Texto de ejemplo: zapatilla de baloncesto de la línea de Giannis Antetokounmpo."
  },
  {
    id: "demo-10",
    name: "New Balance Fresh Foam X 1080",
    brand: "New Balance",
    categories: ["running", "novedades"],
    featured: false,
    image: "",
    description: "Texto de ejemplo: zapatilla de running con amortiguación Fresh Foam."
  },
  {
    id: "demo-11",
    name: "Air Jordan 4 Retro SE Craft",
    brand: "Jordan",
    categories: ["baloncesto", "urbano", "novedades"],
    featured: true,
    image: "",
    description: "Texto de ejemplo: modelo retro de la línea Jordan."
  },
  {
    id: "demo-12",
    name: "Adidas Forum Low",
    brand: "Adidas",
    categories: ["urbano"],
    featured: false,
    image: "",
    description: "Texto de ejemplo: silueta de los años 80 con tira en el tobillo."
  },
  {
    id: "demo-13",
    name: "Nike Pegasus 40",
    brand: "Nike",
    categories: ["running"],
    featured: false,
    image: "",
    description: "Texto de ejemplo: zapatilla de running polivalente para entrenamiento diario."
  },
  {
    id: "demo-14",
    name: "Puma Suede Classic",
    brand: "Puma",
    categories: ["urbano"],
    featured: false,
    image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
    description: "Texto de ejemplo: clásico de ante con la franja característica de Puma."
  },
  {
    id: "demo-15",
    name: "Asics Novablast 4",
    brand: "Asics",
    categories: ["running", "novedades"],
    featured: true,
    image: "",
    description: "Texto de ejemplo: zapatilla de running de perfil dinámico."
  },
  {
    id: "demo-16",
    name: "Jordan Luka 2",
    brand: "Jordan",
    categories: ["baloncesto"],
    featured: false,
    image: "",
    description: "Texto de ejemplo: zapatilla de baloncesto de la línea de Luka Dončić."
  }
].map(p => ({
  ...p,
  status: "demo",          // demo | pendiente | verificado
  source: "demo",
  asin: null,
  url: null,               // sin enlace: no es una oferta real
  price: null,             // sin precio: no se inventa
  priceFetchedAt: null
}));

// Categorías del catálogo (fijas)
const AVAILABLE_CATEGORIES = [
  { id: "todas", label: "Todas las zapatillas" },
  { id: "novedades", label: "Novedades" },
  { id: "running", label: "Running" },
  { id: "baloncesto", label: "Baloncesto" },
  { id: "urbano", label: "Estilo Urbano" }
];

if (typeof window !== "undefined") {
  window.DEMO_PRODUCTS = DEMO_PRODUCTS;
  window.AVAILABLE_CATEGORIES = AVAILABLE_CATEGORIES;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DEMO_PRODUCTS, AVAILABLE_CATEGORIES };
}
