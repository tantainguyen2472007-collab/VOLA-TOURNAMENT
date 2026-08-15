import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Plus, Calendar, Users, Settings } from "lucide-react";

const MOCK_TOURNAMENTS = [
  { id: "t1", name: "Valorant Champions Tour 2026", game: "Valorant", format: "Double Elimination", status: "Ongoing", teams: 16 },
  { id: "t2", name: "League of Legends Pro League", game: "LoL", format: "Round Robin", status: "Upcoming", teams: 8 },
  { id: "t3", name: "AOV International Championship", game: "AOV", format: "Single Elimination", status: "Upcoming", teams: 12 },
];

export function Tournaments() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Giải đấu</h1>
          <p className="text-gray-400 mt-2">Danh sách các giải đấu đang và sắp diễn ra</p>
        </div>
        <Link
          to="/tournaments/new"
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
        >
          <Plus className="w-5 h-5" />
          TẠO GIẢI ĐẤU MỚI
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TOURNAMENTS.map((t) => (
          <div key={t.id} className="bg-[#111] border border-[#222] hover:border-[#444] transition-colors rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                t.status === "Ongoing" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
              }`}>
                {t.status === "Ongoing" ? "ĐANG DIỄN RA" : "SẮP DIỄN RA"}
              </span>
            </div>
            
            <h3 className="font-bold text-xl mb-1 text-white">{t.name}</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">{t.game} • {t.format}</p>
            
            <div className="mt-auto flex items-center gap-4 text-sm text-gray-400 border-t border-[#222] pt-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {t.teams} Đội
              </div>
              <div className="flex items-center gap-1 ml-auto hover:text-white cursor-pointer transition-colors">
                <Settings className="w-4 h-4" />
                Cấu hình
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
