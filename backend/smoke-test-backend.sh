#!/bin/bash

mkdir -p artifacts

URL="http://backend:5000/"   # correct service name + correct port

echo "Testing backend at $URL"

for i in {1..20}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)
  echo "Attempt $i: status = $STATUS"

  if [ "$STATUS" -eq 200 ]; then
    echo "BACKEND OK" > artifacts/backend-smoke.txt
    exit 0
  fi

  sleep 3
done

echo "BACKEND FAILED" > artifacts/backend-smoke.txt
exit 1
