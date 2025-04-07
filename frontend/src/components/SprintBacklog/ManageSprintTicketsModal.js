import React, {useEffect, useState} from "react";
import {X} from "lucide-react";

const ManageSprintTicketsModal = ({isOpen, onClose, sprintId, workspaceId, onTicketsAdded}) => {
    const [allTickets, setAllTickets] = useState([]); // State which stores all tickets within a workspace
    const [assignedTickets, setAssignedTickets] = useState([]); // The tickets which are already assigned to a sprint
    const [selectedTicketIds, setSelectedTicketIds] = useState([]); // State which highlights and selects tickets for addition to sprint
    const [IdsOfTaskToRemove, setIdsOfTaskToRemove] = useState([]); // State which highlights and selects tickets for removal



    useEffect(() => {
        // chceks if parent component true sprintId and workspaceId are passed from paretn
        if (workspaceId && sprintId && isOpen) {
            // Fetch all tickets for the workspace, excluding completed ones
            fetch(`http://localhost:8080/tickets/getAll/${workspaceId}`)
                .then(res => res.json())
                .then(data => setAllTickets(data.filter(ticket => !ticket.completed))) // Filter out completed tickets

            // Fetch assigned tickets for the sprint, excluding completed ones
            fetch(`http://localhost:8080/sprints/getTicketsBySprint`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    sprintId,
                    workspaceId,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    setAssignedTickets(data.filter(ticket => !ticket.completed)); // Filter out completed tickets
                })
        }
    }, [isOpen, workspaceId, sprintId]);



    // I could combine these functions



    // Toggle the selection of tickets for adding to the sprint
    const toggleTicket = (ticketId) => {
        setSelectedTicketIds(prev =>
            prev.includes(ticketId)
                ? prev.filter(id => id !== ticketId) // if previsous state contains this ticket remove it
                : [...prev, ticketId] // else add it to the end of the array
        );
    };

    // Toggle the removal of tickets from the sprint
    const toggleRemoveTicket = (ticketId) => {
        setIdsOfTaskToRemove(prev =>
            prev.includes(ticketId)
                ? prev.filter(id => id !== ticketId)// if previsous state contains this ticket remove it
                : [...prev, ticketId] // else add it to the end of the array
        );
    };




    // Add selected tickets to the sprint
    const handleSaveOFTicketsToSprint = async () => {
        try {
            await fetch(`http://localhost:8080/sprints/addTickets/${sprintId}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(selectedTicketIds),
            });

            onTicketsAdded?.();
            onClose(); // Close the modal after saving
        } catch (err) {
            console.error("cant save the tickets handleSaveOFTicketsToSprint", err);
        }
    };





    // Remove selected tickets from the sprint
    const handleRemovalOfSelectedTickets = async () => {
        try {
            await fetch(`http://localhost:8080/sprints/removeTickets`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(IdsOfTaskToRemove),
            });

            setAssignedTickets(prev =>
                prev.filter(ticket => !IdsOfTaskToRemove.includes(ticket.id)) // update state of tickets being removed
            );

            setSelectedTicketIds(prev =>
                prev.filter(id => !IdsOfTaskToRemove.includes(id)) // update state of tickets being removed
            );

            setIdsOfTaskToRemove([]); // set state back to original
            onTicketsAdded?.(); // waits for parent

        } catch (err) {
            console.error("cant remove ticket ", err);
        }
    };

    if (!isOpen) return null; // exit modal

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-secondary rounded-xl p-6 w-full max-w-lg relative ">
                <button onClick={onClose} className="absolute text-white top-3 right-3 hover:text-red-500">
                    <X/>
                </button>

                <h2 className="text-xl font-bold text-white mb-4">Select Tickets for Sprint</h2>

                {/* Assigned tickets (with multi-select) */}
                <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Assigned to this Sprint</h3>
                    <div className="h-32 overflow-y-auto space-y-2 pr-2">
                        {assignedTickets.length > 0 ? (
                            assignedTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => toggleRemoveTicket(ticket.id)}
                                    className={`flex justify-between items-center p-2 border rounded cursor-pointer ${
                                        IdsOfTaskToRemove.includes(ticket.id)
                                            ? "bg-red-500 border-red-400 text-white"
                                            : "bg-white"
                                    }`}
                                >
                                    <span>#{ticket.ticketNumber} - {ticket.name}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-red-500">No tickets assigned yet</p>
                        )}
                    </div>
                    {IdsOfTaskToRemove.length > 0 && (
                        <button
                            onClick={handleRemovalOfSelectedTickets}
                            className="mt-3 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                            Remove Selected
                        </button>
                    )}
                </div>

                {/* Available tickets to add */}
                <h3 className="text-white font-semibold mb-2">Available Tickets</h3>
                <div className="h-80 overflow-y-auto space-y-2 mb-4 pr-2">
                    {allTickets.length > 0 ? (
                        allTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => toggleTicket(ticket.id)}
                                className={`p-2 border rounded cursor-pointer ${
                                    selectedTicketIds.includes(ticket.id)
                                        ? "bg-accent border-accent"
                                        : "bg-white"
                                }`}
                            >
                                #{ticket.ticketNumber} - {ticket.name}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-red-500">No tickets available to add</p>
                    )}
                </div>


                <button
                    onClick={handleSaveOFTicketsToSprint}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default ManageSprintTicketsModal;
