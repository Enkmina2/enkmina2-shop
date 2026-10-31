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
function amazonButtons(item, label = "Ver en Amazon", btnClass = "btn-offer", showPairLabel = true) {
  const icon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>`;
  const { hombre, mujer } = item.asins;

  if (hombre && mujer) {
    return `
      ${showPairLabel ? `<div class="amazon-pair-label">${label}:</div>` : ''}
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
 * Imagen de la zapatilla: la imagen de ambiente (item.ambientImage) encima de la
 * tarjeta propia de la marca (degradado, silueta, marca y modelo). Si la imagen
 * no carga, se borra y queda la tarjeta de la marca.
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
      ${item.ambientImage ? `<img src="${item.ambientImage}" alt="${item.ambientAlt || `${item.brand} ${item.name}`}" loading="lazy" onerror="this.remove();">` : ''}
    </div>`;
}

/**
 * Tarjeta vertical 1:2 con la imagen de ambiente y, abajo sobre un degradado
 * azul marino, badge, marca, modelo y botones a Amazon
 */
function ambientCard(item, extraClass = "") {
  return `
    <article class="product-card amb-card ${extraClass}" data-id="${item.id}">
      <div class="amb-media" onclick="openOfferModal(${item.id})">
        ${productVisual(item)}
      </div>
      ${item.ambientImage ? `<span class="amb-note">Imagen de ambiente</span>` : ''}
      <div class="amb-overlay">
        ${item.badge ? `<span class="amb-badge">${item.badge}</span>` : ''}
        <div class="amb-brand">${item.brand}</div>
        <h3 class="amb-model" title="${item.name}">
          <a href="javascript:void(0)" onclick="openOfferModal(${item.id})">${item.name}</a>
        </h3>
        <div class="amb-actions">
          ${amazonButtons(item, "Ver en Amazon", "amb-btn", false)}
        </div>
      </div>
    </article>`;
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

  grid.innerHTML = filtered.map(item => ambientCard(item)).join("");
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

  card.innerHTML = ambientCard(item, "amb-card-hero");
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

// Formulario de contacto (Formspree)
const FORMSPREE_URL = "https://formspree.io/f/mpppjond";

// Lo escrito en el formulario se guarda al abrir la Política de Privacidad desde él
let contactDraft = null;

/**
 * Abre modal de políticas o contacto
 */
function openPolicyModal(type) {
  const fromContact = saveContactDraft();
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
        <p>Esta web no recopila datos personales, salvo los que nos envíes voluntariamente a través del formulario de contacto.</p>
        <h3>2. Formulario de contacto</h3>
        <p>Si nos escribes, recogemos tu <strong>nombre</strong>, tu <strong>correo electrónico</strong> y tu <strong>mensaje</strong>, y los usamos <strong>solo para responderte</strong>. El formulario se envía a través de <strong>Formspree</strong>, un servicio externo que nos hace llegar el mensaje; puedes consultar su política de privacidad en formspree.io. No cedemos tus datos a nadie más.</p>
        <h3>3. Enlaces a Amazon.es</h3>
        <p>Nuestro catálogo contiene enlaces de afiliado a Amazon.es. Al hacer clic en ellos abandonas nuestro sitio y pasa a aplicarse la política de privacidad de Amazon. Amazon puede usar cookies para registrar que has llegado desde nuestros enlaces; consulta su Aviso de Privacidad y su Aviso de Cookies en Amazon.es.</p>
        <h3>4. Derechos</h3>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión y oposición sobre los datos que nos hayas enviado escribiéndonos a través del formulario de contacto.</p>
        ${fromContact ? `<button type="button" class="btn-primary" onclick="openPolicyModal('contacto')">Volver al formulario de contacto</button>` : ''}
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
        <p>¿Tienes una duda o una sugerencia sobre la web? Escríbenos. Las dudas sobre tallas, envíos o devoluciones de un pedido las resuelve Amazon.es en la página del producto.</p>
        <form id="contactForm" class="contact-form-grid" novalidate>
          <div class="form-group">
            <label for="contactName">Nombre</label>
            <input type="text" id="contactName" name="nombre" required maxlength="100" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="contactEmail">Correo electrónico</label>
            <input type="email" id="contactEmail" name="email" required maxlength="150" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="contactMsg">Mensaje</label>
            <textarea id="contactMsg" name="mensaje" rows="5" required maxlength="3000"></textarea>
          </div>
          <!-- Trampa contra el spam: las personas no la ven ni la rellenan -->
          <input type="text" name="_gotcha" class="form-gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
          <label class="form-check">
            <input type="checkbox" id="contactPrivacy" name="privacidad_aceptada" value="si" required>
            <span>He leído y acepto la <a href="javascript:void(0)" onclick="openPolicyModal('privacidad')">Política de Privacidad</a></span>
          </label>
          <button type="submit" class="btn-primary form-submit">Enviar mensaje</button>
          <p class="form-status" id="contactStatus" role="status" aria-live="polite"></p>
        </form>
      `;
      break;
  }

  container.innerHTML = `
    <h2>${title}</h2>
    ${content}
  `;

  if (type === "contacto") initContactForm();

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Guarda lo escrito en el formulario de contacto si está abierto.
 * Devuelve true si lo estaba.
 */
function saveContactDraft() {
  const form = document.getElementById("contactForm");
  if (!form || !form.closest(".modal-overlay.active")) return false;
  contactDraft = {
    nombre: form.nombre.value,
    email: form.email.value,
    mensaje: form.mensaje.value,
    privacidad: form.privacidad_aceptada.checked
  };
  return true;
}

/**
 * Prepara el formulario de contacto: recupera el borrador y lo envía a Formspree
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  if (contactDraft) {
    form.nombre.value = contactDraft.nombre;
    form.email.value = contactDraft.email;
    form.mensaje.value = contactDraft.mensaje;
    form.privacidad_aceptada.checked = contactDraft.privacidad;
  }

  form.addEventListener("submit", handleContactSubmit);
}

/**
 * Envía el formulario con fetch. Solo muestra éxito si Formspree responde que sí.
 */
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById("contactStatus");
  const button = form.querySelector(".form-submit");

  const setStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status ${kind || ""}`;
  };

  if (!form.checkValidity()) {
    setStatus(form.privacidad_aceptada.checked
      ? "Revisa los campos: nombre, un correo válido y el mensaje son obligatorios."
      : "Para enviar el mensaje tienes que aceptar la Política de Privacidad.", "error");
    form.reportValidity();
    return;
  }

  button.disabled = true;
  button.textContent = "Enviando…";
  setStatus("");

  let ok = false;
  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    ok = response.ok;
  } catch (err) {
    ok = false;
  }

  button.disabled = false;
  button.textContent = "Enviar mensaje";

  if (ok) {
    form.reset();
    contactDraft = null;
    setStatus("Mensaje enviado. Te responderemos lo antes posible.", "success");
  } else {
    setStatus("No se ha podido enviar. Inténtalo de nuevo más tarde.", "error");
  }
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
