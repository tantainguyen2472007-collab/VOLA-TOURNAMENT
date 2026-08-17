import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Play, 
  Trophy, 
  Users, 
  Calendar, 
  Plus, 
  ExternalLink, 
  Dices,
  Moon,
  Crosshair,
  Target,
  Calculator,
  Award,
  Palette,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

interface RoomData {
  id: string;
  name: string;
  team_a_name: string;
  team_b_name: string;
  game: string;
  created_at: string;
}

const TOURNAMENTS = [
  { id: "t1", name: "Valorant Champions Tour 2026", status: "Ongoing", teams: 16 },
  { id: "t2", name: "League of Legends Pro League", status: "Upcoming", teams: 8 },
  { id: "t3", name: "AOV International Championship", status: "Upcoming", teams: 12 },
];

export function Dashboard() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      if (!user) return;
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setRooms(data);
      }
      setLoading(false);
    }
    fetchRooms();
  }, [user]);

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display text-white uppercase tracking-widest">BẢNG ĐIỀU KHIỂN</h1>
          <p className="text-xs text-gray-400 mt-1">Hệ thống phân tích, cấm chọn và công cụ chiến thuật chuyên sâu</p>
        </div>
        <Link
          to="/lobby"
          className="px-6 py-3 bg-accent text-black font-display tracking-widest text-sm rounded-full hover:bg-yellow-400 transition-colors uppercase shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          TẠO TRẬN ĐẤU MỚI
        </Link>
      </div>

      {/* Quick Tools Navigation Grid */}
      <div className="mb-12">
        <h2 className="text-xs font-bold tracking-widest mb-4 flex items-center gap-2 text-gray-400 uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          CÔNG CỤ CHIẾN THUẬT & TRẢI NGHIỆM VALORANT
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pro Settings */}
          <Link
            to="/pro-settings"
            className="bg-gradient-to-br from-[#121212] to-black border border-white/10 hover:border-rose-500/50 p-5 rounded-2xl transition-all duration-300 group hover:shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Crosshair className="w-5 h-5" />
              </div>
              <h3 className="font-display tracking-wider text-base text-white group-hover:text-rose-400 transition-colors">
                PRO SETTINGS & TÂM NGẮM
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Cài đặt chuột, gear thi đấu và 1-click copy mã tâm ngắm của các siêu sao VCT (TenZ, aspas, ZmjjKK,...).
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-rose-400 gap-1">
              Khám phá ngay <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Map Setups */}
          <Link
            to="/setups"
            className="bg-gradient-to-br from-[#121212] to-black border border-white/10 hover:border-emerald-500/50 p-5 rounded-2xl transition-all duration-300 group hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-display tracking-wider text-base text-white group-hover:text-emerald-400 transition-colors">
                SỔ TAY GÓC KÊ & SETUPS
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Góc bắn tên Sova, ném độc Viper, Incendiary Brimstone và bẫy thần Cypher theo từng Bombsite A/B/C.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 gap-1">
              Xem chi tiết <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Economy Calculator */}
          <Link
            to="/economy"
            className="bg-gradient-to-br from-[#121212] to-black border border-white/10 hover:border-cyan-500/50 p-5 rounded-2xl transition-all duration-300 group hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-display tracking-wider text-base text-white group-hover:text-cyan-400 transition-colors">
                KINH TẾ & BUY CALCULATOR
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Bộ đếm tiền chuẩn xác theo Loss Streak, gợi ý chiến thuật Full Buy / Save và tính toán Drop súng toàn đội.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-cyan-400 gap-1">
              Tính toán ngay <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Night Market & Shop */}
          <Link
            to="/night-market"
            className="bg-gradient-to-br from-[#121212] to-black border border-white/10 hover:border-purple-500/50 p-5 rounded-2xl transition-all duration-300 group hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="font-display tracking-wider text-base text-white group-hover:text-purple-400 transition-colors">
                CHỢ ĐÊM & SHOP SIMULATOR
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Thử vận may lật 6 thẻ bài Chợ Đêm giảm giá sốc, quay vòng 4 món hàng ngày và tính toán Wishlist cá nhân.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-purple-400 gap-1">
              Mở thẻ Chợ Đêm <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Meta Tier List */}
          <Link
            to="/tierlist"
            className="bg-gradient-to-br from-[#121212] to-black border border-white/10 hover:border-amber-500/50 p-5 rounded-2xl transition-all duration-300 group hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display tracking-wider text-base text-white group-hover:text-amber-400 transition-colors">
                META TIER LIST ĐẶC VỤ
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Phân hạng S/A/B/C theo Winrate, Pickrate và từng bản đồ thi đấu kèm tính năng tự tạo Tier List cá nhân.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-400 gap-1">
              Xem bảng xếp hạng <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Weapon Skins Hub */}
          <Link
            to="/skins"
            className="bg-gradient-to-br from-[#121212] to-black border border-white/10 hover:border-white/40 p-5 rounded-2xl transition-all duration-300 group hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-display tracking-wider text-base text-white transition-colors">
                KHO SKIN VŨ KHÍ CAO CẤP
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Kho dữ liệu hơn 640+ skin bậc Tím, Cam, Vàng kim với thông tin bundle và tuyển thủ thi đấu.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-gray-300 gap-1">
              Xem kho skin <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Live Matches Section */}
      <div className="mb-12">
        <h2 className="text-sm font-bold tracking-widest mb-4 flex items-center gap-2 text-danger uppercase">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_8px_rgba(255,70,85,0.8)]"></span>
          PHÒNG DRAFT ĐANG HOẠT ĐỘNG
        </h2>

        {loading ? (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 flex items-center justify-center animate-pulse">
            <p className="text-white/40 tracking-widest font-bold uppercase text-xs">Đang tải dữ liệu...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <Dices className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-xl font-display text-white uppercase tracking-widest mb-2">Chưa có trận đấu nào</h3>
            <p className="text-white/40 text-sm tracking-wide mb-6">Hãy tạo một phòng Draft mới để bắt đầu ban pick.</p>
            <Link
              to="/lobby"
              className="px-6 py-2 border border-white/20 text-white font-display tracking-widest text-xs rounded-full hover:bg-white/10 transition-colors uppercase"
            >
              Tạo phòng ngay
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rooms.map(room => (
              <div key={room.id} className="bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-accent tracking-widest uppercase mb-1">{room.game}</span>
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-display text-primary uppercase">{room.team_a_name}</span>
                    <span className="text-white/20 font-bold text-sm italic">VS</span>
                    <span className="text-2xl font-display text-danger uppercase">{room.team_b_name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={`/overlay/draft/${room.id}`}
                    target="_blank"
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 border border-white/5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    OBS OVERLAY
                  </a>
                  <Link
                    to={`/draft/${room.id}`}
                    className="px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-full font-bold text-xs uppercase tracking-widest transition-colors shadow-lg"
                  >
                    VÀO PHÒNG
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tournaments Grid */}
      <h2 className="text-sm font-bold tracking-widest mb-6 text-white uppercase flex items-center justify-between">
        <span>Giải đấu & Bracket System</span>
        <Link to="/bracket" className="text-accent hover:text-yellow-400 underline underline-offset-4 font-display">Tới Bracket Engine</Link>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOURNAMENTS.map((t) => (
          <div key={t.id} className="bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-8 group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors relative z-10">
              <Trophy className="w-5 h-5 text-white/40 group-hover:text-accent transition-colors" />
            </div>
            <h3 className="font-display text-xl mb-4 text-white uppercase tracking-wide relative z-10">{t.name}</h3>
            <div className="flex items-center gap-6 text-xs text-white/40 font-bold uppercase tracking-widest mt-4 relative z-10">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                {t.teams} Đội
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {t.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
