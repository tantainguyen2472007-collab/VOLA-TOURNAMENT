import { VALORANT_AGENTS } from "../data/valorant";
export const TURN_ORDER = Array.from({ length: 5 }, (_, playerIndex) => [
  { teamId: "team_a", playerIndex },
  { teamId: "team_b", playerIndex },
]).flat();
export function getAlternatingTurnOrder() { return TURN_ORDER.map(({ teamId, playerIndex }) => `${teamId}:${playerIndex}`); }
export function getAvailableAgents(role: string, lockedAgentIds: string[]) { const locked = new Set(lockedAgentIds); return VALORANT_AGENTS.filter((agent) => !locked.has(agent.id) && (role === "Any" || agent.role === role)); }
