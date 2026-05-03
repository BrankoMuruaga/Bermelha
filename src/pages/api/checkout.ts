import type { APIRoute } from "astro";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "contentful";

const contentfulClient = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MP_ACCESS_TOKEN,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: "El carrito está vacío" }), {
        status: 400,
      });
    }

    const itemIds = cartItems.map((item: any) => item.id);

    const entries = await contentfulClient.getEntries({
      "sys.id[in]": itemIds.join(","),
      content_type: "producto",
    });

    if (entries.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Productos no encontrados" }),
        {
          status: 404,
        },
      );
    }

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

      return {
        id: cmsProduct.sys.id,
        title: fields.nombre,
        quantity: Number(cartItem.quantity),
        unit_price: Number(fields.precio),
        currency_id: "ARS",
      };
    });

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
