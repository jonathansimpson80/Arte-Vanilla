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

## Het beheerdocument

De zaak past haar eigen teksten en foto's aan in één HTML-bestand: `/beheer`.
Het staat achter een slot, wordt bij elke build opnieuw uit de code gemaakt, en
werkt zonder internet — letters, woordmerk en de voorbeeldjes van de foto's
zitten er als data-URI in. Het scherm is Engels, want de zaak leest Engels; de
scripts eromheen zijn Nederlands.

Het document verandert de site niet zelf. Het verzamelt wat er moet veranderen
en levert één JSON-bestand met alleen de wijzigingen, met bij elke wijziging de
taal, de oude waarde en het bronbestand. `beheer-toepassen.cjs` zoekt die oude
waarde in de code op en zet de nieuwe ervoor in de plaats.

### De onderdelen

| Bestand | Wat het doet |
|---|---|
| `scripts/beheer-inhoud.cjs` | Leest elke tekst, foto en prijs uit de contentbestanden, door ze met de TypeScript-compiler te vertalen en uit te voeren |
| `scripts/beheer-modules.cjs` | De indeling: welke pagina's er zijn en welk blok waar op de site staat |
| `scripts/beheer-bouw.cjs` | Verdeelt de inhoud over de blokken en maakt van elke sleutel een Engels label |
| `scripts/beheer.cjs` | Bouwt het HTML-bestand en schrijft het bouwverslag |
| `scripts/beheer-sjabloon.html` | Het scherm zelf: gewone HTML en JavaScript, geen framework |
| `scripts/beheer-fonts.cjs` | Bakt de vier lettertypes in als data-URI in `beheer-fonts.css` |
| `scripts/beheer-duimen.py` | Maakt de voorbeeldjes van de foto's met Pillow, in `beheer-duimen.json` |
| `scripts/beheer-toepassen.cjs` | Zet een ingezonden bestand terug in de code |
| `scripts/beheer-wachtwoord.cjs` | Zet iemand in de lijst met logins |
| `middleware.ts` | Het slot op `/beheer` |
| `api/beheer-inzending.ts` | Inzendingen aannemen, tonen, goedkeuren, weggooien |
| `api/beheer-toegang.ts` | De lijst met logins lezen en bijwerken |

### Commando's

```bash
npm run beheer                 # bouwt public/beheer.html
npm run beheer -- --ververs    # maakt alle voorbeeldjes van de foto's opnieuw
npm run beheer -- --uit ~/Desktop/beheer.html   # een kopie om te mailen
npm run beheer:letters         # haalt de lettertypes opnieuw op
npm run beheer:login "Giulia" --beheerder       # zet iemand in de lijst
npm run beheer:toepassen bestand.json           # proefronde
npm run beheer:toepassen bestand.json --schrijf # echt terugzetten
```

`npm run build` maakt het document mee, zodat het nooit achterloopt op de site.

Even zelf bekijken zonder te deployen: `npm run beheer -- --uit voorbeeld/beheer.html`
en dat bestand openen. Het venster rechts haalt de echte site op van het adres
dat in de balk staat; alles daarbuiten werkt zonder internet. Wijst dat adres
naar de verkeerde plek, dan kun je het in het document zelf overschrijven, en
onthoudt de browser het.

De voorbeeldjes van de foto's staan in `scripts/beheer-duimen.json` en horen in
de repo: de bouwmachine van Vercel heeft geen Pillow. Voeg je een foto toe, maak
het document dan een keer lokaal (`npm run beheer`) en commit dat bestand mee.

### Omgevingsvariabelen

Zet deze in Vercel onder Settings → Environment Variables. Zonder ze werkt de
site gewoon; alleen het beheerdocument valt dan terug op minder.

| Naam | Waarvoor | Zonder |
|---|---|---|
| `BEHEER_GEHEIM` | Ondertekent het bewijsje dat de middleware na het inloggen meegeeft aan de twee serverfuncties | "Submit" werkt niet; het document zegt dat de salon het bestand kan opslaan en opsturen |
| `BEHEER_LOGINS` | Terugval zolang `scripts/beheer-toegang.json` leeg is; regels `naam:wachtwoord`, gescheiden door komma's of regeleindes | Zie `BEHEER_WACHTWOORD` |
| `BEHEER_WACHTWOORD` | Eén gedeeld wachtwoord, als er ook geen `BEHEER_LOGINS` is | Staat er niets én is de lijst leeg, dan gaat `/beheer` op slot en niet open |
| `KV_REST_API_URL` en `KV_REST_API_TOKEN` | Sleutelopslag voor inzendingen, de lijst met logins en de rem op verkeerde wachtwoorden. `UPSTASH_REDIS_REST_URL` en `UPSTASH_REDIS_REST_TOKEN` werken ook | Inzendingen kunnen niet bewaard worden (het document zegt dat in het Engels), de lijst komt uit de repo, en de rem telt alleen binnen één machine |

De wachtwoorden zelf staan nergens in de repo. In `scripts/beheer-toegang.json`
staat per persoon alleen een afdruk: PBKDF2-SHA256 met een eigen zout.

### Een inzending terugzetten

1. Draai `npm run beheer:toepassen bestand.json` en lees het verslag. Er wordt
   nog niets geschreven.
2. Klopt het, draai dan hetzelfde met `--schrijf`.
3. Foto's landen in `aangeleverd/`. Het verslag zegt welke breedtes er van de
   oude foto bestaan; zet de nieuwe onder dezelfde naam in `public/media/` en
   draai `node tools/beelden.mjs` om die breedtes opnieuw te maken.
   Een foto staat vaak op meer dan een plek. In het document is hij bij elke
   sectie te zien waar hij voorkomt, maar er is op schijf maar een bestand: hem
   vervangen verandert dus alle plekken tegelijk. Het document zegt dat op de
   kaart, en het verslag noemt de plekken.
4. Meet de nieuwe foto op met `python3 tools/beeldmaten.py`.
5. Draai `npm run build` en kijk of de site het in alle drie de talen nog doet.

Een tekst die twee keer in de bron staat wordt niet vervangen: dan is niet te
bepalen welke bedoeld is. Het verslag noemt hem, en dan doe je die met de hand.
