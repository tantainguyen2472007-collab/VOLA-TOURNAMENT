import { useState } from "react";
import { cn } from "../../lib/utils";
import { SwissTournament, SwissMatch, SwissTeamState } from "./swissSystem";
import { Trophy, Swords, CheckCircle2, XCircle, ArrowRight, Shield } from "lucide-react";
import { playLockInSound, playUiClick, playVictoryFanfare } from "../../lib/soundEngine";

interface SwissBoardProps {
  tournament: SwissTournament;
  onUpdateScore: (matchId: string, score1: number, score2: number) => void;
  onNextRound: () => void;
}

export function SwissBoard({ tournament, onUpdateScore, onNextRound }: SwissBoardProps) {
  const [activeTab, setActiveTab] = useState<"standings" | "matches">("matches");
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [s1, setS1] = useState<string>("");
  const [s2, setS2] = useState<string>("");

  const qualifiedTeams = tournament.teams.filter((t) => t.status === "qualified");
  const eliminatedTeams = tournament.teams.filter((t) => t.status === "eliminated");
  const activeTeams = tournament.teams.filter((t) => t.status === "active");

  const allMatchesFinished = tournament.matches.every((m) => m.status === "completed");

  const handleSaveMatch = (matchId: string) => {
    const num1 = parseInt(s1);
    const num2 = parseInt(s2);
    if (!isNaN(num1) && !isNaN(num2) && num1 !== num2) {
      onUpdateScore(matchId, num1, num2);
      playLockInSound();
      setEditingMatchId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Swiss Header Bar */}
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-display text-accent uppercase tracking-widest font-bold">
              HỆ THỐNG THỤY SĨ (SWISS STAGE) • VÒNG {tournament.currentRound} / {tournament.maxRounds}
            </div>
            <div className="text-[11px] text-white/50">
              Đạt 3 trận thắng để Giành vé vào Playoff (3-0, 3-1, 3-2) • Thua 3 trận bị Loại (0-3, 1-3, 2-3)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => {
                playUiClick();
                setActiveTab("matches");
              }}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                activeTab === "matches" ? "bg-accent text-black font-extrabold shadow" : "text-white/40 hover:text-white"
              )}
            >
              Cặp Đấu Vòng {tournament.currentRound}
            </button>
            <button
              onClick={() => {
                playUiClick();
                setActiveTab("standings");
              }}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                activeTab === "standings" ? "bg-accent text-black font-extrabold shadow" : "text-white/40 hover:text-white"
              )}
            >
              Bảng Xếp Hạng & Tỷ Số
            </button>
          </div>

          {activeTeams.length > 0 && tournament.currentRound < tournament.maxRounds && (
            <button
              onClick={() => {
                playVictoryFanfare();
                onNextRound();
              }}
              disabled={!allMatchesFinished}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-display uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all",
                allMatchesFinished
                  ? "bg-primary text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
              )}
            >
              Bốc thăm Vòng {tournament.currentRound + 1}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards: Qualified, Active, Eliminated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Qualified */}
        <div className="bg-[#0c0c0c] border border-green-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-display text-green-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" /> ĐÃ VÀO PLAYOFF ({qualifiedTeams.length})
            </span>
            <span className="text-[10px] text-white/40 font-bold">Đạt 3 Thắng</span>
          </div>
          <div className="space-y-1.5 min-h-[60px]">
            {qualifiedTeams.length === 0 ? (
              <div className="text-xs text-white/20 italic py-2">Chưa có đội nào đạt 3 chiến thắng</div>
            ) : (
              qualifiedTeams.map((t) => (
                <div key={t.team.id} className="flex items-center justify-between px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-xs font-bold text-white">
                  <span className="truncate">{t.team.name}</span>
                  <span className="text-green-400 font-display text-[11px]">{t.wins}W - {t.losses}L</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* In Contention (Active) */}
        <div className="bg-[#0c0c0c] border border-accent/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-display text-accent uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Shield className="w-4 h-4" /> ĐANG TRANH VÉ ({activeTeams.length})
            </span>
            <span className="text-[10px] text-white/40 font-bold">Đang thi đấu</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeTeams.map((t) => (
              <span key={t.team.id} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/80 flex items-center gap-1.5">
                <span className="truncate max-w-[100px]">{t.team.name}</span>
                <span className="text-accent font-display text-[10px]">({t.wins}-{t.losses})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Eliminated */}
        <div className="bg-[#0c0c0c] border border-danger/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(255,70,85,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-display text-danger uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <XCircle className="w-4 h-4" /> BỊ LOẠI ({eliminatedTeams.length})
            </span>
            <span className="text-[10px] text-white/40 font-bold">Thua 3 Trận</span>
          </div>
          <div className="space-y-1.5 min-h-[60px]">
            {eliminatedTeams.length === 0 ? (
              <div className="text-xs text-white/20 italic py-2">Chưa có đội nào nhận 3 trận thua</div>
            ) : (
              eliminatedTeams.map((t) => (
                <div key={t.team.id} className="flex items-center justify-between px-3 py-1.5 bg-danger/10 border border-danger/20 rounded-lg text-xs font-bold text-white/60">
                  <span className="truncate">{t.team.name}</span>
                  <span className="text-danger font-display text-[11px]">{t.wins}W - {t.losses}L</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "matches" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournament.matches.map((match, idx) => {
            const isEditing = editingMatchId === match.id;
            const isCompleted = match.status === "completed";

            return (
              <div
                key={match.id}
                className={cn(
                  "bg-[#0c0c0c] border rounded-2xl p-5 relative overflow-hidden transition-all shadow-md",
                  isCompleted ? "border-white/10 bg-white/[0.02]" : "border-accent/40 bg-accent/[0.02]"
                )}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Trận #{idx + 1} • Vòng {tournament.currentRound}</span>
                  <span className={cn(isCompleted ? "text-green-400" : "text-accent")}>
                    {isCompleted ? "ĐÃ KẾT THÚC" : "CHỜ CẬP NHẬT"}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Team 1 */}
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                    match.winnerId === match.team1.id
                      ? "border-green-500/40 bg-green-500/10 text-white font-bold"
                      : match.winnerId && match.winnerId !== match.team1.id
                      ? "border-white/5 bg-white/[0.01] text-white/40"
                      : "border-white/10 bg-white/5 text-white"
                  )}>
                    <span className="text-sm font-display uppercase tracking-wider">{match.team1.name}</span>
                    <span className="text-base font-display">{match.score1 ?? "-"}</span>
                  </div>

                  {/* Team 2 */}
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                    match.winnerId === match.team2.id
                      ? "border-green-500/40 bg-green-500/10 text-white font-bold"
                      : match.winnerId && match.winnerId !== match.team2.id
                      ? "border-white/5 bg-white/[0.01] text-white/40"
                      : "border-white/10 bg-white/5 text-white"
                  )}>
                    <span className="text-sm font-display uppercase tracking-wider">{match.team2.name}</span>
                    <span className="text-base font-display">{match.score2 ?? "-"}</span>
                  </div>
                </div>

                {/* Score Input Form */}
                {isEditing ? (
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Tỉ số 1"
                      value={s1}
                      onChange={(e) => setS1(e.target.value)}
                      className="w-20 px-3 py-2 bg-black border border-white/20 rounded-xl text-center font-display text-sm text-white"
                    />
                    <span className="text-white/40 font-bold">-</span>
                    <input
                      type="number"
                      placeholder="Tỉ số 2"
                      value={s2}
                      onChange={(e) => setS2(e.target.value)}
                      className="w-20 px-3 py-2 bg-black border border-white/20 rounded-xl text-center font-display text-sm text-white"
                    />
                    <button
                      onClick={() => handleSaveMatch(match.id)}
                      className="flex-1 py-2 bg-accent text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-yellow-400 transition-all"
                    >
                      Lưu Tỷ Số
                    </button>
                    <button
                      onClick={() => setEditingMatchId(null)}
                      className="px-3 py-2 bg-white/5 text-white/40 rounded-xl text-xs"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingMatchId(match.id);
                      setS1(match.score1?.toString() || "");
                      setS2(match.score2?.toString() || "");
                    }}
                    className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/70 transition-all"
                  >
                    {isCompleted ? "Chỉnh sửa tỷ số" : "Nhập kết quả trận đấu"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Standings Table */
        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-white/5 border-b border-white/10 text-xs font-display text-accent uppercase tracking-widest font-bold flex items-center justify-between">
            <span>Bảng Xếp Hạng Tổng Hợp Hệ Thống Thụy Sĩ</span>
            <span>{tournament.teams.length} Đội Tuyển</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-white/40 uppercase text-[10px] font-bold tracking-widest border-b border-white/5">
                <tr>
                  <th className="py-3 px-4"># Hạng</th>
                  <th className="py-3 px-4">Đội Tuyển</th>
                  <th className="py-3 px-4 text-center">Thắng - Thua</th>
                  <th className="py-3 px-4 text-center">Trận Đã Đấu</th>
                  <th className="py-3 px-4 text-center">Lịch Sử Gần Nhất</th>
                  <th className="py-3 px-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...tournament.teams]
                  .sort((a, b) => b.wins - a.wins || a.losses - b.losses)
                  .map((teamState, idx) => (
                    <tr key={teamState.team.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-display text-white/40">#{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-white uppercase tracking-wider">
                        {teamState.team.name}
                      </td>
                      <td className="py-3.5 px-4 text-center font-display text-accent font-bold">
                        {teamState.wins} - {teamState.losses}
                      </td>
                      <td className="py-3.5 px-4 text-center text-white/60 font-bold">
                        {teamState.matchesPlayed}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {teamState.history.map((h, hIdx) => (
                            <span
                              key={hIdx}
                              title={`${h.opponentName} (${h.score})`}
                              className={cn(
                                "w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold",
                                h.result === "W" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-danger/20 text-danger border border-danger/30"
                              )}
                            >
                              {h.result}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            teamState.status === "qualified"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : teamState.status === "eliminated"
                              ? "bg-danger/20 text-danger border border-danger/30"
                              : "bg-accent/10 text-accent border border-accent/20"
                          )}
                        >
                          {teamState.status === "qualified" ? "Vào Playoff" : teamState.status === "eliminated" ? "Bị Loại" : "Đang Đua Vé"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
