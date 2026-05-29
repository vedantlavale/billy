
import fs from 'fs';
import path from 'path';

const GOOGLE_FONTS = [
  { family: 'Inter', query: 'Inter:400,500,700' },
  { family: 'Montserrat', query: 'Montserrat:400,500,700' },
  { family: 'Outfit', query: 'Outfit:400,500,700' },
  { family: 'Source Sans 3', query: 'Source+Sans+3:400,600,700' },
  { family: 'Instrument Serif', query: 'Instrument+Serif:400,400i' }
];

const destDir = path.join(process.cwd(), 'public', 'fonts');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function fetchCssAndDownload() {
  console.log('Fetching CSS metadata and downloading TTF files...');
  
  for (const item of GOOGLE_FONTS) {
    const url = `https://fonts.googleapis.com/css?family=${item.query}`;
    console.log(`Querying: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSS: Status ${response.status}`);
      }
      
      const cssText = await response.text();
      
      // Regex to parse font-face blocks
      const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
      let match;
      let count = 0;
      
      while ((match = fontFaceRegex.exec(cssText)) !== null) {
        const block = match[1];
        
        // Extract properties
        const familyMatch = /font-family:\s*['"]?([^'";]+)['"]?/.exec(block);
        const weightMatch = /font-weight:\s*(\d+)/.exec(block);
        const styleMatch = /font-style:\s*(\w+)/.exec(block);
        const urlMatch = /src:\s*url\(([^)]+)\)/.exec(block);
        
        if (familyMatch && urlMatch) {
          const family = familyMatch[1];
          // We check if the parsed family name matches our target
          if (family.toLowerCase().replace(/\s+/g, '') !== item.family.toLowerCase().replace(/\s+/g, '')) {
            continue;
          }
          
          const weight = weightMatch ? weightMatch[1] : '400';
          const style = styleMatch ? styleMatch[1] : 'normal';
          const fontUrl = urlMatch[1].replace(/['"]/g, '').replace(/format\(['"]truetype['"]\)/g, '').trim();
          
          const sanitizedFamily = item.family.replace(/\s+/g, '');
          const filename = `${sanitizedFamily}-${weight}${style === 'italic' ? 'Italic' : ''}.ttf`;
          const dest = path.join(destDir, filename);
          
          console.log(`Downloading ${filename} from ${fontUrl}...`);
          const fileRes = await fetch(fontUrl);
          if (!fileRes.ok) throw new Error(`Status ${fileRes.status}`);
          
          const buffer = Buffer.from(await fileRes.arrayBuffer());
          fs.writeFileSync(dest, buffer);
          console.log(`✓ Saved ${filename}`);
          count++;
        }
      }
      console.log(`Finished ${item.family}, downloaded ${count} files.`);
    } catch (err: any) {
      console.error(`✗ Error processing ${item.family}:`, err.message);
    }
  }
  
  console.log('Font download completed!');
}

fetchCssAndDownload();
