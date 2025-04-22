import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, workspace}) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    // FINAL TO:DO make this better
    const handleLogout = () => {
        navigate("/");
    };

    return (
        <nav className="bg-primary text-white py-4 px-6 flex justify-between items-center w-full fixed top-0 left-0 right-0 shadow-md z-50">

            <div className="text-xl font-bold">
                {workspace ? workspace.name: "BUBBLE"}
            </div>
            {/* User Profile or Links */}
            { /* Default Navbar (NO USER LOGGED IN) */}
            {user ? (
                <div
                    className="flex items-center space-x-4 cursor-pointer relative"
                    onClick={handleLogout}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <span>{user.name}</span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                        <img
                            src={user?.picture}
                            className="w-full h-full object-cover"
                            alt="person"
                        />
                    </div>
                    {hovered && (
                        <div className="absolute -bottom-6 left-0 text-xs bg-white text-black px-2 py-1 rounded shadow">
                            Click to log out
                        </div>
                    )}
                </div>
            ) : (
                // Default Navbar when no user is logged in
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
            )}
        </nav>
    );
};

export default Navbar;
