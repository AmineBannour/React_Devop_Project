#!/bin/bash
mkdir -p artifacts

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000)

if [ "$STATUS" -eq 200 ]; then
  echo "BACKEND OK" > artifacts/backend-smoke.txt
  exit 0
else
  echo "BACKEND FAILED ($STATUS)" > artifacts/backend-smoke.txt
  exit 1
fi
