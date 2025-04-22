import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"; // for my bar setup
import Navbar from "../../components/Navbar/Navbar";
import { ArrowLeft, X } from "lucide-react";
import CreateGanttChartTaskModal from "../../components/GanttChart/CreateGanttChartTaskModal";

const GanttChart = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { workspace, user } = location.state || {};


    const [bars, setBars] = useState([]); // array of GanttChart Tasks

    const [GanttChartTaskName, setGanttChartTaskName] = useState(""); // Label of Gantt
    const [startDate, setStartDate] = useState(""); // start date of a GanttChartTask
    const [endDate, setEndDate] = useState(""); // end date of a GanttChartTask
    const [colour, setColour] = useState("#3498db"); // colour default to blue

    const [showCreateGanttChartTaskModal, setShowCreateGanttChartTaskModal] = useState(false); // modal for adding task to gantt chart





    // My array of dates within the current month for Gantt chart
    const daysOfCurrentMonth = eachDayOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
    });



    useEffect(() => {
        if (!workspace || !user) return; // FINAL TO:DO I do this for every page is there a better way ?

        const fetchTasks = async () => {
            try {

                // get already created tasks
                const response = await fetch(`http://localhost:8080/gantt/${workspace.id}`);
                const data = await response.json(); // Parser the JSON obj

                // map the JSON OBJ to Gantt Chart Task
                const loadedGanttChartTask = data.map((task) => ({
                    id: task.id,
                    label: task.label,
                    start: new Date(task.startDate),
                    end: new Date(task.endDate),
                    color: task.color,
                }));

                setBars(loadedGanttChartTask); // set the state of already created tasks
            } catch (err) {
                console.error(err);
            }
        };

        fetchTasks(); // update screen when loaded
    }, [workspace]);






    // Logic for when a Gantt Chart task is added from Modal
    const handleAddBar = async () => {
        if (!GanttChartTaskName || !startDate || !endDate) return;  // safety net to see if form data is present.

        // create task from the state set by the modal
        const newTask = {
            label: GanttChartTaskName,
            startDate,
            endDate,
            color: colour,
            workspace: { id: workspace.id },
        };

        try {
            const response = await fetch("http://localhost:8080/gantt/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // ive passed this in my whole project but i i think its obly needed when JWT is in http header
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                const saved = await response.json(); // waiting for 200 from backend
                setBars([
                    ...bars, // keep the cuurent state but add the newly create one to the end
                    {
                        id: saved.id,
                        label: saved.label,
                        start: new Date(saved.startDate),
                        end: new Date(saved.endDate),
                        color: saved.color,
                    },
                ]);
            }
        } catch (err) {
            console.error("cant save the gantt chart task ", err);
        }

        // reset states
        setGanttChartTaskName("");
        setStartDate("");
        setEndDate("");
        setColour("#3498db"); // needs to be default set as blue so a colour is shown
        setShowCreateGanttChartTaskModal(false);
    };






    const handleRemoveBar = async (whichTaskShouldBeRemoved) => {
        const taskToDelete = bars[whichTaskShouldBeRemoved]; // had to set i to an array i couldnt just delete one bc of parsing

        try {
            await fetch(`http://localhost:8080/gantt/delete/${taskToDelete.id}`, {
                headers: { "Content-Type": "application/json" }, // ive passed this in my whole project but i i think its obly needed when JWT is in http header
                method: "DELETE",
            });
            setBars((prevBars) => prevBars.filter((_, i) => i !== whichTaskShouldBeRemoved)); //remove the one im deleting from state
        } catch (err) {
            console.error("cannot delete task for gantt chart ", err);
        }
    };




    //gets the index for where a day should be in the current month
    const getDayPosition = (date) => {
        return daysOfCurrentMonth.findIndex(
            (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
        );
    };





    return (
        <div className="bg-secondary min-h-screen flex flex-col pt-12">
            <Navbar user={user} workspace={workspace} />
            <div className="bg-secondary px-6 pt-6 mt-6">
                <button
                    onClick={() =>
                        navigate(`/workspaceDashboard/${workspace.id}`, {
                            state: { user, workspace },
                        })
                    }
                    className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition mb-8"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Return to Workspace View
                </button>
                <h1 className="text-4xl font-bold text-white text-center my-6">
                    {workspace.name} GanttChart
                </h1>
            </div>

            {/* Top bar of the Gantt Chart */}
            <div className="grid grid-cols-[150px_repeat(31,_1fr)] border-b sticky top-28 z-10 bg-primary text-white shadow-md">
                <div className="bg-accent font-semibold text-center py-2 border-r border-white/20">
                    Task
                </div>



                {/* Create the indexes length for fronetend  */}
                {daysOfCurrentMonth.map((day, i) => (
                    <div key={i} className="text-xs text-center px-1 py-2 border-l border-white/10">
                        {format(day, "d")}
                    </div>
                ))}
            </div>



            {/* map the tasks in Gantt Chart to chart based off start and end date
             bruh i think this works now
             */}
            {bars.map((bar, idx) => {


                const startDateAsId = getDayPosition(bar.start);
                const endDayAsId = getDayPosition(bar.end);


                return (
                    <div key={idx} className="grid grid-cols-[150px_repeat(31,_1fr)] items-center border-b border-white/10">
                        <div className="px-2 py-1 truncate border-r border-white/10 text-sm font-medium text-white flex items-center justify-between gap-2 bg-primary">
                            <span>{bar.label}</span>
                            <button
                                onClick={() => handleRemoveBar(idx)} // remove a Gant chart task
                                className="text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-200 rounded-full w-5 h-5 flex items-center justify-center transition"
                                title="Remove Task"
                            >
                                <X size={14} />
                            </button>
                        </div>



                        {daysOfCurrentMonth.map((_, index) => (
                            <div
                                key={index}
                                className={`h-6 border-l border-white/5 ${index >= startDateAsId && index <= endDayAsId ? "" : "bg-white"}`} // put colour between dates of a task and white space
                                style={{
                                    backgroundColor: index >= startDateAsId && index <= endDayAsId ? bar.color : "white",
                                }}
                            />
                        ))}
                    </div>
                );
            })}

            <button
                onClick={() => setShowCreateGanttChartTaskModal(true)} // open the modal to add a task
                className="fixed bottom-6 right-6 bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-full shadow-lg font-semibold"
            >
                + Add Task
            </button>

            <CreateGanttChartTaskModal
                // states to show model
                showModal={showCreateGanttChartTaskModal}
                onClose={() => setShowCreateGanttChartTaskModal(false)}

                label={GanttChartTaskName}
                setLabel={setGanttChartTaskName}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                color={colour}
                setColor={setColour}

                handleAddBar={handleAddBar} // pass data back to parent to handle
            />
        </div>
    );
};

export default GanttChart;
