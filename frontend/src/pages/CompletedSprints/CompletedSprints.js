import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { ArrowLeft} from "lucide-react"; // return arrow

const SprintList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state?.user; // set user
    const workspace = location.state?.workspace; // set workspace
    const [sprints, setSprints] = useState([]);

    // Fetch sprints when the user and workspace are available
    useEffect(() => {
        if (user && workspace) {
            fetchSprints(workspace.id);
        }
    }, [user, workspace]);

    // Sends a GET request to fetch sprints by workspaceId
    const fetchSprints = (workspaceID) => {
        fetch(`http://localhost:8080/getSprints/${workspaceID}`, {
            method: "GET",
            credentials: "include", // for my cookies JWT
        })
            .then(response => response.json()) // make it JSON
            .then(data => setSprints(data))     // update state when sprints loaded not finished
            .catch(error => console.error("Error fetching sprints:", error));
    };

    // Navigate to the Sprint's detailed page
    const handleSprintClick = (sprint) => {
        navigate(`/workspaceDashboard/${sprint.workspace.id}`, { state: { sprint, user } });
    };

    // Handle new sprint creation
    const handleSprintCreated = (newSprint) => {
        setSprints((prevSprints) => [...prevSprints, newSprint]);
    };

    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} className="fixed top-0 left-0 w-full z-50" />

            <div className="bg-secondary px-6 pt-6 mt-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/tickets/${workspace.id}`, { state: { user, workspace } })}
                        className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Return to Workspace View
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center w-full">
                <h1 className="text-white text-2xl font-bold mb-1">{workspace.name}'s Sprints</h1>

                <div className="w-full max-w-6xl px-4 py-8">
                    <div className="max-h-[500px] overflow-y-auto rounded-lg border border-white/30 bg-opacity-20 bg-white backdrop-blur-lg p-4 shadow-lg scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.3)] scrollbar-track-transparent">
                        {sprints.length > 0 ? (
                            sprints.map((sprint) => (
                                <div
                                    key={sprint.id}
                                    className="flex items-center justify-between bg-primary text-white p-5 rounded-lg shadow-md mb-4 transition duration-200 hover:border-accent border-2 border-transparent w-full cursor-pointer"
                                    onClick={() => handleSprintClick(sprint)}
                                >
                                    <div className="flex items-center space-x-6">
                                        <div>
                                            <h2 className="text-xl font-semibold">{sprint.goal}</h2>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white text-center">No Completed sprints found !!!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprintList;
