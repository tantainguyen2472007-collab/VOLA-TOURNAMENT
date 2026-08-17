const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'mapLineups.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix proPlayer attributions - remove team names (they change), keep player names
content = content.replace(/proPlayer: "Sentinels TenZ \/ Fnatic Chronicle"/g, 'proPlayer: "TenZ / Chronicle"');
content = content.replace(/proPlayer: "PRX d4v41 \/ Gen\.G Munchkin"/g, 'proPlayer: "d4v41 / Munchkin"');
content = content.replace(/proPlayer: "Fnatic Boaster"/g, 'proPlayer: "Boaster"');
content = content.replace(/proPlayer: "Sentinels Zellsis"/g, 'proPlayer: "Zellsis"');

// Add verificationNote to the AbilityLineup interface
// Add after the interface closing
content = content.replace(
  'visualHudAlignment: {\n    reticleType:',
  // We can't easily modify the interface, so let's add a comment about verification instead
  'visualHudAlignment: {\n    reticleType:'
);

// Add a verification note as a module-level constant
const verificationNote = `
// ponytail: lineup verification status — all lineups are text-described and need in-game testing
// Upgrade path: add per-lineup verificationStatus field when in-game screenshot system is built
export const LINEUP_VERIFICATION_NOTE = "Các lineup được mô tả từ kiến thức cộng đồng. Vị trí đứng/điểm căn HUD cần xác minh trong game thực tế." as const;
`;

// Add before the export const MAP_LINEUPS_DATA
content = content.replace(
  'export const MAP_LINEUPS_DATA',
  verificationNote + '\nexport const MAP_LINEUPS_DATA'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done updating mapLineups.ts');

// Verify
const updated = fs.readFileSync(filePath, 'utf8');
const proPlayerRefs = updated.match(/proPlayer: "([^"]+)"/g) || [];
console.log('proPlayer attributions:');
proPlayerRefs.forEach(p => console.log(' ', p));
console.log('Has verification note:', updated.includes('LINEUP_VERIFICATION_NOTE'));
