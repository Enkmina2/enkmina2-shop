# ENKMINA2 SHOP 👟
### *«Camina con propósito»*

Sitio web profesional especializado en zapatillas deportivas de marcas reconocidas (**Nike, Adidas, Jordan, New Balance, Puma y Asics**), con identidad visual oficial de **ENKMINA2**.

Diseñado con una estética moderna, limpia y comercial (estilo tienda online de referencia: fondo claro, tipografía moderna y detalles en negro), optimizado para velocidad y dispositivos móviles, y preparado para publicarse de forma 100% gratuita en **GitHub Pages**.

---

## 🚀 Características principales

- **Identidad Oficial ENKMINA2**: Logotipo original integrado en alta resolución sin distorsión ni redibujado, preservando sus colores, proporciones y el eslogan oficial *«Camina con propósito»*.
- **Diseño Adaptable (Responsive)**: Interfaz fluida para ordenadores, tablets y móviles con menú drawer táctil.
- **Cabecera Completa**: Identidad corporativa, buscador interactivo en tiempo real y navegación rápida por secciones.
- **Sección Principal (Hero)**: Título atractivo *«Encuentra tus próximas zapatillas»*, sellos de confianza y tarjeta visual destacada.
- **Catálogo Dinámico e Interactivo**:
  - Filtro por categorías: *Todas, Novedades, Running, Baloncesto, Estilo Urbano*.
  - Filtro por marcas: *Nike, Adidas, Jordan, New Balance, Puma, Asics*.
  - Ordenación por destacados o por nombre (A-Z).
  - Buscador predictivo en vivo por nombre, marca o características.
- **Tarjetas de Zapatillas**:
  - Fotografía en alta resolución con fallback automático anti-errores.
  - Marca, modelo, etiqueta de novedad y aviso «Imagen ilustrativa».
  - Sin precios ni valoraciones escritos a mano (lo exigen las normas de Afiliados de Amazon).
  - Botón **«Ver en Amazon»** con el enlace de afiliado; al pulsar la foto o el nombre se abre la ficha con el botón **«Ver precio en Amazon»**.
- **Secciones Temáticas**: Novedades, Running, Baloncesto y Estilo Urbano con acceso directo a sus gamas.
- **Cumplimiento Legal y Transparencia**:
  - Aviso obligatorio de Afiliados de Amazon visible en el pie de página y en el Aviso Legal.
  - Modales informativos para **Política de Privacidad**, **Política de Cookies**, **Aviso Legal** y **Contacto**.

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

Los enlaces se generan automáticamente en `js/app.js` con la función `amazonUrl(item)` y el ID de afiliado `enkmina2shop-21`:

- Si el producto tiene `asin`, el enlace va a su ficha: `https://www.amazon.es/dp/<ASIN>?tag=enkmina2shop-21`
- Si `asin` está vacío, el enlace es una búsqueda en Amazon.es por el nombre del modelo.

Para enlazar un producto concreto, rellena su campo `asin` en `js/products.js`:
```javascript
{
  id: 1,
  asin: "B0XXXXXXXX",
  name: "Air Jordan 1 Retro High OG",
  // ...
}
```

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

ENKMINA2 SHOP participa en el Programa de Afiliados de Amazon.es (ID: `enkmina2shop-21`). La web no muestra precios ni valoraciones: el precio y la disponibilidad son los que indique Amazon.es en el momento de la compra. Las imágenes son ilustrativas.
