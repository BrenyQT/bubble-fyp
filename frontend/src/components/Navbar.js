import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold">BUBBLE</div>
            <div className="space-x-4">
                <Link to="/" className="px-6 py-3 rounded-md transition duration-200 hover:bg-accent">
                    Home
                </Link>
                <Link to="/news" className="px-6 py-3 rounded-md transition duration-200 hover:bg-accent">
                    News
                </Link>
                <Link to="/about" className="px-6 py-3 rounded-md transition duration-200 hover:bg-accent">
                    About us
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
