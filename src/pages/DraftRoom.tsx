import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RefreshCcw, Play, Timer, Map as MapIcon, Dices } from "lucide-react";
import { VALORANT_AGENTS } from "../data/valorant";
import { cn } from "../lib/utils";
import { useDraftRoom, type DraftSlotState } from "../hooks/useDraftRoom";

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
    handleReset,
    loading,
  } = useDraftRoom(roomId);

  const [timeLeft, setTimeLeft] = useState(30);

  const currentSlot = slots[currentTurnIndex];
  const teamAName = room?.team_a_name ?? "Team A";
  const teamBName = room?.team_b_name ?? "Team B";
  const isTeam1Turn = currentSlot?.teamId === "team_a";

  // Turn Timer Logic
  useEffect(() => {
    if (isSpinning || currentTurnIndex >= 10) return;

    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTurnIndex, isSpinning]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Đang tải phòng draft...
      </div>
    );
  }

  // Fallback for legacy /draft route without roomId
  if (!roomId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
        <p>Vui lòng tạo hoặc tham gia một phòng draft.</p>
        <a href="/lobby" className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg">
          TẠO PHÒNG DRAFT
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-[#00E5FF]">{teamAName}</span>
            <span className="text-gray-500 text-sm">VS</span>
            <span className="text-[#FF4655]">{teamBName}</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <MapIcon className="w-4 h-4" />
              Bản đồ:
            </p>
            {selectedMap ? (
              <span className={cn("px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded font-bold uppercase", isSpinningMap ? "text-yellow-500 animate-pulse border-yellow-500" : "text-white")}>
                {selectedMap}
              </span>
            ) : (
              <span className="px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded font-bold uppercase text-gray-500 italic">
                Chưa chọn
              </span>
            )}

            <button
              onClick={handleRandomMap}
              disabled={isSpinningMap || !canAct}
              className="ml-2 flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 rounded text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Dices className="w-3 h-3" />
              RANDOM MAP
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 bg-[#1A1A1A] border border-[#333] px-3 py-1.5 rounded uppercase font-bold">
            {myRole}
          </span>
          <button
            onClick={handleReset}
            disabled={!canAct}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded text-sm text-gray-300 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className="w-4 h-4" />
            LÀM MỚI DRAFT
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Team 1 Roster */}
        <div className="w-64 flex flex-col gap-2">
          <h2 className="text-[#00E5FF] font-bold text-sm text-center mb-2">ĐỘI HÌNH {teamAName}</h2>
          {slots.filter(s => s.teamId === "team_a").map((slot, i) => (
            <PlayerCard key={slot.id} slot={slot} index={i} side="left" />
          ))}
        </div>

        {/* Center Console */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Turn Info & Timer */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-3 py-1.5 rounded text-yellow-500 font-bold">
              <Timer className="w-4 h-4" />
              <span className={cn(timeLeft <= 10 && "text-red-500 animate-pulse")}>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>

            <p className="text-gray-400 text-xs mb-1">LƯỢT HIỆN TẠI</p>
            <p className="text-lg font-bold mt-2">
              LƯỢT #{currentTurnIndex + 1}: <span className={isTeam1Turn ? "text-[#00E5FF]" : "text-[#FF4655]"}>
                {isTeam1Turn ? teamAName : teamBName}
              </span> CHỌN VAI TRÒ VÀ QUAY SỐ
            </p>
          </div>

          {/* Role Selection */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-300 mb-4">1. CHỌN VAI TRÒ (ROLE)</h3>
            <div className="grid grid-cols-5 gap-3">
              {(["Duelist", "Controller", "Sentinel", "Initiator", "Any"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  disabled={!canAct}
                  className={cn(
                    "py-3 px-2 rounded font-bold text-xs uppercase border transition-all",
                    currentSlot?.selectedRole === role
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                      : "border-[#333] text-gray-400 hover:border-gray-500 hover:text-white",
                    !canAct && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {role === "Any" ? "BẤT KỲ" : role}
                </button>
              ))}
            </div>

            <button
              onClick={handleSpin}
              disabled={!currentSlot?.selectedRole || isSpinning || !canAct}
              className={cn(
                "mt-6 w-full py-4 rounded font-bold flex items-center justify-center gap-2 transition-all",
                currentSlot?.selectedRole && !isSpinning && canAct
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  : "bg-[#222] text-gray-500 cursor-not-allowed"
              )}
            >
              <Play className="w-5 h-5 fill-current" />
              2. BẮT ĐẦU QUAY RANDOM
            </button>
          </div>

          {/* Agent Grid */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-6 flex-1">
            <h3 className="text-sm font-bold text-gray-300 mb-4">BẢN ĐỒ AGENT VALORANT</h3>
            <div className="grid grid-cols-8 gap-3">
              {VALORANT_AGENTS.map((agent) => (
                <div key={agent.id} className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-12 h-12 rounded bg-[#1A1A1A] border border-[#333] overflow-hidden flex items-center justify-center",
                    currentSlot?.agent?.id === agent.id && "border-yellow-500 ring-1 ring-yellow-500"
                  )}>
                    <img src={agent.image} alt={agent.name} className="w-10 h-10 object-contain" />
                  </div>
                  <span className="text-[10px] text-gray-400">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Team 2 Roster */}
        <div className="w-64 flex flex-col gap-2">
          <h2 className="text-[#FF4655] font-bold text-sm text-center mb-2">ĐỘI HÌNH {teamBName}</h2>
          {slots.filter(s => s.teamId === "team_b").map((slot, i) => (
            <PlayerCard key={slot.id} slot={slot} index={i} side="right" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PlayerCardProps {
  slot: DraftSlotState;
  index: number;
  side: "left" | "right";
}

function PlayerCard({ slot, index, side }: PlayerCardProps) {
  const isPicking = slot.status === "picking";
  const hasAgent = !!slot.agent;

  return (
    <div className={cn(
      "h-20 rounded-xl border flex items-center overflow-hidden transition-all relative bg-[#111]",
      isPicking ? "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]" : "border-[#222]"
    )}>
      <div className="w-8 h-full flex flex-col items-center justify-center text-xs font-bold border-r border-[#222] bg-[#1A1A1A] text-gray-500">
        #{index + 1}
      </div>

      <div className="flex-1 flex items-center px-3 relative z-10">
        <div className="w-12 h-12 rounded bg-[#1A1A1A] mr-3 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {hasAgent ? (
            <img src={slot.agent!.image} alt={slot.agent!.name} className="w-10 h-10 object-contain scale-125" />
          ) : (
            <div className="text-gray-600 text-xs italic">?</div>
          )}
        </div>
        <div className="flex flex-col">
          {hasAgent ? (
            <>
              <span className="text-[10px] text-gray-500 uppercase">{slot.agent!.role}</span>
              <span className="text-sm font-bold text-white uppercase">{slot.agent!.name}</span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-gray-500 uppercase">
                {slot.selectedRole === "Any" ? "BẤT KỲ" : slot.selectedRole || "CHƯA CHỌN"}
              </span>
              <span className={cn(
                "text-sm font-bold uppercase",
                isPicking ? "text-yellow-500 animate-pulse" : "text-gray-600"
              )}>
                ĐANG CHỜ...
              </span>
            </>
          )}
        </div>
      </div>

      <div className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
        side === "left" ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "bg-[#FF4655]/10 text-[#FF4655]"
      )}>
        {side === "left" ? "A" : "B"}{index + 1}
      </div>

      {/* Background gradient if locked */}
      {hasAgent && (
        <div className={cn(
          "absolute inset-0 opacity-10 pointer-events-none",
          side === "left" ? "bg-gradient-to-r from-[#00E5FF]" : "bg-gradient-to-l from-[#FF4655]"
        )} />
      )}
    </div>
  );
}
