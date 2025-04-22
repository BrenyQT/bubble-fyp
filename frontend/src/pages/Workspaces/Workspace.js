import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import JoinWorkspaceModal from "../../components/WorkspaceDashboard/JoinWorkspaceModal";

/*
Set sate for user (Set to null)
Set state for join a workspace modal (Set to false)
Set initial quote state to empty string
 */
const Workspace = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quote, setQuote] = useState("");

    // BEFORE THE PAGE LOADS
    // Fetch user object for current user signed in via JWT
    useEffect(() => {
        fetch("http://localhost:8080/user", {
            method: "GET",
            credentials: "include", // Send cookies which include my JWT ?
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => console.error("Error fetching user:", error));

        // Set random quote
        setQuote("Lets work !!");
    }, []);


    // Redirects
    const handleCreateWorkspace = () => {
        navigate("/createWorkspace", {state: {user}});
    };
    const handleViewWorkspace = () => {
        navigate("/viewWorkspace", {state: {user}});
    };

    // Set Modal State
    const handleJoinWorkspace = () => {
        setIsModalOpen(true);
    };


    return (
        <div className="bg-secondary min-h-screen text-accent flex flex-col">
            <Navbar user={user}/>

            <div className="flex flex-col items-center justify-center flex-grow">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1874/1874046.png"
                    className="w-20 h-20 mb-4"
                    alt={"silly"}
                />
                <h1 className="text-4xl font-bold mb-4 text-white">
                    {user ? `Hello, ${user.name} 👋` : "BUBBLE"}
                </h1>

                {/* Random Inspiration Quote */}
                <p className="text-lg text-white italic mb-6 text-center w-4/5 sm:w-2/3 md:w-1/2">
                    "{quote}"
                </p>

                <button
                    onClick={handleViewWorkspace}
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-md mb-4 flex items-center justify-center hover:bg-accent transition duration-200 w-64"
                >
                    View Your Workspaces
                </button>

                <button
                    onClick={handleJoinWorkspace}
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-md mb-4 flex items-center justify-center hover:bg-accent transition duration-200 w-64"
                >
                    Join a Workspace
                </button>

                <button
                    onClick={handleCreateWorkspace}
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-md mb-4 flex items-center justify-center hover:bg-accent transition duration-200 w-64"
                >
                    Create a Workspace
                </button>
            </div>

            {/*
            Join Workspace
             Update Modal state when closed
             */}
            <JoinWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user}/>
        </div>
    );
};

export default Workspace;
