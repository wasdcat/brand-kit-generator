# Was das Werkzeug macht

![Brand Kit Generator](../../../media/logo/wasdcat_bkg_logo_plate.png)

Der Brand Kit Generator erzeugt **transparente PNG-Overlays für Social Media**. Ein Overlay ist die Grafik, die über ein Video oder ein Bild gelegt wird. Wie sie aufgebaut ist, entscheidet allein das Template — die mitgelieferten zeigen einige Möglichkeiten, ein eigenes Template kann völlig anders aufgeteilt sein.

Das Ergebnis ist eine PNG-Datei mit transparentem Hintergrund. Sie wird in einem Videoschnittprogramm, einer Streaming-Software oder einer Bildbearbeitung als oberste Ebene über das Material gelegt. Legen Sie ein Hintergrundbild unter das Overlay, wird dieses mitexportiert — die Datei ist dann fertig und kann hochgeladen werden. Der Generator schneidet nicht und rendert kein Video — er liefert die Grafik.

## Die fünf Bausteine

Ein fertiges Overlay entsteht aus fünf Dingen, die unabhängig voneinander gewählt werden:

| Baustein | Was darin steckt |
| --- | --- |
| **Produkt** | Titel, Slogan und Logo einer Marke oder Sendung |
| **Template** | Das Layout — eine HTML-Datei, deren CSS das gesamte Design trägt |
| **Farbset** | Sieben Farbrollen und ihre Zuweisung an Designobjekte |
| **Font-Set** | Benannte Schriftvarianten und welche davon jeder Platzhalter benutzt |
| **Inhalt** | Titel, Untertitel, Beschreibung und bis zu zwei Tags des konkreten Posts |

Diese fünf werden kombiniert und in einem der vier Ausgabeformate gerendert:

```
Produkt + Template + Farbset + Font-Set + Inhalt  →  PNG
```

Der Punkt daran: Sie können jeden Baustein einzeln tauschen. Ein anderes Farbset wechselt die Farbe, ohne das Layout anzufassen. Ein anderes Template wechselt das Layout, ohne die Texte neu einzugeben.

## Die vier Formate

| Format | Größe | Bezeichnung |
| --- | --- | --- |
| **1:1** | 1080 × 1080 px | Quadratisch |
| **9:16** | 1080 × 1920 px | Hochformat |
| **16:9** | 1920 × 1080 px | Querformat |
| **4:5** | 1080 × 1350 px | Portrait |

Dasselbe Template funktioniert in allen vier Formaten. Es weiß, in welchem es gerade gerendert wird, und passt sein Layout an — bei einem Lower Third wächst zum Beispiel die Schrift im schmalen Format, weil der Post im Feed kleiner dargestellt wird.

## Was Sie mitbringen müssen

**Einen Browser:** Chrome oder Edge. Der PNG-Export ist dort geprüft. In Safari ist er nicht zuverlässig.

**Einen Webserver:** Die Anwendung läuft im Browser, muss aber über `http://` geöffnet werden, nicht per Doppelklick auf die Datei.

> [!IMPORTANT] Doppelklick funktioniert nicht
> Wird `index.html` direkt aus dem Dateimanager geöffnet, weigert sich der Browser, die Template-Dateien nachzuladen. Die Vorschau bleibt dann leer und meldet einen Fehler. Wie Sie die Anwendung richtig starten, steht im nächsten Kapitel.

**Sonst nichts.** Es gibt keine Installation, keinen Build, kein Nutzerkonto und keine Serveranwendung. Schriften und Programmbibliotheken liegen vollständig im Projekt; nach dem ersten Laden funktioniert alles auch offline.

## Sprache

Die Oberfläche spricht Deutsch und Englisch. Sie richtet sich nach dem, was Ihr Browser meldet, und fällt auf Englisch zurück. Die Schaltfläche **DE / EN** oben rechts wechselt jederzeit; sie zeigt die Sprache, in die sie wechseln würde.

Der Wechsel betrifft nur die Oberfläche. Ihre eigenen Namen für Produkte, Farbsets und Font-Sets bleiben genau so, wie Sie sie eingetragen haben.

## Wo Ihre Daten liegen

Alles, was Sie einrichten — Firma, Produkte, Farbsets, Font-Sets, Texte — bleibt **in Ihrem Browser**. Nichts wird übertragen, es gibt keinen Server, der etwas speichert.

Das hat eine Kehrseite: Ein geleerter Browserspeicher nimmt Ihre Einrichtung mit. Wie Sie eine Sicherung anlegen, steht im Kapitel *Sichern und übertragen*.
