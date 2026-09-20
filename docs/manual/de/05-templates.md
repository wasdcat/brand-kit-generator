# Templates

Ein Template ist das Layout eines Overlays. Technisch ist es eine ganz normale HTML-Datei unter `src/templates/`, deren gesamtes Design in ihrem CSS steckt. Die Anwendung füllt Farben, Schriften und Texte ein — die Anordnung bestimmt das Template.

Daraus folgt etwas Praktisches: Wer HTML und CSS kann, kann ein Template bauen, ohne eine Zeile Programmcode anzufassen. Und jede Template-Datei lässt sich einzeln im Browser öffnen; sie zeigt dann Beispielwerte und sieht aus wie in der Anwendung.

## Die mitgelieferten Templates

| Template | Aufbau |
| --- | --- |
| **Lower Third** | Der klassische Balken über die volle Breite am unteren Rand: Produktlogo, Markenzeile mit bis zu zwei Tags, Titel und Copyright-Zeile. Für Video und Stream. |
| **Example 1 — Corner Bug** | Reduziert auf ein Senderlogo oben rechts: Firmenlogo, Firmenname, darunter der Slogan. Benutzt keinen Post-Inhalt und bleibt deshalb über jedem Material lesbar. |
| **Example 2 — Angled Bar** | Ein Balken unten links, nur so breit wie nötig, mit schräg angeschnittener rechter Kante und einer Akzentleiste an der linken Seite. |
| **Example 3 — Title Card** | Eine ganzflächige Karte für Feed-Posts: Tags, großer Titel, Untertitel und Beschreibung über einem von unten aufblendenden Verlauf, unten Produktlogo und Copyright. |

Die drei Beispiele sind als Anschauungsmaterial gedacht. Sie zeigen drei sehr verschiedene Umgangsweisen mit derselben Mechanik.

## Platzhalter

Der Block *Placeholders in this template* zeigt alle zwölf Platzhalter, die es gibt. Hervorgehoben sind die, die das gewählte Template verwendet.

| Platzhalter | Kommt aus |
| --- | --- |
| `title`, `subtitle`, `description`, `tag`, `tag2` | Bereich *Creation* |
| `product.title`, `product.slogan`, `product.logo` | Bereich *Products* |
| `company.name`, `company.slogan`, `company.copyright`, `company.logo` | Bereich *Company* |

Steht dort eine Warnung über *unknown placeholders*, verwendet die Template-Datei einen Namen, den die Anwendung nicht kennt — meist ein Tippfehler in der Datei.

## Typografie zuordnen

Darunter steht für jeden Platzhalter, den das Template benutzt, eine Zeile mit zwei Feldern:

- **Variation** — welche Schriftvariante aus dem gewählten Font-Set
- **Weight** — welche Strichstärke. Der Bereich hängt von der Schriftfamilie ab; das Feld nennt den der verwendeten.

Die Schriftgröße steht bewusst **nicht** hier. Sie bleibt im Template, weil sie dort Element für Element und Format für Format abgestimmt ist. Im Lower Third wächst der Titel vom Querformat zum Hochformat um das 1,4-fache, die Markenzeile aber nur um das 1,2-fache — damit der Titel im schmalen Format stärker dominiert. Eine einzelne Zahl in der Anwendung könnte das nicht ausdrücken.

> [!NOTE] Die Arbeitsteilung
> Die **Schriftfamilie und ihre Achsen** legen Sie im Font-Set fest. Welche **Variante und Strichstärke** ein Platzhalter benutzt, bestimmen Sie hier. Die **Größe** bleibt im Template. Jede Ebene entscheidet, was sie am besten beurteilen kann.

## Templates aus dem Katalog nehmen

Unter der Auswahl steht der Dateipfad und daneben **Remove**. Der Knopf fragt einmal nach.

> [!IMPORTANT] Entfernen löscht keine Datei
> Ein Template ist eine Datei auf der Festplatte, und ein Browser darf keine Dateien löschen. **Remove** nimmt den Eintrag aus dem Katalog und merkt sich das. Die Datei bleibt unter `src/templates/` liegen und steht weiter im Manifest.

Sobald etwas entfernt ist, erscheint darunter eine Zeile mit den entfernten Templates und einem **Restore**-Knopf, der alle auf einmal zurückholt. Auch *Reset to factory defaults* in der Kopfzeile stellt den vollständigen Katalog wieder her.

Das letzte verbleibende Template lässt sich nicht entfernen — ohne Template gäbe es nichts zu rendern.

## Ein eigenes Template hinzufügen

Für alle, die selbst eines bauen wollen:

1. Eine HTML-Datei in `src/templates/` anlegen. Am einfachsten eine der mitgelieferten kopieren und umbauen.
2. Den Dateinamen in `src/templates/manifest.json` unter `templates` eintragen.
3. Die Seite neu laden. Das Template steht im Katalog.

Name, Beschreibung und Kategorie liest die Anwendung aus `<title>` und den `<meta>`-Angaben der Datei — sie gehören nicht ins Manifest.

Programmcode muss dafür nicht angefasst werden.
