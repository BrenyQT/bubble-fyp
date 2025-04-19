import React from "react";
import {X} from "lucide-react";

const CreateGanttChartTaskModal = ({
                                       showModal, // passed in state which contols modal open
                                       onClose, // used to close modal

                                       label, // task name state
                                       setLabel, // sets the task name state

                                       startDate, // start date state
                                       setStartDate, // sets start date state

                                       endDate, // end date state
                                       setEndDate, // sets end date state

                                       color,  //  color state
                                       setColor, // set colour state

                                       handleAddBar // parent component function
                                   }) => {
    // jiras colours
    const predefinedColors = [
        "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c",
        "#34495e", "#e67e22", "#95a5a6", "#16a085"
    ];

    if (!showModal) return null; // safety net

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-secondary p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-white hover:text-red-600 text-xl">
                        <X/>
                    </button>
                </div>
                <h2 className="text-lg font-bold text-white mb-4">Add Task</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-white">Task Label</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)} // set state of parent compnent
                            className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-white">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-white">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-white">Color</label>
                        <div className="flex gap-2 flex-wrap">


                            {/* map out predefined  colours */}
                            {predefinedColors.map((colorOption, idx) => (
                                <div
                                    key={idx}
                                    className={`w-8 h-8 rounded-full cursor-pointer ${colorOption === color ? "border-4 border-blue-500" : ""}`}
                                    style={{backgroundColor: colorOption}}
                                    onClick={() => setColor(colorOption)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleAddBar} // parent component handles addition
                        className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGanttChartTaskModal;

