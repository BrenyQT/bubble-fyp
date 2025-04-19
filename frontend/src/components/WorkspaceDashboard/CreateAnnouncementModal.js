import { X } from "lucide-react";


const CreateAnnouncementModal = ({ isOpen, onClose, newAnnouncement, setNewAnnouncement, onSave }) => {


    if (!isOpen) return null; // safety net

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-secondary p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-white hover:text-red-500 text-xl">
                        <X />
                    </button>
                </div>

                <h2 className="text-xl font-semibold mb-4 text-white">New Announcement</h2>

                <textarea
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)} // need to pass content announcement back to parent
                    placeholder="Type full announcement here..."
                    className="w-full p-3 rounded-lg bg-white text-black border border-gray-600 resize-none h-32 mb-4"
                />

                <button
                    onClick={onSave}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                    Save Announcement
                </button>
            </div>
        </div>
    );
};

export default CreateAnnouncementModal;
