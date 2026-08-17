export type SourceName = "ProSettings" | "EloShapes" | "Phong Cách Xanh" | "LineupsValorant";

export interface SourceMetadata {
  sourceName: SourceName;
  sourceUrl: string;
  lastVerified: string;
  imageAttribution?: string;
}

export interface LineupSourceState {
  source: SourceMetadata;
  availability: "available" | "blocked_by_robots" | "not_collected";
}

export const LINEUP_SOURCE_STATE: LineupSourceState = {
  source: {
    sourceName: "LineupsValorant",
    sourceUrl: "https://lineupsvalorant.com/",
    lastVerified: "2026-08-17",
  },
  availability: "blocked_by_robots",
};

export function isValidSourceMetadata(source: SourceMetadata): boolean {
  return /^https:\/\//.test(source.sourceUrl)
    && /^\d{4}-\d{2}-\d{2}$/.test(source.lastVerified);
}

export function findProUsersForGear(gearName: string, players: { id: string; gear: { mouse: string; keyboard: string; headset: string; mousepad: string; monitor: string } }[]): string[] {
  const normalized = gearName.trim().toLowerCase();
  return players
    .filter(({ gear }) => Object.values(gear).some((item) => item.trim().toLowerCase() === normalized))
    .map(({ id }) => id);
}