# BL-036 punt 2 — inventaris verduidelijkingspopups

Twee soorten popup ontstaan bij overlappende plekken. Bron: `scripts/map-hit.js` (keuzevenster, `openMapPicker`) en `src/v2/scripts/05-app-kern.js` (`#romeLens`, "Vaticaanstad ligt binnen Rome"; de × en de buiten-tik zitten in `map-hit.js`).
Annuleren = × (44 px rechtsboven), Esc, tik buiten; het keuzevenster heeft daarnaast "Terug naar de kaart". Geen van deze roept `grade()` of `showLesson()` aan: geen fout, geen punt, de vraag blijft staan.
Test: `node --test scripts/popup-annuleren.test.mjs` (per geval: openen→annuleren met alle uitwegen = state/localStorage ongewijzigd en geen grade/les; openen→kiezen = normaal verwerkt).

| # | Popup | Modus | Wanneer | Kiezen doet | Test |
|---|---|---|---|---|---|
| 1 | Keuzevenster "Welke plek/rivier/gebied bedoel je?" | Ontdekken (Leren) | kaarttik met >1 kandidaat (`#map` click, capture) | `showLesson(item)` | ja |
| 2 | Keuzevenster | Aanwijzen | kaarttik, vraag open (`questionMode==='point'`, niet beantwoord) | `grade(ok,item)` | ja (Rome/Vaticaan via `romeHit` + andere overlap) |
| 3 | Keuzevenster | Oefenen (leerroute, aanwijsstap) | idem | `grade(...)` via routeflow | ja |
| 4 | Keuzevenster | Toets (aanwijsvraag) | idem, `state.mode==='exam'` | `grade(...)` (geen pizza) | ja |
| 5 | Keuzevenster via Rome-stip (`romeHit`, Enter/klik) | Aanwijzen, Oefenen, Toets | alleen bij open aanwijsvraag | `grade(...)` | ja (geval 2) |
| 6 | Rome-lens "Vaticaanstad ligt binnen Rome" | Ontdekken | tik/hover/focus op Rome-stip | `showLesson(Rome of Vaticaan)` | ja |
| 7 | Rome-lens | Leerroute, ontdekstap (`questionMode==='discover'`) | idem | niets (alleen uitleg) | ja |

Niet van toepassing: schrijfvragen (geen kaarttik), antwoord al gegeven (kaarttik wordt dan genegeerd, geen popup). Overlappende vormen zonder keuzevenster bestaan niet: elke kaarttik met >1 kandidaat opent geval 1–4.
