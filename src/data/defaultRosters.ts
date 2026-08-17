import { TeamProfile } from "../types";

export const DEFAULT_TEAM_A_ROSTER: TeamProfile = {
  id: "team_a",
  name: "DAMIT2K ESPORTS",
  tag: "D2K",
  logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=80",
  primaryColor: "#00e5ff",
  players: [
    {
      id: "p_a1",
      name: "Nguyễn Văn A",
      nickname: "DAMIT #1",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80",
      mainRole: "Main Duelist",
    },
    {
      id: "p_a2",
      name: "Trần Minh B",
      nickname: "SHADOW",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      mainRole: "IGL / Sentinel",
    },
    {
      id: "p_a3",
      name: "Lê Hoàng C",
      nickname: "VIPER_GOD",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
      mainRole: "Controller / Smoker",
    },
    {
      id: "p_a4",
      name: "Phạm Hải D",
      nickname: "RECON_SOVA",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
      mainRole: "Initiator / Recon",
    },
    {
      id: "p_a5",
      name: "Đỗ Tuấn E",
      nickname: "FLEX_CLUTCH",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      mainRole: "Flex / Second Duelist",
    },
  ],
};

export const DEFAULT_TEAM_B_ROSTER: TeamProfile = {
  id: "team_b",
  name: "TEAM FLASH ESPORTS",
  tag: "FL",
  logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=120&auto=format&fit=crop&q=80",
  primaryColor: "#ff4655",
  players: [
    {
      id: "p_b1",
      name: "Hoàng Long X",
      nickname: "FLASH_FIRE",
      avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80",
      mainRole: "Main Duelist",
    },
    {
      id: "p_b2",
      name: "Vũ Nam Y",
      nickname: "CYPHER_ACE",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&auto=format&fit=crop&q=80",
      mainRole: "Sentinel / Trap",
    },
    {
      id: "p_b3",
      name: "Bùi Kiên Z",
      nickname: "OMEN_WARPING",
      avatar: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=120&auto=format&fit=crop&q=80",
      mainRole: "Controller / Smoker",
    },
    {
      id: "p_b4",
      name: "Đinh Đức W",
      nickname: "FADE_FEAR",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      mainRole: "Initiator / Flash",
    },
    {
      id: "p_b5",
      name: "Trịnh Khang K",
      nickname: "SNIPER_CHAMBER",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      mainRole: "Main AWPer / Sentinel",
    },
  ],
};
