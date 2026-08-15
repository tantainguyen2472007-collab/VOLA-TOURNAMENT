# ESP Tournament Platform

A real-time eSports tournament management platform designed for competitive gaming events. Features built-in Ban/Pick Draft logic, Bracket generation, and League configurations. 

This project currently provides a beautiful MVP focusing on the Draft/Ban-Pick system for Valorant. 

## 🚀 Features
- **Real-Time Draft System**: Specialized "Role Selection & Randomizer" for Valorant, with built-in timers and turn logic.
- **Tournament Config Engine**: JSON-based scoring system (support for multiple formats: BO1, BO3, BO5).
- **Caster Overlay**: Dark-themed, high-contrast UI designed to be cleanly embedded via OBS / Streamlabs Browser Source.
- **Role-Based Access**: Structure ready for Admin, Captain, Player, and Viewer RBAC.

## 📦 Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 🛠️ Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Copy `.env.example` to `.env` and configure any specific keys.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   *The application will be accessible at http://localhost:3000*

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📜 Roadmap (Phase 2)
- **Firebase Integration**: The architecture is designed to integrate seamlessly with Firestore `onSnapshot` for multi-user sync across the draft room and bracket updates.
- **Live Match Bracket**: Full double/single elimination visualization.
- **YouTube Livestream Embeds**: Native integration for watching streams directly in the app alongside live chat.

## 📄 License
This project is licensed under the MIT License.
