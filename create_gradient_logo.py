from PIL import Image, ImageDraw
import numpy as np

# Load the original logo (white on gradient)
logo = Image.open('jellin-logo.png').convert('RGBA')
width, height = logo.size

# Create mask from white pixels
# The white logo letters will have high RGB values
pixels = np.array(logo)

# Detect white pixels (letters) - they should have high R, G, B values
# The gradient background will have varying colors
white_threshold = 200
mask = ((pixels[:,:,0] > white_threshold) & 
        (pixels[:,:,1] > white_threshold) & 
        (pixels[:,:,2] > white_threshold))

# Create gradient image (diagonal from purple to pink to orange)
gradient = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(gradient)

# Create diagonal gradient
for y in range(height):
    for x in range(width):
        # Calculate position along diagonal (0 to 1)
        t = (x + y) / (width + height)
        
        # Interpolate between colors
        if t < 0.5:
            # Purple to Pink
            ratio = t * 2
            r = int(168 + (236 - 168) * ratio)  # a855f7 -> ec4899
            g = int(85 + (72 - 85) * ratio)
            b = int(247 + (153 - 247) * ratio)
        else:
            # Pink to Orange
            ratio = (t - 0.5) * 2
            r = int(236 + (245 - 236) * ratio)  # ec4899 -> f59e0b
            g = int(72 + (158 - 72) * ratio)
            b = int(153 + (11 - 153) * ratio)
        
        gradient.putpixel((x, y), (r, g, b, 255))

# Apply mask to gradient
gradient_array = np.array(gradient)
gradient_array[:,:,3] = mask.astype(np.uint8) * 255

# Create final image
result = Image.fromarray(gradient_array, 'RGBA')

# Save
result.save('jellin-logo-gradient.png')
print('✓ Gradient logo saved to: jellin-logo-gradient.png')
