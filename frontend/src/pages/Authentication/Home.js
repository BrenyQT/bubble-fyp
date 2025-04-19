import React from "react";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
    const handleLogin = () => {


        //TO:DO : Update to env
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8080/authentication&response_type=code&client_id=454843613820-lv5kqr45p6fptiimsdi3ilo5h482lk7s.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline";
    };

    return (
        <div className="bg-secondary min-h-screen text-accent flex flex-col">
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-grow">
                {/* Bubble Icon */}
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1874/1874046.png"
                    className="w-20 h-20 mb-4"
                />
                <h1 className="text-4xl font-bold mb-4 text-white">BUBBLE</h1>
                <p className="text-lg text-white mb-6">The easiest way to collaborate</p>
                <button
                    onClick={handleLogin}
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-md flex items-center hover:bg-accent transition duration-200"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="why"
                        className="w-6 h-6 mr-2"
                    />
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Home;
