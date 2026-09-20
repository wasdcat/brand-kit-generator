# Die Oberfläche

Das Fenster besteht aus vier Zonen: der Kopfzeile, der Seitenleiste links, dem Vorschaubereich rechts und der Exportleiste unten.

## Kopfzeile

Oben rechts liegen fünf Bedienelemente:

| Bedienelement | Wirkung |
| --- | --- |
| **Laden** | Eine gesicherte Einrichtung aus einer Datei laden |
| **Speichern** | Die aktuelle Einrichtung als JSON-Datei herunterladen |
| **Sonne / Mond** | Zwischen dunkler und heller Oberfläche wechseln |
| **DE / EN** | Sprache der Oberfläche wechseln |
| **Pfeil im Kreis** | Alles auf die Werkseinstellung zurücksetzen |

Die Sprachschaltfläche zeigt die Sprache, in die sie wechseln würde, nicht die aktuelle — die Beschriftung ist die Handlung, wie bei jeder anderen Schaltfläche dort.

> [!CAUTION] Zurücksetzen verwirft alles
> Der Pfeil im Kreis löscht Ihre gesamte Einrichtung: Firma, Produkte, Farbsets, Font-Sets und Texte. Er fragt einmal nach — der erste Klick schaltet ihn scharf, ein zweiter innerhalb von vier Sekunden führt aus. Jeder andere Klick entschärft ihn wieder.

Das Umschalten der Oberfläche zwischen hell und dunkel betrifft nur die Anwendung. Auf das Overlay und den Export hat es keinen Einfluss.

## Seitenleiste

Ganz links liegt eine schmale Leiste mit sieben Symbolen, gegliedert in drei Gruppen:

**Post** — was sich bei jedem Beitrag ändert

- *Erstellen*: Auswahl der Bausteine und die Texte des Posts
- *Export*: Formatauswahl für das ZIP-Archiv und die Exportschaltflächen

**Design** — wie es aussieht

- *Template*: Layout wählen, Platzhalter ansehen, Typografie zuordnen
- *Font-Set*: Schriftvarianten anlegen und ihre Achsen einstellen
- *Farbset*: Farbwerte und ihre Zuweisung

**Marke** — was selten wechselt

- *Produkte*: Produkte mit Titel, Slogan und Logo
- *Unternehmen*: Unternehmensangaben und Firmenlogo

## Vorschaubereich

### Werkzeugleiste

Über der Vorschau stehen links die vier Formate. Rechts daneben:

**Hintergrund** — fünf Symbole, die bestimmen, worauf das Overlay in der Vorschau liegt:

| Symbol | Hintergrund |
| --- | --- |
| Raster | Dunkles Karomuster (Vorgabe) |
| Sonne | Helles Karomuster |
| Mond | Schwarz |
| Quadrat | Weiß |
| Bild | Eigenes Hintergrundbild hochladen |

Das Karomuster zeigt die Transparenz. Schwarz und Weiß prüfen den Kontrast an den Extremen.

### Hintergrundbild

Nach dem Hochladen eines Bildes lässt sich der Ausschnitt anpassen:

- **Ziehen** verschiebt das Bild
- **Mausrad** zoomt um den Mauszeiger herum, bis zum sechsfachen
- **Doppelklick** oder ein Klick auf die Prozentanzeige setzt den Ausschnitt zurück
- Das **X** daneben entfernt das Bild

Der Ausschnitt wird als Bruchteil der Bildfläche gespeichert, nicht in Pixeln. Ziehen Sie das Fenster anders groß, bleibt derselbe Bildausschnitt stehen.

Gemerkt wird er **je Template und Format**. Das ist Absicht: Ein Hochformat schneidet ein Foto anders zu als ein Querformat, und ein Template, das unten eine Abdunklung legt, braucht ein anderes Motiv im Bild als eines mit einem Zeichen in der Ecke. Sie rahmen jede Kombination einmal, und sie bleibt so.

Zurücksetzen gilt entsprechend nur für das, was gerade auf dem Schirm ist. Laden Sie ein **anderes Bild**, werden alle Ausschnitte verworfen — sie waren an diesem einen Foto gemessen.

> [!NOTE] Das Hintergrundbild bleibt erhalten
> Im Export liegt es unter dem Overlay, die Datei ist damit fertig. Seit 1.2.0 übersteht es auch ein Neuladen der Seite, und es lässt sich mit der Einrichtung sichern — siehe [Sichern und übertragen](10-sichern-uebertragen.md).

### Plaketten

In den oberen Ecken der Vorschau stehen zwei Anzeigen. Links die Pixelgröße des gewählten Formats mit einem Punkt, der grün leuchtet, wenn alles bereit ist, gelb während des Ladens und rot bei einem Fehler. Rechts die aktuelle Kombination aus Produkt, Template und Farbset.

## Exportleiste

Unten stehen links die Versionsnummer und Verweise auf Projektseite, Handbuch und Lizenz, rechts die beiden Exportschaltflächen **PNG (`*Format*`)** und **ZIP (alle Formate)**. Während eines ZIP-Exports erscheint im Bereich *Export* der Seitenleiste ein Fortschrittsbalken.
