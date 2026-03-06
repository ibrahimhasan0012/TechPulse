# Task Tracker: n8n Facebook Auto-Poster

- [x] Write the task plan to `.claude/tasks/n8n_gadget_autoposter.md`
- [x] Build scraping nodes: HTTP Request + Code node to parse applegadgetsbd.com product listings and details
- [x] Build Google Sheets tracking nodes: read posted products, filter unposted, mark as posted after success
- [x] Build Groq caption generation node: HTTP Request to Groq API with product context prompt
- [x] Build poster image generation: HTML/CSS template in Code node + self-hosted Puppeteer screenshot service for rendering
- [x] Build Facebook posting node: multipart upload to Graph API /photos with poster + caption
- [x] Configure schedule trigger for 5 posts/day at specific times (11AM, 2PM, 5PM, 8PM, 11PM BDT)
- [x] Add error handling: retry logic, fallback paths, and error notification
- [x] Create self-hosted Puppeteer screenshot service: Dockerfile + server.js with /screenshot endpoint
- [x] Update SETUP-GUIDE.md with new workflow instructions, credential setup, and Docker instructions
