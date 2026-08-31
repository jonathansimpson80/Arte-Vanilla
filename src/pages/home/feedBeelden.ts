/**
 * Beelden uit de feed van de zaak; de marquee zet de rij zelf nog een keer neer.
 *
 * `post` is de permalink van de Instagram-post waar het beeld uit komt. Die is
 * één voor één nagelopen tegen de publieke grid van @arte_vanilla; staat er
 * geen bij, dan is de post niet teruggevonden en wijst de kaart naar het
 * profiel in plaats van naar een gokje.
 */
export const feedBeelden: { src: string; alt: string; post?: string }[] = [
  {
    src: '/media/vitrine-bakken.jpg',
    alt: 'Bakken gelato in de vitrine',
    post: 'https://www.instagram.com/arte_vanilla/p/DcQ3C_ts1XV/',
  },
  {
    src: '/media/cake-chocoladesaus.jpg',
    alt: 'Cake met warme chocoladesaus',
    post: 'https://www.instagram.com/arte_vanilla/reel/DcnkQSVgVEz/',
  },
  {
    src: '/media/fragola-crumble.jpg',
    alt: 'Aardbeiengelato met crumble in de bak',
    post: 'https://www.instagram.com/arte_vanilla/p/Db-1Fl8MXZH/',
  },
  { src: '/media/affogato.jpg', alt: 'Espresso wordt over een bol gelato geschonken' },
  {
    src: '/media/cioccolato.jpg',
    alt: 'Chocolade wordt in stukken gesneden',
    post: 'https://www.instagram.com/arte_vanilla/reel/DclBbFFM5LK/',
  },
  { src: '/media/hoorntje-gevel.jpg', alt: 'Hoorntje met twee bollen voor de gevel' },
  {
    src: '/media/caramello.jpg',
    alt: 'Taartjes met karamel en noten',
    post: 'https://www.instagram.com/arte_vanilla/reel/Db7ysNeA4B6/',
  },
  { src: '/media/dolci-koekjes.jpg', alt: 'Koekjes met poedersuiker' },
  { src: '/media/gevel-bankjes.jpg', alt: 'De gevel met de gestreepte bankjes' },
  { src: '/media/tiramisu.jpg', alt: 'Tiramisù in potjes' },
  { src: '/media/pistache-scheppen.jpg', alt: 'Pistachegelato wordt geschept' },
  {
    src: '/media/bezorgauto.jpg',
    alt: 'Het bezorgwagentje voor de deur',
    post: 'https://www.instagram.com/arte_vanilla/p/Db5MHRXtO1t/',
  },
]
