#!/usr/bin/env python3
from PIL import Image
import os

img = Image.open('../sprite_sheet.png')
w,h = img.size
cols, rows = 5, 2
cell_w, cell_h = w//cols, h//rows

os.makedirs('sprites', exist_ok=True)

for y in range(rows):
  for x in range(cols):
    left = x*cell_w
    top = y*cell_h
    right = (x+1)*cell_w
    bottom = (y+1)*cell_h
    crop = img.crop((left, top, right, bottom))
    crop.save(f'sprites/sprite_{y}_{x}.png')

print(f'Done! cell={cell_w}x{cell_h}')
