import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  RefreshCcw, 
  Play, 
  Timer, 
  Map as MapIcon, 
  Dices, 
  Coins, 
  Star, 
  Volume2, 
  VolumeX, 
  Flame,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Users,
  Brain,
  Vote,
  Sparkles,
  Gamepad2
} from "lucide-react";
import { VALORANT_AGENTS, VALORANT_MAP_DETAILS } from "../data/valorant";
import { LOL_CHAMPIONS, CS2_AGENTS, AOV_HEROES } from "../data/multiGames";
import { DEFAULT_TEAM_A_ROSTER, DEFAULT_TEAM_B_ROSTER } from "../data/defaultRosters";
import { cn } from "../lib/utils";
import { useDraftRoom, type DraftSlotState, MatchPrediction } from "../hooks/useDraftRoom";
import { analyzeValorantComposition } from "../features/synergyEngine";
import { RosterConfigModal } from "../components/RosterConfigModal";
import { TeamProfile, Game } from "../types";
import { 
  isSoundMuted, 
  toggleSoundMuted, 
  playUiClick, 
  playTimerTick, 
  playRoleSelect 
} from "../lib/soundEngine";

export function DraftRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    room,
    slots,
    currentTurnIndex,
    selectedMap,
    isSpinning,
    isSpinningMap,
    myRole,
    canAct,
    handleRoleSelect,
    handleSpin,
    handleRandomMap,
    handleMapVeto,
    handleRollDeciderMap,
    mapCanAct,
    bannedMaps,
    pickedMaps,
    deciderMap,
    coinTossWinner,
    isTossingCoin,
    handleCoinToss,
    mvpVotes,
    handleVoteMVP,
    predictions,
    handleVotePrediction,
    voterId,
    mapVetoPhase,
    handleReset,
    loading,
    turnDeadline,
    broadcast,
    isMapSetupComplete,
    isSetupComplete,
  } = useDraftRoom(roomId);

  const [timeLeft, setTimeLeft] = useState(30);
  const [muted, setMuted] = useState(isSoundMuted());
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [teamARoster, setTeamARoster] = useState<TeamProfile>(DEFAULT_TEAM_A_ROSTER);
  const [teamBRoster, setTeamBRoster] = useState<TeamProfile>(DEFAULT_TEAM_B_ROSTER);
  const [selectedGame, setSelectedGame] = useState<Game>("Valorant");

  const currentSlot = slots[currentTurnIndex];
  const teamAName = teamARoster.name || room?.team_a_name || "Team A";
  const teamBName = teamBRoster.name || room?.team_b_name || "Team B";
  const isTeam1Turn = currentSlot?.teamId === "team_a";
  const isDraftComplete = slots.length > 0 && slots.every((s) => s.agent !== null);

  const handleToggleMute = () => {
    const newState = toggleSoundMuted();
    setMuted(newState);
  };

  // Broadcast timer sync when turn changes ONLY AFTER setup is complete
  useEffect(() => {
    if (isSetupComplete && !turnDeadline && canAct && currentTurnIndex < 10) {
      broadcast({ type: "SYNC_TIMER", deadline: Date.now() + 30000 });
    }
  }, [isSetupComplete, currentTurnIndex, canAct, turnDeadline, broadcast]);

  // Turn Timer Logic synced with turnDeadline + Sound Ticks
  useEffect(() => {
    if (!isSetupComplete) {
      setTimeLeft(30);
      return;
    }

    if (isSpinning || currentTurnIndex >= 10 || !turnDeadline) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((turnDeadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 10 && remaining > 0) {
        playTimerTick(remaining <= 5);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [isSetupComplete, currentTurnIndex, isSpinning, turnDeadline]);

  // Pick'em prediction statistics calculation
  const predictionCounts = {
    team_a_2_0: Object.values(predictions).filter((p) => p === "team_a_2_0").length,
    team_a_2_1: Object.values(predictions).filter((p) => p === "team_a_2_1").length,
    team_b_2_0: Object.values(predictions).filter((p) => p === "team_b_2_0").length,
    team_b_2_1: Object.values(predictions).filter((p) => p === "team_b_2_1").length,
  };
  const totalPredictions = Object.values(predictions).length;

  // AI Synergy Analysis for Team A and Team B
  const teamAAgents = slots.filter((s) => s.teamId === "team_a").map((s) => s.agent);
  const teamBAgents = slots.filter((s) => s.teamId === "team_b").map((s) => s.agent);

  const teamASynergy = useMemo(() => analyzeValorantComposition(teamAAgents), [teamAAgents]);
  const teamBSynergy = useMemo(() => analyzeValorantComposition(teamBAgents), [teamBAgents]);

  const handleSaveRosters = (a: TeamProfile, b: TeamProfile) => {
    setTeamARoster(a);
    setTeamBRoster(b);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white/50 font-display tracking-widest uppercase">
        Đang đồng bộ hóa phòng thi đấu...
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-white/40">
        <p className="font-display tracking-widest uppercase text-lg">Vui lòng chọn phòng thi đấu.</p>
        <a href="/lobby" className="px-6 py-3 bg-accent text-black font-display tracking-widest uppercase rounded-full">
          TẠO PHÒNG DRAFT
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-display flex items-center gap-3 tracking-widest uppercase">
              <span className="text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-2">
                <img src={teamARoster.logo} alt={teamAName} className="w-8 h-8 rounded-lg object-cover border border-primary/30" />
                {teamAName}
              </span>
              <span className="text-white/20 text-sm font-bold">VS</span>
              <span className="text-danger drop-shadow-[0_0_15px_rgba(255,70,85,0.4)] flex items-center gap-2">
                <img src={teamBRoster.logo} alt={teamBName} className="w-8 h-8 rounded-lg object-cover border border-danger/30" />
                {teamBName}
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Game Selector */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              <Gamepad2 className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Bộ Môn:</span>
              <select
                value={selectedGame}
                onChange={(e) => {
                  playUiClick();
                  setSelectedGame(e.target.value as Game);
                }}
                className="bg-transparent text-accent text-xs font-display uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="Valorant" className="bg-black text-white">Valorant</option>
                <option value="LoL" className="bg-black text-white">Liên Minh Huyền Thoại</option>
                <option value="CS2" className="bg-black text-white">Counter-Strike 2</option>
                <option value="AOV" className="bg-black text-white">Liên Quân Mobile</option>
              </select>
            </div>

            <span className="text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-accent" />
              Tung đồng xu:
            </span>
            {isTossingCoin ? (
              <span className="px-3 py-1 bg-white/5 border border-white/20 rounded-full font-bold text-xs uppercase tracking-widest text-white flex items-center gap-2">
                <Coins className="w-3 h-3 animate-spin text-accent" />
                ĐANG TUNG...
              </span>
            ) : coinTossWinner ? (
              <span
                className={cn(
                  "px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest border",
                  coinTossWinner === "team_a"
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-danger/20 text-danger border-danger/40"
                )}
              >
                {coinTossWinner === "team_a" ? teamAName : teamBName} ĐƯỢC PICK ĐẦU
              </span>
            ) : (
              <button
                onClick={handleCoinToss}
                disabled={!canAct}
                className="px-3 py-1 bg-accent/20 hover:bg-accent text-accent hover:text-black border border-accent/40 rounded-full font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-40"
              >
                Tung đồng xu chọn lượt
              </button>
            )}

            <span className="text-white/20">•</span>
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase">
              Quyền hạn: <span className="text-accent">{myRole === "admin" ? "QUẢN TRỊ VIÊN" : myRole === "captain_a" ? "ĐỘI TRƯỞNG A" : myRole === "captain_b" ? "ĐỘI TRƯỞNG B" : "NGƯỜI XEM"}</span>
            </span>

            <span className="text-white/20">•</span>
            <button
              onClick={() => {
                playUiClick();
                setIsRosterModalOpen(true);
              }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full font-display text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all border border-white/15"
            >
              <Users className="w-3 h-3 text-accent" />
              Hồ Sơ Tuyển Thủ
            </button>
          </div>
        </div>

        {/* Action Controls & Sound Mute */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className={cn(
              "p-2.5 rounded-full border transition-all",
              muted ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-white/70 hover:text-white"
            )}
            title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {canAct && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-display tracking-widest uppercase rounded-full transition-all border border-white/10"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Reset Draft
            </button>
          )}

          <Link
            to={`/overlay/draft/${roomId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-display tracking-widest uppercase rounded-full transition-all border border-purple-500/40"
          >
            OBS Overlay
          </Link>
        </div>
      </div>

      {/* Main Grid: Team 1 (Left) - Center Draft/Veto - Team 2 (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start min-h-0">
        
        {/* Team 1 Roster (Left) */}
        <div className="w-full lg:w-72 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 mb-1">
            <h2 className="text-primary font-display text-lg tracking-widest uppercase">Đội hình {teamAName}</h2>
            <span className="text-[10px] text-primary/70 font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">TEAM A</span>
          </div>
          {slots
            .filter((s) => s.teamId === "team_a")
            .map((slot, i) => (
              <PlayerCard 
                key={slot.id} 
                slot={slot} 
                index={i} 
                side="left" 
                playerProfile={teamARoster.players[i]} 
              />
            ))}
        </div>

        {/* Center Arena */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          
          {/* Turn / Timer Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded-full animate-pulse",
                  isDraftComplete ? "bg-green-500" : isTeam1Turn ? "bg-primary" : "bg-danger"
                )}
              />
              <div>
                <span className="text-xs text-white/40 tracking-widest uppercase block font-bold">
                  {isDraftComplete ? "KẾT QUẢ DRAFT" : "LƯỢT HIỆN TẠI"}
                </span>
                <span className="text-lg font-display tracking-widest uppercase text-white">
                  {isDraftComplete
                    ? "ĐÃ HOÀN TẤT ĐỘI HÌNH"
                    : `${isTeam1Turn ? teamAName : teamBName} • Vị trí #${(currentSlot?.playerIndex ?? 0) + 1}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Timer className={cn("w-5 h-5", timeLeft <= 10 ? "text-danger animate-bounce" : "text-white/40")} />
                <span
                  className={cn(
                    "font-display text-2xl font-bold min-w-[2ch] text-center",
                    timeLeft <= 10 ? "text-danger" : "text-white"
                  )}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* AI Synergy Analysis Panel (Trợ lý Phân tích Đội hình) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team A Synergy */}
            <div className="bg-[#0c0c0c] border border-primary/20 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-display text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Brain className="w-4 h-4" /> AI Synergy: {teamAName}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                    teamASynergy.score >= 75 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  )}>
                    {teamASynergy.rating} ({teamASynergy.score}/100)
                  </span>
                </div>
                
                {/* Warnings or strengths */}
                <div className="space-y-1.5 text-[11px]">
                  {teamASynergy.warnings.length > 0 ? (
                    teamASynergy.warnings.map((w, idx) => (
                      <p key={idx} className="text-rose-400 flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {w}
                      </p>
                    ))
                  ) : (
                    <p className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đội hình đạt chuẩn cân bằng vai trò.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Team B Synergy */}
            <div className="bg-[#0c0c0c] border border-danger/20 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-display text-danger uppercase tracking-widest flex items-center gap-1.5">
                    <Brain className="w-4 h-4" /> AI Synergy: {teamBName}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                    teamBSynergy.score >= 75 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  )}>
                    {teamBSynergy.rating} ({teamBSynergy.score}/100)
                  </span>
                </div>
                
                {/* Warnings or strengths */}
                <div className="space-y-1.5 text-[11px]">
                  {teamBSynergy.warnings.length > 0 ? (
                    teamBSynergy.warnings.map((w, idx) => (
                      <p key={idx} className="text-rose-400 flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {w}
                      </p>
                    ))
                  ) : (
                    <p className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đội hình đạt chuẩn cân bằng vai trò.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active Slot Selection Controls */}
          {!isDraftComplete && (
            <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display tracking-widest uppercase text-white">
                    Chọn Vai Trò Cho {isTeam1Turn ? teamAName : teamBName}
                  </h3>
                  <p className="text-xs text-white/40 mt-1">
                    Đội trưởng chọn Role định hướng trước khi hệ thống kích hoạt Random Gacha.
                  </p>
                </div>
                {currentSlot?.selectedRole && (
                  <span className="text-xs font-display tracking-widest text-accent uppercase bg-accent/10 border border-accent/30 px-3 py-1 rounded-full">
                    ĐÃ CHỌN: {currentSlot.selectedRole}
                  </span>
                )}
              </div>

              {/* Role Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {["Duelist", "Initiator", "Controller", "Sentinel", "Any"].map((role) => (
                  <button
                    key={role}
                    disabled={!canAct || isSpinning}
                    onClick={() => {
                      playRoleSelect();
                      handleRoleSelect(role as any);
                    }}
                    className={cn(
                      "py-3 px-4 rounded-xl font-display text-xs uppercase tracking-widest transition-all duration-300 border",
                      currentSlot?.selectedRole === role
                        ? "bg-accent text-black border-accent font-bold shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-105"
                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white",
                      (!canAct || isSpinning) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {role === "Any" ? "★ BẤT KỲ (ANY)" : role}
                  </button>
                ))}
              </div>

              {/* Spin Random Button */}
              <div className="flex justify-center pt-2">
                <button
                  disabled={!canAct || !currentSlot?.selectedRole || isSpinning}
                  onClick={handleSpin}
                  className={cn(
                    "px-8 py-4 rounded-2xl font-display tracking-widest text-base uppercase transition-all duration-300 flex items-center gap-3 font-bold",
                    currentSlot?.selectedRole && !isSpinning && canAct
                      ? "bg-gradient-to-r from-accent to-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105"
                      : "bg-white/10 text-white/30 cursor-not-allowed border border-white/5"
                  )}
                >
                  <Dices className={cn("w-5 h-5", isSpinning && "animate-spin text-black")} />
                  {isSpinning ? "ĐANG QUAY RANDOM AGENT..." : "QUAY RANDOM AGENT CHO SLOT NÀY"}
                </button>
              </div>
            </div>
          )}

          {/* Map Veto & BO3 Selection Section */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-accent" />
                Cấm / Chọn Bản Đồ Thi Đấu (BO3 Map Veto)
              </h3>
              <div className="flex items-center gap-2">
                {pickedMaps.length === 2 && !deciderMap && (
                  <button
                    onClick={handleRollDeciderMap}
                    disabled={isSpinningMap}
                    className="text-[10px] bg-accent text-black font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow hover:bg-yellow-400 transition-all flex items-center gap-1"
                  >
                    <Dices className="w-3 h-3" />
                    Quay Random Map 3 (Decider)
                  </button>
                )}
                <span className="text-[10px] text-accent uppercase tracking-widest font-bold bg-accent/10 border border-accent/20 px-3 py-0.5 rounded-full">
                  {mapVetoPhase === "completed" ? "BO3 HOÀN TẤT" : `GIAI ĐOẠN: ${mapVetoPhase.replace("_", " ")}`}
                </span>
              </div>
            </div>

            {/* BO3 3-Map Showcase */}
            {(pickedMaps.length > 0 || deciderMap) && (
              <div className="mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Danh Sách 3 Bản Đồ Thi Đấu BO3:</span>
                  <span className="text-accent font-display">{deciderMap ? "3 / 3 Map Đã Chọn" : `${pickedMaps.length} / 2 Pick • Chờ Map 3`}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Map 1 */}
                  <div className="relative rounded-lg border border-primary/40 bg-primary/5 p-3 overflow-hidden h-20 flex flex-col justify-end">
                    {pickedMaps[0] && (
                      <img
                        src={VALORANT_MAP_DETAILS.find((m) => m.name === pickedMaps[0])?.splash}
                        alt={pickedMaps[0]}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="relative z-10">
                      <div className="text-[8px] text-primary font-bold uppercase tracking-widest">MAP 1 • PICK CỦA {teamAName}</div>
                      <div className="text-xs font-display text-white uppercase tracking-wider">{pickedMaps[0] || "Đang chọn..."}</div>
                    </div>
                  </div>

                  {/* Map 2 */}
                  <div className="relative rounded-lg border border-danger/40 bg-danger/5 p-3 overflow-hidden h-20 flex flex-col justify-end">
                    {pickedMaps[1] && (
                      <img
                        src={VALORANT_MAP_DETAILS.find((m) => m.name === pickedMaps[1])?.splash}
                        alt={pickedMaps[1]}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="relative z-10">
                      <div className="text-[8px] text-danger font-bold uppercase tracking-widest">MAP 2 • PICK CỦA {teamBName}</div>
                      <div className="text-xs font-display text-white uppercase tracking-wider">{pickedMaps[1] || "Đang chọn..."}</div>
                    </div>
                  </div>

                  {/* Map 3: Random Decider Map */}
                  <div className={cn(
                    "relative rounded-lg border p-3 overflow-hidden h-20 flex flex-col justify-end transition-all",
                    deciderMap 
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
                      : "border-white/10 bg-white/5"
                  )}>
                    {deciderMap && (
                      <img
                        src={VALORANT_MAP_DETAILS.find((m) => m.name === deciderMap)?.splash}
                        alt={deciderMap}
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="relative z-10">
                      <div className="text-[8px] text-accent font-bold uppercase tracking-widest flex items-center gap-1">
                        <Dices className="w-2.5 h-2.5" /> MAP 3 • RANDOM DECIDER
                      </div>
                      <div className="text-xs font-display text-white uppercase tracking-wider">
                        {isSpinningMap ? "Đang quay ngẫu nhiên..." : (deciderMap || "Tự động random khi xong Pick")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VALORANT_MAP_DETAILS.map((map) => {
                const isDecider = deciderMap === map.name;
                const status = bannedMaps.includes(map.name)
                  ? "BAN"
                  : pickedMaps.includes(map.name)
                  ? "PICK"
                  : isDecider
                  ? "DECIDER"
                  : mapVetoPhase === "completed"
                  ? "LOẠI"
                  : "CÒN LẠI";
                const disabled = status !== "CÒN LẠI" || !mapCanAct || mapVetoPhase === "completed";

                return (
                  <button
                    key={map.id}
                    disabled={disabled}
                    onClick={() => handleMapVeto(map.name)}
                    className={cn(
                      "group relative rounded-xl border overflow-hidden p-3 text-left transition-all duration-300 h-24 flex flex-col justify-end",
                      status === "BAN"
                        ? "border-danger/40 bg-danger/10 opacity-60"
                        : status === "PICK"
                        ? "border-green-500/60 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                        : status === "DECIDER"
                        ? "border-accent bg-accent/20 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                        : status === "LOẠI"
                        ? "border-white/5 bg-black opacity-30"
                        : "border-white/10 hover:border-white/40 bg-white/5",
                      disabled && status !== "DECIDER" && "cursor-not-allowed"
                    )}
                  >
                    <img
                      src={map.splash}
                      alt={map.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    <div className="relative z-10 flex items-end justify-between w-full">
                      <div>
                        <div className="text-xs font-display text-white uppercase tracking-wider">{map.name}</div>
                        <div className="text-[8px] text-white/40 uppercase font-bold">{map.sites} Khu Vực • {map.country}</div>
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                          status === "BAN"
                            ? "bg-danger text-white"
                            : status === "PICK"
                            ? "bg-green-500 text-black font-extrabold"
                            : status === "DECIDER"
                            ? "bg-accent text-black font-extrabold"
                            : "bg-white/10 text-white/60"
                        )}
                      >
                        {status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Predictions (Pick'em) Section for Audience Interaction */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase flex items-center gap-2">
                <Vote className="w-4 h-4 text-accent" />
                Dự Đoán Tỉ Số Trận Đấu (Pick'em Community)
              </h3>
              <span className="text-[10px] text-white/40 uppercase font-bold">
                {totalPredictions} Khán Giả Đã Bình Chọn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "team_a_2_0", label: `${teamAName} Thắng 2-0`, color: "border-primary text-primary" },
                { id: "team_a_2_1", label: `${teamAName} Thắng 2-1`, color: "border-cyan-400 text-cyan-400" },
                { id: "team_b_2_1", label: `${teamBName} Thắng 2-1`, color: "border-rose-400 text-rose-400" },
                { id: "team_b_2_0", label: `${teamBName} Thắng 2-0`, color: "border-danger text-danger" },
              ].map((p) => {
                const count = predictionCounts[p.id as keyof typeof predictionCounts];
                const pct = totalPredictions > 0 ? Math.round((count / totalPredictions) * 100) : 0;
                const isSelected = predictions[voterId] === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleVotePrediction(p.id as MatchPrediction)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden",
                      isSelected
                        ? "bg-accent/15 border-accent shadow-[0_0_15px_rgba(234,179,8,0.25)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={cn("text-xs font-display uppercase tracking-wider", p.color)}>
                        {p.label}
                      </span>
                      {isSelected && <span className="text-[9px] bg-accent text-black font-extrabold px-1.5 py-0.5 rounded">BẠN CHỌN</span>}
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-white/70">
                      <span>{pct}% Tỉ lệ</span>
                      <span className="text-[10px] text-white/40">{count} Phiếu</span>
                    </div>
                    {/* Visual Progress bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MVP Voting or Agent Roster Browser */}
          {isDraftComplete ? (
            <div className="bg-[#0c0c0c] border border-accent/20 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-accent tracking-widest uppercase mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 fill-accent" />
                Bình Chọn Tuyển Thủ MVP Có Đội Hình Ấn Tượng Nhất
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {slots.map((slot) => {
                  const voteCount = Object.values(mvpVotes).filter((id) => id === slot.id).length;
                  const hasVoted = mvpVotes[voterId] === slot.id;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => handleVoteMVP(slot.id)}
                      className={cn(
                        "p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative overflow-hidden",
                        hasVoted
                          ? "bg-accent/20 border-accent shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <img src={slot.agent?.image} alt={slot.agent?.name} className="w-12 h-12 object-contain" />
                      <div className="text-center">
                        <div className="text-xs font-display text-white uppercase">{slot.agent?.name}</div>
                        <div className="text-[10px] text-white/40 uppercase">
                          {slot.teamId === "team_a" ? teamAName : teamBName}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                        {voteCount} Phiếu
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 flex-1 overflow-y-auto">
              <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-4">
                Kho Nhân Vật ({selectedGame})
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {(selectedGame === "Valorant"
                  ? VALORANT_AGENTS
                  : selectedGame === "LoL"
                  ? LOL_CHAMPIONS
                  : selectedGame === "CS2"
                  ? CS2_AGENTS
                  : AOV_HEROES
                ).map((agent) => (
                  <div key={agent.id} className="flex flex-col items-center gap-1.5 group">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-white/30 relative",
                        currentSlot?.agent?.id === agent.id && "border-accent ring-2 ring-accent bg-accent/20 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                      )}
                    >
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold group-hover:text-white transition-colors truncate max-w-[60px]">
                      {agent.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Team 2 Roster (Right) */}
        <div className="w-full lg:w-72 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 mb-1">
            <h2 className="text-danger font-display text-lg tracking-widest uppercase">Đội hình {teamBName}</h2>
            <span className="text-[10px] text-danger/70 font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-danger/10 border border-danger/20">TEAM B</span>
          </div>
          {slots
            .filter((s) => s.teamId === "team_b")
            .map((slot, i) => (
              <PlayerCard 
                key={slot.id} 
                slot={slot} 
                index={i} 
                side="right" 
                playerProfile={teamBRoster.players[i]} 
              />
            ))}
        </div>
      </div>

      {/* Roster & Player Profile Configuration Modal */}
      <RosterConfigModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        teamA={teamARoster}
        teamB={teamBRoster}
        onSave={handleSaveRosters}
      />
    </div>
  );
}

interface PlayerCardProps {
  slot: DraftSlotState;
  index: number;
  side: "left" | "right";
  playerProfile?: {
    id: string;
    nickname: string;
    avatar: string;
    mainRole: string;
  };
}

function PlayerCard({ slot, index, side, playerProfile }: PlayerCardProps) {
  const isPicking = slot.status === "picking";
  const hasAgent = !!slot.agent;

  return (
    <div
      className={cn(
        "h-24 rounded-2xl border flex items-center overflow-hidden transition-all duration-300 relative bg-[#0a0a0a]",
        isPicking
          ? "border-accent shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-gradient-to-r from-accent/10 to-transparent"
          : "border-white/10 hover:border-white/20"
      )}
    >
      {/* Full-Bleed Portrait Background Art */}
      {hasAgent && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={slot.agent?.fullPortrait || slot.agent?.image}
            alt={slot.agent?.name}
            className={cn(
              "absolute top-0 w-36 h-36 object-cover object-top opacity-25 filter grayscale contrast-125 transition-opacity",
              side === "left" ? "right-2" : "left-2 scale-x-[-1]"
            )}
          />
          <div
            className={cn(
              "absolute inset-0",
              side === "left"
                ? "bg-gradient-to-r from-black via-black/80 to-transparent"
                : "bg-gradient-to-l from-black via-black/80 to-transparent"
            )}
          />
        </div>
      )}

      {/* Player Avatar / Index */}
      <div className="w-12 h-full flex flex-col items-center justify-center border-r border-white/10 bg-white/5 relative z-10">
        {playerProfile ? (
          <div className="flex flex-col items-center gap-1">
            <img src={playerProfile.avatar} alt={playerProfile.nickname} className="w-6 h-6 rounded-full object-cover border border-white/20" />
            <span className="text-[9px] font-display text-white/40">#{index + 1}</span>
          </div>
        ) : (
          <span className="text-xs font-display text-white/40">#{index + 1}</span>
        )}
      </div>

      <div className="flex-1 flex items-center px-3 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-black/60 mr-3 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
          {hasAgent ? (
            <img
              src={slot.agent!.image}
              alt={slot.agent!.name}
              className="w-10 h-10 object-contain scale-110 drop-shadow-xl"
            />
          ) : (
            <div className="text-white/20 text-sm italic font-display">?</div>
          )}
        </div>

        <div className="flex flex-col truncate">
          {/* Player In-Game Nickname and preferred role */}
          {playerProfile && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-display text-accent font-bold uppercase truncate max-w-[110px]">
                {playerProfile.nickname}
              </span>
              <span className="text-[8px] text-white/30 uppercase truncate">
                • {playerProfile.mainRole}
              </span>
            </div>
          )}

          {hasAgent ? (
            <>
              <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest">
                {slot.agent!.role}
              </span>
              <span className="text-sm font-display text-white uppercase tracking-widest mt-0.5 drop-shadow truncate">
                {slot.agent!.name}
              </span>
            </>
          ) : (
            <>
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                {slot.selectedRole === "Any" ? "BẤT KỲ" : slot.selectedRole || "CHƯA CHỌN"}
              </span>
              <span
                className={cn(
                  "text-xs font-display uppercase tracking-widest mt-0.5",
                  isPicking ? "text-accent font-bold animate-pulse" : "text-white/20"
                )}
              >
                {isPicking ? "ĐANG CHỌN..." : "Đang chờ..."}
              </span>
            </>
          )}
        </div>
      </div>

      <div
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold tracking-widest border shadow z-10",
          side === "left" ? "bg-primary/10 text-primary border-primary/30" : "bg-danger/10 text-danger border-danger/30"
        )}
      >
        {side === "left" ? "A" : "B"}
        {index + 1}
      </div>
    </div>
  );
}
