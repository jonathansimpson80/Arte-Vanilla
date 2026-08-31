# Arte Vanilla

Website voor een creatieve studio — statische SPA, geen backend.

## Stack

| Tool | Versie | Waarvoor |
|------|--------|----------|
| Vite | 8 | Build tool + dev server |
| React | 19 | UI |
| TypeScript | 5.9 | Types (strict) |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Styling (via `@tailwindcss/vite`) |

## Aan de slag

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b + vite build → dist/
npm run preview  # productie-build lokaal bekijken
```

## Routes

| Pad | Pagina |
|-----|--------|
| `/` | Home |
| `/werk` | Overzicht, filterbaar via `?categorie=Mural` |
| `/werk/:slug` | Projectdetail |
| `/over` | Over de studio |
| `/contact` | Contact + formulier |
| `*` | 404 |

## Structuur

```
src/
  main.tsx            # entry: createRoot + RouterProvider
  router.tsx          # createBrowserRouter, alle routes
  index.css           # Tailwind 4 + design tokens (@theme)
  components/         # RootLayout, Header, Footer, WorkCard, ArtPlaceholder
  pages/              # Home, Work, WorkDetail, About, Contact, NotFound, ErrorPage
  data/works.ts       # portfolio-content (placeholder)
  lib/seo.tsx         # <title>/<meta> per pagina (React 19 hoisting)
```

Alias: `@/` wijst naar `src/`.

## Wat nog placeholder is

- **Content** in `src/data/works.ts` — projecten, opdrachtgevers en credits zijn verzonnen.
- **Beeld**: `ArtPlaceholder` tekent een generatieve SVG per project. Zet echte
  fotografie in `public/work/` en vervang het component door `<img>`.
- **Contactformulier** doet alleen client-side validatie en toont een bevestiging;
  koppel in `src/pages/Contact.tsx` je eigen endpoint of mailservice.
- **NAW-gegevens** in `Footer.tsx` en `Contact.tsx` (adres, telefoon, KvK/BTW).

## Deploy

`npm run build` levert een statische `dist/`. Voor deep links moet de host alle
paden naar `index.html` sturen — dat is al geregeld voor Vercel (`vercel.json`)
en Netlify (`public/_redirects`).
