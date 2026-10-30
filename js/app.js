/**
 * ENKMINA2 SHOP - Aplicación Principal
 * Catálogo, filtros dinámicos, buscador en tiempo real,
 * ordenación y cumplimiento estricto con las políticas de Amazon Afiliados.
 */

// Estado global de la aplicación
const AppState = {
  currentCategory: "todas",
  currentBrand: "Todas",
  searchQuery: "",
  sortBy: "featured",
  activeProductModal: null
};

// Placeholder SVG en caso de imagen no disponible o fallo de carga
const SNEAKER_FALLBACK_SVG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20400%22%20width%3D%22400%22%20height%3D%22400%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Cpath%20d%3D%22M80%2C260%20C120%2C260%20140%2C240%20190%2C230%20C240%2C220%20270%2C180%20310%2C180%20C330%2C180%20340%2C195%20340%2C215%20C340%2C245%20310%2C265%20270%2C270%20L90%2C270%20Z%22%20fill%3D%22%230f1115%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22310%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%3EENKMINA2%20SHOP%3C%2Ftext%3E%3C%2Fsvg%3E";

/**
 * Obtiene el catálogo unificado (productos reales prioritarios + productos de demostración)
 */
function getAllCatalogProducts() {
  const real = window.CATALOG_REAL_PRODUCTS || [];
  const demo = window.DEMO_PRODUCTS || [];
  if (window.ENKCore && typeof window.ENKCore.mergeCatalog === "function") {
    return window.ENKCore.mergeCatalog(real, demo);
  }
  return real.concat(demo);
}

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
 * Renderiza los botones de categorías
 */
function initCategoryTabs() {
  const container = document.getElementById("categoryTabsContainer");
  if (!container) return;

  const categories = (window.AVAILABLE_CATEGORIES && window.AVAILABLE_CATEGORIES.length > 0)
    ? window.AVAILABLE_CATEGORIES
    : [
        { id: "todas", label: "Todas las zapatillas" },
        { id: "novedades", label: "Novedades" },
        { id: "running", label: "Running" },
        { id: "baloncesto", label: "Baloncesto" },
        { id: "urbano", label: "Estilo Urbano" }
      ];

  container.innerHTML = categories.map(cat => `
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
 * Renderiza los chips de marcas dinámicamente según el catálogo
 */
function initBrandFilters() {
  const container = document.getElementById("brandChipsContainer");
  if (!container) return;

  const allProducts = getAllCatalogProducts();
  const brandsList = window.ENKCore ? window.ENKCore.getBrands(allProducts) : [];
  const availableBrands = ["Todas", ...brandsList];

  container.innerHTML = availableBrands.map(brand => `
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
 * Control del selector de ordenación
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
 * Filtra y ordena los productos aplicando las reglas de verificación
 */
function getFilteredProducts() {
  const catalog = getAllCatalogProducts();

  let filtered = catalog;
  if (window.ENKCore && typeof window.ENKCore.filterProducts === "function") {
    filtered = window.ENKCore.filterProducts(catalog, {
      category: AppState.currentCategory,
      brand: AppState.currentBrand,
      query: AppState.searchQuery
    });
  }

  if (window.ENKCore && typeof window.ENKCore.sortProducts === "function") {
    return window.ENKCore.sortProducts(filtered, AppState.sortBy);
  }

  return filtered;
}

/**
 * Renderiza la rejilla del catálogo de zapatillas
 */
function renderCatalog() {
  const grid = document.getElementById("productsGrid");
  const counter = document.getElementById("catalogCounter");
  if (!grid) return;

  const catalog = getAllCatalogProducts();
  const filtered = getFilteredProducts();

  if (counter) {
    counter.textContent = `Mostrando ${filtered.length} de ${catalog.length} modelos`;
  }

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

  grid.innerHTML = filtered.map(item => {
    const isDemo = item.status === "demo";
    const isPending = item.status === "pendiente";
    const isVerified = item.status === "verificado";

    // Insignia según estado
    let badgeHtml = "";
    if (isDemo) {
      badgeHtml = `<span class="card-badge badge-demo">Demostración</span>`;
    } else if (isPending) {
      badgeHtml = `<span class="card-badge badge-pending">Pendiente de verificar</span>`;
    } else if (isVerified) {
      badgeHtml = `<span class="card-badge badge-verified">Disponible</span>`;
    }

    // Fila de precio (cumpliendo norma estricta: nunca inventar ni mostrar precio manual)
    let priceHtml = "";
    if (isDemo) {
      priceHtml = `
        <div class="price-notice demo-notice">
          Muestra de diseño (sin oferta real)
        </div>
      `;
    } else if (isPending) {
      priceHtml = `
        <div class="price-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Precio no disponible: consúltalo en Amazon
        </div>
      `;
    } else if (isVerified && window.ENKCore && window.ENKCore.hasVerifiedPrice(item)) {
      priceHtml = `
        <div class="card-price-row">
          <span class="price-current">${window.ENKCore.formatPrice(item.price)}</span>
          <span class="price-indicator">Amazon.es</span>
        </div>
        <div class="price-updated-tag">Actualizado en las últimas 24h</div>
      `;
    } else {
      priceHtml = `
        <div class="price-notice">
          Consultar precio en Amazon
        </div>
      `;
    }

    // Botón de acción
    let actionBtnHtml = "";
    if (isDemo) {
      actionBtnHtml = `
        <button class="btn-offer btn-demo" onclick="openProductModal('${item.id}')">
          Ver detalles (Muestra)
        </button>
      `;
    } else if (item.url) {
      actionBtnHtml = `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer nofollow" class="btn-offer btn-amazon" onclick="handleAmazonClick(event, '${item.name}', '${item.url}')">
          Ver en Amazon.es
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      `;
    } else {
      actionBtnHtml = `
        <button class="btn-offer btn-demo" onclick="openProductModal('${item.id}')">
          Ver ficha
        </button>
      `;
    }

    return `
      <article class="product-card" data-id="${item.id}">
        <div class="card-image-wrap">
          ${badgeHtml}
          <img src="${item.image || SNEAKER_FALLBACK_SVG}" 
               alt="${item.name} - ${item.brand}" 
               loading="lazy"
               onerror="this.onerror=null; this.src='${SNEAKER_FALLBACK_SVG}';">
        </div>
        <div class="card-body">
          <div class="card-brand">${item.brand}</div>
          <h3 class="card-title" title="${item.name}">${item.name}</h3>
          
          <div style="margin-bottom: 0.75rem;">
            ${priceHtml}
          </div>

          <div class="card-actions">
            ${actionBtnHtml}
          </div>
        </div>
      </article>
    `;
  }).join("");
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
 * Abre el modal con información detallada y aviso de transparencia
 */
function openProductModal(productId) {
  const catalog = getAllCatalogProducts();
  const item = catalog.find(p => String(p.id) === String(productId));
  if (!item) return;

  const modalOverlay = document.getElementById("offerModalOverlay");
  const modalContent = document.getElementById("offerModalContent");
  if (!modalOverlay || !modalContent) return;

  const isDemo = item.status === "demo";

  modalContent.innerHTML = `
    <span class="modal-header-badge" style="${isDemo ? 'background-color: #f3f4f6; color: #4b5563;' : ''}">
      ${isDemo ? 'Producto de muestra (Demostración)' : 'Información del producto'}
    </span>
    
    <div class="modal-product-summary">
      <div class="modal-img-wrap">
        <img src="${item.image || SNEAKER_FALLBACK_SVG}" alt="${item.name}" onerror="this.onerror=null; this.src='${SNEAKER_FALLBACK_SVG}';">
      </div>
      <div class="modal-product-details">
        <span class="modal-product-brand">${item.brand}</span>
        <h3>${item.name}</h3>
        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.25rem;">
          ${isDemo ? 'Modelo de referencia para el diseño del catálogo.' : `ASIN en Amazon.es: <strong>${item.asin || 'N/D'}</strong>`}
        </p>
      </div>
    </div>

    <div class="modal-info-box" style="${isDemo ? 'background-color: #f8fafc; border-color: #e2e8f0;' : ''}">
      <h4 style="${isDemo ? 'color: #334155;' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        ${isDemo ? 'Aviso de producto no comercial' : 'Aviso sobre precios y disponibilidad'}
      </h4>
      <p style="${isDemo ? 'color: #475569;' : ''}">
        ${isDemo 
          ? 'Este producto se conserva como muestra estética del catálogo mientras se añaden productos reales con enlaces verificados. No representa una oferta vigente ni un enlace activo.'
          : 'Los precios y la disponibilidad de los productos son precisos en la fecha/hora indicada y están sujetos a cambios. Cualquier información sobre precios y disponibilidad mostrada en Amazon en el momento de la compra se aplicará a la compra de este producto.'}
      </p>
    </div>

    <p style="font-size: 0.9rem; color: #4b5563; margin-bottom: 1.25rem;">
      ${item.description || ''}
    </p>

    ${item.url ? `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="${item.url}" 
           target="_blank" 
           rel="noopener noreferrer nofollow" 
           class="modal-cta-btn" 
           onclick="handleAmazonClick(event, '${item.name}', '${item.url}')">
          Consultar precio y disponibilidad en Amazon.es
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    ` : `
      <div style="background: #f1f5f9; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; color: #64748b; text-align: center;">
        Este artículo de demostración no tiene enlace comercial asociado.
      </div>
    `}
  `;

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Mantener compatibilidad con llamadas anteriores
window.openOfferModal = openProductModal;

/**
 * Manejador al hacer clic en un enlace de Amazon
 */
function handleAmazonClick(e, productName, targetUrl) {
  // El enlace abre normalmente en pestaña nueva mediante rel="noopener noreferrer nofollow"
  showToast(`Abriendo ${productName} en Amazon.es...`);
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
 * Abre modal de políticas o contacto con divulgación obligatoria de Amazon
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
        <h3>2. Enlaces a terceros (Amazon.es)</h3>
        <p>Nuestro portal contiene enlaces de afiliación a Amazon.es. Al hacer clic en dichos enlaces y abandonar nuestro sitio, la política de privacidad aplicable será la del sitio web de destino (Amazon).</p>
        <h3>3. Contacto y derechos</h3>
        <p>Para cualquier duda o ejercicio de derechos ARCO, puede ponerse en contacto a través de nuestro formulario de contacto o en el correo <code>contacto@enkmina2shop.demo</code>.</p>
      `;
      break;

    case "cookies":
      title = "Política de Cookies";
      content = `
        <p>Esta web utiliza cookies técnicas necesarias para el correcto funcionamiento de la navegación y la medición agregada del tráfico.</p>
        <h3>¿Qué cookies se utilizan?</h3>
        <ul>
          <li><strong>Cookies técnicas:</strong> Permiten almacenar temporalmente las preferencias de visualización (filtros y orden de catálogo).</li>
          <li><strong>Cookies de afiliación de Amazon:</strong> Al visitar Amazon a través de nuestros enlaces de afiliado, Amazon puede emplear cookies para registrar la procedencia del usuario y acreditar las comisiones correspondientes conforme a sus políticas.</li>
        </ul>
        <p>Puede configurar su navegador en cualquier momento para bloquear o rechazar las cookies sin que ello impida consultar el catálogo.</p>
      `;
      break;

    case "afiliacion":
      title = "Divulgación Oficial del Programa de Afiliados";
      content = `
        <div style="background-color: #f8fafc; border-left: 4px solid #0f1115; padding: 1rem 1.25rem; margin-bottom: 1.5rem; font-weight: 600;">
          «En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.»
        </div>
        <h3>Transparencia Comercial</h3>
        <p>ENKMINA2 SHOP («Camina con propósito») participa en el Programa de Afiliados de Amazon.es, un programa de publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad, publicitando e incluyendo enlaces a Amazon.es.</p>
        <h3>Precios y Disponibilidad</h3>
        <p>Los precios y la disponibilidad de los productos son precisos en la fecha/hora indicada y están sujetos a cambios. Cualquier información de precio y disponibilidad mostrada en Amazon.es en el momento de la compra se aplicará a la adquisición de dicho producto.</p>
        <h3>Identificación de productos</h3>
        <p>Aquellos productos señalados como «Demostración» son modelos de referencia para ilustrar el diseño de la plataforma y no constituyen ofertas comerciales activas.</p>
      `;
      break;

    case "contacto":
      title = "Contacto y Soporte";
      content = `
        <p>¿Tienes dudas sobre el proyecto, sugerencias o consultas? Rellena el siguiente formulario:</p>
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
            <textarea id="contactMsg" rows="4" required placeholder="Escribe aquí tu duda..."></textarea>
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
  // Inicialización de soporte
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
