
#!/bin/bash
BASE_URL="http://localhost:3000/api/menus"
# Login
TOKEN=$(curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"verifier", "password":"password"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed."
#  exit 1
fi

echo "Token: ${TOKEN:0:10}..."

echo "------------------------------------------------"
echo "1. Verify 3-level depth limit (Expect 500)..."
CODE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/test-menu" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "label": "L1", "link": "/", "children": [
          {
            "label": "L2", "link": "/", "children": [
              {
                "label": "L3", "link": "/", "children": [
                   { "label": "L4", "link": "/" } 
                ]
              }
            ]
          }
        ]
      }
    ]
  }')
echo "Response Code: $CODE"
if [[ "$CODE" == "500" ]]; then echo "PASS"; else echo "FAIL"; fi

echo "------------------------------------------------"
echo "2. Verify 3-level depth limit (Expect 200)..."
CODE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/test-menu" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "label": "L1", "link": "/", "children": [
          {
            "label": "L2", "link": "/", "children": [
              {
                "label": "L3", "link": "/"
              }
            ]
          }
        ]
      }
    ]
  }')
echo "Response Code: $CODE"
if [[ "$CODE" == "200" ]]; then echo "PASS"; else echo "FAIL"; fi

echo "------------------------------------------------"
echo "3. Verify Social Links..."
curl -v -X POST "$BASE_URL/social/links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
      "links": [
          { "platform": "facebook", "name": "FB", "url": "https://fb.com", "is_active": true }
      ]
  }'

echo "Retrieving..."
curl -s "$BASE_URL/social/links"
