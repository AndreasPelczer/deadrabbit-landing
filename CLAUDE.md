# CLAUDE.md — Glanzgarage / RENT US

Website & Buchung für **RENT US Glanzgarage**, Kunde **Mike Knörzer**
(Am Karussell 4, 97280 Remlingen). Auftragnehmer: Andreas Pelczer (B.I.N.D.A. Verlag).
**Diese Datei wird von jeder Terminal-Sitzung automatisch gelesen — erst hier lesen, dann bauen.**
Zuerst außerdem: `docs/uebergaben/` (neueste zuerst) + `docs/alte-website-inventur.md`.

## Rolle
- **Andreas entscheidet.** **Falbe prüft** (Statik/QA). **Codi baut** (Implementierer — das bist du).
- Nichts geht live ohne Andreas' ausdrückliches „push live" / Go.

## Repos & Workflow
- **Glanzgarage** (`~/XcodeProjects/Glanzgarage`) = **Wahrheit / Quelle. Hier bauen.**
  `site/` = Website · `tools/3d-check/` = 3D-Check-Werkzeug · `docs/` = Doku + Übergaben.
- **deadrabbit-landing** (`~/XcodeProjects/deadrabbit-landing`) = **Deploy.**
  GitHub Pages → **live auf pelczer.de** (Push auf `main` = live). Live-Ordner: `rentus/`, `3d-check/`.
- **Ablauf:** in Glanzgarage bauen → nach deadrabbit-landing spiegeln
  (`site/`→`rentus/`, `tools/3d-check/`→`3d-check/`) → **beide** committen → pushen →
  **live per `curl` verifizieren.**
- **GitHub ist die einzige Wahrheit.** Sticks/externe Platten sind keine Repo-Heimat
  (Lehre 11.07.: leerer INTENSO-Mount). Kanonische Heimat: `~/XcodeProjects/`.
- ⚠️ `~/Documents` ist auf diesem Mac TCC-gesperrt (kein Terminal-Zugriff) — dort NICHT arbeiten.

## Hausregeln
- **Cache-Bump bei JEDER JS/CSS-Änderung:** `?v=` in allen Referenzen hochzählen (v=6, v=7 …).
- **Nach jedem HTML-Patch: Sektionszahl + ID-Liste gegen vorher diffen.**
  Prüfen, ob das **Alte noch da ist** — nicht nur, ob das Neue drin ist.
  (Falbe-Vorfall 11.07.: Patch-Regex fraß Galerie + Über-uns-Sektion.)
- **Echte Fotos, keine Stock-Behauptungen. Kennzeichen immer verpixeln. EXIF/GPS vor Upload strippen.**
- Muster vom Mitbewerber lernen ok — Grafiken/Code nie kopieren.
- **Jede Sitzung endet mit einer datierten Übergabe** in `docs/uebergaben/`.
- **Fertig = committet + gepusht + live per `curl` belegt.**

## Tabus (ohne Andreas-Go NICHT anfassen)
- **Preise** — inkl. offenem **Versiegelungs-Preiskonflikt** (Wachs/Teflon/Nano/Keramik/Graphen
  widersprechen sich alt↔neu, siehe Inventur) und **„Fauler Hund"** Preis/Turnus.
  Nicht raten — ein falscher ab-Preis ist eine Preisdiskussion mit jedem Kunden.
- **Launch auf `info-rentus.de`** (IONOS, nicht Strato). Vorher **BookingPress-Altbuchungen**
  klären (Export/Übernahme, dann abschalten).
- Strato/IONOS-Zugangsdaten fasst die KI nicht an.

## Offene Klärungen (Mike / Andreas)
Formspree-Code (Platzhalter `DEIN-FORMSPREE-CODE`) · Google-Bewertungslink (steht auf `#`) ·
Versiegelungs-Preisliste · Fauler-Hund-Konditionen · Detailtext-Übernahme aus der alten Seite.
Details: `docs/alte-website-inventur.md`.
