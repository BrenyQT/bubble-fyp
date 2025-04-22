import React, { useState } from "react";
import format from "date-fns/format";
import { X } from "lucide-react";

const ShowTicketModal = ({ ticket, onClose, user, onTicketUpdated }) => {


    const [updating, setUpdating] = useState(false); // state for when updating a ticket

    if (!ticket) return null; // safety check

    // Fortmatting time from db
    const timestamp = ticket.createdAt ? new Date(ticket.createdAt) : null;
    const formattedTime = timestamp ? format(timestamp, "hh:mm a") : "Unknown Time";
    const formattedDate = timestamp ? format(timestamp, "MMM d, yyyy") : "Unknown Date";




    // sets a user as Ticket.assignedTO
    const handleAssignToMe = async () => {


        if (ticket.completed) return;  // safety check testing


        setUpdating(true); // update updating state
        try {
            await fetch(`http://localhost:8080/tickets/assignTicket/${ticket.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user), // couldnt send obj so i have to send a JSON string
            });

            ticket.assignedTo = user;
            onTicketUpdated?.();// when parent is finished its task with success
        } catch (err) {
            console.error("=couldnt assign to me ERROR: ", err);
        } finally {
            setUpdating(false); // set state to default again
        }
    };





    const handleUnassign = async () => {


        if (ticket.completed) return;  // this should never run now ???
        setUpdating(true); // update state  mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm



        try {
            await fetch(`http://localhost:8080/tickets/unassignTicket/${ticket.id}`, {
                method: "PUT",
            });

            ticket.assignedTo = null; // remove me

            onTicketUpdated?.(); // this should do a fecth in the parent component
        } catch (err) {


            console.error("couldn't unassign myself ERROR:", err);
        } finally {


            setUpdating(false); // set updating which means button can be updated
        }
    };






    const handleDelete = async () => {

        if (ticket.completed) return;  // Prevent action if the ticket is completed (this should never run ??)


        setUpdating(true); // set updating which means button cant be updated

        try {
            await fetch(`http://localhost:8080/tickets/delete/${ticket.id}`, {
                method: "DELETE",
            });

            onTicketUpdated?.(); // when parent component completes fetch
            onClose(); // close modal
        } catch (err) {
            console.error("cant delete ticket ", err);
        } finally {
            setUpdating(false); // allow editing
        }
    };






    const isAssignedToMe = ticket.assignedTo?.id === user?.id; // bool , set as tue is its assigned

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-secondary rounded-lg w-full max-w-4xl p-6 shadow-lg">
                <div className="flex justify-between items-start border-b pb-4">
                    <div>
                        <p className="text-sm text-white font-medium">Ticket Number: {ticket.id || "TICKET-X"}</p>
                        <div className="break-words whitespace-pre-wrap pr-12">
                        <h2 className="text-2xl font-bold text-white break-all">{ticket.name || "TICKET-NAME-UNKNOWN"}</h2>
                        </div>
                    </div>
                    <div className="space-x-2 flex items-center">
                        <span className="bg-accent text-white px-3 py-1 rounded text-sm font-medium">
                            {ticket.status}
                        </span>
                        <button onClick={onClose} className="text-white hover:text-red-900 text-xl">< X /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <p className="text-sm font-semibold text-white mb-1">Description</p>
                            <p className="text-white break-all ">{ticket.description || "No description provided."}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-white uppercase font-bold mb-1">Assignee</p>
                            {/* show assigned to or no assigned */}
                            <p className="text-white">{ticket.assignedTo?.name || "Unassigned"}</p>

                            {/* ASSIGNMENT LOGIC */}

                            {user && (
                                !ticket.completed ? (
                                    isAssignedToMe ? (
                                        <button
                                            onClick={handleUnassign}
                                            className="mt-1 text-xs text-red-500 underline hover:text-red-700 disabled:opacity-50"
                                            disabled={updating}
                                        >
                                            Remove me as Assignee
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleAssignToMe}
                                            className="mt-1 text-xs text-blue-400 underline hover:text-blue-600 disabled:opacity-50"
                                            disabled={updating}
                                        >
                                            Assign to me
                                        </button>
                                    )
                                ) : (
                                    <p className="text-xs text-white">This ticket is completed, can't modify assignee.</p>
                                )
                            )}
                        </div>



                        <div>
                            <p className="text-xs text-white uppercase font-bold mb-1">Reporter</p>
                            <p className="text-white">{ticket.createdBy?.name || "Unknown"}</p>
                        </div>

                        <div>
                            <p className="text-xs text-white uppercase font-bold mb-1">Label</p>
                            <p className="text-white">{ticket.label || "None"}</p>
                        </div>

                        <div>
                            <p className="text-xs text-white uppercase font-bold mb-1">Priority</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold
                                ${ticket.highPriority ? "bg-red-100 text-red-700" : "bg-accent text-white"}`}>
                                {ticket.highPriority ? "High" : "Normal"}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs text-white uppercase font-bold mb-1">Created</p>
                            <p className="text-white">{formattedTime} - {formattedDate}</p>
                        </div>

                        <div className="pt-4">
                            {/* check is the ticket assigned  */}

                            {!ticket.completed ? (
                                <button
                                    onClick={handleDelete}
                                    className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow disabled:opacity-50"
                                    disabled={updating}
                                >
                                    Delete Ticket
                                </button>
                            ) : (
                                <p className="text-xs text-white">This ticket is completed cannot delete.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowTicketModal;
