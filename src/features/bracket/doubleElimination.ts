import { TournamentTeam } from "./engine";

export interface DoubleElimMatch {
  id: string;
  bracket: "upper" | "lower" | "grand_final";
  round: number;
  roundName: string;
  matchIndex: number;
  team1: TournamentTeam | null;
  team2: TournamentTeam | null;
  score1: number | null;
  score2: number | null;
  winner: TournamentTeam | null;
  loser: TournamentTeam | null;
  nextMatchWinnerId?: string | null;
  nextMatchLoserId?: string | null;
}

export interface DoubleEliminationTournament {
  upper: DoubleElimMatch[];
  lower: DoubleElimMatch[];
  grandFinal: DoubleElimMatch;
  champion: TournamentTeam | null;
}

export function generateDoubleElimination(teams: TournamentTeam[]): DoubleElimMatch[] {
  if (teams.length < 2) return [];

  // Standard 8-team or padded 4/8/16
  const numTeams = Math.max(4, Math.pow(2, Math.ceil(Math.log2(teams.length))));
  const paddedTeams = [...teams];
  while (paddedTeams.length < numTeams) {
    paddedTeams.push({ id: `bye-${paddedTeams.length + 1}`, name: "BYE" });
  }

  const matches: DoubleElimMatch[] = [];

  if (numTeams === 4) {
    // 4-Team Double Elimination
    // UB Semi 1
    matches.push({
      id: "ub-r1-m1",
      bracket: "upper",
      round: 1,
      roundName: "BÁN KẾT NHÁNH THẮNG",
      matchIndex: 0,
      team1: paddedTeams[0],
      team2: paddedTeams[3],
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "ub-r2-m1",
      nextMatchLoserId: "lb-r1-m1"
    });
    // UB Semi 2
    matches.push({
      id: "ub-r1-m2",
      bracket: "upper",
      round: 1,
      roundName: "BÁN KẾT NHÁNH THẮNG",
      matchIndex: 1,
      team1: paddedTeams[1],
      team2: paddedTeams[2],
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "ub-r2-m1",
      nextMatchLoserId: "lb-r1-m1"
    });
    // UB Final
    matches.push({
      id: "ub-r2-m1",
      bracket: "upper",
      round: 2,
      roundName: "CHUNG KẾT NHÁNH THẮNG",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "gf-m1",
      nextMatchLoserId: "lb-r2-m1"
    });
    // LB R1
    matches.push({
      id: "lb-r1-m1",
      bracket: "lower",
      round: 1,
      roundName: "VÒNG 1 NHÁNH THUA",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "lb-r2-m1",
      nextMatchLoserId: null
    });
    // LB Final
    matches.push({
      id: "lb-r2-m1",
      bracket: "lower",
      round: 2,
      roundName: "CHUNG KẾT NHÁNH THUA",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "gf-m1",
      nextMatchLoserId: null
    });
    // Grand Final
    matches.push({
      id: "gf-m1",
      bracket: "grand_final",
      round: 1,
      roundName: "CHUNG KẾT TỔNG (GRAND FINAL)",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: null,
      nextMatchLoserId: null
    });
  } else {
    // 8-Team Double Elimination (Standard VCT Format)
    // Upper R1 (Quarterfinals)
    for (let i = 0; i < 4; i++) {
      matches.push({
        id: `ub-r1-m${i + 1}`,
        bracket: "upper",
        round: 1,
        roundName: "TỨ KẾT NHÁNH THẮNG",
        matchIndex: i,
        team1: paddedTeams[i * 2],
        team2: paddedTeams[i * 2 + 1],
        score1: null,
        score2: null,
        winner: null,
        loser: null,
        nextMatchWinnerId: `ub-r2-m${Math.floor(i / 2) + 1}`,
        nextMatchLoserId: `lb-r1-m${Math.floor(i / 2) + 1}`
      });
    }

    // Upper R2 (Semifinals)
    for (let i = 0; i < 2; i++) {
      matches.push({
        id: `ub-r2-m${i + 1}`,
        bracket: "upper",
        round: 2,
        roundName: "BÁN KẾT NHÁNH THẮNG",
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winner: null,
        loser: null,
        nextMatchWinnerId: "ub-r3-m1",
        nextMatchLoserId: `lb-r2-m${2 - i}` // Cross drop to lower
      });
    }

    // Upper Final
    matches.push({
      id: "ub-r3-m1",
      bracket: "upper",
      round: 3,
      roundName: "CHUNG KẾT NHÁNH THẮNG",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "gf-m1",
      nextMatchLoserId: "lb-r4-m1"
    });

    // Lower R1
    for (let i = 0; i < 2; i++) {
      matches.push({
        id: `lb-r1-m${i + 1}`,
        bracket: "lower",
        round: 1,
        roundName: "VÒNG 1 NHÁNH THUA",
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winner: null,
        loser: null,
        nextMatchWinnerId: `lb-r2-m${i + 1}`,
        nextMatchLoserId: null
      });
    }

    // Lower R2
    for (let i = 0; i < 2; i++) {
      matches.push({
        id: `lb-r2-m${i + 1}`,
        bracket: "lower",
        round: 2,
        roundName: "VÒNG 2 NHÁNH THUA",
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winner: null,
        loser: null,
        nextMatchWinnerId: "lb-r3-m1",
        nextMatchLoserId: null
      });
    }

    // Lower Semi
    matches.push({
      id: "lb-r3-m1",
      bracket: "lower",
      round: 3,
      roundName: "BÁN KẾT NHÁNH THUA",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "lb-r4-m1",
      nextMatchLoserId: null
    });

    // Lower Final
    matches.push({
      id: "lb-r4-m1",
      bracket: "lower",
      round: 4,
      roundName: "CHUNG KẾT NHÁNH THUA",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: "gf-m1",
      nextMatchLoserId: null
    });

    // Grand Final
    matches.push({
      id: "gf-m1",
      bracket: "grand_final",
      round: 1,
      roundName: "CHUNG KẾT TỔNG (GRAND FINAL)",
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winner: null,
      loser: null,
      nextMatchWinnerId: null,
      nextMatchLoserId: null
    });
  }

  return autoResolveByesDouble(matches);
}

function autoResolveByesDouble(matches: DoubleElimMatch[]): DoubleElimMatch[] {
  let list = [...matches];
  let changed = true;
  let loops = 0;

  while (changed && loops < 10) {
    changed = false;
    loops++;
    for (let i = 0; i < list.length; i++) {
      const m = list[i];
      if (m.winner) continue;
      const t1Bye = m.team1?.name === "BYE";
      const t2Bye = m.team2?.name === "BYE";

      if ((t1Bye && m.team2) || (t2Bye && m.team1)) {
        const winner = t1Bye ? m.team2 : m.team1;
        const loser = t1Bye ? m.team1 : m.team2;
        list = updateDoubleElimMatchScore(list, m.id, t1Bye ? 0 : 2, t1Bye ? 2 : 0);
        changed = true;
      }
    }
  }

  return list;
}

export function updateDoubleElimMatchScore(
  matches: DoubleElimMatch[],
  matchId: string,
  score1: number,
  score2: number
): DoubleElimMatch[] {
  const list = matches.map((m) => ({ ...m }));
  const idx = list.findIndex((m) => m.id === matchId);
  if (idx === -1) return list;

  const match = list[idx];
  match.score1 = score1;
  match.score2 = score2;

  if (score1 > score2) {
    match.winner = match.team1;
    match.loser = match.team2;
  } else if (score2 > score1) {
    match.winner = match.team2;
    match.loser = match.team1;
  } else {
    match.winner = null;
    match.loser = null;
  }

  // Propagate Winner
  if (match.nextMatchWinnerId && match.winner) {
    const nextIdx = list.findIndex((m) => m.id === match.nextMatchWinnerId);
    if (nextIdx !== -1) {
      const nextMatch = list[nextIdx];
      // If team1 is null or belongs to this source feeder
      if (!nextMatch.team1 || nextMatch.team1.id === match.winner.id || (match.bracket === "upper" && match.round === 1 && match.matchIndex % 2 === 0)) {
        nextMatch.team1 = match.winner;
      } else {
        nextMatch.team2 = match.winner;
      }
    }
  }

  // Propagate Loser into Lower Bracket
  if (match.nextMatchLoserId && match.loser) {
    const nextLoserIdx = list.findIndex((m) => m.id === match.nextMatchLoserId);
    if (nextLoserIdx !== -1) {
      const nextLoserMatch = list[nextLoserIdx];
      if (!nextLoserMatch.team1 || nextLoserMatch.team1.id === match.loser.id) {
        nextLoserMatch.team1 = match.loser;
      } else {
        nextLoserMatch.team2 = match.loser;
      }
    }
  }

  return list;
}
