from PIL import Image
import numpy as np

# Load both existing logos
logo_white = Image.open('jellin-logo.png').convert('RGBA')
logo_gradient = Image.open('jellin-logo-gradient.png').convert('RGBA')

# The J is positioned at the left side of the logo
# Based on the SVG: J starts at x=22 (transform), goes from x=10 to x=50 (path coords)
# So actual x is roughly 32 to 72 in the 200-width viewBox
# In a 1000px wide image, that's approximately 160 to 360

# Find the actual bounding box of the J by detecting non-transparent pixels
def get_j_bounds(img):
    pixels = np.array(img)
    
    # Find all pixels that are not fully transparent
    alpha = pixels[:,:,3]
    non_transparent = np.where(alpha > 0)
    
    if len(non_transparent[0]) == 0:
        return None
    
    y_min = non_transparent[0].min()
    y_max = non_transparent[0].max()
    x_min = non_transparent[1].min()
    x_max = non_transparent[1].max()
    
    # The J should be in the left portion, let's limit to approximately first 40% of width
    max_x_for_j = img.width * 0.4
    
    # Filter to only J region
    j_mask = non_transparent[1] < max_x_for_j
    y_coords = non_transparent[0][j_mask]
    x_coords = non_transparent[1][j_mask]
    
    if len(x_coords) == 0:
        return None
    
    y_min = y_coords.min()
    y_max = y_coords.max()
    x_min = x_coords.min()
    x_max = x_coords.max()
    
    return (x_min, y_min, x_max, y_max)

# Get J bounds from the white logo
bounds = get_j_bounds(logo_white)
if bounds:
    x_min, y_min, x_max, y_max = bounds
    
    # Add padding (40 pixels on all sides for a nice border)
    padding = 40
    
    # Calculate dimensions
    j_width = x_max - x_min
    j_height = y_max - y_min
    
    # From SVG: calculate visual center offset
    visual_center_x = 310
    j_bbox_center_x = x_min + j_width // 2
    offset_from_bbox_center = visual_center_x - j_bbox_center_x
    
    # Make it square based on the larger dimension
    max_dim = max(j_width, j_height)
    new_width = max_dim + (2 * padding)
    new_height = max_dim + (2 * padding)
    
    # Calculate centering offsets - move to the right by 9/8 the left offset
    x_offset = padding + (max_dim - j_width) // 2 + (9 * offset_from_bbox_center // 8)
    y_offset = padding + (max_dim - j_height) // 2
    
    # Create white J on gradient background
    j_white = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    
    # First, add gradient background
    from PIL import ImageDraw
    draw = ImageDraw.Draw(j_white)
    for y in range(new_height):
        for x in range(new_width):
            t = (x + y) / (new_width + new_height)
            if t < 0.5:
                ratio = t * 2
                r = int(168 + (236 - 168) * ratio)
                g = int(85 + (72 - 85) * ratio)
                b = int(247 + (153 - 247) * ratio)
            else:
                ratio = (t - 0.5) * 2
                r = int(236 + (245 - 236) * ratio)
                g = int(72 + (158 - 72) * ratio)
                b = int(153 + (11 - 153) * ratio)
            j_white.putpixel((x, y), (r, g, b, 255))
    
    # Paste the J centered
    j_cropped_white = logo_white.crop((x_min, y_min, x_max + 1, y_max + 1))
    j_white.paste(j_cropped_white, (x_offset, y_offset), j_cropped_white)
    
    # Create gradient J on transparent background
    j_gradient = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    j_cropped_gradient = logo_gradient.crop((x_min, y_min, x_max + 1, y_max + 1))
    j_gradient.paste(j_cropped_gradient, (x_offset, y_offset), j_cropped_gradient)
    
    # Save both
    j_white.save('jellin-j-logo.png')
    j_gradient.save('jellin-j-logo-gradient.png')
    
    print(f'✓ J logos created with dimensions: {new_width}x{new_height}')
    print(f'✓ White J on gradient saved to: jellin-j-logo.png')
    print(f'✓ Gradient J on transparent saved to: jellin-j-logo-gradient.png')
else:
    print('Error: Could not find J bounds')
