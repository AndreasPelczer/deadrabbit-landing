/* ==========================================================================
   RENT US Glanzgarage — AKTIONEN
   --------------------------------------------------------------------------
   DAS IST DIE EINZIGE DATEI, DIE FÜR EINEN AKTIONSWECHSEL ANGEFASST WIRD.

   Die Seite schaut beim Laden ins heutige Datum und zeigt die erste Aktion,
   deren Zeitraum passt. Am Rechner als Karte in der Bildschirmmitte, am Handy
   als Streifen am unteren Rand. Ein Besucher sieht jede Aktion genau einmal.

   Passt kein Zeitraum aufs heutige Datum, wird gar nichts angezeigt —
   die Seite bleibt dann einfach sauber. Eine leere Liste ist also erlaubt.

   Felder:
     von / bis   Zeitraum, Format JJJJ-MM-TT. Beide Tage zählen mit.
     eyebrow     kleine Zeile über der Überschrift (darf leer sein: "")
     titel       die Überschrift
     claim       ein Satz drunter, grün und kursiv (darf leer sein: "")
     text        zwei, drei Sätze. Kein HTML — reiner Text.
     preisLabel  kleine Zeile über dem Preis, z. B. "Festpreis"
     preis       z. B. "99,90 €". Leer lassen ("") blendet den Preis aus.
     hinweis     Kleingedrucktes unter dem Preis (darf leer sein: "")
     bild        Pfad zum Foto, z. B. "assets/img/dog.jpg"
     bildAlt     Bildbeschreibung — für Blinde und für Google. Bitte ausfüllen.
     bildFokus   Welcher Punkt im Foto sichtbar bleiben soll, wenn beschnitten
                 wird. Erst quer, dann hoch, jeweils von links oben aus:
                 "50% 50%" = Mitte, "62% 32%" = etwas rechts, ziemlich weit
                 oben. Weglassen = Mitte. Am Handy wird stark beschnitten —
                 hier lohnt es sich, den Kopf bzw. das Motiv anzupeilen.
     ctaText     Beschriftung des Knopfs
     ctaLink     Ziel des Knopfs (WhatsApp-Link, oder "#buchung" für den
                 Buchungsbereich auf der Seite selbst)

   Zum Testen einer noch nicht gestarteten Aktion: ?aktion=test an die
   Adresse hängen (info-rentus.de/?aktion=test). Dann wird die erste Aktion
   der Liste angezeigt, egal welches Datum, und auch mehrfach.
   ========================================================================== */

window.RENTUS_AKTIONEN = [

  {
    von:        "2026-08-01",
    bis:        "2026-10-31",
    eyebrow:    "Mikes Renner",
    titel:      "Der Faule Hund",
    claim:      "Für kleines Geld wieder wie geleckt.",
    text:       "Die schnelle Auffrischung für zwischendurch: außen von Hand gewaschen, innen gesaugt, Matten und Einstiege sauber. Ohne großes Programm.",
    preisLabel: "Festpreis",
    preis:      "99,90 €",
    hinweis:    "Kleine Aufbereitung – keine Vollaufbereitung.",
    bild:       "assets/img/dog.jpg",
    bildAlt:    "Hund schaut aus dem Seitenfenster eines frisch aufbereiteten roten Oldtimers",
    bildFokus:  "62% 30%",
    ctaText:    "Jetzt anfragen",
    ctaLink:    "https://wa.me/4915901606913?text=Hallo%20Mike%2C%20ich%20m%C3%B6chte%20den%20%E2%80%9AFaulen%20Hund%27%20%2899%2C90%20%E2%82%AC%29%20buchen."
  },

  /* ------------------------------------------------------------------------
     VORLAGE FÜR DIE NÄCHSTE AKTION
     Zum Aktivieren die beiden Zeilen mit den Sternchen drumherum entfernen
     (also diesen Kommentar-Anfang oben und das Kommentar-Ende ganz unten)
     und die Werte anpassen. Wichtig: Das Komma hinter der geschweiften
     Klammer } nicht vergessen, wenn danach noch eine Aktion folgt.

  {
    von:        "2026-11-01",
    bis:        "2027-01-31",
    eyebrow:    "Winteraktion",
    titel:      "Hier steht der Name",
    claim:      "Ein Satz, der Lust macht.",
    text:       "Zwei, drei Sätze, was drin ist und für wen es gedacht ist.",
    preisLabel: "Festpreis",
    preis:      "0,00 €",
    hinweis:    "Kleingedrucktes.",
    bild:       "assets/img/hero-audi.jpg",
    bildAlt:    "Bitte beschreiben, was auf dem Foto zu sehen ist",
    bildFokus:  "50% 50%",
    ctaText:    "Jetzt anfragen",
    ctaLink:    "#buchung"
  }

     ------------------------------------------------------------------------ */

];
