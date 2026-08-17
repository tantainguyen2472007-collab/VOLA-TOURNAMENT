import { useParams } from "react-router-dom";
import { useDraftRoom } from "../../hooks/useDraftRoom";
import { cn } from "../../lib/utils";
import { VALORANT_MAP_DETAILS } from "../../data/valorant";
import { Vote, Dices, Award, Trophy } from "lucide-react";

export function DraftOverlayPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { 
    room, 
    slots, 
    currentTurnIndex, 
    selectedMap, 
    pickedMaps, 
    deciderMap, 
    predictions 
  } = useDraftRoom(roomId);
  
  const teamAName = room?.team_a_name ?? "Team A";
  const teamBName = room?.team_b_name ?? "Team B";
  const currentSlot = slots[currentTurnIndex];
  const isTeam1Turn = currentSlot?.teamId === "team_a";
  const isDraftComplete = slots.length > 0 && slots.every((s) => s.agent !== null);

  // Predictions percentages
  const totalVotes = Object.values(predictions).length;
  const pCount = {
    team_a_2_0: Object.values(predictions).filter((p) => p === "team_a_2_0").length,
    team_a_2_1: Object.values(predictions).filter((p) => p === "team_a_2_1").length,
    team_b_2_0: Object.values(predictions).filter((p) => p === "team_b_2_0").length,
    team_b_2_1: Object.values(predictions).filter((p) => p === "team_b_2_1").length,
  };
  const pct = (count: number) => (totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 25);
  const teamAVotes = pCount.team_a_2_0 + pCount.team_a_2_1;
  const teamAPct = totalVotes > 0 ? Math.round((teamAVotes / totalVotes) * 100) : 50;
  const teamBPct = 100 - teamAPct;

  return (
    <div className="w-[1920px] h-[1080px] bg-transparent text-white font-display overflow-hidden relative select-none">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/90 via-black/70 to-transparent flex items-center justify-between px-16 pt-2">
        {/* Team A */}
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center font-display text-2xl text-primary drop-shadow-[0_0_20px_rgba(0,229,255,0.6)]">
            A
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-widest text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] uppercase">
              {teamAName}
            </h1>
            <div className="text-xs tracking-widest text-primary/80 font-bold uppercase mt-1">
              Dự Đoán Thắng: {teamAPct}% ({teamAVotes} phiếu)
            </div>
          </div>
        </div>

        {/* Center Maps / Match Info */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            {pickedMaps[0] && (
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary">
                M1: {pickedMaps[0]}
              </span>
            )}
            {pickedMaps[1] && (
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-danger/20 border border-danger/40 text-danger">
                M2: {pickedMaps[1]}
              </span>
            )}
            {deciderMap && (
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center gap-1">
                <Dices className="w-3 h-3" /> M3: {deciderMap}
              </span>
            )}
          </div>
          <span className="text-white/60 text-xs tracking-widest uppercase font-bold">
            TRẬN ĐẤU BO3 ESPORTS
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center gap-6 flex-row-reverse text-right">
          <div className="w-16 h-16 rounded-2xl bg-danger/20 border border-danger/40 flex items-center justify-center font-display text-2xl text-danger drop-shadow-[0_0_20px_rgba(255,70,85,0.6)]">
            B
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-widest text-danger drop-shadow-[0_0_15px_rgba(255,70,85,0.5)] uppercase">
              {teamBName}
            </h1>
            <div className="text-xs tracking-widest text-danger/80 font-bold uppercase mt-1">
              Dự Đoán Thắng: {teamBPct}% ({totalVotes - teamAVotes} phiếu)
            </div>
          </div>
        </div>
      </div>

      {/* Team A Roster Cards */}
      <div className="absolute top-36 left-12 flex flex-col gap-4 w-[420px]">
        {slots.filter(s => s.teamId === "team_a").map((slot, i) => (
          <OverlayCard 
            key={slot.id} 
            slot={slot} 
            index={i} 
            side="left" 
            isPicking={slot.status === "picking"} 
          />
        ))}
      </div>

      {/* Team B Roster Cards */}
      <div className="absolute top-36 right-12 flex flex-col gap-4 w-[420px]">
        {slots.filter(s => s.teamId === "team_b").map((slot, i) => (
          <OverlayCard 
            key={slot.id} 
            slot={slot} 
            index={i} 
            side="right" 
            isPicking={slot.status === "picking"} 
          />
        ))}
      </div>

      {/* Bottom Center: Live Status & Predictions Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        {!isDraftComplete ? (
          <div className="bg-black/85 border border-white/20 px-10 py-4 rounded-3xl text-center backdrop-blur-xl shadow-2xl">
            <p className="text-white/50 text-xs tracking-widest uppercase mb-1">LƯỢT PICK HIỆN TẠI</p>
            <p className="text-3xl tracking-widest uppercase">
              <span className={isTeam1Turn ? "text-primary font-bold" : "text-danger font-bold"}>
                {isTeam1Turn ? teamAName : teamBName}
              </span>{" "}
              <span className="text-white/80">ĐANG CHỌN...</span>
            </p>
          </div>
        ) : (
          <div className="bg-accent/15 border border-accent/40 px-10 py-4 rounded-3xl text-center backdrop-blur-xl shadow-[0_0_30px_rgba(234,179,8,0.3)] flex items-center gap-4">
            <Trophy className="w-8 h-8 text-accent animate-bounce" />
            <div>
              <p className="text-accent text-xs tracking-widest uppercase font-bold">DRAFT HOÀN TẤT</p>
              <p className="text-2xl text-white tracking-widest uppercase">SẴN SÀNG THI ĐẤU</p>
            </div>
          </div>
        )}

        {/* Live Pick'em Bar */}
        <div className="bg-black/80 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md flex items-center gap-6 text-xs tracking-widest uppercase font-bold">
          <span className="text-white/40 flex items-center gap-1.5">
            <Vote className="w-3.5 h-3.5 text-accent" />
            Pick'em Live:
          </span>
          <span className="text-primary">{teamAName} 2-0: {pct(pCount.team_a_2_0)}%</span>
          <span className="text-cyan-400">{teamAName} 2-1: {pct(pCount.team_a_2_1)}%</span>
          <span className="text-rose-400">{teamBName} 2-1: {pct(pCount.team_b_2_1)}%</span>
          <span className="text-danger">{teamBName} 2-0: {pct(pCount.team_b_2_0)}%</span>
        </div>
      </div>
    </div>
  );
}

function OverlayCard({ slot, index, side, isPicking }: any) {
  const hasAgent = !!slot.agent;
  
  return (
    <div className={cn(
      "h-[110px] rounded-2xl border-2 flex items-center bg-[#0a0a0a]/90 backdrop-blur-md relative overflow-hidden transition-all duration-300 shadow-xl",
      isPicking ? "border-accent shadow-[0_0_30px_rgba(234,179,8,0.45)] ring-2 ring-accent/30" : "border-white/10",
      side === "left" ? "flex-row" : "flex-row-reverse"
    )}>
      {/* Full Portrait Background */}
      {hasAgent && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={slot.agent?.fullPortrait || slot.agent?.image}
            alt={slot.agent?.name}
            className={cn(
              "absolute -top-4 w-40 h-40 object-cover object-top opacity-20 filter grayscale contrast-125",
              side === "left" ? "right-2" : "left-2 scale-x-[-1]"
            )}
          />
        </div>
      )}

      <div className={cn(
        "w-14 h-full flex flex-col items-center justify-center text-xl font-display text-white/50 bg-white/5 relative z-10",
        side === "left" ? "border-r border-white/10" : "border-l border-white/10"
      )}>
        #{index + 1}
      </div>

      <div className={cn(
        "flex-1 flex items-center px-4 relative z-10",
        side === "left" ? "flex-row" : "flex-row-reverse text-right"
      )}>
        <div className={cn(
          "w-16 h-16 rounded-xl bg-black/60 flex items-center justify-center border border-white/10 flex-shrink-0 shadow-inner",
          side === "left" ? "mr-4" : "ml-4"
        )}>
          {hasAgent ? (
            <img src={slot.agent!.image} className="w-14 h-14 object-contain scale-110 drop-shadow-xl" alt={slot.agent!.name} />
          ) : (
            <div className="text-white/20 text-lg font-bold font-display">?</div>
          )}
        </div>

        <div className="flex flex-col">
          {hasAgent ? (
            <>
              <span className="text-[10px] text-white/50 tracking-widest uppercase font-bold">{slot.agent!.role}</span>
              <span className="text-2xl font-display text-white tracking-widest mt-0.5 uppercase drop-shadow">{slot.agent!.name}</span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-white/40 tracking-widest uppercase font-bold">
                {slot.selectedRole === "Any" ? "BẤT KỲ" : slot.selectedRole || "CHƯA CHỌN"}
              </span>
              <span className={cn(
                "text-lg font-display tracking-widest mt-0.5 uppercase",
                isPicking ? "text-accent animate-pulse font-bold" : "text-white/20"
              )}>
                {isPicking ? "Đang chọn..." : "Chờ..."}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
