# Export

## Die beiden Wege

**PNG** unten rechts erzeugt eine einzelne Datei im gerade gewählten Format.

**ZIP (alle Formate)** erzeugt ein Archiv mit allen Formaten, die im Bereich *Export* angehakt sind. Dort können Sie einzelne abwählen, wenn Sie etwa nie Querformat brauchen.

Während eines ZIP-Exports zeigt der Bereich *Export* einen Fortschrittsbalken mit dem Format, das gerade gerendert wird.

## Was herauskommt

Ein PNG mit transparentem Hintergrund, ideal als Overlay über Ihre Stills oder Clips. Wurde ein Hintergrundbild geladen und platziert, wird es mitexportiert — fertig zum Hochladen, etwa in sozialen Medien.

Die Datei hat exakt die Pixelmaße des Formats, unabhängig davon, wie groß die Vorschau gerade dargestellt wird. Die Vorschau ist eine verkleinerte Ansicht; gerendert wird immer in voller Größe.

### Dateinamen

Einzelne PNG-Dateien heißen nach dem Muster:

```
produkt_template_farbset_format.png
```

Also etwa `beispielshow_lower_third_neon_purple_1x1.png`. Alles wird kleingeschrieben, und jedes Zeichen, das weder Buchstabe noch Ziffer ist, wird zum Unterstrich — einschließlich des Bindestrichs einer Template-Kennung und des Doppelpunkts im Format.

Das ZIP-Archiv heißt nach dem Produkt und enthält einen gleichnamigen Ordner:

```
beispielshow_overlays.zip
  └── beispielshow_overlays/
      ├── beispielshow_lower_third_neon_purple_1x1.png
      ├── beispielshow_lower_third_neon_purple_9x16.png
      ├── …
      ├── brand-setup.json
      └── background.png
```

### brand-setup.json

Jedem ZIP liegt die Einrichtung bei, aus der die Bilder entstanden sind.

Damit ist ein Export reproduzierbar. Wer die Dateien Monate später wieder braucht, lädt die beiliegende JSON über *Laden* und steht wieder dort, wo Sie beim Export standen.

### background.png

War ein Hintergrundbild gesetzt, liegt es als eigene Datei daneben, mit der Endung des Bildes — `background.jpg` bei einem JPEG. Nicht in der JSON, weil es dort als Text kodiert um ein Drittel größer wäre und sich nicht ansehen ließe. Die JSON nennt nur seinen Namen und den Ausschnitt.

Nach dem Laden der JSON fragt die Anwendung deshalb nach dem Bild. Wählen Sie die Datei aus demselben Ordner, und der Ausschnitt sitzt wieder.

## Was im Export anders ist als in der Vorschau

Zwei Unterschiede, die Sie kennen sollten.

**Die Vorschau-Hintergründe kommen nicht mit — ein hochgeladenes Bild schon.** Karomuster, Schwarz und Weiß sind Hilfen zur Kontrastbeurteilung; im Export ist dort Transparenz. Ein hochgeladenes Hintergrundbild ist die Ausnahme: Es gehört zum Bild und wird unter dem Overlay mitexportiert.

**Zu langer Text wird gekürzt.** Begrenzt ein Template die Zeilenzahl, wird überstehender Text vor dem Export an einer Wortgrenze abgeschnitten und mit einem echten `…` versehen. Der Browser zeichnet seine eigenen Auslassungspunkte nämlich nicht in eine Bilddatei — ohne diesen Schritt wäre der Text im PNG einfach abgeschnitten.

Ihr eingetragener Text bleibt davon unberührt; gekürzt wird nur die Bilddatei.

## Browser

> [!WARNING] Safari ist nicht zuverlässig
> Der Export ist für Chrome und Edge geprüft. Safari geht mit der zugrundeliegenden Technik anders um; Ergebnisse können unvollständig sein oder ganz ausbleiben. Verwenden Sie zum Exportieren Chrome oder Edge.

## Weiterverarbeitung

Das PNG kommt als oberste Spur über Ihr Material:

- **Videoschnittprogramme** — als Bild in die Timeline, über den Clip
- **Streaming-Software** — als Bildquelle über die Kameraquelle
- **Bildbearbeitung** — als Ebene über das Foto

Eine Umwandlung ist nicht nötig. Wo das Overlay transparent ist, steckt die Transparenz in der Datei und wird von allen direkt verstanden.
