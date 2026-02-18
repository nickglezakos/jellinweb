#!/usr/bin/env python3
"""
Generate a social media share image (Open Graph image) for Jellin website.
Standard size: 1200x630 pixels
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_share_image():
    # Standard Open Graph image size
    width = 1200
    height = 630
    
    # Create image with gradient background
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # Create gradient from purple to pink to amber (matching jell-gradient)
    for y in range(height):
        # Gradient progression
        ratio = y / height
        
        # Three color gradient: purple -> pink -> amber
        if ratio < 0.5:
            # Purple to Pink
            local_ratio = ratio * 2
            r = int(168 + (236 - 168) * local_ratio)
            g = int(85 + (72 - 85) * local_ratio)
            b = int(247 + (153 - 247) * local_ratio)
        else:
            # Pink to Amber
            local_ratio = (ratio - 0.5) * 2
            r = int(236 + (245 - 236) * local_ratio)
            g = int(72 + (158 - 72) * local_ratio)
            b = int(153 + (11 - 153) * local_ratio)
        
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))
    
    # Add subtle overlay pattern
    overlay = Image.new('RGBA', (width, height), (255, 255, 255, 26))
    img.paste(overlay, (0, 0), overlay)
    
    # Try to load a font, fallback to default
    try:
        # Try to use a nice font if available
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
        font_tagline = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
    except:
        try:
            font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
            font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
            font_tagline = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
            font_tagline = ImageFont.load_default()
    
    # Draw "Jellin" text
    text = "Jellin"
    
    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = bbox[2] - bbox[0]
    text_x = (width - text_width) // 2
    text_y = height // 2 - 40
    
    # Draw text with shadow
    draw.text((text_x + 4, text_y + 4), text, fill=(0, 0, 0, 128), font=font_large)
    draw.text((text_x, text_y), text, fill='white', font=font_large)
    
    # Draw tagline
    tagline = "A marketing app that jells with your customers"
    bbox_tagline = draw.textbbox((0, 0), tagline, font=font_tagline)
    tagline_width = bbox_tagline[2] - bbox_tagline[0]
    tagline_x = (width - tagline_width) // 2
    tagline_y = text_y + 140
    
    draw.text((tagline_x + 2, tagline_y + 2), tagline, fill=(0, 0, 0, 100), font=font_tagline)
    draw.text((tagline_x, tagline_y), tagline, fill='white', font=font_tagline)
    
    # Save the image
    output_path = 'assets/jellin-share-image.png'
    os.makedirs('assets', exist_ok=True)
    img.save(output_path, 'PNG', optimize=True)
    print(f"✅ Share image created: {output_path}")
    print(f"   Size: {width}x{height} pixels")
    print(f"   Perfect for Open Graph, Twitter Cards, and social media!")
    
    return output_path

if __name__ == '__main__':
    create_share_image()
