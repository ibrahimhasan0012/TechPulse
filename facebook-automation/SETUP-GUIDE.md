# Facebook Automation - Google Sheets Setup

## Google Sheets Template

Create a new Google Sheet with these columns:

| Column | Header | Description |
|--------|--------|-------------|
| A | message | Your post text content |
| B | image_url | URL to image (leave empty for text-only posts) |
| C | posted | Leave empty - will be marked "YES" after posting |
| D | posted_at | Leave empty - will be timestamped after posting |

### Example Content:

| message | image_url | posted | posted_at |
|---------|-----------|--------|-----------|
| Check out our latest products! | https://example.com/product.jpg | | |
| Hello everyone! Have a great day! | | | |
| New arrival alert! 🔥 | https://example.com/new.jpg | | |

---

## Setup Steps

### 1. Create Google Sheet
1. Go to https://sheets.google.com
2. Create new spreadsheet named "Facebook Posts"
3. Add headers: `message`, `image_url`, `posted`, `posted_at`
4. Add your content rows
5. Copy the spreadsheet URL

### 2. Configure n8n Google Sheets Credential
1. Open n8n
2. Go to **Settings** → **Credentials**
3. Click **Add Credential** → **Google Sheets OAuth2 API**
4. Click **Sign in with Google**
5. Authorize n8n to access your sheets

### 3. Update Workflow
1. Open the workflow in n8n
2. Replace `YOUR_GOOGLE_SHEET_URL_HERE` with your sheet URL
3. Select your Google Sheets credential
4. Test with "Execute Workflow"

---

## Image Requirements

- **Format**: JPG, PNG, GIF
- **Max Size**: 4MB for photos
- **URL**: Must be publicly accessible (not private URLs)
- **Hosts**: Use Imgur, ImgBB, Cloudinary, or your own server

### Free Image Hosting Options:
1. **ImgBB** (https://imgbb.com) - Free, no account
2. **Imgur** (https://imgur.com) - Free account
3. **Cloudinary** (https://cloudinary.com) - Free tier

---

## n8n Gadget Auto-Poster (Scraping + AI Workflow)

We've added a fully automated, 14-node workflow (`n8n-facebook-gadget-autoposter.json`) that scrapes latest products from Gadget Breeze BD, generates an engaging AI caption using OpenRouter, creates a branded poster image via a self-hosted Puppeteer service, and posts it to Facebook 5 times a day.

> [!WARNING]
> **CRITICAL: Re-importing Workflows Overwrites Sheet Selections!**
> Every time you download and **re-import** the `.json` file, your re-selected Google Sheets will be reset. You MUST re-select them after every import.

### Quick Reference: Parameters to Update
After re-importing the workflow, you will need to update these nodes:

| Node Name | Parameter | Note |
| :--- | :--- | :--- |
| **Get Posted Products** | Google Sheet Selection | Re-select your sheet |
| **Generate Caption** | Header 'Authorization' | Bearer `PASTE_OPENROUTER_KEY_HERE` |
| **Post to Facebook** | URL 'YOUR_PAGE_ID' | Check if it matches `.env` |
| **Mark as Posted** | Google Sheet Selection | Re-select your sheet |


### 1. Setup Puppeteer Screenshot Service
n8n uses this service to convert HTML templates into PNG posters for Facebook.

**Option A (Recommended): Pre-built Docker Image**
Run the official browserless Chrome container:
```bash
docker run -d -p 3000:3000 --name screenshot-service browserless/chrome
```

**Option B: Custom Node.js Service**
If you want to run the custom service we built:
```bash
cd screenshot-service
docker build -t techpulse-screenshot .
docker run -d -p 3000:3000 --name screenshot-service techpulse-screenshot
```
*Make sure n8n can access `http://localhost:3000`.*

### 2. Configure n8n Credentials
Before importing the workflow, ensure you have these credentials configured in n8n:
1. **Google Sheets OAuth2 API** (For the tracking sheet)
2. **Facebook Graph API Token** (Page Access Token with `pages_manage_posts` permission)
3. **OpenRouter API Key** (Set as a generic Header Auth credential named `Bearer PASTE_OPENROUTER_KEY_HERE`)

### 3. Setup Tracking Sheet
Create a new Google Sheet for tracking auto-posted products with these exact columns:
| product_url | product_name | posted_at |

### 4. Update the Workflow
1. Import `n8n-facebook-gadget-autoposter.json` into n8n.
2. In the **Get Posted Products** and **Mark as Posted** nodes, select your Google Sheets credential and paste your Sheet URL.
3. In the **Generate Caption** HTTP Request node, ensuring your OpenRouter API Key is in the Authorization header (or let the pre-populated JSON handle it).
4. In the **Post to Facebook** HTTP Request node, ensure the Page ID and Access Token match your `.env` file.
5. In the **Render Poster Image** HTTP node, ensure the URL points to `http://localhost:3000/screenshot`.

---

## How It Works

```
[Schedule Trigger]
       ↓
[Get rows from Google Sheet]
       ↓
[Filter: posted is empty]
       ↓
[Check: has image_url?]
    ↓         ↓
  YES        NO
    ↓         ↓
[Download] [Text Post]
[Image]    Only
    ↓
[Post to Facebook]
    ↓
[Mark row as "posted"]
```

---

## Notes

- **Token Expiry**: Facebook tokens expire. Regenerate in Developer Console when needed.
- **Rate Limits**: Facebook limits ~100 posts/day per page
- **Image Size**: Keep images under 4MB for best results

---

## Verifying Scheduled Posts
Since the workflow now uses **Scheduled Posts**, you won't see the post on your timeline immediately. To verify:
1. Go to your Facebook Page.
2. Go to **Professional Dashboard** (or Meta Business Suite).
3. Look for **Content** or **Planner**.
4. Check the **Scheduled** tab. You should see your post there, set to publish 15 minutes after you clicked "Execute Workflow".