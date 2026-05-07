# Per-destination images

Use this folder to store **location-specific** images so each destination (Kandy, Galle, Ella, Arugam Bay, Sigiriya) shows its own culture and photos.

## Suggested structure

Create one subfolder per destination and add your images:

```
destinations/
  kandy/      → slider-1.jpg, slider-2.jpg, slider-3.jpg, slider-4.jpg, thumb-1.jpg, thumb-2.jpg
  galle/
  ella/
  arugampe/
  sigiriya/
```

- **Slider images**: main carousel (e.g. 4 images per destination).
- **Thumb images**: smaller gallery images in the content section (e.g. 2 images).

After adding files, update `src/data/destinationDetailsBySlug.js`: for each destination, replace the imports to use these paths (e.g. `import slider1 from "../assets/images/destinations/kandy/slider-1.jpg"`) and use them in that destination’s `sliderImages` and `images` arrays.
