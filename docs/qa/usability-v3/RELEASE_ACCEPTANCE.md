# BL-008 — Acceptatie na kindertest (V3)

**Dit document beoordeelt echte sessies, niet de gereedheid van dit protocol.** BL-008 = documentatie; uitvoering = BL-010, **pas na BL-029/G1** en op een vastgelegde V3-build. Afwezigheid van bevindingen is **nooit** bewijs van succes.

## Beslisregels

| Niveau | Voorbeeld | Gevolg |
| --- | --- | --- |
| **P0 — releaseblokker** | Kind kan niet starten of een hoofdstuk/les bereiken; kerntaak structureel onbedienbaar; vastlopen zonder herstel; aantoonbaar onjuiste geografie of beoordelingslogica die verkeerde kennis leert; verlies/corruptie van voortgang; privacy-/veiligheidsprobleem | **NO-GO** tot fix en her-test op gepinde build |
| **P1 — voor release oplossen of expliciet accepteren met herstelplan** | Meerdere kinderen vinden hoofdroute, voortgang, foutfeedback of beloningen niet zonder H1/H2; touch-target/overlap bemoeilijkt taak; leerstap begrijpelijk maar hulp vaak nodig; regressie op iPad | **CONDITIONAL GO** uitsluitend als kernroute zelfstandig werkt en eigenaar resterend risico, eigenaar issue en her-testdatum accepteert; anders NO-GO |
| **P2 — verbetering na release** | Cosmetiek, microcopy, lichte aarzeling met zelfstandig herstel, voorkeur voor een afbeelding | GO mogelijk met issue en prioriteit |

**Geen automatische P0 bij onbekende aardrijkskundige kennis.** KENNIS ≠ UX. Classificeer als **GEO/BEOORDELING** als de plek, raakzone of juist/fout-controle objectief niet klopt. Als oorzaak onzeker is: **ONBEKEND**, reproduceer vóór ernstbesluit. Een P0 kan ook bij slechts één kind aantoonbaar zijn (bijvoorbeeld verlies van opgeslagen voortgang).

## Minimale bewijsbasis en succes

- **2–3 afzonderlijke sessies**, circa 20 minuten, groep 7 (10–11), met gedateerde bladen, gepinde **V3-build SHA**, testcondities en toestemming. Minder dan 2 kinderen = **NO-GO voor learner-test-acceptatie** (protocol kan wel gereed zijn).
- Per kind moeten observeerbaar en als **Z / H1 / H2 / N / NT** gelogd zijn: starten, hoofdstuk kiezen, ontdekken, aanwijzen, naam schrijven, **fout en herstel** (indien natuurlijk optreedt; anders expliciete gecontroleerde poging na de hoofdroute), voortgang, beloningen en volgende actie. Gold is een optionele begripscheck; uitgebreide proef mag buiten deze 20 minuten.
- **Kernsucces:** minimaal **2 van 3 kinderen** (of **beide bij n=2**) bereiken zelfstandig (**Z**) het hoofdstuk en een les, begrijpen de overgang **Ontdekken → Aanwijzen → Namen schrijven**, kunnen na feedback verder en weten wat ze als volgende kunnen doen. Bij een kennistekort mag inhoudelijke juistheid ontbreken, mits de bediening en herstelroute zelfstandig begrijpelijk blijven. Bij een taak die niet bereikbaar is: **NT, geen succesclaim**.
- Voortgang en pizza/Vespa/Reisboekje: minimaal **2 van 3** (of beide bij n=2) vinden de plek **zonder H2**, kunnen in eigen woorden aangeven wat de status of beloning betekent; H1 apart rapporteren. Voorbereid beloningsprofiel moet als zodanig gemarkeerd zijn.
- **Geen open P0**; alle P1's hebben issue, eigenaar en expliciet besluit. Als de toets slechts één apparaat omvat: geen claim dat zowel desktop als iPad geslaagd is. Een iPad-release moet op een **echte iPad 9/Safari** worden nagekeken vóór G3, inclusief touch en toetsenbord.
- **Dekingsmatrix** bij de testnotities: curriculum **45 items / 11 hoofdstukken** gecontroleerd in build/config (niet individueel door kinderen doorlopen); de drie lesfasen, Gold, voortgang, Pizza/Vespa/Reisboekje en standalone **offline** gebruik elk **geverifieerd / faalt / niet geverifieerd**. Een gehoste URL alleen is geen offline bewijs. Als een essentieel pad onbeschikbaar/niet getest is: **CONDITIONAL GO of NO-GO** voor release afhankelijk van risico; nooit GO op onbekend.

## Findings → issues (geen IDs verzinnen)

Maak voor elke reproduceerbare bevinding één regel: `F-01 | kindcode | build SHA | hoofdstuk/item/fase | apparaat | verwacht → werkelijk | stappen | type | P0/P1/P2 | bestaand issue-ID of 'nieuw issue nodig' | eigenaar | her-test`.

Zoek vóór een nieuw issue naar bestaande issues voor **Rome–Vaticaanstad**, **Toscane (regio/stad)**, **Povlakte/rivier Po**, **Apennijnen**, **overlappende stippen/“Stip 1–2”**, plus bestaande iPad- en V3-aanwijsbugs. Koppel **alleen aan een bevestigd bestaand issue-ID**. **BL-008** = testvoorbereiding, **BL-010** = feitelijke kindertest, **BL-029** = onafhankelijke V3-bouwstroom; **BL-031/BL-032** blijven onaangeroerd.

## Beslisblad (invullen na echte test)

**Datum:** ___  **V3-build SHA:** ___  **n:** ___  **Desktop / iPad / offline getest:** ___  
**Zelfstandig kernpad:** ___ / ___  **Voortgang en beloningen zonder H2:** ___ / ___  
**P0 open:** ___  **P1 open:** ___  **P2:** ___  **Ongeteste functies/apparaten:** ___  
**Reproduceerbare issues (IDs):** ___  
**Risico's / eigenaar / her-testdatum:** ___

**Advies (kies één):** **GO / CONDITIONAL GO / NO-GO**  
**Reden met observatiebewijs:** ___  
**Reviewer UX:** ___  **Reviewer didactiek:** ___  **Reviewer engineering:** ___  **Onafhankelijke review uitgevoerd?** ja / nee (open)  
**G3/Hermes-status:** ___  **G4 (alleen eigenaar):** niet gevraagd / open / expliciet akkoord

**GO** alleen bij voldoende echte waarnemingen, gehaald kernsucces, geen P0 en afgedekte releasekritieke apparaat-/offlinecontroles. **CONDITIONAL GO** bij niet-kritieke P1 of dekkingsgaten met schriftelijk geaccepteerde mitigerende actie, her-test en eigenaar; is een aanbeveling, **geen toestemming tot productie**. **NO-GO** bij P0, onvoldoende kernsucces, ontbreken van de minimale sessies of ongecontroleerde kritieke functies. Alleen de eigenaar mag G4 vrijgeven.
