const fs = require('fs');

const fileContent = `export interface ProPlayerSetting {
  id: string;
  name: string;
  realName: string;
  team: string;
  teamLogo?: string;
  role: "Duelist" | "Initiator" | "Controller" | "Sentinel" | "Flex";
  region: "Americas" | "EMEA" | "Pacific" | "China";
  country: string;
  countryFlag: string;
  avatar: string;
  status: "Active VCT Pro" | "Champion MVP" | "Legend";
  crosshairCode: string;
  crosshairConfig: {
    color: string;
    outlines: boolean;
    centerDot: boolean;
    innerLines: { show: boolean; length: number; thickness: number; offset: number };
    outerLines: { show: boolean; length: number; thickness: number; offset: number };
  };
  mouse: {
    dpi: number;
    sensitivity: number;
    eDpi: number;
    cm360: number;
    pollingRate: string;
    hz: string;
    mouseGrip: "Claw Grip" | "Fingertip Grip" | "Palm Grip" | "Relaxed Claw";
  };
  video: {
    resolution: string;
    aspectRatio: string;
    displayMode: string;
    refreshRate: string;
    uiQuality?: string;
    textureQuality?: string;
    detailQuality?: string;
    vignette?: boolean;
    vsync?: boolean;
    antialiasing?: string;
    anisotropicFiltering?: string;
  };
  gear: {
    mouse: string;
    mouseWeight: string;
    mousepad: string;
    mousepadType: string;
    keyboard: string;
    keyboardSwitch: string;
    headset: string;
    headsetType: "IEM In-Ear" | "Over-Ear Headset" | "Hybrid Dual";
    monitor: string;
    monitorPanel: string;
    pcSpecs?: string;
  };
  radar?: {
    rotate: boolean;
    fixedOrientation: string;
    keepPlayerCentered: boolean;
    minimapSize: number;
    minimapZoom: number;
    visionCones: boolean;
    showMapRegionNames: string;
  };
  keybinds?: {
    crouch: string;
    walk: string;
    jump: string;
    ability1: string;
    ability2: string;
    ability3: string;
    ultimate: string;
  };
  achievements: string[];
}

export interface GamingGearItem {
  id: string;
  name: string;
  brand: string;
  category: "mouse" | "mousepad" | "keyboard" | "audio" | "monitor";
  tier: "mid" | "flagship";
  tierLabel: "Tầm Trung (Mid-Range)" | "Cao Cấp (Flagship End-game)";
  priceVnd: number;
  priceFormatted: string;
  image: string;
  specs: string[];
  recommendedFor: {
    sensTypes: ("low" | "mid" | "high")[];
    grips?: ("claw" | "fingertip" | "palm")[];
    handSizes?: ("small" | "medium" | "large")[];
    roles?: string[];
  };
  highlightReason: string;
  pros: string[];
  cons: string[];
  proUsers: string[];
  rating: number;
}

export const PRO_SETTINGS_LIST: ProPlayerSetting[] = [
  {
    id: "tenz",
    name: "TenZ",
    realName: "Tyson Ngo",
    team: "Sentinels",
    role: "Flex",
    region: "Americas",
    country: "Canada",
    countryFlag: "🇨🇦",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;s;1;P;c;5;h;0;m;1;0t;1;0l;2;0v;2;0g;1;0o;2;0a;1;0f;0;1b;0;S;c;4;s;0.8;o;1",
    crosshairConfig: {
      color: "#00ffff",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 2, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.3,
      eDpi: 240,
      cm360: 54.3,
      pollingRate: "1000 Hz / 4000 Hz",
      hz: "Raw Input On (Windows 6/11)",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz (540Hz Capable)",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer Viper V3 Pro (White)",
      mouseWeight: "54g siêu nhẹ",
      mousepad: "Artisan Ninja FX Zero Soft (Japan)",
      mousepadType: "Cloth Hybrid Balanced Control",
      keyboard: "Wooting 60HE+ (Rapid Trigger 0.15mm)",
      keyboardSwitch: "Lekker L45 Magnetic Hall-Effect",
      headset: "Sennheiser IE 200 IEM + HyperX Cloud II",
      headsetType: "Hybrid Dual",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN 0.5ms Response",
      pcSpecs: "Intel Core i9-14900K • RTX 4090 24GB • 32GB DDR5 6400MHz"
    },
    achievements: ["VCT Masters Madrid 2024 Champion", "VCT Masters Reykjavik 2021 Champion", "Icon of VALORANT Esports Global"]
  },
  {
    id: "aspas",
    name: "aspas",
    realName: "Erick Santos",
    team: "Leviatán",
    role: "Duelist",
    region: "Americas",
    country: "Brazil",
    countryFlag: "🇧🇷",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;P;c;5;o;1;d;1;z;3;f;0;0b;0;1b;0",
    crosshairConfig: {
      color: "#00ffff",
      outlines: true,
      centerDot: true,
      innerLines: { show: false, length: 0, thickness: 0, offset: 0 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.31,
      eDpi: 248,
      cm360: 52.5,
      pollingRate: "2000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Palm Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Logitech G PRO X Superlight 2 (Magenta)",
      mouseWeight: "60g",
      mousepad: "Vaxee PB 2023 / Artisan Zero Mid",
      mousepadType: "High Density Control Pad",
      keyboard: "Razer Huntsman V3 Pro TKL",
      keyboardSwitch: "Analog Optical Gen-2 (Rapid Trigger)",
      headset: "Razer BlackShark V2 Pro 2024",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN 0.5ms",
      pcSpecs: "AMD Ryzen 7 7800X3D • RTX 4080 Super • 32GB DDR5"
    },
    achievements: ["VALORANT Champions 2022 Champion", "VCT Americas 2024 MVP & Top Duelist", "Record 47 Kills in Single VCT Match"]
  },
  {
    id: "zmjjkk",
    name: "ZmjjKK",
    realName: "Zheng Yongkang (KangKang)",
    team: "EDward Gaming",
    role: "Duelist",
    region: "China",
    country: "China",
    countryFlag: "🇨🇳",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;p;0;P;c;1;h;0;0t;1;0l;4;0v;4;0o;0;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 4, thickness: 1, offset: 0 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.28,
      eDpi: 224,
      cm360: 58.1,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Fingertip Grip"
    },
    video: {
      resolution: "1280x960",
      aspectRatio: "4:3 (Stretched)",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "MSAA 2x",
      anisotropicFiltering: "2x"
    },
    gear: {
      mouse: "ZOWIE EC2-CW Wireless / Razer Viper V3 Pro",
      mouseWeight: "77g (EC2-CW) / 54g",
      mousepad: "Artisan FX Hien Mid (Wine Red)",
      mousepadType: "Fast Hybrid Textured Weave",
      keyboard: "Wooting 60HE+ (Magnetic Hall Effect)",
      keyboardSwitch: "Lekker Switch (Rapid Trigger 0.1mm)",
      headset: "Logitech G PRO X 2 Lightspeed + Moondrop Blessing 3",
      headsetType: "Hybrid Dual",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN Esports Esports-Grade",
      pcSpecs: "Intel Core i9-14900KF • RTX 4090 • 64GB DDR5"
    },
    achievements: ["VALORANT Champions 2024 Seoul Champion & Grand Finals MVP", "World Record 111 Kills in VCT Champions Finals"]
  },
  {
    id: "zekken",
    name: "zekken",
    realName: "Zachary Patrone",
    team: "Sentinels",
    role: "Duelist",
    region: "Americas",
    country: "United States",
    countryFlag: "🇺🇸",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;c;1;P;c;5;t;3;o;1;f;0;0t;1;0l;3;0v;3;0g;1;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ffff",
      outlines: true,
      centerDot: false,
      innerLines: { show: true, length: 3, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 1600,
      sensitivity: 0.175,
      eDpi: 280,
      cm360: 46.5,
      pollingRate: "4000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer Viper V3 Pro (Black)",
      mouseWeight: "54g",
      mousepad: "Artisan FX Zero XSoft (Japan)",
      mousepadType: "Premium Microfiber Control",
      keyboard: "Wooting 60HE+ (Custom Case)",
      keyboardSwitch: "Lekker L45 (0.1mm Rapid Trigger)",
      headset: "HyperX Cloud III Wireless",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN 0.5ms",
      pcSpecs: "Intel Core i9-14900K • RTX 4090 • 32GB DDR5"
    },
    achievements: ["VCT Masters Madrid 2024 Champion & Finals MVP (101 Kills)"]
  },
  {
    id: "t3xture",
    name: "t3xture",
    realName: "Kim Na-ra",
    team: "Gen.G Esports",
    role: "Duelist",
    region: "Pacific",
    country: "South Korea",
    countryFlag: "🇰🇷",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;P;c;1;h;0;0t;1;0l;2;0v;2;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 2, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.35,
      eDpi: 280,
      cm360: 46.5,
      pollingRate: "4000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer Viper V3 Pro (White)",
      mouseWeight: "54g",
      mousepad: "Artisan FX Zero Mid",
      mousepadType: "Firm Smooth Hybrid Control",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker Hall Effect Magnetic",
      headset: "Razer BlackShark V2 Pro 2024",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN Esports Display",
      pcSpecs: "AMD Ryzen 7 7800X3D • RTX 4080 • 32GB DDR5"
    },
    achievements: ["VCT Masters Shanghai 2024 Champion"]
  },
  {
    id: "karon",
    name: "Karon",
    realName: "Kim Won-tae",
    team: "Gen.G Esports",
    role: "Controller",
    region: "Pacific",
    country: "South Korea",
    countryFlag: "🇰🇷",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;s;1;P;c;1;h;0;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 3, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.25,
      eDpi: 200,
      cm360: 65.1,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Palm Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Logitech G PRO X Superlight 2 (White)",
      mouseWeight: "60g",
      mousepad: "Lethal Gaming Gear Saturn Pro XSoft",
      mousepadType: "Porous Japanese Foam Control Pad",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker L45 Rapid Trigger",
      headset: "Sennheiser IE 200 IEM",
      headsetType: "IEM In-Ear",
      monitor: "ZOWIE XL2566K 360Hz",
      monitorPanel: "Fast TN 0.5ms DyAc+",
      pcSpecs: "Intel Core i7-14700K • RTX 4070 Ti Super"
    },
    achievements: ["VCT Masters Shanghai 2024 Finals MVP & Champion"]
  },
  {
    id: "f0rsaken",
    name: "f0rsakeN",
    realName: "Jason Susanto",
    team: "Paper Rex",
    role: "Flex",
    region: "Pacific",
    country: "Indonesia",
    countryFlag: "🇮🇩",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    status: "Active VCT Pro",
    crosshairCode: "0;s;1;P;o;1;0t;1;0l;1;0v;1;0g;1;0o;0;0a;1;0f;0;1t;1;1l;1;1v;1;1g;1;1o;2;1a;1;1m;0;1f;0",
    crosshairConfig: {
      color: "#ffffff",
      outlines: true,
      centerDot: false,
      innerLines: { show: true, length: 1, thickness: 1, offset: 0 },
      outerLines: { show: true, length: 1, thickness: 1, offset: 2 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.42,
      eDpi: 336,
      cm360: 38.8,
      pollingRate: "2000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Fingertip Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Logitech G PRO X Superlight 2",
      mouseWeight: "60g",
      mousepad: "ZOWIE G-SR-SE Rouge / Bi",
      mousepadType: "Smooth Cloth Fast Control",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker L45 (0.1mm Rapid Trigger)",
      headset: "HyperX Cloud II + Moondrop Chu II",
      headsetType: "Hybrid Dual",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN",
      pcSpecs: "AMD Ryzen 7 7800X3D • RTX 4080 • 32GB DDR5"
    },
    achievements: ["VCT Pacific 2023 Champion"]
  },
  {
    id: "something",
    name: "something",
    realName: "Ilya Petrov",
    team: "Paper Rex",
    role: "Duelist",
    region: "Pacific",
    country: "Russia",
    countryFlag: "🇷🇺",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    status: "Active VCT Pro",
    crosshairCode: "0;P;c;8;u;FFFFFFFF;h;0;0t;1;0l;2;0v;2;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#ffffff",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 2, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 1600,
      sensitivity: 0.44,
      eDpi: 704,
      cm360: 18.5,
      pollingRate: "4000 Hz",
      hz: "Ultra High Sens Reflex King",
      mouseGrip: "Fingertip Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Logitech G PRO X Superlight 2 (White)",
      mouseWeight: "60g",
      mousepad: "Artisan FX Zero Soft",
      mousepadType: "Balanced Microfiber Surface",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker L45 (0.1mm Actuation)",
      headset: "HyperX Cloud Alpha Wireless",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN",
      pcSpecs: "Intel Core i9-14900K • RTX 4090"
    },
    achievements: ["VCT Pacific 2023 Finals MVP & Champion"]
  },
  {
    id: "chronicle",
    name: "Chronicle",
    realName: "Timofey Khromov",
    team: "Fnatic",
    role: "Flex",
    region: "EMEA",
    country: "Russia",
    countryFlag: "🇷🇺",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;P;c;1;h;0;0t;1;0l;4;0v;4;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 4, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.26,
      eDpi: 208,
      cm360: 62.6,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Logitech G PRO X Superlight 2",
      mouseWeight: "60g",
      mousepad: "Artisan FX Zero Soft",
      mousepadType: "Japan Soft Foam Control",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker Switch (Rapid Trigger 0.15mm)",
      headset: "HyperX Cloud Alpha",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN",
      pcSpecs: "Intel Core i9-13900K • RTX 4080"
    },
    achievements: ["First Player in History to Win 3 International VCT Trophies"]
  },
  {
    id: "boaster",
    name: "Boaster",
    realName: "Jake Howlett",
    team: "Fnatic",
    role: "Controller",
    region: "EMEA",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    status: "Active VCT Pro",
    crosshairCode: "0;s;1;P;c;1;o;1;d;1;0b;0;1b;0;S;c;1;s;0.6;o;1",
    crosshairConfig: {
      color: "#00ff00",
      outlines: true,
      centerDot: true,
      innerLines: { show: false, length: 0, thickness: 0, offset: 0 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.25,
      eDpi: 200,
      cm360: 65.1,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Palm Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Fnatic Bolt Wireless / Logitech GPX2",
      mouseWeight: "67g / 60g",
      mousepad: "Fnatic Dash XD / Artisan Zero Soft",
      mousepadType: "Hybrid Speed / Control",
      keyboard: "Fnatic Streak65 LP (Low Profile)",
      keyboardSwitch: "Fnatic Speed Switches",
      headset: "Sony INZONE H9 Wireless",
      headsetType: "Over-Ear Headset",
      monitor: "Sony INZONE M3 240Hz / ZOWIE XL2566K",
      monitorPanel: "Fast IPS / Fast TN",
      pcSpecs: "Intel Core i9-14900K • RTX 4080"
    },
    achievements: ["VCT LOCK//IN São Paulo Champion 2023", "VCT Masters Tokyo 2023 Champion"]
  },
  {
    id: "wo0t",
    name: "Wo0t",
    realName: "Mert Alkan",
    team: "Team Heretics",
    role: "Flex",
    region: "EMEA",
    country: "Turkey",
    countryFlag: "🇹🇷",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;P;c;1;h;0;0t;1;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 3, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.28,
      eDpi: 224,
      cm360: 58.1,
      pollingRate: "2000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer Viper V3 Pro (White)",
      mouseWeight: "54g",
      mousepad: "Artisan FX Zero Soft",
      mousepadType: "Japan High Precision Cloth",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker L45 (0.1mm Rapid Trigger)",
      headset: "Razer BlackShark V2 Pro",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN",
      pcSpecs: "AMD Ryzen 7 7800X3D • RTX 4080 Super"
    },
    achievements: ["VCT Masters Shanghai 2024 Grand Finalist", "VALORANT Champions 2024 Seoul Top 2 Finalist"]
  },
  {
    id: "derke",
    name: "Derke",
    realName: "Nikita Sirmitev",
    team: "Team Vitality",
    role: "Duelist",
    region: "EMEA",
    country: "Finland",
    countryFlag: "🇫🇮",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;s;1;P;c;4;h;0;0t;1;0l;2;0v;2;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#ffff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 2, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 400,
      sensitivity: 0.74,
      eDpi: 296,
      cm360: 44.0,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Palm Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Logitech G PRO X Superlight 2",
      mouseWeight: "60g",
      mousepad: "Artisan FX Hien Mid",
      mousepadType: "Fast Rough Hybrid Weave",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker Hall Effect",
      headset: "Logitech G PRO X Wireless",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz",
      monitorPanel: "Fast TN",
      pcSpecs: "Intel Core i9-14900K • RTX 4080"
    },
    achievements: ["VCT LOCK//IN 2023 Champion", "VCT Masters Tokyo 2023 Champion"]
  },
  {
    id: "chichoo",
    name: "CHICHOO",
    realName: "Wan Shunzhi",
    team: "EDward Gaming",
    role: "Sentinel",
    region: "China",
    country: "China",
    countryFlag: "🇨🇳",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;p;0;P;c;1;h;0;0t;1;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 3, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.32,
      eDpi: 256,
      cm360: 50.8,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Vaxee XE Wireless (Blue)",
      mouseWeight: "75g Balanced",
      mousepad: "Artisan FX Zero Soft",
      mousepadType: "Micro-textured Control",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker L45 (0.15mm Rapid Trigger)",
      headset: "Moondrop Blessing 3 IEM",
      headsetType: "IEM In-Ear",
      monitor: "ZOWIE XL2566K 360Hz",
      monitorPanel: "Fast TN DyAc+",
      pcSpecs: "Intel Core i9-14900KF • RTX 4090"
    },
    achievements: ["VALORANT Champions 2024 Seoul Champion & Legendary Clutch King"]
  },
  {
    id: "johnqt",
    name: "johnqt",
    realName: "Mohamed Amine Ouarid",
    team: "Sentinels",
    role: "Sentinel",
    region: "Americas",
    country: "Morocco",
    countryFlag: "🇲🇦",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;p;0;s;1;P;c;2;h;0;0t;1;0l;2;0v;2;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#a3e635",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 2, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.28,
      eDpi: 224,
      cm360: 58.1,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer Viper V3 Pro (Black)",
      mouseWeight: "54g",
      mousepad: "Lethal Gaming Gear Saturn Pro XSoft",
      mousepadType: "Porous Japanese Sponge Control",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker Switch (Rapid Trigger)",
      headset: "HyperX Cloud Alpha Wireless",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz",
      monitorPanel: "Fast TN DyAc+",
      pcSpecs: "Intel Core i9-14900K • RTX 4090"
    },
    achievements: ["VCT Masters Madrid 2024 Champion IGL"]
  },
  {
    id: "demon1",
    name: "Demon1",
    realName: "Max Mazanov",
    team: "NRG",
    role: "Duelist",
    region: "Americas",
    country: "United States",
    countryFlag: "🇺🇸",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;s;1;P;o;1;d;1;f;0;s;0;0b;0;1b;0;S;c;0;s;0.8;o;1",
    crosshairConfig: {
      color: "#ffffff",
      outlines: true,
      centerDot: true,
      innerLines: { show: false, length: 0, thickness: 0, offset: 0 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 1600,
      sensitivity: 0.1,
      eDpi: 160,
      cm360: 81.4,
      pollingRate: "1000 Hz",
      hz: "Low Sens Precision Arm Aimer",
      mouseGrip: "Palm Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer DeathAdder V3 Pro (Smooth Ergonomic)",
      mouseWeight: "63g",
      mousepad: "Lethal Gaming Gear Saturn Pro",
      mousepadType: "Smooth Microfiber Foam",
      keyboard: "Razer Huntsman V3 Pro TKL",
      keyboardSwitch: "Analog Optical Gen-2",
      headset: "Razer BlackShark V2",
      headsetType: "Over-Ear Headset",
      monitor: "Alienware AW2524H 500Hz",
      monitorPanel: "Fast IPS 0.5ms",
      pcSpecs: "Intel Core i9-13900KS • RTX 4090"
    },
    achievements: ["VALORANT Champions 2023 Champion & Tournament MVP"]
  },
  {
    id: "riens",
    name: "RieNs",
    realName: "Enes Ecirli",
    team: "Team Heretics",
    role: "Initiator",
    region: "EMEA",
    country: "Turkey",
    countryFlag: "🇹🇷",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    status: "Active VCT Pro",
    crosshairCode: "0;P;c;1;h;0;0t;1;0l;3;0v;3;0o;1;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 3, thickness: 1, offset: 1 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.25,
      eDpi: 200,
      cm360: 65.1,
      pollingRate: "2000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer Viper V3 Pro",
      mouseWeight: "54g",
      mousepad: "Artisan Zero Soft",
      mousepadType: "Control Cloth",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker Magnetic",
      headset: "HyperX Cloud III",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz",
      monitorPanel: "Fast TN",
      pcSpecs: "AMD Ryzen 7 7800X3D • RTX 4080"
    },
    achievements: ["VALORANT Champions 2024 Seoul Top 2 Finalist"]
  },
  {
    id: "leo",
    name: "Leo",
    realName: "Leo Jannesson",
    team: "Fnatic",
    role: "Initiator",
    region: "EMEA",
    country: "Sweden",
    countryFlag: "🇸🇪",
    avatar: "https://images.unsplash.com/photo-1544168190-79c15427015f?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;s;1;P;h;0;0l;4;0v;4;0o;0;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#ffffff",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 4, thickness: 1, offset: 0 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.165,
      eDpi: 132,
      cm360: 98.7,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Palm Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Razer DeathAdder V3 Pro",
      mouseWeight: "63g",
      mousepad: "Artisan Hayate Otsu",
      mousepadType: "Hybrid Speed/Control",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker L45",
      headset: "HyperX Cloud II Wireless",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN 0.5ms",
      pcSpecs: "Intel Core i9-14900K • RTX 4090"
    },
    achievements: ["VCT LOCK//IN São Paulo 2023 MVP", "VCT Masters Tokyo 2023 Champion"]
  },
  {
    id: "nats",
    name: "nAts",
    realName: "Ayaz Akhmetshin",
    team: "Team Liquid",
    role: "Sentinel",
    region: "EMEA",
    country: "Russia",
    countryFlag: "🇷🇺",
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&auto=format&fit=crop&q=80",
    status: "Champion MVP",
    crosshairCode: "0;s;1;P;c;1;o;1;0t;1;0l;2;0v;2;0o;2;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#00ff00",
      outlines: true,
      centerDot: false,
      innerLines: { show: true, length: 2, thickness: 1, offset: 2 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.49,
      eDpi: 392,
      cm360: 33.3,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Claw Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "ZOWIE S2-C",
      mouseWeight: "69g",
      mousepad: "ZOWIE G-SR-SE",
      mousepadType: "Smooth Cloth Fast Control",
      keyboard: "Logitech G PRO X Keyboard",
      keyboardSwitch: "GX Brown Tactile",
      headset: "Logitech G PRO X Wireless",
      headsetType: "Over-Ear Headset",
      monitor: "Alienware AW2524H 500Hz",
      monitorPanel: "Fast IPS",
      pcSpecs: "Intel Core i9-13900K • RTX 4080"
    },
    achievements: ["VCT Masters Berlin 2021 Champion", "The Best Sentinel in the World (2021)"]
  },
  {
    id: "s0m",
    name: "s0m",
    realName: "Sam Oh",
    team: "NRG",
    role: "Controller",
    region: "Americas",
    country: "United States",
    countryFlag: "🇺🇸",
    avatar: "https://images.unsplash.com/photo-1548449112-96a38a643324?w=400&auto=format&fit=crop&q=80",
    status: "Active VCT Pro",
    crosshairCode: "0;P;h;0;0l;4;0v;4;0o;0;0a;1;0f;0;1b;0",
    crosshairConfig: {
      color: "#ffffff",
      outlines: false,
      centerDot: false,
      innerLines: { show: true, length: 4, thickness: 1, offset: 0 },
      outerLines: { show: false, length: 0, thickness: 0, offset: 0 }
    },
    mouse: {
      dpi: 800,
      sensitivity: 0.4,
      eDpi: 320,
      cm360: 40.8,
      pollingRate: "1000 Hz",
      hz: "Raw Input On",
      mouseGrip: "Fingertip Grip"
    },
    video: {
      resolution: "1920x1080",
      aspectRatio: "16:9",
      displayMode: "Fullscreen",
      refreshRate: "360 Hz",
      uiQuality: "Low",
      textureQuality: "Low",
      detailQuality: "Low",
      vignette: false,
      vsync: false,
      antialiasing: "None",
      anisotropicFiltering: "1x"
    },
    gear: {
      mouse: "Logitech G PRO X Superlight 2",
      mouseWeight: "60g",
      mousepad: "Lethal Gaming Gear Saturn Pro",
      mousepadType: "Smooth Microfiber Foam",
      keyboard: "Wooting 60HE+",
      keyboardSwitch: "Lekker L45",
      headset: "Logitech G PRO X 2 Lightspeed",
      headsetType: "Over-Ear Headset",
      monitor: "ZOWIE XL2566K 360Hz DyAc+",
      monitorPanel: "Fast TN",
      pcSpecs: "Intel Core i9-14900K • RTX 4090"
    },
    achievements: ["Top 4 VCT LOCK//IN 2023", "Top 4 VCT Masters Tokyo 2023"]
  }
];

export const GEAR_DATABASE: GamingGearItem[] = [
  // --- CHUỘT (MICE) ---
  {
    id: "gear-mouse-vxe-r1",
    name: "VXE Dragonfly R1 Pro Max / ATK F1 Pro",
    brand: "VGN / ATK",
    category: "mouse",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 980000,
    priceFormatted: "980.000đ - 1.250.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
    specs: ["Trọng lượng 49g-54g", "Sensor PAW3395 (26.000 DPI)", "Polling Rate 1000Hz - 4000Hz Dongle", "Switch Huano Blue Shell Pink Dot"],
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["claw", "fingertip"],
      handSizes: ["small", "medium"],
      roles: ["Duelist", "Flex"]
    },
    highlightReason: "Ông vua phân khúc chuột quốc dân tầm giá 1 triệu: Form cầm ôm tay tương tự Pulsar/Logitech nhưng nhẹ chỉ 49g, mắt đọc PAW3395 chuẩn Esports không delay.",
    pros: ["Siêu nhẹ dưới 55g", "Giá thành cực kỳ dễ tiếp cận", "Mắt đọc không delay ngang ngửa chuột 3 triệu", "Phần mềm tùy chỉnh web-based tiện dụng"],
    cons: ["Build quality (chất lượng hoàn thiện) không bằng các hãng lớn", "Thời lượng pin trung bình khá", "Lớp phủ (coating) hơi trơn"],
    proUsers: ["Rising Tier-2 & Challengers Stars", "Top Radiant Streamers"],
    rating: 9.6
  },
  {
    id: "gear-mouse-ninjutso-sora",
    name: "Ninjutso Sora V2 Wireless (39g)",
    brand: "Ninjutso",
    category: "mouse",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 2290000,
    priceFormatted: "2.290.000đ",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80",
    specs: ["Trọng lượng siêu thực 39g", "Sensor PAW3395 Không Lỗ", "Hỗ trợ 8000Hz Polling Rate", "Optical Switches Omron"],
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["claw", "fingertip"],
      handSizes: ["small", "medium"],
      roles: ["Duelist", "Initiator"]
    },
    highlightReason: "Chuột không dây không lỗ nhẹ nhất thế giới (39g). Lưng đẩy nhẹ phía sau hoàn hảo cho Claw Grip gõ đầu siêu tốc, giảm mỏi cổ tay 100%.",
    pros: ["Nhẹ nhất thế giới (39g) ở mức không đục lỗ", "Hình dáng tối ưu tuyệt đối cho Claw Grip", "Cảm giác flick siêu nhanh không bị quán tính", "Switch quang học Omron bền bỉ"],
    cons: ["Quá nhẹ có thể gây khó kiểm soát (run tay) lúc đầu", "Chỉ hợp với tay cỡ nhỏ-vừa", "Không hợp cho người quen tì nặng lòng bàn tay (Palm grip)"],
    proUsers: ["Primmie (Secret)", "SScary (Bleed)"],
    rating: 9.7
  },
  {
    id: "gear-mouse-razer-viper-v3-pro",
    name: "Razer Viper V3 Pro (8000Hz)",
    brand: "Razer",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3890000,
    priceFormatted: "3.890.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
    specs: ["Trọng lượng 54g", "Sensor Focus Pro 35K Gen-2", "Native 8000Hz Wireless Dongle đi kèm", "Optical Switch Gen-3 (90M clicks)"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      grips: ["claw", "palm", "fingertip"],
      handSizes: ["medium", "large"],
      roles: ["Duelist", "Sentinel", "Initiator", "Flex"]
    },
    highlightReason: "Chuột thi đấu số 1 VCT 2024/2025: Chiếm tới hơn 40% tuyển thủ chuyên nghiệp tại Masters & Champions. Form cầm công thái học đối xứng tối ưu mọi thế cầm tay.",
    pros: ["Cảm biến mạnh nhất thế giới hiện nay (Focus Pro 35K)", "Trọng lượng hoàn hảo (54g) không quá nhẹ cũng không nặng", "Lớp phủ (Coating) bám tay số 1 thị trường", "8000Hz không cần mua thêm Dongle"],
    cons: ["Mức giá khá cao cấp", "Form cầm hơi to so với người tay nhỏ", "Phần mềm Synapse đôi khi chiếm tài nguyên máy"],
    proUsers: ["TenZ", "zekken", "t3xture", "Wo0t", "johnqt"],
    rating: 9.9
  },
  {
    id: "gear-mouse-gpx2",
    name: "Logitech G PRO X Superlight 2",
    brand: "Logitech G",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3490000,
    priceFormatted: "3.490.000đ",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80",
    specs: ["Trọng lượng 60g", "Sensor HERO 2 (32.000 DPI)", "Polling Rate 4000Hz Update", "LIGHTFORCE Hybrid Optical-Mechanical Switches"],
    recommendedFor: {
      sensTypes: ["low", "mid"],
      grips: ["palm", "claw"],
      handSizes: ["medium", "large"],
      roles: ["Duelist", "Controller", "Sentinel"]
    },
    highlightReason: "Huyền thoại bền bỉ an toàn tuyệt đối. Form cầm 'khoai tây' huyền thoại phù hợp với 99% dáng bàn tay, thời lượng pin 95 giờ trâu nhất làng Esports.",
    pros: ["Form cầm an toàn tuyệt đối, ai cầm cũng hợp", "Thời lượng pin siêu trâu (95 tiếng liên tục)", "Switch Hybrid nảy, đanh, chống Double-Click", "Chất lượng hoàn thiện cực kỳ bền bỉ (Tank)"],
    cons: ["Feet chuột mặc định khá tệ, cần dán thêm feet bên ngoài", "Cổng sạc C hơi kén dây cắm lõi to", "Trọng lượng 60g không còn là nhẹ nhất thị trường"],
    proUsers: ["aspas", "Chronicle", "something", "Derke", "Karon"],
    rating: 9.8
  },
  {
    id: "gear-mouse-zowie-ec2cw",
    name: "ZOWIE EC2-CW Wireless",
    brand: "BenQ ZOWIE",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3690000,
    priceFormatted: "3.690.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
    specs: ["Trọng lượng 77g", "Sensor PAW3370 độ trễ cực thấp", "Enhanced Wireless Receiver (Đế sạc kiêm thu sóng chống nhiễu)", "Form Ergonomic (Công thái học) chuẩn mực"],
    recommendedFor: {
      sensTypes: ["low", "mid"],
      grips: ["palm", "claw"],
      handSizes: ["medium", "large"],
      roles: ["Sentinel", "Controller", "Initiator"]
    },
    highlightReason: "Sự lựa chọn chuẩn mực cho những ai đề cao độ ổn định kê góc. Form Ergonomic huyền thoại của Zowie giúp tay bạn luôn thoải mái sau 10 tiếng chơi liên tục.",
    pros: ["Form tay công thái học (Ergonomic) tốt nhất thế giới", "Kết nối không dây chống nhiễu tuyệt đối trong môi trường giải đấu", "Không cần cài phần mềm (Plug and Play)", "Phù hợp kê góc tĩnh, tracking ổn định"],
    cons: ["Trọng lượng 77g khá nặng so với tiêu chuẩn 2025", "Chỉ hỗ trợ 1000Hz", "Mắt đọc 3370 hơi cũ (dù vẫn rất tốt)"],
    proUsers: ["ZmjjKK", "Boaster", "FNS", "Marved"],
    rating: 9.6
  },

  // --- LÓT CHUỘT (MOUSEPADS) ---
  {
    id: "gear-pad-qck-heavy",
    name: "SteelSeries QcK Heavy / ZOWIE G-SR II",
    brand: "SteelSeries / ZOWIE",
    category: "mousepad",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 650000,
    priceFormatted: "650.000đ - 850.000đ",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80",
    specs: ["Độ dày 6mm đầm êm cổ tay", "Bề mặt Micro-woven Cloth vải dệt mịn", "Stopping Power (Lực dừng) Cực Cao", "Chống ẩm thế hệ mới"],
    recommendedFor: {
      sensTypes: ["low", "mid"],
      roles: ["Operator Sniper", "Sentinel", "Tactical Anchor"]
    },
    highlightReason: "Lót chuột Control cổ điển dành cho các tay súng bắn Sens Chậm (Low Sens): Độ dày 6mm triệt tiêu rung lắc mặt bàn, lực dừng cao giúp ghim tâm One-Tap đầu không bị trôi.",
    pros: ["Độ dày 6mm êm tay, che khuyết điểm mặt bàn gồ ghề", "Độ ghìm tâm (Stopping power) cực kỳ uy lực", "Mức giá rẻ, dễ dàng thay mới khi cũ"],
    cons: ["Bị ảnh hưởng bởi độ ẩm/thời tiết (rít đi khi trời mưa)", "Cần giặt thường xuyên để giữ độ mượt", "Viền không bo mép dễ bong tróc sau 1 năm"],
    proUsers: ["Demon1", "ScreaM", "nAts"],
    rating: 9.4
  },
  {
    id: "gear-pad-artisan-zero",
    name: "Artisan Ninja FX Zero Soft / XSoft (Nhật Bản)",
    brand: "Artisan Japan",
    category: "mousepad",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 1650000,
    priceFormatted: "1.650.000đ - 1.850.000đ",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80",
    specs: ["Bề mặt sợi Microfiber dệt xoắn thủ công Nhật", "Đế xốp PORON chống trượt bám dính bàn đá", "Độ lún Soft/XSoft hỗ trợ lực hãm vi mô", "Bo viền thấp ngang bề mặt"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Flex", "Initiator", "Sentinel"]
    },
    highlightReason: "Lót chuột số 1 thế giới được hơn 70% VCT Pros tin dùng. Độ cân bằng hoàn hảo giữa tốc độ lướt mượt mà và khả năng ghìm tâm tức thì khi nhấn nhẹ ngón tay.",
    pros: ["Độ trượt tĩnh cực mượt, không bị dính lúc khởi động chuột", "Chất liệu đế Poron cao cấp dính chặt xuống bàn", "Đường khâu viền đỉnh cao, không bao giờ tước chỉ", "Miễn nhiễm với độ ẩm và mồ hôi tay"],
    cons: ["Rất dễ bám lông chó/mèo và bụi vải nhỏ", "Phải order hoặc mua qua gian thương với giá cao", "Sản xuất nhỏ lẻ nên thường xuyên cháy hàng"],
    proUsers: ["TenZ", "zekken", "Chronicle", "CHICHOO", "Wo0t"],
    rating: 10.0
  },
  {
    id: "gear-pad-lgg-saturn-pro",
    name: "Lethal Gaming Gear Saturn Pro XSoft",
    brand: "LGG (USA)",
    category: "mousepad",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 1550000,
    priceFormatted: "1.550.000đ",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80",
    specs: ["Đế xốp Poron cao cấp nhập khẩu", "Vải dệt mịn 100% không xước da tay", "Độ ma sát tĩnh thấp lướt êm dịu", "Size XL 490x420mm hoặc vuông 500x500mm"],
    recommendedFor: {
      sensTypes: ["low", "mid"],
      roles: ["Duelist", "Sentinel"]
    },
    highlightReason: "Đối thủ cạnh tranh trực tiếp 1:1 với Artisan Zero. Bề mặt mịn hơn không bám lông bụi, kiểm soát đường đạn Vandal One-Tap cực kỳ dính tâm.",
    pros: ["Kiểm soát (Control) rất tốt, nhỉnh hơn Zero một chút", "Bề mặt êm mịn không cọ xát rát da tay", "KHÔNG bám lông bụi như đối thủ Artisan", "Size vuông 50cm diện tích rộng rãi cho Sens chậm"],
    cons: ["Mất một thời gian ngắn để break-in (làm quen bề mặt)", "Chất lượng viền bo hơi dày hơn Artisan một tí", "Khá nặng và dày"],
    proUsers: ["johnqt", "Demon1", "Karon", "s0m"],
    rating: 9.8
  },

  // --- BÀN PHÍM RAPID TRIGGER / HE ---
  {
    id: "gear-kb-drunkdeer-a75",
    name: "DrunkDeer A75 / ATK68 Magnetic Switch (HE)",
    brand: "DrunkDeer / ATK",
    category: "keyboard",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 1750000,
    priceFormatted: "1.750.000đ - 2.150.000đ",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
    specs: ["Switch Từ Tính Hall Effect (Magnetic Switch)", "Tính năng Rapid Trigger 0.2mm - 3.8mm", "Thời gian phản hồi siêu tốc 1ms", "Núm xoay Volume tiện lợi (A75)"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Flex", "Initiator"]
    },
    highlightReason: "Bàn phím Rapid Trigger phá đảo phân khúc dưới 2 triệu. Giúp người chơi Counter-Strafing (dừng lại bắn ngay tức thì) chuẩn xác 100% như Pro Player.",
    pros: ["Tính năng Rapid Trigger hoạt động hiệu quả", "Giá thành quá ngon cho công nghệ từ tính (HE)", "Cảm giác gõ (Sound test) đầm và êm hơn Wooting gốc", "App Web-based dễ sử dụng"],
    cons: ["Case nhựa có phần hơi lỏng lẻo và ọp ẹp", "Keycap PBT đi kèm chất lượng trung bình", "Không có tính năng Rappy Snappy hay SOCD nâng cao"],
    proUsers: ["Rising APAC Talents", "Rank Radiant Pros"],
    rating: 9.6
  },
  {
    id: "gear-kb-wooting-60he",
    name: "Wooting 60HE+ (Tachyon Mode)",
    brand: "Wooting (Netherlands)",
    category: "keyboard",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 4890000,
    priceFormatted: "4.890.000đ - 5.400.000đ",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
    specs: ["Switch Lekker Hall Effect L45/L60", "Rapid Trigger độ nhạy 0.1mm siêu việt", "Tachyon Mode độ trễ ngõ vào < 0.1ms", "Hỗ trợ Rappy Snappy & SOCD Snappy Tapping"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Controller", "Initiator", "Sentinel", "Flex"]
    },
    highlightReason: "Ông vua bàn phím Esports toàn cầu. 90% siêu sao VCT Champions sử dụng Wooting 60HE+ nhờ cơ chế dừng bước Counter-strafe nhanh hơn bàn phím cơ truyền thống 30-50ms.",
    pros: ["Cảm biến từ tính mượt mà và chính xác nhất thế giới", "Phần mềm Wootility đỉnh cao, cập nhật liên tục (SOCD, Rappy Snappy)", "Độ trễ thấp tuyệt đối (< 0.1ms Tachyon Mode)", "Dễ dàng độ (Custom) với các vỏ nhôm Tofu60"],
    cons: ["Bản gốc gõ khá ồn và vang (cần lube/lót foam thêm)", "Chỉ có layout 60% (không mũi tên)", "Giá mua đi kèm phí ship/thuế rất đắt nếu order trực tiếp"],
    proUsers: ["TenZ", "ZmjjKK", "zekken", "t3xture", "f0rsakeN", "Chronicle"],
    rating: 10.0
  },

  // --- TAI NGHE & IEMS (AUDIO) ---
  {
    id: "gear-audio-moondrop-chu",
    name: "Moondrop Chu II / Tangzu Wan'er S.G (IEM In-Ear)",
    brand: "Moondrop / Tangzu",
    category: "audio",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 520000,
    priceFormatted: "450.000đ - 550.000đ",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
    specs: ["Tai nghe In-Ear Monitor (IEM) màng loa DLC/PET", "Âm trường phẳng định vị tiếng bước chân chuẩn xác", "Dây rời 2-Pin 0.78mm chống đứt gãy", "Housing kim loại sang trọng cách âm tốt"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Sentinel", "Initiator", "Controller"]
    },
    highlightReason: "Lựa chọn IEM 'ngon-bổ-rẻ' bất ngờ chỉ 500k. Tách bạch tiếng đặt Spike, tiếng thay đạn, tiếng bước chân cự ly xa rõ ràng vượt trội so với tai nghe gaming cồng kềnh.",
    pros: ["Định vị âm thanh (Imaging) cực kỳ xuất sắc trong tầm giá", "Nhẹ nhàng, đeo lâu không nóng tai", "Dây cáp tháo rời dễ thay thế", "Housing kim loại bền bỉ"],
    cons: ["Cáp stock (dây gốc) hay bị rối", "Không có Micro tích hợp (Cần mua cáp mic riêng)", "Âm bass hơi mỏng nếu nghe nhạc EDM"],
    proUsers: ["Rank 1 Radiant Grinders", "VCT Challengers Players"],
    rating: 9.5
  },
  {
    id: "gear-audio-sennheiser-ie200",
    name: "Sennheiser IE 200 (Esports IEM Reference)",
    brand: "Sennheiser",
    category: "audio",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3290000,
    priceFormatted: "3.290.000đ",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
    specs: ["Driver TrueResponse 7mm độc quyền Đức", "Trọng lượng siêu nhẹ 4g/tai đeo không mỏi", "Âm hình 3D Imaging đỉnh cao định vị xuyên tường", "Dual-tuning eartip chống bí tai"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Sentinel", "Controller", "Flex"]
    },
    highlightReason: "Sự lựa chọn số 1 của TenZ, Karon và các tuyển thủ VCT trên sân khấu thi đấu. Không bao giờ đau đầu do gọng ép, định vị chuẩn xác từng bước chân trên lầu hay dưới hầm.",
    pros: ["Soundstage (âm trường) rộng rãi như tai chụp (Over-ear)", "Định vị phương hướng trong Valorant chuẩn xác 100%", "Nhẹ như không đeo (4g mỗi bên)", "Tune âm phẳng, tiếng súng không bị chói gắt"],
    cons: ["Dây cáp stock (Microphonics) hay tạo tiếng sột soạt khi cọ áo", "Chân cắm MMCX làm lõm, khó thay dây hãng thứ 3", "Cần DAC/Amp nhỏ hoặc soundcard xịn để phát huy hết lực"],
    proUsers: ["TenZ", "Karon", "SScary", "Leo"],
    rating: 9.8
  },

  // --- MÀN HÌNH (MONITORS) ---
  {
    id: "gear-mon-viewsonic-240",
    name: "ViewSonic XG2431 240Hz (PureXP Blur Busters)",
    brand: "ViewSonic",
    category: "monitor",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 6890000,
    priceFormatted: "6.890.000đ",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    specs: ["Tần số quét 240Hz Fast IPS", "Công nghệ khử nhòe PureXP chứng nhận Blur Busters", "Độ trễ 0.5ms MPRT", "Màu sắc 100% sRGB sắc nét"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Initiator"]
    },
    highlightReason: "Màn hình 240Hz tầm giá dưới 7 triệu có độ trong trẻo chuyển động tốt nhất nhờ công nghệ chớp đèn khử bóng mờ Blur Busters danh tiếng.",
    pros: ["Khử bóng mờ chuyển động (Motion Blur Reduction) số 1 tầm giá", "Tấm nền Fast IPS cho màu sắc tươi sáng xem phim chuẩn", "Độ trễ ngõ vào thấp, chân đế công thái học đa năng", "Chứng nhận BlurBusters Approved uy tín"],
    cons: ["Độ sáng giảm mạnh khi bật chế độ khử nhòe PureXP", "Viền màn hình hơi dày so với chuẩn 2025", "Menu OSD thiết kế nút bấm vật lý hơi cứng"],
    proUsers: ["Esports Training Centers", "Radiant Ranked Pros"],
    rating: 9.6
  },
  {
    id: "gear-mon-zowie-xl2566k",
    name: "ZOWIE XL2566K 360Hz DyAc+ (Esports King)",
    brand: "BenQ ZOWIE",
    category: "monitor",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 16500000,
    priceFormatted: "16.500.000đ",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    specs: ["Tần số quét 360Hz Fast TN", "Công nghệ DyAc+ khử nhòe phần cứng", "Black eQualizer làm sáng góc tối", "S-Switch điều khiển nhanh 3 Profile"],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Sentinel", "Controller", "Initiator", "Flex"]
    },
    highlightReason: "Chén thánh của màn hình thi đấu VCT. Công nghệ DyAc+ triệt tiêu hoàn toàn bóng mờ khi vẩy chuột (Flick) hoặc theo dõi kẻ địch tạt ngang (Strafe).",
    pros: ["Độ trong trẻo chuyển động (Motion Clarity) vô địch thế giới", "DyAc+ làm tâm súng đứng yên khi địch strafe qua lại", "Color Vibrance giúp tách biệt kẻ địch khỏi hậu cảnh", "Chân đế thiết kế gọn, nhường không gian cho bàn di chuột bự"],
    cons: ["Tấm nền TN nên góc nhìn và màu sắc kém khi xem phim/làm đồ họa", "Viền màn hình rất dày kiểu cổ điển", "Giá quá đắt đỏ so với màn hình 360Hz IPS thông thường"],
    proUsers: ["90% VCT Professional Players", "TenZ", "ZmjjKK", "Demon1", "Boaster"],
    rating: 9.9
  }
];
`;

fs.writeFileSync('src/data/proSettings.ts', fileContent);
console.log('Successfully generated updated proSettings.ts data.');
