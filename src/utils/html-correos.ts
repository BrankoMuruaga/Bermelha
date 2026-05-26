/**
 * Genera el HTML del correo de confirmación con el branding de Bermelha
 */
export function getPaymentApprovedHtmlTemplate(paymentId: string): string {
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

// Agregá esto en src/utils/html-correos.ts

export function getInternalOrderNotificationHtmlTemplate(
  paymentId: string | number,
  emailCliente: string,
  items: any[],
  shippingDetails: any,
): string {
  const itemsHtml = items
    .map(
      (item) =>
        `<li style="margin-bottom: 8px;">
          <strong>${item.quantity}x</strong> ${item.title} 
          <span style="color: #666;">($${item.unit_price})</span>
        </li>`,
    )
    .join("");

  const shippingHtml = shippingDetails
    ? `<ul style="list-style-type: none; padding: 0;">
        <li style="margin-bottom: 8px;"><strong>Tipo de Envío:</strong> ${
          shippingDetails.deliveryType === "D" ? "Domicilio" : "Sucursal"
        }</li>
        <li style="margin-bottom: 8px;"><strong>Destinatario:</strong> ${
          shippingDetails.nombreApellido || "No especificado"
        }</li>
        <li style="margin-bottom: 8px;"><strong>DNI:</strong> ${
          shippingDetails.dni || "No especificado"
        }</li>
        <li style="margin-bottom: 8px;"><strong>Teléfono:</strong> ${
          shippingDetails.telefono || "No especificado"
        }</li>
        ${
          shippingDetails.deliveryType === "D"
            ? `<li style="margin-bottom: 8px;"><strong>Dirección:</strong> ${shippingDetails.street} ${shippingDetails.number}</li>`
            : `<li style="margin-bottom: 8px;"><strong>Sucursal:</strong> ${shippingDetails.sucursalNombre}</li>`
        }
        <li style="margin-bottom: 8px;"><strong>Código Postal:</strong> ${
          shippingDetails.postalCode
        }</li>
      </ul>`
    : `<p style="color: #d97706; font-weight: bold;">Acordar con el comprador / Retiro en persona.</p>`;

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #8d4e39; padding: 20px; text-align: center;">
        <h2 style="color: #fff; margin: 0;">💰 ¡NUEVA VENTA CONFIRMADA!</h2>
      </div>
      
      <div style="padding: 24px;">
        <p style="font-size: 16px;">¡Hola! Entró un nuevo pago por Mercado Pago. Acá están los detalles para preparar el pedido:</p>
        
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0 0 8px 0;"><strong>Referencia de Orden:</strong> #${paymentId}</p>
          <p style="margin: 0;"><strong>Email de contacto:</strong> <a href="mailto:${emailCliente}" style="color: #8d4e39;">${emailCliente}</a></p>
        </div>

        <h3 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 24px;">🧶 Productos a preparar:</h3>
        <ul style="padding-left: 20px;">
          ${itemsHtml}
        </ul>

        <h3 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 24px;">📦 Datos de Envío:</h3>
        ${shippingHtml}
        
      </div>
    </div>
  `;
}
