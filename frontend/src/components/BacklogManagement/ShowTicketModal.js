import React from "react";
import format from "date-fns/format"; // format data()
import { X } from "lucide-react";

const ShowTicketModal = ({ ticket, onClose }) => {
    if (!ticket) return null;

    const timestamp = ticket.createdAt ? new Date(ticket.createdAt) : null;
    const formattedTime = timestamp ? format(timestamp, "hh:mm a") : "Unknown Time";
    const formattedDate = timestamp ? format(timestamp, "MMM d, yyyy") : "Unknown Date"; // TIME FORMATTER

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center ">
            <div className="bg-secondary rounded-lg w-full max-w-4xl p-6 shadow-lg ">

                {/* Header */}
                <div className=" flex justify-between items-start border-b pb-4">
                    <div>
                        <p className="text-sm text-white font-medium">Ticket Number : {ticket.id || "TICKET-X"}</p>
                        <h2 className="text-2xl font-bold text-white">{ticket.name || "TICKET-NAME-UNKNOWN"}</h2>
                    </div>
                    <div className="space-x-2 flex items-center">
                        <span className="bg-accent text-white px-3 py-1 rounded text-sm font-medium">
                            {ticket.status}
                        </span>
                        <button onClick={onClose} className="text-white hover:text-red-900 text-xl"><X/></button>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/* Left column */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <p className="text-sm font-semibold text-white mb-1">Description</p>
                            <p className="text-white">{ticket.description || "No description provided."}</p>
                        </div>

                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-white uppercase font-bold mb-1">Assignee</p>
                            <p className="text-white">{ticket.assignedTo?.name || "Unassigned"}</p>
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
                            {/* instate my css rule in span*/}
                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold                          
                                ${ticket.highPriority ? "bg-red-100 text-red-700" : "bg-accent text-white"}`}>
                                {ticket.highPriority ? "High" : "Normal"}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs text-white uppercase font-bold mb-1">Created</p>
                            <p className="text-white">{formattedTime} • {formattedDate}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ShowTicketModal;
