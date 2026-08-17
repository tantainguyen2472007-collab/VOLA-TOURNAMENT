export interface ProPlayerSetting {
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

export interface EloShapesData {
  shapeType: "Symmetrical - Low Hump" | "Symmetrical - Back Hump" | "Ergonomic - Right Handed" | "Fingertip Micro";
  dimensionsMm: { length: number; width: number; height: number };
  weightGrams: number;
  sensor: string;
  maxPollingRate: string;
  connectivity: string;
  batteryLife: string;
  coating: string;
  handSuitability: string;
  comparableMice: string[];
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
  eloshapes?: EloShapesData;
  recommendedFor: {
    sensTypes: ("low" | "mid" | "high")[];
    grips?: ("claw" | "fingertip" | "palm")[];
    handSizes?: ("small" | "medium" | "large")[];
    roles?: string[];
  };
  highlightReason: string;
  proUsers: string[];
  rating: number;
}
