# Apple-Kalender-Worker

Dieser Worker liest einen schreibgeschützten öffentlichen iCloud-Kalender-Feed und stellt der App nur normalisierte Termine bereit.

## Einrichtung

1. Erstelle in Apple Kalender am besten einen eigenen Kalender für den Tageskompass.
2. Teile diesen Kalender als **öffentlichen Kalender** und kopiere den `webcal://...`-Link.
3. Erstelle bei Cloudflare Workers einen neuen Worker und ersetze den Code durch `worker.js`.
4. Lege unter **Settings → Variables and Secrets** an:
   - Secret `ICLOUD_CALENDAR_URL` = dein vollständiger `webcal://...`-Link
   - Variable `ALLOWED_ORIGIN` = deine GitHub-Pages-Adresse, z. B. `https://name.github.io`
5. Deploye den Worker.
6. Trage dessen Adresse in der Tageskompass-App unter Einstellungen → Apple-Kalender ein.

Der Kalender wird beim Öffnen der App und über „Aktualisieren“ geladen. Die Verbindung ist nur lesend.

## Datenschutz

Ein öffentlich geteilter iCloud-Kalender ist für alle Personen lesbar, die den langen Link kennen. Nutze deshalb möglichst einen separaten Kalender und veröffentliche dort keine besonders sensiblen Inhalte.
