import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DndProvider, useDrag, useDrop} from "react-dnd"; // Kanban board and ticket
import {HTML5Backend} from "react-dnd-html5-backend"; // Native drag and drop support
import {ArrowLeft} from "lucide-react"; // Back button icon
import ShowTicketModal from "../../components/BacklogManagement/ShowTicketModal";
import Navbar from "../../components/Navbar"; // Modal for ticket details


const COLUMN_NAMES = ["Backlog", "In Progress", "In Review", "Done"]; // Task statuses



// Represents a task on the kanban board
const KanbanBoardTask = ({task, onClick}) => {

    // hook from dnd which enables drag functionality  controls the appearence when dragging
    const [{isDragging}, drag] = useDrag({
        type: "TASK", // make it a task
        item: {id: task.id, column: task.column}, // task info
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(), // monitors and updates the drag state
        }),
    });



    // Tailwind CSS condition for KanbanBoardTask
    const highPriorityClass = task.highPriority ? "border-2 border-red-600" : "";

    return (
        <div
            ref={drag} // adds the drag functionality
            onClick={onClick} // shows the showTicketModal
            className={`relative p-3 bg-white text-black rounded-lg shadow-md border border-gray-300 cursor-pointer ${isDragging ? "opacity-50" : ""} ${highPriorityClass}`}
        >
            {/* show the picture if user is assigned  */}

            {task.assignedTo?.picture && (
                <img
                    src={task.assignedTo.picture}
                    alt={task.assignedTo.name || "Assigned User"}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full object-cover border-2 border-red-600 shadow-sm"
                />
            )}


            {task.text || task.name}
        </div>
    );
};




// Column component for each task column (Backlog, In Progress, etc.)
const Column = ({name, tasks, moveTask, onTicketClick}) => {

    // handle when a task is drop into one of the columns
    const [, drop] = useDrop({
        accept: "TASK", // accept task
        drop: (item) => moveTask(item.id, name), // Moves the task to a new column
    });
    //
    return (
        // assigns drop functionality to the div
        <div ref={drop} className="w-64 bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-white font-bold text-lg mb-3">{name}</h2>
            <div className="space-y-3">
                {tasks.map((task) => (
                    <KanbanBoardTask
                        key={task.id}
                        task={task}
                        moveTask={moveTask}
                        onClick={() => onTicketClick(task)} // Click opens modal
                    />
                ))}
            </div>
        </div>
    );
};

// TO:DO MAKE A KANBAN COMPONENT AND ST FOR BOTH PAGES
// page component
const KanbanBoard = () => {


    const navigate = useNavigate();
    const location = useLocation();

    const workspace = location.state?.workspace; // get workspace
    const user = location.state?.user; // get user

    const [tickets, setTasks] = useState([]); // set stae for tickets to go on board
    const [selectedTicket, setSelectedTicket] = useState(null); //state for when a ticket is clicked on





    // Define move task by passing in update status ticket and set column
    const moveTask = (taskId, updatedStatusOfTicket) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? {...task, status: updatedStatusOfTicket} : task //update frontend state
            )
        );

        // update backend state
        fetch(`http://localhost:8080/tickets/updateStatus/${taskId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status: updatedStatusOfTicket}),
        })
            .then(() => fetchTasks()) // UPDATE FRONTEND
            .catch((err) => console.error("cannot update status :", err));
    };



    // gets all the tickets within a current sprint in a workspace
    const fetchTasks = () => {
        fetch(`http://localhost:8080/sprints/getCurrentSprintTickets/${workspace.id}`)
            .then((res) => res.json())
            .then((data) => {
                //serialisation of req bc i cant garuntee data is array [0,1]
                if (Array.isArray(data)) {
                    const listOfTasks = data.map((ticket) => ({
                        // i was having problems trying to access this without mapping manually
                        id: ticket.id,
                        text: ticket.name,
                        column: ticket.status,
                        assignedTo: ticket.assignedTo,
                        highPriority: ticket.highPriority,
                        ...ticket, // keep the rest of the properties
                    }));
                    setTasks(listOfTasks);
                }
            })
            .catch((err) => console.error(",cant load the tickets" ,  err));
    };

    // fetch tasks when page opens
    useEffect(() => {
        if (workspace?.id) {
            fetchTasks();
        }
    }, [workspace]);

    // safety net to return to home
    if (!workspace || !user) {
        navigate("/");
        return null;
    }

    // when the mark as complete button is hit
    // FIX THIS DIRTY CODE
    const markSprintAsCompleted = () => {
        // no tickets so i cant get sprint ID
        if (!tickets || tickets.length === 0) {
            alert("No tickets in the sprint");
            return;
        }

        const firstTicket = tickets[0];
        const ticketId = firstTicket.id; // find the sprint which this ticket has

        fetch(`http://localhost:8080/sprints/getSprintByTicket/${ticketId}`)
            .then((response) => response.json())
            .then((sprintData) => {
                if (!sprintData || !sprintData.id) {
                    alert("cant find the sprint");
                    return;
                }

                // pass the sprint UUID into completed
                fetch(`http://localhost:8080/sprints/markSprintAsCompleted/${sprintData.id}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                })
                    .then((response) => {
                        if (response.ok) {
                            alert("Sprint and tickets marked as completed !! ");
                            setTasks([]); // Empty the tasks array to reflect the completed sprint
                        } else {
                            alert("cant complete sprint ");
                        }
                    })
            });
    };



    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} workspace={workspace}/>

            <div className="bg-secondary px-6 pt-6 mt-6 flex justify-between">
                {/* Workspace Button */}
                <button
                    onClick={() =>
                        navigate(`/workspaceDashboard/${workspace.id}`, {
                            state: {user, workspace},
                        })
                    }
                    className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                    <ArrowLeft size={20} className="mr-2"/>
                    Return to Workspace View
                </button>

                {/*Completed Button */}
                <button
                    onClick={markSprintAsCompleted}
                    className="flex items-center text-white bg-green-500 px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                    Mark Sprint as Completed
                </button>
            </div>



            <div>
                {/*DND provider inherits native HTML drag drop functionality */}

                <DndProvider backend={HTML5Backend}>
                    <div className="bg-secondary min-h-screen flex flex-col pt-12">
                        <h1 className="text-white text-2xl font-bold mb-4 text-center">
                            {`${workspace.name} (Current Sprint) - Kanban Board`}
                        </h1>

                        <div className="flex justify-center space-x-6 p-6">
                            {/* Create each of the columns based off my static labels  */}

                            {COLUMN_NAMES.map((name) => (
                                <Column
                                    key={name}
                                    name={name}
                                    tasks={tickets.filter((task) => task.column === name)} //sets the task column based on column name
                                    moveTask={moveTask} // inherit move task method
                                    onTicketClick={(ticket) => setSelectedTicket(ticket)} // Click opens modal for that ticket by updateing state
                                />


                            ))}
                        </div>
                    </div>
                </DndProvider>
            </div>

            <ShowTicketModal
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)} // remove state variable
                user={user} // for assigning
                onTicketUpdated={fetchTasks} // update this page
            />
        </div>
    );


};

export default KanbanBoard;
