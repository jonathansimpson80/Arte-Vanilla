# Beweging — Arte Vanilla

Alles in `src/motion/`. Geen animatiebibliotheek: IntersectionObserver,
`position: sticky`, CSS-keyframes en één gedeelde `requestAnimationFrame`-loop.
Dat is dezelfde aanpak die goed presterende Framer-sites gebruiken, en het
scheelt ~40kb aan runtime.

| Onderdeel | Wat het doet | Parameters |
|---|---|---|
| `useReveal` / `Reveal` | Opkomen bij binnenkomst in beeld: opacity 0→1, `translateY`, optioneel `scale` | `y` (14–26px), `scale` (0.90–0.97), `delay`, `amount`, `once` |
| `ImageReveal` | Beeld vouwt open via `clip-path` (900ms) terwijl het van `scale(1.18)` naar 1 zoomt (1200ms) | `zoom`, `delay` |
| `Marquee` | Oneindige ticker; rij staat er 2× in en schuift `-50%`. Duur volgt uit de gemeten rijbreedte, dus constante px/s | `speed` (px/s), `direction`, `pauseOnHover` |
| `PinnedSteps` | Sectie van `n × stepHeight × 100vh` met een `sticky` panel; actieve index en voortgangsbalk volgen uit de scrollpositie | `items`, `stepHeight`, `stickyTop` |
| `StickyStack` | Kaarten stapelen: elke kaart `sticky` met oplopende `top` en krimpende `scale` | `top`, `offset`, `shrink` |
| `Parallax` | Scroll-gekoppelde `translate3d` | `distance` (px over de doorloop) |
| `Sprinkles` | Vallende, draaiende deeltjes; val 8–13,5s, spin 4–6,7s, linear infinite | `columns` |
| `useScrollProgress` | Voortgang 0–1 van een element door het scherm; één rAF-loop, rendert pas bij >0,2% verschil | — |

Standaard easing: `--reveal-ease: cubic-bezier(0.22, 1, 0.36, 1)`.

## Twee dingen die makkelijk misgaan

**Onzichtbare inhoud in een achtergrondtab.** Een browser bevriest transities in
een verborgen tab. Als de eindstand (`opacity: 1`) alleen via een transitie
bereikt wordt, blijft de pagina leeg tot de tab weer zichtbaar is. `useReveal`
heeft daarom drie fases: `hidden`, `animate` en `instant`. Die laatste springt
zonder animatie naar de eindstand en wordt gebruikt bij
`prefers-reduced-motion`, bij laden in een achtergrondtab, en als vangnet na
1500ms.

**Scroll-listeners per component.** Elke scroll-gedreven sectie zou een eigen
listener kunnen openen; dat loopt snel vol. `useScrollProgress` gebruikt één
rAF-loop per instantie en slaat renders over onder de 0,2% verandering.

## Nog niet geverifieerd

Het scroll-gedrag (pinning, stapeling, voortgangsbalk) is structureel
gecontroleerd — hoogtes, `top`-waarden en `scale` kloppen — maar de daadwerkelijke
afspeelbeweging is nog niet met eigen ogen bekeken. Doe dat in een gewone browser
op `http://localhost:5173`.
