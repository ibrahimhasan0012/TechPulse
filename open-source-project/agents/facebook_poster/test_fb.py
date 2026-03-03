import os
import requests
from dotenv import load_dotenv

load_dotenv('../../../.env')

page_id = os.environ.get("FACEBOOK_PAGE_ID")
token = os.environ.get("FACEBOOK_ACCESS_TOKEN")

url = f"https://graph.facebook.com/v19.0/{page_id}/feed"
res = requests.post(url, data={
    "message": "Testing Python integration with Facebook Graph API...",
    "access_token": token
})

print(f"Status Code: {res.status_code}")
print(f"Response: {res.text}")
