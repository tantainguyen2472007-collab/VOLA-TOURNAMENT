import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Palette, 
  Crosshair, 
  Target, 
  Calculator, 
  Award, 
  Sparkles, 
  Trophy, 
  LayoutTemplate, 
  Swords, 
  LogOut 
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", href: "/" },
  { icon: Palette, label: "SKIN", href: "/skins" },
  { icon: Crosshair, label: "PRO SETTINGS", href: "/pro-settings" },
  { icon: Target, label: "GÓC KÊ & SETUPS", href: "/setups" },
  { icon: Calculator, label: "KINH TẾ & BUY", href: "/economy" },
  { icon: Award, label: "META TIER LIST", href: "/tierlist" },
  { icon: Sparkles, label: "LINEUP ĐỘI HÌNH", href: "/lineup" },
  { icon: Trophy, label: "GIẢI ĐẤU", href: "/tournaments" },
  { icon: LayoutTemplate, label: "BRACKET", href: "/bracket" },
  { icon: Swords, label: "PHÒNG DRAFT", href: "/lobby" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#080808] border-r border-red-500/10 min-h-screen flex flex-col justify-between py-8">
      <div>
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-700 rounded-lg flex items-center justify-center font-display text-2xl text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/30">
            V
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl text-white tracking-widest leading-none">VOLA</span>
            <span className="text-[9px] text-red-400/90 font-bold tracking-widest uppercase mt-0.5">TACTICAL PLATFORM</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-red-950/40 text-white border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-red-500" : "text-neutral-500")} />
                <span className="tracking-wider text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-6 space-y-4">
        {profile && (
          <div className="text-sm p-3 rounded-lg bg-neutral-900/60 border border-white/5">
            <p className="text-white font-medium truncate">{profile.display_name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-neutral-400 text-xs">Online</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-neutral-400 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest px-2"
        >
          <LogOut className="w-4 h-4" />
          ĐĂNG XUẤT
        </button>
      </div>
    </aside>
  );
}
