import { useState, useMemo } from "react";
import { cn } from "../lib/utils";
import { Settings, RefreshCcw, Trophy, Edit2, Check, GitBranch, Swords } from "lucide-react";
import { 
  generateSingleElimination, 
  updateMatchScore, 
  TournamentMatch, 
  TournamentTeam 
} from "../features/bracket/engine";
import { generateRoundRobin } from "../features/bracket/roundRobin";
import { generateDoubleElimination, updateDoubleElimMatchScore, DoubleElimMatch } from "../features/bracket/doubleElimination";
import { 
  generateSwissTournament, 
  updateSwissMatchScore, 
  pairNextSwissRound, 
  SwissTournament 
} from "../features/bracket/swissSystem";
import { SeedingModal } from "../features/bracket/SeedingModal";
import { RoundRobinBoard } from "../features/bracket/RoundRobinBoard";
import { DoubleEliminationBoard } from "../features/bracket/DoubleEliminationBoard";
import { SwissBoard } from "../features/bracket/SwissBoard";
import { playUiClick, playLockInSound, playVictoryFanfare } from "../lib/soundEngine";

// Mock teams to start (16 teams available for Swiss / Double Elimination)
const MOCK_TEAMS: TournamentTeam[] = [
  { id: "t1", name: "DAMIT2K" },
  { id: "t2", name: "TEAM FLASH" },
  { id: "t3", name: "LAYLA2K4" },
  { id: "t4", name: "GAM ESPORTS" },
  { id: "t5", name: "CERBERUS" },
  { id: "t6", name: "SGB" },
  { id: "t7", name: "TEAM SECRET" },
  { id: "t8", name: "RRQ" },
  { id: "t9", name: "PRX PAPER REX" },
  { id: "t10", name: "DRX" },
  { id: "t11", name: "GEN.G" },
  { id: "t12", name: "T1 ESPORTS" },
  { id: "t13", name: "FNATIC" },
  { id: "t14", name: "SENTINELS" },
  { id: "t15", name: "LEVIATAN" },
  { id: "t16", name: "EDWARD GAMING" },
];

export function Bracket() {
  const [teams, setTeams] = useState<TournamentTeam[]>(MOCK_TEAMS);
  const [format, setFormat] = useState<"double" | "swiss" | "single" | "round_robin">("double");
  const [matches, setMatches] = useState<TournamentMatch[]>(() => generateSingleElimination(MOCK_TEAMS.slice(0, 8)));
  const [doubleMatches, setDoubleMatches] = useState<DoubleElimMatch[]>(() => generateDoubleElimination(MOCK_TEAMS.slice(0, 8)));
  const [swissTournament, setSwissTournament] = useState<SwissTournament>(() => generateSwissTournament(MOCK_TEAMS.slice(0, 16)));
  
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [score1, setScore1] = useState<string>("");
  const [score2, setScore2] = useState<string>("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rounds = useMemo(() => {
    const maxRound = Math.max(...matches.map(m => m.round), 0);
    const r = [];
    for (let i = 1; i <= maxRound; i++) {
      r.push(matches.filter(m => m.round === i).sort((a,b) => a.matchIndex - b.matchIndex));
    }
    return r;
  }, [matches]);

  const handleGenerateRandom = () => {
    playUiClick();
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    setTeams(shuffled);
    if (format === "single") {
      setMatches(generateSingleElimination(shuffled));
    } else if (format === "double") {
      setDoubleMatches(generateDoubleElimination(shuffled));
    } else if (format === "swiss") {
      setSwissTournament(generateSwissTournament(shuffled));
    } else {
      setMatches(generateRoundRobin(shuffled));
    }
  };

  const handleApplySeeding = (newTeams: TournamentTeam[]) => {
    playLockInSound();
    setTeams(newTeams);
    if (format === "single") {
      setMatches(generateSingleElimination(newTeams));
    } else if (format === "double") {
      setDoubleMatches(generateDoubleElimination(newTeams));
    } else if (format === "swiss") {
      setSwissTournament(generateSwissTournament(newTeams));
    } else {
      setMatches(generateRoundRobin(newTeams));
    }
    setIsModalOpen(false);
  };

  const handleSaveScore = (matchId: string) => {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    if (!isNaN(s1) && !isNaN(s2)) {
      setMatches(prev => updateMatchScore(prev, matchId, s1, s2));
      playLockInSound();
    }
    setEditingMatch(null);
  };

  const handleDoubleScoreUpdate = (matchId: string, s1: number, s2: number) => {
    setDoubleMatches(prev => updateDoubleElimMatchScore(prev, matchId, s1, s2));
  };

  const handleSwissScoreUpdate = (matchId: string, s1: number, s2: number) => {
    setSwissTournament(prev => updateSwissMatchScore(prev, matchId, s1, s2));
  };

  const handleSwissNextRound = () => {
    setSwissTournament(prev => pairNextSwissRound(prev));
  };

  const handleFormatChange = (newFormat: "double" | "swiss" | "single" | "round_robin") => {
    playUiClick();
    setFormat(newFormat);
    if (newFormat === "single") {
      setMatches(generateSingleElimination(teams.slice(0, 8)));
    } else if (newFormat === "double") {
      setDoubleMatches(generateDoubleElimination(teams.slice(0, 8)));
    } else if (newFormat === "swiss") {
      setSwissTournament(generateSwissTournament(teams));
    } else {
      setMatches(generateRoundRobin(teams.slice(0, 8)));
    }
  };

  const getRoundName = (roundIndex: number, totalRounds: number) => {
    if (roundIndex === totalRounds) return "CHUNG KẾT";
    if (roundIndex === totalRounds - 1) return "BÁN KẾT";
    if (roundIndex === totalRounds - 2) return "TỨ KẾT";
    return `VÒNG ${roundIndex}`;
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-full mx-auto overflow-x-auto min-h-screen relative">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-accent animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-display text-white tracking-widest uppercase">
              Sơ đồ Giải Đấu Esports
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button 
              onClick={() => handleFormatChange("double")}
              className={cn(
                "px-4 py-2 rounded-full text-xs tracking-widest uppercase font-bold transition-all border flex items-center gap-1.5", 
                format === "double" 
                  ? "bg-accent/15 text-accent border-accent/60 shadow-[0_0_15px_rgba(234,179,8,0.25)]" 
                  : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
              )}
            >
              ★ Nhánh Thắng / Thua (Double Elim)
            </button>

            <button 
              onClick={() => handleFormatChange("swiss")}
              className={cn(
                "px-4 py-2 rounded-full text-xs tracking-widest uppercase font-bold transition-all border flex items-center gap-1.5", 
                format === "swiss" 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                  : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
              )}
            >
              <Swords className="w-3.5 h-3.5" />
              Hệ Thống Thụy Sĩ (Swiss System)
            </button>

            <button 
              onClick={() => handleFormatChange("single")}
              className={cn(
                "px-4 py-2 rounded-full text-xs tracking-widest uppercase font-bold transition-all border", 
                format === "single" 
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]" 
                  : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
              )}
            >
              Loại Trực Tiếp (Single)
            </button>

            <button 
              onClick={() => handleFormatChange("round_robin")}
              className={cn(
                "px-4 py-2 rounded-full text-xs tracking-widest uppercase font-bold transition-all border", 
                format === "round_robin" 
                  ? "bg-purple-500/15 text-purple-400 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.25)]" 
                  : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
              )}
            >
              Vòng Bảng (Round Robin)
            </button>

            <span className="text-white/20 text-xs px-1">•</span>
            <span className="text-white/40 text-xs tracking-widest uppercase font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              {format === "swiss" ? teams.length : Math.min(8, teams.length)} Đội Tuyển
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleGenerateRandom}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white/70 font-display tracking-widest text-xs uppercase rounded-full hover:bg-white/10 hover:text-white transition-all border border-white/10"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Bốc thăm ngẫu nhiên
          </button>
          <button 
            onClick={() => {
              playUiClick();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-black font-display tracking-widest text-xs uppercase rounded-full hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] font-bold"
          >
            <Settings className="w-3.5 h-3.5" />
            Cấu hình Hạt Giống
          </button>
        </div>
      </div>

      {/* Main Bracket Content */}
      {format === "swiss" ? (
        <SwissBoard
          tournament={swissTournament}
          onUpdateScore={handleSwissScoreUpdate}
          onNextRound={handleSwissNextRound}
        />
      ) : format === "double" ? (
        <DoubleEliminationBoard
          teams={teams.slice(0, 8)}
          matches={doubleMatches}
          onScoreUpdate={handleDoubleScoreUpdate}
        />
      ) : format === "single" ? (
        <div className="flex gap-16 items-start mt-8 min-w-max pb-32">
          {rounds.map((roundMatches, rIdx) => {
            const isFinal = rIdx === rounds.length - 1;
            const roundName = getRoundName(rIdx + 1, rounds.length);
            
            return (
              <div key={rIdx} className="flex flex-col gap-8 relative">
                <div className={cn(
                  "font-bold tracking-widest text-xs mb-4 uppercase text-center py-1.5 px-3 rounded-full border",
                  isFinal ? "text-accent bg-accent/10 border-accent/30" : "text-white/40 bg-white/5 border-white/5"
                )}>
                  {roundName}
                </div>
                
                <div className="flex flex-col justify-around h-full gap-8">
                  {roundMatches.map((match) => (
                    <div key={match.id} className="relative flex items-center">
                      <div className={cn(
                        "flex flex-col w-72 border rounded-2xl overflow-hidden relative z-10 transition-all duration-300",
                        isFinal ? "bg-accent/5 border-accent/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]" : "bg-[#0a0a0a] border-white/10 shadow-xl",
                        match.winner && !isFinal ? "opacity-60 hover:opacity-100" : ""
                      )}>
                        {isFinal && <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none"></div>}
                        
                        {/* Team 1 */}
                        <div className={cn(
                          "flex justify-between items-center p-4 border-b",
                          isFinal ? "border-accent/20 bg-accent/10" : "border-white/5 bg-white/5"
                        )}>
                          <span className={cn(
                            "font-display tracking-widest text-lg uppercase truncate pr-4",
                            match.winner?.id === match.team1?.id ? (isFinal ? "text-accent" : "text-primary") : (match.team1 ? "text-white/80" : "text-white/20 italic")
                          )}>
                            {match.team1?.name || "TBD"}
                          </span>
                          
                          {editingMatch === match.id ? (
                            <input 
                              autoFocus
                              type="number"
                              value={score1}
                              onChange={e => setScore1(e.target.value)}
                              className="w-12 h-8 bg-black border border-white/20 rounded text-white text-center font-display"
                            />
                          ) : (
                            <span className={cn(
                              "font-display text-xl",
                              match.winner?.id === match.team1?.id ? "text-white" : "text-white/40"
                            )}>
                              {match.score1 ?? "-"}
                            </span>
                          )}
                        </div>
                        
                        {/* Team 2 */}
                        <div className={cn(
                          "flex justify-between items-center p-4",
                          isFinal ? "bg-black/40" : "bg-black"
                        )}>
                          <span className={cn(
                            "font-display tracking-widest text-lg uppercase truncate pr-4",
                            match.winner?.id === match.team2?.id ? (isFinal ? "text-accent" : "text-danger") : (match.team2 ? "text-white/80" : "text-white/20 italic")
                          )}>
                            {match.team2?.name || "TBD"}
                          </span>
                          
                          {editingMatch === match.id ? (
                            <input 
                              type="number"
                              value={score2}
                              onChange={e => setScore2(e.target.value)}
                              className="w-12 h-8 bg-black border border-white/20 rounded text-white text-center font-display"
                            />
                          ) : (
                            <span className={cn(
                              "font-display text-xl",
                              match.winner?.id === match.team2?.id ? "text-white" : "text-white/40"
                            )}>
                              {match.score2 ?? "-"}
                            </span>
                          )}
                        </div>

                        {/* Edit Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm z-20">
                          {editingMatch === match.id ? (
                            <button 
                              onClick={() => handleSaveScore(match.id)}
                              className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center hover:bg-yellow-400 transition-transform hover:scale-110 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                            >
                              <Check className="w-6 h-6" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                playUiClick();
                                setEditingMatch(match.id);
                                setScore1(match.score1?.toString() || "");
                                setScore2(match.score2?.toString() || "");
                              }}
                              disabled={!match.team1 || !match.team2 || match.team1.name === "BYE" || match.team2.name === "BYE"}
                              className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-transform hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 backdrop-blur-md border border-white/10"
                            >
                              <Edit2 className="w-6 h-6" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {!isFinal && (
                        <div className="absolute left-72 w-16 h-[2px] bg-white/10 pointer-events-none"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Winner Podium */}
          <div className="flex flex-col gap-8 justify-center h-full pt-12">
            <div className="w-72 h-72 rounded-full border border-accent/20 bg-accent/5 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Trophy className="w-20 h-20 text-accent mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] relative z-10 animate-pulse" />
              <span className="font-display tracking-widest text-sm text-accent uppercase mb-2 relative z-10">Nhà Vô Địch</span>
              <span className="font-display text-3xl text-white uppercase tracking-widest text-center px-4 relative z-10 drop-shadow-lg">
                {matches.find(m => m.round === rounds.length)?.winner?.name || "???"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <RoundRobinBoard 
          teams={teams.slice(0, 8)} 
          matches={matches} 
          onScoreUpdate={(id, s1, s2) => {
            playLockInSound();
            setMatches(prev => updateMatchScore(prev, id, s1, s2));
          }} 
        />
      )}
      
      <SeedingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTeams={teams}
        onGenerate={handleApplySeeding}
      />
    </div>
  );
}
