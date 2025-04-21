import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {Trash2, ArrowLeft, ArrowRight} from "lucide-react";
import TodoListTaskModal from "../../components/WorkspaceDashboard/TodoListTaskModal";
import DashboardCard from "../../components/WorkspaceDashboard/DashBoardCard";
import CreateAnnouncementModal from "../../components/WorkspaceDashboard/CreateAnnouncementModal";
import ShowAnnouncementModal from "../../components/WorkspaceDashboard/ShowAnnouncementModal";
import { useCallback } from "react"; // temp this might fix the problem



// TO:DO tidy this up and make more readable

const WorkspaceDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const workspace = location.state?.workspace || null; // set workspace
    const user = location.state?.user || null; // set user

    const [tasks, setTasks] = useState([]); // To do tasks state
    const [newTask, setNewTask] = useState(""); // capture the new task when added
    const [isModalOpen, setIsModalOpen] = useState(false); // state for add task modal

    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState("");
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);


    // retrieve a user's tasks
    // Kept refrendering so i have to add use callback
    // i think this is ok ?
    const fetchTasks = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/todo/${user.id}/${workspace.id}`);
            const data = await response.json();
            setTasks(data); // populate tasks state
        } catch (error) {
            console.error("fetch tasks error :", error);
        }
    }, [user, workspace]);
    // feth this way instead
    const fetchAnnouncements = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/getAnnouncements/${workspace.id}`);
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error("fetch announcements error:", error);
        }
    }, [workspace]);

    useEffect(() => {
        if (workspace && user) {
            fetchTasks();
            fetchAnnouncements();
        }
    }, [workspace, user, fetchTasks, fetchAnnouncements]);



    // add a new To do task for a user in a workpsace
    const addTask = async () => {
        if (!newTask.trim()) return;

        //concat all user and to do infor into a payload
        const payload = {
            task: newTask,
            userId: user.id,
            workspaceId: workspace.id,
        };

        try {
            const response = await fetch("http://localhost:8080/todo/add", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setNewTask(""); // update the input state to default
                setIsModalOpen(false); // update to do modal state to close
                fetchTasks(); // update the tasks state with the newly added task
            }
        } catch (error) {
            console.error("couldnt add task /addTask", error);
        }
    };



    // Change task.completed in backend which helps update my frontend css
    const changeTaskCompleted = async (taskId, completed) => {
        try {
            await fetch(`http://localhost:8080/todo/update/${taskId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({completed: !completed}), // send opposite :D
            });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };


    // Remove a task from the list
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

    // Early return if workspace or user is not available
    if (!workspace || !user) {
        navigate("/viewWorkspace");
        return null; // kept rerendering ??
    }


    const addAnnouncement = async () => {
        if (!newAnnouncement.trim()) return; // safety net

        const payload = {
            content: newAnnouncement,
            workspaceId: workspace.id,
            authorId: user.id,
        };

        try {

            const response = await fetch("http://localhost:8080/addAnnouncements", {
                method: "POST",
                headers: {"Content-Type": "application/json"}, // fromatting
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setNewAnnouncement("");
                setIsAnnouncementModalOpen(false);
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("cannrt add announcement ", error);
        }
    };



    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} workspace={workspace}/>

            {/* Top Buttons Row */}
            <div className="bg-secondary px-6 pt-6 mt-6 flex justify-between">
                <button
                    onClick={() => navigate("/viewWorkspace", {state: {user}})}
                    className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                    <ArrowLeft size={20} className="mr-2"/>
                    Return to Workspace View
                </button>

                <button
                    onClick={() => navigate("/GanttChart/", {state: {user, workspace}})}
                    className="flex items-center text-white bg-primary px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90"
                >
                    View GanttChart
                    <ArrowRight size={20} className="ml-2"/>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-6 px-6 flex-1">
                {/* Cards Section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/*Messaging Panel*/}
                    <DashboardCard
                        title="Messaging"
                        onClick={() =>
                            navigate(`/workspaceChat/${workspace.id}`, {
                                state: {workspace, user,},
                            })
                        }
                    />


                    {/*Current Sprint Panel*/}
                    <DashboardCard
                        title="Current Sprint"
                        onClick={() =>
                            navigate(`/kanban/${workspace.id}`, {state: {workspace, user}})
                        }
                    />


                    {/*Backlog Management Panel */}
                    <DashboardCard
                        title="Backlog Management"
                        onClick={() =>
                            navigate(`/tickets/${workspace.id}`, {state: {workspace, user}})
                        }
                    />


                    {/* Completed Sprints  Panel*/}
                    <DashboardCard
                        title="Completed Sprints"
                        onClick={() =>
                            navigate(`/completedSprints/${workspace.id}`, {state: {workspace,user,},})
                        }
                    />

                </div>

                {/*To DO AND ANNOUNCEMENTS*/}
                <div className="w-full md:w-[300px] flex flex-col space-y-6">



                    {/* Announcements
                    TO:DO MAKE THIS EITHER EVERYONE CAN DO IT OR A MEETINGS
                    */}

                    <div className="bg-primary text-white p-5 rounded-lg shadow-md flex flex-col flex-1">
                        <h2 className="text-xl font-bold border-b pb-2 mb-3">Announcements</h2>
                        {/* FINAL TO:DO make this scrollable */}
                        <ul className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent flex-1 mb-2">
                            {announcements.length > 0 ? (
                                announcements.map((a) => (
                                    <li
                                        key={a.id}
                                        onClick={() => setSelectedAnnouncementId(a.id)}
                                        className="p-3 rounded-lg shadow-md bg-secondary flex justify-between items-center cursor-pointer hover:bg-accent transition"
                                    >
                                        <span className="break-words w-full">{a.content}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-white">No announcements yet.</p>
                            )}
                        </ul>


                        <button
                            onClick={() => setIsAnnouncementModalOpen(true)}
                            className="mt-3 w-full bg-accent text-white px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                        >
                            + Add Announcement
                        </button>
                    </div>




                    {/* To-Do List */}
                    <div className="bg-primary text-white p-5 rounded-lg shadow-md flex flex-col flex-1">
                        <h2 className="text-xl font-bold border-b pb-2 mb-3">To-Do List</h2>

                        <ul className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent flex-1 mb-2">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        onClick={() => changeTaskCompleted(task.id, task.completed)}
                                        className={` hover:bg-accent transition p-3 rounded-lg shadow-md cursor-pointer flex justify-between items-center gap-2 ${
                                            task.completed ? "bg-green-600 line-through" : "bg-secondary"
                                        }`}
                                    >
                                        <span className="break-words overflow-hidden text-ellipsis flex-1">{task.task}</span>

                                        <Trash2
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteTask(task.id);
                                            }}
                                            className="text-red-400 hover:text-red-500 flex-shrink-0"
                                            size={18}
                                        />
                                    </li>

                                ))
                            ) : (
                                <p className="text-white">No tasks yet.</p>
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
                isOpen={isModalOpen} //state for it being open
                onClose={() => setIsModalOpen(false)} // when close update parent component
                newTask={newTask}
                setNewTask={setNewTask}
                onSave={addTask} // when i save add the a task
            />
            <CreateAnnouncementModal
                isOpen={isAnnouncementModalOpen}
                onClose={() => setIsAnnouncementModalOpen(false)}
                newAnnouncement={newAnnouncement}
                setNewAnnouncement={setNewAnnouncement} // modal will be used to set state
                onSave={addAnnouncement}
            />

            <ShowAnnouncementModal
                announcementId={selectedAnnouncementId} // pass in annaouncement
                onClose={() => setSelectedAnnouncementId(null)} // rest state when closing
            />


        </div>
    );
};

export default WorkspaceDashboard;
