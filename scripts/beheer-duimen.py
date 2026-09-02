"""
Maakt de voorbeeldjes van de foto's voor het beheerdocument.

Waarom Python en niet node: Pillow doet dit in vier regels en levert een JPEG
van een paar kilobyte per foto. De 37 beelden van de site passen zo samen in
een bestand van ongeveer een halve megabyte, en dat kan als data-URI mee het
document in. Zonder voorbeeldjes moet de salon raden welke foto ze vervangt.

Waarom het resultaat in de repo staat en niet bij elke build wordt gemaakt: de
bouwmachine van Vercel heeft geen Pillow. Het JSON-bestand is dus onderdeel van
de broncode, net als de lettertypes. `scripts/beheer.cjs` roept dit script
alleen aan als er een voorbeeldje ontbreekt, en die build draait dan dus
lokaal.

Aanroepen doet beheer.cjs zelf; met de hand kan ook:

    python3 scripts/beheer-duimen.py public scripts/beheer-duimen.json pad [pad ...]
"""

from __future__ import annotations

import base64
import io
import json
import os
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    print("Pillow ontbreekt. Installeer met: python3 -m pip install pillow", file=sys.stderr)
    raise SystemExit(2)

BREEDTE = 240
KWALITEIT = 50


def duim(pad_op_schijf: str) -> str | None:
    """Een klein voorbeeldje als data-URI, of None als het beeld niet te lezen is."""
    try:
        with Image.open(pad_op_schijf) as beeld:
            beeld = beeld.convert("RGB")
            verhouding = BREEDTE / beeld.width
            hoogte = max(1, round(beeld.height * verhouding))
            klein = beeld.resize((BREEDTE, hoogte), Image.LANCZOS)
            buffer = io.BytesIO()
            klein.save(buffer, format="JPEG", quality=KWALITEIT, optimize=True)
    except Exception as fout:  # een kapot of onbekend bestand mag de bouw niet stoppen
        print(f"overgeslagen: {pad_op_schijf} ({fout})", file=sys.stderr)
        return None
    return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode("ascii")


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__, file=sys.stderr)
        return 2

    publiek, uit, paden = sys.argv[1], sys.argv[2], sys.argv[3:]

    bestaand: dict[str, str] = {}
    if os.path.exists(uit):
        with open(uit, encoding="utf-8") as bestand:
            bestaand = json.load(bestand)

    gemaakt = 0
    for pad in paden:
        # De paden in de data beginnen met een schuine streep; op schijf staan
        # ze onder public/.
        op_schijf = os.path.join(publiek, pad.lstrip("/"))
        if not os.path.exists(op_schijf):
            print(f"ontbreekt: {op_schijf}", file=sys.stderr)
            continue
        klein = duim(op_schijf)
        if klein:
            bestaand[pad] = klein
            gemaakt += 1

    with open(uit, "w", encoding="utf-8") as bestand:
        json.dump(bestaand, bestand, indent=0, sort_keys=True)
        bestand.write("\n")

    print(f"{gemaakt} voorbeeldjes gemaakt of ververst.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
