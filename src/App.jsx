import React from "react";
import Loginpage from "./pages/Loginpage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SpaceshipConsole from "./pages/Level1";
import Puzzle from "./pages/Level2";
import TalkingCharacterPage from "./pages/TalkingCharacterPage";

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<TalkingCharacterPage />} />
                    <Route path="/login" element={<Loginpage />} />
                    <Route path="/level1" element={<SpaceshipConsole />} />
                    <Route path="/level2" element={<Puzzle /> } />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
