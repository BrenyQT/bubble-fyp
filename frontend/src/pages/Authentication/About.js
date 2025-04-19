import React from "react";
import Navbar from "../../components/Navbar/Navbar";

// Filler page
// TO:DO fix the content
const About = () => {
    return (
        <div className="bg-secondary min-h-screen text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="text-lg text-center max-w-2xl">
                    Bubble is a collaborative project management
                    platform designed for teams, particularly ones
                    working within a multilingual/multinational
                    environment. The platform combines Agile
                    Workflow tools (Ticket/Sprint Creation, Sprints,
                    Gantt Chart etc.) with real time communication
                    features to streamline team productivity and
                    collaboration. Bubbles implimentation of a
                    multilingual Workspace chat allows users who
                    speak different languages to interact seamlessly.
                    The overall goal of adding communication features
                    is aimed to improve clarity, connection and
                    collaboration between users.
                </p>
            </div>
        </div>
    );
};

export default About;
//TO:DO FILL IN ABOUT INFO