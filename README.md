# ENKMINA2 SHOP 👟
### *«Camina con propósito»*

Sitio web profesional especializado en zapatillas deportivas de marcas reconocidas (**adidas, Nike, Puma, Asics, Jordan, Skechers y Under Armour**), con identidad visual oficial de **ENKMINA2**.

Diseñado con una estética moderna, limpia y comercial (estilo tienda online de referencia: fondo claro, tipografía moderna y detalles en negro), optimizado para velocidad y dispositivos móviles, y preparado para publicarse de forma 100% gratuita en **GitHub Pages**.

---

## 🚀 Características principales

- **Identidad Oficial ENKMINA2**: Logotipo original integrado en alta resolución sin distorsión ni redibujado, preservando sus colores, proporciones y el eslogan oficial *«Camina con propósito»*.
- **Diseño Adaptable (Responsive)**: Interfaz fluida para ordenadores, tablets y móviles con menú drawer táctil.
- **Cabecera Completa**: Identidad corporativa, buscador interactivo en tiempo real y navegación rápida por secciones.
- **Sección Principal (Hero)**: Título atractivo *«Encuentra tus próximas zapatillas»*, sellos de confianza y tarjeta visual destacada.
- **Catálogo Dinámico e Interactivo**:
  - Filtro por categorías: *Todas, Novedades, Running, Baloncesto, Estilo Urbano*.
  - Filtro por marcas: *adidas, Nike, Puma, Asics, Jordan, Skechers, Under Armour*.
  - Ordenación por destacados o por nombre (A-Z).
  - Buscador predictivo en vivo por nombre, marca o características.
- **Tarjetas de Zapatillas**:
  - Fotografía en alta resolución con fallback automático anti-errores.
  - Tarjeta propia (degradado con el color de la marca y silueta genérica) en lugar de fotos; también sirve de respaldo si una foto no carga.
  - Distintivo con fecha: «Top ventas Amazon.es · oct. 2026» o «Nº 1 en … · oct. 2026».
  - Botones «Hombre» y «Mujer» cuando el modelo tiene las dos versiones; si no, «Ver en Amazon» con «Modelo de hombre», «Modelo de mujer» o «Unisex».
  - Sin precios ni valoraciones escritos a mano (lo exigen las normas de Afiliados de Amazon).
  - Botón **«Ver en Amazon»** con el enlace de afiliado; al pulsar la foto o el nombre se abre la ficha con el botón **«Ver precio en Amazon»**.
- **Secciones Temáticas**: Novedades, Running, Baloncesto y Estilo Urbano con acceso directo a sus gamas.
- **Cumplimiento Legal y Transparencia**:
  - Aviso obligatorio de Afiliados de Amazon visible en el pie de página y en el Aviso Legal.
  - Modales informativos para **Política de Privacidad**, **Política de Cookies**, **Aviso Legal** y **Contacto** (formulario real que se envía con Formspree, con casilla obligatoria de Política de Privacidad).

---

## 📁 Estructura del proyecto

```text
Zapatillas-Shop/
│
├── logo.png            # Logotipo original oficial de ENKMINA2
├── index.html          # Estructura semántica HTML5 principal
├── css/
│   └── style.css       # Estilos modernos, diseño responsive y temas
├── js/
│   ├── products.js     # Catálogo de productos (modelo, marca, categorías, ASIN)
│   └── app.js          # Lógica interactiva de filtros, buscador y modales
└── README.md           # Guía de uso, personalización y despliegue
```

---

## 🛠️ Cómo probar la web localmente

Al tratarse de una web estática pura (HTML, CSS y JavaScript sin dependencias pesadas), no requiere instalación de módulos ni bases de datos:

1. **Directamente en el navegador**:
   - Haz doble clic en el archivo `index.html` de esta carpeta para abrirlo en tu navegador favorito (Chrome, Edge, Firefox, Safari).

2. **O mediante un servidor local (opcional)**:
   - Si utilizas Visual Studio Code, puedes hacer clic derecho sobre `index.html` y seleccionar **«Open with Live Server»**.
   - O con Python en la terminal:
     ```bash
     python -m http.server 8080
     ```
     Y abrir `http://localhost:8080` en el navegador.

---

## 🔗 Enlaces de Afiliados de Amazon

> **Catálogo elegido de Los más vendidos de Amazon.es el 31-10-2026. Revisar cada mes.**

Los productos están en `js/products.js`. Cada uno guarda sus ASIN por versión:

```javascript
{
  id: 1,
  name: "Galaxy 8",
  brand: "adidas",
  categories: ["running", "novedades"],
  asins: { hombre: "B0FW3S4RS2", mujer: "B0FT34NRT8" },   // o { unisex: "..." }
  badge: `Nº 1 en running · ${LISTAS_FECHA}`,
  description: "..."
}
```

`amazonUrl(asin)` en `js/app.js` genera `https://www.amazon.es/dp/<ASIN>?tag=enkmina2shop-21`. Al renovar el catálogo, actualiza también `LISTAS_FECHA` y los textos de los distintivos.

---

## 🌐 Publicación en GitHub Pages

1. **Repositorio**: `https://github.com/Enkmina2/enkmina2-shop`
2. **Configuración en GitHub**:
   - En el repositorio, ve a **Settings** > pestaña **Pages**.
   - En **Build and deployment > Branch**, selecciona `main` y la carpeta `/ (root)`.
   - Haz clic en **Save**.
3. **Dirección pública**:
   `https://enkmina2.github.io/enkmina2-shop/`

---

## ⚖️ Aviso Legal y Afiliación

«En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.»

ENKMINA2 SHOP participa en el Programa de Afiliados de Amazon.es (ID: `enkmina2shop-21`). La web no muestra precios ni valoraciones: el precio y la disponibilidad son los que indique Amazon.es en el momento de la compra. La web no muestra fotos de producto: cada tarjeta es un diseño propio con la marca y el modelo.
