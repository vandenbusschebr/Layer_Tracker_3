# Style Guide

## Stack
- React + Tailwind CSS (utility classes only, no custom CSS files unless necessary)
- Icons: Radix

————

## Color Palette - Primitives - Blue
- Blue 10: E8EEF8
- Blue 20: BAC9e8
- Blue 60: 7899D0
- Blue 100: 2D5FA8
- Blue 120: 1A3F77
- Blue 140: 0A2145

## Color Palette - Primitives - Grey
- White 10 Percent Transparent: FFFFF @10% 
- Grey 00 aka White: FFFFFF
- Grey 10: EAEBEB
- Grey 20: D5D8D7
- Grey 40: ABB0AF
- Grey 60: 808988
- Grey 80: 566160
- Grey 100: 2C3A38
- Grey 120: 232E2D
- Grey 140: 1A2322
- Grey 160: 121716
- Grey 180 aka Black: 000000

## Color Palette - Primitives - Orange
- Orange 10: FBF1E6
- Orange 20: F1CFA4
- Orange 60: DAA16A
- Orange 100: C27A3B
- Orange 120: 8C5320
- Orange 140: 4E2D0C

## Color Palette - Primitives - Red
- Red 10: F5EBEA
- Red 20: E1BEBD
- Red 60: C07978
- Red 100: 8C2E2
- Red 120: 621E1E
- Red 140: 350C0C

## Color Palette - Primitives - Dove White
- Dove White: F5F4F2

## Color Palette - Primitives - Teal
- Teal 10: EAF5F3
- Teal 20: C1DDD9
- Teal 60: 8BBDB8
- Teal 100: 4B8D85
- Teal 120: 2D6560
- Teal 140: 153B39

## Color Palette - Primitives - Green
- Green 10: ECF0EE
- Green 20: D8E1DC
- Green 60: 8BA697
- Green 100: 3D6B52
- Green 120: 254031
- Green 140: 0C1510

————
## Color Palette - Semantic Colors
- Brand 10: Teal 10
- Brand 20: Teal 20
- Brand 60: Teal 60
- Brand 100 (Primary Brand): Teal 100
- Brand 120: Teal 120
- Brand 140: Teal 140
- Primary Text: Dove White
- Disabled Text: Grey 20
- Brand Text: Brand 100 
- Surface Background: Grey 180 aka Black
- Surface Overlay: Grey 140
- Text Background: White 10 Percent Transparent
- Feels like sweaty: Red 100
- Feels like Chilly: Blue 100
- Feels like Stoked: Green 100
- Feels like sweaty drop shadow: Red 100
- Feels like Chilly drop shadow: Blue 100
- Feels like Stoked drop shadow: Green 60
- Gradient for home screen tiles: Grey 160 -> Grey 120
- Divider Line: White 10 Percent Transparent

————
## Typography - Headings
- Font: New Amsterdam
- Weight: Regular
- Sizes:
— H1: 60
— H2: 48
— H3: 40
— H4: 32
— H5: 24
— H6: 20

## Typography - Paragraph
- Font: IBM Plex Mono
- Weight: Medium and Bold
- Sizes:
— P Large: 20
— P Medium: 16
— P Small: 14
— P extra small: 12

## Spacing & Layout
- Base unit: 4px (Tailwind default scale)
- Page padding: px-12 on mobile, px-12 on desktop
- Section gaps: px-24



## Components

### Form Inputs
- Placeholder text: Primary Text (Dove White #F5F4F2) at 50% opacity

### Buttons
- Primary: Use Brand 100 color as background with Primary Text color
- Secondary: Use Brand 100 color as stroke outline, no fill, Text use Brand 100 color
- Tertiary: no background, no border, text only with a text color of Brand 100

### Activity Cards
- Activity Cards on the Home Screen should use the “Gradient for Home Screen tiles” as a background fill.
- Each card should have a colored drop shadow. The color corresponds to the associated data point of that activity documenting if I felt “Stoked, Chilly, or Dripping”.  


## Tone / Feel
- Clean, functional, minimal — avoid decorative flourishes
- Corners: Minimal radius

## Avoid
- No placeholder lorem ipsum — use realistic sample content
