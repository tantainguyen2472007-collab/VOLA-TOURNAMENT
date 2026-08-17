import { VALORANT_AGENTS } from "../data/valorant";

export const DEFAULT_TURN_ORDER = Array.from({ length: 5 }, (_, playerIndex) => [
  { teamId: "team_a", playerIndex },
  { teamId: "team_b", playerIndex },
]).flat();

export const TURN_ORDER = DEFAULT_TURN_ORDER;

export function getTurnOrder(firstTeam: "team_a" | "team_b" = "team_a") {
  const secondTeam = firstTeam === "team_a" ? "team_b" : "team_a";
  return Array.from({ length: 5 }, (_, playerIndex) => [
    { teamId: firstTeam, playerIndex },
    { teamId: secondTeam, playerIndex },
  ]).flat();
}

export function getAlternatingTurnOrder(firstTeam: "team_a" | "team_b" = "team_a") {
  return getTurnOrder(firstTeam).map(({ teamId, playerIndex }) => `${teamId}:${playerIndex}`);
}

export function getAvailableAgents(role: string, lockedAgentIds: string[]) {
  const locked = new Set(lockedAgentIds);
  return VALORANT_AGENTS.filter((agent) => !locked.has(agent.id) && (role === "Any" || agent.role === role));
}

