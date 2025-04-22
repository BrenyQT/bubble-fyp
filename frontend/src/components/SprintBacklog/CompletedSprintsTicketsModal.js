import React from "react";
import { X } from "lucide-react";



// Load all the tickets from
const CompletedSprintTicketsModal = ({ isOpen, onClose, tickets, onTicketClick }) => {
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-secondary rounded-xl p-6 w-full max-w-lg relative shadow-xl">
                <button onClick={onClose} className="hover:text-red-700 text-white  absolute top-3 right-3">
                    <X />
                </button>

                <h2 className="text-xl font-bold text-white mb-4"> Completed Tickets</h2>
                <div className="h-80 overflow-y-auto space-y-2 pr-2 ">
                    {/* TO:DO i can make this tider and the same with the kanban boards by using a div component and prop drill */}
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="p-2  rounded cursor-pointer bg-accent"
                                onClick={() => onTicketClick(ticket)} // Trigger onTicketClick when a ticket is clicked
                            >
                                <p className="text-white break-words ">#{ticket.ticketNumber} - {ticket.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-red-500">No Tickets have been completed in this sprint </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompletedSprintTicketsModal;
