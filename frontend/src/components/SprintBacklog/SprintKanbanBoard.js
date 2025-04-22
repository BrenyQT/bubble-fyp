import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { X } from "lucide-react";
import ManageSprintTicketsModal from "./ManageSprintTicketsModal";
import ShowTicketModal from "../BacklogManagement/ShowTicketModal";

const COLUMN_NAMES = ["Backlog", "In Progress", "In Review", "Done"]; // Task statuses as static


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
            className={` break-words relative p-3 bg-white text-black rounded-lg shadow-md border border-white cursor-pointer ${isDragging ? "opacity-50" : ""} ${highPriorityClass}`}
        >
            {/* show the picture if user is assigned  */}
            {task.assignedTo?.picture && (
                <img
                    src={task.assignedTo.picture}
                    alt={task.assignedTo.name || "Assigned User"}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full object-cover border-2 border-red-600 shadow-sm"
                />
            )}
            <div className="break-words whitespace-pre-wrap pr-12">

            {task.text || task.name}
        </div>
        </div>
    );
};

// Column component for each task column (Backlog, In Progress, etc.)
const Column = ({name, tasks, moveTask, onTicketClick}) => {

    // handle when a task is drop into one of the columns
    const [, drop] = useDrop({
        accept: "TASK",
        drop: (item) => moveTask(item.id, name), // Moves the task to a new column
    });

    // TO;DO I NEED TO MAKE THIS USE THE KANBAN BOARD TASK COMPONENT
    return (
        // assigns drop functionality to the div
        <div ref={drop} className="w-64 bg-accent p-4 rounded-lg shadow-md ">
            <h2 className="text-white font-bold text-lg mb-3 break-words">{name}</h2>
            <div className="space-y-3">
                {/* for some reason i have to check tasks is array idk man */}
                {Array.isArray(tasks) ? (
                    tasks
                        .filter((task) => task.status === name)
                        .map((task) => (
                            <KanbanBoardTask
                                key={task.id} task={task} moveTask={moveTask}
                                             onClick={() => onTicketClick(task)}
                            />
                        ))
                ) : (
                    <p className="text-white">No tasks available</p>
                )}
            </div>
        </div>
    );
};

const SprintKanbanModal = ({isOpen, onClose, sprint, user, workspace, onSetCurrent, onSprintDeleted}) => {

    const [tasks, setTasks] = useState([]); // state for tickets in a sprint
    const [isUpdating, setIsUpdating] = useState(false); // if a ticket is being assigned set the state so it cant be updated at the same time
    const [showTicketModal, setShowTicketModal] = useState(false); // when i click on a ticket iw anna show the modal
    const [selectedTicket, setSelectedTicket] = useState(null); // save the ticket i clicked on in state

    useEffect(() => {
        if (sprint?.id && workspace?.id) {
            fetch(`http://localhost:8080/sprints/getTicketsBySprint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({sprintId: sprint.id, workspaceId: workspace.id}),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setTasks(data); // update the tasks state to the list of tickets
                    }
                });
        }
    }, [sprint, workspace]);

    const moveTask = (taskId, updatedStatusOfTicket) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? {...task, status: updatedStatusOfTicket} : task
            )
        );

        fetch(`http://localhost:8080/tickets/updateStatus/${taskId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status: updatedStatusOfTicket}),
        }).catch((err) => console.error("cannot update status", err));
    };

    // modal to add/delete ticket from sprint
    const handleTicketAdditionToSprint = () => {
        setShowTicketModal(true);
    };

    // handle when a sprint is deleted
    const handleDeleteSprint = async () => {
        setIsUpdating(true);
        onClose();

        try {
            const response = await fetch(`http://localhost:8080/sprints/delete/${workspace.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({sprintId: sprint.id}),
            });

            if (response.ok) {
                onSprintDeleted?.(workspace.id); // when the sprint is deletd for the workspace
                alert("Sprint Deleted !!")

            }
        } catch (err) {
            console.error("cant delete sprint 2", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const setSprintAsCurrent = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(`http://localhost:8080/sprints/setCurrent`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sprintId: sprint.id,
                    workspaceId: workspace.id,
                }),
            });

            if (response.ok) {
                onSetCurrent?.(sprint.id);
                alert("Sprint set as current !!")
            }
        } catch (err) {
            console.error("Failed to set sprint as current:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket); // set modal state value true
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-secondary max-w-6xl w-full rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-red-500"
                >
                    <X size={24} />
                </button>

                <div className="flex justify-between items-center m-4 mb-6">
                    <h2 className="text-2xl font-bold text-white break-words w-0 flex-1">
                        {sprint?.name} - Sprint Board
                    </h2>
                    <div className="flex justify-start">
                        <button
                            onClick={setSprintAsCurrent}
                            className="flex items-center text-white bg-green-700 px-4 py-2 mr-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                        >
                            Set Current Sprint
                        </button>

                        <button
                            onClick={handleTicketAdditionToSprint}
                            className="flex items-center text-white bg-accent px-4 py-2 mr-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                        >
                            Edit Sprint Tickets
                        </button>

                        <button
                            onClick={handleDeleteSprint}
                            className="flex items-center text-white bg-red-700 px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                            disabled={isUpdating}
                        >
                            Delete Sprint
                        </button>
                    </div>
                </div>

                <DndProvider backend={HTML5Backend}>
                    <div className="flex justify-center space-x-6">
                        {COLUMN_NAMES.map((name) => (
                            <Column
                                key={name} // pass in the string value
                                name={name}
                                tasks={tasks}
                                moveTask={moveTask}// apply the move task functonality
                                onTicketClick={handleTicketClick} // modal stuff
                            />
                        ))}
                    </div>
                </DndProvider>

                <ManageSprintTicketsModal
                    isOpen={showTicketModal}
                    onClose={() => setShowTicketModal(false)} // ManageSprintTicketsModal:CONTROL,  dont show the modal
                    sprintId={sprint.id}
                    workspaceId={workspace.id}
                    onTicketsAdded={() => {
                        // get tickets for this sprint uuid
                        fetch(`http://localhost:8080/sprints/getTicketsBySprint`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                sprintId: sprint.id,
                                workspaceId: workspace.id,
                            }),
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (Array.isArray(data)) {
                                    setTasks(data);
                                }
                            });
                        setShowTicketModal(false); // swap them
                    }}
                />

                {/* show selected ticket modal */}
                <ShowTicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    user={user}
                    onTicketUpdated={() => {
                        fetch(`http://localhost:8080/sprints/getTicketsBySprint`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                sprintId: sprint.id,
                                workspaceId: workspace.id,
                            }),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (Array.isArray(data)) setTasks(data);
                            });
                    }}
                />
            </div>
        </div>
    );
};

export default SprintKanbanModal;
