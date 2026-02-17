# pelczer.de — B.I.N.D.A. Verlag

Portfolio & Landing Page für Andreas Pelczer.  
Koch · iOS-Entwickler · Autor.

## Projektstruktur

```
pelczer.de/
├── index.html                  # Landing Page (Mensch/Coder Toggle)
├── CNAME                       # GitHub Pages Custom Domain
├── README.md                   # Diese Datei
│
├── assets/
│   ├── css/
│   │   ├── variables.css       # Design Tokens (Farben, Fonts, Spacing)
│   │   ├── base.css            # Reset, Typografie, Basis-Styles
│   │   ├── components.css      # Wiederverwendbare Komponenten (Cards, Buttons, etc.)
│   │   ├── layout.css          # Grid, Container, Navigation, Footer
│   │   └── pages.css           # Seitenspezifische Styles (App-Pages, Book-Pages)
│   ├── js/
│   │   ├── main.js             # App Controller (Mode Toggle, Scroll Observer)
│   │   ├── router.js           # Shared Components Loader (Nav, Footer)
│   │   └── easter-egg.js       # Game of Life
│   └── images/
│       ├── apps/               # App Icons (PNG, 256x256)
│       └── books/              # Buchcover
│
├── apps/                       # App Landing Pages
│   ├── matjes.html             # Matjes, der junge Hering
│   ├── matjes-pro.html         # Matjes-Pro
│   ├── imops.html              # iMOPS Gastro-Grid
│   ├── moneypath.html          # MoneyPath2026
│   └── solara.html             # SOLARA
│
├── books/                      # Buch Landing Pages
│   ├── thermodynamik.html      # Thermodynamik der Arbeit
│   ├── kuechencode.html        # Der Küchencode
│   └── junger-hering.html      # Der junge Hering
│
├── legal/                      # Gesetzestexte
│   ├── impressum.html          # Impressum (TMG §5)
│   ├── datenschutz.html        # Datenschutzerklärung (DSGVO)
│   ├── matjes-privacy.html     # Datenschutz: Matjes App
│   ├── matjes-terms.html       # Nutzungsbedingungen: Matjes App
│   ├── matjes-pro-privacy.html # Datenschutz: Matjes-Pro
│   ├── matjes-pro-terms.html   # Nutzungsbedingungen: Matjes-Pro
│   ├── imops-privacy.html      # Datenschutz: iMOPS
│   ├── imops-terms.html        # Nutzungsbedingungen: iMOPS
│   ├── moneypath-privacy.html  # Datenschutz: MoneyPath2026
│   ├── moneypath-terms.html    # Nutzungsbedingungen: MoneyPath2026
│   ├── solara-privacy.html     # Datenschutz: SOLARA
│   └── solara-terms.html       # Nutzungsbedingungen: SOLARA
│
└── components/                 # Shared HTML Partials (loaded via JS)
    ├── nav.html                # Navigation
    └── footer.html             # Footer
```

## Architektur (MVVM für Static Sites)

```
MODEL       → assets/js/main.js        (Zustand: Mode, Scroll, Preferences)
VIEW        → *.html + assets/css/*     (Templates + Styles)
VIEWMODEL   → assets/js/router.js      (Bindet Daten an Views, lädt Components)
```

## Design-System

- **Mensch-Modus**: Warm, einladend, helle Farben. Font: Lora (Display) + Source Sans 3 (Body)
- **Coder-Modus**: Dunkel, terminal-inspiriert. Font: JetBrains Mono + Source Sans 3
- **Toggle**: Oben rechts, speichert Präferenz in localStorage
- **Easter Egg**: Game of Life — 3× auf "MEMENTO MORI" klicken

## Deployment

GitHub Pages mit Custom Domain `pelczer.de`.

```bash
# CNAME muss im Root liegen
echo "pelczer.de" > CNAME
```

## Kontakt

Andreas Pelczer — B.I.N.D.A. Verlag  
Frankfurt am Main / Wertheim  
[GitHub](https://github.com/AndreasPelczer) · [LinkedIn](https://www.linkedin.com/in/andreas-pelczer-5b5050160/)
