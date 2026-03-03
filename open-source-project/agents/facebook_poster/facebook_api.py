import os
import requests

def post_to_facebook(message, image_path):
    """
    Publishes an image with a message caption to the Facebook Page.
    Requires FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN in env.
    """
    page_id = os.getenv('FACEBOOK_PAGE_ID')
    access_token = os.getenv('FACEBOOK_ACCESS_TOKEN')
    
    if not page_id or not access_token:
        raise ValueError("Missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN environment variables.")
        
    print(f"[*] Validating access token type...")
    # Check if this is a user token and needs swapping for a Page token
    test_url = f"https://graph.facebook.com/v19.0/me/accounts?access_token={access_token}"
    acct_resp = requests.get(test_url)
    
    if acct_resp.status_code == 200:
        data = acct_resp.json()
        if 'data' in data:
            # It's a User token. Find the token for the specific Page ID.
            for page in data['data']:
                if page.get('id') == page_id:
                    print(f"[*] Auto-detected User Token. Swapping to Page Token for Page {page_id}...")
                    access_token = page.get('access_token')
                    break
    
    url = f"https://graph.facebook.com/v19.0/{page_id}/photos"
    
    payload = {
        'message': message,
        'access_token': access_token,
        # published: True makes it go live immediately
        'published': 'true'
    }
    
    print(f"[*] Uploading image and posting to Facebook page {page_id}...")
    
    with open(image_path, 'rb') as img:
        files = {
            'source': img
        }
        response = requests.post(url, data=payload, files=files)
        
    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print(f"[!] Facebook API Error: {response.text}")
        raise e
        
    result = response.json()
    post_id = result.get('post_id')
    print(f"[+] Successfully posted to Facebook! Post ID: {post_id}")
    return post_id
