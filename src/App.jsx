import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EventComments from "./pages/EventComments/EventComments";

import "./App.css";

function App() {
  return (
    <Router basename="/">
      <div className="app-layout">
        <Navbar />

        <div className="content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/event/:id/comments" element={<EventComments />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
