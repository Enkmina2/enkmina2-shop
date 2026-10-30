/**
 * ENKMINA2 SHOP - Lógica del catálogo (compartida por la web y por los scripts/pruebas).
 *
 * Reglas que aplica:
 * - Un precio solo se muestra si viene de la API oficial de Amazon (source "api"),
 *   el producto está "verificado" y la consulta tiene menos de 24 horas.
 * - Los productos "pendiente" (ASIN sin verificar) y "demo" nunca muestran precio.
 * - Los productos "demo" nunca tienen enlace.
 */
(function (root) {
  "use strict";

  const AFFILIATE_TAG = "enkmina2shop-21";
  const AMAZON_DOMAIN = "www.amazon.es";
  const PRICE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

  const VALID_CATEGORIES = ["novedades", "running", "baloncesto", "urbano"];
  const VALID_STATUSES = ["demo", "pendiente", "verificado"];

  // Dominios desde los que Amazon sirve imágenes de producto (API o SiteStripe).
  const AMAZON_IMAGE_HOSTS = [
    "m.media-amazon.com",
    "images-na.ssl-images-amazon.com",
    "images-eu.ssl-images-amazon.com",
    "ws-eu.amazon-adsystem.com"
  ];

  /** ASIN: 10 caracteres alfanuméricos en mayúsculas (p. ej. B0XXXXXXXX). */
  function isValidAsin(asin) {
    return typeof asin === "string" && /^[A-Z0-9]{10}$/.test(asin);
  }

  /** Enlace de afiliado estándar de Amazon.es a partir de un ASIN. */
  function buildAmazonUrl(asin, tag) {
    if (!isValidAsin(asin)) return null;
    return `https://${AMAZON_DOMAIN}/dp/${asin}?tag=${encodeURIComponent(tag || AFFILIATE_TAG)}`;
  }

  /** Solo se aceptan imágenes servidas por Amazon (no se alojan copias). */
  function isAllowedAmazonImage(url) {
    if (typeof url !== "string" || url.trim() === "") return false;
    try {
      const u = new URL(url.startsWith("//") ? "https:" + url : url);
      return u.protocol === "https:" && AMAZON_IMAGE_HOSTS.includes(u.hostname);
    } catch (e) {
      return false;
    }
  }

  function isPriceFresh(product, now) {
    if (!product || !product.priceFetchedAt) return false;
    const t = Date.parse(product.priceFetchedAt);
    if (Number.isNaN(t)) return false;
    const age = (now || Date.now()) - t;
    return age >= 0 && age <= PRICE_MAX_AGE_MS;
  }

  /** ¿Se puede mostrar el precio de este producto ahora mismo? */
  function hasVerifiedPrice(product, now) {
    return Boolean(
      product &&
      product.status === "verificado" &&
      product.source === "api" &&
      product.price &&
      typeof product.price.amount === "number" &&
      product.price.amount > 0 &&
      isPriceFresh(product, now)
    );
  }

  function formatPrice(price) {
    if (!price || typeof price.amount !== "number") return "";
    try {
      return new Intl.NumberFormat("es-ES", { style: "currency", currency: price.currency || "EUR" }).format(price.amount);
    } catch (e) {
      return price.amount.toFixed(2) + " €";
    }
  }

  /** Productos reales primero, después los de demostración. */
  function mergeCatalog(realProducts, demoProducts) {
    const real = Array.isArray(realProducts) ? realProducts.filter(p => p && p.status !== "demo") : [];
    const demo = Array.isArray(demoProducts) ? demoProducts : [];
    return real.concat(demo);
  }

  function getBrands(products) {
    const set = new Set();
    products.forEach(p => { if (p.brand) set.add(p.brand); });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }

  function normalize(text) {
    return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function filterProducts(products, opts) {
    const category = (opts && opts.category) || "todas";
    const brand = (opts && opts.brand) || "Todas";
    const q = normalize(opts && opts.query).trim();

    return products.filter(p => {
      if (category !== "todas" && !(p.categories || []).includes(category)) return false;
      if (brand !== "Todas" && normalize(p.brand) !== normalize(brand)) return false;
      if (q) {
        const haystack = normalize([p.name, p.brand, (p.categories || []).join(" "), p.description, p.asin].join(" "));
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  const STATUS_ORDER = { verificado: 0, pendiente: 1, demo: 2 };

  function sortProducts(products, sortBy, now) {
    const list = products.slice();
    const byStatus = (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);

    list.sort((a, b) => {
      if (sortBy === "price-asc" || sortBy === "price-desc") {
        const pa = hasVerifiedPrice(a, now) ? a.price.amount : null;
        const pb = hasVerifiedPrice(b, now) ? b.price.amount : null;
        // Sin precio verificado: siempre al final
        if (pa === null && pb === null) return byStatus(a, b) || a.name.localeCompare(b.name, "es");
        if (pa === null) return 1;
        if (pb === null) return -1;
        return sortBy === "price-asc" ? pa - pb : pb - pa;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "es");
      }
      // "featured" (por defecto): estado (reales primero) y destacados
      return byStatus(a, b) || ((b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    });
    return list;
  }

  const ENKCore = {
    AFFILIATE_TAG,
    AMAZON_DOMAIN,
    PRICE_MAX_AGE_MS,
    VALID_CATEGORIES,
    VALID_STATUSES,
    AMAZON_IMAGE_HOSTS,
    isValidAsin,
    buildAmazonUrl,
    isAllowedAmazonImage,
    isPriceFresh,
    hasVerifiedPrice,
    formatPrice,
    mergeCatalog,
    getBrands,
    filterProducts,
    sortProducts
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ENKCore;
  } else {
    root.ENKCore = ENKCore;
  }
})(typeof window !== "undefined" ? window : globalThis);
