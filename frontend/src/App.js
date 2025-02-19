import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Authentication/Home";
import Workspace from "./pages/Workspaces/Workspace";
import News from "./pages/Authentication/News.js"
import About from "./pages/Authentication/About"
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/News" element={<News />} />


                <Route path="/Workspace" element={<Workspace />} />
            </Routes>
        </Router>
    );
}

export default App;
