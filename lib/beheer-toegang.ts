/**
 * Wie het beheerdocument op /beheer mag openen.
 *
 * Per persoon staat hier alleen een afdruk van het wachtwoord: PBKDF2-SHA256
 * met een eigen zout. Er staat nooit een wachtwoord in dit bestand, ook niet
 * versleuteld, en er valt uit een afdruk geen wachtwoord terug te rekenen.
 *
 * Waarom dit een TypeScript-bestand is en geen JSON: dit wordt geimporteerd
 * door de middleware, en die wordt door het platform gebundeld. Een
 * JSON-import hangt af van hoe die bundelaar is ingesteld, en dat is precies
 * het soort afhankelijkheid waar je bij een slot niet op wilt leunen. Een
 * gewone module werkt overal.
 *
 * Bijwerken doe je niet met de hand maar met:
 *   npm run beheer:login "Giulia" --beheerder
 *   npm run beheer:login "Simone" --weg
 *
 * Of vanuit het beheerdocument zelf, onder "Who can sign in". Hangt er een
 * sleutelopslag aan de site, dan geldt die wijziging meteen en gaat hij langs
 * dit bestand heen.
 *
 * Is deze lijst leeg, dan valt het slot terug op BEHEER_LOGINS of
 * BEHEER_WACHTWOORD uit de omgeving. Staat daar ook niets, dan gaat de deur op
 * slot en niet open.
 */

export type Login = {
  naam: string
  zout: string
  afdruk: string
  iteraties: number
  beheerder?: boolean
}

export const mensen: Login[] = []
