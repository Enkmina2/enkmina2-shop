/**
 * ENKMINA2 SHOP - Catálogo de productos reales compilado
 * Generado automáticamente por scripts/actualizar-catalogo.mjs
 * Fecha de compilación: 2026-10-30T15:43:30.309Z
 * Estado de la API de Amazon: Inactiva (Modo seguro)
 *
 * NO EDITAR ESTE ARCHIVO MANUALMENTE.
 * Edita data/catalogo.csv y ejecuta: node scripts/actualizar-catalogo.mjs
 */

const CATALOG_REAL_PRODUCTS = [
  {
    "id": "amz-B077MJJMQL",
    "asin": "B077MJJMQL",
    "name": "Puma Smash v2 L",
    "brand": "Puma",
    "categories": [
      "urbano",
      "novedades"
    ],
    "featured": true,
    "status": "pendiente",
    "source": "csv",
    "image": "./logo.png",
    "url": "https://www.amazon.es/dp/B077MJJMQL?tag=enkmina2shop-21",
    "price": null,
    "priceFetchedAt": null,
    "description": "Producto disponible en Amazon.es (ASIN: B077MJJMQL). Consulta disponibilidad, tallas y precio exacto en Amazon."
  },
  {
    "id": "amz-B098PG98N2",
    "asin": "B098PG98N2",
    "name": "Nike Revolution 6",
    "brand": "Nike",
    "categories": [
      "running",
      "novedades"
    ],
    "featured": true,
    "status": "pendiente",
    "source": "csv",
    "image": "./logo.png",
    "url": "https://www.amazon.es/dp/B098PG98N2?tag=enkmina2shop-21",
    "price": null,
    "priceFetchedAt": null,
    "description": "Producto disponible en Amazon.es (ASIN: B098PG98N2). Consulta disponibilidad, tallas y precio exacto en Amazon."
  },
  {
    "id": "amz-B0CKRZWSSV",
    "asin": "B0CKRZWSSV",
    "name": "Adidas Runfalcon 5",
    "brand": "Adidas",
    "categories": [
      "running",
      "novedades"
    ],
    "featured": true,
    "status": "pendiente",
    "source": "csv",
    "image": "./logo.png",
    "url": "https://www.amazon.es/dp/B0CKRZWSSV?tag=enkmina2shop-21",
    "price": null,
    "priceFetchedAt": null,
    "description": "Producto disponible en Amazon.es (ASIN: B0CKRZWSSV). Consulta disponibilidad, tallas y precio exacto en Amazon."
  }
];

if (typeof window !== "undefined") {
  window.CATALOG_REAL_PRODUCTS = CATALOG_REAL_PRODUCTS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATALOG_REAL_PRODUCTS };
}
