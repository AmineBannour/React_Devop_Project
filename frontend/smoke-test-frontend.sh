#!/bin/bash
mkdir -p artifacts

URL="http://frontend/"   # Docker service name + internal port 80

echo "Testing frontend at $URL"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ "$STATUS" -eq 200 ]; then
  echo "FRONTEND OK" > artifacts/frontend-smoke.txt
  exit 0
else
  echo "FRONTEND FAILED ($STATUS)" > artifacts/frontend-smoke.txt
  exit 1
fi
