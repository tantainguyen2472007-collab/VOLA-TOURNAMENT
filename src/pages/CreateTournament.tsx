import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Settings2, ShieldAlert } from "lucide-react";

export function CreateTournament() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    game: "Valorant",
    format: "Single Elimination",
    winPoints: 3,
    lossPoints: 0,
    drawPoints: 1,
    bonus20: 3,
    bonus21: 2,
    tiebreaker1: "head-to-head",
    tiebreaker2: "round-diff",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Mock save
    alert("Đã tạo giải đấu thành công với cấu hình:\n" + JSON.stringify(formData, null, 2));
    navigate("/tournaments");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/tournaments" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tạo Giải Đấu Mới</h1>
          <p className="text-gray-400 mt-2">Thiết lập thông tin chung, thể thức và luật tính điểm</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
        >
          <Save className="w-5 h-5" />
          LƯU GIẢI ĐẤU
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông tin cơ bản */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-yellow-500" />
              Thông tin chung & Thể thức
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tên giải đấu</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: VCT Pacific 2026..." 
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tựa Game</label>
                  <select 
                    name="game"
                    value={formData.game}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  >
                    <option value="Valorant">Valorant</option>
                    <option value="LoL">Liên Minh Huyền Thoại</option>
                    <option value="AOV">Liên Quân Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Thể thức thi đấu (Module)</label>
                  <select 
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  >
                    <option value="Single Elimination">Loại trực tiếp (Single Elim)</option>
                    <option value="Double Elimination">Nhánh Thắng/Thua (Double Elim)</option>
                    <option value="Round Robin">Vòng Tròn (Round Robin)</option>
                    <option value="Swiss">Hệ Thống Thụy Sĩ (Swiss)</option>
                    <option value="Premier League">Bảng Điểm Xếp Hạng (Premier League)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-500" />
              Scoring Rules Engine (Cấu hình tính điểm JSON)
            </h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Điểm Thắng</label>
                <input type="number" name="winPoints" value={formData.winPoints} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2 text-white text-center font-bold focus:border-yellow-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Điểm Hòa</label>
                <input type="number" name="drawPoints" value={formData.drawPoints} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2 text-white text-center font-bold focus:border-yellow-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Điểm Thua</label>
                <input type="number" name="lossPoints" value={formData.lossPoints} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2 text-white text-center font-bold focus:border-yellow-500 focus:outline-none" />
              </div>
            </div>

            <div className="p-4 bg-[#1A1A1A] border border-[#333] rounded-lg mb-6">
              <p className="text-sm font-bold text-white mb-3">Hệ số thưởng (Map Score Bonus) - Dành cho BO3/BO5</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Thắng 2-0 / 3-0:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">+</span>
                    <input type="number" name="bonus20" value={formData.bonus20} onChange={handleChange} className="w-16 bg-[#222] border border-[#444] rounded px-2 py-1 text-white text-center focus:border-yellow-500 focus:outline-none" />
                    <span className="text-xs text-gray-500">điểm</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Thắng 2-1 / 3-1:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">+</span>
                    <input type="number" name="bonus21" value={formData.bonus21} onChange={handleChange} className="w-16 bg-[#222] border border-[#444] rounded px-2 py-1 text-white text-center focus:border-yellow-500 focus:outline-none" />
                    <span className="text-xs text-gray-500">điểm</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-white mb-3">Ưu tiên Tiebreaker (Xếp hạng khi bằng điểm)</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded bg-[#222] text-gray-400 flex items-center justify-center text-xs font-bold">1</span>
                  <select name="tiebreaker1" value={formData.tiebreaker1} onChange={handleChange} className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                    <option value="head-to-head">Hiệu số đối đầu (Head-to-head)</option>
                    <option value="round-diff">Hiệu số vòng/game (Round/Game Diff)</option>
                    <option value="total-wins">Tổng số round thắng</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded bg-[#222] text-gray-400 flex items-center justify-center text-xs font-bold">2</span>
                  <select name="tiebreaker2" value={formData.tiebreaker2} onChange={handleChange} className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                    <option value="round-diff">Hiệu số vòng/game (Round/Game Diff)</option>
                    <option value="head-to-head">Hiệu số đối đầu (Head-to-head)</option>
                    <option value="total-wins">Tổng số round thắng</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded bg-[#222] text-gray-400 flex items-center justify-center text-xs font-bold">3</span>
                  <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2 text-sm text-gray-500">
                    Trận Tiebreaker / Bốc thăm
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Cột Preview Config JSON */}
        <div>
          <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-4 sticky top-6">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Generated JSON Config</h3>
            <pre className="text-xs text-[#00E5FF] font-mono overflow-x-auto whitespace-pre-wrap">
{`{
  "win_points": ${formData.winPoints},
  "loss_points": ${formData.lossPoints},
  "draw_points": ${formData.drawPoints},
  "map_score_bonus": {
    "2-0": ${formData.bonus20},
    "2-1": ${formData.bonus21}
  },
  "game_specific_metric": "round_diff",
  "tiebreakers": [
    "${formData.tiebreaker1}",
    "${formData.tiebreaker2}",
    "tiebreaker_match"
  ]
}`}
            </pre>
            <p className="text-xs text-gray-500 mt-4 italic">
              * Cấu hình này sẽ được lưu trữ vào hệ thống và áp dụng tự động lên bảng xếp hạng (Leaderboard) sau mỗi trận đấu kết thúc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
