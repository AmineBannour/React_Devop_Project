#!/bin/bash
mkdir -p artifacts

# Try 10 times before failing
for i in {1..10}; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://mern-backend:5000)
    echo "Attempt $i: status = $STATUS"
    
    if [ "$STATUS" -eq 200 ]; then
        echo "BACKEND OK" > artifacts/backend-smoke.txt
        exit 0
    fi
    
    sleep 3
done

echo "BACKEND FAILED ($STATUS)" > artifacts/backend-smoke.txt
exit 1
