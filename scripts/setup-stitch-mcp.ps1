# Stitch MCP — Option A (interaktiver Setup-Wizard für Cursor)
# Docs: https://stitch.withgoogle.com/docs/mcp/setup
#
# Im Projektroot ausführen:
#   powershell -ExecutionPolicy Bypass -File .\scripts\setup-stitch-mcp.ps1
#
# Wähle im Wizard:
#   - Authentication Mode: OAuth (empfohlen) oder API Key
#   - Transport: stdio (Standard)
# Kopiere die ausgegebene Config nach %USERPROFILE%\.cursor\mcp.json
# Danach Cursor vollständig neu starten.

Write-Host "Stitch MCP Setup für Cursor starten …" -ForegroundColor Cyan
Write-Host "Browser-Login und Projekt-Auswahl können erforderlich sein.`n"

npx -y @_davideast/stitch-mcp init -c cursor

if ($LASTEXITCODE -eq 0) {
  Write-Host "`nSetup abgeschlossen. Bitte Cursor neu starten und prüfen, ob stitch > 0 tools enabled zeigt." -ForegroundColor Green
} else {
  Write-Host "`nSetup fehlgeschlagen. Diagnose:" -ForegroundColor Yellow
  npx -y @_davideast/stitch-mcp doctor --verbose
}
