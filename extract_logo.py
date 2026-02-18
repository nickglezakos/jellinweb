#!/usr/bin/env python3
"""
Extract the Jellin logo from index.html and convert it to PNG
"""

import re
from pathlib import Path

# Read the HTML file
html_path = Path(__file__).parent / 'index.html'
with open(html_path, 'r') as f:
    html_content = f.read()

# Extract the SVG logo
svg_match = re.search(r'<svg[^>]*viewBox="0 0 200 90"[^>]*>.*?</svg>', html_content, re.DOTALL)

if not svg_match:
    print("Could not find SVG logo in HTML")
    exit(1)

svg_content = svg_match.group(0)

# Clean up the SVG and make it standalone
# Remove Tailwind classes and inline styles for cleaner SVG
svg_content = re.sub(r'class="[^"]*"', '', svg_content)
svg_content = re.sub(r'style="[^"]*"', '', svg_content)

# Create a complete SVG file with all-path logo (properly centered)
# Includes 8px padding top and bottom
complete_svg = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 96" width="1000" height="480">
    <!-- Background -->
    <rect x="0" y="0" width="200" height="96" fill="url(#gradient)"/>
    
    <!-- Gradient definition matching website -->
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <g transform="translate(22, 8)">
        <!-- Main J -->
        <path d="M50 5 L50 55 Q50 75 30 75 Q10 75 10 55 L10 48" 
              fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Letter e -->
        <path d="M62 45 Q62 35 72 35 Q82 35 82 45 L82 47 L62 47 Q62 57 72 57 Q77 57 82 54" 
              fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M62 45 Q62 35 72 35 Q82 35 82 45 Z" fill="white" opacity="0.3"/>
        
        <!-- Letter l (first) -->
        <path d="M92 25 L92 57" 
              fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Letter l (second) -->
        <path d="M104 25 L104 57" 
              fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Letter i -->
        <path d="M116 37 L116 57" 
              fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="116" cy="30" r="3" fill="white"/>
        
        <!-- Letter n -->
        <path d="M128 57 L128 45 Q128 37 136 37 Q144 37 144 45 L144 57" 
              fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
</svg>'''

# Save the SVG file
svg_path = Path(__file__).parent / 'jellin-logo.svg'
with open(svg_path, 'w') as f:
    f.write(complete_svg)

print(f"✓ SVG logo saved to: {svg_path}")

# Create reversed version with gradient fill and transparent background
complete_svg_reversed = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 96" width="1000" height="480">
    <!-- Gradient definition matching website -->
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <g transform="translate(22, 8)">
        <!-- Main J -->
        <path d="M50 5 L50 55 Q50 75 30 75 Q10 75 10 55 L10 48" 
              fill="none" stroke="url(#gradient)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Letter e -->
        <path d="M62 45 Q62 35 72 35 Q82 35 82 45 L82 47 L62 47 Q62 57 72 57 Q77 57 82 54" 
              fill="none" stroke="url(#gradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M62 45 Q62 35 72 35 Q82 35 82 45 Z" fill="url(#gradient)" opacity="0.5"/>
        
        <!-- Letter l (first) -->
        <path d="M92 25 L92 57" 
              fill="none" stroke="url(#gradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Letter l (second) -->
        <path d="M104 25 L104 57" 
              fill="none" stroke="url(#gradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Letter i -->
        <path d="M116 37 L116 57" 
              fill="none" stroke="url(#gradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="116" cy="30" r="3" fill="url(#gradient)"/>
        
        <!-- Letter n -->
        <path d="M128 57 L128 45 Q128 37 136 37 Q144 37 144 45 L144 57" 
              fill="none" stroke="url(#gradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
</svg>'''

svg_path_reversed = Path(__file__).parent / 'jellin-logo-gradient.svg'
with open(svg_path_reversed, 'w') as f:
    f.write(complete_svg_reversed)

print(f"✓ Gradient SVG logo saved to: {svg_path_reversed}")

# Try to convert to PNG using cairosvg
try:
    import cairosvg
    
    # Original with gradient background
    png_path = Path(__file__).parent / 'jellin-logo.png'
    cairosvg.svg2png(url=str(svg_path), write_to=str(png_path), scale=2.0)
    print(f"✓ PNG logo saved to: {png_path}")
    
    # Reversed with transparent background
    png_path_reversed = Path(__file__).parent / 'jellin-logo-gradient.png'
    cairosvg.svg2png(url=str(svg_path_reversed), write_to=str(png_path_reversed), scale=2.0)
    print(f"✓ Gradient PNG logo saved to: {png_path_reversed}")
    
except ImportError:
    print("\n⚠ cairosvg not installed. Install it to convert to PNG:")
    print("  pip install cairosvg")
    print("\nOr use the SVG file directly, which works in most modern applications.")
