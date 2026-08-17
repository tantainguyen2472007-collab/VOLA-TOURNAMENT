import { TournamentTeam } from "./engine";

export interface SwissTeamState {
  team: TournamentTeam;
  wins: number;
  losses: number;
  matchesPlayed: number;
  buchholz: number; // Điểm hệ số đối thủ
  history: {
    opponentId: string;
    opponentName: string;
    score: string;
    result: "W" | "L";
  }[];
  status: "active" | "qualified" | "eliminated";
}

export interface SwissMatch {
  id: string;
  round: number;
  team1: TournamentTeam;
  team2: TournamentTeam;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  status: "pending" | "live" | "completed";
}

export interface SwissTournament {
  currentRound: number;
  maxRounds: number;
  winsToQualify: number; // thường là 3 trận thắng (3-0, 3-1, 3-2)
  lossesToEliminate: number; // thường là 3 trận thua (0-3, 1-3, 2-3)
  teams: SwissTeamState[];
  matches: SwissMatch[];
  roundHistory: {
    round: number;
    matches: SwissMatch[];
  }[];
}

// Khởi tạo giải đấu Thụy Sĩ (Swiss System 16 hoặc 8-32 đội)
export function generateSwissTournament(
  teams: TournamentTeam[],
  winsToQualify: number = 3,
  lossesToEliminate: number = 3
): SwissTournament {
  const teamStates: SwissTeamState[] = teams.map((team) => ({
    team,
    wins: 0,
    losses: 0,
    matchesPlayed: 0,
    buchholz: 0,
    history: [],
    status: "active",
  }));

  // Tạo vòng 1 (Round 1 Pairings)
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const round1Matches: SwissMatch[] = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      round1Matches.push({
        id: `swiss-r1-m${Math.floor(i / 2) + 1}`,
        round: 1,
        team1: shuffled[i],
        team2: shuffled[i + 1],
        score1: null,
        score2: null,
        winnerId: null,
        status: "pending",
      });
    }
  }

  return {
    currentRound: 1,
    maxRounds: 5,
    winsToQualify,
    lossesToEliminate,
    teams: teamStates,
    matches: round1Matches,
    roundHistory: [{ round: 1, matches: round1Matches }],
  };
}

// Cập nhật tỷ số trận đấu Thụy Sĩ
export function updateSwissMatchScore(
  tournament: SwissTournament,
  matchId: string,
  score1: number,
  score2: number
): SwissTournament {
  const matchIndex = tournament.matches.findIndex((m) => m.id === matchId);
  if (matchIndex === -1) return tournament;

  const match = tournament.matches[matchIndex];
  const winnerId = score1 > score2 ? match.team1.id : match.team2.id;
  const loserId = score1 > score2 ? match.team2.id : match.team1.id;

  const updatedMatches = [...tournament.matches];
  updatedMatches[matchIndex] = {
    ...match,
    score1,
    score2,
    winnerId,
    status: "completed",
  };

  // Cập nhật số trận thắng/thua cho các đội
  const updatedTeams = tournament.teams.map((t) => {
    if (t.team.id === winnerId) {
      const newWins = t.wins + 1;
      return {
        ...t,
        wins: newWins,
        matchesPlayed: t.matchesPlayed + 1,
        status: newWins >= tournament.winsToQualify ? ("qualified" as const) : t.status,
        history: [
          ...t.history,
          {
            opponentId: loserId,
            opponentName: match.team1.id === winnerId ? match.team2.name : match.team1.name,
            score: `${score1}-${score2}`,
            result: "W" as const,
          },
        ],
      };
    }
    if (t.team.id === loserId) {
      const newLosses = t.losses + 1;
      return {
        ...t,
        losses: newLosses,
        matchesPlayed: t.matchesPlayed + 1,
        status: newLosses >= tournament.lossesToEliminate ? ("eliminated" as const) : t.status,
        history: [
          ...t.history,
          {
            opponentId: winnerId,
            opponentName: match.team1.id === loserId ? match.team2.name : match.team1.name,
            score: `${score1}-${score2}`,
            result: "L" as const,
          },
        ],
      };
    }
    return t;
  });

  return {
    ...tournament,
    teams: updatedTeams,
    matches: updatedMatches,
  };
}

// Bốc thăm vòng tiếp theo cho Thụy Sĩ (Swiss Next Round Pairing)
export function pairNextSwissRound(tournament: SwissTournament): SwissTournament {
  const nextRound = tournament.currentRound + 1;
  const activeTeams = tournament.teams.filter((t) => t.status === "active");

  if (activeTeams.length < 2) return tournament;

  // Gom nhóm các đội theo cùng hiệu số thắng/thua (e.g. 1-0, 0-1, 2-0, 1-1, 0-2)
  const scoreBuckets: Record<string, SwissTeamState[]> = {};
  activeTeams.forEach((t) => {
    const key = `${t.wins}-${t.losses}`;
    if (!scoreBuckets[key]) scoreBuckets[key] = [];
    scoreBuckets[key].push(t);
  });

  const newMatches: SwissMatch[] = [];
  let matchCounter = 1;

  Object.entries(scoreBuckets).forEach(([, pool]) => {
    const poolCopy = [...pool].sort(() => Math.random() - 0.5);
    while (poolCopy.length >= 2) {
      const t1 = poolCopy.pop()!;
      // Tìm đối thủ chưa từng gặp nếu có thể
      let oppIdx = poolCopy.findIndex((c) => !t1.history.some((h) => h.opponentId === c.team.id));
      if (oppIdx === -1) oppIdx = poolCopy.length - 1;
      const t2 = poolCopy.splice(oppIdx, 1)[0];

      newMatches.push({
        id: `swiss-r${nextRound}-m${matchCounter++}`,
        round: nextRound,
        team1: t1.team,
        team2: t2.team,
        score1: null,
        score2: null,
        winnerId: null,
        status: "pending",
      });
    }
  });

  return {
    ...tournament,
    currentRound: nextRound,
    matches: newMatches,
    roundHistory: [...tournament.roundHistory, { round: nextRound, matches: newMatches }],
  };
}
