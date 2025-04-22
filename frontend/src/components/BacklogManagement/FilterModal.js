import React, {useState} from "react";
import {X} from "lucide-react"; // X button to make cleaner ui

const LABEL_OPTIONS = [
    "Epic", "Story", "Task", "Bug", "Chore", "Spike", "Improvement", "Support" // Type states for a ticket
];

const FilterModal = ({onClose, onApply, currentFilter}) => {
    const [selected, setSelected] = useState(currentFilter); // set selected Type Filter

    return (
        <div className=" flex items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-secondary rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-end">
                    <button onClick={onClose}
                            className="text-white hover:text-red-900 text-xl"><X/></button>
                </div>
                <h2 className="text-xl font-bold mb-4 text-white">Filter Tickets by Label</h2>
                <div className="space-y-2">
                    {LABEL_OPTIONS.map((label) => (
                        <label key={label} className="flex items-center space-x-2 ">
                            <input
                                type="radio" name="label" value={label} checked={selected === label}
                                onChange={() => setSelected(label)} // map the Type states to radio buttons so only one can be selected when selected update the state

                                className="form-radio text-primary"
                            />
                            <span className="text-white">{label}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-between mt-6">
                    {/*Parent component told taht no filter set */}
                    <button onClick={() => {
                        onApply("");
                        onClose();
                    }}
                            className="hover:bg-accent text-white bg-primary px-4 py-2 bg-accent text-white rounded hover:bg-accnt">Reset
                    </button>
                    <div className="space-x-2">
                        {/*Pass back selected filter  */}

                        <button onClick={() => {
                            onApply(selected);
                            onClose();
                        }} className=" rounded hover:bg-accent px-4 py-2 bg-primary text-white">Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default FilterModal;

