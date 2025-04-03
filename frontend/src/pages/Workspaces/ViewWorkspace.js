import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {ArrowLeft, MoreVertical} from "lucide-react";

// Sets user state via prop insertion
const ViewWorkspace = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(location.state?.user || null);
    const [workspaces, setWorkspaces] = useState([]);

    // Pass user email into function to retrieve all users workspaces
    useEffect(() => {
        if (user) {

            fetchWorkspaces(user.email);
        }
    }, [user]);

    // Sends a GET Request to with user email as query
    const fetchWorkspaces = (email) => {
        fetch(`http://localhost:8080/getWorkspaces?email=${email}`, {
            method: "GET",
            credentials: "include", // Include Cookies ?? TO:DO have a look at this
        })
            .then(response => response.json()) // Set as JSON Object
            .then(data => setWorkspaces(data))  // Populate the array
            .catch(error => console.error("Error fetching workspaces : ", error));
    };

    // Redirects to chat of the Workspace thats clicked on
    const handleWorkspaceClick = (workspace) => {
        navigate(`/workspaceDashboard/${workspace.id}`, { state: { workspace, user } });
    };

    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} className="fixed top-0 left-0 w-full z-50" />

            <div className="bg-secondary px-6 pt-6 mt-6">
                <button
                    onClick={() => navigate("/Workspace", { state: { user } })}
                    className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Return to Workspace View
                </button>
            </div>

            <div className="flex flex-col items-center w-full">
                <h1 className="text-white text-2xl font-bold mb-1">Your Workspaces</h1>

                <div className="w-full max-w-6xl px-4 py-8">
                    <div className="max-h-[500px] overflow-y-auto rounded-lg border border-white/30 bg-opacity-20 bg-white backdrop-blur-lg p-4 shadow-lg scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.3)] scrollbar-track-transparent">                        {workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                            <div
                                key={workspace.id}
                                className="flex items-center justify-between bg-primary text-white p-5 rounded-lg shadow-md mb-4 transition duration-200 hover:border-accent border-2 border-transparent w-full cursor-pointer"
                                    onClick={() => handleWorkspaceClick(workspace)}
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                            <img
                                                src={workspace.image || "https://cdn-icons-png.flaticon.com/512/456/456212.png"}
                                                alt="Workspace Icon"
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold">{workspace.name}</h2>
                                            <p className="text-sm text-gray-300">{workspace.bio}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span className="text-gray-300 text-sm">
                                            Members: {workspace.users?.length || 0}
                                        </span>
                                        <button className="text-gray-300 hover:text-white">
                                            <MoreVertical size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white text-center">No workspaces found !!!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewWorkspace;
