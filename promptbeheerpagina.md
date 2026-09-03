# Opdracht: bouw het beheerdocument voor deze site

Bouw voor dit project hetzelfde beheerdocument als dat van MaaK: één HTML-bestand
waarin de salon elke tekst en elke foto van de site kan aanpassen, met de echte
pagina ernaast. Zelfde opzet, zelfde functies, maar met het merk van déze site,
uitgelezen uit deze codebase in plaats van overgetypt.

## De kernregel

Het document verandert de site niet zelf. Het verzamelt wat er moet veranderen en
levert één JSON-bestand met alleen de wijzigingen, en bij elke wijziging de taal,
de oude waarde en het bronbestand. Een tweede script zoekt die oude waarde in de code op
en zet de nieuwe ervoor in de plaats. Daardoor is terugplaatsen deterministisch en
hoeft het document niets van de code te weten behalve wat het gelezen heeft.

## Stap 0: eerst deze codebase uitlezen

Begin met rondkijken en schrijf op wat je vindt, voordat je iets bouwt:

1. Waar staan de teksten? Per bestand: welke exports, hoe de drie talen erin
   staan (`{ en, nl, it }` of iets anders), welke taal de basis is, en welke
   teksten eentalig zijn omdat ze in alle drie de talen hetzelfde zijn.
2. Waar staan de fotopaden, en hoe (los pad, srcset, poster bij een video).
3. Waar staat het merk: kleuren, lettertypes, woordmerk, tabbladicoon.
4. Welke pagina's en routes heeft de site, in de volgorde van het menu.
5. Waar staan de prijzen, en met welke sleutel per regel.
6. Waar staan de teksten voor zoekmachines en voor het deelbeeld.
7. Hoe wordt er gebouwd en gedeployd, en welke functies of middleware kan het
   platform draaien.

Wijkt de indeling af van MaaK, volg dan deze codebase en niet het voorbeeld. De
opzet hieronder is het doel; de paden erin zijn het voorbeeld.

## Drie talen

Deze site staat in het Engels, het Nederlands en het Italiaans. Dat is het enige
echte verschil met het voorbeeld, en het raakt bijna elk onderdeel. Houd je aan
deze regels:

* **Eén basistaal.** Zoek uit welke taal in deze codebase de bron is en welke twee
  vertalingen zijn. Zet die volgorde overal aan: in het scherm, in het bestand dat
  eruit komt en in het verslag. Verzin de volgorde niet per bestand opnieuw.
* **Een taal die je niet aanraakt blijft staan.** Verander je alleen het Engels,
  dan gaan het Nederlands en het Italiaans ongemoeid mee. Elke wijziging draagt
  daarom zijn eigen taal, en per taal een eigen oude waarde.
* **Een ontbrekende vertaling is geen fout.** Staat er in een van de drie talen
  niets, dan komt daar een leeg veld met de tekst uit de basistaal er grijs
  achter, zodat je ziet wat er zou moeten staan. Het uitleesscript slaat zo'n
  regel niet over en de teller telt hem als 'nog te vertalen'.
* **Toon de drie talen naast elkaar, niet onder elkaar.** Drie kolommen op een
  breed scherm, met de basistaal links en een duidelijk label boven elke kolom.
  Wordt het te smal, dan onder elkaar met hetzelfde label. Lange teksten krijgen
  een groter invoervak, en de drie vakken van één regel groeien samen mee zodat ze
  even hoog blijven.
* **Filter op wat nog niet vertaald is.** Een knop die alleen de blokken en velden
  toont waar een van de drie talen leeg is, en per blok een telling in de lijst
  links. Zonder dat filter is een gat in het Italiaans in honderden velden niet te
  vinden.
* **Zoeken doorzoekt alle drie de talen** en zegt in welke taal de treffer staat.
* **Italiaans zit vol apostrofs.** Dat maakt het terugzetten in de code gevoeliger
  dan bij MaaK: een apostrof kan in de bron als `\'` staan. Zorg dat het
  toepasscript beide vormen zoekt en de nieuwe tekst op dezelfde manier
  wegschrijft als hij hem gevonden heeft, en test dat expliciet met een Italiaanse
  zin met minstens twee apostrofs erin.
* **Eentalige teksten blijven eentalig.** Een naam, een merk of een adres dat in
  alle drie de talen hetzelfde is, staat één keer in het document met de
  aantekening dat hij overal geldt. Hem drie keer tonen levert drie wijzigingen op
  van dezelfde tekst, en dan mislukken de tweede en de derde.
* **De teksten voor zoekmachines en het deelbeeld** hebben ook drie talen, en de
  taalkeuze zelf (de knop in de balk, de namen van de talen) staat in het blok dat
  op elke pagina terugkomt.
* **Het scherm zelf is Engels.** De mensen die deze site beheren spreken Engels.
  Alles wat zij te zien krijgen is dus Engels: het beheerdocument, het inlogvenster,
  de melding na uitloggen, de knoppen, de uitleg per blok en elke foutmelding die
  op het scherm belandt. De kolomkoppen boven de drie talen heten English, Dutch
  en Italian. Zie de huisregels: de code eronder blijft Nederlands.
* Is niet uit de codebase op te maken welke taal de basis is, neem dan het Engels.

## Wat er moet komen

### 1. De inhoud uitlezen (`scripts/beheer-inhoud.cjs`)

Leest de hele site uit: elke zichtbare tekst en elke foto, met het bronbestand
erbij. Niet overtypen: de contentbestanden worden ter plekke naar JavaScript
vertaald met de TypeScript-compiler uit `node_modules` en uitgevoerd, zodat het
overzicht meeverandert met de site.

Let op deze dingen, die in het origineel stuk voor stuk een keer misgingen:

* Los imports tussen contentbestanden echt op, relatief vanaf de map van het
  bestand dat de import doet, en onthoud wat je al geladen hebt. Geef je elke
  import een leeg object, dan komen afgeleide teksten als 'plek voor undefined
  nieuwe gezichten' in het document dat naar de klant gaat.
* Wijzen contentbestanden door naar een map per salon of per merk, volg dan die
  wijzer: het document moet het bestand noemen waar de tekst écht staat, want
  daar gaat het toepasscript zoeken.
* Een contentbestand dat er niet meer is levert een lege module en een regel in
  het bouwverslag, geen harde fout.
* Een tekst die twee keer voorkomt (een export die een andere export citeert)
  hoort maar één keer in het document; anders mislukt de tweede bij terugzetten.
  Houd daar een lijstje echo's voor bij.
* Sleutels die techniek zijn en niet op het scherm staan (`href`, `src`, `id`,
  `slug`, maten, sleutels voor de kleurstand) worden overgeslagen.
* Functies die een naam of een dag invullen roep je aan met haken erin
  (`[naam]`, `[dag]`), zodat de klant de zin ziet zoals hij op het scherm staat.
* Video: één regel per fragment, met het stilstaande beeld alleen als
  voorbeeldje. Los te vervangen zou een still opleveren die niet bij de video
  hoort.
* Een srcset levert het grootste pad op, want dat is het bestand dat vervangen
  wordt.

Levert op: `teksten` (sleutel, de drie talen, bestand), `beelden` (sleutel,
pad, bestand, eventueel duim), plus twee wachtposten: welke bronbestanden ontbreken,
en welke met de hand overgetypte regels niet meer in de code staan. Houd het
lijstje overgetypte regels zo kort mogelijk.

### 2. De indeling (`scripts/beheer-modules.cjs`)

Eén lijst met pagina's (id, naam, route, uitleg) en één lijst met modules. Een
module is een blok zoals het op de site staat: id, pagina, titel, anker in de
HTML, volgorde, `plek` (waar op de pagina), `wat` (wat je hier aanpast) en
`sleutels`: de prefixen die bij dit blok horen. De eerste module die past wint,
dus de volgorde is de volgorde van de site.

Alles wat nergens in past valt in een module 'Nog niet ingedeeld' en wordt bij
het bouwen gemeld. Zo verdwijnt een nieuwe sectie nooit stilletjes uit het
document.

### 3. De gegevens in elkaar zetten (`scripts/beheer-bouw.cjs`)

Verdeelt teksten en beelden over de modules, maakt per behandeling en per
medewerker automatisch een eigen module, en geeft elk veld een leesbaar label:
niet `serviceDetails.balayage.items.2.title` maar 'stap 2 › titel'. Zet ook de
prijzen klaar als vlakke lijst met groep, de naam in de drie talen, de prijs en
de toelichting in de drie talen. De prijs zelf is een getal en heeft geen taal.

### 4. Het document bouwen (`scripts/beheer.cjs`)

Zet sjabloon, gegevens, lettertypes, woordmerk, tabbladicoon en de voorbeeldjes
van de foto's samen tot één HTML-bestand. Alles ingebakken als data-URI: het
document moet werken zonder internet en zonder map ernaast.

* Voorbeeldjes van foto's worden met Pillow gemaakt (breedte rond 240, kwaliteit
  rond 50) en liggen in een JSON-bestand in de repo, want de bouwmachine heeft
  geen Pillow. Ontbreekt er een, dan wordt hij er lokaal bij gemaakt; met
  `--ververs` opnieuw allemaal. Foto's die nergens meer gebruikt worden gaan
  eruit.
* De datum in het document is de dag in Amsterdam, niet in UTC.
* `</script>` mag niet letterlijk in het JSON-blok staan.
* Het script controleert dat elk gat in het sjabloon gevuld is en valt anders om.
* Het bouwverslag is voor jou en staat dus in het Nederlands. Het noemt: aantal
  modules, teksten, foto's en prijsregels, wat er per taal nog te vertalen is, wie
  het document mag openen, en de drie waarschuwingen (ontbrekende bronbestanden,
  overgetypte regels die niet meer kloppen, en wat er in 'Nog niet ingedeeld'
  viel).

### 5. Het merk, ingeladen vanaf deze site

Dit is het punt waarop je van het origineel afwijkt. Neem geen enkele kleur en
geen enkel lettertype over uit het MaaK-document. Haal ze uit deze codebase:

* De kleuren en de typografische schaal uit de stijlbestanden van de site, zodat
  het document er hetzelfde uitziet en meeverandert als daar iets wijzigt.
  Zet ze als variabelen boven in het sjabloon met een verwijzing naar het
  bronbestand erbij.
* Licht en donker allebei, met dezelfde waarden als de site, en de stand onthouden
  in de browser. Zet de stand vóór de eerste verf, anders flitst het document
  licht op bij het openen.
* De lettertypes: bak ze in als data-URI in een eigen CSS-bestand dat in de repo
  staat, met alleen de latijnse subsets. Een script dat dat bestand maakt hoort
  erbij, zodat het opnieuw kan als er een font wisselt.
* Het woordmerk uit het beeld van deze site, met een vaste naam. Ontbreekt het,
  dan komt het beginscherm zonder woordmerk in plaats van dat de bouw omvalt.
* Het tabbladicoon uit de favicon van de site.
* De naam van de site, de titel van het document en de tekst op het beginscherm
  komen uit de merkgegevens, niet uit een hardgecodeerde string.

### 6. Het scherm (`scripts/beheer-sjabloon.html`)

Eén bestand, gewone HTML en JavaScript, geen framework, geen bundel. Wat erin zit:

* **Kop**: naam van de site, zoekbalk over alle teksten in alle drie de talen,
  wie er is ingelogd, een teller die naar het overzicht van alle wijzigingen
  springt, een knop die alleen toont wat nog vertaald moet worden, licht en
  donker, en de knoppen om een eerder bestand te openen, in te dienen, uit te
  loggen en op te slaan. Alle opschriften in het Engels; kies daar zelf goede
  bewoordingen voor en houd ze kort.
* **Links**: de pagina's met daaronder de blokken, met een stip bij elk blok dat
  je hebt aangepast en een teken bij elk blok waar nog een vertaling ontbreekt.
* **Midden**: per blok waar het staat en wat je hier aanpast, dan de velden in drie
  kolommen, de basistaal links (verander je er één, dan blijven de andere twee
  zoals ze waren), de foto's met Vervangen en een loep om ze
  groot te zien, een prijstabel op de prijzenpagina, een vak 'Bestanden
  meesturen' en een notitieveld per blok.
* **Rechts**: een voorbeeldvenster met de echte site erin, dat naar de route en
  het anker van het geopende blok springt, met knoppen voor desktop, laptop en
  mobiel, terug, verversen en openen in een nieuw tabblad. Het venster staat uit
  tot je het aanzet, want het haalt de site van internet.
* **Beeldbank**: foto's en video meesturen zonder dat je al weet waar ze komen,
  met een notitie erbij.
* **Beginscherm**: wat dit is, zes stappen, de teksten van welke datum je voor je
  hebt, hoeveel er per taal nog te vertalen is, en de pagina's als kaarten.
* **Overzicht**: alles wat er in het bestand komt, per blok en per taal, met oud
  en nieuw naast elkaar en per regel terug te draaien.
* **Bestanden**: jpg, jpeg, png, svg, pdf, mov en mp4, tot 500 MB per stuk. Tot
  ongeveer 25 MB gaat het bestand mee in de JSON als data-URI; wat groter is
  wordt apart genoemd en moet los meegestuurd worden, met de naam en de maat in
  het overzicht.
* **Bewaren**: alles in de browser, zodat het werk blijft staan als het tabblad
  dichtgaat, met een duidelijke regel dat het pas veilig is als het is
  opgeslagen. Onthoud bij elke wijziging ook wat er stond toen hij gemaakt werd,
  zodat het toepasscript kan waarschuwen als de site er ondertussen anders uitziet.

### 7. Het bestand dat eruit komt

De salon slaat dit op, dus de bestandsnaam is Engels en draagt de datum, zoiets
als `<site>-changes-<datum>.json`. Binnenin staat een vast kenmerk waaraan het
toepasscript herkent dat het uit dit document komt; dat kenmerk verandert nooit.

Eén JSON met: naam van de site, wie het maakte, wanneer, de datum van het
document waarop het gemaakt is, en dan `teksten`, `beelden`, `prijzen`,
`bestanden`, `notities` en eventueel `toegang`. Bij elke tekst: sleutel, taal (een van de drie),
bronbestand, blok, label, de oude tekst in díe taal, de nieuwe tekst, en als de
site ondertussen veranderd is ook wat er stond toen de wijziging gemaakt werd.
Eén veld in drie talen aanpassen levert dus drie regels op, elk met hun eigen
oude waarde, want ze staan op drie verschillende plekken in de code.

### 8. Terugzetten in de code (`scripts/beheer-toepassen.cjs`)

Draait eerst als proefronde en schrijft pas iets weg met `--schrijf`.

* Zoekt de oude tekst op in het bestand dat het document noemt, en anders in de
  rest van de bron, want de code verandert onder het document door. Staat de
  tekst er twee keer, of in meerdere bestanden, dan blijft hij staan en wordt hij
  gemeld: dat doe je met de hand.
* Houdt rekening met een apostrof die in de code als `\'` staat. Bij het
  Italiaans is dat regel en geen uitzondering, dus dit is de eerste plek waar het
  misgaat als het niet klopt.
* Waarschuwt als een tekst in de ene taal wel is aangepast en in de andere twee
  niet, zonder het tegen te houden. Soms is dat de bedoeling, en soms is het
  vergeten.
* JSON-bestanden met toelichtingen erin worden niet opnieuw weggeschreven met
  `JSON.stringify`, maar per blok gezocht, zodat de indeling blijft staan.
* Prijzen: één behandeling is één regel, gezocht op zijn sleutel.
* Foto's worden niet zelf ingezet. Ze landen in `aangeleverd/`, en het verslag
  zegt welke breedtes er van de oude foto bestaan; die maak je opnieuw met het
  bestaande beeldscript. Eén foto vervangen is namelijk niet één bestand
  overschrijven.
* Waarschuwt als er een streepje als leesteken in een nieuwe tekst staat, in alle
  drie de talen. Dat is een huisregel van dit project.
* Het verslag toont per regel oud en nieuw, wat niet gelukt is en waarom, de
  foto's met hun breedtes, en de notities.

### 9. Het slot

* Het document wordt met de site meegebouwd en staat op `/beheer`, met
  `noindex` en `no-store`, en met een omleiding naar het HTML-bestand.
* Een slot op de rand vraagt om naam en wachtwoord. Alles wat daarbij op het
  scherm komt is Engels: het gebied waar de browser om vraagt, de melding na een
  verkeerd wachtwoord, de melding als de rem erop staat en de pagina na uitloggen. De lijst met mensen staat in
  de repo met per persoon alleen een afdruk: PBKDF2-SHA256 met een eigen zout.
  Geen wachtwoorden in de repo.
* Die lijst wordt niet met de hand bijgewerkt maar in het document zelf, onder
  'Wie mag erin', door een beheerder. Hangt er een sleutelopslag aan de site, dan
  geldt de wijziging meteen; zonder opslag gaat hij mee in het bestand en zet het
  toepasscript hem terug.
* Terugval zolang de lijst leeg is: een omgevingsvariabele met regels
  `naam:wachtwoord`, en anders één gedeeld wachtwoord. Staat er niets, dan gaat
  de deur op slot en niet open.
* Na tien verkeerde pogingen vanaf hetzelfde adres gaat die tien minuten dicht.
* Na het inloggen komt de naam in het document terecht, zodat in het bestand
  staat wie de wijzigingen maakte. Dat is een aanwijzing, geen bewijs.
* Een pad om uit te loggen dat altijd weigert, zodat de browser het onthouden
  wachtwoord weggooit.

### 10. Indienen in plaats van mailen

Twee serverfuncties, als het platform ze kan draaien:

* `beheer-inzending`: indienen mag iedereen die in de lijst staat; de lijst zien,
  ophalen, goedkeuren, afkeuren en weggooien mag alleen een beheerder. Een GET
  zonder wachtwoord zegt alleen hoeveel er klaarstaat, zodat de tab kan oplichten.
  Goedkeuren is niet live zetten: het betekent 'dit mag erin', en daarna haal je
  het er in één bestand uit.
* `beheer-toegang`: de lijst met logins lezen en bijwerken. Het wachtwoord gaat
  in de body en niet in de inlogkop, want die hoort bij `/beheer` en gaat niet
  vanzelf mee naar de functies. Wie de toegang verandert tikt zijn eigen
  wachtwoord nog een keer in.

Eén module voor het praten met de opslag, zodat beide functies dezelfde weg
gebruiken. Is er geen opslag gekoppeld, dan geeft die module leeg terug in plaats
van te struikelen en valt alles terug op wat er in de repo staat. Houd de
inzending onder de limiet van de opslag en geef daarboven een leesbare Engelse
melding in plaats van een fout uit de database. Dat geldt voor elke melding uit
deze twee functies die op het scherm kan belanden.

### 11. Aansluiten

* Het document meebouwen in het buildcommando, zodat het nooit achterloopt op de
  site, plus een los commando om er een bestand van te maken om te mailen.
* De omleiding, de koppen en de middleware in de configuratie van het platform.
* Documenteer in de README welke omgevingsvariabelen er nodig zijn en waar ze
  gezet moeten worden.

## Huisregels

* Twee talen, en de grens ligt bij wie het leest.
  **Nederlands** is alles wat Jonathan leest en onderhoudt: de code, de namen van
  variabelen en functies, de uitleg boven elk bestand, het commentaar, het
  bouwverslag en het verslag van het toepasscript.
  **Engels** is alles wat de salon leest: het beheerdocument van kop tot voet, het
  inlogvenster, de melding na uitloggen, en elke fout uit een serverfunctie die op
  het scherm terechtkomt. Ook de naam van het bestand dat de salon opslaat.
  Vertaal dus niet het hele project; vertaal de buitenkant.
* Geen streepje als leesteken, ook niet in reeksen. Niet in de code, niet in de
  Engelse schermteksten en niet in de drie talen van de site. Juist in het Engels
  is dat wennen, want een gedachtestreepje ligt daar voor de hand; gebruik een
  komma, een dubbele punt of een punt.
* Boven elk bestand een uitleg van een paar alinea's: wat het doet, waarom het zo
  is, en welke valkuil ertoe leidde. Bij een regel die tegenintuïtief is een
  toelichting erbij.
* Het document moet werken zonder internet: geen CDN, geen los mapje, geen
  bundel. Alleen het voorbeeldvenster haalt de site op, en dat staat standaard uit.

## Opleveren

Draai het bouwcommando en laat het verslag zien. Controleer daarna zelf:

1. Staat er niets in 'Nog niet ingedeeld'.
2. Zijn er geen ontbrekende bronbestanden en geen overgetypte regels die niet meer
   kloppen.
3. Klopt het aantal teksten en foto's ongeveer met wat de site heeft, en klopt de
   telling van wat er per taal nog te vertalen is.
4. Open het document, verander één tekst in alle drie de talen en één foto, sla op,
   en draai het toepasscript als proefronde: staan er precies drie tekstregels in,
   elk met de goede taal, de goede oude waarde en het goede bronbestand.
5. Doe hetzelfde met een Italiaanse zin met minstens twee apostrofs erin en kijk of
   hij ongeschonden in de code terechtkomt.
6. Doe daarna hetzelfde met `--schrijf` en kijk of de site het in alle drie de
   talen nog doet.
7. Loop het document van boven tot onder na op taal: staat er nergens meer een
   Nederlands woord op het scherm, inclusief het inlogvenster, de melding na
   uitloggen en de foutmeldingen uit de serverfuncties.
