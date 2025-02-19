import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Workspace = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Fetch user on component mount
    useEffect(() => {
        fetch("http://localhost:8080/user", {
            method: "GET",
            credentials: "include", // Send cookies (JWT)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => console.error("Error fetching user:", error));
    }, []);

    const handleCreateWorkspace = () => {
        navigate("/create-workspace");
    };

    const handleJoinWorkspace = () => {
        navigate("/join-workspace");
    };
    const handleViewWorkspace = () =>{
        navigate("view-workspace")
    }

    return (
        <div className="bg-secondary min-h-screen text-accent flex flex-col">

            <Navbar user={user} />

            <div className="flex flex-col items-center justify-center flex-grow">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1874/1874046.png"
                    alt="Bubble Icon"
                    className="w-20 h-20 mb-4"
                />
                <h1 className="text-4xl font-bold mb-4 text-white">
                    {user ? `Welcome, ${user.name} 👋` : "BUBBLE"}
                </h1>
                <p className="text-lg text-white mb-6">View, Manage and Join workspaces effortlessly</p>
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
        </div>
    );
};

export default Workspace;
