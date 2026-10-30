/**
 * ENKMINA2 SHOP - Catálogo de zapatillas
 * Los enlaces a Amazon.es se generan en app.js con amazonUrl(item):
 * - si "asin" tiene valor: https://www.amazon.es/dp/<asin>?tag=enkmina2shop-21
 * - si está vacío: búsqueda en Amazon.es por el nombre del modelo.
 * No se guardan precios ni valoraciones: Amazon no permite escribirlos a mano.
 */

const PRODUCTS_DATA = [
  {
    id: 1,
    asin: "",
    name: "Air Jordan 1 Retro High OG",
    brand: "Jordan",
    category: "baloncesto",
    categories: ["baloncesto", "urbano", "novedades"],
    isNew: true,
    isFeatured: true,
    badge: "Novedad",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    description: "El clásico inmortal del baloncesto reconvertido en icono de la moda urbana. Amortiguación Air-Sole encapsulada y confección en piel premium.",
    store: "Amazon.es",
    sizes: ["40", "41", "42", "42.5", "43", "44", "45"],
    color: "Rojo / Negro / Blanco"
  },
  {
    id: 2,
    asin: "",
    name: "Nike Air Max 270 Flyknit",
    brand: "Nike",
    category: "urbano",
    categories: ["urbano", "novedades"],
    isNew: true,
    isFeatured: true,
    badge: "Novedad",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Mayor unidad Max Air en el talón para una pisada ultrasuave que parece flotar. Tejido superior transpirable perfecto para el día a día.",
    store: "Amazon.es",
    sizes: ["39", "40", "41", "42", "43", "44"],
    color: "Rojo Carmín / Blanco"
  },
  {
    id: 3,
    asin: "",
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    category: "running",
    categories: ["running", "novedades"],
    isNew: true,
    isFeatured: true,
    badge: "Recomendado Running",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    description: "La zapatilla de running con retorno de energía legendario Boost. Un 30% más ligera con suela Continental para agarre superior en asfalto húmedo.",
    store: "Amazon.es",
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    color: "Negro Core / Blanco"
  },
  {
    id: 4,
    asin: "",
    name: "New Balance 550 Vintage White",
    brand: "New Balance",
    category: "urbano",
    categories: ["urbano", "baloncesto", "novedades"],
    isNew: true,
    isFeatured: true,
    badge: "Tendencia",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    description: "Tributo al baloncesto profesional de 1989 y la cultura skate. Silueta limpia y estilizada de cuero genuino que combina con todo.",
    store: "Amazon.es",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    color: "Blanco Sal / Verde Bosque"
  },
  {
    id: 5,
    asin: "",
    name: "Nike Air Force 1 '07 All White",
    brand: "Nike",
    category: "urbano",
    categories: ["urbano"],
    isNew: false,
    isFeatured: true,
    badge: "Clásico Eterno",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    description: "El icono de las pistas de basket de 1982 que conquistó el hip-hop y las calles del mundo. Cuero impecable y amortiguación Nike Air duradera.",
    store: "Amazon.es",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    color: "Triple White"
  },
  {
    id: 6,
    asin: "",
    name: "Puma MB.02 Rick & Morty / LaMelo",
    brand: "Puma",
    category: "baloncesto",
    categories: ["baloncesto", "novedades"],
    isNew: true,
    isFeatured: false,
    badge: "Edición Limitada",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    description: "La zapatilla signature de LaMelo Ball con tecnología NITRO Foam para saltos explosivos y amortiguación receptiva en la cancha.",
    store: "Amazon.es",
    sizes: ["41", "42", "43", "44", "45"],
    color: "Volt / Coral Explosivo"
  },
  {
    id: 7,
    asin: "",
    name: "Asics Gel-Kayano 30 Running",
    brand: "Asics",
    category: "running",
    categories: ["running"],
    isNew: false,
    isFeatured: true,
    badge: "Máxima Amortiguación",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    description: "Estabilidad adaptativa 4D GUIDANCE SYSTEM™ y tecnología PureGEL™ para transiciones suaves e impacto reducido en maratón y entrenamientos largos.",
    store: "Amazon.es",
    sizes: ["40.5", "41.5", "42", "42.5", "43.5", "44", "45"],
    color: "Azul Eléctrico / Naranja"
  },
  {
    id: 8,
    asin: "",
    name: "Nike Dunk Low Retro Panda",
    brand: "Nike",
    category: "urbano",
    categories: ["urbano", "baloncesto"],
    isNew: false,
    isFeatured: true,
    badge: "Favorito Urbano",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
    description: "Creada para las canchas universitarias y adoptada por el streetwear contemporáneo. Contraste blanco y negro versátil con zona del tobillo acolchada.",
    store: "Amazon.es",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    color: "Blanco / Negro"
  },
  {
    id: 9,
    asin: "",
    name: "Nike Zoom Freak 5 (Giannis)",
    brand: "Nike",
    category: "baloncesto",
    categories: ["baloncesto"],
    isNew: false,
    isFeatured: false,
    badge: "",
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    description: "Diseñadas para la velocidad supersónica de Giannis Antetokounmpo. Tracción multidireccional que frena en seco y permite giros vertiginosos.",
    store: "Amazon.es",
    sizes: ["41", "42", "43", "44", "45", "46"],
    color: "Gris Platino / Verde Lima"
  },
  {
    id: 10,
    asin: "",
    name: "New Balance Fresh Foam X 1080v13",
    brand: "New Balance",
    category: "running",
    categories: ["running", "novedades"],
    isNew: true,
    isFeatured: false,
    badge: "Confort Premium",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    description: "Si New Balance solo fabricara una zapatilla de running, sería la 1080. Amortiguación Fresh Foam X inigualable con empeine de malla transpirable.",
    store: "Amazon.es",
    sizes: ["40", "41", "42", "43", "44", "45"],
    color: "Gris Clásico NB / Blanco"
  },
  {
    id: 11,
    asin: "",
    name: "Air Jordan 4 Retro SE Craft",
    brand: "Jordan",
    category: "baloncesto",
    categories: ["baloncesto", "urbano", "novedades"],
    isNew: true,
    isFeatured: true,
    badge: "Colección Hype",
    image: "https://images.unsplash.com/photo-1512374382149-233c42b661ac?auto=format&fit=crop&w=800&q=80",
    description: "La legendaria silueta de Tinker Hatfield confeccionada con mezcla artesanal de ante y cuero de primera calidad. Una joya para coleccionistas.",
    store: "Amazon.es",
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    color: "Gris Piedra / Vainilla"
  },
  {
    id: 12,
    asin: "",
    name: "Adidas Forum Low Classic",
    brand: "Adidas",
    category: "urbano",
    categories: ["urbano"],
    isNew: false,
    isFeatured: false,
    badge: "",
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80",
    description: "Mucho más que una zapatilla de basket: un statement de los 80. Detalle característico en 'X' en el tobillo y suela de goma vintage.",
    store: "Amazon.es",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    color: "Blanco Vintage / Azul Marino"
  },
  {
    id: 13,
    asin: "",
    name: "Nike Pegasus 40 Road Running",
    brand: "Nike",
    category: "running",
    categories: ["running"],
    isNew: false,
    isFeatured: false,
    badge: "Caballo de Batalla",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    description: "40 años acompañando a corredores de todo el planeta. Doble unidad Zoom Air y espuma React para una zapatilla incansable en asfalto y tierra.",
    store: "Amazon.es",
    sizes: ["40", "41", "42", "43", "44", "45"],
    color: "Negro Obsidiana / Blanco"
  },
  {
    id: 14,
    asin: "",
    name: "Puma Suede Classic XXI",
    brand: "Puma",
    category: "urbano",
    categories: ["urbano"],
    isNew: false,
    isFeatured: false,
    badge: "Icono Retro",
    image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
    description: "Desde su debut en 1968, ha vestido a b-boys, atletas y artistas. Ante suave con la franja característica de Puma en contraste.",
    store: "Amazon.es",
    sizes: ["37", "38", "39", "40", "41", "42", "43", "44"],
    color: "Negro / Blanco Marfil"
  },
  {
    id: 15,
    asin: "",
    name: "Asics Novablast 4 Performance",
    brand: "Asics",
    category: "running",
    categories: ["running", "novedades"],
    isNew: true,
    isFeatured: true,
    badge: "Rebote Dinámico",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    description: "Espuma FF BLAST™ PLUS ECO para un despegue enérgico tipo trampolín. Ideal para corredores que buscan ritmo vivo y ligereza extrema.",
    store: "Amazon.es",
    sizes: ["41", "42", "42.5", "43", "44", "45"],
    color: "Blanco Ópalo / Amarillo Lima"
  },
  {
    id: 16,
    asin: "",
    name: "Jordan Luka 2 'Space Hunter'",
    brand: "Jordan",
    category: "baloncesto",
    categories: ["baloncesto"],
    isNew: false,
    isFeatured: false,
    badge: "Control de Ritmo",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80",
    description: "Inspirada en el step-back de Luka Dončić. Estructura envolvente de 360 grados para frenadas laterales y control absoluto de la gravedad.",
    store: "Amazon.es",
    sizes: ["41", "42", "43", "44", "45", "46"],
    color: "Negro / Morado Cósmico"
  }
];

// Marcas disponibles
const AVAILABLE_BRANDS = ["Todas", "Nike", "Adidas", "Jordan", "New Balance", "Puma", "Asics"];

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
  module.exports = { PRODUCTS_DATA, AVAILABLE_BRANDS, AVAILABLE_CATEGORIES };
}

