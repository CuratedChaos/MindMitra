import { Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import Games from "@/pages/Games";
import Chat from "@/pages/Chat";
import MoodTracker from "@/pages/MoodTracker";
import Goals from "@/pages/Goals";
import Profile from "@/pages/Profile";
import Emergency from "@/pages/Emergency";
import MusicTherapy from "@/pages/MusicTherapy";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/mood" element={<MoodTracker />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/music" element={<MusicTherapy />} />
    </Routes>
  );
}
