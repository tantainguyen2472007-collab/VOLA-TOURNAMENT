import { useState, useMemo } from "react";
import { Agent } from "../types";
import { 
  TACTICAL_ARCHETYPES, 
  TacticalArchetype, 
  generateTacticalTeam, 
  evaluateTeamComposition, 
  DetailedTeamEvaluation 
} from "../features/teamGenerator";
import { 
  Dices, 
  Swords, 
  Shield, 
  Trophy, 
  Eye, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  MapPin, 
  Check, 
  Copy, 
  X,
  Zap
} from "lucide-react";
import { cn } from "../lib/utils";
import { playUiClick, playLockInSound, playVictoryFanfare, playRoleSelect } from "../lib/soundEngine";

interface TacticalTeamGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamAName: string;
  teamBName: string;
  onApplyToTeam: (teamId: "team_a" | "team_b", agents: Agent[]) => void;
}

export function TacticalTeamGeneratorModal({
  isOpen,
  onClose,
  teamAName,
  teamBName,
  onApplyToTeam,
}: TacticalTeamGeneratorModalProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<TacticalArchetype>("tournament");
  const [generatedAgents, setGeneratedAgents] = useState<Agent[]>(() => generateTacticalTeam("tournament"));
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const evaluation: DetailedTeamEvaluation = useMemo(() => {
    return evaluateTeamComposition(generatedAgents, selectedArchetype);
  }, [generatedAgents, selectedArchetype]);

  if (!isOpen) return null;

  const handleSelectArchetype = (arch: TacticalArchetype) => {
    playRoleSelect();
    setSelectedArchetype(arch);
    triggerRandom(arch);
  };

  const triggerRandom = (arch: TacticalArchetype = selectedArchetype) => {
    setIsGenerating(true);
    playUiClick();
    
    // Quick rolling effect
    let count = 0;
    const interval = setInterval(() => {
      setGeneratedAgents(generateTacticalTeam(arch));
      count++;
      if (count >= 5) {
        clearInterval(interval);
        const finalTeam = generateTacticalTeam(arch);
        setGeneratedAgents(finalTeam);
        setIsGenerating(false);
        playLockInSound();
      }
    }, 80);
  };

  const handleApply = (teamId: "team_a" | "team_b") => {
    playVictoryFanfare();
    onApplyToTeam(teamId, generatedAgents);
    onClose();
  };

  const handleCopySummary = () => {
    const text = `🎯 [ĐỘI HÌNH VALORANT - ${TACTICAL_ARCHETYPES[selectedArchetype].name.toUpperCase()}]
5 Đặc Vụ: ${generatedAgents.map((a) => `${a.name} (${a.role})`).join(", ")}
Điểm Đánh Giá: ${evaluation.score}/100
- Tấn Công: ${evaluation.stats.attackPower}% | Phòng Thủ: ${evaluation.stats.defensePower}% | Thông Tin: ${evaluation.stats.infoGathering}% | Khói: ${evaluation.stats.smokeControl}%
✨ Điểm Mạnh: ${evaluation.keyStrengths.map((s) => s.title).join("; ")}
⚠️ Điểm Yếu: ${evaluation.keyWeaknesses.map((w) => w.title).join("; ")}
🗺️ Map Khuyên Dùng: ${evaluation.recommendedMaps.map((m) => m.name).join(", ")}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const archInfo = TACTICAL_ARCHETYPES[selectedArchetype];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0e0e0e] border border-white/15 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.03] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-display uppercase tracking-widest text-white flex items-center gap-2">
                Random Đội Hình 5 Tướng & Trợ Lý Chiến Thuật
              </h2>
              <p className="text-xs text-white/40">
                Tự động tối ưu hóa 5 đặc vụ Valorant chuẩn chiến thuật và phân tích điểm mạnh, điểm yếu tức thì.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Archetypes Selector Tabs */}
        <div className="p-4 md:px-6 border-b border-white/10 bg-black/40">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: "atk", icon: Swords, label: "Mạnh Tấn Công (ATK)", color: "text-rose-400 border-rose-500" },
              { id: "def", icon: Shield, label: "Mạnh Phòng Thủ (DEF)", color: "text-emerald-400 border-emerald-500" },
              { id: "tournament", icon: Trophy, label: "Bắn Giải VCT Meta", color: "text-accent border-accent" },
              { id: "recon", icon: Eye, label: "Lấy Thông Tin Recon", color: "text-cyan-400 border-cyan-500" },
              { id: "ranked", icon: Flame, label: "Bắn Rank SoloQ", color: "text-purple-400 border-purple-500" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedArchetype === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectArchetype(tab.id as TacticalArchetype)}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-2 relative overflow-hidden group",
                    isSelected
                      ? "bg-white/10 border-accent shadow-[0_0_20px_rgba(234,179,8,0.25)] ring-1 ring-accent/30"
                      : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isSelected ? "text-accent" : "text-white/40")} />
                    {isSelected && (
                      <span className="text-[9px] bg-accent text-black font-extrabold px-1.5 py-0.5 rounded uppercase">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={cn("font-display text-xs uppercase tracking-wider", isSelected ? "text-white font-bold" : "text-white/70")}>
                      {tab.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Archetype Description Banner */}
          <div className="mt-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className={cn("text-xs font-display uppercase tracking-widest font-bold mr-2", archInfo.color)}>
                {archInfo.name}:
              </span>
              <span className="text-xs text-white/60">{archInfo.tagline}</span>
            </div>
            <button
              onClick={() => triggerRandom()}
              disabled={isGenerating}
              className="flex-shrink-0 px-4 py-1.5 rounded-full bg-accent text-black font-display text-xs uppercase tracking-widest font-bold hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-1.5"
            >
              <Dices className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
              {isGenerating ? "ĐANG RANDOM..." : "RANDOM LẠI 5 TƯỚNG"}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* 5 Agent Cards Showcase */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-display text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent" /> 5 Đặc Vụ Đã Chọn Lọc
              </span>
              <span className="text-xs font-display text-accent tracking-widest uppercase">
                {generatedAgents.filter((a) => a.role === "Duelist").length} Duelist •{" "}
                {generatedAgents.filter((a) => a.role === "Initiator").length} Initiator •{" "}
                {generatedAgents.filter((a) => a.role === "Controller").length} Controller •{" "}
                {generatedAgents.filter((a) => a.role === "Sentinel").length} Sentinel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {generatedAgents.map((agent, idx) => (
                <div
                  key={`${agent.id}-${idx}`}
                  className="h-44 rounded-2xl border border-white/15 bg-black/60 relative overflow-hidden flex flex-col justify-end p-3.5 group hover:border-accent transition-all duration-300 shadow-lg"
                >
                  {/* Full artwork background */}
                  <img
                    src={agent.fullPortrait || agent.image}
                    alt={agent.name}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-40 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                  {/* Slot Number Tag */}
                  <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-black/70 border border-white/20 flex items-center justify-center font-display text-[10px] text-white/60 z-10">
                    #{idx + 1}
                  </div>

                  {/* Role Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span
                      className={cn(
                        "text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow",
                        agent.role === "Duelist"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : agent.role === "Initiator"
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : agent.role === "Controller"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      )}
                    >
                      {agent.role}
                    </span>
                  </div>

                  {/* Agent Details */}
                  <div className="relative z-10">
                    <div className="text-lg font-display text-white uppercase tracking-wider drop-shadow-md">
                      {agent.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assistant Evaluation Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Overall Score & Stat Meters */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-display text-white/50 uppercase tracking-widest">
                    Chỉ Số Sức Mạnh Đội Hình
                  </span>
                  <div className="text-2xl font-display text-accent font-bold drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    {evaluation.score}<span className="text-xs text-white/40">/100</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Sức Mạnh Tấn Công (ATK)", value: evaluation.stats.attackPower, color: "bg-rose-500" },
                    { label: "Sức Mạnh Phòng Thủ (DEF)", value: evaluation.stats.defensePower, color: "bg-emerald-500" },
                    { label: "Lấy Thông Tin & Recon", value: evaluation.stats.infoGathering, color: "bg-cyan-500" },
                    { label: "Che Chắn & Smoke Tầm Nhìn", value: evaluation.stats.smokeControl, color: "bg-purple-500" },
                    { label: "Khả Năng Clutch 1vX", value: evaluation.stats.clutchPotential, color: "bg-amber-400" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1">
                        <span className="text-white/60">{stat.label}</span>
                        <span className="text-white">{stat.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-700", stat.color)}
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Maps */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5" /> Bản Đồ Phù Hợp Nhất
                </span>
                <div className="space-y-1.5">
                  {evaluation.recommendedMaps.map((m, idx) => (
                    <div key={idx} className="text-xs bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="font-display text-white uppercase mr-1.5">{m.name}:</span>
                      <span className="text-white/50 text-[11px]">{m.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Key Strengths, Key Weaknesses & Tactical Advice */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Điểm Mạnh */}
              <div className="bg-emerald-500/[0.04] border border-emerald-500/20 rounded-2xl p-4">
                <h4 className="text-xs font-display text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Điểm Mạnh Cốt Lõi (Key Strengths)
                </h4>
                <div className="space-y-2.5">
                  {evaluation.keyStrengths.map((s, idx) => (
                    <div key={idx} className="bg-black/40 border border-emerald-500/10 rounded-xl p-3">
                      <div className="text-xs font-display text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {s.title}
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{s.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Điểm Yếu & Lưu Ý */}
              <div className="bg-rose-500/[0.04] border border-rose-500/20 rounded-2xl p-4">
                <h4 className="text-xs font-display text-rose-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Điểm Yếu Cần Cảnh Giác (Weaknesses & Vulnerabilities)
                </h4>
                <div className="space-y-2.5">
                  {evaluation.keyWeaknesses.map((w, idx) => (
                    <div key={idx} className="bg-black/40 border border-rose-500/10 rounded-xl p-3">
                      <div className="text-xs font-display text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        {w.title}
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{w.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lời Khuyên Chiến Thuật */}
              <div className="bg-accent/[0.04] border border-accent/20 rounded-2xl p-4">
                <h4 className="text-xs font-display text-accent uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  Trợ Lý Hướng Dẫn Vận Hành Chiến Thuật
                </h4>
                <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside">
                  {evaluation.tacticalAdvice.map((adv, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/60">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-full text-xs font-display uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/10 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "ĐÃ SAO CHÉP ĐÁNH GIÁ" : "SAO CHÉP ĐÁNH GIÁ"}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleApply("team_a")}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-widest bg-primary/20 hover:bg-primary text-primary hover:text-black border border-primary/40 transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Áp Dụng Cho {teamAName} (Team A)
            </button>

            <button
              onClick={() => handleApply("team_b")}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-widest bg-danger/20 hover:bg-danger text-danger hover:text-white border border-danger/40 transition-all shadow-[0_0_15px_rgba(255,70,85,0.25)] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Áp Dụng Cho {teamBName} (Team B)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
