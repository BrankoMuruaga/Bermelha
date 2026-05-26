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
