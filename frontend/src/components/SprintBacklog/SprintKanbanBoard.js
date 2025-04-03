import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; // inherits browser drag and drop
import { X } from "lucide-react";

const COLUMN_NAMES = ["Backlog", "To Do", "In Progress", "Done"]; // static array of ticket TYPES

const Task = ({ task, moveTask }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "TASK",
        item: { id: task.id, column: task.status },// register  the draggable and columns
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(), // monitors if its dragging to help apply tailwind effect
        }),
    });

    return (
        <div
            ref={drag} // sets a drag component in which it can be placed in useDrag
            className={`p-3 bg-white text-black rounded-lg shadow-md border border-gray-300 cursor-pointer ${
                isDragging ? "opacity-50" : "" // check 
            }`}
        >
            {task.text || task.name}
        </div>
    );
};

const Column = ({ name, tasks, moveTask }) => {
    const [, drop] = useDrop({ // set as useDrop which
        accept: "TASK",
        drop: (item) => moveTask(item.id, name),
    });

    // checking if the   array is a poluated array
    // sick mapping of a task bases on status
    return (
        <div ref={drop} className="w-64 bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-white font-bold text-lg mb-3">{name}</h2>
            <div className="space-y-3">
                {Array.isArray(tasks) ? (
                    tasks.filter((task) => task.status === name).map((task) => (
                        <Task key={task.id} task={task} moveTask={moveTask} />
                    ))
                ) : (
                    <p className="text-white">No tasks available</p>
                )}
            </div>
        </div>
    );
};

const SprintKanbanModal = ({ isOpen, onClose, sprint, workspace, onSetCurrent }) => {
    const [tasks, setTasks] = useState([]); //  stes task state from db
    const [isUpdating, setIsUpdating] = useState(false);

    // if a sprint loaded into board
    useEffect(() => {
        if (sprint?.id) {
            fetch(`http://localhost:8080/tickets/getTicketsBySprint/${sprint.id}`)
                .then((res) => res.json())
                .then((data) => {
                    // Ensure data is an array
                    if (Array.isArray(data)) { // check for a populated array before setting
                        setTasks(data);
                    } else {
                        console.error("Expected an array of tasks, but received:", data);
                    }
                })
                .catch((err) => console.error("Failed to load sprint tasks:", err));
        }
    }, [sprint]);

    // pass in id and status update
    const moveTask = (taskId, newStatus) => {
        setTasks((prevTasks) => // update the state
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task // update ticket obj status
            )
        );

        fetch(`http://localhost:8080/tickets/updateStatus/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        }).catch((err) => console.error("Status update failed", err));
    };

    // TO:DO THIS THINGS BROKEN
    const setSprintAsCurrent = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(`http://localhost:8080/sprints/setCurrent/${sprint.id}`, {
                method: "PUT",
            });
            if (response.ok) {
                onSetCurrent?.(sprint.id);
            }
        } catch (err) {
            console.error("Failed to set sprint as current:", err);
        } finally {
            setIsUpdating(false);
        }
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

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {sprint?.name} - Sprint Board
                    </h2>
                    {/*TO:DO SORT THIS SO I CAN SET A SPRINT AS CURRENT */}
                </div>
                {/*Board */}

                <DndProvider backend={HTML5Backend}>
                    <div className="flex justify-center space-x-6">
                        {COLUMN_NAMES.map((name) => (
                            <Column
                                key={name}
                                name={name}
                                tasks={tasks}
                                moveTask={moveTask}
                            />
                        ))}
                    </div>
                </DndProvider>
            </div>
        </div>
    );
};

export default SprintKanbanModal;
