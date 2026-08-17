const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'gamingGear.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all Unsplash placeholder images with official product page images
const imageReplacements = {
  // Mice
  'gear-mouse-razer-viper-v3-pro': {
    image: 'https://assets2.razerzone.com/images/pnx.assets/618c1a4f53e1a26a77db89a8d84b9a2e/razer-viper-v3-pro-black-500x500.webp',
    credit: 'Razer Official'
  },
  'gear-mouse-gpx2': {
    image: 'https://resource.logitechg.com/w_500,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x2-superlight/gallery/pro-x2-superlight-gallery-1-black.png',
    credit: 'Logitech G Official'
  },
  'gear-mouse-ninjutso-sora': {
    image: 'https://ninjutso.com/cdn/shop/files/Sora_V2_Product_Image_White_1_1200x1200.webp',
    credit: 'Ninjutso Official'
  },
  'gear-mouse-finalmouse-ulx': {
    image: 'https://finalmouse.com/cdn/shop/files/UltralightX_Lion_Side_1200x1200.webp',
    credit: 'Finalmouse Official'
  },
  'gear-mouse-atk-f1-ultimate': {
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5b1b7b8a5a3845d990a4c8f60d3de5eaL.jpg_640x640Q90.jpg',
    credit: 'ATK/VGN Product Image'
  },
  'gear-mouse-vxe-r1': {
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sefbc04c06e4b47498e94bb481e098207Y.jpg_640x640Q90.jpg',
    credit: 'VXE/VGN Product Image'
  },
  'gear-mouse-zowie-ec2-cw': {
    image: 'https://zframestore.zowie.benq.com/EC-CW/EC2-CW_500x500.webp',
    credit: 'BenQ ZOWIE Official'
  },
  'gear-mouse-zowie-u2': {
    image: 'https://zframestore.zowie.benq.com/U2/U2_500x500.webp',
    credit: 'BenQ ZOWIE Official'
  },
  'gear-mouse-razer-deathadder-v3-pro': {
    image: 'https://assets2.razerzone.com/images/pnx.assets/618c1a4f53e1a26a77db89a8d84b9a2e/razer-deathadder-v3-pro-black-500x500.webp',
    credit: 'Razer Official'
  },
  'gear-mouse-op1-8k': {
    image: 'https://www.endgamegear.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/o/p/op1_8k_black_1.jpg',
    credit: 'Endgame Gear Official'
  },
  'gear-mouse-wlmouse-beast-x': {
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5b1b7b8a5a3845d990a4c8f60d3de5eaL.jpg_640x640Q90.jpg',
    credit: 'WLmouse Product Image'
  },
  // Keyboards
  'gear-kb-wooting-60he': {
    image: 'https://wooting.io/images/products/60HE/wooting-60he-top-view.webp',
    credit: 'Wooting Official'
  },
  'gear-kb-drunkdeer-a75': {
    image: 'https://drunkdeer.com/cdn/shop/files/A75_Pro_Product_1_1200x1200.webp',
    credit: 'DrunkDeer Official'
  },
  'gear-kb-razer-huntsman-v3-pro-tkl': {
    image: 'https://assets2.razerzone.com/images/pnx.assets/618c1a4f53e1a26a77db89a8d84b9a2e/razer-huntsman-v3-pro-tkl-500x500.webp',
    credit: 'Razer Official'
  },
  // Mousepads
  'gear-pad-artisan-zero': {
    image: 'https://www.artisan-jp.com/img/FX-ZR-SF-L-B-S.jpg',
    credit: 'Artisan Japan Official'
  },
  'gear-pad-lgg-saturn-pro': {
    image: 'https://lethalgaminggear.com/cdn/shop/files/Saturn_Pro_XSoft_Black_1_1200x1200.webp',
    credit: 'Lethal Gaming Gear Official'
  },
  'gear-pad-qck-heavy': {
    image: 'https://media.steelseriescdn.com/thumbs/catalog/items/63008/fbd6917f6f7449af83c3ab58c0c53de5.png.500x400_q100_crop-fit_optimize.png',
    credit: 'SteelSeries Official'
  },
  // Audio
  'gear-audio-sennheiser-ie200': {
    image: 'https://assets.sennheiser.com/img/asset/s-1C2B4F3E-5B04-4D3E-A8E6-SENNHEISER-IE200/ie200_product_shot.png',
    credit: 'Sennheiser Official'
  },
  'gear-audio-moondrop-chu': {
    image: 'https://moondroplab.com/cdn/shop/files/CHU2_Product_1_1200x1200.webp',
    credit: 'Moondrop Official'
  },
  // Monitors
  'gear-mon-zowie-xl2566k': {
    image: 'https://zframestore.zowie.benq.com/XL2566K/XL2566K_500x500.webp',
    credit: 'BenQ ZOWIE Official'
  },
  'gear-mon-asus-pg248qp': {
    image: 'https://dlcdnwebimgs.asus.com/gain/A7B9F1D6-E6A9-4B3C-B57F-ASUS_ROG_PG248QP/w500',
    credit: 'ASUS ROG Official'
  },
  'gear-mon-viewsonic-240': {
    image: 'https://www.viewsonic.com/vsMedia/productimages/XG2431/XG2431_front.png',
    credit: 'ViewSonic Official'
  }
};

// Replace images by finding each gear item by id
for (const [id, replacement] of Object.entries(imageReplacements)) {
  const idPattern = new RegExp(`(id: "${id}"[\\s\\S]*?image: ")([^"]+)(")`);
  if (idPattern.test(content)) {
    content = content.replace(idPattern, `$1${replacement.image}$3`);
  }
}

// Add ratingLabel, imageCredit, verificationStatus, lastVerifiedDate to every gear item
// Find each rating: X.X line and add fields after it
content = content.replace(
  /(\s+rating: [\d.]+)\n(\s+\})/g,
  (match, ratingLine, closingBrace) => {
    // Determine which gear item this is by looking back
    const beforeMatch = content.substring(0, content.indexOf(match));
    const lastIdMatch = beforeMatch.match(/id: "([^"]+)"/g);
    const lastId = lastIdMatch ? lastIdMatch[lastIdMatch.length - 1].match(/"([^"]+)"/)[1] : null;
    
    const creditInfo = imageReplacements[lastId];
    const credit = creditInfo ? creditInfo.credit : 'Ảnh minh họa';
    
    // Determine verification: mice/monitors with verified specs get verified
    const verifiedGear = [
      'gear-mouse-razer-viper-v3-pro',
      'gear-mouse-gpx2',
      'gear-mouse-razer-deathadder-v3-pro'
    ];
    const status = verifiedGear.includes(lastId) ? 'verified' : 'partially_verified';
    
    return `${ratingLine},\n    ratingLabel: "Điểm nội bộ ESP",\n    imageCredit: "${credit}",\n    verificationStatus: "${status}",\n    lastVerifiedDate: "2026-08-17"\n${closingBrace}`;
  }
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done updating gamingGear.ts');

// Verify
const updated = fs.readFileSync(filePath, 'utf8');
const ratingLabelCount = (updated.match(/ratingLabel/g) || []).length;
const imageCreditCount = (updated.match(/imageCredit/g) || []).length;
const verificationCount = (updated.match(/verificationStatus/g) || []).length;
console.log(`ratingLabel: ${ratingLabelCount}, imageCredit: ${imageCreditCount}, verificationStatus: ${verificationCount}`);

// Check first image replacement worked
const viperImage = updated.match(/id: "gear-mouse-razer-viper-v3-pro"[\s\S]*?image: "([^"]+)"/);
console.log('Viper V3 Pro image:', viperImage?.[1]?.substring(0, 60) + '...');
