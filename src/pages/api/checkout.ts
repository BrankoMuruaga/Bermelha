import type { APIRoute } from "astro";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "contentful";
import { getEntries } from "@/lib/contentful";

const contentfulClient = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MP_ACCESS_TOKEN,
});

interface ConfiguracionGlobalFields {
  montoParaEnvioGratis: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { cartItems, shippingInfo, prayer } = body;
    const { email } = prayer || {};

    if (!email) {
      return new Response(
        JSON.stringify({ error: "El email de contacto es requerido" }),
        { status: 400 },
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: "El carrito está vacío" }), {
        status: 400,
      });
    }

    const itemIds = cartItems.map((item: any) => item.id);

    const [entries, configEntries] = await Promise.all([
      contentfulClient.getEntries({
        "sys.id[in]": itemIds.join(","),
        content_type: "producto",
      }),
      getEntries<ConfiguracionGlobalFields>("configuracionGlobal", {
        limit: 1,
      }),
    ]);

    let montoParaEnvioGratis = 100000;

    if (configEntries.length > 0) {
      const configFields = configEntries[0].fields;
      if (configFields && configFields.montoParaEnvioGratis) {
        montoParaEnvioGratis = Number(configFields.montoParaEnvioGratis);
      }
    }

    if (entries.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Productos no encontrados" }),
        { status: 404 },
      );
    }

    let subtotalRealServidor = 0;

    const preferenceItems = cartItems.map((cartItem: any) => {
      const cmsProduct = entries.items.find(
        (entry) => entry.sys.id === cartItem.id,
      );

      if (!cmsProduct) {
        throw new Error(`Producto ${cartItem.id} manipulado o no existe`);
      }

      const fields = cmsProduct.fields as {
        nombre: string;
        precio: number;
      };

      const cantidad = Number(cartItem.quantity);
      const precioUnitario = Number(fields.precio);

      subtotalRealServidor += precioUnitario * cantidad;

      let customizationsText = "";
      if (
        cartItem.customizations &&
        typeof cartItem.customizations === "object" &&
        !Array.isArray(cartItem.customizations)
      ) {
        customizationsText = Object.entries(cartItem.customizations)
          .map(([key, custom]: [string, any]) => {
            return ` - ${custom.label || key}: ${custom.value}`;
          })
          .join("");
      }

      return {
        id: cmsProduct.sys.id,
        title: fields.nombre + customizationsText,
        quantity: cantidad,
        unit_price: precioUnitario,
        currency_id: "ARS",
      };
    });

    const superaEnvioGratis = subtotalRealServidor >= montoParaEnvioGratis;

    if (shippingInfo && shippingInfo.cost > 0 && !superaEnvioGratis) {
      const tipoEnvio =
        shippingInfo.address?.deliveryType === "D" ? "Domicilio" : "Sucursal";
      const cpEnvio = shippingInfo.address?.postalCode || "";

      preferenceItems.push({
        id: "costo-envio",
        title: `Costo de envío (${tipoEnvio} - CP: ${cpEnvio})`,
        quantity: 1,
        unit_price: Number(shippingInfo.cost),
        currency_id: "ARS",
      });
    }

    const preference = new Preference(client);

    const result = await preference
      .create({
        body: {
          items: preferenceItems,
          back_urls: {
            success: `${import.meta.env.PUBLIC_BASE_URL}/payment-success`,
            failure: `${import.meta.env.PUBLIC_BASE_URL}/payment-failed`,
          },
          auto_return: "approved",
          notification_url: `${import.meta.env.PUBLIC_BASE_URL}/api/mercadopago/pagos`,
          payer: {
            email,
          },
          metadata: {
            email_contacto: email.trim(),
            shipping_details: shippingInfo?.address
              ? JSON.stringify(shippingInfo.address)
              : "Sin envío",
          },
        },
      })
      .then((data) => {
        console.log("Preferencia creada:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error creando preferencia:", error);
        throw error;
      });

    return new Response(
      JSON.stringify({ preferenceId: result.id, initPoint: result.init_point }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error procesando checkout:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 },
    );
  }
};
