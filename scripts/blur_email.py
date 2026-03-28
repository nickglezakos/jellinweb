#!/usr/bin/env python3
"""Blur the username part (before @) of any email found in an image using pytesseract.
Saves the modified image by overwriting the source file.

Usage: python scripts/blur_email.py ../assets/jellin-email-01.jpg
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageFilter
except Exception:
    print('Pillow is required. Install with: pip install pillow')
    raise

try:
    import pytesseract
except Exception:
    print('pytesseract is required. Install with: pip install pytesseract')
    raise


def blur_username(image_path: Path):
    img = Image.open(image_path).convert('RGBA')

    # Run tesseract OCR to get word boxes
    try:
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    except pytesseract.pytesseract.TesseractNotFoundError as e:
        print('Tesseract binary not found. Install tesseract on your system.')
        raise

    n = len(data['text'])
    found = False
    for i in range(n):
        word = (data['text'][i] or '').strip()
        if '@' in word:
            # compute username portion bbox by measuring char widths
            left = int(data['left'][i])
            top = int(data['top'][i])
            w = int(data['width'][i])
            h = int(data['height'][i])
            parts = word.split('@')
            if len(parts) < 2 or len(parts[0]) == 0:
                continue
            username = parts[0]
            # approximate username width as fraction of word bbox
            frac = len(username) / len(word)
            username_w = max(8, int(w * frac))
            username_box = (left, top, left + username_w, top + h)

            # expand box slightly
            pad_x = max(4, int(w * 0.02))
            pad_y = max(4, int(h * 0.1))
            x0 = max(0, username_box[0] - pad_x)
            y0 = max(0, username_box[1] - pad_y)
            x1 = min(img.width, username_box[2] + pad_x)
            y1 = min(img.height, username_box[3] + pad_y)

            # crop, blur, paste
            region = img.crop((x0, y0, x1, y1))
            blurred = region.filter(ImageFilter.GaussianBlur(radius=8))
            img.paste(blurred, (x0, y0))
            found = True
            print(f'Blurred username area at bbox {(x0,y0,x1,y1)} for word "{word}"')
            break

    if not found:
        print('No email-like word found by OCR.')
        return False

    # overwrite file (keep original as .bak)
    bak = image_path.with_suffix(image_path.suffix + '.bak')
    if not bak.exists():
        image_path.rename(bak)
        bak = bak
        # save img to original path
        img.convert('RGB').save(image_path, quality=95)
    else:
        img.convert('RGB').save(image_path, quality=95)

    print(f'Image saved: {image_path} (backup: {bak})')
    return True


def main():
    if len(sys.argv) < 2:
        print('Usage: blur_email.py path/to/image.jpg')
        sys.exit(2)
    p = Path(sys.argv[1])
    if not p.exists():
        print('File not found:', p)
        sys.exit(2)
    ok = blur_username(p)
    if not ok:
        sys.exit(3)


if __name__ == '__main__':
    main()
