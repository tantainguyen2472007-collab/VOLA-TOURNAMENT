import React, { useState } from "react";
import { 
  Crosshair, 
  ZoomIn, 
  Map as MapIcon, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Target, 
  Flame, 
  Zap, 
  Shield, 
  Eye, 
  Layers,
  HelpCircle,
  Compass,
  CornerDownRight,
  Info
} from "lucide-react";
import { AbilityLineup, LineupStep } from "../data/mapLineups";
import { sound } from "../lib/sounds";

interface InGameHUDVisualizerProps {
  lineup: AbilityLineup;
  activeStepIndex: number;
  onStepChange: (index: number) => void;
}

export function InGameHUDVisualizer({
  lineup,
  activeStepIndex,
  onStepChange
}: InGameHUDVisualizerProps) {
  const [viewMode, setViewMode] = useState<"ingame" | "zoom" | "minimap" | "pro_tips">("ingame");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHudGuides, setShowHudGuides] = useState<boolean>(true);

  const currentStep: LineupStep = lineup.steps[activeStepIndex] || lineup.steps[0];
  const targetX = currentStep.hudTargetX ?? 50;
  const targetY = currentStep.hudTargetY ?? 40;

  const getMapThemeGradient = (mapName: string) => {
    switch (mapName.toLowerCase()) {
      case "bind":
        return "from-[#2b1f14] via-[#1c1510] to-[#0a0705]";
      case "icebox":
        return "from-[#112433] via-[#0d1b26] to-[#050b10]";
      case "ascent":
        return "from-[#1a2536] via-[#101722] to-[#080b11]";
      case "haven":
        return "from-[#291f1a] via-[#1a1411] to-[#0a0807]";
      case "sunset":
        return "from-[#331c19] via-[#1f1110] to-[#0b0606]";
      case "lotus":
        return "from-[#162724] via-[#0e1a18] to-[#050c0b]";
      case "breeze":
        return "from-[#132c38] via-[#0c1c24] to-[#050c10]";
      case "split":
        return "from-[#221c29] via-[#141019] to-[#09070c]";
      case "abyss":
        return "from-[#0c1830] via-[#070f20] to-[#02050a]";
      default:
        return "from-[#171b26] via-[#0f121a] to-[#07090d]";
    }
  };

  const getStepBadge = (type: LineupStep["visualType"]) => {
    switch (type) {
      case "stand":
        return { label: "Vị Trí Đứng Chân", color: "bg-blue-500/20 text-blue-400 border-blue-500/40" };
      case "aim":
        return { label: "Điểm Căn HUD & Tâm Ngắm", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
      case "throw":
        return { label: "Lực Bắn & Thao Tác", color: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      case "land":
        return { label: "Vị Trí Rơi & Vùng Tác Động", color: "bg-rose-500/20 text-rose-400 border-rose-500/40" };
      default:
        return { label: "Hướng Dẫn", color: "bg-white/10 text-white border-white/20" };
    }
  };

  const stepBadge = getStepBadge(currentStep.visualType);

  return (
    <div 
      className={`bg-[#0a0a0e] border border-white/15 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-2 z-[999] max-h-[96vh] flex flex-col" : "relative mt-4"
      }`}
    >
      {/* Top Visualizer Control Bar */}
      <div className="bg-[#121218] px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              MÔ PHỎNG GÓC NHÌN IN-GAME VALORANT
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${stepBadge.color}`}>
                {stepBadge.label}
              </span>
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => { sound.playClick(); setViewMode("ingame"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "ingame" 
                ? "bg-emerald-600 text-white shadow-md" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Góc Nhìn In-Game</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setViewMode("zoom"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "zoom" 
                ? "bg-cyan-600 text-white shadow-md" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Soi Pixel x4</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setViewMode("minimap"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "minimap" 
                ? "bg-amber-600 text-white shadow-md" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Minimap 2D</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setViewMode("pro_tips"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "pro_tips" 
                ? "bg-purple-600 text-white shadow-md" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mẹo Pro</span>
          </button>

          {/* Toggle HUD Guides */}
          <button
            onClick={() => setShowHudGuides(!showHudGuides)}
            title={showHudGuides ? "Ẩn lưới chỉ dẫn HUD" : "Hiện lưới chỉ dẫn HUD"}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              showHudGuides ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
            title={isFullscreen ? "Thu nhỏ" : "Phóng to toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Viewport Stage (16:9 Valorant In-Game Aspect) */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[520px] bg-black overflow-hidden select-none">
        {/* ================= MODE 1: INGAME FULL HUD VIEW ================= */}
        {viewMode === "ingame" && (
          <div className="relative w-full h-full">
            {/* Background In-Game Environment (Actual Map Splash with atmospheric shader) */}
            <div className={`absolute inset-0 bg-gradient-to-t ${getMapThemeGradient(lineup.map)}`}>
              <img
                src={currentStep.inGameImage || lineup.mapSplash}
                alt={lineup.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = lineup.mapSplash;
                }}
                className="w-full h-full object-cover opacity-65 scale-105 filter contrast-125 brightness-90 transition-all duration-700"
              />
              {/* Vignette & Tactical Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]"></div>
              {showHudGuides && (
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00ffa3_1px,transparent_1px)] [background-size:24px_24px]"></div>
              )}
            </div>

            {/* ================= VALORANT INGAME HUD OVERLAYS ================= */}
            
            {/* Top Match Bar */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-1 rounded-b-xl border-b border-x border-white/15 text-xs font-mono shadow-xl z-10">
              <div className="text-emerald-400 font-bold">ATTACK 11</div>
              <div className="px-2 py-0.5 bg-rose-600 text-white font-bold rounded text-[11px] animate-pulse">
                {currentStep.visualType === "land" ? "SPIKE DETONATING" : "0:38"}
              </div>
              <div className="text-blue-400 font-bold">DEFEND 10</div>
            </div>

            {/* Top-Left Minimap Radar */}
            <div className="absolute top-3 left-3 w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-emerald-500/40 bg-black/85 backdrop-blur-md overflow-hidden shadow-2xl p-1 z-10 hidden sm:block">
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src={lineup.mapSplash} 
                  alt="Minimap" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-50 scale-150"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.7)_100%)]"></div>
                {/* Radar Sweep Circle */}
                <div className="absolute inset-0 border border-emerald-500/20 rounded-full"></div>
                {/* Player Wedge Arrow */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-cyan-400 shadow-md"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white"></div>
                </div>
                {/* Target Site Ping */}
                <div className="absolute top-6 right-7 w-4 h-4 rounded-full bg-rose-500 border border-white animate-ping"></div>
                <div className="absolute top-6 right-7 w-4 h-4 rounded-full bg-rose-500/80 flex items-center justify-center text-[8px] font-bold text-white">
                  {lineup.site}
                </div>
              </div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400 bg-black/80 px-1.5 rounded">
                {currentStep.callout}
              </div>
            </div>

            {/* Top-Right Callout & Pro Player Tag */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
              <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {lineup.map} • Site {lineup.site}
              </span>
              {lineup.proPlayer && (
                <span className="px-2.5 py-0.5 bg-amber-950/80 backdrop-blur-md border border-amber-500/40 rounded-lg text-[10px] font-bold text-amber-300 shadow-lg">
                  ★ Pro VCT: {lineup.proPlayer}
                </span>
              )}
            </div>

            {/* ================= DYNAMIC CROSSHAIR & AIM MARKER TARGET ================= */}
            <div 
              className="absolute transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              style={{ left: `${targetX}%`, top: `${targetY}%` }}
            >
              {/* Outer Pulsing Target Ring */}
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-emerald-400/80 animate-ping opacity-75"></div>
                <div className="absolute w-12 h-12 md:w-14 md:h-14 rounded-full border border-cyan-400/90 bg-cyan-500/10 backdrop-blur-[2px] flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  {/* Valorant Crosshair Reticle */}
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400"></div>
                  <div className="absolute top-0 bottom-0 w-[1.5px] bg-emerald-400/70"></div>
                  <div className="absolute left-0 right-0 h-[1.5px] bg-emerald-400/70"></div>
                </div>

                {/* Tactical Target Cue Tag */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-400/60 shadow-2xl flex flex-col items-center">
                  <span className="text-[11px] font-bold text-emerald-300 tracking-wide flex items-center gap-1">
                    🎯 {currentStep.targetPointLabel || lineup.visualHudAlignment.targetFeature}
                  </span>
                  {currentStep.hudElementHighlight && (
                    <span className="text-[10px] text-amber-300 font-mono">
                      Căn theo: {currentStep.hudElementHighlight}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Laser Line connecting HUD Element to Target if applicable */}
            {showHudGuides && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line 
                  x1={`${targetX}%`} 
                  y1={`${targetY}%`} 
                  x2="50%" 
                  y2="85%" 
                  stroke="#10b981" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  strokeOpacity="0.4"
                />
              </svg>
            )}

            {/* Bottom-Left Health & Armor HUD */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 flex items-center gap-3 text-xs font-mono z-10 hidden sm:flex">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Shield className="w-4 h-4" />
                <span>50</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="text-white font-bold text-sm">
                100 <span className="text-[10px] text-gray-400">HP</span>
              </div>
            </div>

            {/* Bottom-Center Agent Abilities Dock & Sova Charge Bar HUD */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
              {/* Sova Bow Charge Bar HUD if applicable */}
              {lineup.agent === "Sova" && (
                <div className="bg-black/90 backdrop-blur-md px-4 py-1.5 rounded-xl border border-cyan-500/40 flex items-center gap-3 shadow-xl">
                  <span className="text-[10px] font-bold text-cyan-300">LỰC KÉO CUNG:</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-8 h-2.5 rounded-sm border ${
                      lineup.powerBounce.includes("1") || lineup.powerBounce.includes("2") || lineup.powerBounce.includes("3") || lineup.powerBounce.includes("Full")
                        ? "bg-cyan-400 border-cyan-300 shadow-sm shadow-cyan-400"
                        : "bg-white/10 border-white/20"
                    }`}></div>
                    <div className={`w-8 h-2.5 rounded-sm border ${
                      lineup.powerBounce.includes("2") || lineup.powerBounce.includes("3") || lineup.powerBounce.includes("Full")
                        ? "bg-cyan-400 border-cyan-300 shadow-sm shadow-cyan-400"
                        : "bg-white/10 border-white/20"
                    }`}></div>
                    <div className={`w-8 h-2.5 rounded-sm border ${
                      lineup.powerBounce.includes("3") || lineup.powerBounce.includes("Full")
                        ? "bg-cyan-400 border-cyan-300 shadow-sm shadow-cyan-400"
                        : "bg-white/10 border-white/20"
                    }`}></div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {lineup.powerBounce}
                  </span>
                </div>
              )}

              {/* Ability Slots Dock */}
              <div className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 flex items-center gap-2 shadow-2xl">
                {(["C", "Q", "E", "X"] as const).map((key) => {
                  const isActive = lineup.abilityKey === key;
                  return (
                    <div
                      key={key}
                      className={`relative w-9 h-9 md:w-11 md:h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white border-2 border-emerald-400 shadow-lg shadow-emerald-500/40 scale-110"
                          : "bg-white/10 text-gray-400 border border-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold">{key}</span>
                      {isActive && (
                        <span className="absolute -top-2 px-1 bg-amber-400 text-black text-[8px] font-extrabold rounded">
                          LINEUP
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom-Right Ammo HUD */}
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs font-mono z-10 hidden sm:flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">25</span>
              <span className="text-gray-400">/ 75</span>
            </div>
          </div>
        )}

        {/* ================= MODE 2: PIXEL SCOPE / 4X MAGNIFIER ================= */}
        {viewMode === "zoom" && (
          <div className="relative w-full h-full bg-[#050608] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>

            {/* Magnifier Lens Container */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-cyan-400 bg-black overflow-hidden shadow-2xl shadow-cyan-500/20 flex items-center justify-center">
              <img
                src={currentStep.inGameImage || lineup.mapSplash}
                alt="Zoom view"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-[3.2] filter contrast-150 brightness-110"
                style={{
                  transformOrigin: `${targetX}% ${targetY}%`
                }}
              />
              
              {/* Precision Optical Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-cyan-400/60"></div>
                <div className="absolute h-full w-px bg-cyan-400/60"></div>
                <div className="w-8 h-8 rounded-full border border-emerald-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-md"></div>
                </div>
                {/* Measurement Tick Marks */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3 h-px bg-cyan-400"></div>
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-3 h-px bg-cyan-400"></div>
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-3 w-px bg-cyan-400"></div>
                <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-3 w-px bg-cyan-400"></div>
              </div>

              {/* Magnifier HUD text */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/85 px-3 py-0.5 rounded-full border border-cyan-400/50 text-[10px] font-mono text-cyan-300">
                ZOOM QUANG HỌC 4.0X
              </div>
            </div>

            {/* Side Explanatory Card */}
            <div className="absolute bottom-3 left-4 right-4 bg-black/90 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-500/30 flex items-start gap-3 text-xs">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Điểm Căn Pixel: {currentStep.pixelZoomDetails?.zoomTitle || currentStep.targetPointLabel || lineup.visualHudAlignment.targetFeature}
                </strong>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  {currentStep.pixelZoomDetails?.zoomDescription || currentStep.hudCue || "Căn chuẩn tâm hoặc mép HUD chạm chính xác vào điểm giao cắt pixel để đảm bảo tỷ lệ thành công 100%."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 3: 2D TACTICAL MINIMAP TRAJECTORY ================= */}
        {viewMode === "minimap" && (
          <div className="relative w-full h-full bg-[#0a0d14] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md h-full max-h-[380px] rounded-2xl border border-white/20 overflow-hidden bg-black/80 flex items-center justify-center">
              <img
                src={lineup.mapSplash}
                alt="Tactical Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60 filter contrast-125"
              />
              
              {/* Trajectory Vector SVG */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Start Player Position */}
                <circle cx="28%" cy="75%" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                {/* Animated Trajectory Curve */}
                <path
                  d="M 28% 75% Q 45% 25% 72% 38%"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                {/* Target Landing Impact Ring */}
                <circle cx="72%" cy="38%" r="18" fill="rgba(244,63,94,0.25)" stroke="#f43f5e" strokeWidth="2" />
                <circle cx="72%" cy="38%" r="6" fill="#f43f5e" />
              </svg>

              {/* Legend Badges */}
              <div className="absolute bottom-3 left-3 bg-black/90 p-2 rounded-xl border border-white/10 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                  <span>Vị trí đứng: <strong>{lineup.standingPos}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <span>Điểm rơi: <strong>{lineup.landingZone}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 4: PRO TIPS & KEYBINDS ================= */}
        {viewMode === "pro_tips" && (
          <div className="relative w-full h-full bg-[#0c0d12] p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-display tracking-wider text-base">
                <Sparkles className="w-5 h-5" />
                <span>MẸO THI ĐẤU & KINH NGHIỆM PRO VCT:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-amber-400 block mb-1">⚡ Thao Tác Di Chuyển:</span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {lineup.visualHudAlignment.movementNote || "Đứng yên tuyệt đối khi ra chiêu để giữ độ lệch tâm ngắm bằng 0."}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-cyan-400 block mb-1">⏱️ Thời Gian Tiếp Đất (Travel Time):</span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    Thời gian bay trung bình từ 4.5s - 6.0s. Hãy ra đòn ngay khi nghe âm thanh bắt đầu gỡ Spike.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">🎯 Đặt Spike Tương Ứng:</span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    Lineup này phát huy 100% hiệu quả khi đồng đội đặt Spike tại vị trí <strong>Site {lineup.site} Default</strong>.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-rose-400 block mb-1">🛡️ Phòng Bị Bị Flank:</span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    Nhờ đồng đội kê cổng móc hoặc đặt trap/sound sensor trước khi đứng căn lineup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Step Navigator Bar */}
      <div className="bg-[#111116] p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Step Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {lineup.steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                onStepChange(idx);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeStepIndex === idx
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                activeStepIndex === idx ? "bg-black text-emerald-400" : "bg-white/10 text-gray-300"
              }`}>
                {step.stepNumber}
              </span>
              <span>{step.title}</span>
            </button>
          ))}
        </div>

        {/* Current Step Summary Banner */}
        <div className="text-xs text-gray-300 flex items-center gap-2 bg-black/60 px-3.5 py-1.5 rounded-xl border border-white/5 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-emerald-400 font-bold">Bước {activeStepIndex + 1}/{lineup.steps.length}:</span>
          <span className="text-white truncate max-w-xs">{currentStep.callout}</span>
        </div>
      </div>
    </div>
  );
}
