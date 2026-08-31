import type { Vertaald } from '@/i18n/taal'

/**
 * Alle vaste teksten van de site, per sleutel in drie talen.
 * Losse woorden staan bij het onderdeel waar ze horen, zodat je bij het
 * vertalen niet door de componenten hoeft te zoeken.
 */
export const ui = {
  // ---------- navigatie ----------
  navIjs: { nl: 'IJs', en: 'Ice cream', it: 'Gelato' },
  navGebak: { nl: 'Gebak & koffie', en: 'Pastry & coffee', it: 'Dolci e caffè' },
  navKoffie: { nl: 'Koffie', en: 'Coffee', it: 'Caffè' },
  navAanbieding: { nl: 'Aanbieding', en: 'Offers', it: 'Offerte' },
  navBezoek: { nl: 'Bezoek', en: 'Visit', it: 'Visita' },
  menu: { nl: 'Menu', en: 'Menu', it: 'Menu' },
  taalKiezen: { nl: 'Taal kiezen', en: 'Choose language', it: 'Scegli la lingua' },

  // ---------- knoppen ----------
  route: { nl: 'Route', en: 'Directions', it: 'Indicazioni' },
  routeEnAdres: { nl: 'Route en adres', en: 'Directions and address', it: 'Indicazioni e indirizzo' },
  belOns: { nl: 'Bel ons', en: 'Call us', it: 'Chiamaci' },
  bekijkSmaken: { nl: 'Bekijk de smaken', en: 'See the flavours', it: 'Guarda i gusti' },
  bestelUberEats: { nl: 'Bestel via Uber Eats', en: 'Order on Uber Eats', it: 'Ordina su Uber Eats' },
  komLangs: { nl: 'Kom langs', en: 'Come by', it: 'Passa a trovarci' },

  // ---------- hero ----------
  heroEyebrow: {
    nl: 'Amsterdam · gelato, dolci & caffè',
    en: 'Amsterdam · gelato, pastry & coffee',
    it: 'Amsterdam · gelato, dolci e caffè',
  },
  heroKop1: { nl: 'Bolletje', en: 'A scoop of', it: 'Una pallina di' },
  heroKopAccent: { nl: 'geluk', en: 'joy', it: 'felicità' },
  heroKop2: { nl: 'voordat het', en: 'before it', it: 'prima che' },
  heroWoord1: { nl: 'smelt.', en: 'melts.', it: 'si sciolga.' },
  heroWoord2: { nl: 'op is.', en: 'runs out.', it: 'finisca.' },
  heroWoord3: { nl: 'gedeeld wordt.', en: 'gets shared.', it: 'si divida.' },
  heroLead: {
    nl: 'De recepten van Nonna, in kleine batches gedraaid in onze eigen keuken. Op is op — en morgen staat er weer iets anders.',
    en: 'Nonna’s recipes, churned in small batches in our own kitchen. When it’s gone it’s gone, and tomorrow brings something else.',
    it: 'Le ricette della nonna, mantecate in piccole quantità nella nostra cucina. Finito è finito, e domani c’è altro.',
  },
  chipGelato: { nl: 'Gelato & sorbet', en: 'Gelato & sorbet', it: 'Gelato e sorbetto' },
  chipDolci: { nl: 'Dolci & caffè', en: 'Pastry & coffee', it: 'Dolci e caffè' },

  // ---------- terugkerend ----------
  vitrineWisselt: {
    nl: 'De vitrine wisselt. Wat er vandaag ligt, weet de toonbank het beste.',
    en: 'The cabinet rotates. What’s in today, the counter knows best.',
    it: 'Il banco cambia. Cosa c’è oggi lo sa meglio chi ci sta dietro.',
  },
  nogBevestigen: { nl: 'Nog bevestigen', en: 'To be confirmed', it: 'Da confermare' },
  letOp: { nl: 'Let op', en: 'Note', it: 'Nota' },
  allergenen: { nl: 'Allergenen', en: 'Allergens', it: 'Allergeni' },
  allergenenOnbekend: {
    nl: 'Allergenen nog niet doorgegeven — vraag het aan de toonbank.',
    en: 'Allergens not listed yet — please ask at the counter.',
    it: 'Allergeni non ancora indicati: chiedi al banco.',
  },
  allergenenNoot: {
    nl: 'Allergenen volgen uit onze omschrijving. Heb je een allergie, vraag het dan even na aan de toonbank.',
    en: 'Allergens follow from our own description. If you have an allergy, please check with us at the counter.',
    it: 'Gli allergeni derivano dalla nostra descrizione. In caso di allergia, chiedi conferma al banco.',
  },
  openingstijden: { nl: 'Openingstijden', en: 'Opening hours', it: 'Orari' },
  vandaagOpen: { nl: 'Vandaag open', en: 'Open today', it: 'Oggi aperto' },
  nuOpen: { nl: 'Nu open', en: 'Open now', it: 'Aperto ora' },
  nuDicht: { nl: 'Nu gesloten', en: 'Closed now', it: 'Ora chiuso' },
  totTijd: { nl: 'tot', en: 'until', it: 'fino alle' },
  vanafVandaag: { nl: 'vandaag vanaf', en: 'today from', it: 'oggi dalle' },
  vanafStraks: { nl: 'weer open vanaf', en: 'open again from', it: 'riapre alle' },
  adres: { nl: 'Adres', en: 'Address', it: 'Indirizzo' },
  telefoon: { nl: 'Telefoon', en: 'Phone', it: 'Telefono' },
  open: { nl: 'Open', en: 'Open', it: 'Aperto' },
  maandag: { nl: 'Maandag', en: 'Monday', it: 'Lunedì' },
  dinsdagZondag: { nl: 'Dinsdag t/m zondag', en: 'Tuesday to Sunday', it: 'Da martedì a domenica' },
  adresNogInvullen: { nl: 'Adres nog invullen', en: 'Address to be added', it: 'Indirizzo da inserire' },

  // ---------- bakken voor thuis ----------
  bakkenEyebrow: { nl: 'Famiglia Pack', en: 'Famiglia Pack', it: 'Famiglia Pack' },
  bakkenKop: {
    nl: 'Het lekkerste ijs, nu ook voor thuis.',
    en: 'Our best gelato, now for home too.',
    it: 'Il nostro gelato, ora anche per casa.',
  },
  bakkenLead: {
    nl: 'Dezelfde vitrine, alleen dan op je eigen bank. Vier maten van 450 tot 1450 ml, en jij bepaalt wat erin gaat.',
    en: 'The same cabinet, only on your own sofa. Four sizes from 450 to 1450 ml, and you decide what goes in.',
    it: 'Lo stesso banco, ma sul tuo divano. Quattro formati da 450 a 1450 ml, e decidi tu cosa ci va.',
  },
  bakSmaken: {
    nl: 'smaken naar keuze',
    en: 'flavours of your choice',
    it: 'gusti a scelta',
  },
  bakSamenstellen: {
    nl: 'Stel je bak samen',
    en: 'Build your tub',
    it: 'Componi la vaschetta',
  },
  bekijkTwaalf: {
    nl: 'Bekijk alle smaken',
    en: 'See every flavour',
    it: 'Guarda tutti i gusti',
  },

  // ---------- flip-kaarten en panelen ----------
  draaiKaart: { nl: 'Draai voor de sfeer', en: 'Flip for the mood', it: 'Gira per l’atmosfera' },
  sfeer: { nl: 'Sfeer', en: 'Mood', it: 'Atmosfera' },
  pastBij: { nl: 'Past bij', en: 'Best for', it: 'Ideale per' },
  familieSmaken: { nl: 'Op het bord', en: 'On the board', it: 'Sul cartello' },
  vraagInWinkel: { nl: 'Vraag in de winkel', en: 'Ask in store', it: 'Chiedi in negozio' },

  // ---------- homepage ----------
  homeStemmingenEyebrow: { nl: 'Het ijs', en: 'The gelato', it: 'Il gelato' },
  homeStemmingenKop1: { nl: 'Drie rijen,', en: 'Three rows,', it: 'Tre file,' },
  homeStemmingenKop2: {
    nl: 'twaalf smaken.',
    en: 'twelve flavours.',
    it: 'dodici gusti.',
  },
  homeStemmingenLead: {
    nl: 'Zo ligt het in de vitrine: fruit boven, crème in het midden, noten en chocolade onder. Twaalf tegelijk, geen één te veel.',
    en: 'That’s how the cabinet is stacked: fruit on top, cream in the middle, nuts and chocolate below. Twelve at a time, not one more.',
    it: 'Il banco è così: frutta in alto, crema in mezzo, frutta secca e cioccolato in basso. Dodici alla volta, non uno di più.',
  },
  homeBesteSmaken: {
    nl: 'Alle smaken in deze rij',
    en: 'Every flavour in this row',
    it: 'Tutti i gusti di questa fila',
  },
  homeKomProeven: {
    nl: 'Kom proeven, het lepeltje is gratis',
    en: 'Come and taste — the little spoon is free',
    it: 'Vieni ad assaggiare, il cucchiaino è gratis',
  },
  homeVitrineEyebrow: { nl: 'Uit de eigen oven', en: 'From our own oven', it: 'Dal nostro forno' },
  homeVitrineKop: {
    nl: 'Het gebak dat ernaast staat.',
    en: 'The pastry that stands beside it.',
    it: 'I dolci che stanno accanto.',
  },
  homeVitrineLabel: { nl: 'Dolci', en: 'Dolci', it: 'Dolci' },
  /**
   * Slogan als grafisch vlak achter de gebakkaarten. Alle drie de regels zijn
   * even lang (12 tekens), zodat het woord niet verspringt bij het wisselen
   * van taal.
   */
  homeKiesJeBol: { nl: 'Lekker gebak', en: 'Tasty Pastry', it: 'Dolci golosi' },
  homeHeleKaartGebak: { nl: 'De hele gebakkaart', en: 'The full pastry list', it: 'Tutti i dolci' },
  homeAmbachtEyebrow: {
    nl: 'De textuur van de zaak',
    en: 'The texture of the place',
    it: 'La texture del locale',
  },
  homeAmbachtKop: {
    nl: 'Romig, helder, gemaakt om snel op te gaan.',
    en: 'Creamy, clean, made to disappear fast.',
    it: 'Cremoso, pulito, fatto per finire presto.',
  },
  homeAmbachtLead: {
    nl: 'Eén machine, één kleine keuken achterin, en verder zo min mogelijk. Melk uit de buurt, pistache uit Sicilië, geen kleurstof — daarom is die groen ook geen neon.',
    en: 'One machine, one small kitchen out back, and as little else as possible. Milk from nearby, pistachio from Sicily, no colouring — which is why the green isn’t neon.',
    it: 'Una macchina, una cucina piccola sul retro, e il meno possibile per il resto. Latte di zona, pistacchio dalla Sicilia, niente coloranti: per questo il verde non è fluo.',
  },
  homeKenmerk1: { nl: 'Elke ochtend vers gedraaid', en: 'Churned fresh every morning', it: 'Mantecato ogni mattina' },
  homeKenmerk2: { nl: 'Kleine batches, geen voorraad', en: 'Small batches, no stockpiles', it: 'Piccole quantità, niente scorte' },
  homeKenmerk3: { nl: 'Zitplaatsen binnen en buiten', en: 'Seats inside and out', it: 'Posti dentro e fuori' },
  homeMomentenEyebrow: { nl: 'Momenten', en: 'Moments', it: 'Momenti' },
  homeMomentenKop: {
    nl: 'Kleine rituelen, zoete afsluiters.',
    en: 'Small rituals, sweet endings.',
    it: 'Piccoli riti, dolci finali.',
  },
  homeReviewsEyebrow: { nl: 'Wat gasten zeggen', en: 'What guests say', it: 'Cosa dicono gli ospiti' },
  homeReviewsKop: {
    nl: 'Wat gasten er zelf van zeggen.',
    en: 'What guests say about it themselves.',
    it: 'Cosa ne dicono gli ospiti.',
  },
  homeLeesReviews: {
    nl: 'Lees wat gasten schreven',
    en: 'Read what guests wrote',
    it: 'Leggi cosa scrivono gli ospiti',
  },
  homeFeedEyebrow: { nl: 'Op de feed', en: 'On the feed', it: 'Sul profilo' },
  homeFeedKop: { nl: 'Vers van', en: 'Fresh from', it: 'Fresco da' },
  homeVolgInstagram: { nl: 'Volg op Instagram', en: 'Follow on Instagram', it: 'Segui su Instagram' },
  homeBekijkPost: { nl: 'Bekijk de post', en: 'View the post', it: 'Guarda il post' },
  homeBezoekEyebrow: { nl: 'Kom langs', en: 'Come by', it: 'Passa a trovarci' },
  homeBezoekKop: {
    nl: 'Je vaste stop na het eten.',
    en: 'Your regular stop after dinner.',
    it: 'La tua sosta fissa dopo cena.',
  },
  homeKaartEyebrow: { nl: 'Op de kaart', en: 'On the map', it: 'Sulla mappa' },
  homeKaartKop: {
    nl: 'Hier komt de plattegrond.',
    en: 'The map goes here.',
    it: 'Qui andrà la mappa.',
  },
  homeKaartLead: {
    nl: 'Zodra het adres bekend is, staat hier de kaart met een knop naar de route.',
    en: 'As soon as the address is known, the map and a directions button go here.',
    it: 'Appena avremo l’indirizzo, qui ci saranno la mappa e il pulsante per le indicazioni.',
  },
  homeSlotKop: {
    nl: 'Je volgende bolletje staat al te wachten.',
    en: 'Your next scoop is already waiting.',
    it: 'La tua prossima pallina sta già aspettando.',
  },
  homeSlotRegel: {
    nl: 'Arte Vanilla · gelato, dolci & caffè · Amsterdam',
    en: 'Arte Vanilla · gelato, pastry & coffee · Amsterdam',
    it: 'Arte Vanilla · gelato, dolci e caffè · Amsterdam',
  },

  // ---------- smakenpagina ----------
  smakenEyebrow: { nl: 'De kaart', en: 'The board', it: 'Il cartello' },
  smakenKop: {
    nl: 'Twaalf smaken, elke dag anders.',
    en: 'Twelve flavours, different every day.',
    it: 'Dodici gusti, diversi ogni giorno.',
  },
  smakenLead: {
    nl: 'Drie rijen op het bord: fruit bovenaan, crème in het midden, en onderin de zware jongens met noten en chocolade.',
    en: 'Three rows on the board: fruit up top, cream in the middle, and the heavy hitters with nuts and chocolate below.',
    it: 'Tre file sul cartello: frutta in alto, crema in mezzo, e sotto i pezzi grossi con frutta secca e cioccolato.',
  },
  smakenBelKnop: {
    nl: 'Bel voor de smaken van vandaag',
    en: 'Call for today’s flavours',
    it: 'Chiama per i gusti di oggi',
  },
  smakenHeleKaart: { nl: 'De hele kaart', en: 'The full board', it: 'Il cartello completo' },
  smakenAltijdTwaalf: {
    nl: 'altijd twaalf op het bord',
    en: 'always twelve on the board',
    it: 'sempre dodici sul cartello',
  },
  smakenAlles: { nl: 'Alles', en: 'All', it: 'Tutti' },
  smakenZichtbaar: { nl: 'smaken zichtbaar', en: 'flavours shown', it: 'gusti visibili' },
  serveerKop: {
    nl: 'Hoorntje of beker?',
    en: 'Cone or cup?',
    it: 'Cono o coppetta?',
  },
  serveerLead: {
    nl: 'Twee manieren om het mee te nemen. De prijzen staan op het bord in de winkel.',
    en: 'Two ways to take it with you. The prices are on the board in the shop.',
    it: 'Due modi per portarlo via. I prezzi sono sul cartello in negozio.',
  },
  vandaagInVitrine: { nl: 'Vandaag in de vitrine', en: 'In the cabinet today', it: 'Oggi al banco' },
  vandaagLijst: {
    nl: 'De winkel heeft vandaag doorgegeven wat er ligt. De rest van de kaart wisselt mee met het seizoen.',
    en: 'The shop told us what’s in today. The rest of the board rotates with the season.',
    it: 'Il negozio ci ha detto cosa c’è oggi. Il resto del cartello cambia con la stagione.',
  },
  smakenLeeg: {
    nl: 'Niets in deze rij vandaag. Kies een andere, of kom gewoon langs en wijs aan.',
    en: 'Nothing in this row today. Pick another, or just come by and point.',
    it: 'Niente in questa fila oggi. Scegli un’altra, o passa e indica.',
  },
  smakenGlasEyebrow: { nl: 'Achter het glas', en: 'Behind the glass', it: 'Dietro il vetro' },
  smakenGlasKop1: { nl: 'Wijs maar aan.', en: 'Just point.', it: 'Basta indicare.' },
  smakenGlasKop2: { nl: 'Wij scheppen.', en: 'We’ll scoop.', it: 'Serviamo noi.' },
  smakenGlasLead: {
    nl: 'Zes bakken, één vitrine. Klik ze open om te zien waar elke rij voor staat — en wijs in de winkel gewoon aan wat er lekker uitziet.',
    en: 'Six tubs, one cabinet. Open them to see what each row stands for — then just point at whatever looks good.',
    it: 'Sei vaschette, un banco. Aprile per capire cosa rappresenta ogni fila, poi in negozio indica quello che ti ispira.',
  },
  smakenFamiliesEyebrow: { nl: 'Zes smaakfamilies', en: 'Six flavour families', it: 'Sei famiglie di gusto' },
  smakenFamiliesKop: {
    nl: 'Ken de families, vind je bol.',
    en: 'Know the families, find your scoop.',
    it: 'Conosci le famiglie, trova la tua pallina.',
  },
  smakenFamiliesLead: {
    nl: 'Zes families, niet de lijst van vandaag. Wat er in elke familie staat wisselt met de vitrine — kom kijken wat er achter het glas ligt.',
    en: 'Six families, not today’s list. What fills each one rotates with the cabinet — come see what’s behind the glass.',
    it: 'Sei famiglie, non la lista di oggi. Quel che le riempie cambia con il banco: vieni a vedere dietro il vetro.',
  },
  smakenKiezenEyebrow: { nl: 'Hoe kies je', en: 'How to choose', it: 'Come scegliere' },
  smakenKiezenKop: {
    nl: 'Zeg wat je zoekt. Wij wijzen.',
    en: 'Tell us what you want. We’ll point.',
    it: 'Dicci cosa cerchi. Ti indichiamo noi.',
  },
  smakenVoorbehoudKop: {
    nl: 'De vitrine draait; de kaart hierboven ook.',
    en: 'The cabinet turns; so does the list above.',
    it: 'Il banco gira, e anche la lista qui sopra.',
  },
  smakenVoorbehoudLead: {
    nl: 'Deze smaken staan op onze eigen bestelkaart, maar er liggen er altijd twaalf tegelijk en die rij wisselt. Wat er vandaag echt staat, zie je in de winkel. De allergenen komen hier nog bij.',
    en: 'These flavours are on our own order list, but twelve lie in the cabinet at a time and that row rotates. What’s actually there today, you see in store. Allergens are still to come here.',
    it: 'Questi gusti sono sul nostro listino, ma nel banco ce ne sono dodici alla volta e la fila cambia. Quello che c’è davvero oggi lo vedi in negozio. Gli allergeni arriveranno qui.',
  },

  // ---------- afhalen ----------
  navAfhalen: { nl: 'Afhalen', en: 'Pickup', it: 'Ritiro' },
  afhalenEyebrow: { nl: 'Bestellen en afhalen', en: 'Order and collect', it: 'Ordina e ritira' },
  afhalenKop: {
    nl: 'Stel je bak samen, wij zetten hem klaar.',
    en: 'Build your tub, we’ll have it ready.',
    it: 'Componi la tua vaschetta, la teniamo pronta.',
  },
  afhalenLead: {
    nl: 'Kies een formaat, je smaken en een tijdstip. Betalen doe je aan de toonbank, zoals het hoort.',
    en: 'Pick a size, your flavours and a time. You pay at the counter, the way it should be.',
    it: 'Scegli formato, gusti e orario. Si paga al banco, come si deve.',
  },
  stap: { nl: 'Stap', en: 'Step', it: 'Passo' },
  stapFormaat: { nl: 'Kies een formaat', en: 'Choose a size', it: 'Scegli il formato' },
  stapSmaken: { nl: 'Kies je smaken', en: 'Choose your flavours', it: 'Scegli i gusti' },
  stapExtras: { nl: 'Extra’s', en: 'Extras', it: 'Extra' },
  stapMoment: { nl: 'Wanneer haal je op?', en: 'When will you collect?', it: 'Quando ritiri?' },
  stapGegevens: { nl: 'Je gegevens', en: 'Your details', it: 'I tuoi dati' },
  stapOverzicht: { nl: 'Overzicht', en: 'Summary', it: 'Riepilogo' },
  smakenGekozen: { nl: 'gekozen', en: 'chosen', it: 'scelti' },
  kiesEerstFormaat: {
    nl: 'Kies eerst een formaat — dat bepaalt hoeveel er in past.',
    en: 'Pick a size first — that decides how much fits.',
    it: 'Scegli prima il formato: decide quanto ci sta.',
  },
  smakenVol: {
    nl: 'Deze bak zit vol. Haal er eerst een smaak af — of neem een maat groter.',
    en: 'This tub is full. Take one out first, or size up.',
    it: 'Questa vaschetta è piena. Togli un gusto, oppure prendi una misura in più.',
  },
  kiesDag: { nl: 'Dag', en: 'Day', it: 'Giorno' },
  kiesTijd: { nl: 'Tijdstip', en: 'Time', it: 'Orario' },
  geenTijdvakken: {
    nl: 'Voor deze dag zijn er geen tijden meer. Kies een andere dag.',
    en: 'No times left for this day. Pick another day.',
    it: 'Non ci sono più orari per questo giorno. Scegli un altro giorno.',
  },
  naam: { nl: 'Naam', en: 'Name', it: 'Nome' },
  naamHint: {
    nl: 'Zodat we weten voor wie de bak in de vriezer staat.',
    en: 'So we know whose tub is in the freezer.',
    it: 'Così sappiamo di chi è la vaschetta nel congelatore.',
  },
  telefoonHint: {
    nl: 'Alleen om te bellen als er iets niet klopt.',
    en: 'Only to call if something doesn’t add up.',
    it: 'Solo per chiamarti se qualcosa non torna.',
  },
  totaal: { nl: 'Totaal', en: 'Total', it: 'Totale' },
  telefoonOngeldig: {
    nl: 'Vul een telefoonnummer in waarop we je kunnen bereiken.',
    en: 'Enter a phone number we can reach you on.',
    it: 'Inserisci un numero a cui possiamo raggiungerti.',
  },
  naamOngeldig: {
    nl: 'Vul de naam in waarop de bestelling klaarstaat.',
    en: 'Enter the name the order will be waiting under.',
    it: 'Inserisci il nome con cui ritiri l’ordine.',
  },
  bestellingNummer: { nl: 'Bestelnummer', en: 'Order number', it: 'Numero d’ordine' },
  tijdvakVol: { nl: 'vol', en: 'full', it: 'esaurito' },
  nogTeKiezen: { nl: 'Nog te kiezen', en: 'Still to choose', it: 'Ancora da scegliere' },
  verstuurWhatsapp: { nl: 'Stuur via WhatsApp', en: 'Send via WhatsApp', it: 'Invia su WhatsApp' },
  verstuurMail: { nl: 'Stuur per e-mail', en: 'Send by e-mail', it: 'Invia per e-mail' },
  afhalenBetalen: {
    nl: 'Betalen doe je bij het afhalen. Je bestelling staat pas echt klaar als wij hem bevestigd hebben.',
    en: 'You pay when you collect. Your order is only really set once we’ve confirmed it.',
    it: 'Si paga al ritiro. L’ordine è davvero fissato solo dopo la nostra conferma.',
  },
  verstuurBestelling: { nl: 'Bestelling versturen', en: 'Send order', it: 'Invia l’ordine' },
  versturenBezig: { nl: 'Versturen…', en: 'Sending…', it: 'Invio…' },
  bestellingGelukt: {
    nl: 'Genoteerd. Tot straks.',
    en: 'Noted. See you soon.',
    it: 'Segnato. A presto.',
  },
  bestellingGeluktUitleg: {
    nl: 'Je krijgt een bevestiging op het nummer dat je hebt opgegeven. Betalen doe je aan de toonbank.',
    en: 'You’ll get a confirmation on the number you gave us. You pay at the counter.',
    it: 'Riceverai una conferma al numero che hai indicato. Si paga al banco.',
  },
  bestellingMislukt: {
    nl: 'Versturen lukte niet.',
    en: 'Sending failed.',
    it: 'Invio non riuscito.',
  },
  bestellingMisluktUitleg: {
    nl: 'Er ging iets mis onderweg. Probeer het opnieuw, of bel de winkel even — je keuze blijft hieronder staan.',
    en: 'Something went wrong on the way. Try again, or give the shop a call — your choices stay below.',
    it: 'Qualcosa è andato storto. Riprova, oppure chiama il negozio: le tue scelte restano qui sotto.',
  },
  opnieuwProberen: { nl: 'Opnieuw proberen', en: 'Try again', it: 'Riprova' },
  ofViaWhatsapp: { nl: 'Of stuur via WhatsApp', en: 'Or send via WhatsApp', it: 'Oppure invia su WhatsApp' },
  ofViaMail: { nl: 'Of per e-mail', en: 'Or by e-mail', it: 'Oppure per e-mail' },
  afhalenKanalen: {
    nl: 'Liever zelf versturen? Dan gaat dezelfde bestelling mee als bericht.',
    en: 'Rather send it yourself? The same order goes along as a message.',
    it: 'Preferisci inviarlo tu? Lo stesso ordine parte come messaggio.',
  },
  nogEenBestelling: { nl: 'Nog een bestelling', en: 'Another order', it: 'Un altro ordine' },

  // ---------- het bericht dat de winkel binnenkrijgt ----------
  berichtKop: { nl: 'Afhaalbestelling', en: 'Pickup order', it: 'Ordine da ritirare' },
  berichtBestelling: { nl: 'Bestelling', en: 'Order', it: 'Ordine' },
  berichtOphalen: { nl: 'Ophalen', en: 'Collection', it: 'Ritiro' },
  berichtKlant: { nl: 'Klant', en: 'Customer', it: 'Cliente' },
  berichtSmaken: { nl: 'Smaken', en: 'Flavours', it: 'Gusti' },
  berichtSlot: {
    nl: 'Betalen bij het afhalen.',
    en: 'Payment on collection.',
    it: 'Si paga al ritiro.',
  },
  bevestigingKop: {
    nl: 'Bedankt voor je bestelling.',
    en: 'Thank you for your order.',
    it: 'Grazie per il tuo ordine.',
  },
  bevestigingKlaar: {
    nl: 'We zetten hem klaar voor',
    en: 'We’ll have it ready for',
    it: 'La prepariamo per',
  },

  // ---------- over ons ----------
  navOverOns: { nl: 'Over ons', en: 'About us', it: 'Chi siamo' },
  overEyebrow: { nl: 'Wie er achter staat', en: 'Who’s behind it', it: 'Chi c’è dietro' },
  overKop: {
    nl: 'De recepten van Nonna, in Amsterdam-West.',
    en: 'Nonna’s recipes, in Amsterdam West.',
    it: 'Le ricette della nonna, ad Amsterdam Ovest.',
  },
  overLead: {
    nl: 'Een klein familiebedrijf aan de Kinkerstraat. Twee mensen, één machine, en recepten die niet uit een boek komen.',
    en: 'A small family business on Kinkerstraat. Two people, one machine, and recipes that didn’t come out of a book.',
    it: 'Una piccola impresa di famiglia in Kinkerstraat. Due persone, una macchina, e ricette che non vengono da un libro.',
  },
  overVerhaalKop: {
    nl: 'Het begint bij haar.',
    en: 'It starts with her.',
    it: 'Comincia da lei.',
  },
  overVerhaalLead: {
    nl: 'Nonna schreef niets op. Wat we maken is wat zij voordeed: proeven, bijstellen, nog eens proeven. Dat is ook waarom er twaalf smaken staan en niet dertig — meer krijg je op één ochtend niet goed.',
    en: 'Nonna never wrote anything down. What we make is what she showed us: taste, adjust, taste again. It’s also why there are twelve flavours and not thirty — you can’t get more than that right in one morning.',
    it: 'La nonna non ha mai scritto niente. Facciamo quello che ci ha mostrato: assaggia, aggiusta, riassaggia. È anche il motivo dei dodici gusti e non trenta: di più, in una mattina, non vengono bene.',
  },
  overWerkKop: {
    nl: 'Elke ochtend opnieuw.',
    en: 'Every morning, from scratch.',
    it: 'Ogni mattina, da capo.',
  },
  overWerkLead: {
    nl: 'De keuken zit achter de toonbank, dus wat je proeft is diezelfde ochtend gedraaid. Melk uit de buurt, pistache uit Sicilië, geen kleurstof en geen pasta uit een emmer. Dat je het ziet aan de kleur is precies de bedoeling.',
    en: 'The kitchen is right behind the counter, so what you taste was churned that same morning. Milk from nearby, pistachio from Sicily, no colouring and no paste out of a bucket. That you can see it in the colour is rather the point.',
    it: 'La cucina è dietro il banco: quello che assaggi è mantecato la mattina stessa. Latte di zona, pistacchio dalla Sicilia, niente coloranti e niente paste industriali. Che si veda dal colore è proprio il punto.',
  },
  overBuurtKop: {
    nl: 'En de buurt kwam langs.',
    en: 'And the neighbourhood turned up.',
    it: 'E il quartiere è arrivato.',
  },
  overBuurtLead: {
    nl: 'Wat begon als een gok op een winkelpand werd het vaste rondje na het eten. Pistache wordt in de reviews met stip het vaakst genoemd — 39 keer, meer dan elke andere smaak.',
    en: 'What started as a bet on an empty shop became the standing after-dinner walk. Pistachio leads the reviews by a mile — mentioned 39 times, more than any other flavour.',
    it: 'Quel che è iniziato come una scommessa su un negozio vuoto è diventato la passeggiata fissa dopo cena. Il pistacchio domina le recensioni: citato 39 volte, più di ogni altro gusto.',
  },
  overCijferSmaken: { nl: 'smaken in de vitrine', en: 'flavours in the cabinet', it: 'gusti al banco' },
  overCijferReviews: { nl: 'op Google', en: 'on Google', it: 'su Google' },
  overCijferBatch: {
    nl: 'keukens: één, achter de toonbank',
    en: 'kitchen: one, behind the counter',
    it: 'cucina: una, dietro il banco',
  },
  overAanvullenKop: {
    nl: 'Dit stukje moet van jullie komen.',
    en: 'This part has to come from you.',
    it: 'Questa parte deve arrivare da voi.',
  },
  overAanvullenLead: {
    nl: 'Wat hierboven staat is nagetrokken: het adres, de beoordeling, de smaken, de werkwijze uit jullie eigen berichten. Wat er nog niet staat zijn de namen van de eigenaren, het jaar van openen en uit welke streek de recepten komen. Dat verzin ik niet — geef het door en het staat er.',
    en: 'Everything above is checked: the address, the rating, the flavours, the way of working from your own posts. What isn’t here yet: the owners’ names, the year you opened, and which part of Italy the recipes come from. I won’t invent that — pass it on and it goes in.',
    it: 'Tutto quello che c’è sopra è verificato: indirizzo, valutazione, gusti, il modo di lavorare dai vostri post. Quello che manca: i nomi dei titolari, l’anno di apertura e da quale zona vengono le ricette. Non me li invento: ditemeli e li inserisco.',
  },

  // ---------- taart en cadeaubon (voorstel) ----------
  stapSoort: { nl: 'Wat wil je bestellen?', en: 'What would you like to order?', it: 'Cosa vuoi ordinare?' },
  soortBak: { nl: 'Bak ijs', en: 'Tub of gelato', it: 'Vaschetta di gelato' },
  soortBakUitleg: {
    nl: 'De Famiglia Pack, samengesteld met je eigen smaken.',
    en: 'The Famiglia Pack, filled with the flavours you pick.',
    it: 'Il Famiglia Pack, con i gusti che scegli tu.',
  },
  soortTaart: { nl: 'IJstaart', en: 'Gelato cake', it: 'Torta gelato' },
  soortTaartUitleg: {
    nl: 'Op bestelling opgebouwd, met een tekst erop als je wilt.',
    en: 'Built to order, with a message on top if you like.',
    it: 'Preparata su ordinazione, con una scritta se vuoi.',
  },
  soortBon: { nl: 'Cadeaubon', en: 'Gift card', it: 'Buono regalo' },
  soortBonUitleg: {
    nl: 'Een bedrag naar keuze, af te halen in de winkel.',
    en: 'An amount of your choosing, collected in store.',
    it: 'Un importo a scelta, da ritirare in negozio.',
  },
  voorstelKop: { nl: 'Voorstel', en: 'Proposal', it: 'Proposta' },
  voorstelUitleg: {
    nl: 'IJstaarten en cadeaubonnen staan nog niet op de kaart. Dit is een voorstel: de maten en de opzet staan klaar, de prijzen bepaalt de zaak.',
    en: 'Gelato cakes and gift cards aren’t on the menu yet. This is a proposal: the sizes and the flow are ready, the shop sets the prices.',
    it: 'Le torte gelato e i buoni regalo non sono ancora in menu. Questa è una proposta: misure e percorso sono pronti, i prezzi li decide il negozio.',
  },
  stapTaartmaat: { nl: 'Kies een maat', en: 'Choose a size', it: 'Scegli la misura' },
  stapBoodschap: { nl: 'Tekst erop', en: 'Message on top', it: 'Scritta sopra' },
  boodschapHint: {
    nl: 'Bijvoorbeeld een naam of een felicitatie. Laat leeg als je niets op de taart wilt.',
    en: 'A name or a greeting, for instance. Leave empty for no message.',
    it: 'Un nome o un augurio, per esempio. Lascia vuoto per non scrivere nulla.',
  },
  bonHint: {
    nl: 'Deze regel komt op de bon te staan.',
    en: 'This line goes on the card.',
    it: 'Questa riga finisce sul buono.',
  },
  personen: { nl: 'personen', en: 'people', it: 'persone' },
  stapBedrag: { nl: 'Kies een bedrag', en: 'Choose an amount', it: 'Scegli un importo' },
  vrijBedrag: { nl: 'Eigen bedrag', en: 'Other amount', it: 'Altro importo' },
  taartVooruit: {
    nl: 'Een ijstaart moet opgebouwd worden en hard worden, dus die maken we minstens twee dagen vooruit.',
    en: 'A gelato cake has to be built and set, so we make it at least two days ahead.',
    it: 'Una torta gelato va composta e fatta rassodare, quindi la prepariamo con almeno due giorni di anticipo.',
  },
  prijsVolgt: {
    nl: 'Prijs volgt van de winkel',
    en: 'Price to follow from the shop',
    it: 'Il prezzo arriva dal negozio',
  },

  stapGebak: { nl: 'Gebak erbij', en: 'Pastry alongside', it: 'Dolci in aggiunta' },
  stapGebakAlleen: { nl: 'Kies je gebak', en: 'Choose your pastry', it: 'Scegli i dolci' },
  soortGebak: { nl: 'Gebak', en: 'Pastry', it: 'Dolci' },
  soortGebakUitleg: {
    nl: 'Tiramisù, koekjes en cannoncini uit de vitrine.',
    en: 'Tiramisù, cookies and cannoncini from the cabinet.',
    it: 'Tiramisù, biscotti e cannoncini dal banco.',
  },
  gebakOptioneel: {
    nl: 'Optioneel — leg er iets bij voor onderweg of voor thuis.',
    en: 'Optional — add something for the walk home, or for later.',
    it: 'Facoltativo: aggiungi qualcosa per la strada o per dopo.',
  },
  prijsAanToonbank: { nl: 'prijs aan de toonbank', en: 'price at the counter', it: 'prezzo al banco' },
  meerVan: { nl: 'Eén meer', en: 'One more', it: 'Uno in più' },
  minderVan: { nl: 'Eén minder', en: 'One fewer', it: 'Uno in meno' },
  totaalDeels: {
    nl: 'plus wat de toonbank erbij rekent',
    en: 'plus whatever the counter adds',
    it: 'più quello che aggiunge il banco',
  },

  // ---------- dolci ----------
  dolciEyebrow: { nl: 'Naast het ijs', en: 'Beside the gelato', it: 'Accanto al gelato' },
  dolciKop: {
    nl: 'Dolci uit dezelfde keuken.',
    en: 'Dolci from the same kitchen.',
    it: 'Dolci dalla stessa cucina.',
  },
  dolciLead: {
    nl: 'Gebak, koffie en alles wat naast de vitrine staat. Dezelfde ochtend gemaakt, door dezelfde handen die het gelato draaien.',
    en: 'Pastry, coffee and everything that stands beside the cabinet. Made the same morning, by the same hands that churn the gelato.',
    it: 'Dolci, caffè e tutto quello che sta accanto al banco. Fatti la mattina stessa, dalle stesse mani che mantecano il gelato.',
  },
  dolciElkeOchtend: { nl: 'Elke ochtend', en: 'Every morning', it: 'Ogni mattina' },
  dolciKleinKop: {
    nl: 'Klein gebakken, snel op.',
    en: 'Baked in small batches, gone by evening.',
    it: 'Sfornati in piccole quantità, finiti in serata.',
  },
  dolciKleinLead: {
    nl: 'We bakken in kleine hoeveelheden, want dolci zijn op hun best op de dag zelf. Wat er ’s middags nog staat, staat er ’s avonds meestal niet meer.',
    en: 'We bake in small batches, because dolci are at their best on the day. What’s still there in the afternoon is usually gone by evening.',
    it: 'Inforniamo in piccole quantità: i dolci danno il meglio in giornata. Quel che c’è nel pomeriggio, la sera di solito è finito.',
  },
  dolciBelVandaag: {
    nl: 'Bel voor wat er vandaag is',
    en: 'Call to hear what’s in today',
    it: 'Chiama per sapere cosa c’è oggi',
  },
  dolciKaartKop: {
    nl: 'Wat er meestal staat.',
    en: 'What’s usually there.',
    it: 'Quello che di solito c’è.',
  },
  dolciKaartLead: {
    nl: 'De prijzen komen van onze eigen bestelkaart. De plek met streeppatroon staat nog open — daar hebben we nog geen foto van.',
    en: 'The prices come from our own order list. The striped place is still open — we don’t have a photo of that one yet.',
    it: 'I prezzi vengono dal nostro listino. Il posto a righe è ancora libero: di quello non abbiamo ancora una foto.',
  },
  dolciLetOpKop: {
    nl: 'Prijzen kloppen, allergenen nog niet.',
    en: 'Prices are right, allergens aren’t in yet.',
    it: 'I prezzi sono giusti, gli allergeni no.',
  },
  dolciLetOpLead: {
    nl: 'De prijzen hierboven zijn de tarieven van onze eigen bestelkaart. De allergeneninformatie staat er nog niet volledig in — vraag het aan de toonbank tot die hier staat.',
    en: 'The prices above are the rates from our own order list. Allergen information isn’t complete here yet — ask at the counter until it is.',
    it: 'I prezzi qui sopra sono quelli del nostro listino. Le informazioni sugli allergeni non sono ancora complete: chiedi al banco finché non lo saranno.',
  },
  dolciSlotKop: {
    nl: 'Neem een bak mee naar huis.',
    en: 'Take a tub home.',
    it: 'Porta a casa una vaschetta.',
  },
  dolciSlotLead: {
    nl: 'Dolci reizen prima, en gelato in een bak nog beter. Bestel vooruit en haal het op wanneer het jou uitkomt.',
    en: 'Dolci travel well, and gelato in a tub even better. Order ahead and collect it when it suits you.',
    it: 'I dolci viaggiano bene, il gelato in vaschetta ancora meglio. Ordina in anticipo e ritira quando vuoi.',
  },

  // ---------- 404 ----------
  nietGevondenKop: {
    nl: 'Deze pagina bestaat niet.',
    en: 'This page doesn’t exist.',
    it: 'Questa pagina non esiste.',
  },
  nietGevondenLead: {
    nl: 'Misschien is er iets verplaatst, of klopt de link net niet.',
    en: 'Something may have moved, or the link isn’t quite right.',
    it: 'Forse qualcosa è stato spostato, o il link non è esatto.',
  },
  naarHome: { nl: 'Naar de homepage', en: 'Back to home', it: 'Torna alla home' },

  // ---------- footer ----------
  footerTagline: {
    nl: 'De recepten van Nonna, elke ochtend vers gedraaid in Amsterdam.',
    en: 'Nonna’s recipes, churned fresh every morning in Amsterdam.',
    it: 'Le ricette della nonna, mantecate ogni mattina ad Amsterdam.',
  },
  footerVolgen: { nl: 'Volgen', en: 'Follow', it: 'Seguici' },
  footerBestellen: { nl: 'Bestellen', en: 'Order', it: 'Ordina' },

  // ---------- koffie ----------
  koffieEyebrow: { nl: 'Aan de bar', en: 'At the bar', it: 'Al bancone' },
  koffieKop: {
    nl: 'Koffie erbij, of erin.',
    en: 'Coffee beside it, or in it.',
    it: 'Caffè accanto, o dentro.',
  },
  koffieLead: {
    nl: 'Espresso zoals het hoort — kort, staand, en klaar voordat je zit. En voor wie niet kan kiezen tussen ijs en koffie: de affogato.',
    en: 'Espresso as it should be — short, standing, and done before you sit down. And for anyone torn between gelato and coffee: the affogato.',
    it: 'Espresso come si deve: corto, in piedi, finito prima di sederti. E per chi non sa scegliere tra gelato e caffè: l’affogato.',
  },
  koffieBand: {
    nl: 'Prijzen volgen zodra we het menubord scherp hebben',
    en: 'Prices follow as soon as we can read the board',
    it: 'I prezzi arrivano appena leggiamo il cartello',
  },
  koffieKaart: { nl: 'De kaart', en: 'The list', it: 'Il listino' },
  koffieVerder: { nl: 'Verder aan de bar', en: 'Also at the bar', it: 'Inoltre al bancone' },
  koffieNogInvullen: { nl: 'Nog invullen', en: 'Still to add', it: 'Da inserire' },
  koffiePrijzenKop: {
    nl: 'De prijzen staan op het bord in de winkel.',
    en: 'The prices are on the board in the shop.',
    it: 'I prezzi sono sul cartello in negozio.',
  },
  koffiePrijzenLead: {
    nl: 'Koffie staat niet op onze bestelkaart, en op de foto is het menubord te klein om de bedragen te lezen. Geef ze door en ze staan er meteen in — met een verkeerd bedrag is niemand geholpen.',
    en: 'Coffee isn’t on our order list, and the board is too small in the photo to read the amounts. Pass them on and they go straight in — a wrong price helps no one.',
    it: 'Il caffè non è nel nostro listino d’ordine e nella foto il cartello è troppo piccolo per leggere i prezzi. Comunicaceli e li inseriamo subito: un prezzo sbagliato non aiuta nessuno.',
  },
  extraThee: { nl: 'Thee', en: 'Tea', it: 'Tè' },
  extraChocolademelk: { nl: 'Warme chocolademelk', en: 'Hot chocolate', it: 'Cioccolata calda' },
  extraMuntthee: { nl: 'Verse muntthee', en: 'Fresh mint tea', it: 'Tè alla menta fresca' },
  extraFrisdrank: { nl: 'Frisdrank', en: 'Soft drinks', it: 'Bibite' },

  // ---------- aanbieding ----------
  aanbiedingEyebrow: { nl: 'Vaste combinaties', en: 'Set combinations', it: 'Combinazioni fisse' },
  aanbiedingKop: {
    nl: 'Meer dan één, voor minder.',
    en: 'More than one, for less.',
    it: 'Più di uno, per meno.',
  },
  aanbiedingLead: {
    nl: 'Vijf vaste combinaties van de kaart. Je kiest zelf de vullingen; de prijs staat vast.',
    en: 'Five set combinations from the menu. You pick the fillings; the price is fixed.',
    it: 'Cinque combinazioni fisse dal menu. I ripieni li scegli tu; il prezzo è fisso.',
  },
  aanbiedingKeuze: { nl: 'Kies uit', en: 'Choose from', it: 'Scegli tra' },
  aanbiedingStuks: { nl: 'stuks', en: 'pieces', it: 'pezzi' },
  aanbiedingPerStuk: { nl: 'per stuk', en: 'each', it: 'l’uno' },
  aanbiedingBezorgenKop: {
    nl: 'Bezorgen kan ook.',
    en: 'We deliver too.',
    it: 'Consegniamo anche.',
  },
  aanbiedingBezorgenLead: {
    nl: 'Bestellen loopt via Thuisbezorgd en Uber Eats. Of haal het zelf op — dan stel je je bak precies samen zoals je wilt.',
    en: 'Ordering runs through Thuisbezorgd and Uber Eats. Or collect it yourself — then you build your tub exactly as you like.',
    it: 'Gli ordini passano da Thuisbezorgd e Uber Eats. Oppure ritira di persona: così componi la vaschetta come vuoi.',
  },
  bestelThuisbezorgd: {
    nl: 'Bestel via Thuisbezorgd',
    en: 'Order on Thuisbezorgd',
    it: 'Ordina su Thuisbezorgd',
  },
  aanbiedingOokThuis: { nl: 'Ook thuis', en: 'At home too', it: 'Anche a casa' },
  dealsMeerEyebrow: { nl: 'Alleen in de winkel', en: 'In store only', it: 'Solo in negozio' },
  dealsMeerKop: {
    nl: 'De special offer hangt bij de deur.',
    en: 'The special offer is by the door.',
    it: 'L’offerta speciale è vicino alla porta.',
  },
  dealsMeerLead: {
    nl: 'Er is er altijd één die niet op de kaart staat. Kom langs, vraag ernaar, en je loopt met een zoete deal de deur uit.',
    en: 'There’s always one that isn’t on the list. Visit the store, ask for it, and you’ll leave with a sweet deal.',
    it: 'Ce n’è sempre una che non è in lista. Passa in negozio, chiedila, ed esci con un dolce affare.',
  },
  aanbiedingPrijsNoot: {
    nl: 'Prijzen van onze bestelkaart. Vraag in de winkel naar het afhaaltarief.',
    en: 'Prices from our order list. Ask in store about the collection rate.',
    it: 'Prezzi dal nostro listino. In negozio chiedi la tariffa per il ritiro.',
  },

  // ---------- reviews ----------
  reviewsBron: { nl: 'op Thuisbezorgd.nl', en: 'on Thuisbezorgd.nl', it: 'su Thuisbezorgd.nl' },
  reviewsAantal: { nl: 'beoordelingen', en: 'ratings', it: 'valutazioni' },
  reviewsPlaatshouder: {
    nl: 'De cijfers zijn echt; de woorden hieronder zijn nog van ons. Vervang ze door wat gasten zelf schreven.',
    en: 'The numbers are real; the words below are still ours. Replace them with what guests actually wrote.',
    it: 'I numeri sono veri; le parole qui sotto sono ancora nostre. Sostituiscile con quelle degli ospiti.',
  },

  // ---------- kaart en route ----------
  kaartOpenen: { nl: 'Open in Google Maps', en: 'Open in Google Maps', it: 'Apri in Google Maps' },
  kaartInteractief: {
    nl: 'Interactieve kaart met de locatie van Arte Vanilla aan de Kinkerstraat',
    en: 'Interactive map showing Arte Vanilla on Kinkerstraat',
    it: 'Mappa interattiva con la posizione di Arte Vanilla in Kinkerstraat',
  },
  buurt: { nl: 'Amsterdam-West', en: 'Amsterdam West', it: 'Amsterdam Ovest' },

  // ---------- smakenpagina: seo en filters ----------
  smakenSeo: {
    nl: 'Het gelato, sorbet, dolci en caff\u00e8 van Arte Vanilla. De vitrine wisselt dagelijks.',
    en: 'The gelato, sorbet, dolci and caff\u00e8 at Arte Vanilla. The cabinet changes daily.',
    it: 'Gelato, sorbetto, dolci e caff\u00e8 di Arte Vanilla. Il banco cambia ogni giorno.',
  },
  filterCategorie: {
    nl: 'Filter op categorie',
    en: 'Filter by category',
    it: 'Filtra per categoria',
  },

  // ---------- interface: navigatie, laden, fouten ----------
  hoofdmenu: { nl: 'Hoofdmenu', en: 'Main menu', it: 'Menu principale' },
  mobielMenu: { nl: 'Mobiel menu', en: 'Mobile menu', it: 'Menu mobile' },
  naarHoofdinhoud: {
    nl: 'Naar hoofdinhoud',
    en: 'Skip to main content',
    it: 'Vai al contenuto principale',
  },
  laden: { nl: 'Laden\u2026', en: 'Loading\u2026', it: 'Caricamento\u2026' },
  nietGevondenSeo: {
    nl: 'Deze pagina bestaat niet (meer).',
    en: 'This page does not exist (any more).',
    it: 'Questa pagina non esiste (pi\u00f9).',
  },
  foutEyebrow: { nl: 'Foutmelding', en: 'Error', it: 'Errore' },
  foutKop: { nl: 'Er ging iets mis', en: 'Something went wrong', it: '\u00c8 andato storto qualcosa' },
  foutDetail: {
    nl: 'Probeer de pagina opnieuw te laden.',
    en: 'Try reloading the page.',
    it: 'Prova a ricaricare la pagina.',
  },

  // ---------- alt-teksten ----------
  // Alt is tekst die iemand voorgelezen krijgt, dus hoort die net zo goed in
  // de taal van de pagina te staan als alles wat je wel ziet.
  altGevel: {
    nl: 'De gevel van Arte Vanilla met de gestreepte bankjes ervoor',
    en: 'The Arte Vanilla storefront with the striped benches outside',
    it: 'La facciata di Arte Vanilla con le panchine a righe davanti',
  },
  altGevelGasten: {
    nl: 'De gevel van Arte Vanilla met gasten op het bankje',
    en: 'The Arte Vanilla storefront with guests on the bench',
    it: 'La facciata di Arte Vanilla con clienti sulla panchina',
  },
  altPistache: {
    nl: 'Een bak pistachegelato op het streeppatroon van de zaak',
    en: 'A tub of pistachio gelato on the striped pattern of the shop',
    it: 'Una vaschetta di gelato al pistacchio sul motivo a righe del locale',
  },
  altTiramisu: {
    nl: 'Tiramis\u00f9 in potjes, met cacao bestoven',
    en: 'Tiramis\u00f9 in jars, dusted with cocoa',
    it: 'Tiramis\u00f9 in vasetto, spolverato di cacao',
  },
  altAffogato: {
    nl: 'Espresso wordt over een bol gelato geschonken',
    en: 'Espresso being poured over a scoop of gelato',
    it: 'Espresso versato su una pallina di gelato',
  },
  altWafel: {
    nl: 'Bakje gelato met een wafel erop',
    en: 'A cup of gelato with a wafer on top',
    it: 'Coppetta di gelato con una cialda sopra',
  },
} satisfies Record<string, Vertaald>

export type UiSleutel = keyof typeof ui
