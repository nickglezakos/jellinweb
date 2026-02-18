from PIL import Image
import os

# Create folder structure for splash screens
os.makedirs('assets/logos/full/android-splash', exist_ok=True)
os.makedirs('assets/logos/full/ios-splash', exist_ok=True)

# Load original full logos
full_white = Image.open('jellin-logo.png')
full_gradient = Image.open('jellin-logo-gradient.png')

# Define splash screen sizes
android_size = (1080, 2340)
ios_size = (1242, 2688)

print("Creating Android splash screens (1080x2340)...")

# Ensure logos are in RGBA mode
full_white = full_white.convert('RGBA')
full_gradient = full_gradient.convert('RGBA')

# Android - White logo (for dark mode)
android_white = Image.new('RGBA', android_size, (0, 0, 0, 0))
# Calculate size to fit the logo maintaining aspect ratio
logo_aspect = full_white.size[0] / full_white.size[1]
# Use 70% of width for the logo
logo_width = int(android_size[0] * 0.7)
logo_height = int(logo_width / logo_aspect)
logo_resized = full_white.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
# Center the logo
x_offset = (android_size[0] - logo_width) // 2
y_offset = (android_size[1] - logo_height) // 2
android_white.paste(logo_resized, (x_offset, y_offset))
android_white.save('assets/logos/full/android-splash/jellin-logo-white.png')

# Android - Gradient logo (for light mode)
android_gradient = Image.new('RGBA', android_size, (0, 0, 0, 0))
logo_resized_gradient = full_gradient.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
android_gradient.paste(logo_resized_gradient, (x_offset, y_offset))
android_gradient.save('assets/logos/full/android-splash/jellin-logo-gradient.png')

print("Creating iOS splash screens (1242x2688)...")

# iOS - White logo (for dark mode)
ios_white = Image.new('RGBA', ios_size, (0, 0, 0, 0))
# Use 70% of width for the logo
logo_width_ios = int(ios_size[0] * 0.7)
logo_height_ios = int(logo_width_ios / logo_aspect)
logo_resized_ios = full_white.resize((logo_width_ios, logo_height_ios), Image.Resampling.LANCZOS)
# Center the logo
x_offset_ios = (ios_size[0] - logo_width_ios) // 2
y_offset_ios = (ios_size[1] - logo_height_ios) // 2
ios_white.paste(logo_resized_ios, (x_offset_ios, y_offset_ios))
ios_white.save('assets/logos/full/ios-splash/jellin-logo-white.png')

# iOS - Gradient logo (for light mode)
ios_gradient = Image.new('RGBA', ios_size, (0, 0, 0, 0))
logo_resized_gradient_ios = full_gradient.resize((logo_width_ios, logo_height_ios), Image.Resampling.LANCZOS)
ios_gradient.paste(logo_resized_gradient_ios, (x_offset_ios, y_offset_ios))
ios_gradient.save('assets/logos/full/ios-splash/jellin-logo-gradient.png')

print("\n✓ Splash screen logos created!")
print(f"\nAndroid splash (1080x2340):")
print(f"  - jellin-logo-white.png (for dark backgrounds)")
print(f"  - jellin-logo-gradient.png (for light backgrounds)")
print(f"\niOS splash (1242x2688):")
print(f"  - jellin-logo-white.png (for dark backgrounds)")
print(f"  - jellin-logo-gradient.png (for light backgrounds)")
print(f"\nAll saved in assets/logos/full/")
