import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Workspace = () => {
    const navigate = useNavigate();

    const handleCreateWorkspace = () => {
        navigate("/create-workspace");
    };

    const handleJoinWorkspace = () => {
        navigate("/join-workspace");
    };

    return (
        <div className="bg-secondary min-h-screen text-accent flex flex-col">
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-grow">
                {/* Bubble Icon */}
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1874/1874046.png"
                    alt="Bubble Icon"
                    className="w-20 h-20 mb-4"
                />
                <h1 className="text-4xl font-bold mb-4 text-white">BUBBLE</h1>
                <p className="text-lg text-white mb-6">Manage and join workspaces effortlessly</p>

                {/* Create Workspace Button */}
                <button
                    onClick={handleCreateWorkspace}
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-md mb-4 flex items-center hover:bg-accent transition duration-200"
                >
                    Create a Workspace
                </button>

                {/* Join Workspace Button */}
                <button
                    onClick={handleJoinWorkspace}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center hover:bg-gray-600 transition duration-200"
                >
                    Join a Workspace
                </button>
            </div>
        </div>
    );
};

export default Workspace;
