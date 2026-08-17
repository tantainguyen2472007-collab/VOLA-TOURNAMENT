export interface TournamentTeam {
  id: string;
  name: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  matchIndex: number;
  team1: TournamentTeam | null;
  team2: TournamentTeam | null;
  score1: number | null;
  score2: number | null;
  winner: TournamentTeam | null;
  nextMatchId: string | null;
}

// Generate classic seeding (1v8, 4v5, etc)
export function getSeeding(numTeams: number): number[] {
  if (numTeams < 2) return [1];
  let rounds = Math.log2(numTeams);
  let pls = [1, 2];
  for (let i = 1; i < rounds; i++) {
    const nextPls = [];
    const length = pls.length;
    for (let j = 0; j < length; j++) {
      nextPls.push(pls[j]);
      nextPls.push(Math.pow(2, i + 1) + 1 - pls[j]);
    }
    pls = nextPls;
  }
  return pls;
}

export function generateSingleElimination(teams: TournamentTeam[]): TournamentMatch[] {
  if (teams.length === 0) return [];
  const numTeams = Math.pow(2, Math.ceil(Math.log2(Math.max(teams.length, 2))));
  const paddedTeams = [...teams];
  
  // Pad with BYEs
  while (paddedTeams.length < numTeams) {
    paddedTeams.push({ id: `bye-${paddedTeams.length}`, name: 'BYE' });
  }

  const seeds = getSeeding(numTeams);
  const seededTeams = seeds.map(seed => paddedTeams[seed - 1]);

  const matches: TournamentMatch[] = [];
  let currentRoundMatches: string[] = [];

  // Round 1
  let matchIndex = 0;
  for (let i = 0; i < numTeams; i += 2) {
    const matchId = `r1-m${matchIndex}`;
    matches.push({
      id: matchId,
      round: 1,
      matchIndex,
      team1: seededTeams[i],
      team2: seededTeams[i + 1],
      score1: null,
      score2: null,
      winner: null,
      nextMatchId: null,
    });
    currentRoundMatches.push(matchId);
    matchIndex++;
  }

  // Subsequent rounds
  let numMatchesInRound = numTeams / 4;
  let round = 2;
  let previousRoundMatches = [...currentRoundMatches];
  
  while (numMatchesInRound >= 1) {
    currentRoundMatches = [];
    matchIndex = 0;
    for (let i = 0; i < numMatchesInRound; i++) {
      const matchId = `r${round}-m${matchIndex}`;
      matches.push({
        id: matchId,
        round,
        matchIndex,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winner: null,
        nextMatchId: null,
      });
      currentRoundMatches.push(matchId);
      
      const prev1 = matches.find(m => m.id === previousRoundMatches[i * 2]);
      const prev2 = matches.find(m => m.id === previousRoundMatches[i * 2 + 1]);
      if (prev1) prev1.nextMatchId = matchId;
      if (prev2) prev2.nextMatchId = matchId;
      
      matchIndex++;
    }
    previousRoundMatches = [...currentRoundMatches];
    numMatchesInRound /= 2;
    round++;
  }

  return processByes(matches);
}

// Automatically advance teams playing against a BYE
export function processByes(matches: TournamentMatch[]): TournamentMatch[] {
  let updatedMatches = [...matches];
  
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < updatedMatches.length; i++) {
      const match = updatedMatches[i];
      if (match.winner) continue; // Already processed
      
      const isTeam1Bye = match.team1?.name === 'BYE';
      const isTeam2Bye = match.team2?.name === 'BYE';
      
      if (isTeam1Bye || isTeam2Bye) {
        let winner = isTeam1Bye ? match.team2 : match.team1;
        
        // If both are BYE (rare but possible in very empty brackets), advance a BYE
        if (isTeam1Bye && isTeam2Bye) {
          winner = match.team1;
        }

        updatedMatches[i] = { ...match, winner };
        changed = true;
        
        // Propagate to next match
        if (match.nextMatchId && winner) {
          const nextIdx = updatedMatches.findIndex(m => m.id === match.nextMatchId);
          if (nextIdx !== -1) {
            const nextMatch = { ...updatedMatches[nextIdx] };
            // Determine if we are team1 or team2 in the next match
            // based on the previous round's matches layout
            const prevMatches = updatedMatches.filter(m => m.nextMatchId === match.nextMatchId).sort((a, b) => a.matchIndex - b.matchIndex);
            if (prevMatches[0].id === match.id) {
              nextMatch.team1 = winner;
            } else {
              nextMatch.team2 = winner;
            }
            updatedMatches[nextIdx] = nextMatch;
          }
        }
      }
    }
  }
  
  return updatedMatches;
}

export function updateMatchScore(
  matches: TournamentMatch[], 
  matchId: string, 
  score1: number, 
  score2: number
): TournamentMatch[] {
  const newMatches = [...matches].map(m => ({...m})); // Deep-ish copy
  
  const matchIdx = newMatches.findIndex(m => m.id === matchId);
  if (matchIdx === -1) return newMatches;
  
  const match = newMatches[matchIdx];
  match.score1 = score1;
  match.score2 = score2;
  
  if (score1 > score2) match.winner = match.team1;
  else if (score2 > score1) match.winner = match.team2;
  else match.winner = null; // Tie not resolved
  
  // Propagate winner to next match
  if (match.nextMatchId) {
    const nextIdx = newMatches.findIndex(m => m.id === match.nextMatchId);
    if (nextIdx !== -1) {
      const nextMatch = newMatches[nextIdx];
      const prevMatches = newMatches
        .filter(m => m.nextMatchId === match.nextMatchId)
        .sort((a, b) => a.matchIndex - b.matchIndex);
        
      if (prevMatches[0].id === match.id) {
        nextMatch.team1 = match.winner;
      } else {
        nextMatch.team2 = match.winner;
      }
    }
  }
  
  return newMatches;
}
