import { useState, useMemo } from "react";
import { cn } from "../../lib/utils";
import { Edit2, Check } from "lucide-react";
import { TournamentMatch, TournamentTeam, updateMatchScore } from "./engine";
import { generateRoundRobin, calculateStandings, GroupStanding } from "./roundRobin";

interface RoundRobinBoardProps {
  teams: TournamentTeam[];
  matches: TournamentMatch[];
  onScoreUpdate: (matchId: string, s1: number, s2: number) => void;
}

export function RoundRobinBoard({ teams, matches, onScoreUpdate }: RoundRobinBoardProps) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [score1, setScore1] = useState<string>("");
  const [score2, setScore2] = useState<string>("");

  const standings = useMemo(() => calculateStandings(teams, matches), [teams, matches]);
  
  const rounds = useMemo(() => {
    const maxRound = Math.max(...matches.map(m => m.round), 0);
    const r = [];
    for (let i = 1; i <= maxRound; i++) {
      r.push(matches.filter(m => m.round === i));
    }
    return r;
  }, [matches]);

  const handleSaveScore = (matchId: string) => {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    if (!isNaN(s1) && !isNaN(s2)) {
      onScoreUpdate(matchId, s1, s2);
    }
    setEditingMatch(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-12 w-full pb-32">
      {/* Standings Table */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <h2 className="text-xl font-display text-accent tracking-widest uppercase flex items-center gap-3">
          Bảng Xếp Hạng
        </h2>
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-xs text-white/40 uppercase tracking-widest">
                <th className="p-4 font-bold">#</th>
                <th className="p-4 font-bold">Đội</th>
                <th className="p-4 font-bold text-center">Trận</th>
                <th className="p-4 font-bold text-center">H/S</th>
                <th className="p-4 font-bold text-center">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((st, i) => (
                <tr key={st.team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-display text-white/40">{i + 1}</td>
                  <td className={cn("p-4 font-display uppercase tracking-widest", i < 2 ? "text-accent" : "text-white")}>
                    {st.team.name}
                  </td>
                  <td className="p-4 text-center text-white/60 font-display">{st.played}</td>
                  <td className="p-4 text-center font-display text-white/60">
                    {st.scoreDifference > 0 ? `+${st.scoreDifference}` : st.scoreDifference}
                  </td>
                  <td className="p-4 text-center font-display text-xl text-white">{st.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matches List */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <h2 className="text-xl font-display text-white tracking-widest uppercase flex items-center gap-3">
          Lịch Thi Đấu
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rounds.map((roundMatches, rIdx) => (
            <div key={rIdx} className="flex flex-col gap-4">
              <div className="text-white/40 font-bold tracking-widest text-xs uppercase border-b border-white/10 pb-2">
                Vòng {rIdx + 1}
              </div>
              
              <div className="flex flex-col gap-4">
                {roundMatches.map(match => (
                  <div key={match.id} className="flex flex-col bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden relative group">
                    {/* Team 1 */}
                    <div className="flex justify-between items-center p-3 border-b border-white/5 bg-white/5">
                      <span className={cn(
                        "font-display tracking-widest text-sm uppercase truncate pr-4",
                        match.winner?.id === match.team1?.id ? "text-primary" : "text-white/80"
                      )}>
                        {match.team1?.name}
                      </span>
                      {editingMatch === match.id ? (
                        <input type="number" value={score1} onChange={e => setScore1(e.target.value)} className="w-10 h-6 bg-black border border-white/20 rounded text-white text-center font-display text-sm" autoFocus />
                      ) : (
                        <span className={cn("font-display text-lg", match.winner?.id === match.team1?.id ? "text-white" : "text-white/40")}>{match.score1 ?? "-"}</span>
                      )}
                    </div>
                    {/* Team 2 */}
                    <div className="flex justify-between items-center p-3 bg-black">
                      <span className={cn(
                        "font-display tracking-widest text-sm uppercase truncate pr-4",
                        match.winner?.id === match.team2?.id ? "text-danger" : "text-white/80"
                      )}>
                        {match.team2?.name}
                      </span>
                      {editingMatch === match.id ? (
                        <input type="number" value={score2} onChange={e => setScore2(e.target.value)} className="w-10 h-6 bg-black border border-white/20 rounded text-white text-center font-display text-sm" />
                      ) : (
                        <span className={cn("font-display text-lg", match.winner?.id === match.team2?.id ? "text-white" : "text-white/40")}>{match.score2 ?? "-"}</span>
                      )}
                    </div>

                    {/* Edit Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm z-20">
                      {editingMatch === match.id ? (
                        <button onClick={() => handleSaveScore(match.id)} className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center hover:bg-yellow-400 transition-transform hover:scale-110 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                          <Check className="w-5 h-5" />
                        </button>
                      ) : (
                        <button onClick={() => { setEditingMatch(match.id); setScore1(match.score1?.toString() || ""); setScore2(match.score2?.toString() || ""); }} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-transform hover:scale-110 backdrop-blur-md border border-white/10">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
