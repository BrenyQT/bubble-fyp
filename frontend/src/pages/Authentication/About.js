import React from "react";
import Navbar from "../../components/Navbar";

const About = () => {
    return (
        <div className="bg-secondary min-h-screen text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="text-lg text-center max-w-2xl">
                    Lorum Ipsom
                </p>
            </div>
        </div>
    );
};

export default About;
