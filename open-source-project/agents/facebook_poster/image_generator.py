import os
import requests
from PIL import Image, ImageDraw, ImageFont

def generate_poster(product_details, logo_path, output_path="final_poster.png"):
    """
    Programmatically generates a beautiful, sleek dark mode promotional poster 
    using Pillow, avoiding unstable or paid external APIs.
    """
    title = product_details.get("title", 'Premium Tech Gadget')
    price = product_details.get("price", '')
    
    print(f"[*] Generating local poster image for {title} via PIL...")
    
    # 1. Create a sleek dark background (e.g., deep charcoal/navy)
    width, height = 1024, 1024
    base_image = Image.new('RGB', (width, height), color=(15, 20, 30))
    draw = ImageDraw.Draw(base_image)
    
    # 2. Add some "glowing" neon abstract elements (simple circles/lines)
    draw.ellipse((-200, -200, 400, 400), fill=(80, 40, 150))
    draw.ellipse((800, 800, 1400, 1400), fill=(200, 50, 80))
    
    # Dark overlay to soften the "glow"
    overlay = Image.new('RGBA', (width, height), (15, 20, 30, 200))
    base_image = Image.alpha_composite(base_image.convert('RGBA'), overlay)
    draw = ImageDraw.Draw(base_image)
    
    # 3. Add overlay logo
    print(f"[*] Overlaying logo from {logo_path}...")
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        # Resize logo to fit nicely in the corner
        logo.thumbnail((200, 200), Image.Resampling.LANCZOS)
        margin = 50
        logo_w, logo_h = logo.size
        # Paste logo in Top Right using itself as the alpha mask
        base_image.paste(logo, (width - logo_w - margin, margin), logo)
    else:
        print(f"[!] Warning: Logo file not found at {logo_path}. Skipping logo overlay.")
        
    base_image = base_image.convert("RGB") # Convert back for saving
    base_image.save(output_path)
    print(f"[+] Final poster saved to {output_path}")
    
    return output_path

if __name__ == "__main__":
    generate_poster({"title": "Test Device"}, "giggly_gadgets_logo.png", "test_out.png")
