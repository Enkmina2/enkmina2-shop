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
├── logo.png            # Logotipo original oficial de ENKMINA2
├── index.html          # Estructura semántica HTML5 principal
├── css/
│   └── style.css       # Estilos modernos, diseño responsive y temas
├── js/
│   ├── products.js     # Base de datos de productos (enlaces y precios demostrativos)
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

## 🔗 Cómo personalizar los enlaces de afiliado

Todos los enlaces de oferta son de demostración y están centralizados en el archivo:
📂 `js/products.js`

Cada producto cuenta con el parámetro `affiliateUrl`:
```javascript
{
  id: 1,
  name: "Air Jordan 1 Retro High OG",
  brand: "Jordan",
  // ...
  affiliateUrl: "https://ejemplo-afiliado.com/oferta/air-jordan-1-retro?ref=zapatillasshop",
  store: "Nike Store Oficial"
}
```
Para sustituirlos por tus enlaces reales de plataformas de afiliados (como Amazon Afiliados, Awin, Nike Affiliate Program, CJ Affiliate, etc.), solo debes cambiar la URL en `affiliateUrl` por tu enlace de afiliado personal.

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

Los datos, ofertas y enlaces incluidos en este proyecto se proporcionan con fines demostrativos. Zapatillas Shop está preparado para cumplir con los estándares de divulgación comercial del FTC y de la Unión Europea sobre transparencia en enlaces de afiliación.
