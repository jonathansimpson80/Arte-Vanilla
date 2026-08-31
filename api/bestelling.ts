/**
 * Neemt een bestelling aan en stuurt hem door — de klant hoeft niets meer.
 *
 * Draait als serverloze functie op Vercel: het adres is `/api/bestelling` en
 * er hoeft niets voor te draaien of te worden onderhouden.
 *
 * Twee kanalen, allebei optioneel en los in te schakelen met omgevingsvariabelen
 * in Vercel (Settings → Environment Variables):
 *
 *   RESEND_API_KEY      e-mail via resend.com; zonder sleutel slaat mail over
 *   BESTEL_MAIL         waar de bon heen gaat (standaard info@jonathansimpson.nl)
 *   MAIL_VAN            afzender; moet een adres zijn op een domein dat bij
 *                       Resend geverifieerd is (standaard hun testafzender)
 *
 *   TWILIO_SID          WhatsApp via twilio.com; zonder deze drie geen appje
 *   TWILIO_TOKEN
 *   TWILIO_WHATSAPP_VAN bijv. whatsapp:+14155238886 (de Twilio-sandbox)
 *   BESTEL_WHATSAPP     waar het appje heen gaat (standaard +31629582729)
 *
 * Is er geen enkel kanaal ingesteld, dan zegt de functie dat eerlijk in plaats
 * van te doen alsof er iets verstuurd is: de site laat dan de knoppen zien
 * waarmee de klant de bon alsnog zelf kan sturen. Een bestelling die stil
 * verdwijnt is het enige wat echt niet mag.
 */

type Bestelling = {
  nummer?: string
  bericht?: string
  klant?: { naam?: string; telefoon?: string }
  [sleutel: string]: unknown
}

const MAIL_NAAR = process.env.BESTEL_MAIL ?? 'info@jonathansimpson.nl'
const MAIL_VAN = process.env.MAIL_VAN ?? 'Arte Vanilla <onboarding@resend.dev>'
const WHATSAPP_NAAR = process.env.BESTEL_WHATSAPP ?? '+31629582729'

/** Haalt de opmaaktekens van WhatsApp uit de tekst voor de e-mailversie. */
function alsTekst(bericht: string) {
  return bericht
    .replace(/^\*(.+)\*$/gm, (_, kop: string) => kop.toUpperCase())
    .replace(/^_(.+)_$/gm, '$1')
    .replace(/\*(.+?)\*/g, '$1')
}

async function stuurMail(bestelling: Bestelling) {
  const sleutel = process.env.RESEND_API_KEY
  if (!sleutel) return { kanaal: 'mail', gelukt: false, reden: 'geen RESEND_API_KEY' }

  const tekst = alsTekst(String(bestelling.bericht ?? ''))
  const antwoord = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sleutel}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_VAN,
      to: [MAIL_NAAR],
      subject: `Bestelling ${bestelling.nummer ?? ''} — ${bestelling.klant?.naam ?? 'Arte Vanilla'}`,
      text: tekst,
      // Antwoorden gaat naar de klant, niet naar de afzender van de site.
      reply_to: bestelling.klant?.telefoon ? undefined : undefined,
    }),
  })

  if (!antwoord.ok) {
    return { kanaal: 'mail', gelukt: false, reden: `resend ${antwoord.status}` }
  }
  return { kanaal: 'mail', gelukt: true }
}

async function stuurWhatsapp(bestelling: Bestelling) {
  const sid = process.env.TWILIO_SID
  const token = process.env.TWILIO_TOKEN
  const van = process.env.TWILIO_WHATSAPP_VAN
  if (!sid || !token || !van) {
    return { kanaal: 'whatsapp', gelukt: false, reden: 'geen Twilio-gegevens' }
  }

  const body = new URLSearchParams({
    From: van,
    To: `whatsapp:${WHATSAPP_NAAR}`,
    Body: String(bestelling.bericht ?? ''),
  })

  const antwoord = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
  )

  if (!antwoord.ok) {
    return { kanaal: 'whatsapp', gelukt: false, reden: `twilio ${antwoord.status}` }
  }
  return { kanaal: 'whatsapp', gelukt: true }
}

export async function POST(verzoek: Request) {
  let bestelling: Bestelling
  try {
    bestelling = await verzoek.json()
  } catch {
    return Response.json({ ok: false, reden: 'geen geldige json' }, { status: 400 })
  }

  if (!bestelling?.bericht || !bestelling?.klant?.naam) {
    return Response.json({ ok: false, reden: 'onvolledige bestelling' }, { status: 400 })
  }

  // Allebei tegelijk: een appje is het snelst, de mail is het bewijs.
  const uitslagen = await Promise.all([stuurMail(bestelling), stuurWhatsapp(bestelling)])
  const gelukt = uitslagen.some((u) => u.gelukt)

  return Response.json(
    { ok: gelukt, nummer: bestelling.nummer ?? null, kanalen: uitslagen },
    { status: gelukt ? 200 : 502 },
  )
}
