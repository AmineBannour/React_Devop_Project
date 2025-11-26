#!/bin/bash

mkdir -p artifacts

# Try 10 times because backend may take time to start
for i in {1..10}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://backend:5000/)
  echo "Attempt $i: status = $STATUS"

  if [ "$STATUS" -eq 200 ]; then
    echo "BACKEND OK" > artifacts/backend-smoke.txt
    exit 0
  fi

  sleep 3
done

echo "BACKEND FAILED" > artifacts/backend-smoke.txt
exit 1
