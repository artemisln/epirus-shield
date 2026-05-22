const sharp = require('sharp');
const path = require('path');

const SPRITESHEET_PATH = path.join(__dirname, '../public/icons/spritesheet.png');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

const COLS = 4;
const ROWS = 2;

const ICON_NAMES = [
  'money',
  'tax-doc', 
  'bank',
  'upload',
  'approved',
  'shield',
  'house',
  'car'
];

async function sliceSpritesheet() {
  try {
    const image = sharp(SPRITESHEET_PATH);
    const metadata = await image.metadata();
    console.log(`Spritesheet dimensions: ${metadata.width}x${metadata.height}`);
    
    const cellWidth = Math.floor(metadata.width / COLS);
    const cellHeight = Math.floor(metadata.height / ROWS);
    
    console.log(`Cell dimensions: ${cellWidth}x${cellHeight}`);
    console.log(`Grid: ${COLS} columns x ${ROWS} rows`);
    console.log('---');
    
    let iconIndex = 0;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const name = ICON_NAMES[iconIndex];
        const left = col * cellWidth;
        const top = row * cellHeight;
        
        console.log(`[${iconIndex + 1}] ${name}: x=${left}, y=${top}, w=${cellWidth}, h=${cellHeight}`);
        
        const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
        
        const extracted = await sharp(SPRITESHEET_PATH)
          .extract({
            left: left,
            top: top,
            width: cellWidth,
            height: cellHeight
          })
          .toBuffer();
        
        await sharp(extracted)
          .trim({
            background: '#ffffff',
            threshold: 50
          })
          .png()
          .toFile(outputPath);
        
        const outputMeta = await sharp(outputPath).metadata();
        console.log(`   -> Saved: ${outputMeta.width}x${outputMeta.height}`);
        
        iconIndex++;
      }
    }
    
    console.log('---');
    console.log('Done! Sliced 8 icons.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

sliceSpritesheet();
