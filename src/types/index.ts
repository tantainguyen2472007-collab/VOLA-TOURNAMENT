export type Role = "Admin" | "Captain" | "Player" | "Viewer";

export type Game = "Valorant" | "LoL" | "AOV";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  captainId: string;
  players: User[];
}

export interface Agent {
  id: string;
  name: string;
  role: "Duelist" | "Initiator" | "Controller" | "Sentinel";
  image: string;
}

export interface DraftPick {
  id: string;
  teamId: string;
  playerId?: string;
  agentId?: string;
  role?: Agent["role"] | "Any";
  status: "waiting" | "picking" | "locked";
  type: "ban" | "pick";
}

export interface Match {
  id: string;
  game: Game;
  team1: Team;
  team2: Team;
  map?: string;
  format: "BO1" | "BO3" | "BO5";
  status: "upcoming" | "drafting" | "live" | "completed";
  score: { team1: number; team2: number };
}
