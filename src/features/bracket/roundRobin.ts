import { TournamentTeam, TournamentMatch } from "./engine";

export interface GroupStanding {
  team: TournamentTeam;
  played: number;
  won: number;
  lost: number;
  points: number;
  scoreDifference: number; // tiebreaker
}

export function generateRoundRobin(teams: TournamentTeam[]): TournamentMatch[] {
  if (teams.length < 2) return [];
  
  const paddedTeams = [...teams];
  if (paddedTeams.length % 2 !== 0) {
    paddedTeams.push({ id: 'bye', name: 'BYE' });
  }

  const numTeams = paddedTeams.length;
  const matches: TournamentMatch[] = [];
  const rounds = numTeams - 1;
  const half = numTeams / 2;

  const teamIndexes = Array.from({length: numTeams}, (_, i) => i);

  let matchCounter = 0;
  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const t1 = paddedTeams[teamIndexes[i]];
      const t2 = paddedTeams[teamIndexes[numTeams - 1 - i]];

      if (t1.name !== 'BYE' && t2.name !== 'BYE') {
        matches.push({
          id: `rr-r${r+1}-m${matchCounter++}`,
          round: r + 1,
          matchIndex: matchCounter,
          team1: t1,
          team2: t2,
          score1: null,
          score2: null,
          winner: null,
          nextMatchId: null // Round robin doesn't have a direct next match
        });
      }
    }
    // Rotate for next round (keep index 0 fixed)
    teamIndexes.splice(1, 0, teamIndexes.pop()!);
  }

  return matches;
}

export function calculateStandings(teams: TournamentTeam[], matches: TournamentMatch[]): GroupStanding[] {
  const standingsMap = new Map<string, GroupStanding>();
  
  teams.forEach(t => {
    if (t.name !== 'BYE') {
      standingsMap.set(t.id, {
        team: t,
        played: 0,
        won: 0,
        lost: 0,
        points: 0,
        scoreDifference: 0
      });
    }
  });

  matches.forEach(m => {
    if (m.winner && m.team1 && m.team2) {
      const s1 = standingsMap.get(m.team1.id);
      const s2 = standingsMap.get(m.team2.id);
      
      if (s1 && s2 && m.score1 !== null && m.score2 !== null) {
        s1.played++;
        s2.played++;
        
        s1.scoreDifference += (m.score1 - m.score2);
        s2.scoreDifference += (m.score2 - m.score1);
        
        if (m.winner.id === m.team1.id) {
          s1.won++;
          s1.points += 3; // e.g. 3 points for win
          s2.lost++;
        } else if (m.winner.id === m.team2.id) {
          s2.won++;
          s2.points += 3;
          s1.lost++;
        }
      }
    }
  });

  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.scoreDifference - a.scoreDifference; // Tiebreaker
  });
}
