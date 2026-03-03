import os
import requests
import random
from bs4 import BeautifulSoup

def get_random_gadget():
    """Scrapes Apple Gadgets BD 'Gadgets & Accessories' and picks a random product."""
    base_url = "https://www.applegadgetsbd.com"
    category_url = f"{base_url}/category/gadgets-and-accessories"
    
    response = requests.get(category_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find product links
    # Apple Gadgets BD uses .product-thumb or similar. Let's look for a tag wrapping the product title/image.
    # From their structure, product links are typically inside product cards.
    product_links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        # Very basic heuristic: product pages usually contain '/product/' in the URL
        if '/product/' in href and href not in product_links:
            # Reconstruct full URL if it's relative
            full_url = href if href.startswith('http') else base_url + href
            product_links.append(full_url)
    
    if not product_links:
        raise Exception("Could not find any products in the Gadgets & Accessories category.")
    
    # Pick a random product URL
    selected_url = random.choice(product_links)
    print(f"[*] Selected product URL: {selected_url}")
    return scrape_product_details(selected_url)

def scrape_product_details(product_url):
    """Scrapes the specific product page for title, price, and specs."""
    response = requests.get(product_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Title
    # Typically in an <h1> tag
    title_tag = soup.find('h1')
    title = title_tag.text.strip() if title_tag else "New Gadget"
    
    # Price
    # Look for elements containing the Taka symbol '৳' or words like 'Price'
    price = "Price not found"
    price_elements = soup.find_all(string=lambda text: text and '৳' in text)
    if price_elements:
        for text in price_elements:
            clean_text = text.strip()
            if any(char.isdigit() for char in clean_text):
                price = clean_text
                break

    # Features/Specs
    # Usually in lists <ul> or tables <table> under a 'Features' or 'Specifications' section
    features = []
    for li in soup.find_all('li'):
        text = li.text.strip()
        # Filter out very short or very long list items to get bullet points
        if 15 < len(text) < 150 and '\n' not in text:
            features.append(text)
            if len(features) >= 5: # Limit to top 5 features
                break
                
    if not features:
        features = ["Premium quality and design", "Check website for full specifications"]

    return {
        "title": title,
        "price": price,
        "url": product_url,
        "features": features
    }

if __name__ == "__main__":
    try:
        details = get_random_gadget()
        print(f"\nTitle: {details['title']}")
        print(f"Price: {details['price']}")
        print("Features:")
        for f in details['features']:
            print(f"- {f}")
    except Exception as e:
        print(f"Error scraping: {e}")
