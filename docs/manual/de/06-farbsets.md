# Farbsets

Ein Farbset ist eine benannte Zusammenstellung von sieben Farben. Der Wechsel des Sets färbt das Overlay um, ohne das Layout zu berühren.

## Die sieben Rollen

Farben werden nicht einzelnen Elementen zugewiesen, sondern **Rollen**. Das Template entscheidet, welche Rolle wo auftaucht.

| Rolle | Wofür sie gedacht ist |
| --- | --- |
| **Hintergrund** | Flächen, etwa der Balken eines Lower Third |
| **Akzent** | Hervorhebungen, etwa der Produktname oder ein Tag |
| **Sekundär** | Zweite Akzentfarbe, etwa die Mitte eines Verlaufs |
| **Rahmen** | Kanten und Linien |
| **Text** | Fließtext, etwa der Titel |
| **Subtext** | Zweite Textebene, etwa der Untertitel |
| **Beschreibung** | Kleinste Textebene |

Sieben Rollen sind bewusst wenig. Sie zwingen zu einer Entscheidung, statt eine Palette wuchern zu lassen — und sie sorgen dafür, dass ein Farbset in jedem Template funktioniert, auch in einem, das es noch nicht gab.

## Zuweisung

Unter den Farbwerten steht der Block *Zuweisung*. Dort legen Sie fest, **welche Rolle ein Designobjekt benutzt**:

| Objekt | Vorgabe |
| --- | --- |
| Tag 1 | Akzent |
| Tag 2 | Sekundär |

Das erzeugt keine achte Farbe. Die Zuweisung zeigt lediglich auf eine der sieben vorhandenen. Wollen Sie beide Tags gleich einfärben, stellen Sie beide auf dieselbe Rolle.

*Hintergrund* wird bewusst nicht angeboten: Die Schrift **in** einem Chip läuft in der Hintergrundfarbe. Ein Chip in derselben Farbe wäre unsichtbar.

## Sets verwalten

**Duplizieren** legt eine Kopie des gerade bearbeiteten Sets an. So entstehen neue Sets — Sie fangen nie bei Null an.

**In der Vorschau zeigen** übernimmt das bearbeitete Set in die Vorschau. Bearbeiten und Anzeigen sind getrennt: Sie können an einem Set arbeiten, während die Vorschau ein anderes zeigt. Ist das bearbeitete Set bereits aktiv, steht dort *In der Vorschau aktiv*.

**Zurücksetzen** stellt ein mitgeliefertes Set auf seinen Werkszustand zurück. Bei selbst angelegten Sets gibt es keinen Werkszustand; die Anwendung sagt das dann.

**Löschen** entfernt ein Set. Beide Knöpfe fragen einmal nach (mit **Sicher?**).

## Der Eintrag „Default"

In jeder Liste steht ein Eintrag namens **Default**. Er lässt sich weder umbenennen noch löschen. Er ist die Rückfalloption: Wird ein Set gelöscht oder verweist eine geladene Einrichtung auf ein Set, das es hier nicht gibt, greift immer *Default*.

Das Standard-Farbset ist neutral und kontraststark gehalten, damit es über beliebigem Material funktioniert. Die fünf benannten Sets daneben sind die eigentliche Gestaltungsarbeit.

> [!TIP] Hausfarben anlegen
> Duplizieren Sie *Default*, benennen Sie die Kopie nach Ihrer Marke und tragen Sie die Farbwerte ein. Danach ist Ihr Set ein Klick im Bereich *Erstellen* — und Sie müssen nie wieder Hex-Werte eintippen.
