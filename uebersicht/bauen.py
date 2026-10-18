#!/usr/bin/env python3
"""Baut pelczer.de/uebersicht/ – Andreas' Liste von allem, was auf pelczer.de hängt.

Aufruf (nach jeder neuen Seite):  python3 uebersicht/bauen.py
Liest alle .html aus git, holt Titel + letztes Änderungsdatum, sortiert nach Thema.
Die Übersicht selbst ist nirgends verlinkt und für Google gesperrt (noindex) – geheim ist sie nicht.
"""
import html, re, subprocess
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
os_ = lambda *a: subprocess.run(a, cwd=WURZEL, capture_output=True, text=True).stdout

# Thema je Pfadanfang – das erste passende gewinnt. Neue Ordner landen unter „Sonstiges“.
THEMEN = [
    ('Kunden: RENT US Glanzgarage', ('rentus/', 'glanzgarage/', '3d-check/', '3d-test/', 'schaden/', 'politur/', 'spiel/')),
    ('Kunden: Ambiente con Cuore (Stefania)', ('cuore/',)),
    ('Kunden: Containerdienst Funk', ('funk/',)),
    ('Kunden: Pizza-Schmiede', ('pizza/',)),
    ('Kunden: weitere', ('ronny/', 'tattoo-opening', 'goldschmitt-bau', 'weetech/')),
    ('Spiele & Arcade', ('arcade/', 'huette/', 'altstadt/', 'dorf/')),
    ('Mops / iMOPS / baumops', ('imops', 'gastro-grid', 'baumops-logikplan/', 'construction-grid-logikplan/', 'scrummops')),
    ('Bücher & Leseproben', ('books/', 'leseprobe-')),
    ('Apps (App Store)', ('apps/', 'fuer-schulen', 'wattwandern')),
    ('Rechtliches', ('legal/',)),
    ('Startseite', ('index.html',)),
]
# Nur Technik, gehört nicht in die Liste
WEG = re.compile(r'^(uebersicht/|rentus/google[0-9a-f]+\.html$)')
# Kurze Merkzettel, wo der Titel nicht reicht
NOTIZ = {
    'cuore/mandala.html': 'für Geschenke: …/mandala.html?fuer=dich',
    'arcade/index.html': 'Kurzadresse pelczer.de/arcade → Sumpf-Automat',
}


def seiten():
    startseite = (WURZEL / 'index.html').read_text(errors='ignore')
    verlinkt = set(re.findall(r'href="(?:https://pelczer\.de)?/?([^"#?:]+)"', startseite))
    for pfad in os_('git', 'ls-files', '*.html').split():
        if WEG.match(pfad):
            continue
        text = (WURZEL / pfad).read_text(errors='ignore')
        t = re.search(r'<title>(.*?)</title>', text, re.S)
        titel = html.unescape(re.sub(r'\s+', ' ', t.group(1)).strip()) if t else pfad
        titel = re.sub(r'\s*[|—–-]\s*pelczer\.de\s*$', '', titel)
        datum = os_('git', 'log', '-1', '--format=%cs', '--', pfad).strip()
        url = pfad[:-len('index.html')] if pfad.endswith('index.html') else pfad
        yield dict(pfad=pfad, url=url, titel=titel, datum=datum,
                   versteckt='noindex' in text.lower(),
                   start=pfad in verlinkt or url in verlinkt or url.rstrip('/') in verlinkt)


def thema(pfad):
    for name, anfaenge in THEMEN:
        if pfad.startswith(anfaenge):
            return name
    return 'Sonstiges'


def bauen():
    alle = list(seiten())
    gruppen = {}
    for s in alle:
        gruppen.setdefault(thema(s['pfad']), []).append(s)
    reihenfolge = [n for n, _ in THEMEN] + ['Sonstiges']
    e = html.escape
    abschnitte = []
    for name in reihenfolge:
        liste = sorted(gruppen.get(name, []), key=lambda s: s['pfad'])
        if not liste:
            continue
        zeilen = []
        for s in liste:
            marken = []
            if s['start']:
                marken.append('<span class="m start">auf Startseite</span>')
            marken.append('<span class="m vers">nicht bei Google</span>' if s['versteckt'] else '<span class="m oeff">bei Google</span>')
            notiz = f'<div class="notiz">{e(NOTIZ[s["pfad"]])}</div>' if s['pfad'] in NOTIZ else ''
            zeilen.append(
                f'<li data-such="{e((s["titel"] + " " + s["pfad"]).lower())}">'
                f'<a href="/{e(s["url"])}" target="_blank" rel="noopener"><span class="t">{e(s["titel"])}</span>'
                f'<span class="p">pelczer.de/{e(s["url"])}</span></a>'
                f'<div class="r"><span class="d">{e(s["datum"])}</span>{"".join(marken)}</div>{notiz}</li>')
        abschnitte.append(f'<section><h2>{e(name)} <small>{len(liste)}</small></h2><ul>{"".join(zeilen)}</ul></section>')

    neu = sorted(alle, key=lambda s: s['datum'], reverse=True)[:8]
    neu_html = ''.join(f'<li><a href="/{e(s["url"])}" target="_blank" rel="noopener">{e(s["titel"])}</a> <span class="d">{e(s["datum"])}</span></li>' for s in neu)
    stand = os_('git', 'log', '-1', '--format=%cs').strip()

    seite = VORLAGE.replace('{{ANZAHL}}', str(len(alle))).replace('{{STAND}}', stand) \
                   .replace('{{NEU}}', neu_html).replace('{{ABSCHNITTE}}', ''.join(abschnitte))
    (WURZEL / 'uebersicht' / 'index.html').write_text(seite)
    print(f'{len(alle)} Seiten in {len(abschnitte)} Themen → uebersicht/index.html')


VORLAGE = '''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Was hängt an pelczer.de</title>
<style>
:root{--bg:#0b0d0f;--panel:#13171b;--ink:#e9edf1;--soft:#c2cad3;--muted:#828d99;--green:#36d07a;--amber:#e0a83a;--line:#222a31;
--mono:"SF Mono",ui-monospace,Menlo,Consolas,monospace;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.45}
main{max-width:860px;margin:0 auto;padding:28px 16px 60px}
h1{font-family:var(--mono);font-size:1.35rem;margin:0 0 4px}
.unter{color:var(--muted);font-size:.9rem;margin:0 0 20px}
input{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font-size:1rem;margin-bottom:22px}
input:focus{outline:2px solid var(--green-dim,#1f7d4c);border-color:transparent}
.kasten{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:26px}
.kasten h2{margin-top:0}
.kasten ul{margin:0;padding-left:18px}.kasten li{margin:3px 0}
.kasten a{color:var(--ink)}
h2{font-family:var(--mono);font-size:.95rem;color:var(--green);margin:26px 0 8px;letter-spacing:.02em}
h2 small{color:var(--muted);font-weight:normal}
section ul{list-style:none;margin:0;padding:0}
section li{border-bottom:1px solid var(--line);padding:9px 2px;display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;justify-content:space-between}
section li a{text-decoration:none;color:var(--ink);display:flex;flex-direction:column;min-width:0;flex:1 1 300px}
section li a:hover .t{color:var(--green)}
.t{font-size:.98rem}
.p{font-family:var(--mono);font-size:.75rem;color:var(--muted);overflow-wrap:anywhere}
.r{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.d{font-family:var(--mono);font-size:.75rem;color:var(--muted)}
.m{font-size:.7rem;padding:2px 7px;border-radius:99px;border:1px solid var(--line);white-space:nowrap}
.m.start{color:var(--green);border-color:#1f7d4c}
.m.vers{color:var(--muted)}
.m.oeff{color:var(--amber);border-color:#6b5220}
.notiz{flex-basis:100%;font-size:.8rem;color:var(--soft)}
.leer{color:var(--muted);display:none}
footer{margin-top:36px;color:var(--muted);font-size:.8rem}
code{font-family:var(--mono)}
</style>
</head>
<body>
<main>
  <h1>Was hängt an pelczer.de</h1>
  <p class="unter">{{ANZAHL}} Seiten · Stand {{STAND}} · nur für dich, nirgends verlinkt, Google sieht sie nicht</p>
  <input id="such" type="search" placeholder="Suchen … (z. B. mandala, funk, datenschutz)" autocomplete="off">
  <div class="kasten" id="neu"><h2>Zuletzt geändert</h2><ul>{{NEU}}</ul></div>
  {{ABSCHNITTE}}
  <p class="leer" id="leer">Nichts gefunden.</p>
  <footer>„bei Google“ = Suchmaschinen dürfen die Seite finden. „nicht bei Google“ = nur wer den Link hat.<br>
  Neu bauen nach einer neuen Seite: <code>python3 uebersicht/bauen.py</code></footer>
</main>
<script>
const such = document.getElementById('such');
such.addEventListener('input', () => {
  const q = such.value.trim().toLowerCase(); let treffer = 0;
  document.querySelectorAll('section').forEach(sec => {
    let n = 0;
    sec.querySelectorAll('li').forEach(li => { const ja = !q || li.dataset.such.includes(q); li.style.display = ja ? '' : 'none'; n += ja; });
    sec.style.display = n ? '' : 'none'; treffer += n;
  });
  document.getElementById('neu').style.display = q ? 'none' : '';
  document.getElementById('leer').style.display = treffer ? 'none' : 'block';
});
</script>
</body>
</html>
'''

if __name__ == '__main__':
    bauen()
