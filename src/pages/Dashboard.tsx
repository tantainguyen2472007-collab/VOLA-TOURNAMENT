import { Link } from "react-router-dom";
import { Play, Trophy, Users, Calendar } from "lucide-react";

const LIVE_MATCH = {
  id: "m1",
  team1: "DAMIT2K",
  team2: "LAYLA2K4",
  game: "Valorant",
  viewers: 1245,
  status: "Drafting",
};

const TOURNAMENTS = [
  { id: "t1", name: "Valorant Champions Tour 2026", status: "Ongoing", teams: 16 },
  { id: "t2", name: "League of Legends Pro League", status: "Upcoming", teams: 8 },
  { id: "t3", name: "AOV International Championship", status: "Upcoming", teams: 12 },
];

export function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Tổng quan</h1>

      {/* Live Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          ĐANG DIỄN RA
        </h2>
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#00E5FF]">{LIVE_MATCH.team1}</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-gray-500 text-sm mb-1">BO3 • {LIVE_MATCH.game}</span>
              <span className="text-3xl font-bold text-white">VS</span>
              <span className="text-yellow-500 text-xs mt-2 animate-pulse">{LIVE_MATCH.status}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#FF4655]">{LIVE_MATCH.team2}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              to="/draft"
              className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded-lg font-bold text-sm transition-colors"
            >
              VÀO PHÒNG DRAFT
            </Link>
            <Link
              to="/live/m1"
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <Play className="w-4 h-4 fill-current" />
              XEM LIVESTREAM ({LIVE_MATCH.viewers})
            </Link>
          </div>
        </div>
      </div>

      {/* Tournaments Grid */}
      <h2 className="text-xl font-bold mb-4 text-white">Giải đấu</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOURNAMENTS.map((t) => (
          <div key={t.id} className="bg-[#111] border border-[#222] hover:border-[#444] transition-colors rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">{t.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {t.teams} Đội
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {t.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
