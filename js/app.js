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
 * Enlace a Amazon.es con nuestro ID: ficha del producto si hay ASIN, si no, búsqueda por nombre
 */
function amazonUrl(item) {
  if (item.asin) {
    return `https://www.amazon.es/dp/${encodeURIComponent(item.asin)}?tag=${AMAZON_TAG}`;
  }
  return `https://www.amazon.es/s?k=${encodeURIComponent(item.name)}&tag=${AMAZON_TAG}`;
}

// Estado global de la aplicación
const AppState = {
  currentCategory: "todas",
  currentBrand: "Todas",
  searchQuery: "",
  sortBy: "featured",
  activeProductModal: null
};

// Placeholder SVG en caso de imagen no disponible o fallo de red
const SNEAKER_FALLBACK_SVG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20400%22%20width%3D%22400%22%20height%3D%22400%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Cpath%20d%3D%22M80%2C260%20C120%2C260%20140%2C240%20190%2C230%20C240%2C220%20270%2C180%20310%2C180%20C330%2C180%20340%2C195%20340%2C215%20C340%2C245%20310%2C265%20270%2C270%20L90%2C270%20Z%22%20fill%3D%22%230f1115%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22310%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%3EZAPATILLAS%20SHOP%3C%2Ftext%3E%3C%2Fsvg%3E";

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
      if (AppState.currentCategory === "novedades") {
        if (!item.isNew && !item.categories.includes("novedades")) return false;
      } else if (!item.categories.includes(AppState.currentCategory)) {
        return false;
      }
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
      const matchName = item.name.toLowerCase().includes(q);
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
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
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
        <img src="${item.image}"
             alt="${item.name} - ${item.brand}"
             loading="lazy"
             onerror="this.onerror=null; this.src='${SNEAKER_FALLBACK_SVG}';">
        <span class="img-note">Imagen ilustrativa</span>
      </div>
      <div class="card-body">
        <div class="card-brand">${item.brand}</div>
        <h3 class="card-title" title="${item.name}">
          <a href="javascript:void(0)" onclick="openOfferModal(${item.id})">${item.name}</a>
        </h3>

        <div class="card-actions">
          <a class="btn-offer" href="${amazonUrl(item)}" ${AMAZON_LINK_ATTRS}>
            Ver en Amazon
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
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
 * Enlaza el botón de la tarjeta destacada de la portada con Amazon
 */
function initHeroCard() {
  const btn = document.getElementById("heroAmazonBtn");
  const item = PRODUCTS_DATA.find(p => p.id === 1);
  if (btn && item) btn.href = amazonUrl(item);
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
        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${SNEAKER_FALLBACK_SVG}';">
        <span class="img-note">Imagen ilustrativa</span>
      </div>
      <div class="modal-product-details">
        <span class="modal-product-brand">${item.brand}</span>
        <h3>${item.name}</h3>
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

    <ul class="modal-specs-list">
      <li><strong>Tienda:</strong> ${item.store}</li>
      <li><strong>Colorway:</strong> ${item.color}</li>
    </ul>

    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      <a href="${amazonUrl(item)}"
         ${AMAZON_LINK_ATTRS}
         class="modal-cta-btn">
        Ver precio en Amazon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
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
        <p>No mostramos precios ni valoraciones. El precio, las tallas y la disponibilidad son los que indique Amazon.es en el momento de la compra. Las imágenes del catálogo son ilustrativas y pueden no corresponder exactamente al modelo.</p>
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
