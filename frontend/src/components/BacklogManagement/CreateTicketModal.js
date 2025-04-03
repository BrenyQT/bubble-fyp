import React, {useState} from "react";
import {X} from "lucide-react";

// keep this static im not gonna add customability
const LABEL_OPTIONS = [
    "Epic – A big feature or initiative broken into smaller tasks.",
    "Story – A functional requirement or user-facing task.",
    "Task – A technical or internal job.",
    "Bug – Something that’s broken or incorrect.",
    "Chore – Maintenance work or cleanup (e.g., refactoring).",
    "Spike – A time-boxed research or investigation task.",
    "Improvement – Enhancing an existing feature.",
    "Support – User-reported issue or request."
];

const CreateTicketModal = ({user, workspace, onTicketCreated}) => {
    const [createTicketModal, setcreateTicketModal] = useState(false); // show the create ticket modal
    const [ticketName, setTicketName] = useState(""); // ticket name for form input
    const [description, setDescription] = useState(""); // description for form input
    const [label, setLabel] = useState(""); // label input for form
    const [highPriority, setHighPriority] = useState(false); // priority input for form

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        // Create a Ticket for payload
        const payload = {
            name: ticketName,
            description,
            label: label.split("–")[0].trim(), // remove the bloat for backend
            createdBy: user,
            assignedTo: null,
            highPriority: highPriority
        };

        try {
            const response = await fetch(
                `http://localhost:8080/tickets/create/${workspace.id}`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"}, // cookies JWT
                    body: JSON.stringify(payload), // stringified Json ticket object to parse in backend
                }
            );
            // ChEck for 200 ok
            if (response.ok) {
                const result = await response.json();
                setcreateTicketModal(false);
                setTicketName("");
                setDescription("");
                setLabel("");
                setHighPriority(false);
                onTicketCreated?.(result);
            } else {
                console.error(" cant create ticket");
            }
        } catch (err) {
            console.error("Edge case error in create ticket modal :", err);
        }
    };


    return (
        // TO:DO maybe create components to avoid fragment usage
        <>
                <button
                    onClick={() => setcreateTicketModal(true)}
                    className="flex items-center text-white bg-primary px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                    Create a New Ticket +
                </button>
            {/*If create button is pressed and state is set */}
                {createTicketModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-secondary p-6 rounded-lg w-full max-w-md shadow-lg">
                            <div className="flex justify-end">

                                <button onClick={() => setcreateTicketModal(false)}
                                        className="text-white hover:text-red-900 text-xl"><X/></button>
                            </div>
                            <h2 className="text-xl font-bold mb-4 text-white">Create New Ticket</h2>

                            <form onSubmit={handleCreateTicket}>
                                <input
                                    type="text"
                                    placeholder="Ticket Name"
                                    value={ticketName}
                                    onChange={(e) => setTicketName(e.target.value)} //update state
                                    className="w-full mb-3 border p-2 rounded"
                                    required
                                />

                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)} //update state
                                    className="w-full mb-3 border p-2 rounded"
                                />

                                <select
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)} //update state
                                    className="w-full mb-3 border p-2 rounded"
                                    required
                                >
                                    <option value="">Select a label</option>
                                    {LABEL_OPTIONS.map((option, id) => (
                                        <option key={id} value={option}>
                                            {option}
                                        </option> // map static array of labels in a option element
                                    ))}
                                </select>


                                <div className="space-x-2 flex justify-end">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={highPriority}
                                            onChange={(e) => setHighPriority(e.target.checked)} //update state
                                        />

                                        <p className={"text-white "}>High Priority</p>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setcreateTicketModal(false)}
                                        className="text-white px-4 py-2 bg-primary rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" // run form handler
                                        className="px-4 py-2 bg-primary text-white rounded"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </>
            );
            };

            export default CreateTicketModal;
