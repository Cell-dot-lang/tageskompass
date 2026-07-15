# Tageskompass – ADHS-Planer

Installierbare Progressive Web App für GitHub Pages. Sie bündelt Tagesplanung, Apple-Kalender, ADHS-Check-in, Grundversorgung, Medikamentenbeobachtung und ein privates Journal.

## Hauptfunktionen

- Heute-Dashboard mit nächstem Schritt, Terminen, Grundversorgung und Check-in
- Wochen- und Tagesansicht
- Aufgaben mit Uhrzeit und Kategorie
- Apple-Kalender-Import über einen schreibgeschützten iCloud-Kalender-Feed
- ADHS-informierter Check-in
- Grundversorgung ohne Streak- oder Perfektionsdruck
- Elvanse 60 mg morgens: Wirkung dokumentieren
- separates Freitextfeld für Nebenwirkungen
- Tagesjournal mit privater Offline-Gefühlsreflexion
- optionale KI-Auswertung über einen eigenen Worker
- Offline-Nutzung nach dem ersten Laden
- Datenexport und Datenimport

## GitHub Pages

1. Erstelle bei GitHub ein neues öffentliches Repository, zum Beispiel `tageskompass`.
2. Lade **den Inhalt dieses Ordners** hoch. `index.html` muss direkt in der obersten Ebene liegen.
3. Öffne `Settings` → `Pages`.
4. Wähle `Deploy from a branch`, Branch `main`, Ordner `/ (root)`.
5. Öffne die von GitHub angezeigte Pages-Adresse.
6. Installiere die Seite auf dem iPhone über Safari → Teilen → `Zum Home-Bildschirm`.

## Apple-Kalender

Eine Webseite darf nicht direkt auf die lokale Apple-Kalender-App zugreifen. Die automatische, schreibgeschützte Übernahme läuft deshalb so:

`Apple Kalender → öffentlicher iCloud-Kalenderlink → Cloudflare Worker → Tageskompass`

Die Einrichtung steht unter `calendar-worker/README.md`.

Empfehlung: Lege in Apple Kalender einen eigenen Kalender `Tageskompass` an und teile nur diesen öffentlich. Der lange iCloud-Link wird als Secret im Worker gespeichert und nicht in GitHub veröffentlicht.

## Speicherung und Synchronisation

Standardmäßig liegen Aufgaben, Check-ins und Journaleinträge ausschließlich im Browser des jeweiligen Geräts. Der Apple-Kalender wird gelesen, aber nicht verändert. Für eine echte Synchronisation eigener Planerdaten zwischen iPhone, iPad und Mac wäre ein Benutzerkonto mit Datenbank erforderlich; diese Version enthält bewusst noch keinen zentralen Cloudspeicher.

## Journal und KI

Die eingebaute Offline-Auswertung verschickt keinen Journaleintrag. Der Ordner `optional-ai-worker` enthält eine optionale Servervorlage für eine sprachlich bessere KI-Reflexion. Ein API-Schlüssel gehört ausschließlich als Secret in den Worker und niemals in GitHub oder in die App-Einstellungen.

## Gesundheitshinweis

Der Planer unterstützt Selbstbeobachtung und Organisation. Er diagnostiziert nicht und ersetzt keine ärztliche oder psychotherapeutische Beratung. Medikamenteneinnahme und Dosis sollen nicht aufgrund der App verändert werden.
