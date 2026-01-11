#!/bin/bash

# Configuration
API_URL="http://localhost:3000/api"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
NEW_USER="test_user_$(date +%s)"
NEW_PASS="password123"
PAGE_SLUG="test-page-$(date +%s)"

echo "=============================================="
echo "CMS Automated Workflow Test"
echo "=============================================="

# 1. Login as Admin
echo ""
echo "[1] Logging in as Admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$ADMIN_USER\", \"password\": \"$ADMIN_PASS\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Admin Login Failed"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi
echo "✅ Admin Login Successful (Token received)"

# 2. Create New User
echo ""
echo "[2] Creating New User: $NEW_USER..."
CREATE_USER_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$NEW_USER\", \"password\": \"$NEW_PASS\", \"role\": \"editor\"}")

HTTP_CODE=${CREATE_USER_RESPONSE: -3}
if [ "$HTTP_CODE" == "201" ]; then
  echo "✅ User Created Successfully"
else
  echo "❌ User Creation Failed (HTTP $HTTP_CODE)"
  exit 1
fi

# 3. Login as New User
echo ""
echo "[3] Logging in as New User..."
NEW_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$NEW_USER\", \"password\": \"$NEW_PASS\"}")

NEW_TOKEN=$(echo $NEW_LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$NEW_TOKEN" ]; then
  echo "❌ New User Login Failed"
  exit 1
fi
echo "✅ New User Login Successful"

# 4. Create New Page
echo ""
echo "[4] Creating New Page ($PAGE_SLUG)..."
CREATE_PAGE_RESPONSE=$(curl -s -X POST "$API_URL/pages" \
  -H "Authorization: Bearer $NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"slug_key\": \"$PAGE_SLUG\", \"template\": \"default\"}")

PAGE_ID=$(echo $CREATE_PAGE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$PAGE_ID" ]; then
  echo "❌ Page Creation Failed"
  echo "Response: $CREATE_PAGE_RESPONSE"
  exit 1
fi
echo "✅ Page Created (ID: $PAGE_ID)"

# 5. Add Content to Draft
echo ""
echo "[5] Saving Draft Content..."
DRAFT_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_URL/pages/$PAGE_ID/draft" \
  -H "Authorization: Bearer $NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lang": "en",
    "title": "Automated Test Page",
    "slug_localized": "'"$PAGE_SLUG"'",
    "content_json": [{"type": "text", "content": "This is a test block."}]
  }')

HTTP_CODE=${DRAFT_RESPONSE: -3}
if [ "$HTTP_CODE" == "200" ]; then
  echo "✅ Draft Saved Successfully"
else
  echo "❌ Draft Save Failed (HTTP $HTTP_CODE)"
  exit 1
fi

# 6. Publish Page
echo ""
echo "[6] Publishing Page..."
PUBLISH_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_URL/pages/$PAGE_ID/publish" \
  -H "Authorization: Bearer $NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lang": "en",
    "title": "Automated Test Page",
    "slug_localized": "'"$PAGE_SLUG"'",
    "content_json": [{"type": "text", "content": "This is a test block."}]
  }')

HTTP_CODE=${PUBLISH_RESPONSE: -3}
if [ "$HTTP_CODE" == "200" ]; then
  echo "✅ Page Published Successfully"
else
  echo "❌ Publish Failed (HTTP $HTTP_CODE)"
  exit 1
fi

# 7. Verify Public Access
echo ""
echo "[7] Verifying Public Access..."
PUBLIC_RESPONSE=$(curl -s "$API_URL/delivery/pages/$PAGE_SLUG?lang=en")

if echo "$PUBLIC_RESPONSE" | grep -q "Automated Test Page"; then
  echo "✅ Public Page Verified: Content found"
else
  echo "❌ Public Verification Failed"
  echo "Response: $PUBLIC_RESPONSE"
  exit 1
fi

echo ""
echo "=============================================="
echo "🎉 ALL TESTS PASSED Successfully"
echo "=============================================="
