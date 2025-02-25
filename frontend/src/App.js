import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Authentication/Home";
import News from "./pages/Authentication/News.js"
import About from "./pages/Authentication/About"

import Workspace from "./pages/Workspaces/Workspace";
import CreateWorkspace from "./pages/Workspaces/CreateWorkspace";
import ViewWorkspace from "./pages/Workspaces/ViewWorkspace";

import WorkspaceChat from "./pages/WorkspaceChat/WorkspaceChat"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/News" element={<News />} />


                <Route path="/Workspace" element={<Workspace />} />
                <Route path="/createWorkspace" element={<CreateWorkspace />} />
                <Route path="/viewWorkspace" element={<ViewWorkspace />} />


                <Route path="/workspaceChat/:id" element={<WorkspaceChat />} />

            </Routes>
        </Router>
    );
}


export default App;
