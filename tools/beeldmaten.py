"""Genereert WebP-varianten en meet elk beeld in public/media op.

Draaien na het toevoegen van een foto:
    python3 tools/beeldmaten.py
"""

from PIL import Image
import pathlib

media = pathlib.Path('public/media')
maten = {}

for jpg in sorted(media.glob('*.jpg')):
    im = Image.open(jpg).convert('RGB')
    im.save(jpg.with_suffix('.webp'), 'WEBP', quality=80, method=6)
    maten[f'/media/{jpg.name}'] = (im.width, im.height)

regels = ',\n'.join(f"  '{k}': [{b}, {h}]" for k, (b, h) in maten.items())
pathlib.Path('src/data/beeldmaten.ts').write_text(
    '/**\n'
    ' * Afmetingen van elk beeld in public/media, opgemeten bij het toevoegen.\n'
    ' *\n'
    ' * Hiermee kan <Foto> width en height meegeven en reserveert de browser de\n'
    ' * juiste ruimte voordat het beeld binnen is — anders springt de pagina onder\n'
    ' * je vingers weg tijdens het laden.\n'
    ' *\n'
    ' * Bijwerken met: python3 tools/beeldmaten.py\n'
    ' */\n\n'
    'export const beeldmaten: Record<string, [number, number]> = {\n' + regels + ',\n}\n'
)
print(f'{len(maten)} beelden bijgewerkt')
