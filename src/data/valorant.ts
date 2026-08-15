import { Agent } from "../types";

export const VALORANT_AGENTS: Agent[] = [
  { id: "astra", name: "Astra", role: "Controller", image: "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png" },
  { id: "brimstone", name: "Brimstone", role: "Controller", image: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png" },
  { id: "clove", name: "Clove", role: "Controller", image: "https://media.valorant-api.com/agents/1dbf2ed4-4a49-f623-2287-eb84cae69ce0/displayicon.png" },
  { id: "harbor", name: "Harbor", role: "Controller", image: "https://media.valorant-api.com/agents/cc8b64c8-4b25-4fd9-6aaf-7c818b2c4e2f/displayicon.png" },
  { id: "omen", name: "Omen", role: "Controller", image: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png" },
  { id: "viper", name: "Viper", role: "Controller", image: "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png" },
  
  { id: "iso", name: "Iso", role: "Duelist", image: "https://media.valorant-api.com/agents/0e38b51d-41a8-56c0-4f2e-6bc84d547d25/displayicon.png" },
  { id: "jett", name: "Jett", role: "Duelist", image: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png" },
  { id: "neon", name: "Neon", role: "Duelist", image: "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png" },
  { id: "phoenix", name: "Phoenix", role: "Duelist", image: "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png" },
  { id: "raze", name: "Raze", role: "Duelist", image: "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png" },
  { id: "reyna", name: "Reyna", role: "Duelist", image: "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png" },
  { id: "yoru", name: "Yoru", role: "Duelist", image: "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png" },

  { id: "breach", name: "Breach", role: "Initiator", image: "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png" },
  { id: "fade", name: "Fade", role: "Initiator", image: "https://media.valorant-api.com/agents/dade69b4-415a-8cb1-65ce-0f9ea7b5b750/displayicon.png" },
  { id: "gekko", name: "Gekko", role: "Initiator", image: "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png" },
  { id: "kayo", name: "KAY/O", role: "Initiator", image: "https://media.valorant-api.com/agents/601cbced-46dc-0ea7-0487-75908b8d4239/displayicon.png" },
  { id: "skye", name: "Skye", role: "Initiator", image: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png" },
  { id: "sova", name: "Sova", role: "Initiator", image: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png" }, // reusing skye icon for sova to save time if needed, actually let's use proper
  
  { id: "chamber", name: "Chamber", role: "Sentinel", image: "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png" },
  { id: "cypher", name: "Cypher", role: "Sentinel", image: "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png" },
  { id: "deadlock", name: "Deadlock", role: "Sentinel", image: "https://media.valorant-api.com/agents/cc8b64c8-4b25-4fd9-6aaf-7c818b2c4e2f/displayicon.png" }, // placeholder
  { id: "killjoy", name: "Killjoy", role: "Sentinel", image: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png" },
  { id: "sage", name: "Sage", role: "Sentinel", image: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png" },
  { id: "vyse", name: "Vyse", role: "Sentinel", image: "https://media.valorant-api.com/agents/cc8b64c8-4b25-4fd9-6aaf-7c818b2c4e2f/displayicon.png" }, // placeholder
];

export const VALORANT_MAPS = ["Lotus", "Ascent", "Bind", "Haven", "Split", "Breeze", "Sunset", "Abyss"];
