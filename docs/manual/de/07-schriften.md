# Schriften und Typografie

## Die mitgelieferten Schriften

Sieben Familien liegen im Projekt. Nichts wird von einem Schriften-Dienst nachgeladen — das hält den Export berechenbar und sorgt dafür, dass ein Overlay auch dann noch gleich aussieht, wenn ein Anbieter seine Schrift aktualisiert.

| Familie | Gedacht für | Zusätzliche Achsen |
| --- | --- | --- |
| **Recursive** | Hausschrift von WASDCAT | `CASL`, `MONO`, `slnt`, `CRSV` |
| **Orbitron** | Gaming-Display | – |
| **Archivo** | Arbeitstier mit einstellbarer Breite | `wdth` 62–125 |
| **Inter** | Neutraler Inhalt | – |
| **Space Grotesk** | Technische Grotesk | – |
| **Fraunces** | Redaktionelle Serifenschrift | `SOFT`, `WONK` |
| **Open Sans** | Die Oberflächenschrift dieser Anwendung | `wdth` 75–100 |

Alle sieben sind **Variable Fonts**: eine Datei, die einen ganzen Gestaltungsraum enthält statt einzelner Schnitte.

## Variation und Font-Set

Eine **Variation** beantwortet die Frage *welche Schrift, wie eingestellt*: eine Familie plus Werte für ihre Achsen. Ein **Font-Set** ist eine benannte Gruppe solcher Variationen und funktioniert genau wie ein Farbset — mehrere davon, umschaltbar, mit der Einrichtung gespeichert.

Mitgeliefert wird ein Font-Set namens *Default* mit einer einzigen Variation auf Open Sans. Mehr ist nicht vorgegeben: Die Typografie einer Marke entsteht hier, sie wird nicht mitgeliefert.

### Achsen einstellen

Für jede Achse der gewählten Familie erscheint ein Regler. Bei Recursive etwa:

- **CASL** blendet von technisch zu handschriftlich
- **MONO** von proportional zu dicktengleich
- **slnt** neigt die Schrift

Wechseln Sie bei einer Variation die Familie, fallen Achsen weg, die die neue nicht kennt, und die verbleibenden werden in ihren gültigen Bereich gebracht.

### Warum keine Strichstärke

Eine Variation trägt bewusst **weder Strichstärke noch Größe**. Beides ist Hierarchie, und Hierarchie gehört zum Element, nicht zur Schrift:

| Was | Wo eingestellt |
| --- | --- |
| Familie und Achsenwerte | Bereich *Font-Set*, je Variation |
| Welche Variation und Strichstärke ein Platzhalter benutzt | Bereich *Template*, je Platzhalter |
| Größe, einschließlich der Abstufung je Format | CSS des Templates |

Eine globale Strichstärke würde die Abstufung, die ein Template aufbaut, entweder einebnen oder ihr entgegenarbeiten.

> [!NOTE] Werte werden angepasst, nicht abgelehnt
> Tragen Sie eine Strichstärke ein, die die gewählte Familie nicht erreicht, wird sie auf den nächstgelegenen gültigen Wert gebracht. Open Sans endet zum Beispiel bei 800 — ein eingetragenes 900 wird zu 800.

## Sets verwalten

**Duplizieren** kopiert das bearbeitete Font-Set samt seiner Variationen. Genau wie bei Farbsets stehen auch hier **In der Vorschau zeigen** (bzw. **In der Vorschau aktiv**), **Zurücksetzen** und **Löschen** zur Verfügung. Über **+ Hinzufügen** legen Sie innerhalb eines Sets weitere Variationen an. Dadurch bleibt die Zuordnung der Platzhalter über Sets hinweg funktionsfähig.

Jedes Font-Set behält eine Variation namens *Default* — auch ein dupliziertes. So läuft die Zuordnung eines Platzhalters nie ins Leere.

Wechseln Sie das Font-Set und kennt das neue eine zugeordnete Variation nicht, fällt der betroffene Platzhalter auf *Default* zurück, statt ins Nichts zu zeigen.

## Eine Schrift hinzufügen

Das ist ein Eingriff ins Projekt, kein Bedienschritt:

1. Die `.woff2`-Datei nach `src/fonts/` legen
2. Einen `@font-face`-Block in `src/fonts/fonts.css` ergänzen
3. Einen Eintrag in `src/fonts.js` anlegen und dort unter `axes` jede Achse nennen, die einstellbar sein soll
4. Den Lizenztext an `src/fonts/LICENSES.txt` anhängen

Schritt 4 ist keine Formalie: Die mitgelieferten Schriften stehen unter der SIL Open Font License, die bei Weitergabe die Lizenz verlangt.
