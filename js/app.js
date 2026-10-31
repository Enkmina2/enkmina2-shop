/**
 * ENKMINA2 SHOP - Aplicación Principal
 * Manejo de catálogo, filtros dinámicos, buscador en tiempo real,
 * ordenación, modales informativos y enlaces de Afiliados de Amazon.
 */

// ID de Afiliados de Amazon
const AMAZON_TAG = "enkmina2shop-21";

// Atributos comunes de los enlaces de afiliado
const AMAZON_LINK_ATTRS = 'target="_blank" rel="nofollow sponsored noopener"';

/**
 * Enlace a la ficha de Amazon.es de un ASIN con nuestro ID
 */
function amazonUrl(asin) {
  return `https://www.amazon.es/dp/${encodeURIComponent(asin)}?tag=${AMAZON_TAG}`;
}

// Texto bajo el botón cuando solo hay una versión
const VERSION_LABELS = {
  hombre: "Modelo de hombre",
  mujer: "Modelo de mujer",
  unisex: "Unisex"
};

/**
 * Botones a Amazon: "Hombre" y "Mujer" si existen las dos versiones;
 * si no, un "Ver en Amazon" con la versión indicada debajo
 */
function amazonButtons(item, label = "Ver en Amazon", btnClass = "btn-offer") {
  const icon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>`;
  const { hombre, mujer } = item.asins;

  if (hombre && mujer) {
    return `
      <div class="amazon-pair-label">${label}:</div>
      <div class="amazon-btn-pair">
        <a class="${btnClass}" href="${amazonUrl(hombre)}" ${AMAZON_LINK_ATTRS}>Hombre ${icon}</a>
        <a class="${btnClass}" href="${amazonUrl(mujer)}" ${AMAZON_LINK_ATTRS}>Mujer ${icon}</a>
      </div>`;
  }

  const [version, asin] = Object.entries(item.asins)[0];
  return `
    <a class="${btnClass}" href="${amazonUrl(asin)}" ${AMAZON_LINK_ATTRS}>${label} ${icon}</a>
    <div class="version-note">${VERSION_LABELS[version]}</div>`;
}

/**
 * Tarjeta propia de la zapatilla: degradado con el color de la marca,
 * silueta genérica, marca y modelo. Se usa en lugar de fotos y como respaldo
 * si alguna vez una foto (item.image) no carga.
 */
function productVisual(item) {
  const [c1, c2] = BRAND_COLORS[item.brand] || ["#1f2937", "#4b5563"];
  return `
    <div class="brand-visual" style="background: linear-gradient(135deg, ${c1}, ${c2});">
      <svg class="brand-visual-shoe" viewBox="0 0 120 60" aria-hidden="true">
        <path d="M10 44V22c0-3 2-5 5-5h9c3 0 5 2 6 5l2 5c1 3 5 4 8 2l10-8c3-3 7-3 10 0l8 8c6 5 13 8 21 10l10 2c7 2 11 6 11 13H10z"></path>
        <rect x="8" y="46" width="108" height="7" rx="3.5"></rect>
        <path class="laces" d="M47 27l6 4M53 22l6 4M59 18l6 4"></path>
      </svg>
      <span class="brand-visual-brand">${item.brand}</span>
      <span class="brand-visual-model">${item.name}</span>
      ${item.image ? `<img src="${item.image}" alt="${item.brand} ${item.name}" loading="lazy" onerror="this.remove();">` : ''}
    </div>`;
}

// Estado global de la aplicación
const AppState = {
  currentCategory: "todas",
  currentBrand: "Todas",
  searchQuery: "",
  sortBy: "featured",
  activeProductModal: null
};

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  initCategoryTabs();
  initBrandFilters();
  initSearch();
  initSortSelect();
  initMobileDrawer();
  initModals();
  initContactForm();
  initHeroCard();
  renderCatalog();
  handleUrlHash();
  window.addEventListener("hashchange", handleUrlHash);
  const anio = document.getElementById("anioActual");
  if (anio) anio.textContent = new Date().getFullYear();
});

/**
 * Renderiza los botones de categorías dinámicamente
 */
function initCategoryTabs() {
  const container = document.getElementById("categoryTabsContainer");
  if (!container) return;

  container.innerHTML = AVAILABLE_CATEGORIES.map(cat => `
    <button class="category-tab-btn ${cat.id === AppState.currentCategory ? 'active' : ''}" 
            data-category="${cat.id}">
      ${cat.label}
    </button>
  `).join("");

  container.querySelectorAll(".category-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category");
      setCategory(cat);
    });
  });
}

/**
 * Renderiza los chips de marcas
 */
function initBrandFilters() {
  const container = document.getElementById("brandChipsContainer");
  if (!container) return;

  container.innerHTML = AVAILABLE_BRANDS.map(brand => `
    <button class="brand-chip ${brand === AppState.currentBrand ? 'active' : ''}" 
            data-brand="${brand}">
      ${brand}
    </button>
  `).join("");

  container.querySelectorAll(".brand-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const brand = btn.getAttribute("data-brand");
      setBrand(brand);
    });
  });
}

/**
 * Configura los eventos del buscador
 */
function initSearch() {
  const searchInputs = [
    document.getElementById("headerSearchInput"),
    document.getElementById("catalogSearchInput")
  ].filter(Boolean);

  const clearBtn = document.getElementById("clearSearchBtn");

  searchInputs.forEach(input => {
    input.addEventListener("input", (e) => {
      const val = e.target.value.trim().toLowerCase();
      AppState.searchQuery = val;

      // Sincronizar inputs si hay varios
      searchInputs.forEach(otherInput => {
        if (otherInput !== input) otherInput.value = e.target.value;
      });

      if (clearBtn) {
        clearBtn.style.display = val.length > 0 ? "block" : "none";
      }

      renderCatalog();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInputs.forEach(input => input.value = "");
      AppState.searchQuery = "";
      clearBtn.style.display = "none";
      renderCatalog();
    });
  }
}

/**
 * Control del desplegable de ordenación
 */
function initSortSelect() {
  const sortSelect = document.getElementById("sortBySelect");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", (e) => {
    AppState.sortBy = e.target.value;
    renderCatalog();
  });
}

/**
 * Cambio de categoría activa
 */
function setCategory(categoryId, scrollToGrid = false) {
  AppState.currentCategory = categoryId;

  // Actualizar clases de botones
  document.querySelectorAll(".category-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-category") === categoryId);
  });

  renderCatalog();

  if (scrollToGrid) {
    const catalogElem = document.getElementById("catalogo");
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: "smooth" });
    }
  }
}

/**
 * Cambio de marca activa
 */
function setBrand(brandName) {
  AppState.currentBrand = brandName;

  document.querySelectorAll(".brand-chip").forEach(chip => {
    chip.classList.toggle("active", chip.getAttribute("data-brand") === brandName);
  });

  renderCatalog();
}

/**
 * Filtra y ordena los productos según el estado actual
 */
function getFilteredProducts() {
  return PRODUCTS_DATA.filter(item => {
    // Filtro de categoría
    if (AppState.currentCategory !== "todas") {
      if (!item.categories.includes(AppState.currentCategory)) return false;
    }

    // Filtro de marca
    if (AppState.currentBrand !== "Todas") {
      if (item.brand.toLowerCase() !== AppState.currentBrand.toLowerCase()) {
        return false;
      }
    }

    // Filtro de búsqueda por texto
    if (AppState.searchQuery) {
      const q = AppState.searchQuery;
      const matchName = `${item.brand} ${item.name}`.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchCat = item.categories.some(c => c.toLowerCase().includes(q));
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchDesc) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (AppState.sortBy) {
      case "name":
        return a.name.localeCompare(b.name, "es");
      case "featured":
      default:
        // Orden del catálogo en products.js
        return a.id - b.id;
    }
  });
}

/**
 * Renderiza la rejilla del catálogo de zapatillas
 */
function renderCatalog() {
  const grid = document.getElementById("productsGrid");
  const counter = document.getElementById("catalogCounter");
  if (!grid) return;

  const filtered = getFilteredProducts();

  // Actualizar contador
  if (counter) {
    counter.textContent = `Mostrando ${filtered.length} de ${PRODUCTS_DATA.length} modelos`;
  }

  // Si no hay resultados
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No se encontraron zapatillas</h3>
        <p>Prueba a cambiar los filtros o el término de búsqueda.</p>
        <button class="btn-primary" onclick="resetFilters()">Restablecer filtros</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="product-card" data-id="${item.id}">
      <div class="card-image-wrap" onclick="openOfferModal(${item.id})">
        ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
        ${productVisual(item)}
      </div>
      <div class="card-body">
        <div class="card-brand">${item.brand}</div>
        <h3 class="card-title" title="${item.name}">
          <a href="javascript:void(0)" onclick="openOfferModal(${item.id})">${item.name}</a>
        </h3>

        <div class="card-actions">
          ${amazonButtons(item, "Ver en Amazon")}
        </div>
      </div>
    </article>
  `).join("");
}

/**
 * Resetea todos los filtros de búsqueda
 */
function resetFilters() {
  AppState.currentCategory = "todas";
  AppState.currentBrand = "Todas";
  AppState.searchQuery = "";
  AppState.sortBy = "featured";

  ["headerSearchInput", "catalogSearchInput"].forEach(id => {
    const searchInput = document.getElementById(id);
    if (searchInput) searchInput.value = "";
  });

  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) clearBtn.style.display = "none";

  const sortSelect = document.getElementById("sortBySelect");
  if (sortSelect) sortSelect.value = "featured";

  initCategoryTabs();
  initBrandFilters();
  renderCatalog();
}

/**
 * Rellena la tarjeta destacada de la portada con el producto HERO_PRODUCT_ID
 */
function initHeroCard() {
  const card = document.getElementById("heroCard");
  const item = PRODUCTS_DATA.find(p => p.id === HERO_PRODUCT_ID);
  if (!card || !item) return;

  card.innerHTML = `
    <span class="hero-card-badge">${item.badge}</span>
    ${productVisual(item)}
    <div class="hero-card-info">
      <h3>${item.brand} ${item.name}</h3>
      <p>${item.description}</p>
      <div class="hero-card-meta">
        <a href="javascript:void(0)" class="hero-card-details" onclick="openOfferModal(${item.id})">Ver detalles</a>
      </div>
      <div class="hero-card-actions">
        ${amazonButtons(item, "Ver en Amazon", "btn-primary")}
      </div>
    </div>`;
}

/**
 * Abre el modal con información detallada y aviso de enlace afiliado
 */
function openOfferModal(productId) {
  const item = PRODUCTS_DATA.find(p => p.id === productId);
  if (!item) return;

  const modalOverlay = document.getElementById("offerModalOverlay");
  const modalContent = document.getElementById("offerModalContent");
  if (!modalOverlay || !modalContent) return;

  modalContent.innerHTML = `
    <span class="modal-header-badge">Enlace de Afiliados de Amazon</span>

    <div class="modal-product-summary">
      <div class="modal-img-wrap">
        ${productVisual(item)}
      </div>
      <div class="modal-product-details">
        <span class="modal-product-brand">${item.brand}</span>
        <h3>${item.name}</h3>
        ${item.badge ? `<span class="modal-product-badge">${item.badge}</span>` : ''}
      </div>
    </div>

    <div class="modal-info-box">
      <h4>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Precio y disponibilidad en Amazon.es
      </h4>
      <p>
        El precio, las tallas y la disponibilidad son los que indique Amazon.es en el momento de la compra. Si compras a través de este enlace, podemos recibir una comisión sin ningún coste adicional para ti.
      </p>
    </div>

    <p style="font-size: 0.9rem; color: #4b5563; margin-bottom: 1rem;">
      ${item.description}
    </p>

    <div class="modal-actions">
      ${amazonButtons(item, "Ver precio en Amazon", "modal-cta-btn")}
    </div>
  `;

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Control del cajón móvil (Menú responsive)
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById("mobileToggleBtn");
  const drawer = document.getElementById("mobileDrawer");

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    drawer.classList.toggle("active");
  });

  // Cerrar al pulsar un enlace
  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("active");
    });
  });
}

/**
 * Configuración de modales de políticas y aviso legal
 */
function initModals() {
  const closeButtons = document.querySelectorAll(".modal-close-trigger");
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  // Cerrar con Escape o clic fuera
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

/**
 * Cierra todos los modales activos
 */
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.classList.remove("active");
  });
  document.body.style.overflow = "";
}

/**
 * Abre modal de políticas o contacto
 */
function openPolicyModal(type) {
  closeAllModals();
  const overlay = document.getElementById("policyModalOverlay");
  const container = document.getElementById("policyModalContainer");
  if (!overlay || !container) return;

  let title = "";
  let content = "";

  switch (type) {
    case "privacidad":
      title = "Política de Privacidad";
      content = `
        <p>En <strong>ENKMINA2 SHOP</strong> nos tomamos muy en serio la confidencialidad y privacidad de nuestros visitantes.</p>
        <h3>1. Datos recopilados</h3>
        <p>Este sitio web estático no recopila ni almacena datos personales ni financieros de los usuarios en ninguna base de datos sin su consentimiento explícito.</p>
        <h3>2. Enlaces a Amazon.es</h3>
        <p>Nuestro catálogo contiene enlaces de afiliado a Amazon.es. Al hacer clic en ellos abandonas nuestro sitio y pasa a aplicarse la política de privacidad de Amazon. Amazon puede usar cookies para registrar que has llegado desde nuestros enlaces; consulta su Aviso de Privacidad y su Aviso de Cookies en Amazon.es.</p>
        <h3>3. Derechos</h3>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión y oposición sobre cualquier dato personal que nos facilites.</p>
      `;
      break;

    case "cookies":
      title = "Política de Cookies";
      content = `
        <p>Esta web no instala cookies propias ni de analítica.</p>
        <h3>Cookies de Amazon</h3>
        <ul>
          <li><strong>Cookies de afiliación de Amazon:</strong> Cuando visitas Amazon.es desde nuestros enlaces, Amazon puede usar cookies para registrar que llegas desde ENKMINA2 SHOP y atribuirnos las compras que cumplan los requisitos del Programa de Afiliados. Esas cookies las gestiona Amazon según su propio Aviso de Cookies.</li>
        </ul>
        <p>Puede configurar su navegador en cualquier momento para bloquear o rechazar las cookies sin que ello impida consultar el catálogo.</p>
      `;
      break;

    case "afiliacion":
      title = "Aviso Legal y Transparencia de Afiliación";
      content = `
        <p class="amazon-disclosure"><strong>«En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.»</strong></p>
        <h3>Programa de Afiliados de Amazon</h3>
        <p>ENKMINA2 SHOP («Camina con propósito») es un catálogo independiente de calzado deportivo que participa en el Programa de Afiliados de Amazon.es (ID: <code>enkmina2shop-21</code>). Si compras a través de nuestros enlaces, podemos recibir una comisión <strong>sin ningún coste adicional para ti</strong>.</p>
        <h3>Precios, disponibilidad e imágenes</h3>
        <p>No mostramos precios ni valoraciones. El precio, las tallas y la disponibilidad son los que indique Amazon.es en el momento de la compra. No mostramos fotos de producto: cada tarjeta es un diseño propio con la marca y el modelo; las imágenes oficiales están en Amazon.es.</p>
        <h3>Selección del catálogo</h3>
        <p>Los modelos se eligieron de las listas «Los más vendidos» de Amazon.es en octubre de 2026. Los distintivos «Top ventas» y «Nº 1» se refieren a esas listas en esa fecha; la clasificación de Amazon cambia continuamente.</p>
      `;
      break;

    case "contacto":
      title = "Contacto y Soporte";
      content = `
        <p>Estamos preparando un canal de contacto. Mientras tanto, puedes consultar las dudas sobre tallas, envíos o devoluciones directamente en la página del producto en Amazon.es.</p>
      `;
      break;
  }

  container.innerHTML = `
    <h2>${title}</h2>
    ${content}
  `;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function initContactForm() {
  // Inicialización reservada para formularios en página si procede
}

/**
 * Muestra un aviso flotante (Toast)
 */
function showToast(message) {
  let toast = document.getElementById("siteToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3800);
}

/**
 * Comprueba el hash en la URL al cargar
 */
function handleUrlHash() {
  const hash = window.location.hash.replace("#", "").toLowerCase();
  if (["running", "baloncesto", "urbano", "novedades"].includes(hash)) {
    setCategory(hash);
  }
}
