import React from "react";
import { X } from "lucide-react";

const WorkspaceOptionsAndLeavingModal = ({ isOpen, workspace, user, onClose, onLeaveWorkspace }) => {
    if (!isOpen) return null; // safety net



    const handleLeaveWorkspace = () => {
        // logic for leaving or deleting
        if (workspace.users.length === 1) {


            // leave workpsace if user.length < 2

            fetch(`http://localhost:8080/deleteWorkspace/${workspace.id}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok) {
                        onLeaveWorkspace();
                    }
                })
                .catch((error) => {
                    console.error("cant delete the group when leaving ", error);
                });
        } else {

            // leave workpsace if user.length > 1
            fetch(`http://localhost:8080/leaveWorkspace`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ workspaceId: workspace.id, userId: user.id }),
                credentials: "include",
            })
                .then((response) => {
                    if (response.ok) {
                        onLeaveWorkspace(false);
                    }
                })
                .catch((error) => {
                    console.error("cant leave the workpsace ", error);
                });
        }

        onClose();
    };




    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-secondary p-6 rounded-lg shadow-lg w-96">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-red-500 transition"
                    title="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl text-white font-bold mb-4">CODE: {workspace.code}</h2>
                <h2 className="text-xl text-white font-semibold mb-4">Leave Workspace</h2>
                <p className="text-white">Are you sure you want to leave the workspace</p>
                <p className="text-xl text-white font-semibold mb-4">"{workspace.name}"?</p>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleLeaveWorkspace}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        {workspace.users.length === 1 ? "Delete Workspace" : "Leave Workspace"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceOptionsAndLeavingModal;
