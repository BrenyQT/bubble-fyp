import React, {useState} from "react";
import {X} from "lucide-react";  // Import close icon

const CreateSprintModal = ({user, workspace, onSprintCreated, onClose}) => {
    const [sprintName, setSprintName] = useState("");  // Sprint name state
    const [goal, setGoal] = useState("");  // Sprint goal state
    const [status, setStatus] = useState("");  // Sprint status state

    // Sprint create form submisson handler
    const handleCreateSprintFormSubmission = async (e) => {
        e.preventDefault();  // Prevent form submission

        // Define my Sprint payload
        const payload = {
            name: sprintName,
            goal: goal,
            active: false,
            createdBy: {id: user.id}, // look at this because if i can pass and serialise user and workspace i wont have to do a extra db check
            workspace: {id: workspace.id},
            tickets: null
        };

        try {
            const response = await fetch(
                `http://localhost:8080/sprints/createSprint/${workspace.id}`,  // POST request with Sprint in request body to the worskpace
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload),  // Send the sprint data as JSON
                }
            );
            // Check is Request is 200 OK
            if (response.ok) {
                const result = await response.json();  // Parse the response
                onSprintCreated(result);  // Call callback function to handle the new sprint in parent
                onClose();  // Close modal after creation
            } else {
                console.error("Failed to create sprint");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        //TO:DO  Maybe make components so i dont have to return a frgament
        <>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-secondary p-6 rounded-lg w-full max-w-md shadow-lg">

                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}  // close the modal when clicked
                            className="text-white hover:text-red-900 text-xl"
                        >
                            <X/>
                        </button>
                    </div>
                    <h2 className=" text-white text-xl font-bold mb-4 ">Create a New Sprint</h2>

                    {/* Form to create a new sprint
                    Run the handler when clicked
                    */}
                    <form onSubmit={handleCreateSprintFormSubmission}>


                        {/* Sprint Name */}
                        <input
                            type="text"
                            placeholder="Sprint Name"
                            value={sprintName}
                            onChange={(e) => setSprintName(e.target.value)}  // Update state
                            className="w-full mb-3 border p-2 rounded"
                            required
                        />


                        {/* Sprint Goal */}
                        <textarea
                            placeholder="Goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}  // Update state
                            className="w-full mb-3 border p-2 rounded"
                        />


                        {/* Button Section */}
                        <div className="flex justify-end space-x-2">


                            {/* Cancel Button */}
                            <button
                                type="button"
                                onClick={onClose}  // Close the modal
                                className="text-white px-4 py-2 bg-primary rounded"
                            >
                                Cancel
                            </button>


                            {/* Submit Button */}
                            <button
                                type="submit"
                                className=" text-white px-4 py-2 bg-primary rounded"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateSprintModal;
