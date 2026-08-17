import { useState, useMemo } from "react";
import { DoubleElimMatch } from "./doubleElimination";
import { TournamentTeam } from "./engine";
import { cn } from "../../lib/utils";
import { Trophy, Edit2, Check, ShieldAlert, Swords } from "lucide-react";
import { playLockInSound, playVictoryFanfare, playUiClick } from "../../lib/soundEngine";

interface DoubleEliminationBoardProps {
  teams: TournamentTeam[];
  matches: DoubleElimMatch[];
  onScoreUpdate: (matchId: string, s1: number, s2: number) => void;
}

export function DoubleEliminationBoard({
  matches,
  onScoreUpdate,
}: DoubleEliminationBoardProps) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [score1, setScore1] = useState<string>("");
  const [score2, setScore2] = useState<string>("");

  const upperMatches = useMemo(() => matches.filter((m) => m.bracket === "upper"), [matches]);
  const lowerMatches = useMemo(() => matches.filter((m) => m.bracket === "lower"), [matches]);
  const grandFinalMatch = useMemo(() => matches.find((m) => m.bracket === "grand_final"), [matches]);

  const upperRounds = useMemo(() => {
    const maxR = Math.max(...upperMatches.map((m) => m.round), 0);
    const list = [];
    for (let r = 1; r <= maxR; r++) {
      list.push(upperMatches.filter((m) => m.round === r).sort((a, b) => a.matchIndex - b.matchIndex));
    }
    return list;
  }, [upperMatches]);

  const lowerRounds = useMemo(() => {
    const maxR = Math.max(...lowerMatches.map((m) => m.round), 0);
    const list = [];
    for (let r = 1; r <= maxR; r++) {
      list.push(lowerMatches.filter((m) => m.round === r).sort((a, b) => a.matchIndex - b.matchIndex));
    }
    return list;
  }, [lowerMatches]);

  const handleSave = (matchId: string) => {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    if (!isNaN(s1) && !isNaN(s2)) {
      onScoreUpdate(matchId, s1, s2);
      if (matchId === "gf-m1") {
        playVictoryFanfare();
      } else {
        playLockInSound();
      }
    }
    setEditingMatch(null);
  };

  const champion = grandFinalMatch?.winner;

  return (
    <div className="flex flex-col gap-12 pb-24 min-w-max">
      {/* Upper Bracket */}
      <div className="bg-[#0c0c0c] border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.05)]">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <Swords className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-display text-cyan-400 tracking-widest uppercase">
            Nhánh Thắng (Upper Bracket)
          </h2>
          <span className="text-xs text-white/40 uppercase tracking-widest font-bold ml-2">
            Thắng đi tiếp • Thua rớt xuống Nhánh Thua
          </span>
        </div>

        <div className="flex gap-12 items-start overflow-x-auto pb-4">
          {upperRounds.map((roundMatches, rIdx) => (
            <div key={`ub-round-${rIdx}`} className="flex flex-col gap-6 w-72 flex-shrink-0">
              <div className="text-xs font-display text-white/40 uppercase tracking-widest text-center py-1.5 px-3 bg-white/5 rounded-full border border-white/5">
                {roundMatches[0]?.roundName || `Vòng ${rIdx + 1}`}
              </div>
              <div className="flex flex-col justify-around gap-6 h-full">
                {roundMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    editingMatch={editingMatch}
                    score1={score1}
                    score2={score2}
                    setScore1={setScore1}
                    setScore2={setScore2}
                    onStartEdit={() => {
                      playUiClick();
                      setEditingMatch(match.id);
                      setScore1(match.score1?.toString() || "");
                      setScore2(match.score2?.toString() || "");
                    }}
                    onSave={() => handleSave(match.id)}
                    theme="cyan"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Bracket */}
      <div className="bg-[#0c0c0c] border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.05)]">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-display text-amber-400 tracking-widest uppercase">
            Nhánh Thua (Lower Bracket - Sinh Tử)
          </h2>
          <span className="text-xs text-white/40 uppercase tracking-widest font-bold ml-2">
            Thua lập tức bị loại khỏi giải
          </span>
        </div>

        <div className="flex gap-12 items-start overflow-x-auto pb-4">
          {lowerRounds.map((roundMatches, rIdx) => (
            <div key={`lb-round-${rIdx}`} className="flex flex-col gap-6 w-72 flex-shrink-0">
              <div className="text-xs font-display text-white/40 uppercase tracking-widest text-center py-1.5 px-3 bg-white/5 rounded-full border border-white/5">
                {roundMatches[0]?.roundName || `Vòng ${rIdx + 1}`}
              </div>
              <div className="flex flex-col justify-around gap-6 h-full">
                {roundMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    editingMatch={editingMatch}
                    score1={score1}
                    score2={score2}
                    setScore1={setScore1}
                    setScore2={setScore2}
                    onStartEdit={() => {
                      playUiClick();
                      setEditingMatch(match.id);
                      setScore1(match.score1?.toString() || "");
                      setScore2(match.score2?.toString() || "");
                    }}
                    onSave={() => handleSave(match.id)}
                    theme="amber"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grand Finals & Champion Podium */}
      {grandFinalMatch && (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-gradient-to-r from-accent/10 via-[#0c0c0c] to-accent/10 border border-accent/30 rounded-3xl p-10 shadow-[0_0_60px_rgba(234,179,8,0.15)]">
          <div className="flex flex-col items-center gap-4 w-80">
            <div className="text-sm font-display text-accent tracking-widest uppercase flex items-center gap-2">
              <Trophy className="w-5 h-5 animate-pulse" />
              {grandFinalMatch.roundName}
            </div>
            <MatchCard
              match={grandFinalMatch}
              editingMatch={editingMatch}
              score1={score1}
              score2={score2}
              setScore1={setScore1}
              setScore2={setScore2}
              onStartEdit={() => {
                playUiClick();
                setEditingMatch(grandFinalMatch.id);
                setScore1(grandFinalMatch.score1?.toString() || "");
                setScore2(grandFinalMatch.score2?.toString() || "");
              }}
              onSave={() => handleSave(grandFinalMatch.id)}
              theme="accent"
            />
          </div>

          <div className="w-px h-32 bg-white/10 hidden md:block" />

          {/* Champion Podium */}
          <div className="flex flex-col items-center text-center p-6 bg-accent/5 border border-accent/20 rounded-2xl min-w-[280px]">
            <Trophy className="w-16 h-16 text-accent drop-shadow-[0_0_20px_rgba(234,179,8,0.6)] mb-3 animate-bounce" />
            <span className="text-xs font-display text-accent tracking-widest uppercase mb-1">
              Nhà Vô Địch Giải Đấu
            </span>
            <span className="text-2xl font-display text-white tracking-widest uppercase drop-shadow-md">
              {champion ? champion.name : "CHƯA XÁC ĐỊNH"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface MatchCardProps {
  match: DoubleElimMatch;
  editingMatch: string | null;
  score1: string;
  score2: string;
  setScore1: (v: string) => void;
  setScore2: (v: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  theme: "cyan" | "amber" | "accent";
}

function MatchCard({
  match,
  editingMatch,
  score1,
  score2,
  setScore1,
  setScore2,
  onStartEdit,
  onSave,
  theme,
}: MatchCardProps) {
  const isEditing = editingMatch === match.id;
  const isTeam1Winner = match.winner?.id === match.team1?.id && match.team1;
  const isTeam2Winner = match.winner?.id === match.team2?.id && match.team2;

  const borderColor =
    theme === "cyan"
      ? "border-cyan-500/30 hover:border-cyan-500/60"
      : theme === "amber"
      ? "border-amber-500/30 hover:border-amber-500/60"
      : "border-accent/50 hover:border-accent";

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-[#0a0a0a] border rounded-2xl overflow-hidden relative shadow-lg transition-all duration-300 group",
        borderColor
      )}
    >
      {/* Team 1 */}
      <div className="flex justify-between items-center p-3.5 border-b border-white/5 bg-white/5">
        <span
          className={cn(
            "font-display tracking-widest text-sm uppercase truncate pr-2",
            isTeam1Winner ? "text-accent font-bold" : match.team1 ? "text-white/80" : "text-white/20 italic"
          )}
        >
          {match.team1?.name || "TBD"}
        </span>

        {isEditing ? (
          <input
            autoFocus
            type="number"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
            className="w-10 h-7 bg-black border border-accent rounded text-white text-center font-display text-sm"
          />
        ) : (
          <span
            className={cn(
              "font-display text-base",
              isTeam1Winner ? "text-accent font-bold" : "text-white/40"
            )}
          >
            {match.score1 ?? "-"}
          </span>
        )}
      </div>

      {/* Team 2 */}
      <div className="flex justify-between items-center p-3.5 bg-black">
        <span
          className={cn(
            "font-display tracking-widest text-sm uppercase truncate pr-2",
            isTeam2Winner ? "text-accent font-bold" : match.team2 ? "text-white/80" : "text-white/20 italic"
          )}
        >
          {match.team2?.name || "TBD"}
        </span>

        {isEditing ? (
          <input
            type="number"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
            className="w-10 h-7 bg-black border border-accent rounded text-white text-center font-display text-sm"
          />
        ) : (
          <span
            className={cn(
              "font-display text-base",
              isTeam2Winner ? "text-accent font-bold" : "text-white/40"
            )}
          >
            {match.score2 ?? "-"}
          </span>
        )}
      </div>

      {/* Edit Controls */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm z-20">
        {isEditing ? (
          <button
            onClick={onSave}
            className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center hover:bg-yellow-400 transition-transform hover:scale-110 shadow-lg"
          >
            <Check className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onStartEdit}
            disabled={!match.team1 || !match.team2 || match.team1.name === "BYE" || match.team2.name === "BYE"}
            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-transform hover:scale-110 disabled:opacity-30 border border-white/10"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
