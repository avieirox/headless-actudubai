# ACTU Dubai — Blog Headless (Next.js 14 + WPGraphQL)

Base de proyecto en Next.js 14 (App Router, TypeScript) para un blog headless consumiendo WordPress + WPGraphQL.

## Requisitos cubiertos

- SSG/ISR (sin SSR inicial) con `revalidate = 300` en `app/page.tsx`.
- Home lista todos los posts vía WPGraphQL.
- Queries preparadas para posts, categorías y tags (`lib/wpQueries.ts`).
- SEO base y preparado para Yoast (helpers en `lib/seo.ts`, uso de `generateMetadata` en Home).
- TailwindCSS + fuentes con `next/font` (Montserrat títulos, Lato texto).
- Código modular con componentes y utilidades en `lib/`.
- Fetch directo a GraphQL con `graphql-request`.
- Arquitectura preparada para rutas de post y categoría (`app/blog/[slug]/page.tsx`, `app/categoria/[slug]/page.tsx`).
- Lint listo con `next lint`.

## Estructura

```
app/
  layout.tsx
  globals.css
  page.tsx
  blog/[slug]/page.tsx
  categoria/[slug]/page.tsx
components/
  Container.tsx
  PostCard.tsx
lib/
  fonts.ts
  wpClient.ts
  wpQueries.ts
  seo.ts
types/
  wordpress.ts
.env.example
tailwind.config.ts
postcss.config.js
tsconfig.json
package.json
```

## Configuración

1. Copia el archivo de entorno y actualiza si es necesario:

```
cp .env.example .env.local
```

2. Instala dependencias (Node 18+ recomendado):

```
npm install
```

## Comandos

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run start` — serve de producción
- `npm run lint` — lint con ESLint/Next
- `npm run type-check` — verificación de tipos TypeScript

## Notas

- La Home muestra todos los posts. Categorías/Tags listos en `lib/wpQueries.ts` para futuros filtros.
- Las imágenes remotas están habilitadas para `backoffice.actudubai.com` en `next.config.ts`.
- Para un estilo de excerpt HTML más rico, puedes añadir el plugin `@tailwindcss/typography` si lo deseas.

## Shortcodes de diálogos (callouts)

Puedes insertar cuadros de diálogo elegantes directamente en el contenido de WordPress usando shortcodes:

- Sintaxis:
  - `[dialog type="info" title="Título opcional"]Contenido HTML o texto[/dialog]`
  - Alias: `[callout ...]...[/callout]`

- Tipos disponibles (con iconos llamativos y colores adaptados):
  - `info` — informativo (azul)
  - `success` — éxito/confirmación (verde)
  - `warning` — aviso (ámbar)
  - `danger` — importante/error (rojo)
  - `tip` — idea/nota (violeta)

- Ejemplos:

```
[dialog type="info" title="Nota importante"]
Este es un mensaje informativo con formato profesional.
[/dialog]

[dialog type="success" title="¡Listo!"]
La operación se realizó correctamente.
[/dialog]

[dialog type="warning" title="Atención"]
Revisa los datos antes de continuar.
[/dialog]

[dialog type="danger" title="Riesgo"]
Esta acción no se puede deshacer.
[/dialog]

[dialog type="tip" title="Sugerencia"]
Puedes guardar filtros para acceder más rápido.
[/dialog]
```

- Móvil y modo oscuro
  - Totalmente responsive y con variantes `dark` automáticas.

### FAQs (collapsible)

Add collapsible FAQ blocks in your WordPress content using shortcodes:

- Group with controls:

```
[faqs controls="true"]
[faq question="What is ACTU Dubai?"]ACTU Dubai is a financial news portal.[/faq]
[faq q="How often is data updated?"]Every 60s via ISR and webhooks.[/faq]
[faq question="Do you support dark mode?"]Yes, toggle in the header.[/faq]
[/faqs]
```

- Single FAQ:

```
[faq question="How to contact?"]Use the Contact page or email us.[/faq]
```

Behavior
- Uses native `<details>`/`<summary>` for accessibility and no-JS collapse.
- When `controls="true"`, two buttons (Open all / Close all) are rendered. Interactivity is provided by a light client helper.

Client helper
- The article HTML is rendered via `components/RichContent.tsx`, which wires the FAQ controls safely on the client.


## Revalidación On‑Demand (Coolify / self‑hosted)

Este proyecto incluye un endpoint para revalidar rutas al publicar/actualizar en WordPress:

- Ruta: `POST /api/revalidate`
- Seguridad: envía `x-revalidate-secret: <REVALIDATE_SECRET>`
- Body JSON opcional:
  - `slug`: slug del post
  - `category`: slug de la categoría principal (para rutas `/:category/:slug` y `/categoria/:category`)
  - `paths`: array adicional de paths a revalidar

Ejemplos:

```
curl -X POST "https://tu-dominio.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"slug":"mi-post","category":"market"}'

# Revalidar Home manualmente (GET):
curl "https://tu-dominio.com/api/revalidate?secret=$REVALIDATE_SECRET&path=/"
```

Configura en Coolify
- Define la variable `REVALIDATE_SECRET` en el servicio.
- Expón públicamente el endpoint `/api/revalidate` (forma parte de la app Next).

WordPress (Webhook)
- Usa un plugin de webhooks (p. ej., WP Webhooks) o una acción personalizada en `publish_post` para llamar al endpoint con el slug y la categoría del post.
## Theme toggle (Light/Dark) and Footer

- Header includes a theme toggle (persists in localStorage and respects system preference on first paint).
- Implemented in `components/ThemeToggle.tsx` with early init script in `app/layout.tsx`.
- A global footer is rendered from `components/Footer.tsx` with basic links (Home, About, Contact, Privacy).

## Yahoo Finance (RapidAPI) Integration

Environment variables (`.env.local`):

```
YAHOO_RAPIDAPI_KEY=your-rapidapi-key
YAHOO_RAPIDAPI_HOST=yahoo-finance-real-time1.p.rapidapi.com
YAHOO_REGION=US
YAHOO_LANG=en-US
```

Server helper:
- `lib/market/yahoo.ts` exports `yahooRequest(path, params)`, `getQuotes(symbols)`, `getOptions(symbol)`.
- Paths allowed (whitelist): `market/get-quotes`, `stock/get-detail`, `stock/get-options`, `stock/get-chart`.

API route proxy:
- `GET /api/yahoo?path=stock/get-options&symbol=WOOF&region=US&lang=en-US`
  - Returns the proxied JSON from RapidAPI with 60s cache.

Example curl:
```
curl "http://localhost:3000/api/yahoo?path=stock/get-options&symbol=AAPL&region=US&lang=en-US"
```

Notes:
- The RapidAPI key is only used on the server; do not expose it client-side.
- You can add more paths to the whitelist in `lib/market/yahoo.ts` if needed.
