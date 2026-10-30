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
  - Ordenación por destacados, precio (ascendente / descendente), porcentaje de descuento y valoración.
  - Buscador predictivo en vivo por nombre, marca o características.
- **Tarjetas de Zapatillas**:
  - Fotografía en alta resolución con fallback automático anti-errores.
  - Marca, modelo, etiqueta de novedad / rebaja, valoración por estrellas y reseñas.
  - **Precio orientativo** claramente indicado.
  - Botón **«Ver oferta»** que abre un panel transparente con detalles, tallas y el enlace asociado de demostración.
- **Secciones Temáticas**: Novedades, Running, Baloncesto y Estilo Urbano con acceso directo a sus gamas.
- **Cumplimiento Legal y Transparencia**:
  - Cuadro visible de **Aviso de Afiliación** en el pie de página.
  - Modales funcionales e informativos para **Política de Privacidad**, **Política de Cookies**, **Aviso Legal** y **Formulario de Contacto**.

---

## 📁 Estructura del proyecto

```text
Zapatillas-Shop/
│
├── data/
│   └── catalogo.csv            # Fuente editable: introduce aquí los ASIN de Amazon.es
├── scripts/
│   └── actualizar-catalogo.mjs # Script para validar ASINs y generar el catálogo
├── js/
│   ├── catalog-core.js         # Lógica central: validación ASIN, reglas de precio y filtros
│   ├── catalog-data.js         # Catálogo real compilado (generado automáticamente)
│   ├── products.js             # 16 productos de muestra identificados como 'demo'
│   └── app.js                  # Interfaz: renderizado seguro, buscador, filtros y modales
├── css/
│   └── style.css               # Estilos modernos y diseño responsive
├── logo.png                    # Logotipo original oficial de ENKMINA2
├── index.html                  # Página principal
└── README.md                   # Esta documentación
```

---

## 👟 Cómo añadir productos reales de Amazon.es

Para incorporar zapatillas con tu enlace de afiliado oficial (`enkmina2shop-21`):

1. Abre el archivo **`data/catalogo.csv`** (puedes editarlo en local o directamente en GitHub).
2. Añade una línea por producto con el siguiente formato:
   ```csv
   asin,categoria,marca,modelo,destacado,imagen_sitestripe
   B08N5WRWNW,running,Nike,Revolution 6,si,
   ```
3. Ejecuta el compilador local:
   ```bash
   node scripts/actualizar-catalogo.mjs
   ```
4. El script validará el formato del ASIN (10 caracteres alfanuméricos), generará el enlace oficial `https://www.amazon.es/dp/{ASIN}?tag=enkmina2shop-21` y compilará **`js/catalog-data.js`**.
5. Los productos reales aparecerán en la web como **«Pendiente de verificar»** y con el aviso «Precio no disponible: consúltalo en Amazon», cumpliendo estrictamente con la normativa de Amazon que prohíbe escribir precios a mano.
6. Cuando dispongas de acceso a la Creators API de Amazon, una acción automatizada rellenará los precios y las imágenes oficiales cada 24 horas.

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

## 🌐 Publicación en GitHub Pages

1. **Repositorio**: `https://github.com/Enkmina2/enkmina2-shop`
2. **Configuración en GitHub**:
   - En el repositorio, ve a **Settings** > pestaña **Pages**.
   - En **Build and deployment > Branch**, selecciona `main` y la carpeta `/ (root)`.
   - Haz clic en **Save**.
3. **Dirección pública**:
   `https://enkmina2.github.io/enkmina2-shop/`

---

## ⚖️ Aviso Legal y Afiliación Oficial de Amazon

«En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.»

ENKMINA2 SHOP participa en el Programa de Afiliados de Amazon.es (ID: `enkmina2shop-21`). Los precios y la disponibilidad mostrados en Amazon.es en el momento de la compra regirán la transacción. Los productos señalados como «Demostración» son muestras de diseño y no representan ofertas comerciales activas.
