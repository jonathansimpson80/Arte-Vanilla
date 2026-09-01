/**
 * Afmetingen van elk beeld in public/media, opgemeten bij het toevoegen.
 *
 * Hiermee kan <Foto> width en height meegeven en reserveert de browser de
 * juiste ruimte voordat het beeld binnen is — anders springt de pagina onder
 * je vingers weg tijdens het laden.
 *
 * Bijwerken met: python3 tools/beeldmaten.py
 */

export const beeldmaten: Record<string, [number, number]> = {
  '/media/affogato.jpg': [1600, 900],
  '/media/bak-cioccolato.jpg': [1400, 1749],
  '/media/bak-fragola.jpg': [1400, 1749],
  '/media/bak-gianduia.jpg': [1400, 1749],
  '/media/bak-mango.jpg': [1400, 1752],
  '/media/bak-pistacchio.jpg': [1400, 1743],
  '/media/bak-stracciatella.jpg': [1400, 1759],
  '/media/bak-vaniglia-cacao.jpg': [1400, 1752],
  '/media/bak-zabaglione.jpg': [1400, 1755],
  '/media/beker-toonbank.jpg': [1400, 1858],
  '/media/beker-wafel.jpg': [1600, 900],
  '/media/bezorgauto.jpg': [1400, 1856],
  '/media/cake-chocoladesaus.jpg': [1400, 1877],
  '/media/caramello.jpg': [360, 640],
  '/media/chocolade.jpg': [1400, 1849],
  '/media/cioccolato.jpg': [360, 640],
  '/media/dolci-koekjes.jpg': [1400, 1830],
  '/media/dolci.jpg': [360, 640],
  '/media/fragola-crumble.jpg': [1400, 1867],
  '/media/fragola-draaien.jpg': [512, 640],
  '/media/gelato-bakken.jpg': [480, 640],
  '/media/gevel-bankjes.jpg': [1400, 1858],
  '/media/gevel.jpg': [512, 640],
  '/media/hoorntje-drie-bollen.jpg': [1400, 1866],
  '/media/hoorntje-gevel.jpg': [1600, 900],
  '/media/logo.jpg': [150, 150],
  '/media/pistache-scheppen.jpg': [1400, 1850],
  '/media/poster-sinaasappel.jpg': [1400, 1864],
  '/media/sinaas-aperol.jpg': [1400, 933],
  '/media/tiramisu.jpg': [1400, 1871],
  '/media/vitrine-bakken.jpg': [1400, 1871],
  '/media/vitrine-gebak.jpg': [1400, 1050],
  '/media/winkel.jpg': [360, 640],
  '/media/pair.png': [360, 640],
}
