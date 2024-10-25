import React from "react";
import './styles/App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { DashboardLayout } from "./pages/DashboardLayout";
import { ComingSoon } from "./pages/ComingSoon";
import TwitchEventTestsPage from "./testPages/pages/TwitchEventTestsPage";
import { SlideshowBrowserSource } from "./components/browserSources/SlideshowBrowserSource";
import { AlertsBrowserSource } from "./components/browserSources/AlertsBrowserSource";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coming_soon" element={<ComingSoon />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/slideshow/:hash" element={<SlideshowBrowserSource />} />
        <Route path="/alerts/:hash" element={<AlertsBrowserSource />} />
        <Route path="/test" element={<TwitchEventTestsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
