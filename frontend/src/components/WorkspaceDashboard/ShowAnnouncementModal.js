import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import format from "date-fns/format"; // formats my Date() type 

const ShowAnnouncementModal = ({ announcementId, onClose }) => {
    
    const [announcement, setAnnouncement] = useState(null); // the announcement which needs to be mapped to modal 
    const [loading, setLoading] = useState(true); // i think adding a lock on editing is important i need to do more research on locks and semaphors

    
    
    
    
    
    useEffect(() => {
        const fetchAnnouncement = async () => {
            if (!announcementId) return; // safety net 

            try {
                const response = await fetch(`http://localhost:8080/announcement/${announcementId}`);
                const data = await response.json();
                setAnnouncement(data); // set the announcement state when retrieved from DB 
            } catch (err) {
                console.error("cant load announcement from backend ", err);
            } finally {
                setLoading(false); // now it can be shown 
            }
        };

        fetchAnnouncement();
    }, [announcementId]);
    
    
    
    

    // announcement not got or loading 
    if (!announcementId || loading) return null; 
    if (!announcement) return null;
    
    const timestamp = announcement.createdAt && !isNaN(new Date(announcement.createdAt))
        ? new Date(announcement.createdAt)
        : null;
    
    
    // format time to be show of the froentend 
    const formattedTime = timestamp ? format(timestamp, "hh:mm a") : "Unknown Time";
    const formattedDate = timestamp ? format(timestamp, "MMM d, yyyy") : "Unknown Date";

    
    
    
    
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-secondary rounded-lg w-full max-w-xl p-6 shadow-lg text-white">
                <div className="flex justify-between items-start border-b pb-4 break-words">
                    <div>
                        <p className="text-sm mt-1">
                            Posted: {formattedTime} - {formattedDate}
                        </p>
                        <div className="max-h-40 overflow-y-auto">
                            <h2 className="text-2xl font-bold whitespace-pre-wrap w-full break-all">
                                {announcement.content}
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-500 text-xl">
                        <X />
                    </button>
                </div>

                <div className="mt-4 space-y-2">
                    <p className="text-sm text-white">
                        Author: {announcement.author?.name || "Unknown"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShowAnnouncementModal;
