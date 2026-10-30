/**
 * Zapatillas Shop - Aplicación Principal
 * Manejo de catálogo, filtros dinámicos, buscador en tiempo real,
 * ordenación, modales informativos y aviso de enlaces de afiliados.
 */

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
  initNewsletterForm();
  initContactForm();
  renderCatalog();
  handleUrlHash();
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
      case "price-asc":
        return a.priceCurrent - b.priceCurrent;
      case "price-desc":
        return b.priceCurrent - a.priceCurrent;
      case "discount":
        return b.discountPercentage - a.discountPercentage;
      case "rating":
        return b.rating - a.rating;
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
      <div class="card-image-wrap">
        ${item.badge ? `<span class="card-badge ${item.discountPercentage > 18 ? 'sale' : ''}">${item.badge}</span>` : ''}
        ${item.discountPercentage > 0 ? `<span class="card-discount-tag">-${item.discountPercentage}%</span>` : ''}
        <img src="${item.image}" 
             alt="${item.name} - ${item.brand}" 
             loading="lazy"
             onerror="this.onerror=null; this.src='${SNEAKER_FALLBACK_SVG}';">
      </div>
      <div class="card-body">
        <div class="card-brand">${item.brand}</div>
        <h3 class="card-title" title="${item.name}">${item.name}</h3>
        
        <div class="card-rating">
          <span class="stars">★★★★★</span>
          <span class="rating-val"><strong>${item.rating}</strong></span>
          <span class="rating-count">(${item.reviewsCount})</span>
        </div>

        <div class="card-price-row">
          <span class="price-current">${item.priceCurrent.toFixed(2)} €</span>
          ${item.priceOriginal ? `<span class="price-original">${item.priceOriginal.toFixed(2)} €</span>` : ''}
          <span class="price-indicator">Orientativo</span>
        </div>

        <div class="card-actions">
          <button class="btn-offer" onclick="openOfferModal(${item.id})">
            Ver oferta
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
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

  const searchInput = document.getElementById("headerSearchInput");
  if (searchInput) searchInput.value = "";

  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) clearBtn.style.display = "none";

  const sortSelect = document.getElementById("sortBySelect");
  if (sortSelect) sortSelect.value = "featured";

  initCategoryTabs();
  initBrandFilters();
  renderCatalog();
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
    <span class="modal-header-badge">Enlace de afiliado demostrativo</span>
    
    <div class="modal-product-summary">
      <div class="modal-img-wrap">
        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${SNEAKER_FALLBACK_SVG}';">
      </div>
      <div class="modal-product-details">
        <span class="modal-product-brand">${item.brand}</span>
        <h3>${item.name}</h3>
        <div class="card-rating" style="margin-bottom: 0.2rem;">
          <span class="stars">★★★★★</span>
          <span><strong>${item.rating}</strong> / 5.0 (${item.reviewsCount} opiniones verificadas)</span>
        </div>
        <div class="modal-product-price">
          ${item.priceCurrent.toFixed(2)} €
          ${item.priceOriginal ? `<small>${item.priceOriginal.toFixed(2)} €</small>` : ''}
        </div>
      </div>
    </div>

    <div class="modal-info-box">
      <h4>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Aviso sobre esta oferta de demostración
      </h4>
      <p>
        Este sitio web utiliza <strong>enlaces de demostración</strong> para ilustrar el funcionamiento de una tienda afiliada. Al hacer clic en el botón inferior, serías redirigido al distribuidor oficial o comercio colaborador (${item.store}).
      </p>
    </div>

    <p style="font-size: 0.9rem; color: #4b5563; margin-bottom: 1rem;">
      ${item.description}
    </p>

    <ul class="modal-specs-list">
      <li><strong>Tienda asociada:</strong> ${item.store}</li>
      <li><strong>Colorway:</strong> ${item.color}</li>
      <li><strong>Tallas disponibles:</strong> EU ${item.sizes.join(", ")}</li>
      <li><strong>Precio orientativo:</strong> Sujeto a stock y promociones vigentes.</li>
    </ul>

    <div class="modal-affiliate-target">
      <span>Enlace de demostración configurado (fácilmente editable en <code>js/products.js</code>):</span>
      <code>${item.affiliateUrl}</code>
    </div>

    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      <a href="${item.affiliateUrl}" 
         target="_blank" 
         rel="noopener noreferrer nofollow" 
         class="modal-cta-btn" 
         onclick="handleAffiliateClick(event, '${item.name}', '${item.affiliateUrl}')">
        Ir a la tienda asociada (Demo)
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
 * Notificación toast al pulsar en el enlace de demostración
 */
function handleAffiliateClick(e, productName, demoUrl) {
  e.preventDefault();
  closeAllModals();
  showToast(`Simulando redirección de afiliado para "${productName}" hacia el enlace de prueba.`);
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
        <h3>2. Enlaces a terceros</h3>
        <p>Nuestro portal contiene enlaces a tiendas online asociadas y marcas de calzado. Al hacer clic en dichos enlaces y abandonar nuestro sitio, la política de privacidad aplicable será la del sitio web de destino.</p>
        <h3>3. Contacto y derechos</h3>
        <p>Para cualquier duda o ejercicio de derechos ARCO, puede ponerse en contacto a través de nuestro formulario de contacto o en el correo de demostración <code>contacto@enkmina2shop.demo</code>.</p>
      `;
      break;

    case "cookies":
      title = "Política de Cookies";
      content = `
        <p>Esta web utiliza cookies técnicas y analíticas necesarias para el correcto funcionamiento de la navegación y la medición agregada del tráfico.</p>
        <h3>¿Qué cookies se utilizan?</h3>
        <ul>
          <li><strong>Cookies técnicas:</strong> Permiten almacenar temporalmente las preferencias de visualización (filtros y orden de catálogo).</li>
          <li><strong>Cookies de afiliación:</strong> Al visitar una tienda externa a través de un enlace de afiliado, dicha tienda puede emplear cookies para registrar la procedencia del usuario.</li>
        </ul>
        <p>Puede configurar su navegador en cualquier momento para bloquear o rechazar las cookies sin que ello impida consultar el catálogo.</p>
      `;
      break;

    case "afiliacion":
      title = "Aviso Legal y Transparencia de Afiliación";
      content = `
        <p><strong>Aviso de Divulgación de Afiliación:</strong> ENKMINA2 SHOP («Camina con propósito») es un catálogo y comparador independiente de calzado deportivo.</p>
        <h3>Transparencia Comercial</h3>
        <p>Participamos en diversos programas de afiliación de tiendas y marcas reconocidas. Esto significa que podemos percibir una pequeña comisión si decides adquirir un producto a través de nuestros enlaces recomendados, <strong>sin que ello suponga ningún coste adicional para ti</strong>.</p>
        <h3>Precios orientativos</h3>
        <p>Todos los precios mostrados son de carácter orientativo y corresponden a la información recopilada en el momento de la publicación. Los precios y el stock definitivos son siempre los indicados en la web del vendedor final.</p>
      `;
      break;

    case "contacto":
      title = "Contacto y Soporte";
      content = `
        <p>¿Tienes dudas sobre algún modelo, sugerencias o quieres colaborar con nosotros? Rellena el siguiente formulario:</p>
        <form id="modalContactForm" class="contact-form-grid" onsubmit="handleContactSubmit(event)">
          <div class="form-group">
            <label for="contactName">Nombre completo</label>
            <input type="text" id="contactName" required placeholder="Ej. Carlos Martínez">
          </div>
          <div class="form-group">
            <label for="contactEmail">Correo electrónico</label>
            <input type="email" id="contactEmail" required placeholder="nombre@ejemplo.com">
          </div>
          <div class="form-group">
            <label for="contactMsg">Mensaje o consulta</label>
            <textarea id="contactMsg" rows="4" required placeholder="Escribe aquí tu duda sobre zapatillas, tallas o colaboraciones..."></textarea>
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 0.5rem; justify-content: center;">Enviar mensaje</button>
        </form>
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

/**
 * Enviar formulario de contacto
 */
function handleContactSubmit(e) {
  e.preventDefault();
  closeAllModals();
  showToast("¡Mensaje de demostración enviado correctamente! Te responderemos a la mayor brevedad.");
}

/**
 * Enviar suscripción a newsletter de demostración
 */
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    if (input && input.value) {
      input.value = "";
      showToast("¡Gracias por suscribirte al boletín de ENKMINA2 SHOP!");
    }
  });
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
