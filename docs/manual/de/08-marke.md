# Marke: Produkte und Unternehmen

Diese beiden Bereiche enthalten, was sich selten ändert. Einmal eingerichtet, fassen Sie sie kaum noch an.

## Unternehmen

Vier Angaben, die in fast jedem Template vorkommen:

| Feld | Erscheint als |
| --- | --- |
| **Name** | `company.name` |
| **Slogan** | `company.slogan` |
| **Copyright** | `company.copyright` |
| **Logo** | `company.logo` |

Die Copyright-Zeile ist meist die kleinste Schrift im Overlay — ein `© Ihre Firma` in einer Ecke. Sie ist keine Rechtsabteilung, sondern eine Signatur.

## Produkte

Ein Produkt ist alles, was eine eigene Identität hat: eine Sendung, ein Spiel, eine Reihe, ein Format. Jedes bekommt Titel, Slogan und Logo.

**New** legt ein neues an, **Duplicate** kopiert das aktuelle — praktisch für eine Reihe, die sich nur im Namen unterscheidet.

Der Eintrag *Default* lässt sich wie überall weder umbenennen noch löschen; er ist die Rückfalloption, wenn ein Produkt gelöscht wird.

> [!TIP] Der Produkttitel steckt im Dateinamen
> Beim Export wird der Produkttitel Teil des Dateinamens. Ein aussagekräftiger Titel erspart Ihnen das spätere Sortieren im Download-Ordner.

## Logos hochladen

Beide Bereiche nehmen ein Logo über **Change logo** entgegen. Zwei Dinge passieren dabei automatisch.

### Rasterbilder werden verkleinert

PNG, JPEG und WebP werden auf höchstens 512 × 512 Pixel heruntergerechnet, unter Beibehaltung des Seitenverhältnisses. Kleinere Bilder bleiben unangetastet.

Der Grund ist der Browserspeicher. Er fasst typischerweise rund 5 MB, und ein hochauflösendes Logo als eingebettete Bilddatei kann davon allein mehrere verbrauchen. Ohne Verkleinerung wäre der Speicher nach zwei, drei Logos voll — und die gesamte Einrichtung ließe sich nicht mehr sichern.

512 Pixel genügen: Selbst im größten Format wird ein Logo selten über 150 Pixel dargestellt.

### SVG-Dateien werden gesäubert

Eine SVG-Datei ist ausführbarer Code. Sie kann Skripte, Ereignisbehandlung und Verweise nach außen enthalten. Hochgeladene SVGs werden deshalb geprüft und von allem befreit, was nicht zur Zeichnung gehört. Lässt sich eine Datei nicht sinnvoll säubern, wird sie mit einer Meldung abgelehnt.

Für Logos ist SVG die bessere Wahl: beliebig skalierbar bei winziger Dateigröße.

> [!WARNING] Speicher voll
> Meldet die Anwendung *Der Browserspeicher ist voll*, wurde Ihre Einrichtung **nicht** gespeichert. Sichern Sie sofort über *Speichern* in eine Datei und entfernen Sie dann nicht mehr benötigte Produkte oder besonders große Logos.

## Wo die Werte landen

Ob und wo eine Angabe erscheint, bestimmt allein das Template. *Example 1 — Corner Bug* benutzt ausschließlich die Unternehmensangaben, *Example 2 — Angled Bar* ausschließlich das Produkt. Welche Platzhalter ein Template belegt, zeigt der Bereich *Template*.
