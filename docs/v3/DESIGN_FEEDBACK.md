# V3 — ontwerpfeedback van de eigenaar

Design Taste-protocol: elke correctie krijgt een categorie (lay-out, identiteit, hiërarchie, inhoud, interactie, motion) en een plek waar de les blijft (regel, token, check of Golden Screen). Komt dezelfde correctie twee keer terug, dan wordt ze een incident en gaat de fix in de regel of check, niet alleen in het scherm.

| Datum | Scherm | Correctie | Categorie | Vastgelegd in |
| --- | --- | --- | --- | --- |
| 2026-11-09 | Reis v1 | Gestapelde kaarten met route-iconen voelden als V2; richting = de concepten: zijbalk · lijst · kaart · één actie | lay-out, hiërarchie | DESIGN_SYSTEM V3 › Structuur |
| 2026-11-09 | alle | Principe: geen taglines, hulpteksten of bijlabels; anders klopt de lay-out niet | inhoud | DESIGN_SYSTEM V3 › Principe; QA-check op nog te bouwen tekstbudget |
| 2026-11-09 | alle | Kleur per land (Italia nu, later Frankrijk) in plaats van één accent | identiteit | DESIGN_SYSTEM V3 › Landthema's; `data-theme` |
| 2026-11-09 | Reis | Schoolkaart blijft basis; reliëf als schakelaar gewenst | inhoud, interactie | DESIGN_SYSTEM V3 › Kaart |
| 2026-11-09 | Reis v3b | Rand-fade niet te sterk: referentiekader (buurlanden, zeeën) is nodig om te leren | lay-out, inhoud | DESIGN_SYSTEM V3 › Kaart (kaderregel); check `mapFrameShort` in `qa-v3-reis.py`; verwerkt 9-11 |
| 2026-11-09 | Les (GE01) | Lesstappen boven de kaart (topo-ui-design, PR #64) | hiërarchie | DESIGN_SYSTEM V3 › Les; check `stepsRight` in `qa-v3-les.py` |
| 2026-11-09 | Beloningen | Boek in V3-stijl? Gekozen: B, rustig kader en rijk renaissance-boek; niet het donkere venster (A) of vlak modern (C) | identiteit, lay-out | DECISIONS 9-11 › Beloningen; DESIGN_SYSTEM › Beeld |
| 2026-11-09 | alle | Het renderniveau is het doel; nieuw artwork is dat waard | identiteit, beeld | DECISIONS 9-11 › Renderniveau; docs/v3/ARTWORK_BRIEF.md |
| 2026-11-09 | alle | Renderniveau: app zweeft boven landschap, levend reliëf, rijke hoofdstukbeelden | identiteit, beeld | DECISIONS › Renderniveau; ARTWORK_BRIEF; stijlbeeld `docs/qa/v3-stijlbeeld` (oordeel open) |
| 2026-11-09 | iconen | Gele scooter? Nee: één rode Vespa (die van Nino); staat via kleur of grijs. Idee: gouden Vespa als eindbeloning bij 11× goud, naast Esploratore d'oro | identiteit | idee, nog niet besloten; brief › Iconen |
| 2026-11-09 | iconen | Pizzapunt voor tellers (eenheid = punt), hele pizza voor meter en Beloningen | inhoud | ARTWORK_BRIEF › Iconen |
| 2026-11-09 | artwork | Alle drie de achtergronden houden; visueel top gaat voor grootte | beeld | DECISIONS 9-11 › Artwork kwaliteit |
| 2026-11-09 | artwork | Shirtvariatie van Nino per scène is acceptabel; portret moet exact | identiteit | ARTWORK_BRIEF › Vaste regels |
| 2026-11-10 | alle (V3.0) | **Incident, tweede keer:** schermen ogen niet als de render; geen artwork, ondoorzichtige plaat, saaie formulieren, zwakke typografie en knoppen | identiteit, lay-out, beeld | docs/v3/DESIGN_AUDIT_V3_0.md; eerst een render per scherm plus een vergelijkingscheck; nieuwe QA-checks (achtergrond, plaatbreedte, kaartrand) |
| 2026-11-10 | Les | Les moet zijn: kaart op de voorgrond boven het artwork, niet de beige focusmodus | lay-out, beeld | DESIGN_AUDIT › Les |
| 2026-11-10 | Schoolkaart | Buurlanden horen in landkleur, niet in zeekleur | inhoud | DESIGN_AUDIT; geometrie- of stijlcheck op fill van buurlanden |
| 2026-11-10 | Reliëf | Witte waas over het reliëf; moet volle kracht en een scherpe kust hebben | beeld | DESIGN_AUDIT › Reliëf; check op kaartrand-opacity |
| 2026-11-10 | Beloningen | Losse knop Open Reisboekje dubbel (het boek is de knop); pizza's boven de Vespa; uitlijning artwork op de eerste pagina | interactie, lay-out | DESIGN_AUDIT › Beloningen |
| 2026-11-10 | Voortgang | Hoofdstukken met ✓ en ★ ogen goedkoop; graag zoals de rijen in de render | beeld | DESIGN_AUDIT › Voortgang |
| 2026-11-10 | alle | Twijfel terracotta tegenover paars; advies: violet als basis, land als accent | identiteit | besluit eigenaar open |
| 2026-11-10 | alle (fase B) | Opbouw klopt; de build oogt melkig, dun en klein naast de doelbeelden. Oorzaak: wash, glasdekking, typeschaal en kaartgrootte (de verfijning schoot door) | identiteit, hiërarchie | renders/README › Afwerking na fase B; checks op tekst ≥ 13 px en kaart ≥ 45% |
| 2026-11-15 | Reis (iMac) | Wordmark TOPO dikker (zo dik als de titel "Reis"); actief menu-item vetter; tandwiel lijkt scheef; alle menu-iconen nalopen | identiteit, hiërarchie | BL-017 |
| 2026-11-15 | Reis | Nino-aviator groter, in een ontdekkende houding: vol bewondering omhoog kijkend | beeld | BL-017 (artwork) |
| 2026-11-15 | Reis-kaart | Iconen te klein op iMac; sommige kaarten bijna leeg, sommige iconen op elke kaart; hover: iets groter plus label. In plaats van placeholders genummerde punten, gekleurd naar beheersing (wit → donkerviolet) | interactie, inhoud | BL-014 F4 |
| 2026-11-15 | Reis-kaart | Actief hoofdstuk boven de kaart: violet label, naam vet, violette voortgangsbullets met lijntje, een echte knop om het hoofdstuk te kiezen | hiërarchie | BL-014 F4 |
| 2026-11-15 | Schoolkaart | Land lichter: terracotta overheerst, te weinig contrast met gebieden, bergen en rivieren | beeld | BL-014 F2 |
| 2026-11-15 | Landen, Zeeën, Rivieren | Buurlanden in grijzere mist met violet-lavendel rand; zeeënkaart groter (niet alle landen nodig); kleuren lichter, lavendel | beeld, lay-out | BL-014 F2 |
| 2026-11-15 | alle | **Incident, derde keer** (eerder 10-11): te veel ondoorzichtige mistplaten (Reis-steden, Oefenen, Toets = één grote mistplaat, Beloningen, Voortgang). Beeld verschilt per achtergrond. Regel: glas alleen waar invoer duidelijkheid vraagt, en naar beneden toe verloopt het naar transparant. Zijbalk boven matglas en onder transparant, met het tandwiel zichtbaar | identiteit, lay-out | BL-016: regel in `scripts/v3/glas2.css`, check `node scripts/qa-v3-glas2.mjs` (alfa onderaan ≤ 0,45, zijbalk open, AA op BG-01/02/03) |
| 2026-11-15 | Hoofdstuk/Les | Beloning (pizza op plank) niet geïntegreerd: de hele route in mist tonen (3 pizza's + Vespa), en die wordt helderder naarmate de voortgang groeit | hiërarchie, beeld | BL-018 |
| 2026-11-15 | Beloningen | Reisboekje opent onderaan in plaats van in het midden | lay-out | BL-018 |
| 2026-11-15 | Oefenen/Les | Antwoordpaneel groeit mee met het scherm (±80% op een 27"-iMac): maximale breedte | lay-out | BL-018 |
| 2026-11-15 | Instellingen | Hover op knoppen (subtiel) en een klikbevestiging | interactie, motion | BL-017 |
| 2026-11-15 | Reis | Besluit: desktop lijst links van de kaart (render Ontdekken); iPad lijst als sheet achter een knop; titel "Reis" mag weg voor schermruimte; transparant boven een gelijk beeld | lay-out | BL-016b (vervolg) |
| 2026-11-15 | Reis | G1 GO op BL-016d: zwevende panelen in één helder glas, kaart vrij op een verzadigde scène, Reis = overzicht + hoofdstukpagina, artwork 16:9 | lay-out, identiteit | Golden Screen voor alle schermen (BL-016e) |
| 2026-11-15 | Beloningen (iPad) | Het boek is van vorm veranderd: 5% smal getrokken (object-fit fill) | beeld | BL-022 |
