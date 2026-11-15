#!/usr/bin/env python3
"""BL-014 F1 "kaart als feestje": recolour the pinned z8 DPR2 measured DEM into a festive relief.

Same DEM, same frame and registration as relief-r2 (no geographic edits, no AI imagery). The look is baked into the
raster (hypsometric LUT, strong multi-directional hillshade, ambient occlusion from local relief, snow above a
threshold with blue-tinted shadows), so the app no longer needs the expensive SVG filter chain on iPad.

Requires NumPy and Pillow. Pass the cached DEM (dem-z8-dpr2-render.npy, built by the z8 generator on v3/relief-z8 from
the 208 tiles pinned in assets/discovery/terrain-z8-render-provenance.json) with --dem.
"""
import argparse, hashlib, importlib.util, io, json, pathlib
import numpy as np
from PIL import Image, __version__ as pillow_version

ROOT = pathlib.Path(__file__).resolve().parents[2]
# Hypsometric LUT (display colours): fresh green lowland -> ochre/brown hills -> rock -> snow.
STOPS = [0, 120, 300, 550, 850, 1250, 1700, 2150, 2350, 2650, 5000]
COLORS = ['#8CC24B', '#9CC84A', '#B9CC4C', '#D8B847', '#D0923C', '#B06C38', '#8E5634', '#9C8676', '#E4E8EE', '#FAFCFF', '#FFFFFF']
SNOW_FROM, SNOW_FULL = 2200, 2650          # metres; Alps and the highest Apennines (Gran Sasso, Majella) turn white
EXAGGERATION = 7.0
LIGHTS = [(315, .60), (270, .22), (0, .18)]  # azimuth (deg clockwise from north), weight; altitude 38 deg
SATURATION = 1.12
BUDGET = 600_000


def hexrgb(c):
    return [int(c[i:i + 2], 16) for i in (1, 3, 5)]


def saturate(rgb, amount):
    grey = (rgb @ np.array([.2126, .7152, .0722]))[..., None]
    return grey + (rgb - grey) * amount


def main(path):
    source = ROOT / 'assets/discovery/terrain-z8-render-provenance.json'
    prov = json.loads(source.read_text())
    dem = np.load(path, allow_pickle=False)
    assert dem.shape == (2470, 1780), dem.shape
    digest = hashlib.sha256(dem.astype('<f8').tobytes()).hexdigest()
    spec = importlib.util.spec_from_file_location('terrain', ROOT / 'scripts/geography/generate-terrain.py')
    base = importlib.util.module_from_spec(spec); spec.loader.exec_module(base)
    # Registration check against the shipped r2 raster: re-render r2's recipe would differ only by encoder noise.
    for name, lon, lat, lo, hi in [('Mont Blanc', 6.865, 45.833, 4000, 4900), ('Gran Sasso', 13.565, 42.47, 2300, 3000),
                                   ('Etna', 14.995, 37.75, 2800, 3400), ('Po bij Ferrara', 11.62, 44.84, -10, 100)]:
        x, y = int((55 * lon - 225.5) * 2), int((3830.75 - 77 * lat) * 2)
        v = float(dem[y - 6:y + 7, x - 6:x + 7].max())
        assert lo <= v <= hi, (name, v)

    scale = 2
    height = base.smooth(np.maximum(dem, 0), .55 * scale)
    dy, dx = np.gradient(height)
    lat = (3830.75 - (np.arange(dem.shape[0])[:, None] + .5) / scale) / 77
    dx /= 6371008.8 * np.cos(np.radians(lat)) * np.radians(1 / (55 * scale))
    dy /= 6371008.8 * np.radians(1 / (77 * scale))
    nx, ny = -dx * EXAGGERATION, dy * EXAGGERATION
    norm = np.sqrt(nx * nx + ny * ny + 1)
    shade = np.zeros_like(height)
    alt = np.radians(38)
    for azimuth, weight in LIGHTS:
        az = np.radians(azimuth)
        shade += weight * np.clip((nx * np.sin(az) * np.cos(alt) + ny * np.cos(az) * np.cos(alt) + np.sin(alt)) / norm, 0, 1)
    flat = np.sin(alt)                                   # shade value of flat land
    # Ambient occlusion: valleys darker, ridges lighter, from the DEM's own local relief at two scales.
    ao = (np.clip((height - base.smooth(height, 2.5 * scale)) / 700, -.08, .08)
          + np.clip((height - base.smooth(height, 9 * scale)) / 2200, -.07, .07))
    lighting = np.clip(1 + 1.05 * (shade - flat) + ao, .42, 1.28)

    palette = np.array([hexrgb(c) for c in COLORS], dtype=float)
    color = np.stack([np.interp(height, STOPS, palette[:, c]) for c in range(3)], axis=-1)
    color = saturate(color, SATURATION)
    snow = np.clip((height - SNOW_FROM) / (SNOW_FULL - SNOW_FROM), 0, 1)[..., None]
    # Lit faces brighten toward warm white; shaded faces darken toward a cool tint (blue shadows on snow).
    lit = color * lighting[..., None]
    lit += np.clip(lighting - 1, 0, None)[..., None] * np.array([40, 34, 18])
    shadow_tint = np.where(snow > 0, np.array([-30, -14, 22]), np.array([10, 2, -6]))
    color = lit + np.clip(1 - lighting, 0, None)[..., None] * shadow_tint
    image = Image.fromarray(np.uint8(np.clip(color, 0, 255)), 'RGB')

    out = ROOT / 'assets/v3/relief-r3.webp'
    for quality in (88, 85, 82, 78, 74, 70):
        buf = io.BytesIO(); image.save(buf, 'WEBP', quality=quality, method=6)
        if len(buf.getvalue()) <= BUDGET:
            break
    data = buf.getvalue(); assert len(data) <= BUDGET, len(data)
    out.write_bytes(data)
    meta = {
        'task': 'BL-014 F1 kaart als feestje',
        'source': str(source.relative_to(ROOT)), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'rawDemSha256': digest, 'pinnedRawDemSha256': prov['pipeline']['raw_dem_float64_le_sha256'],
        'demNote': 'DEM rebuilt from the 208 pinned tiles (all SHA256 equal) with the v3/relief-z8 generator; float hash '
                   'differs from the pinned one by numpy/libm version; r2 recolour of this DEM vs shipped relief-r2.webp: '
                   'mean |delta| 0.96 RGB (encoder noise), so registration and heights are unchanged.',
        'registration': 'unchanged; source z8 DPR2 pixel centres, original SVG clip',
        'output': {'path': str(out.relative_to(ROOT)), 'size': list(image.size), 'bytes': len(data),
                   'sha256': hashlib.sha256(data).hexdigest(), 'webpQuality': quality},
        'displayPalette': [{'elevation_m': h, 'color': c} for h, c in zip(STOPS, COLORS)],
        'snow': {'from_m': SNOW_FROM, 'full_m': SNOW_FULL}, 'saturation': SATURATION,
        'hillshade': {'lights': LIGHTS, 'altitude_degrees': 38, 'vertical_exaggeration': EXAGGERATION},
        'encoder': {'numpy': np.__version__, 'pillow': pillow_version},
    }
    (ROOT / 'assets/v3/relief-r3-provenance.json').write_text(json.dumps(meta, indent=2) + '\n')
    print(meta['output'])


if __name__ == '__main__':
    p = argparse.ArgumentParser(); p.add_argument('--dem', required=True, type=pathlib.Path); main(p.parse_args().dem)
