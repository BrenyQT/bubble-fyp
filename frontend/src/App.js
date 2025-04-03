import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Authentication/Home";
import News from "./pages/Authentication/News.js"
import About from "./pages/Authentication/About"

import Workspace from "./pages/Workspaces/Workspace";
import CreateWorkspace from "./pages/Workspaces/CreateWorkspace";
import ViewWorkspace from "./pages/Workspaces/ViewWorkspace";

import WorkspaceChat from "./pages/WorkspaceChat/WorkspaceChat"
import KanbanBoard from "./pages/KanbanBoard/KanbanBoard";
import WorkspaceDashboard from "./pages/WorkspaceDashboard/WorkspaceDashboard";
import BacklogPage from "./pages/BacklogManagment/Backlog";
import CompletedSprints from "./pages/CompletedSprints/CompletedSprints";
import GanttChart from "./pages/GantChart/GanttChart";
import SprintList from "./pages/SprintBacklog/SprintList";


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

                <Route path="/workspaceDashboard/:id" element={<WorkspaceDashboard />} />

                <Route path="/workspaceChat/:id" element={<WorkspaceChat />} />
                <Route path="/kanban/:id" element={<KanbanBoard />} />
                <Route path="/tickets/:id" element={<BacklogPage />} />
                <Route path="/completedSprints/:id" element={<CompletedSprints />} />
                <Route path="/GanttChart/" element={<GanttChart />} />

                <Route path="/sprints/:id" element={<SprintList />} />


            </Routes>
        </Router>
    );
}




export default App;
