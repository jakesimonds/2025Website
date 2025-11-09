# Lambda CORS Fix - Enable Browser Uploads

## ⚠️ CRITICAL: Two Places to Fix CORS (Pick ONE!)

AWS Lambda Function URLs have CORS in **TWO places** - you must pick ONE approach:

**Option 1: Function URL CORS** (AWS Console) - Infrastructure level
- Easy to configure in AWS Console
- But doesn't work with custom logic
- ❌ **Do NOT use with Option 2!**

**Option 2: Lambda Code CORS** (Python handler) - Application level ← **RECOMMENDED**
- Full control over CORS logic
- Works with all response types
- ✅ **Use this approach!**

**IMPORTANT**: If you use Option 2 (code-level CORS), you MUST disable Function URL CORS in AWS Console, otherwise you'll get duplicate headers!

---

## Problem

The Lambda function at `https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/` is blocking browser requests due to missing CORS headers.

**Error in browser console:**
```
Access to fetch at 'https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/'
from origin 'http://localhost:5174' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Why Python Script Works But Browser Doesn't

- **Python script**: Server-to-server request, no CORS checks ✅
- **Browser**: Client-side request, CORS enforced by browser ❌

CORS (Cross-Origin Resource Sharing) is a **browser-only security feature** that prevents websites from making unauthorized requests to different domains.

## Current Request Format

The frontend sends this request:

**POST** `https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "image": "<base64-encoded-jpeg-data>",
  "tagId": "web-upload",
  "timestamp": "2025-11-06T02:39:55.123Z"
}
```

## Required Fix

### Step 1: Add CORS Headers to Lambda Response

Your Lambda function needs to return these headers in **ALL responses** (both success and error):

```python
{
    'statusCode': 200,  # or 400, 500, etc.
    'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  # Allow all origins
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    },
    'body': json.dumps({
        'success': True,
        'message': 'Photo posted successfully!',
        # ... rest of response
    })
}
```

### Step 2: Handle OPTIONS Preflight Requests

Browsers send an OPTIONS request before the actual POST request. Your Lambda must handle this:

```python
def lambda_handler(event, context):
    # Handle OPTIONS preflight request
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'  # Cache preflight for 24 hours
            },
            'body': ''
        }

    # Your existing POST handler code here...
    # Just make sure ALL responses include CORS headers
```

## Complete Example Lambda Handler

Here's a complete example of how your Lambda handler should look:

```python
import json
import base64
from datetime import datetime

def lambda_handler(event, context):
    # CORS headers to include in ALL responses
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    # Handle OPTIONS preflight request
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                **cors_headers,
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    try:
        # Parse request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event['body']

        # Extract data
        image_base64 = body.get('image')
        tag_id = body.get('tagId', 'unknown')
        timestamp = body.get('timestamp', datetime.utcnow().isoformat())

        # Validate image
        if not image_base64:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({
                    'success': False,
                    'error': 'No image provided'
                })
            }

        # Check image size (1MB limit)
        image_bytes = base64.b64decode(image_base64)
        size_mb = len(image_bytes) / (1024 * 1024)

        if size_mb > 1:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({
                    'success': False,
                    'error': f'Image too large: {size_mb:.2f}MB. Maximum is 1MB.'
                })
            }

        # TODO: Your existing Bluesky upload logic here
        # post_result = upload_to_bluesky(image_bytes, tag_id)

        # Success response
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({
                'success': True,
                'message': 'Photo posted successfully!',
                'postUrl': 'https://bsky.app/profile/takeAnElevatorSelfie.jakesimonds.com/post/...',
                'tagId': tag_id,
                'timestamp': timestamp
            })
        }

    except Exception as e:
        # Error response - still include CORS headers!
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({
                'success': False,
                'error': f'Internal server error: {str(e)}'
            })
        }
```

## Key Points

### 1. CORS Headers Must Be in ALL Responses
Every single response (success, error, OPTIONS) must include the CORS headers. If even one response is missing them, the browser will block it.

### 2. Handle OPTIONS Requests
Browsers send OPTIONS requests automatically. If your Lambda doesn't handle them, CORS will fail.

### 3. For Production: Restrict Origins
For security, change `'Access-Control-Allow-Origin': '*'` to specific domains:

```python
'Access-Control-Allow-Origin': 'https://yourdomain.com'
# Or multiple domains:
# Check the Origin header and allowlist specific domains
```

### 4. Lambda Function URL Configuration (CRITICAL!)

⚠️ **This is likely why it's still failing!** ⚠️

AWS Lambda Function URLs have **built-in CORS support** that must be enabled separately from your code.

**Go to AWS Console:**

1. Open AWS Lambda console: https://console.aws.amazon.com/lambda
2. Find your function (the one with this URL)
3. Click on the function name
4. Go to **"Configuration"** tab
5. Click **"Function URL"** in the left sidebar
6. Click **"Edit"** button
7. Scroll down to **"Configure cross-origin resource sharing (CORS)"**
8. Check the box: **"Configure CORS"**
9. Fill in these settings:
   ```
   Allow origin: *
   Allow methods: POST, OPTIONS
   Allow headers: Content-Type
   Expose headers: (leave empty)
   Max age: 86400
   Allow credentials: No
   ```
10. Click **"Save"**

**IMPORTANT**: Even if your Lambda code returns CORS headers, the Function URL layer might block the request before it reaches your code. You need BOTH:
- Lambda Function URL CORS config ← **Configure this first!**
- Lambda code CORS headers ← Already done ✅

### Alternative: Using AWS CLI

If you prefer command line:

```bash
aws lambda update-function-url-config \
  --function-name YOUR_FUNCTION_NAME \
  --cors '{
    "AllowOrigins": ["*"],
    "AllowMethods": ["POST", "OPTIONS"],
    "AllowHeaders": ["Content-Type"],
    "MaxAge": 86400
  }'
```

Replace `YOUR_FUNCTION_NAME` with your actual Lambda function name.

## Testing After Fix

### Test 1: OPTIONS Request (Preflight)
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/
```

**Expected response headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Test 2: Actual POST Request
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5174" \
  -d '{"image":"iVBORw0KGg...","tagId":"test","timestamp":"2025-11-06T00:00:00Z"}' \
  https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/
```

**Expected response headers:**
```
Access-Control-Allow-Origin: *
Content-Type: application/json
```

### Test 3: From Browser
After deploying the fix, test from the web app at:
- `http://localhost:5174/qr7f9k2h8d4j6m1p3s5w`

You should see network requests succeed in the Network tab.

## Frontend Context

The frontend React app (`CameraUpload.jsx`) makes this fetch request:

```javascript
const response = await fetch('https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image: base64Data,  // JPEG compressed to 80%, max 1200px width
    tagId: 'web-upload',
    timestamp: new Date().toISOString()
  })
})
```

The frontend properly compresses images to <1MB before upload:
- Resizes to max 1200px width
- JPEG quality: 80%
- Validates size before sending

## Expected Response Format

The Lambda should respond with this JSON structure:

**Success (200):**
```json
{
  "success": true,
  "message": "Photo posted successfully!",
  "postUrl": "https://bsky.app/profile/takeAnElevatorSelfie.jakesimonds.com/post/abc123",
  "tagId": "web-upload",
  "timestamp": "2025-11-06T02:39:55.123Z"
}
```

**Error (400/500):**
```json
{
  "success": false,
  "error": "Image too large. Maximum size is 1MB."
}
```

## Checklist

- [ ] Add CORS headers to all Lambda responses (success, error)
- [ ] Add OPTIONS handler for preflight requests
- [ ] Test OPTIONS request returns correct headers
- [ ] Test POST request returns correct headers
- [ ] Test from browser - no CORS errors in console
- [ ] (Optional) Configure Lambda Function URL CORS in AWS Console
- [ ] (Production) Restrict `Access-Control-Allow-Origin` to specific domains

## Questions?

If you encounter issues:

1. Check browser console for exact CORS error message
2. Check Network tab → Look for OPTIONS request (should return 200)
3. Verify response headers include `Access-Control-Allow-Origin`
4. Make sure ALL responses (not just success) include CORS headers
5. Try clearing browser cache and hard refresh

## Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [AWS Lambda Function URLs CORS](https://docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html)
