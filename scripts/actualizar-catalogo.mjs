/**
 * ENKMINA2 SHOP - Script de actualización y generación del catálogo
 *
 * Lee `data/catalogo.csv`, comprueba el estado de la API de Amazon,
 * y compila `js/catalog-data.js` cumpliendo estrictamente con las políticas de Amazon Afiliados:
 *
 * - Si no hay credenciales de API o la cuenta no tiene acceso: compila los ASINs
 *   en modo 'pendiente', con enlace oficial de afiliado y sin precio ficticio.
 * - Si la API está autorizada y responde: obtiene precios en vivo, imágenes oficiales
 *   y marca los productos como 'verificados' con sello de tiempo (vigencia 24h).
 * - NUNCA simula peticiones falsas ni inventa precios, descuentos o reseñas.
 *
 * Ejecución:
 *   node scripts/actualizar-catalogo.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getApiCredentialsStatus, fetchItemsFromAmazon } from "./amazon-api-client.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// Cargar la lógica central compartida
const corePath = path.join(ROOT_DIR, "js", "catalog-core.js");
const coreModule = await import("file://" + corePath.replace(/\\/g, "/"));
const ENKCore = coreModule.default || coreModule;

const CSV_FILE = path.join(ROOT_DIR, "data", "catalogo.csv");
const OUTPUT_JS = path.join(ROOT_DIR, "js", "catalog-data.js");

function parseCsv(content) {
  const lines = content.split(/\r?\n/);
  const rows = [];
  let headers = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const parts = line.split(",").map(p => p.trim());
    if (!headers) {
      headers = parts.map(h => h.toLowerCase());
      continue;
    }

    if (parts.length < headers.length) continue;

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = parts[idx] !== undefined ? parts[idx] : "";
    });
    rows.push(row);
  }

  return rows;
}

async function buildCatalog() {
  console.log("==================================================");
  console.log("  ENKMINA2 SHOP - Compilador de Catálogo Oficial");
  console.log("  Tag de Afiliado:", ENKCore.AFFILIATE_TAG);
  console.log("==================================================");

  // 1. Diagnóstico del estado de la API de Amazon
  const apiStatus = getApiCredentialsStatus();
  console.log(`\n[DIAGNÓSTICO API] ${apiStatus.statusMessage}`);

  if (!fs.existsSync(CSV_FILE)) {
    console.warn(`[AVISO] No se encontró ${CSV_FILE}. Creando archivo inicial...`);
    fs.mkdirSync(path.dirname(CSV_FILE), { recursive: true });
    fs.writeFileSync(CSV_FILE, "asin,categoria,marca,modelo,destacado,imagen_sitestripe\n", "utf8");
  }

  const csvContent = fs.readFileSync(CSV_FILE, "utf8");
  const rawRows = parseCsv(csvContent);

  const asinsToFetch = [];
  const parsedRows = [];
  const rejected = [];

  for (const row of rawRows) {
    const asin = (row.asin || "").trim().toUpperCase();
    if (!asin) continue;

    if (!ENKCore.isValidAsin(asin)) {
      rejected.push({ asin, reason: "Formato de ASIN inválido (debe tener exactamente 10 caracteres alfanuméricos)" });
      continue;
    }

    parsedRows.push({
      asin,
      categoria: (row.categoria || "urbano").toLowerCase(),
      marca: row.marca || "",
      modelo: row.modelo || "",
      destacado: (row.destacado || "").toLowerCase() === "si",
      imagen_sitestripe: row.imagen_sitestripe || ""
    });

    asinsToFetch.push(asin);
  }

  // 2. Consulta a la API si está configurada (sin inventar datos si está inactiva)
  let apiItemsMap = new Map();
  if (apiStatus.configured && asinsToFetch.length > 0) {
    console.log(`\nConsultando ${asinsToFetch.length} ASIN(s) en Amazon PA-API 5.0...`);
    const apiResult = await fetchItemsFromAmazon(asinsToFetch);
    if (apiResult.success && Array.isArray(apiResult.items)) {
      apiResult.items.forEach(item => {
        if (item.ASIN) apiItemsMap.set(item.ASIN, item);
      });
      console.log(` - Respuestas exitosas de la API: ${apiItemsMap.size}`);
    } else {
      console.warn(`[AVISO] La API no devolvió datos utilizables (${apiResult.reason || apiResult.errorText || 'Error de acceso'}). Los productos se mantendrán en modo seguro 'pendiente'.`);
    }
  }

  // 3. Ensamblaje de productos con verificación honesta
  const validProducts = [];

  for (const row of parsedRows) {
    const asin = row.asin;
    const apiItem = apiItemsMap.get(asin);

    let brand = row.marca;
    let model = row.modelo;
    let imageUrl = row.imagen_sitestripe;
    let priceObj = null;
    let priceFetchedAt = null;
    let status = "pendiente";
    let source = "csv";

    // Si la API oficial devolvió datos auténticos:
    if (apiItem) {
      status = "verificado";
      source = "api";

      // Título oficial
      const apiTitle = apiItem.ItemInfo?.Title?.DisplayValue;
      if (apiTitle && !model) model = apiTitle;

      // Marca oficial
      const apiBrand = apiItem.ItemInfo?.ByLineInfo?.Brand?.DisplayValue;
      if (apiBrand && !brand) brand = apiBrand;

      // Imagen oficial servida desde Amazon (m.media-amazon.com)
      const apiImage = apiItem.Images?.Primary?.Large?.URL;
      if (apiImage && ENKCore.isAllowedAmazonImage(apiImage)) {
        imageUrl = apiImage;
      }

      // Precio en tiempo real oficial
      const apiPrice = apiItem.Offers?.Listings?.[0]?.Price;
      if (apiPrice && typeof apiPrice.Amount === "number") {
        priceObj = {
          amount: apiPrice.Amount,
          currency: apiPrice.Currency || "EUR"
        };
        priceFetchedAt = new Date().toISOString();
      }
    }

    // Si no proviene de la API, validar la imagen manual de SiteStripe
    if (imageUrl && !ENKCore.isAllowedAmazonImage(imageUrl)) {
      console.warn(`[AVISO ASIN ${asin}] La imagen "${imageUrl}" no proviene de un host oficial de Amazon. Se usará el placeholder oficial para evitar infringir el acuerdo de afiliados.`);
      imageUrl = "";
    }

    const finalBrand = brand || "Marca deportiva";
    const finalModel = model || `Modelo ${asin}`;
    const name = finalModel.toLowerCase().startsWith(finalBrand.toLowerCase())
      ? finalModel
      : `${finalBrand} ${finalModel}`;

    const categories = [row.categoria];
    if (row.destacado) categories.push("novedades");

    const product = {
      id: `amz-${asin}`,
      asin: asin,
      name: name,
      brand: finalBrand,
      categories: categories,
      featured: row.destacado,
      status: status,
      source: source,
      image: imageUrl || "./logo.png",
      url: ENKCore.buildAmazonUrl(asin, ENKCore.AFFILIATE_TAG),
      price: priceObj,
      priceFetchedAt: priceFetchedAt,
      description: `Producto disponible en Amazon.es (ASIN: ${asin}). Consulta disponibilidad, tallas y precio exacto en Amazon.`
    };

    validProducts.push(product);
  }

  // 4. Escribir archivo compilado js/catalog-data.js
  const fileContent = `/**
 * ENKMINA2 SHOP - Catálogo de productos reales compilado
 * Generado automáticamente por scripts/actualizar-catalogo.mjs
 * Fecha de compilación: ${new Date().toISOString()}
 * Estado de la API de Amazon: ${apiStatus.configured ? 'Configurada' : 'Inactiva (Modo seguro)'}
 *
 * NO EDITAR ESTE ARCHIVO MANUALMENTE.
 * Edita data/catalogo.csv y ejecuta: node scripts/actualizar-catalogo.mjs
 */

const CATALOG_REAL_PRODUCTS = ${JSON.stringify(validProducts, null, 2)};

if (typeof window !== "undefined") {
  window.CATALOG_REAL_PRODUCTS = CATALOG_REAL_PRODUCTS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATALOG_REAL_PRODUCTS };
}
`;

  fs.writeFileSync(OUTPUT_JS, fileContent, "utf8");

  console.log(`\nResultados del proceso:`);
  console.log(` - Productos reales en catálogo: ${validProducts.length}`);
  console.log(`   * Verificados con API: ${validProducts.filter(p => p.status === 'verificado').length}`);
  console.log(`   * Pendientes (enlace seguro sin precio): ${validProducts.filter(p => p.status === 'pendiente').length}`);
  if (rejected.length > 0) {
    console.log(` - Entradas rechazadas por ASIN inválido: ${rejected.length}`);
    rejected.forEach(r => console.log(`    ❌ ASIN "${r.asin}": ${r.reason}`));
  }
  console.log(` - Archivo actualizado: js/catalog-data.js`);
  console.log(` - Productos de demostración preservados en js/products.js: 16 modelos (status: 'demo').`);
  console.log("==================================================\n");
}

buildCatalog().catch(err => {
  console.error("Error al compilar el catálogo:", err);
  process.exit(1);
});
