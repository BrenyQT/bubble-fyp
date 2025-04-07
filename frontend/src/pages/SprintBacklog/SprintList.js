import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { ArrowLeft } from "lucide-react";
import SprintKanbanModal from "../../components/SprintBacklog/SprintKanbanBoard"; // Import the Kanban modal
import CreateSprintModal from "../../components/SprintBacklog/CreateSprintModal";
import format from "date-fns/format"; // Import the Create Sprint modal

const SprintList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state?.user;
    const workspace = location.state?.workspace;
    const [sprints, setSprints] = useState([]);
    const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);  // Modal state
    const [selectedSprint, setSelectedSprint] = useState(null);  // State to store selected sprint
    const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);  // State for Create Sprint Modal

    useEffect(() => {
        if (user && workspace) {
            fetchSprints(workspace.id);
        }
    }, [user, workspace]);

    const fetchSprints = (workspaceID) => {
        fetch(`http://localhost:8080/sprints/getSprints/${workspaceID}`, {
            method: "GET",
            credentials: "include",
        })
            .then(response => response.json()) // turn json obj into sprints
            .then(data => {
                const mappedSprints = data.map(s => ({
                    ...s,
                    active: s.current // map backend's 'current' to frontend's expected 'active'
                }));
                setSprints(mappedSprints);
            })
            .catch(error => console.error("cant get sprints ", error));
    };

    const handleSprintCreated = (newSprint) => {
        setSprints((prevSprints) => [...prevSprints, newSprint]); // update state array
        setIsCreateSprintModalOpen(false); // close the model after creating a sprint
    };

    // TO:DO = BROKEN Gonna have to set all sprints in the backend to false and sprint.id to current
    const handleSetCurrentSprint = (sprintId) => {
        setSprints((prevSprints) =>
            prevSprints.map((sprint) =>
                sprint.id === sprintId ? { ...sprint, active: true } : { ...sprint, active: false }
            )
        );
    };

    //updates state when kanban closed
    const handleCloseKanbanModal = () => {
        setIsKanbanModalOpen(false);
        setSelectedSprint(null);
    };

    //updates state when create modal closed
    const handleCloseCreateSprintModal = () => {
        setIsCreateSprintModalOpen(false);
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

                    {/* Create Sprint Button */}
                    <button
                        onClick={() => setIsCreateSprintModalOpen(true)}  // Open the create sprint modal
                        className="text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                    >
                        Create a Sprint +
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center w-full">
                <h1 className="text-white text-2xl font-bold mb-1">{workspace.name}'s Sprints</h1>

                <div className="w-full max-w-6xl px-4 py-8">
                    <div className="max-h-[500px] overflow-y-auto rounded-lg border border-white/30 bg-opacity-20 bg-white backdrop-blur-lg p-4 shadow-lg scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.3)] scrollbar-track-transparent">
                        {/* this is dirty i gotta make backend endpoint */}
                        { sprints
                            .filter(sprint => !sprint.completed)
                            .map((sprint) => (
                                <div
                                    key={sprint.sprintNumber}
                                    className="flex items-center justify-between bg-primary text-white p-5 rounded-lg shadow-md mb-4 transition duration-200 hover:border-accent border-2 border-transparent w-full cursor-pointer"
                                    onClick={() => setSelectedSprint(sprint)}
                                >
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-semibold text-white">{sprint.name}</h3>
                                            <span className="text-xs text-white bg-accent px-2 py-1 rounded">{`#${sprint.sprintNumber}`}</span>
                                        </div>
                                        <h2 className="text-base">{sprint.goal}</h2>
                                        {sprint.active && (
                                            <span className="text-xs max-w-12 bg-green-600 text-white px-2 py-1 mt-1 rounded">
                        Active
                    </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        }
                        {/* this is dirty i gotta make backend endpoint */}
                        { sprints.filter(sprint => !sprint.completed).length === 0 && (
                            <p className="text-white text-center">No sprints found.</p>
                        )}

                    </div>
                </div>
            </div>

            {/* Kanban Sprint Modal */}
            {selectedSprint && (
                <SprintKanbanModal
                    isOpen={true} // Open modal if sprint is selected
                    onClose={handleCloseKanbanModal}
                    sprint={selectedSprint}
                    user={user}
                    workspace={workspace}
                    onSetCurrent={handleSetCurrentSprint} // Set current sprint if selected
                    onSprintDeleted={fetchSprints} // when i dlete a sprint i want the list to refresh
                />
            )}

            {/* Create Sprint Modal */}
            {isCreateSprintModalOpen && (
                <CreateSprintModal
                    user={user}
                    workspace={workspace}
                    onSprintCreated={handleSprintCreated}
                    onClose={handleCloseCreateSprintModal}
                />
            )}
        </div>
    );
};

export default SprintList;
