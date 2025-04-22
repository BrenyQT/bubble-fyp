import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { ArrowLeft } from "lucide-react";
import ShowTicketModal from "../../components/BacklogManagement/ShowTicketModal";
import CompletedSprintTicketsModal from "../../components/SprintBacklog/CompletedSprintsTicketsModal"; // Sprint tickets modal

const CompletedSprints = () => {

    const location = useLocation(); // used to get user and workspace.
    const navigate = useNavigate(); // allows user to vaigate to nect page

    const user = location.state?.user; // set user
    const workspace = location.state?.workspace; // set workspace

    const [CompletedSprintsList, setCompletedSprintsList] = useState([]); // State to store completed sprints
    const [ClickedOnSprint, setClickedOnSprint] = useState(null); // State to store selected sprint
    const [clickOnSprintTicketsList, setClickOnSprintTicketsList] = useState([]); // State to store tickets for selected sprint


    const [isModalOpen, setIsModalOpen] = useState(false); // Controls the state for my Sprint ticket Modal

    const [clickedOnTicket, setClickedOnTicket] = useState(null); // State to store selected ticket for the ShowTicketModal



    // populates the CompletedSprintsList
    useEffect(() => {
        if (user && workspace) { // TO:DO im verifying this on each page maybe make a function
            fetchCompletedSprints(workspace.id); // populates the CompletedSprintsList
        }
    }, [user, workspace]);

    //
    const fetchCompletedSprints = (workspaceId) => {
        fetch(`http://localhost:8080/sprints/getCompletedSprints/${workspaceId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // FINAL TO:DO I need to look into this handling JWT (I vaguely remember this passing this for JWT but it think its if i put it in HTTP Request Haeder)
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                const completedSprintsOnly = data.filter((sprint) => sprint.completed === true); // Dirty fix need to only send back completed sprints from backend
                setCompletedSprintsList(completedSprintsOnly);      // Setting the state for my completed sprint list
            })
    };



    // Store the state of the selected sprint for sprint ticket modal
    const handleSprintClick = (sprint) => {
        setClickedOnSprint(sprint); // Set selected sprint state
        fetchTicketsForSprint(sprint.id); // loads the tickets from a sprint id and workspace id
        setIsModalOpen(true);  // show the Sprint Ticket Modal
    };



    // uses the workspace id and sprint id to load the tickets within a sprint
    // tickets in a completed sprint cant be assigned to a different sprint so i can just get the ticket without checking status
    const fetchTicketsForSprint = (sprintId) => {
        fetch(`http://localhost:8080/sprints/getTicketsBySprint`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ sprintId, workspaceId: workspace.id }), // send workspace id idk. Couldnt parse this as JSON OBJ
        })
            .then((response) => response.json())
            .then((data) => setClickOnSprintTicketsList(data)) // set the sprint tickets for the Sprint ticket Modal
    };





    // Stroes the clicked on ticket in state
    const handleTicketClick = (ticket) => {
        setClickedOnTicket(ticket);
    };



    // changes the state to close the sprint ticket modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setClickedOnSprint(null);
    };




    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} workspace={workspace} className="fixed top-0 left-0 w-full z-50" />

            <div className="bg-secondary px-6 pt-6 mt-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/workspaceDashboard/${workspace.id}`, { state: { user, workspace } })}
                        className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Return to Workspace View
                    </button>
                </div>
            </div>



            <div className="flex flex-col items-center w-full">
                <h1 className="text-white text-2xl font-bold mb-1">{workspace.name}'s Completed Sprints</h1>

                <div className="w-full max-w-6xl px-4 py-8">
                    <div className="max-h-[500px] overflow-y-auto rounded-lg border border-white/30 bg-opacity-20 bg-white backdrop-blur-lg p-4 shadow-lg scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.3)] scrollbar-track-transparent">


                        {/* I dont have to check if ARRAY.isArray bc the state is set */}
                        {CompletedSprintsList.length > 0 ? (
                            CompletedSprintsList.map((sprint) => (
                                <div
                                    key={sprint.id}
                                    className="flex items-center justify-between bg-primary text-white p-5 rounded-lg shadow-md mb-4 transition duration-200 hover:border-accent border-2 border-transparent w-full cursor-pointer"
                                    onClick={() => handleSprintClick(sprint)} //     // Store the state of the selected sprint for sprint ticket modal

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

            {/* Sprint Tickets Modal */}
            {ClickedOnSprint && (
                <CompletedSprintTicketsModal
                    isOpen={isModalOpen} // passes wtate for when modal should be open or not
                    onClose={handleCloseModal} // update the state to false to close sprint ticket modal
                    tickets={clickOnSprintTicketsList} // Pass in the tickets from state from a sprint.id within a workspace.ie
                    onTicketClick={handleTicketClick} // Pass ticket click handler to SprintTicketsModal
                />
            )}

            {/* Show Ticket Modal for selected ticket */}
            {clickedOnTicket && (
                <ShowTicketModal
                    ticket={clickedOnTicket} // passes in the ticket which the user clicked
                    onClose={() => setClickedOnTicket(null)} // sets the state variable to null so modal closes
                />
            )}
        </div>
    );
};

export default CompletedSprints;
