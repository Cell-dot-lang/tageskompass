# Optionaler KI-Endpunkt

Der Planer funktioniert vollständig ohne diesen Ordner. Standardmäßig wird eine lokale, regelbasierte Auswertung im Browser verwendet.

Dieser Worker ist nur für eine hochwertigere KI-Zusammenfassung gedacht. Der API-Schlüssel bleibt dabei als Server-Secret im Worker und wird niemals in GitHub Pages oder im Browser gespeichert.

## Benötigte Variablen

- `ANTHROPIC_API_KEY`: als Secret
- `ANTHROPIC_MODEL`: Modell-ID als normale Umgebungsvariable
- `ALLOWED_ORIGIN`: optional die genaue GitHub-Pages-Adresse, zum Beispiel `https://deinname.github.io`

Nach der Veröffentlichung trägst du die Worker-Adresse im Planer unter `Einstellungen & Datenschutz` ein und aktivierst den eigenen KI-Endpunkt.

Wichtig: Bei aktivierter KI-Auswertung wird der jeweilige Journaleintrag an den von dir eingerichteten Worker und von dort an den KI-Anbieter übertragen. Die Offline-Auswertung sendet dagegen nichts ins Internet.
