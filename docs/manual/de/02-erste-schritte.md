# Erste Schritte

## Die Anwendung starten

Die Anwendung braucht einen Webserver. Es genügt ein sehr einfacher, der nur Dateien ausliefert.

**Mit Visual Studio Code:** Die Erweiterung *Live Server* installieren, im Projekt einen Rechtsklick auf `src/index.html`, dann *Open with Live Server*.

**Mit Python:** Im Ordner `src/` ein Terminal öffnen und starten:

```bash
python -m http.server 8000
```

Danach `http://localhost:8000/index.html` im Browser aufrufen.

> [!TIP] Woran Sie erkennen, dass es läuft
> Die Adresszeile beginnt mit `http://`, und im Vorschaubereich rechts erscheint das Overlay auf einem Karomuster. Steht dort stattdessen „The template could not be rendered", wurde die Datei per Doppelklick geöffnet.

## Ihr erster Post in fünf Schritten

Beim ersten Start ist alles mit Beispielwerten gefüllt. Sie können sofort loslegen.

**1. Format wählen.** Über der Vorschau stehen die vier Formate. Klicken Sie auf das, für das Sie das Overlay brauchen — etwa `9:16` für eine Story.

**2. Text eingeben.** Der Bereich *Creation* ist beim Start geöffnet. Tragen Sie unter *Content for this post* Ihren Titel ein. Die Vorschau zieht sofort nach.

**3. Aussehen wählen.** Weiter oben im selben Bereich stehen vier Auswahlfelder: Produkt, Template, Font-Set und Farbset. Probieren Sie ein anderes Farbset aus — das Overlay wechselt die Farbe, der Text bleibt stehen.

**4. Gegen echtes Material prüfen.** Rechts über der Vorschau schaltet eine Reihe von Symbolen den Hintergrund um: dunkles und helles Karomuster, Schwarz, Weiß und — über das Bildsymbol — ein eigenes Hintergrundbild. So sehen Sie, ob das Overlay über Ihrem Material lesbar bleibt. Ein Hintergrundbild ist dabei mehr als eine Ansichtshilfe: Es wird unter dem Overlay mitexportiert.

**5. Exportieren.** Unten rechts erzeugt **PNG** die Datei für das gerade gewählte Format. **ZIP (all formats)** legt alle ausgewählten Formate zusammen in ein Archiv.

Fertig. Die PNG-Datei liegt in Ihrem Download-Ordner und kann in den Schnitt.

## Was Sie als Nächstes einrichten sollten

Die Beispielwerte sind zum Ausprobieren da. Für den täglichen Gebrauch lohnen sich drei Dinge, in dieser Reihenfolge:

1. **Unternehmen** (Bereich *Company*): Name, Slogan, Copyright-Zeile und Logo. Das ändert sich selten und steckt in fast jedem Template.
2. **Produkt** (Bereich *Products*): Für jede Sendung, jedes Spiel oder jede Reihe ein eigener Eintrag mit Titel und Logo.
3. **Farbset** (Bereich *Colour set*): Die Hausfarben als eigenes Set anlegen, statt jedes Mal die Standardfarben zu nehmen.

Danach besteht ein neuer Post nur noch aus: Produkt wählen, Titel tippen, exportieren.

> [!NOTE] Alles wird automatisch gespeichert
> Sie müssen nichts sichern. Jede Änderung landet sofort im Speicher des Browsers und ist nach einem Neuladen wieder da. Eine Datei-Sicherung brauchen Sie erst, wenn Sie die Einrichtung auf einen anderen Rechner bringen oder gegen einen geleerten Browserspeicher absichern wollen.
