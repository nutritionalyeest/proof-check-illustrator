# proof-check-illustrator
A  WIP javascript script for Adobe Illustrator for checking sticker proofs for Sticker Ninja

Video of me demonstrating most of the features on a proof: https://youtu.be/jo-21mpeBKc

## Current Features 
### Sticker Size 
- finds the cutline and gets the width and height
- compares width and height of the cutline with the labeled sizes on proof 
- checks if width and height labels are switches 
- displays squared value of cutlines 

### Other 
- checks for high or low resolution images on proof
- checks for excessive points on the cutline (indicating unsmoothed path)
- checks if cutline is the correct spot color
- finds ellipses and similar paths likely to be leftover 1/8" measurement circles

### Reminders
- creates popup reminders for commonly missed and/or important checklist items 
- several reminders to reference different aspects of the order in Wordpress 

### Proof-type specific checks
 - if certain types of stickers have special rules such as roll labels or kiss cuts, it detects the proof type and displays reminders about those rules 

## Future Features
- integration with data pulled from airtable on the new website backend, for comparing accuracy of order information to proof 
- abilty to save progress in checklist if you need to stop and fix something
- checking if sticker has bleed and reminding user to check for spots
- dealing with multiple cutlines on sticker sheets 
- check for overprint fill, unhidden or askew white ink layers
- reminders about color mode 
- automatically align measurement arm things with cutline 
- automatically change size labels to actual dimensions of cutline (rounded)

## How to use 
For testing purposes: 
1. download script 
2. Start Illustrator, choose File > Scripts > Other Scripts, and navigate to script 

For Actual Use
Possible to run from Actions Panel or from keyboard shortcut
