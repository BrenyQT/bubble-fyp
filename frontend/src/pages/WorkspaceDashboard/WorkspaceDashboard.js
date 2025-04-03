import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Modal from "react-modal";
import { Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import TodoListTaskModal from "../../components/WorkspaceDashboard/TodoListTaskModal";
import DashboardCard from "../../components/WorkspaceDashboard/DashBoardCard";

const WorkspaceDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const workspace = location.state?.workspace || null; // set workpsace
    const user = location.state?.user || null; // set user

    const [tasks, setTasks] = useState([]); // To do tasks state
    const [newTask, setNewTask] = useState(""); // capture the new task when added
    const [isModalOpen, setIsModalOpen] = useState(false); // stste for add task modal

    useEffect(() => {
        if (workspace && user) {
            fetchTasks();
        }
    }, [workspace, user]);

    // retrieve a users tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:8080/todo/${user.id}/${workspace.id}`);
            const data = await response.json();
            setTasks(data); // populate tasks state
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // add a new To do task
    const addTask = async () => {
        if (!newTask.trim()) return;

        // Task obj as payload
        const payload = {
            task: newTask,
            userId: user.id,
            workspaceId: workspace.id,
        };

        try {
            const response = await fetch("http://localhost:8080/todo/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setNewTask("");
                setIsModalOpen(false);
                fetchTasks();
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    //Chnage task.completed
    const changeTaskCompleted = async (taskId, completed) => {
        try {
            await fetch(`http://localhost:8080/todo/update/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !completed }), // send opposite :D
            });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    //remove a task from list
    const deleteTask = async (taskId) => {
        try {
            await fetch(`http://localhost:8080/todo/delete/${taskId}`, {
                method: "DELETE",
            });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    if (!workspace || !user) {
            () =>  navigate("/viewWorkspace")
    }

    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} workspace={workspace} />

            {/* Top Buttons Row */}
            <div className="bg-secondary px-6 pt-6 mt-6 flex justify-between">
                <button
                    onClick={() => navigate("/viewWorkspace", { state: { user } })}
                    className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Return to Workspace View
                </button>

                <button
                    onClick={() => navigate("/GanttChart/", { state: { user, workspace } })}
                    className="flex items-center text-white bg-primary px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90"
                >
                    View GanttChart
                    <ArrowRight size={20} className="ml-2" />
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-6 px-6 flex-1">
                {/* Cards Section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DashboardCard
                        title="Messaging"
                        onClick={() =>
                            navigate(`/workspaceChat/${workspace.id}`, {
                                state: {
                                    workspace,
                                    user,
                                },
                            })
                        }
                    />
                    <DashboardCard
                        title="Current Sprint"
                        onClick={() =>
                            navigate(`/kanban/${workspace.id}`, { state: { workspace, user } })
                        }
                    />
                    <DashboardCard
                        title="Backlog Management"
                        onClick={() =>
                            navigate(`/tickets/${workspace.id}`, { state: { workspace, user } })
                        }
                    />
                    <DashboardCard
                        title="Completed Sprints"
                        onClick={() =>
                            navigate(`/completedSprints/${workspace.id}`, {
                                state: {
                                    workspace,
                                    user,
                                },
                            })
                        }
                    />
                </div>

                {/*TODO AND ANNOUNCEMENTS*/}
                <div className="w-full md:w-[300px] flex flex-col space-y-6">
                    {/* Announcements */}
                    <div className="bg-primary text-white p-5 rounded-lg shadow-md flex flex-col flex-1">
                        <h2 className="text-xl font-bold border-b pb-2 mb-3">Announcements</h2>
                        <div className="bg-accent text-white p-3 rounded-lg shadow-md flex-1 ">
                            <p>Maybe someday this will work !</p>
                        </div>
                    </div>

                    {/* To-Do List */}
                    <div className="bg-primary text-white p-5 rounded-lg shadow-md flex flex-col flex-1">
                        <h2 className="text-xl font-bold border-b pb-2 mb-3">To-Do List</h2>

                        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent flex-1 mb-2">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        onClick={() => changeTaskCompleted(task.id, task.completed)}
                                        className={`p-3 rounded-lg shadow-md cursor-pointer flex justify-between items-center ${
                                            task.completed ? "bg-green-600 line-through" : "bg-gray-700" // custom css if else 
                                        }`}
                                    >
                                        {task.task}
                                        <Trash2
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent propogation upwards
                                                deleteTask(task.id);
                                            }}
                                            className="text-red-400 hover:text-red-500"
                                            size={18}
                                        />
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-300">No tasks yet.</p>
                            )}
                        </ul>

                        <button
                            onClick={() => setIsModalOpen(true)} //open add a task modal
                            className="mt-3 w-full bg-accent text-white px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>
            </div>
            <TodoListTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newTask={newTask}
                setNewTask={setNewTask}
                onSave={addTask}
            />
        </div>
    );
};

export default WorkspaceDashboard;
