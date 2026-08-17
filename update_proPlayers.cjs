const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'proPlayers.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix TenZ: DPI 800->1600, sens 0.3->0.22, eDpi 240->352, cm360 54.3->37.0, pollingRate 8000->1000
content = content.replace(
  /id: "tenz",\n\s+name: "TenZ",[\s\S]*?achievements: \[[\s\S]*?\]/,
  (match) => {
    let fixed = match;
    fixed = fixed.replace('dpi: 800,', 'dpi: 1600,');
    fixed = fixed.replace('sensitivity: 0.3,', 'sensitivity: 0.22,');
    fixed = fixed.replace('eDpi: 240,', 'eDpi: 352,');
    fixed = fixed.replace('cm360: 54.3,', 'cm360: 37.0,');
    fixed = fixed.replace('pollingRate: "8000 Hz",', 'pollingRate: "1000 Hz",');
    return fixed;
  }
);

// Fix aspas: team Leviatan -> MIBR
content = content.replace(
  /id: "aspas",\n\s+name: "aspas",\n\s+realName: "Erick Santos",\n\s+team: "Leviat\u00e1n",/,
  'id: "aspas",\n    name: "aspas",\n    realName: "Erick Santos",\n    team: "MIBR",'
);
// Fix aspas crosshair
content = content.replace(
  'crosshairCode: "0;P;c;5;o;1;d;1;z;3;f;0;0b;0;1b;0",\n    crosshairConfig: {\n      color: "#00ffff",\n      outlines: true,\n      centerDot: true,',
  'crosshairCode: "0;P;h;0;0l;4;0o;0;0a;1;0f;0;1b;0",\n    crosshairConfig: {\n      color: "#ffffff",\n      outlines: false,\n      centerDot: false,'
);

// Fix zekken: team Sentinels -> MIBR
content = content.replace(
  /id: "zekken",\n\s+name: "zekken",\n\s+realName: "Zachary Patrone",\n\s+team: "Sentinels",/,
  'id: "zekken",\n    name: "zekken",\n    realName: "Zachary Patrone",\n    team: "MIBR",'
);

// Fix ZmjjKK: DPI 800->1600, sens 0.28->0.1, eDpi 224->160, pollingRate 8000->4000
content = content.replace(
  /id: "zmjjkk",\n\s+name: "ZmjjKK",[\s\S]*?achievements: \[[\s\S]*?\]/,
  (match) => {
    let fixed = match;
    fixed = fixed.replace('dpi: 800,', 'dpi: 1600,');
    fixed = fixed.replace('sensitivity: 0.28,', 'sensitivity: 0.1,');
    fixed = fixed.replace('eDpi: 224,', 'eDpi: 160,');
    fixed = fixed.replace('cm360: 58.2,', 'cm360: 81.4,');
    fixed = fixed.replace('pollingRate: "8000 Hz",', 'pollingRate: "4000 Hz",');
    return fixed;
  }
);

// Fix Chronicle: team Fnatic -> Team Vitality
content = content.replace(
  /id: "chronicle",\n\s+name: "Chronicle",\n\s+realName: "Timofey Khromov",\n\s+team: "Fnatic",/,
  'id: "chronicle",\n    name: "Chronicle",\n    realName: "Timofey Khromov",\n    team: "Team Vitality",'
);

// Now add verification fields to ALL players
const verifiedPlayers = ['tenz', 'aspas', 'zmjjkk', 'demon1', 'derke', 'chronicle', 'zekken'];
const partiallyVerifiedPlayers = ['boaster', 'nats', 'scream', 'benjyfishy', 'alfajer', 'wo0t', 'texture', 'karon', 'f0rsaken', 'something', 'jinggg'];

// Add verification metadata after each achievements array
// Find pattern: achievements: [...]\n  }
content = content.replace(
  /(\s+achievements: \[[\s\S]*?\]\n)(\s+\})/g,
  (match, achievementsBlock, closingBrace) => {
    // Find which player this belongs to by looking backwards
    const beforeMatch = content.substring(0, content.indexOf(match));
    const lastIdMatch = beforeMatch.match(/id: "([^"]+)"/g);
    const lastId = lastIdMatch ? lastIdMatch[lastIdMatch.length - 1].match(/"([^"]+)"/)[1] : null;
    
    let status, source;
    if (verifiedPlayers.includes(lastId)) {
      status = 'verified';
      source = 'prosettings.net / specs.gg';
    } else if (partiallyVerifiedPlayers.includes(lastId)) {
      status = 'partially_verified';
      source = 'prosettings.net (partial)';
    } else {
      status = 'unverified';
      source = null;
    }
    
    const verificationFields = `    verificationStatus: "${status}" as const,\n    lastVerifiedDate: "2026-08-17"${source ? `,\n    verificationSource: "${source}"` : ''}`;
    
    return `${achievementsBlock.trimEnd()},\n${verificationFields}\n${closingBrace}`;
  }
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done updating proPlayers.ts');

// Verify
const updated = fs.readFileSync(filePath, 'utf8');
const tenzMatch = updated.match(/id: "tenz"[\s\S]*?dpi: (\d+)/);
const aspasTeam = updated.match(/id: "aspas"[\s\S]*?team: "([^"]+)"/);
const zmjjkkDpi = updated.match(/id: "zmjjkk"[\s\S]*?dpi: (\d+)/);
const chronicleTeam = updated.match(/id: "chronicle"[\s\S]*?team: "([^"]+)"/);
const zekkenTeam = updated.match(/id: "zekken"[\s\S]*?team: "([^"]+)"/);

console.log('TenZ DPI:', tenzMatch?.[1]);
console.log('aspas team:', aspasTeam?.[1]);
console.log('ZmjjKK DPI:', zmjjkkDpi?.[1]);
console.log('Chronicle team:', chronicleTeam?.[1]);
console.log('zekken team:', zekkenTeam?.[1]);

const verifiedCount = (updated.match(/verificationStatus: "verified"/g) || []).length;
const partialCount = (updated.match(/verificationStatus: "partially_verified"/g) || []).length;
const unverifiedCount = (updated.match(/verificationStatus: "unverified"/g) || []).length;
console.log(`Verified: ${verifiedCount}, Partial: ${partialCount}, Unverified: ${unverifiedCount}`);
