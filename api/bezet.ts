/**
 * Welke tijdvakken al vol zitten.
 *
 * Nog zonder opslag: er is geen plek waar bestellingen worden bijgehouden, dus
 * antwoordt dit met een lege lijst en blijft alles kiesbaar. Zodra er een
 * database achter zit, komen hier de bezette tijden uit — het formulier leest
 * dit adres al uit.
 */
export async function GET() {
  return Response.json({ vol: [] })
}
