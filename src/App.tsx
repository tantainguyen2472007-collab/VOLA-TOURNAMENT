import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./lib/auth";
import { useAuthProvider } from "./hooks/useAuth";
import { AuthGuard } from "./components/AuthGuard";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { DraftRoom } from "./pages/DraftRoom";
import { DraftLobby } from "./pages/DraftLobby";
import { Dashboard } from "./pages/Dashboard";
import { LiveMatch } from "./pages/LiveMatch";
import { Bracket } from "./pages/Bracket";
import { Tournaments } from "./pages/Tournaments";
import { CreateTournament } from "./pages/CreateTournament";
import { MapVetoRoom } from "./pages/MapVetoRoom";
import { MapVetoOverlayPage } from "./pages/overlay/MapVetoOverlayPage";
import { ScoreboardOverlayPage } from "./pages/overlay/ScoreboardOverlayPage";

export default function App() {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <Routes>
          <Route path="/overlay/map-veto/:roomId" element={<MapVetoOverlayPage />} />
          <Route path="/overlay/scoreboard/:roomId" element={<ScoreboardOverlayPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected with sidebar layout */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="lobby" element={<DraftLobby />} />
            <Route path="draft" element={<DraftRoom />} />
            <Route path="draft/:roomId" element={<DraftRoom />} />
            <Route path="map-veto/:roomId" element={<MapVetoRoom />} />
            <Route path="bracket" element={<Bracket />} />
            <Route path="tournaments" element={<Tournaments />} />
            <Route path="tournaments/new" element={<CreateTournament />} />
            <Route path="*" element={<div className="p-8 text-gray-400">Đang phát triển...</div>} />
          </Route>

          {/* LiveMatch: full screen, no sidebar */}
          <Route path="/live/:matchId" element={<LiveMatch />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
