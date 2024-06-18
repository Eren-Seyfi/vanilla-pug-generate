# PUG-Vorlagen-Projekt

Dieses Projekt bietet ein einfaches Setup-Beispiel, das PUG-Dateien mit dem File Tracker unter Verwendung von PUG-Vorlagen in HTML konvertiert und öffentliche Assets in ein Ausgabeverzeichnis kopiert. Das Projekt bietet auch die Möglichkeit, das Ausgabeverzeichnis regelmäßig zu bereinigen und neu zu erstellen.

## Merkmale

- Konvertiert PUG-Vorlagen in HTML.
- Kopiert generische Assets (CSS, JS, Bilder, etc.) in das Ausgabeverzeichnis.
- Überwacht Änderungen im Quellverzeichnis und aktualisiert das Ausgabeverzeichnis entsprechend.
- Säubert das Ausgabeverzeichnis regelmäßig und baut es neu auf.

## Installation

1. Klonen Sie das Repository:

   ```bash
   git clone https://github.com/Eren-Seyfi/vanilla-PUG-generate.git
   cd PUG-template-project
   ```

2) installieren Sie die Abhängigkeiten:

   ```bash
   npm install
   ```

3) starten Sie das Projekt:

   ```bash
   npm start
   ```

## Struktur

- **src**: Ressourcenverzeichnis mit PUG-Vorlagen und öffentlichen Assets.
  - **templates**: Enthält `layouts`, `partials`, `components` und `pages`.
  - **public**: Enthält öffentliche Assets wie CSS- und JS-Dateien.
- **www**: Ausgabeverzeichnis, in dem konvertiertes HTML und kopierte Assets gespeichert werden.
- **bootstrap.js**: Hauptskript zum Einrichten des Projekts, Verfolgen von Änderungen und Konvertieren von Vorlagen.
- **structure.json**: Konfigurationsdatei, die die Struktur und die Einstellungen definiert.

## Wie Layouts funktionieren:

In diesem Projekt sind die PUG-Vorlagen in Layouts unterteilt, um eine modulare Struktur zu schaffen. Die Layout-Dateien befinden sich im Verzeichnis templates/layouts. Jede PUG-Datei einer Seite gibt an, zu welcher Layout-Datei sie gehört, indem sie den Layout-Namen im Dateinamen angibt, z. B. index.main.PUG bedeutet, dass das Layout main.PUG verwendet wird.

Wenn Vorlagen gerendert werden, wird die Layout-Datei verwendet, um den Seiteninhalt zu umhüllen. Dadurch wird sichergestellt, dass die Kopf- und Fußzeilen sowie die Navigationsabschnitte auf den verschiedenen Seiten konsistent sind. Zum Beispiel wird eine index.main.PUG-Datei mit dem main.PUG-Layout umhüllt, und die gleiche Kopf- und Fußzeile wird für alle Seiten verwendet, die dieses Layout verwenden.

## Konfiguration

### structure.json

```json
{
  "inputDir": "src",
  "outputDir": "www",
  "interval": 5000,
  "mainTemplate": "templates/layouts/main.PUG",
  "pagesDir": "templates/pages",
  "templates": {
    "layouts": ["main.PUG", "example.PUG"],
    "partials": ["header.PUG", "footer.PUG", "nav.PUG"],
    "pages": [
      "index.main.PUG",
      "about.main.PUG",
      "index.example.PUG",
      "about.example.PUG"
    ],
    "components": []
  },
  "public": {
    "css": ["style.css"],
    "js": ["app.js"]
  }
}
```

- **inputDir**: Quellverzeichnis.
- **AusgabeVerzeichnis**: Ausgabeverzeichnis.
- **Intervall**: Intervall in Millisekunden, um das Ausgabeverzeichnis zu löschen und neu zu erstellen.
- **mainTemplate**: Pfad zur PUG-Hauptvorlage.
- **pagesDir**: Das Verzeichnis, das die PUG-Seitenvorlagen enthält.
- **templates**: Die Struktur der Vorlagen.
- **public**: Die Struktur der öffentlichen Entitäten.

## Skripte

- **start**: Führt das Hauptskript aus (`bootstrap.js`).

Übersetzt mit DeepL.com (kostenlose Version)
