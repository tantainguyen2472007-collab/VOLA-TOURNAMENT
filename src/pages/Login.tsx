import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const [mode, setMode] = useState<"login" | "register" | "guest">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAnonymously } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else if (mode === "register") {
        await signUp(email, password, displayName || "Player");
      } else {
        await signInAnonymously(displayName || "Guest");
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-700 rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-500/30">
              V
            </div>
            <span className="font-bold text-3xl text-white tracking-widest font-display">VOLA</span>
          </div>
          <p className="text-neutral-400 text-sm">Nền tảng chiến thuật & quản lý giải đấu Valorant</p>
        </div>

        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-2xl p-6 shadow-2xl">
          {/* Mode tabs */}
          <div className="flex gap-1 mb-6 bg-[#161616] rounded-lg p-1 border border-white/5">
            {([
              ["login", "ĐĂNG NHẬP"],
              ["register", "ĐĂNG KÝ"],
              ["guest", "KHÁCH"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  mode === key
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== "login" && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="VD: ProGamer123"
                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            )}

            {mode !== "guest" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                    required
                    minLength={6}
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-red-400 text-sm bg-red-950/40 border border-red-500/30 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(239,68,68,0.35)]"
            >
              {loading
                ? "ĐANG XỬ LÝ..."
                : mode === "login"
                ? "ĐĂNG NHẬP"
                : mode === "register"
                ? "TẠO TÀI KHOẢN"
                : "VÀO VỚI TƯ CÁCH KHÁCH"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
