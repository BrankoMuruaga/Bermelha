import crypto from "node:crypto";

export function mapContentfulProducto(item: any) {
  return {
    id: item.sys.id,
    nombre: item.fields.nombre,
    precio: item.fields.precio,
    imagenPrincipal: item.fields.imagenPrincipal?.fields?.file?.url
      ? "https:" + item.fields.imagenPrincipal.fields.file.url
      : "/placeholder.webp", // Fallback seguro por si falta la imagen en el CMS
    centimetros: item.fields.centimetros,
    tags: item.fields.tags ?? [],
    coleccion: item.fields.coleccion?.fields?.nombre ?? null,
    slug: item.fields.slug,
    customizations: {
      color:
        item.fields.color?.map((colorItem: any) => ({
          nombre: colorItem.fields.nombre,
          codigo: colorItem.fields.codigo,
          codigoHex: colorItem.fields.codigoHexa,
        })) ?? [],
    },
  };
}

/**
 * Valida la firma criptográfica del webhook de Mercado Pago
 * utilizando comparación en tiempo constante sobre bytes puros
 */
export function isWebhookSignatureValid(
  request: Request,
  url: URL,
  secret: string,
): boolean {
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  const dataId = url.searchParams.get("data.id") || url.searchParams.get("id");

  if (!xSignature || !dataId) {
    console.warn(
      `[Seguridad] Faltan datos. URL: ${url.search} | x-signature presente: ${!!xSignature}`,
    );
    return false;
  }

  const parts = xSignature.split(",");
  let ts = "";
  let v1 = "";

  parts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key === "ts") ts = value;
    if (key === "v1") v1 = value;
  });

  const manifestParts = [`id:${dataId}`];
  if (xRequestId) manifestParts.push(`request-id:${xRequestId}`);
  manifestParts.push(`ts:${ts}`);
  const manifest = manifestParts.join(";") + ";";

  const signatureCalculada = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest();

  try {
    const bufferRecibido = Buffer.from(v1, "hex");

    if (signatureCalculada.length !== bufferRecibido.length) {
      console.warn(
        `[Seguridad] Longitud de firma incorrecta para ID: ${dataId}`,
      );
      return false;
    }

    const isValid = crypto.timingSafeEqual(signatureCalculada, bufferRecibido);

    if (!isValid) {
      console.warn(`[Seguridad] Firma no coincide para ID: ${dataId}`);
    }

    return isValid;
  } catch (error) {
    console.error("Error al comparar las firmas criptográficas:", error);
    return false;
  }
}
