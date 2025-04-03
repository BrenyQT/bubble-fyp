import React, {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom"; // Pass in user and workspace
import {ArrowLeft} from "lucide-react"; // return button
import Navbar from "../../components/Navbar";
import CreateTicketModal from "../../components/BacklogManagement/CreateTicketModal"; // Create a new ticket
import ShowTicketModal from "../../components/BacklogManagement/ShowTicketModal";   // when a ticket is clicked on
import FilterModal from "../../components/BacklogManagement/FilterModal"; // Filter
import format from "date-fns/format"; // Formatting data() dt

const BacklogPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    //get my user and workspace
    const user = location.state?.user;
    const workspace = location.state?.workspace;

    // Sets a selected ticket when i click on it
    const [selectedTicket, setSelectedTicket] = useState(null);
    // Loads tickets form backend into an array
    const [tickets, setTickets] = useState([]);
    // manages fileter modal state
    const [showFilterModal, setShowFilterModal] = useState(false);
    // The label we are filtering for
    const [labelFilter, setLabelFilter] = useState("");


    useEffect(() => {
        if (!workspace || !user) {
            navigate("/");
        }
    }, [navigate, workspace, user]);

    useEffect(() => {
        if (workspace?.id) {
            fetchTickets();
        }
    }, [workspace]);

    //Get ths tickets within a particular workspace
    //Returns 200 OK with tickets
    const fetchTickets = async () => {
        try {
            const res = await fetch(`http://localhost:8080/tickets/getAll/${workspace.id}`);
            if (!res.ok) throw new Error("cant get tickets ");
            const data = await res.json();
            // makes  a new array bc of mapping issues
            setTickets(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("cant fetch tickets:", err);
            setTickets([]);
        }
    };

    //Handles outside click for Modals
    const modalRefrenceSetter = useRef();


    useEffect(() => {
        const handleOutsideModalClick = (e) => {
            // it works ?
            // if the modal exits and whats clicked on isnt that modal close the modal.
            if (modalRefrenceSetter.current && !modalRefrenceSetter.current.contains(e.target)) {
                setSelectedTicket(null);
            }
        };
        // if a ticket is clicked apply the event listener to trigger modal closure
        if (selectedTicket) {
            document.addEventListener("mousedown", handleOutsideModalClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideModalClick);
        };
    }, [selectedTicket]);

    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} workspace={workspace}/>

            {/* Top Buttons */}
            <div className="bg-secondary px-6 pt-6 mt-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/workspaceDashboard/${workspace.id}`, {state: {user, workspace}})}
                        className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                    >
                        <ArrowLeft size={20} className="mr-2"/>
                        Return to Workspace View
                    </button>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="text-white bg-primary px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                        >
                            Filter
                        </button>

                        <CreateTicketModal
                            user={user}
                            workspace={workspace}
                            onTicketCreated={fetchTickets}
                        />

                        <button
                            onClick={() => navigate(`/sprints/${workspace.id}`, {state: {user, workspace}})}
                            className="text-white bg-primary px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                        >
                            Sprint Management
                        </button>
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-white ml-8 mt-4">
                {/* change my title when  */}

                {labelFilter ? `${labelFilter} Tickets` : "All Tickets"}
            </h1>


            {/* Backlog Ticket Grid  */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-10 mt-6">
                {/*TO:TO REMEMEBER THIS ARRAY

                Array.isArray = Checks if array is a valid array (I need this for my messaging ???)
                Fixed my freaking out when loading from db : {Array.isArray(tickets) && tickets.length > 0 ? (REMEMBER 27/02/25)

                Map fields to the ticket

                */}

                {Array.isArray(tickets) && tickets.length > 0 ? (
                    tickets.filter(ticket => !labelFilter || ticket.label === labelFilter)
                        .map((ticket) => {
                            // TO:DO :  TIME FORMAT
                            const timestamp = new Date(ticket.createdAt);
                            const formattedTime = format(timestamp, "hh:mm a");
                            const formattedDate = format(timestamp, "MMM d, yyyy");

                            return (
                                <div
                                    key={ticket.id}
                                    className={`p-4 rounded-lg shadow transition cursor-pointer 
                                    ${ticket.highPriority ? "border-2 border-red-500 bg-primary hover:bg-accent" : "bg-primary hover:bg-accent"}`}
                                    onClick={() => setSelectedTicket(ticket)} // set the current ticket and open modal
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-white">{ticket.name}</h3>
                                        <span
                                            className="text-xs text-white bg-accent px-2 py-1 rounded">{`#${ticket.ticketNumber}`}</span>
                                    </div>
                                    <p className="text-sm text-white">{ticket.description}</p>
                                    <p className="text-white mt-1">Created by: {ticket.createdBy?.name || "Unknown"}</p>
                                    <p className="text-xs text-gray-400">
                                        Created: {formattedTime} • {formattedDate}
                                    </p>
                                </div>
                            );
                        })
                ) : (
                    <p className="text-white text-center">No tickets yet.</p>
                )}

                {/*
                  If the state is set to show modal
                  Apply the label as set label in state
                 Keeps the state offilter between pages
                  */}

                {showFilterModal && (
                    <FilterModal
                        onClose={() => setShowFilterModal(false)}
                        onApply={(label) => setLabelFilter(label)}
                        currentFilter={labelFilter}
                    />
                )}
            </div>
            {/*
            make outside click functionality
            pass in ticket
                  */}


            {selectedTicket && (
                <div className="bg-opacity-50 fixed inset-0 justify-center z-50 bg-black  flex items-center ">
                    <div ref={modalRefrenceSetter}>
                        <ShowTicketModal
                            onClose={() => setSelectedTicket(null)}
                            user={user}
                            workspace={workspace}
                            ticket={selectedTicket}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BacklogPage;
