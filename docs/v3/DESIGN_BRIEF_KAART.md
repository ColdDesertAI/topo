# Designbrief BL-014: de kaart als feestje

Feedback van Dennis, 15-11. Contract: `ops/contracts/BL-014.md`.

## Feedback
De huidige reliëfkaart is saai en onaantrekkelijk, en icoontjes komen er slecht op uit. De kaart moet een feestje zijn om naar te kijken en moet uitnodigen tot leren.

**Referentie:** de renders van Dennis (Reis, Oefenen/Meren, Voortgang, Hoofdstukken) zijn de nieuwe Golden Screens voor de kaart. Ze komen in `docs/v3/renders/kaart/` (upload door Dennis; in de chat gedeeld op 15-11).

## Doel per aspect
1. **Grootte**: de kaart beslaat ±55–60% van het inhoudsvlak (nu ±45%) en is het grootste element.
2. **Reliëf**: sterke hillshade met hoogtekleuren: frisgroen laagland, dan oker/bruine heuvels, dan witte toppen in de Alpen en de hoogste Apennijnen. De verzadiging gaat omhoog.
3. **Eiland-effect**: een witte kustrand van 2–3 px en een zachte slagschaduw. De kaart ligt als een tegel op de scène.
4. **Water**: rivieren en meren helder blauw, en een lichte blauwe gloed langs de kust.
5. **Pins**: een violette druppelpin met een witte ring en schaduw, ±1,5× groter dan nu, met de punt exact op de coördinaat.
6. **Iconen en landmarks**: niet los op het reliëf. Alleen bij de actieve plek, als badge met een witte achtergrond en schaduw.
7. **Voortgang**: regio's in drie tinten violet (beheerst, bezig, nog niet) plus een legenda.
8. **Achtergrond**: BG-03 Kust blijft, zonder wash over de kaart. De kaart is het contrastrijkste vlak.

## Harde grenzen
- Echte geometrie (check 46/46), niets verschuiven.
- Tap-tolerantie is niet hetzelfde als de zichtbare vorm.
- Violet alleen gebruiken voor betekenis.
- Geheugenbudget van de iPad 9: het reliëf is één geoptimaliseerde WebP.
- Offline.
- AA-contrast.

## Acceptatie
- Een screenshot per scherm naast de render, een GO-voorstel van de design-critic en een visuele GO van Dennis (G1).
- De kaart beslaat ≥ 55% (gemeten op 1440×900 en 1080×810).
- 0 iconen op het reliëf zonder witte achtergrond.
- Het pinpunt ligt ≤ 2 px van de geprojecteerde coördinaat (alle 45).
- Geometrie 46/46, karakterisering groen, geen tekst < 13 px.

## Werkwijze
Begin met het reliëf (hoogtekleur-LUT, hillshade, sneeuw boven een drempel) en laat Dennis eerst een screenshot zien voordat er verder gebouwd wordt.
