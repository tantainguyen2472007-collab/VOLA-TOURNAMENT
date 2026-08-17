import { Agent } from "../types";

export interface GameConfig {
  id: "Valorant" | "LoL" | "CS2" | "AOV";
  name: string;
  shortName: string;
  icon: string;
  roles: string[];
  maps: string[];
  bannerUrl: string;
  description: string;
  agents: Agent[];
  synergyGuidelines: {
    requiredRoles: string[];
    roleDescriptions: Record<string, string>;
  };
}

// 1. LEAGUE OF LEGENDS (LoL) CHAMPIONS
export const LOL_CHAMPIONS: Agent[] = [
  {
    id: "ahri",
    name: "Ahri",
    role: "Mid",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Ahri.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
  },
  {
    id: "yasuo",
    name: "Yasuo",
    role: "Mid",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Yasuo.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
  },
  {
    id: "jinx",
    name: "Jinx",
    role: "ADC",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Jinx.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
  },
  {
    id: "lee_sin",
    name: "Lee Sin",
    role: "Jungle",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/LeeSin.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/LeeSin_0.jpg",
  },
  {
    id: "aatrox",
    name: "Aatrox",
    role: "Top",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Aatrox.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg",
  },
  {
    id: "thresh",
    name: "Thresh",
    role: "Support",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Thresh.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg",
  },
  {
    id: "kaisa",
    name: "Kai'Sa",
    role: "ADC",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Kaisa.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_0.jpg",
  },
  {
    id: "viego",
    name: "Viego",
    role: "Jungle",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Viego.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Viego_0.jpg",
  },
  {
    id: "jax",
    name: "Jax",
    role: "Top",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Jax.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jax_0.jpg",
  },
  {
    id: "nautilus",
    name: "Nautilus",
    role: "Support",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Nautilus.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Nautilus_0.jpg",
  },
  {
    id: "zed",
    name: "Zed",
    role: "Mid",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Zed.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg",
  },
  {
    id: "ezreal",
    name: "Ezreal",
    role: "ADC",
    image: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Ezreal.png",
    fullPortrait: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg",
  },
];

// 2. COUNTER-STRIKE 2 (CS2) ROLES / WEAPONS / OPERATORS
export const CS2_AGENTS: Agent[] = [
  {
    id: "awper_1",
    name: "Main AWPer",
    role: "Sniper",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "igl_1",
    name: "In-Game Leader (IGL)",
    role: "IGL",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "entry_1",
    name: "Entry Fragger",
    role: "Entry",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "support_1",
    name: "Support / Grenadier",
    role: "Support",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "lurker_1",
    name: "Lurker / Anchor",
    role: "Lurker",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80",
  },
];

// 3. LIÊN QUÂN MOBILE (AOV / ARENA OF VALOR)
export const AOV_HEROES: Agent[] = [
  {
    id: "nakroth",
    name: "Nakroth",
    role: "Jungle",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "florentino",
    name: "Florentino",
    role: "Top",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "tulene",
    name: "Tulên",
    role: "Mid",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "elsu",
    name: "Elsu",
    role: "ADC",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "zip",
    name: "Zip",
    role: "Support",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "raz",
    name: "Raz",
    role: "Mid",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "hayate",
    name: "Hayate",
    role: "ADC",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    fullPortrait: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
  },
];
