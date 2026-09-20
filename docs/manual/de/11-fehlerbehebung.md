# Fehlerbehebung

## Die Vorschau bleibt leer und meldet einen Fehler

**Meldung:** *The template could not be rendered*

**Häufigste Ursache:** Die Datei wurde per Doppelklick geöffnet, die Adresszeile beginnt mit `file://`. Browser verweigern in diesem Fall das Nachladen der Template-Dateien.

**Lösung:** Die Anwendung über einen Webserver öffnen, siehe *Erste Schritte*. Die Adresse muss mit `http://` beginnen.

**Andere Ursache:** Das Template-Manifest verweist auf eine Datei, die es nicht gibt, oder die Datei enthält kein Element mit der Klasse `frame`. Der Meldungstext nennt den Dateinamen.

## Der Hintergrund-Umschalter zeigt keine Wirkung

Der Umschalter wirkt auf die Fläche **hinter** dem Overlay. Wenn die Vorschau einen Fehler meldet, liegt darüber eine fast deckende Fehlermeldung — der Hintergrund wechselt zwar, ist aber verdeckt.

Beheben Sie zuerst die Fehlermeldung, siehe oben.

## Die Symbole fehlen oder wirken tot

Wird die Anwendung direkt nach einer Aktualisierung des Projekts geöffnet, kann der Browser noch alte Programmdateien aus dem Zwischenspeicher verwenden.

**Lösung:** Neu laden unter Umgehung des Zwischenspeichers — `Strg`+`Umschalt`+`R` (Windows) beziehungsweise `Cmd`+`Umschalt`+`R` (macOS).

## „Der Browserspeicher ist voll"

Der Browserspeicher ist voll; Ihre Einrichtung wurde **nicht** gespeichert.

**Sofort:** *Speichern* in der Kopfzeile, um die Arbeit in eine Datei zu retten.

**Danach:** Nicht mehr benötigte Produkte löschen, besonders solche mit großem Logo. Logos als SVG statt als PNG hinterlegen — sie sind um ein Vielfaches kleiner.

Das Hintergrundbild kommt dafür nicht infrage: Es liegt gar nicht in diesem Speicher, sondern getrennt davon.

## Der Export macht nichts oder liefert Unbrauchbares

**Browser prüfen.** Der Export ist für Chrome und Edge geprüft. In Safari ist er nicht zuverlässig.

**Download-Sperre prüfen.** Manche Browser blockieren mehrere Downloads nacheinander. Beim ZIP-Export fällt nur eine Datei an; bei wiederholten Einzelexporten kann die Sperre greifen.

## Der Titel ist im Export abgeschnitten

Das ist gewollt, wenn das Template die Zeilenzahl begrenzt. Der überstehende Teil wird an einer Wortgrenze gekürzt und mit `…` versehen.

**Lösung:** Den Titel kürzen. Oder ein Template wählen, das mehr Platz für Text vorsieht — *Example 3 — Title Card* etwa lässt drei Zeilen zu.

## Ein Farbwechsel zeigt keine Wirkung

Bearbeiten und Anzeigen sind getrennt. Sie bearbeiten möglicherweise ein anderes Set als das, welches die Vorschau zeigt.

**Lösung:** Im Bereich *Colour set* auf **Show in preview** klicken. Steht dort bereits *Active in preview*, bearbeiten Sie das richtige Set — dann nutzt das Template die geänderte Rolle an dieser Stelle schlicht nicht.

## Eine Schriftvariante ist nicht auswählbar

Die Zuordnung im Bereich *Template* bietet nur Variationen aus dem **aktuell gewählten** Font-Set an.

**Lösung:** Das passende Font-Set im Bereich *Creation* auswählen, oder die gewünschte Variation im aktuellen Set anlegen.

## Eine Datei lässt sich nicht importieren

**Meldung:** *No Brand Kit setup* oder *The file belongs to …*

Die Datei trägt nicht die Kennung des Brand Kit Generators. Entweder stammt sie aus einem anderen Werkzeug, oder es ist gar keine Einrichtung — sondern etwa die `brand-setup.json` aus einem ZIP eines sehr alten Standes.

**Lösung:** Eine Datei verwenden, die über *Speichern* dieser Anwendung entstanden ist.

## Ein Template ist aus der Auswahl verschwunden

Es wurde über **Remove** aus dem Katalog genommen. Die Datei ist noch da.

**Lösung:** Im Bereich *Template* auf **Restore** in der Hinweiszeile klicken. Alternativ stellt *Reset to factory defaults* den vollständigen Katalog wieder her — setzt dabei allerdings auch alles andere zurück.

## Die Oberfläche ist in der falschen Sprache

Die Anwendung richtet sich nach dem, was Ihr Browser meldet, und fällt auf Englisch zurück.

**Lösung:** Die Schaltfläche **DE / EN** in der Kopfzeile wechselt jederzeit; die Wahl wird gemerkt. Sie zeigt die Sprache, in die sie wechseln würde.

## Nichts hilft

Setzen Sie als letzten Schritt zurück — aber **sichern Sie vorher** über *Speichern*. Danach können Sie die Datei wieder laden und sehen, ob das Problem an der Einrichtung lag oder am Programmstand.
