/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DraftRoom } from './pages/DraftRoom';
import { Dashboard } from './pages/Dashboard';
import { LiveMatch } from './pages/LiveMatch';
import { Bracket } from './pages/Bracket';
import { Tournaments } from './pages/Tournaments';
import { CreateTournament } from './pages/CreateTournament';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="draft" element={<DraftRoom />} />
          <Route path="bracket" element={<Bracket />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="tournaments/new" element={<CreateTournament />} />
          {/* Add placeholders for other routes */}
          <Route path="*" element={<div className="p-8 text-gray-400">Đang phát triển...</div>} />
        </Route>
        {/* LiveMatch doesn't use the standard sidebar layout since it's full screen */}
        <Route path="/live/:matchId" element={<LiveMatch />} />
      </Routes>
    </BrowserRouter>
  );
}


