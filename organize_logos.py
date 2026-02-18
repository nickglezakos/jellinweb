from PIL import Image
import os

# Create folder structure
os.makedirs('assets/logos/full/original', exist_ok=True)
os.makedirs('assets/logos/full/tablet', exist_ok=True)
os.makedirs('assets/logos/full/mobile', exist_ok=True)
os.makedirs('assets/logos/icon/original', exist_ok=True)
os.makedirs('assets/logos/icon/tablet', exist_ok=True)
os.makedirs('assets/logos/icon/mobile', exist_ok=True)
os.makedirs('assets/logos/icon/favicon', exist_ok=True)

# Load logos
full_white = Image.open('jellin-logo.png')
full_gradient = Image.open('jellin-logo-gradient.png')
j_white = Image.open('jellin-j-logo.png')
j_gradient = Image.open('jellin-j-logo-gradient.png')

# Define sizes
# Full logos: original, tablet (512px wide), mobile (256px wide)
full_original_size = full_white.size
full_tablet_width = 512
full_mobile_width = 256

# Calculate heights maintaining aspect ratio
full_aspect = full_original_size[1] / full_original_size[0]
full_tablet_size = (full_tablet_width, int(full_tablet_width * full_aspect))
full_mobile_size = (full_mobile_width, int(full_mobile_width * full_aspect))

# Icon logos: original (square), tablet (512x512), mobile (256x256), favicon (64x64)
icon_original_size = j_white.size
icon_tablet_size = (512, 512)
icon_mobile_size = (256, 256)
icon_favicon_size = (64, 64)

# Save full logos
print("Saving full logos...")

# Original
full_white.save('assets/logos/full/original/jellin-logo-white.png')
full_gradient.save('assets/logos/full/original/jellin-logo-gradient.png')

# Tablet
full_white_tablet = full_white.resize(full_tablet_size, Image.Resampling.LANCZOS)
full_gradient_tablet = full_gradient.resize(full_tablet_size, Image.Resampling.LANCZOS)
full_white_tablet.save('assets/logos/full/tablet/jellin-logo-white.png')
full_gradient_tablet.save('assets/logos/full/tablet/jellin-logo-gradient.png')

# Mobile
full_white_mobile = full_white.resize(full_mobile_size, Image.Resampling.LANCZOS)
full_gradient_mobile = full_gradient.resize(full_mobile_size, Image.Resampling.LANCZOS)
full_white_mobile.save('assets/logos/full/mobile/jellin-logo-white.png')
full_gradient_mobile.save('assets/logos/full/mobile/jellin-logo-gradient.png')

print("Saving icon logos...")

# Original
j_white.save('assets/logos/icon/original/jellin-j-white.png')
j_gradient.save('assets/logos/icon/original/jellin-j-gradient.png')

# Tablet
j_white_tablet = j_white.resize(icon_tablet_size, Image.Resampling.LANCZOS)
j_gradient_tablet = j_gradient.resize(icon_tablet_size, Image.Resampling.LANCZOS)
j_white_tablet.save('assets/logos/icon/tablet/jellin-j-white.png')
j_gradient_tablet.save('assets/logos/icon/tablet/jellin-j-gradient.png')

# Mobile
j_white_mobile = j_white.resize(icon_mobile_size, Image.Resampling.LANCZOS)
j_gradient_mobile = j_gradient.resize(icon_mobile_size, Image.Resampling.LANCZOS)
j_white_mobile.save('assets/logos/icon/mobile/jellin-j-white.png')
j_gradient_mobile.save('assets/logos/icon/mobile/jellin-j-gradient.png')

# Favicon
j_white_favicon = j_white.resize(icon_favicon_size, Image.Resampling.LANCZOS)
j_gradient_favicon = j_gradient.resize(icon_favicon_size, Image.Resampling.LANCZOS)
j_white_favicon.save('assets/logos/icon/favicon/jellin-j-white.png')
j_gradient_favicon.save('assets/logos/icon/favicon/jellin-j-gradient.png')

# Also create .ico file for favicon
j_gradient_favicon.save('assets/logos/icon/favicon/favicon.ico', format='ICO', sizes=[(64, 64), (32, 32), (16, 16)])

print("\n✓ Logo organization complete!")
print(f"\nFull logos:")
print(f"  Original: {full_original_size[0]}x{full_original_size[1]}px")
print(f"  Tablet: {full_tablet_size[0]}x{full_tablet_size[1]}px")
print(f"  Mobile: {full_mobile_size[0]}x{full_mobile_size[1]}px")
print(f"\nIcon logos:")
print(f"  Original: {icon_original_size[0]}x{icon_original_size[1]}px")
print(f"  Tablet: {icon_tablet_size[0]}x{icon_tablet_size[1]}px")
print(f"  Mobile: {icon_mobile_size[0]}x{icon_mobile_size[1]}px")
print(f"  Favicon: {icon_favicon_size[0]}x{icon_favicon_size[1]}px + .ico file")
print(f"\nAll logos saved in assets/logos/")
