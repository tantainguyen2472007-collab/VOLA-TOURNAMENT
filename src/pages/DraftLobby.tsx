import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Play, Users, Check } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import type { Room } from "../types";

export function DraftLobby() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");
  const [roomName, setRoomName] = useState("");
  const [createdRoom, setCreatedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);

    // 1. Create room
    const { data: room, error: roomErr } = await supabase
      .from("rooms")
      .insert({
        name: roomName || `${teamA} vs ${teamB}`,
        team_a_name: teamA,
        team_b_name: teamB,
        game: "Valorant",
        created_by: user.id,
      })
      .select()
      .single();

    if (roomErr || !room) {
      alert("Lỗi tạo phòng: " + (roomErr?.message ?? "Unknown"));
      setLoading(false);
      return;
    }

    // 2. Insert creator as admin participant
    await supabase.from("room_participants").insert({
      room_id: room.id,
      user_id: user.id,
      role: "admin",
    });

    // 3. Create 10 draft slots (5 per team)
    const slots = Array.from({ length: 10 }).map((_, i) => ({
      room_id: room.id,
      team_id: i < 5 ? "team_a" : "team_b",
      player_index: i % 5,
      status: i === 0 ? "picking" : "waiting",
    }));

    await supabase.from("draft_slots").insert(slots);

    setCreatedRoom(room as Room);
    setLoading(false);
  };

  const getShareUrl = (role: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}#/draft/${createdRoom?.id}?role=${role}`;
  };

  const copyUrl = (role: string) => {
    navigator.clipboard.writeText(getShareUrl(role));
    setCopied(role);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Tạo Phòng Draft</h1>
      <p className="text-gray-400 mb-8">Tạo phòng mới và chia sẻ link cho các đội</p>

      {!createdRoom ? (
        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tên phòng (tuỳ chọn)</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="VD: Bán kết VCT 2026..."
              className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Đội A</label>
              <input
                type="text"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-4 py-2.5 text-red-400 font-bold focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Đội B</label>
              <input
                type="text"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-4 py-2.5 text-[#FF4655] font-bold focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading || !teamA || !teamB}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.35)] border border-red-500/30"
          >
            <Play className="w-5 h-5 fill-current" />
            {loading ? "ĐANG TẠO..." : "TẠO PHÒNG DRAFT"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#0e0e0e] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">Phòng đã tạo thành công!</h2>
            <p className="text-gray-400 text-sm mb-6">
              {createdRoom.team_a_name} vs {createdRoom.team_b_name}
            </p>

            <h3 className="text-sm font-bold text-gray-300 mb-3">CHIA SẺ LINK CHO TỪNG VAI TRÒ</h3>
            <div className="space-y-3">
              {([
                ["captain_a", `ĐỘI TRƯỞNG ${createdRoom.team_a_name}`, "text-red-400"],
                ["captain_b", `ĐỘI TRƯỞNG ${createdRoom.team_b_name}`, "text-[#FF4655]"],
                ["caster", "CASTER / BTV", "text-red-500"],
                ["viewer", "KHÁN GIẢ (Chỉ xem)", "text-gray-400"],
              ] as const).map(([role, label, color]) => (
                <div key={role} className="flex items-center gap-3 bg-[#161616] border border-neutral-800 rounded-lg px-4 py-3">
                  <Users className={`w-4 h-4 ${color}`} />
                  <span className={`text-sm font-bold ${color} flex-shrink-0`}>{label}</span>
                  <code className="flex-1 text-xs text-gray-500 truncate">{getShareUrl(role)}</code>
                  <button
                    onClick={() => copyUrl(role)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded text-xs text-gray-300 transition-colors"
                  >
                    {copied === role ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    {copied === role ? "ĐÃ SAO" : "SAO CHÉP"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate(`/draft/${createdRoom.id}?role=admin`)}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(239,68,68,0.35)] border border-red-500/30"
          >
            <Play className="w-6 h-6 fill-current" />
            VÀO PHÒNG DRAFT (ADMIN)
          </button>
        </div>
      )}
    </div>
  );
}
