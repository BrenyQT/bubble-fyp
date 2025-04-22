import React from "react";
import Navbar from "../../components/Navbar/Navbar";

// Filler page
// TO:DO fix the content
const News = () => {
    return (
        <div className="bg-secondary min-h-screen text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Latest News</h1>
                <p className="text-lg text-center max-w-2xl">
                    When doing research, I noticed that most of the
                    solutions available on the market lacked reliable
                    communication systems. I Then conducted further
                    research which emphasised communication as a
                    key factor to a project's success. The translation
                    feature was added because of the growing need
                    for inclusive tools in global teams. Bubble was
                    developed using technologies such as React.js
                    (Frontend), Spring Boot (Backend) and WebSocket
                    integration for a Workspace Chat.
                </p>
            </div>
        </div>
    );
};

export default News;
