import { Agent } from "../types";

export interface ValorantMapDetail {
  id: string;
  name: string;
  splash: string;
  sites: string;
  country: string;
}

export const VALORANT_AGENTS: Agent[] = [
  { 
    id: "astra", 
    name: "Astra", 
    role: "Controller", 
    image: "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/fullportrait.png"
  },
  { 
    id: "breach", 
    name: "Breach", 
    role: "Initiator", 
    image: "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/fullportrait.png"
  },
  { 
    id: "brimstone", 
    name: "Brimstone", 
    role: "Controller", 
    image: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/fullportrait.png"
  },
  { 
    id: "chamber", 
    name: "Chamber", 
    role: "Sentinel", 
    image: "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/fullportrait.png"
  },
  { 
    id: "clove", 
    name: "Clove", 
    role: "Controller", 
    image: "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/fullportrait.png"
  },
  { 
    id: "cypher", 
    name: "Cypher", 
    role: "Sentinel", 
    image: "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/fullportrait.png"
  },
  { 
    id: "deadlock", 
    name: "Deadlock", 
    role: "Sentinel", 
    image: "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/fullportrait.png"
  },
  { 
    id: "fade", 
    name: "Fade", 
    role: "Initiator", 
    image: "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/fullportrait.png"
  },
  { 
    id: "gekko", 
    name: "Gekko", 
    role: "Initiator", 
    image: "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png"
  },
  { 
    id: "harbor", 
    name: "Harbor", 
    role: "Controller", 
    image: "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/fullportrait.png"
  },
  { 
    id: "iso", 
    name: "Iso", 
    role: "Duelist", 
    image: "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/fullportrait.png"
  },
  { 
    id: "jett", 
    name: "Jett", 
    role: "Duelist", 
    image: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png"
  },
  { 
    id: "kayo", 
    name: "KAY/O", 
    role: "Initiator", 
    image: "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/fullportrait.png"
  },
  { 
    id: "killjoy", 
    name: "Killjoy", 
    role: "Sentinel", 
    image: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/fullportrait.png"
  },
  { 
    id: "neon", 
    name: "Neon", 
    role: "Duelist", 
    image: "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/fullportrait.png"
  },
  { 
    id: "omen", 
    name: "Omen", 
    role: "Controller", 
    image: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/fullportrait.png"
  },
  { 
    id: "phoenix", 
    name: "Phoenix", 
    role: "Duelist", 
    image: "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/fullportrait.png"
  },
  { 
    id: "raze", 
    name: "Raze", 
    role: "Duelist", 
    image: "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/fullportrait.png"
  },
  { 
    id: "reyna", 
    name: "Reyna", 
    role: "Duelist", 
    image: "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png"
  },
  { 
    id: "sage", 
    name: "Sage", 
    role: "Sentinel", 
    image: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/fullportrait.png"
  },
  { 
    id: "skye", 
    name: "Skye", 
    role: "Initiator", 
    image: "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/fullportrait.png"
  },
  { 
    id: "sova", 
    name: "Sova", 
    role: "Initiator", 
    image: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png"
  },
  { 
    id: "viper", 
    name: "Viper", 
    role: "Controller", 
    image: "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/fullportrait.png"
  },
  { 
    id: "vyse", 
    name: "Vyse", 
    role: "Sentinel", 
    image: "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/fullportrait.png"
  },
  { 
    id: "yoru", 
    name: "Yoru", 
    role: "Duelist", 
    image: "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png",
    fullPortrait: "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/fullportrait.png"
  }
];

export const VALORANT_MAP_DETAILS: ValorantMapDetail[] = [
  { id: "ascent", name: "Ascent", splash: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png", sites: "2 Sites (A/B)", country: "Ý (Venice)" },
  { id: "bind", name: "Bind", splash: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png", sites: "2 Sites • Teleporters", country: "Morocco" },
  { id: "haven", name: "Haven", splash: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png", sites: "3 Sites (A/B/C)", country: "Bhutan" },
  { id: "lotus", name: "Lotus", splash: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png", sites: "3 Sites • Rotating Doors", country: "Ấn Độ" },
  { id: "split", name: "Split", splash: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png", sites: "2 Sites • Ropes", country: "Nhật Bản (Tokyo)" },
  { id: "sunset", name: "Sunset", splash: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png", sites: "2 Sites (Mid Focus)", country: "Mỹ (Los Angeles)" },
  { id: "abyss", name: "Abyss", splash: "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/splash.png", sites: "2 Sites • Fall Hazards", country: "Na Uy" },
  { id: "breeze", name: "Breeze", splash: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png", sites: "2 Sites (Long Range)", country: "Bermuda" },
  { id: "icebox", name: "Icebox", splash: "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/splash.png", sites: "2 Sites • Ziplines", country: "Nga" },
  { id: "pearl", name: "Pearl", splash: "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/splash.png", sites: "2 Sites (Underwater)", country: "Bồ Đào Nha" },
  { id: "fracture", name: "Fracture", splash: "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/splash.png", sites: "2 Sites • H-Split", country: "Mỹ (New Mexico)" }
];

export const VALORANT_MAPS = VALORANT_MAP_DETAILS.map(m => m.name);

export const ROLE_THEMES: Record<string, { badge: string; border: string; glow: string; text: string; bg: string }> = {
  Duelist: {
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    border: "border-rose-500/40",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.35)]",
    text: "text-rose-400",
    bg: "from-rose-950/40 to-transparent"
  },
  Controller: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    border: "border-purple-500/40",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.35)]",
    text: "text-purple-400",
    bg: "from-purple-950/40 to-transparent"
  },
  Initiator: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    border: "border-emerald-500/40",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    text: "text-emerald-400",
    bg: "from-emerald-950/40 to-transparent"
  },
  Sentinel: {
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    border: "border-cyan-500/40",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.35)]",
    text: "text-cyan-400",
    bg: "from-cyan-950/40 to-transparent"
  },
  Any: {
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    border: "border-yellow-500/40",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.35)]",
    text: "text-yellow-400",
    bg: "from-yellow-950/40 to-transparent"
  }
};
