#!/usr/bin/env bash
set -euo pipefail

cd /opt/trustedskills

log() {
  printf '\n[%s] %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*"
}

log "Cleaning stale Next build output"
rm -rf /opt/trustedskills/.next

log "Building TrustedSkills"
npm run build

log "Restarting PM2 app 0 with correct PM2_HOME"
PM2_HOME=/root/.pm2 pm2 restart 0

log "Purging Cloudflare cache"
CF_KEY=$(cat /opt/app/openclaw/credentials/cloudflare-api-key)
curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/6768c255376b65f261dac167b948880c/purge_cache" \
  -H "X-Auth-Email: peterd@xtopia.com.au" \
  -H "X-Auth-Key: ${CF_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}' >/tmp/trustedskills-cf-purge.json

log "Verifying live deployment"
npm run verify-deploy

log "Checking recent runtime logs for deployment mismatch churn"
RECENT_LOG=$(tail -200 /root/.pm2/logs/trustedskills-error.log 2>/dev/null || true)
if printf '%s' "$RECENT_LOG" | grep -q 'Failed to find Server Action'; then
  COUNT=$(printf '%s' "$RECENT_LOG" | grep -c 'Failed to find Server Action' || true)
  log "WARN: detected ${COUNT} recent 'Failed to find Server Action' log lines"
  log "This usually means stale clients from older deployments still hit the new server"
fi

log "Safe deploy completed"
