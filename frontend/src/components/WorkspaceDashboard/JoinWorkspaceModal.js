import React, { useState, useRef } from "react";
import { X } from "lucide-react";

/*
isOpen : is the modal open
onCLose : Passes through the onclose function
user : Passes through current user
 */
const JoinWorkspaceModal = ({ isOpen, onClose, user }) => {
    const inputRefs = useRef([]);
    const [code, setCode] = useState(new Array(6).fill("")); // Creates a new empty array
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if (!isOpen) return null; // Return if modal isnt open

    const handleChange = (index, event) => {
        const value = event.target.value;
        if (!/^[0-9a-zA-Z]?$/.test(value)) return; // Checks if input is part of CHARACTERS array

        const newCode = [...code];
        newCode[index] = value.toUpperCase(); // UPPER
        setCode(newCode); // APPEND


        // If the index of code isnt the 6th, Shifts the input to the next index
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // If action is a backspace or if field is empty remove value from current pos and move back an index
    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Used to handle join a workspace request
    // Checks if a user is set
    const handleJoinWorkspace = async () => {
        if (!user) {
            setErrorMessage(" You must be logged in to join a workspace !!!");
            return;
        }

        const workspaceCode = code.join(""); // Converts an array to string

        // Code length < 6
        if (workspaceCode.length !== 6) {
            setErrorMessage(" Please enter a valid code !!");
            return;
        }

        // Sends a POST Request to allow a user to join a workspace
        try {
            const response = await fetch("http://localhost:8080/joinWorkspace", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // Tells server the data body is JSON Format
                credentials: "include",// Sends JWT
                body: JSON.stringify({
                    email: user.email,
                    code: workspaceCode
                }),
            });

            const data = await response.text();

            // 200 : OK
            if (!response.ok) {
                setErrorMessage(data);
            } else {
                setSuccessMessage("Successfully joined the workspace!");
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setErrorMessage("Failed to join workspace. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-secondary p-6 rounded-lg shadow-lg w-96 border border-primary">
                <button onClick={onClose} className="absolute top-2 right-2 text-accent hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-white mb-4 text-center">
                    {user ? `Hello, ${user.name}! Enter Workspace Code` : "Enter Workspace Code"}
                </h2>

                <div className="flex justify-center space-x-2">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(event) => handleChange(index, event)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            ref={(el) => (inputRefs.current[index] = el)} // References a DOM Element ??
                            className="w-12 h-12 text-center text-lg font-bold border border-primary rounded bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    ))}
                </div>
                {errorMessage && <p className="text-red-500 text-sm text-center mt-3">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-sm text-center mt-3">{successMessage}</p>}

                <button
                    onClick={handleJoinWorkspace}
                    className="w-full bg-primary text-white p-2 rounded hover:bg-accent mt-6 transition duration-200"
                >
                    Join Workspace
                </button>
            </div>
        </div>
    );
};

export default JoinWorkspaceModal;
