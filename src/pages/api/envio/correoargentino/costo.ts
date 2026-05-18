import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cp, type } = await request.json();

    if (!cp || !type) {
      return new Response(JSON.stringify({ error: "Faltan parámetros" }), {
        status: 400,
      });
    }

    const cpNumber = parseInt(cp, 10);
    let zona = 4;

    // 1. ZONA 1: AMBA (CP 1000 al 1893) y excepciones
    const excepcionesZ1 = [1924, 2752, 2760, 2814, 2930, 2931, 2935, 2953];
    if (
      (cpNumber >= 1000 && cpNumber <= 1893) ||
      excepcionesZ1.includes(cpNumber)
    ) {
      zona = 1;
    }
    // 2. ZONA 2: Resto de Bs As, Córdoba, Entre Ríos, La Pampa, Santa Fe
    else if (
      (cpNumber >= 1894 && cpNumber <= 3499) || // Resto Bs As, Santa Fe, Entre Ríos
      (cpNumber >= 5000 && cpNumber <= 5299) || // Córdoba
      (cpNumber >= 6000 && cpNumber <= 6399) // La Pampa
    ) {
      zona = 2;
    }
    // 3. ZONA 4: Extremos (Salta, Jujuy, Chubut, Santa Cruz, Tierra del Fuego)
    else if (
      (cpNumber >= 4400 && cpNumber <= 4699) || // Salta y Jujuy
      (cpNumber >= 9000 && cpNumber <= 9499) // Chubut, Santa Cruz, Tierra del Fuego
    ) {
      zona = 4;
    }
    // 4. ZONA 3: Resto de las provincias del país (Cuyo, Norte, Río Negro, Neuquén)
    else {
      zona = 3;
    }

    // MATRIZ DE PRECIOS HASTA 1KG (Basada en Tarifario Paq.ar)
    // [Zona 1, Zona 2, Zona 3, Zona 4]
    const envDomicilio =
      import.meta.env.TARIFAS_DOMICILIO || "7591,9102,9914,9987";
    const envSucursal =
      import.meta.env.TARIFAS_SUCURSAL || "4415,5481,6030,6299";

    const tarifasDomicilio = envDomicilio.split(",").map(Number);
    const tarifasSucursal = envSucursal.split(",").map(Number);

    const cost =
      type === "D" ? tarifasDomicilio[zona - 1] : tarifasSucursal[zona - 1];

    return new Response(JSON.stringify({ cost }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error calculando el envío. Detalles: " + error,
      }),
      { status: 500 },
    );
  }
};
