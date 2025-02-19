import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
    console.log("User data:", user); // Debugging

    return (
        <nav className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold">BUBBLE</div>

            {user ? (
                <div className="flex items-center space-x-4">
                    <span>{user.name}</span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                        <img
                            src={user?.picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            alt="User Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            ) : (
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
