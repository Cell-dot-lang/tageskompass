# Tageskompass-Update

Lade die folgenden vier Dateien in die oberste Ebene deines GitHub-Repositorys hoch und bestätige das Ersetzen der vorhandenen Dateien:

- `index.html`
- `app.js`
- `styles.css`
- `service-worker.js`

Danach den neuen GitHub-Pages-Lauf unter **Actions** abwarten.

## Wetter

Beim ersten Öffnen fragt die App nach dem Standort. Die Koordinaten werden nur für die Wetterabfrage verwendet und nicht dauerhaft gespeichert. Angezeigt werden aktuelle, höchste und niedrigste Temperatur. Wetterdaten werden spätestens nach 30 Minuten erneuert.

## Kalender

Die automatische Kalenderabfrage funktioniert, sobald unter **Einstellungen → Apple-Kalender** der Kalender-Worker aktiviert und dessen Adresse eingetragen ist. Die App aktualisiert dann:

- bei jedem vollständigen App-Start,
- nach der Rückkehr in die App, wenn die letzte Abfrage älter als 15 Minuten ist,
- sobald eine unterbrochene Internetverbindung zurückkehrt,
- sowie über den Aktualisieren-Button.

Der Kalender-Worker muss entsprechend `calendar-worker/README.md` einmalig bei Cloudflare eingerichtet sein.
