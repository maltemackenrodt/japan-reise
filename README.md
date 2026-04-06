# Japan 2026 – Reise-Webapp

Persönliche Reise-App für die Japan-Rundreise im Mai 2026.  
Gebaut mit React + Vite + Tailwind CSS. Deployment via Netlify.

## Features

- **Überblick** – Route, Hotels, Flüge und Budget auf einen Blick
- **Tagesplan** – Alle 21 Tage mit Highlights, Transport und Hotel; filterbar nach Stadt
- **Karte** – Interaktive SVG-Reiseroute mit klickbaren Stopps
- **Checkliste** – Abhakbare Vorbereitungsliste, im Browser persistiert (localStorage)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

App läuft dann auf http://localhost:5173

## Build für Produktion

```bash
npm run build
```

Output landet im `dist/` Ordner.

## Deployment auf Netlify

### Option A – Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Option B – GitHub + Netlify (empfohlen)

1. Repo auf GitHub pushen
2. Netlify → "Add new site" → "Import an existing project" → GitHub-Repo wählen
3. Build-Einstellungen werden automatisch aus `netlify.toml` gelesen:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy → fertig!

Jeder Push auf `main` löst automatisch einen neuen Deploy aus.

## Projektstruktur

```
japan-reise-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx       ← Hauptkomponente mit allen Daten
│   ├── main.jsx      ← React-Einstiegspunkt
│   └── index.css     ← Tailwind-Direktiven
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml
└── package.json
```

## Daten anpassen

Alle Reisedaten (Stopps, Tagesplan, Budget, Foodspots, Checkliste) sind als Konstanten
am Anfang von `src/App.jsx` definiert – einfach direkt bearbeiten.
