import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const TodoListTaskModal = ({ isOpen, onClose, newTask, setNewTask, onSave }) => {
    const modalRef = useRef();

    // TO:DO I need to gp through my modals and add this cool feature
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null; // close

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div ref={modalRef} className="bg-secondary p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-white hover:text-black text-xl">
                        <X />
                    </button>
                </div>
                <h2 className="text-xl font-semibold mb-4 text-white">New Task</h2>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                    placeholder="Enter task..."
                />
                <button
                    onClick={onSave}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                    Save Task
                </button>
            </div>
        </div>
    );
};

export default TodoListTaskModal;
