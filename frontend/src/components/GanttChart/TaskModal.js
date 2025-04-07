// components/TaskModal.js
import React from "react";
import { X } from "lucide-react";

const TaskModal = ({ showModal, onClose, label, setLabel, startDate, setStartDate, endDate, setEndDate, color, setColor, handleAddBar }) => {
    const predefinedColors = [
        "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c",
        "#34495e", "#e67e22", "#95a5a6", "#16a085"
    ];
    const InputField = ({ label, type = "text", value, onChange }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );

    return (
        showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-secondary p-6 rounded-lg shadow-lg w-full max-w-md">
                    <div className="flex justify-end">
                        <button onClick={onClose} className="text-white hover:text-black text-xl">
                            <X />
                        </button>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-4">Add Task</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="Task Label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                        <InputField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <InputField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-white">Color</label>
                            <div className="flex gap-2">
                                {predefinedColors.map((colorOption, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-8 h-8 rounded-full cursor-pointer ${colorOption === color ? "border-4 border-blue-500" : ""}`}
                                        style={{ backgroundColor: colorOption }}
                                        onClick={() => setColor(colorOption)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={handleAddBar} className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-lg text-sm font-semibold transition">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default TaskModal;
