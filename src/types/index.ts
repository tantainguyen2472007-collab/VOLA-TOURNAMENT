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

// ============================================
// Database / Realtime Types
// ============================================

export type RoomRole = "admin" | "captain_a" | "captain_b" | "caster" | "viewer";
export type RoomStatus = "lobby" | "drafting" | "completed";
export type SlotStatus = "waiting" | "picking" | "locked";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  team_a_name: string;
  team_b_name: string;
  game: Game;
  status: RoomStatus;
  created_by: string;
  config: Record<string, unknown>;
  created_at: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  role: RoomRole;
  joined_at: string;
}

export interface DbDraftSlot {
  id: string;
  room_id: string;
  team_id: "team_a" | "team_b";
  player_index: number;
  status: SlotStatus;
  selected_role: string | null;
  agent_id: string | null;
  agent_name: string | null;
  agent_image: string | null;
  agent_role: string | null;
  locked_at: string | null;
}

/** Actions broadcast over Supabase Realtime channel */
export type DraftAction =
  | { type: "SELECT_ROLE"; slotIndex: number; role: string }
  | { type: "SPIN"; slotIndex: number }
  | { type: "LOCK"; slotIndex: number; agent: Agent }
  | { type: "NEXT_TURN"; nextIndex: number }
  | { type: "RANDOM_MAP"; map: string }
  | { type: "RESET" };
