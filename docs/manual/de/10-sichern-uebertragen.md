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

**Save setup** in der Kopfzeile lädt die vollständige Einrichtung als JSON-Datei herunter.

Diese Datei ist Ihre Sicherung, Ihr Übertragungsweg auf einen anderen Rechner und Ihre Möglichkeit, mehrere Einrichtungen nebeneinander zu führen — etwa eine je Kunde.

Nicht enthalten sind das Hintergrundbild und die Wahl zwischen heller und dunkler Oberfläche. Die Oberflächeneinstellung gehört zum Arbeitsplatz, nicht zur Marke; das Hintergrundbild bleibt draußen, weil ein Foto in voller Größe die Datei aufblähen würde.

## Aus einer Datei laden

**Load setup (JSON)** öffnet die Dateiauswahl. Nach der Auswahl erscheint ein Dialog, **bevor** irgendetwas übernommen wird. Er zeigt:

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

1. Auf dem alten Rechner **Save setup**
2. Die JSON-Datei übertragen
3. Auf dem neuen Rechner die Anwendung öffnen und **Load setup (JSON)**
4. Im Dialog bestätigen

Die Template-Dateien selbst wandern mit dem Projektordner, nicht mit der JSON. Wer eigene Templates gebaut hat, muss sie mitnehmen.

## Alles zurücksetzen

Der Pfeil im Kreis oben rechts stellt die Werkseinstellung wieder her: die mitgelieferten Produkte, Farbsets und Font-Sets, die Beispieltexte und der vollständige Template-Katalog, auch die zuvor entfernten.

Der Knopf fragt einmal nach — der erste Klick schaltet ihn scharf, der zweite innerhalb von vier Sekunden führt aus.

> [!TIP] Vorher sichern
> Legen Sie vor dem Zurücksetzen eine Sicherung über *Save setup* an. Ein Zurücksetzen lässt sich nicht rückgängig machen; eine Datei schon wieder laden.
