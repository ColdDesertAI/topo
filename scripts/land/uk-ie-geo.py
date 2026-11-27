#!/usr/bin/env python3
"""UK-01: Natural Earth 10m -> src/lands/uk-ie/geo.json (geprojecteerde SVG-geometrie + doelvormen).

Gebruik: python3 -I scripts/land/uk-ie-geo.py <map-met-NE-geojson> <uitvoer.json>
Bron: https://github.com/nvkelso/natural-earth-vector (public domain); bestanden en SHA256 staan in de uitvoer.
Zeezones en de Schotse Hooglanden heeft Natural Earth niet als vlak: die zijn hier met de hand begrensd
(lon/lat), daarna met land of met Schotland afgesneden, en gemarkeerd als `handmade`.
Vereist alleen bij genereren: shapely. De app leest uitsluitend de uitvoer.
"""
import hashlib, json, math, os, sys
from shapely.geometry import shape, Point, Polygon, MultiPolygon, LineString, MultiLineString, box
from shapely.ops import unary_union, transform

SRC, OUT = sys.argv[1], sys.argv[2]
FILES = ['ne_10m_admin_0_map_units.geojson', 'ne_10m_lakes.geojson', 'ne_10m_rivers_lake_centerlines.geojson']
LON0, LON1, LAT0, LAT1 = -11.4, 9.4, 49.3, 61.1
W = 1000.0
def merc(lat): return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
SX = W / math.radians(LON1 - LON0)
H = round((merc(LAT1) - merc(LAT0)) * SX, 1)
def proj(lon, lat): return (math.radians(lon - LON0) * SX, (merc(LAT1) - merc(lat)) * SX)
def P(g): return transform(lambda x, y, z=None: tuple(map(list, zip(*[proj(a, b) for a, b in zip(x, y)]))), g)

def load(name):
    p = os.path.join(SRC, name)
    return json.load(open(p)), hashlib.sha256(open(p, 'rb').read()).hexdigest()
units, h_units = load(FILES[0]); lakes, h_lakes = load(FILES[1]); rivers, h_riv = load(FILES[2])
EXT = box(LON0 - 0.6, LAT0 - 0.6, LON1 + 0.6, LAT1 + 0.6)
def unit(*gu):
    gs = [shape(f['geometry']) for f in units['features'] if f['properties']['GU_A3'] in gu]
    assert len(gs) == len(gu), gu
    return unary_union(gs).intersection(EXT)

SHEET = {'engeland': '#c9cde6', 'schotland': '#f3ebc0', 'wales': '#2f7d5b', 'noord-ierland': '#e8b9c2', 'man': '#e8b9c2'}
NEUTRAL = '#e4dfd1'
COUNTRY = {'engeland': ['ENG'], 'schotland': ['SCT'], 'wales': ['WLS'], 'noord-ierland': ['NIR'], 'ierland': ['IRL'],
           'nederland': ['NLX'], 'belgie': ['BFR', 'BWR', 'BCR'], 'duitsland': ['DEU'], 'frankrijk': ['FXX'],
           'denemarken': ['DNK'], 'noorwegen': ['NOW']}
geo = {k: unit(*v) for k, v in COUNTRY.items()}
geo['man'] = unit('IMN'); geo['kanaaleilanden'] = unit('JEY', 'GGY')
ctx = unit('LUX', 'SWE')
LAND = unary_union(list(geo.values()) + [ctx])

# Schotse eilanden: delen van de vorm van Schotland, gekozen op ligging
sc_parts = list(geo['schotland'].geoms)
mainland = max(sc_parts, key=lambda p: p.area)
def parts(fn): return unary_union([p for p in sc_parts if p is not mainland and fn(p.representative_point())])
skye = unary_union([p for p in sc_parts if p.contains(Point(-6.2, 57.35))])
geo['skye'] = skye
geo['shetland'] = parts(lambda c: c.y > 59.7)
geo['orkney'] = parts(lambda c: 58.6 < c.y < 59.5 and c.x > -3.6)
geo['hebriden'] = parts(lambda c: c.x < -5.55 and 55.5 < c.y < 58.6) .difference(skye)
# Schotse Hooglanden (handmade): Schots vasteland ten noordwesten van de Highland Boundary Fault (Helensburgh–Stonehaven)
hl = Polygon([(-4.95, 55.95), (-2.15, 56.95), (-1.5, 57.8), (-1.5, 59.0), (-6.5, 59.0), (-6.5, 56.0)])
geo['schotse-hooglanden'] = mainland.intersection(hl)
for k in ['skye', 'shetland', 'orkney', 'hebriden', 'schotse-hooglanden']:
    assert not geo[k].is_empty and geo[k].area > 0, k

# Wateren (handmade zones, afgesneden met land). Volgorde = voorrang bij overlap.
Z = {
 'straat-van-dover': [(0.95, 50.8), (1.75, 50.78), (2.3, 51.05), (1.6, 51.4), (1.15, 51.25)],
 'het-kanaal': [(-5.75, 48.4), (-5.75, 50.15), (-4.0, 50.6), (1.0, 51.05), (1.75, 50.78), (1.5, 49.6), (-1.8, 48.4)],
 'ierse-zee': [(-6.35, 52.15), (-5.15, 51.85), (-3.9, 52.6), (-2.8, 53.3), (-2.8, 55.05), (-5.0, 55.35), (-6.2, 55.35), (-6.3, 54.0)],
 'keltische-zee': [(-5.75, 48.4), (-9.6, 48.4), (-9.6, 51.5), (-8.0, 51.75), (-6.35, 52.15), (-5.15, 51.85), (-4.5, 51.5), (-5.75, 50.15)],
 'noordzee': [(1.15, 51.25), (1.6, 51.4), (2.3, 51.05), (4.0, 51.5), (9.6, 53.2), (10.5, 57.6), (8.0, 58.2), (5.5, 61.5),
              (-0.9, 61.5), (-1.0, 60.4), (-2.3, 59.4), (-3.1, 58.7), (-2.0, 57.0), (-3.5, 56.0), (-1.0, 54.0), (0.3, 52.0)],
 'atlantische-oceaan': [(-12.5, 48.0), (-9.6, 48.0), (-9.6, 51.5), (-8.0, 51.75), (-6.35, 52.15), (-6.3, 54.0), (-6.2, 55.35),
              (-5.0, 55.35), (-4.5, 56.5), (-4.0, 58.0), (-3.1, 58.7), (-2.3, 59.4), (-1.0, 60.4), (-0.9, 61.5), (-12.5, 62.0)],
}
LABEL = {'atlantische-oceaan': (-9.9, 56.6), 'noordzee': (3.0, 56.4), 'het-kanaal': (-2.6, 50.15), 'straat-van-dover': (1.55, 51.02),
         'ierse-zee': (-4.95, 53.9), 'keltische-zee': (-7.4, 50.7), 'theems': (0.2, 51.47), 'loch-ness': (-4.45, 57.25)}
taken = Polygon()
for k, ring in Z.items():
    z = Polygon(ring).intersection(box(LON0, LAT0, LON1, LAT1)).difference(LAND).difference(taken)
    taken = taken.union(z)
    geo[k] = z
    assert z.contains(Point(*LABEL[k])), ('label buiten zone', k)

thames = unary_union([shape(f['geometry']) for f in rivers['features'] if f['properties'].get('name') == 'Thames'])
ness = unary_union([shape(f['geometry']) for f in lakes['features'] if f['properties'].get('name') == 'Loch Ness'])
geo['theems'] = thames; geo['loch-ness'] = ness

CITIES = {  # lon, lat (centrum); land waarin de stip moet liggen
 'aberdeen': (-2.10, 57.15, 'schotland'), 'belfast': (-5.93, 54.60, 'noord-ierland'), 'birmingham': (-1.89, 52.48, 'engeland'),
 'bristol': (-2.59, 51.45, 'engeland'), 'cardiff': (-3.18, 51.48, 'wales'), 'cork': (-8.47, 51.90, 'ierland'),
 'dublin': (-6.26, 53.35, 'ierland'), 'edinburgh': (-3.19, 55.95, 'schotland'), 'glasgow': (-4.25, 55.86, 'schotland'),
 'hull': (-0.33, 53.74, 'engeland'), 'inverness': (-4.22, 57.48, 'schotland'), 'leeds': (-1.55, 53.80, 'engeland'),
 'liverpool': (-2.98, 53.41, 'engeland'), 'londen': (-0.13, 51.51, 'engeland'), 'manchester': (-2.24, 53.48, 'engeland'),
 'newcastle': (-1.61, 54.98, 'engeland'), 'norwich': (1.30, 52.63, 'engeland'), 'southampton': (-1.40, 50.91, 'engeland'),
}
for k, (lon, lat, c) in CITIES.items():
    assert geo[c].buffer(0.03).contains(Point(lon, lat)), ('stad buiten land', k, c)

TOL = 0.35  # px na projectie: vereenvoudiging
def r(v): return round(v, 1)
def rings(g):
    g = P(g).simplify(TOL, preserve_topology=True)
    polys = [g] if isinstance(g, Polygon) else [p for p in getattr(g, 'geoms', []) if isinstance(p, Polygon)]
    out = []
    for p in polys:
        if p.area < 0.6: continue  # kleiner dan ~1 px²
        out.append([[[r(x), r(y)] for x, y in p.exterior.coords]] + [[[r(x), r(y)] for x, y in i.coords] for i in p.interiors])
    return out
def lines(g):
    g = P(g).simplify(TOL)
    ls = [g] if isinstance(g, LineString) else list(g.geoms)
    return [[[r(x), r(y)] for x, y in l.coords] for l in ls]
def d_of(rs): return ''.join('M' + 'L'.join(f'{x} {y}' for x, y in ring[:-1]) + 'Z' for poly in rs for ring in poly)
def d_line(ls): return ''.join('M' + 'L'.join(f'{x} {y}' for x, y in l) for l in ls)

out = {
 'status': 'draft', 'land': 'uk-ie', 'contract': 'ops/contracts/UK-01.md',
 'projection': {'type': 'mercator', 'lon': [LON0, LON1], 'lat': [LAT0, LAT1], 'width': W, 'height': H},
 'sources': [{'file': f, 'sha256': h, 'url': 'https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/' + f,
              'license': 'public domain (Natural Earth)'} for f, h in zip(FILES, [h_units, h_lakes, h_riv])],
 'handmade': ['schotse-hooglanden', *Z.keys()],
 'base': {'sea': '#4fa3cf', 'neutral': NEUTRAL,
          'land': [{'id': k, 'd': d_of(rings(geo[k])), 'sheetFill': SHEET.get(k, NEUTRAL)} for k in [*COUNTRY, 'man', 'kanaaleilanden']]
                  + [{'id': 'context', 'd': d_of(rings(ctx)), 'sheetFill': NEUTRAL}],
          'thames': d_line(lines(thames)), 'ness': d_of(rings(ness)) or None},
 'targets': {},
}
for k, (lon, lat, c) in CITIES.items():
    x, y = proj(lon, lat); out['targets'][k] = {'kind': 'point', 'x': r(x), 'y': r(y), 'in': c}
for k in [*COUNTRY, 'man', 'kanaaleilanden', 'skye', 'shetland', 'orkney', 'hebriden', 'schotse-hooglanden', *Z]:
    rs = rings(geo[k]); assert rs, k
    lp = LABEL.get(k); lp = proj(*lp) if lp else P(geo[k]).representative_point().coords[0]
    if k in ('orkney', 'shetland', 'hebriden', 'man', 'kanaaleilanden'):  # label op het grootste deel
        big = max((p for p in ([geo[k]] if isinstance(geo[k], Polygon) else geo[k].geoms)), key=lambda p: p.area)
        lp = P(big).representative_point().coords[0]
    out['targets'][k] = {'kind': 'area', 'rings': rs, 'label': [r(lp[0]), r(lp[1])]}
out['targets']['theems'] = {'kind': 'line', 'lines': lines(thames), 'label': [r(v) for v in proj(*LABEL['theems'])]}
nr = rings(ness)
out['targets']['loch-ness'] = {'kind': 'line', 'lines': [[pt for pt in ring] for poly in nr for ring in poly[:1]] or lines(ness.boundary),
                               'label': [r(v) for v in proj(*LABEL['loch-ness'])]}
json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
print('geo.json', os.path.getsize(OUT), 'bytes; doelen', len(out['targets']), '; hoogte', H)
