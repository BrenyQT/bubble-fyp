import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { ArrowLeft } from "lucide-react";

/*
Set sate for user (Set to null)
gets the user info passed through state

Set Name description and image  as ""

 */
const CreateWorkspace = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(location.state?.user || null);
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceDescription, setWorkspaceDescription] = useState("");
    const [workspaceImage, setWorkspaceImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // Image preview
    const fileInputRef = React.useRef(null); // Reference for hidden file input

    // User should be passed in but just incase
    useEffect(() => {
        if (!user) {
            fetch("http://localhost:8080/user", {
                method: "GET",
                credentials: "include",
            })
                .then(response => response.json())
                .then(data => setUser(data))
                .catch(error => console.error("Error fetching this user : ", error + "???"));
        }
    }, [user]);

    //
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setWorkspaceImage(reader.result);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger file input when clicking the image
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Handle Workspace Creation
    const handleCreateWorkspace = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("User not loaded. Please try again.");
            return;
        }

        const workspaceData = {
            name: workspaceName,
            bio: workspaceDescription,
            email: user.email,
            image: workspaceImage || ""
        };

        /*
        Try pass workspaceData to backend (Create Workspace)
        If Backend fails and alert is shown
        If workspace is made navigate to view workspace page
         */
        try {
            const response = await fetch("http://localhost:8080/newGroup", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(workspaceData),
            });

            if (!response.ok) {
                throw new Error("Failed to create workspace");
            }

            navigate("/viewWorkspace", { state: { user } })
        } catch (error) {
            console.error("Error creating workspace:", error);
            alert("Error creating workspace. Please try again.");
        }
    };

    return (
        <div className="bg-secondary min-h-screen flex flex-col items-center">
            <Navbar user={user} />
            <div className="mt-[80px] w-full max-w-6xl mx-auto py-5">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/Workspace")}
                    className="flex items-center text-white px-1 py-1 bg-primary rounded-lg shadow-md hover:bg-opacity-80 transition duration-200 text-lg font-semibold"
                >
                    <ArrowLeft size={24} className="mr-2" />
                    Back to Workspaces
                </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow w-full">
                <div className="relative cursor-pointer" onClick={handleImageClick}>
                    {previewImage ? (
                        <img src={previewImage}
                             className="w-24 h-24 rounded-full mb-6 object-cover border-2 border-accent shadow-lg"
                             alt = {"silly"}
                        />

                    ) : (
                        <img src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                             className="w-24 h-24 rounded-full mb-6 object-cover border-2 border-accent shadow-lg"
                             alt = {"silly"}
                        />
                    )}
                </div>

                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />

                <form onSubmit={handleCreateWorkspace}
                      className="bg-opacity-20 bg-white backdrop-blur-lg p-6 rounded-lg shadow-lg w-96 border border-white/30">
                    <label className="block text-white text-sm font-semibold mb-2">Workspace Name</label>
                    <input type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)}
                           placeholder="Enter workspace name" required
                           className="w-full p-2 mb-4 border border-primary rounded bg-secondary text-white" />

                    <label className="block text-white text-sm font-semibold mb-2">Workspace Description</label>
                    <input type="text" value={workspaceDescription}
                           onChange={(e) => setWorkspaceDescription(e.target.value)}
                           placeholder="Enter workspace description" required
                           className="w-full p-2 mb-6 border border-primary rounded bg-secondary text-white" />

                    <button type="submit"
                            className="w-full bg-primary text-white px-4 py-2 rounded-lg shadow-md text-lg font-semibold hover:bg-accent transition duration-300">
                        Create Workspace
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspace;
