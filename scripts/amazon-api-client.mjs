/**
 * ENKMINA2 SHOP - Cliente oficial para la API de Amazon Afiliados España
 *
 * Diseñado conforme a la especificación oficial de la Product Advertising API (PA-API 5.0)
 * y el endpoint de España: webservices.amazon.es (Región: eu-west-1).
 *
 * REGLAS DE SEGURIDAD Y TRANSPARENCIA:
 * 1. Si no hay credenciales válidas en las variables de entorno, NO simula peticiones ni inventa datos.
 * 2. Si la cuenta no está autorizada o no cumple el umbral de ventas (10 ventas cualificadas en 30 días),
 *    detecta y reporta el error oficial (AccessDenied / AssociateNotEligible).
 * 3. Las credenciales NUNCA se guardan en el código ni en el cliente web; se leen exclusivamente
 *    desde variables de entorno locales o GitHub Secrets del servidor.
 */

import crypto from "node:crypto";

// Configuración oficial para Amazon.es
export const AMAZON_CONFIG = {
  host: process.env.AMAZON_HOST || "webservices.amazon.es",
  region: process.env.AMAZON_REGION || "eu-west-1",
  service: "ProductAdvertisingAPI",
  endpoint: `https://${process.env.AMAZON_HOST || "webservices.amazon.es"}/paapi5/getitems`,
  marketplace: "www.amazon.es",
  defaultTag: "enkmina2shop-21"
};

/**
 * Comprueba si existen credenciales configuradas en las variables de entorno.
 */
export function getApiCredentialsStatus() {
  const accessKey = process.env.AMAZON_ACCESS_KEY || "";
  const secretKey = process.env.AMAZON_SECRET_KEY || "";
  const partnerTag = process.env.AMAZON_ASSOCIATE_TAG || AMAZON_CONFIG.defaultTag;

  const hasAccessKey = accessKey.trim().length > 0;
  const hasSecretKey = secretKey.trim().length > 0;

  if (!hasAccessKey || !hasSecretKey) {
    return {
      configured: false,
      accessKeyPresent: hasAccessKey,
      secretKeyPresent: hasSecretKey,
      partnerTag: partnerTag,
      statusMessage: "[API INACTIVA] Credenciales de Amazon no configuradas. El catálogo opera en modo manual (Fase 1) sin simular consultas."
    };
  }

  return {
    configured: true,
    accessKeyPresent: true,
    secretKeyPresent: true,
    partnerTag: partnerTag,
    statusMessage: "[API CONFIGURADA] Credenciales detectadas en variables de entorno."
  };
}

/**
 * Utilidad criptográfica para la firma AWS SigV4 requerida por Amazon PA-API 5.0
 */
function hmac(key, string) {
  return crypto.createHmac("sha256", key).update(string, "utf8").digest();
}

function hash(string) {
  return crypto.createHash("sha256").update(string, "utf8").digest("hex");
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = hmac("AWS4" + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, "aws4_request");
  return kSigning;
}

/**
 * Construye la petición HTTP firmada con AWS SigV4 para consultar artículos por ASIN
 */
export async function fetchItemsFromAmazon(asins = []) {
  const creds = getApiCredentialsStatus();

  // Si no hay credenciales, informamos con transparencia y NO inventamos datos
  if (!creds.configured) {
    return {
      success: false,
      active: false,
      reason: "MISSING_CREDENTIALS",
      message: creds.statusMessage,
      items: []
    };
  }

  const validAsins = asins.filter(a => typeof a === "string" && /^[A-Z0-9]{10}$/.test(a));
  if (validAsins.length === 0) {
    return {
      success: true,
      active: true,
      items: []
    };
  }

  // Límite de la API de Amazon: máximo 10 ASINs por petición GetItems
  const batches = [];
  for (let i = 0; i < validAsins.length; i += 10) {
    batches.push(validAsins.slice(i, i + 10));
  }

  const accessKey = process.env.AMAZON_ACCESS_KEY.trim();
  const secretKey = process.env.AMAZON_SECRET_KEY.trim();
  const partnerTag = creds.partnerTag;

  const allFetchedItems = [];

  for (const batch of batches) {
    const payload = {
      ItemIds: batch,
      ItemIdType: "ASIN",
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: AMAZON_CONFIG.marketplace,
      Resources: [
        "ItemInfo.Title",
        "ItemInfo.ByLineInfo",
        "ItemInfo.Classifications",
        "Images.Primary.Large",
        "Offers.Listings.Price",
        "Offers.Listings.Availability.Message"
      ]
    };

    const requestBody = JSON.stringify(payload);
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);

    const canonicalUri = "/paapi5/getitems";
    const canonicalHeaders = `content-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${AMAZON_CONFIG.host}\nx-amz-date:${amzDate}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems\n`;
    const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
    const payloadHash = hash(requestBody);

    const canonicalRequest = `POST\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${AMAZON_CONFIG.region}/${AMAZON_CONFIG.service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${hash(canonicalRequest)}`;

    const signingKey = getSignatureKey(secretKey, dateStamp, AMAZON_CONFIG.region, AMAZON_CONFIG.service);
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign, "utf8").digest("hex");

    const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    try {
      const response = await fetch(AMAZON_CONFIG.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Encoding": "amz-1.0",
          "X-Amz-Date": amzDate,
          "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
          "Authorization": authorizationHeader
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AMAZON API ERROR ${response.status}]`, errorText);
        return {
          success: false,
          active: true,
          httpStatus: response.status,
          errorText: errorText,
          items: []
        };
      }

      const data = await response.json();
      const items = data.ItemsResult?.Items || [];
      allFetchedItems.push(...items);
    } catch (networkErr) {
      console.error("[AMAZON API NETWORK ERROR]", networkErr.message);
      return {
        success: false,
        active: true,
        error: networkErr.message,
        items: []
      };
    }
  }

  return {
    success: true,
    active: true,
    items: allFetchedItems
  };
}
