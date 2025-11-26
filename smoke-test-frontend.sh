#!/bin/bash
mkdir -p artifacts

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$STATUS" -eq 200 ]; then
  echo "FRONTEND OK" > artifacts/frontend-smoke.txt
  exit 0
else
  echo "FRONTEND FAILED ($STATUS)" > artifacts/frontend-smoke.txt
  exit 1
fi
