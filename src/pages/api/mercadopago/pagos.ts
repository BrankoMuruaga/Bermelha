import type { APIRoute } from "astro";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Resend } from "resend";
import crypto from "node:crypto";

// ============================================================================
// INICIALIZACIÓN DE SERVICIOS
// ============================================================================
const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MP_ACCESS_TOKEN,
});
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// ============================================================================
// FUNCIONES AUXILIARES (Idealmente irían en archivos separados dentro de /utils)
// ============================================================================

/**
 * Valida la firma criptográfica del webhook de Mercado Pago
 * utilizando comparación en tiempo constante sobre bytes puros
 */
function isWebhookSignatureValid(
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

/**
 * Genera el HTML del correo de confirmación con el branding de Bermelha
 */
function getPaymentApprovedHtmlTemplate(paymentId: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pago - Bermelha</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fcf9f8; font-family: Arial, Helvetica, sans-serif; color: #323233; -webkit-font-smoothing: antialiased;">
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcf9f8; padding: 40px 20px;">
        <tr>
          <td align="center">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 1.5rem; overflow: hidden; max-width: 600px; border: 1px solid rgba(138, 123, 117, 0.15); box-shadow: 0 6px 16px rgba(50, 50, 51, 0.12);">
              
              <tr>
                <td style="background-color: #8d4e39; padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 2.8rem; font-weight: 400; line-height: 1.2;">Bermelha</h1>
                  <p style="color: #f9a78d; margin: 8px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 1rem; font-weight: 400; letter-spacing: 0.5px;">Amigurumis tejidos con el corazón</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center">
                  
                  <h2 style="color: #323233; margin-top: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 1.75rem; font-weight: 600; line-height: 1.3;">
                    ¡Hola! Tu pago está confirmado 🎉
                  </h2>
                  
                  <p style="font-family: Arial, Helvetica, sans-serif; font-size: 1rem; line-height: 1.5; color: #524744; font-weight: 400; letter-spacing: 0.5px;">
                    Queríamos avisarte que el pago por tu compra ingresó correctamente. 
                  </p>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                    <tr>
                      <td style="background-color: #ede9e7; border-left: 4px solid #8d4e39; padding: 16px 20px; border-radius: 0 0.5rem 0.5rem 0;">
                        <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 0.875rem; color: #323233; letter-spacing: 0.25px;">
                          <strong>Referencia de la orden:</strong> #${paymentId}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="font-family: Arial, Helvetica, sans-serif; font-size: 1rem; line-height: 1.5; color: #524744; font-weight: 400; letter-spacing: 0.5px;">
                    Las manos mágicas detrás de Bermelha ya se están preparando para tejer tu pedido. Recordá que nuestros amigurumis son piezas 100% artesanales que llevan tiempo y dedicación para quedar perfectos.
                  </p>
                  
                  <p style="font-family: Arial, Helvetica, sans-serif; font-size: 1rem; line-height: 1.5; color: #524744; font-weight: 400; letter-spacing: 0.5px; margin-top: 16px;">
                    Te vamos a volver a escribir en cuanto haya novedades sobre el envío o para coordinar el retiro.
                  </p>

                  <p style="font-family: Arial, Helvetica, sans-serif; font-size: 1rem; line-height: 1.5; color: #323233; margin-top: 32px; font-weight: 600;">
                    ¡Gracias por apoyar el trabajo artesanal!
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f5f3f3; padding: 32px 40px; text-align: center; border-top: 1px solid rgba(138, 123, 117, 0.15);">
                  <p style="font-family: Arial, Helvetica, sans-serif; font-size: 0.875rem; color: #524744; margin: 0 0 8px 0; line-height: 1.4;">
                    ¿Tenés alguna duda o querés consultarnos algo sobre tu pedido?
                  </p>
                  <p style="margin: 0;">
                    <a href="mailto:contacto@bermelha.com" style="font-family: Arial, Helvetica, sans-serif; font-size: 0.875rem; color: #8d4e39; text-decoration: none; font-weight: 600; letter-spacing: 0.25px;">Escribinos a contacto@bermelha.com</a>
                  </p>
                  <p style="font-family: Arial, Helvetica, sans-serif; font-size: 0.65rem; color: #8a7b75; margin: 24px 0 0 0; letter-spacing: 0.5px; font-weight: 300;">
                    POR FAVOR, NO RESPONDAS A ESTE CORREO AUTOMÁTICO.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ============================================================================
// CONTROLADOR PRINCIPAL DEL WEBHOOK (Endpoint)
// ============================================================================

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const secret = import.meta.env.MP_WEBHOOK_SECRET;

    if (!isWebhookSignatureValid(request, url, secret)) {
      console.error("Firma inválida: Rechazando petición externa");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();

    if (body.type !== "payment" && body.topic !== "payment") {
      return new Response(
        JSON.stringify({ success: true, message: "Ignorado - No es un pago" }),
        { status: 200 },
      );
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return new Response(JSON.stringify({ error: "Falta el ID del pago" }), {
        status: 400,
      });
    }

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status === "approved") {
      console.log(`¡Pago ${paymentId} aprobado de forma segura!`);

      //const emailCliente = paymentData.payer?.email;
      const emailCliente = "contacto@bermelha.com";

      if (emailCliente) {
        const { data, error } = await resend.emails.send({
          from: "Bermelha <no-reply@bermelha.com>",
          to: emailCliente,
          subject:
            "¡Tu pago fue aprobado! Confirmación de compra en Bermelha 🧶",
          html: getPaymentApprovedHtmlTemplate(paymentId),
        });

        if (error) {
          console.error("Error al enviar el email con Resend:", error);
        } else {
          console.log("Email de confirmación enviado con éxito:", data?.id);
        }
      } else {
        console.warn(
          `El pago ${paymentId} no contenía un email de comprador asociado.`,
        );
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error crítico al procesar el webhook:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
