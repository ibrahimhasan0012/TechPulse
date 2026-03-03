import os
import sys
from dotenv import load_dotenv

# Load the environment variables before importing the other modules
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env')
load_dotenv(env_path)

from scraper import get_random_gadget
from image_generator import generate_poster
from facebook_api import post_to_facebook
from groq import Groq

def generate_caption(product_details):
    """
    Uses Groq to generate a highly engaging Facebook post caption.
    """
    client = Groq()
    
    title = product_details.get("title", 'Gadget')
    price = product_details.get("price", '')
    features = product_details.get("features", [])
    url = product_details.get("url", '')
    
    features_list = "\n".join([f"- {f}" for f in features])
    
    prompt = f"""
    Write a highly engaging, exciting, and professional Facebook promotional post for Giggly Gadgets (a premium gadget shop).
    
    Product: {title}
    Price: {price}
    Key Features:
    {features_list}
    Link: {url}
    
    Requirements:
    - Use relevant, fun emojis.
    - Start with an attention-grabbing hook.
    - Highlight the features elegantly.
    - Ensure the price ({price}) is clearly visible.
    - End with a strong Call to Action (CTA) telling them to message the page or visit the store.
    - Include hashtags like #GigglyGadgets #TechDeals #AppleGadgetsBD
    - Keep it under 200 words.
    """
    
    print(f"[*] Writing Facebook caption using LLM (Groq)...")
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content.strip()

def main():
    print("=== Facebook Poster Agent Starting ===")
    
    # 1. Ensure required API keys are configured
    if not os.getenv("OPENAI_API_KEY") or not os.getenv("GROQ_API_KEY"):
        print("Error: OPENAI_API_KEY or GROQ_API_KEY is missing from .env.")
        sys.exit(1)
        
    logo_path = os.getenv("GIGGLY_LOGO_PATH", "giggly_gadgets_logo.png")
    
    # 2. Scrape a random gadget
    try:
        details = get_random_gadget()
        print(f"\n[+] Selected {details['title']} ({details['price']})")
    except Exception as e:
        print(f"Failed to scrape gadget: {e}")
        sys.exit(1)
        
    # 3. Generate Post Caption
    try:
        caption = generate_caption(details)
        print("\n--- Generated Caption ---")
        try:
            print(caption)
        except UnicodeEncodeError:
            print(caption.encode('ascii', 'ignore').decode('ascii'))
        print("-------------------------\n")
    except Exception as e:
        print(f"Failed to generate caption: {e}")
        sys.exit(1)
        
    # 4. Generate Image Poster with Logo
    poster_path = "output_poster.png"
    try:
        generate_poster(details, logo_path, poster_path)
    except Exception as e:
        print(f"Failed to generate image: {e}")
        sys.exit(1)
        
    # 5. Publish to Facebook
    print("\n[*] Preparation complete. Ready to post.")
    if os.getenv("FACEBOOK_PAGE_ID") and os.getenv("FACEBOOK_ACCESS_TOKEN"):
        try:
           post_to_facebook(caption, poster_path)
        except Exception as e:
           print(f"Failed to post to Facebook: {e}")
    else:
        print("\n[!] Skipping Facebook upload. Missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN in .env")
        print("[!] The generated caption and image are ready for manual posting.")
        
    print("\n=== Agent Finished ===")

if __name__ == "__main__":
    main()
