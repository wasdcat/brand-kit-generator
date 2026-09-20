# Sichern und übertragen

## Automatisch im Browser

Jede Änderung wird nach einem kurzen Moment im Speicher Ihres Browsers abgelegt. Nach einem Neuladen ist alles wieder da. Sie müssen nichts bestätigen.

Dieser Speicher hat drei Eigenschaften, die Sie kennen sollten:

- Er gilt **pro Browser und pro Rechner**. Chrome auf dem Bürorechner und Chrome zu Hause wissen nichts voneinander.
- Er wird beim Leeren der Browserdaten **mitgelöscht** — auch dann, wenn Sie eigentlich nur Cookies entfernen wollten.
- Er fasst rund **5 MB**. Deshalb werden Logos beim Hochladen verkleinert.

> [!IMPORTANT] Der Browserspeicher ist keine Sicherung
> Er ist bequem, aber flüchtig. Alles, woran Sie länger gearbeitet haben, gehört zusätzlich in eine Datei.

## In eine Datei sichern

**Speichern** in der Kopfzeile lädt die vollständige Einrichtung als JSON-Datei herunter.

Diese Datei ist Ihre Sicherung, Ihr Übertragungsweg auf einen anderen Rechner und Ihre Möglichkeit, mehrere Einrichtungen nebeneinander zu führen — etwa eine je Kunde.

Nicht enthalten ist die Wahl zwischen heller und dunkler Oberfläche. Sie gehört zum Arbeitsplatz, nicht zur Marke.

### Das Hintergrundbild

Ist ein Hintergrundbild geladen, fragt der Generator beim Sichern nach:

- **Mit Bild** — eine vollständige Datei. Sie wird so groß wie das Foto und ist per Mail unhandlich.
- **Ohne Bild** — eine kleine Datei. Sie behält den Ausschnitt und merkt sich den Dateinamen. Nach dem Laden zeigt die Vorschau diesen Namen an; sobald Sie das Bild auswählen, sitzt der Ausschnitt bereits.

Wählen Sie dabei ein **anderes** Bild als das genannte, fragt der Generator nach. Der mitgebrachte Ausschnitt war an dem genannten Bild gemessen und geht sonst kommentarlos verloren — und ohne Bild auf dem Schirm sieht man ihn nicht. *Abbrechen* behält Ausschnitt und Erwartung, sodass Sie es erneut versuchen können.

Der Ausschnitt selbst ist in beiden Fällen dabei. Er wird **je Template und Format** gemerkt: ein Hochformat-Ausschnitt sitzt woanders als ein Querformat-Ausschnitt, und ein Template, das unten eine Abdunklung legt, will einen anderen Bildausschnitt als eines mit einem Zeichen in der Ecke. Laden Sie ein **anderes Bild**, werden alle Ausschnitte verworfen — sie waren an diesem einen Foto gemessen.

> [!NOTE] Das Bild liegt nicht im 5-MB-Speicher
> Ein Foto passt dort nicht hinein, und ein zu großer Wert würde die ganze Sicherung scheitern lassen. Der Generator legt es deshalb getrennt ab. Nach einem Neuladen ist es trotzdem wieder da.

## Aus einer Datei laden

**Laden** öffnet die Dateiauswahl. Nach der Auswahl erscheint ein Dialog, **bevor** irgendetwas übernommen wird. Er zeigt:

- den Dateinamen
- die Schema-Version der Datei
- welche Bereiche sie enthält
- gegebenenfalls einen Hinweis zur Version

> [!CAUTION] Laden ersetzt die aktuelle Einrichtung
> Ein Import überschreibt Firma, Produkte, Farbsets, Font-Sets und die Texte. Was nicht als Datei gesichert ist, ist danach weg. Der Dialog sagt das; *Cancel* oder die Escape-Taste brechen ab, *Replace setup* führt aus.

### Wenn eine Datei abgelehnt wird

Nicht jede JSON-Datei ist eine Einrichtung. Jede vom Generator geschriebene Datei trägt eine Kennung. Fehlt sie oder gehört sie zu einem anderen Werkzeug, wird die Datei abgelehnt — mit einer Meldung, die sagt, warum. Sie können nicht versehentlich eine fremde Konfiguration einspielen.

### Wenn die Version nicht passt

Stammt eine Datei aus einer neueren Version des Generators, wird sie trotzdem gelesen. Der Dialog weist darauf hin, dass Teile übersprungen werden, die diese Version noch nicht kennt.

Umgekehrt gilt: Was eine ältere Datei nicht mitbringt — ein Font-Set, die Typografie-Zuordnung — wird beim Laden mit den Vorgaben aufgefüllt, statt einen Fehler zu erzeugen.

## Auf einen anderen Rechner umziehen

1. Auf dem alten Rechner **Speichern**
2. Die JSON-Datei übertragen
3. Auf dem neuen Rechner die Anwendung öffnen und **Laden**
4. Im Dialog bestätigen

Die Template-Dateien selbst wandern mit dem Projektordner, nicht mit der JSON. Wer eigene Templates gebaut hat, muss sie mitnehmen.

## Alles zurücksetzen

Der Pfeil im Kreis oben rechts stellt die Werkseinstellung wieder her: die mitgelieferten Produkte, Farbsets und Font-Sets, die Beispieltexte und der vollständige Template-Katalog, auch die zuvor entfernten.

Der Knopf fragt einmal nach — der erste Klick schaltet ihn scharf, der zweite innerhalb von vier Sekunden führt aus.

> [!TIP] Vorher sichern
> Legen Sie vor dem Zurücksetzen eine Sicherung über *Speichern* an. Ein Zurücksetzen lässt sich nicht rückgängig machen; eine Datei schon wieder laden.
