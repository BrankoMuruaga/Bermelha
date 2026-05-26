import {
  getPaymentApprovedHtmlTemplate,
  getInternalOrderNotificationHtmlTemplate,
} from "@/utils/html-correos";
import { isWebhookSignatureValid } from "@/utils/utils";
import type { APIRoute } from "astro";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Resend } from "resend";

const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MP_ACCESS_TOKEN,
});
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const secret = import.meta.env.MP_WEBHOOK_SECRET;

    const body = await request.json();

    if (body.type !== "payment" && body.topic !== "payment") {
      return new Response(
        JSON.stringify({ success: true, message: "Ignorado - No es un pago" }),
        { status: 200 },
      );
    }

    if (!isWebhookSignatureValid(request, url, secret)) {
      console.error("Firma inválida: Rechazando petición externa");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
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
      const emailCliente =
        paymentData.metadata?.email_contacto || paymentData.payer?.email;

      const emailVentas = import.meta.env.VENTAS_EMAIL;

      if (emailCliente) {
        const shippingDetailsRaw = paymentData.metadata?.shipping_details;
        const shippingDetails =
          shippingDetailsRaw &&
          shippingDetailsRaw !== "Retiro en local/Sin envío"
            ? JSON.parse(shippingDetailsRaw)
            : null;

        const itemsComprados = paymentData.additional_info?.items || [];

        const promesasCorreos = [];

        // 1. Correo para el cliente
        promesasCorreos.push(
          resend.emails
            .send({
              from: "Bermelha <no-reply@bermelha.com>",
              to: emailCliente,
              subject:
                "¡Tu pago fue aprobado! Confirmación de compra en Bermelha 🧶",
              html: getPaymentApprovedHtmlTemplate(paymentId.toString()),
            })
            .then(({ data, error }) => {
              if (error)
                console.error(
                  "Error al enviar confirmación al cliente:",
                  error,
                );
              else console.log("Email a cliente enviado con éxito:", data?.id);
            }),
        );

        // 2. Correo interno para ventas
        if (emailVentas) {
          promesasCorreos.push(
            resend.emails
              .send({
                from: "Bermelha Web <no-reply@bermelha.com>",
                to: emailVentas,
                subject: `💰 ¡NUEVA VENTA! Orden #${paymentId}`,
                html: getInternalOrderNotificationHtmlTemplate(
                  paymentId,
                  emailCliente,
                  itemsComprados,
                  shippingDetails,
                ),
              })
              .then(({ data, error }) => {
                if (error)
                  console.error(
                    "Error al enviar notificación interna a ventas:",
                    error,
                  );
                else console.log("Email a ventas enviado con éxito:", data?.id);
              }),
          );
        } else {
          console.warn(
            "⚠️ No se ha configurado VENTAS_EMAIL en las variables de entorno.",
          );
        }

        await Promise.allSettled(promesasCorreos);
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
