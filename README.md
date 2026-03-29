# Bermelha 🧶

Tienda online de amigurumis hechos a mano.

## Stack

- **Astro** — framework principal
- **React** — componentes interactivos (islas)
- **Tailwind CSS v4** — estilos
- **Contentful** — CMS para productos y colecciones
- **nuqs** — manejo de query params en la URL

## Estructura

```
src/
├── components/       # Componentes reutilizables (Button, IconButton, ProductCard...)
├── context/          # CartContext, WishlistContext
├── data/             # Configuración y mocks
├── hooks/            # useLocalStorage, useHydrated, useContentful
├── layouts/          # Layout base de Astro
├── pages/            # Páginas (index, carrito, favoritos)
├── styles/           # global.css
└── UI/               # Componentes de página (Main, Catalogo, Bento...)
```

## Variables de entorno

Crear un archivo `.env.local`:

```env
PUBLIC_CONTENTFUL_SPACE_ID=tu_space_id
PUBLIC_CONTENTFUL_ACCESS_TOKEN=tu_access_token
```

## Instalación

```bash
pnpm install
pnpm run dev
```

## Funcionalidades

- Catálogo con búsqueda y paginación por URL
- Filtro por colección desde el bento
- Carrito y favoritos persistidos en localStorage
- Pedidos personalizados
- Preguntas frecuentes
- Responsive
