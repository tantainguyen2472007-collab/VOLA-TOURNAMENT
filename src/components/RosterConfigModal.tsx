import { useState } from "react";
import { TeamProfile, PlayerProfile } from "../types";
import { Users, Shield, Award, Edit3, X, Check, Camera } from "lucide-react";
import { cn } from "../lib/utils";
import { playUiClick, playLockInSound } from "../lib/soundEngine";

interface RosterConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamA: TeamProfile;
  teamB: TeamProfile;
  onSave: (teamA: TeamProfile, teamB: TeamProfile) => void;
}

const DEFAULT_ROLES = [
  "Main Duelist",
  "IGL / Sentinel",
  "Controller / Smoker",
  "Initiator / Recon",
  "Flex / Second Duelist",
  "Mid Laner",
  "ADC / Marksman",
  "Main AWPer",
];

export function RosterConfigModal({ isOpen, onClose, teamA, teamB, onSave }: RosterConfigModalProps) {
  const [activeTeam, setActiveTeam] = useState<"team_a" | "team_b">("team_a");
  const [localTeamA, setLocalTeamA] = useState<TeamProfile>(teamA);
  const [localTeamB, setLocalTeamB] = useState<TeamProfile>(teamB);

  if (!isOpen) return null;

  const currentTeam = activeTeam === "team_a" ? localTeamA : localTeamB;
  const setTeam = (updater: (prev: TeamProfile) => TeamProfile) => {
    if (activeTeam === "team_a") {
      setLocalTeamA(updater);
    } else {
      setLocalTeamB(updater);
    }
  };

  const handleUpdatePlayer = (index: number, field: keyof PlayerProfile, value: string) => {
    setTeam((prev) => {
      const players = [...prev.players];
      players[index] = { ...players[index], [field]: value };
      return { ...prev, players };
    });
  };

  const handleSave = () => {
    playLockInSound();
    onSave(localTeamA, localTeamB);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f0f0f] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-accent" />
            <div>
              <h2 className="text-xl font-display uppercase tracking-widest text-white">
                Quản Lý Đội Hình Tuyển Thủ (Roster Profiles)
              </h2>
              <p className="text-xs text-white/40">
                Tùy chỉnh 5 tuyển thủ, Avatar, Nickname ingame, Vai trò sở trường và Logo chính thức của đội.
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

        {/* Team Selector Tabs */}
        <div className="px-6 pt-4 flex gap-3 border-b border-white/10">
          <button
            onClick={() => {
              playUiClick();
              setActiveTeam("team_a");
            }}
            className={cn(
              "px-5 py-2.5 font-display text-xs uppercase tracking-widest rounded-t-xl transition-all border-t-2",
              activeTeam === "team_a"
                ? "bg-primary/10 text-primary border-primary font-bold"
                : "text-white/40 hover:text-white border-transparent"
            )}
          >
            ĐỘI A: {localTeamA.name}
          </button>
          <button
            onClick={() => {
              playUiClick();
              setActiveTeam("team_b");
            }}
            className={cn(
              "px-5 py-2.5 font-display text-xs uppercase tracking-widest rounded-t-xl transition-all border-t-2",
              activeTeam === "team_b"
                ? "bg-danger/10 text-danger border-danger font-bold"
                : "text-white/40 hover:text-white border-transparent"
            )}
          >
            ĐỘI B: {localTeamB.name}
          </button>
        </div>

        {/* Team Details & 5 Players */}
        <div className="p-6 space-y-6">
          {/* Team Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">
                Tên Đội Tuyển
              </label>
              <input
                type="text"
                value={currentTeam.name}
                onChange={(e) => setTeam((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-white font-display text-sm focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">
                Viết Tắt (Tag)
              </label>
              <input
                type="text"
                value={currentTeam.tag}
                onChange={(e) => setTeam((prev) => ({ ...prev, tag: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-white font-display text-sm focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">
                URL Logo Đội Tuyển
              </label>
              <input
                type="text"
                value={currentTeam.logo}
                onChange={(e) => setTeam((prev) => ({ ...prev, logo: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:border-accent outline-none font-mono"
              />
            </div>
          </div>

          {/* 5 Roster Slots */}
          <div>
            <h3 className="text-xs font-display text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> Danh Sách 5 Thành Viên Chính Thức
            </h3>

            <div className="space-y-3">
              {currentTeam.players.map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-white/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-display text-xs text-white/50 flex-shrink-0">
                    #{idx + 1}
                  </div>

                  {/* Avatar preview & URL */}
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                    <img src={player.avatar} alt={player.nickname} className="w-full h-full object-cover" />
                  </div>

                  {/* Nickname */}
                  <div className="flex-1 w-full md:w-auto">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-wider block mb-1">
                      Nickname In-Game
                    </label>
                    <input
                      type="text"
                      value={player.nickname}
                      onChange={(e) => handleUpdatePlayer(idx, "nickname", e.target.value)}
                      className="w-full px-3 py-1.5 bg-black border border-white/15 rounded-lg text-white font-display text-sm focus:border-accent outline-none"
                    />
                  </div>

                  {/* Role */}
                  <div className="w-full md:w-52">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-wider block mb-1">
                      Vị Trí Sở Trường
                    </label>
                    <input
                      type="text"
                      list={`roles-list-${idx}`}
                      value={player.mainRole}
                      onChange={(e) => handleUpdatePlayer(idx, "mainRole", e.target.value)}
                      className="w-full px-3 py-1.5 bg-black border border-white/15 rounded-lg text-white text-xs focus:border-accent outline-none"
                    />
                    <datalist id={`roles-list-${idx}`}>
                      {DEFAULT_ROLES.map((r) => (
                        <option key={r} value={r} />
                      ))}
                    </datalist>
                  </div>

                  {/* Avatar URL */}
                  <div className="w-full md:w-60">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-wider block mb-1">
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      value={player.avatar}
                      onChange={(e) => handleUpdatePlayer(idx, "avatar", e.target.value)}
                      className="w-full px-3 py-1.5 bg-black border border-white/15 rounded-lg text-white/60 text-[11px] focus:border-accent outline-none font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3 bg-black/40">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-widest bg-accent hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Lưu Hồ Sơ Đội Hình
          </button>
        </div>
      </div>
    </div>
  );
}
