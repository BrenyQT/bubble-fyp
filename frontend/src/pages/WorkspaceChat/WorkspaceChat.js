import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { ArrowLeft } from "lucide-react"; // component library for the back home arrow.
import format from "date-fns/format"; // https://date-fns.org/docs/format TO:DO Pattern check this.
import { Client } from "@stomp/stompjs"; // STOMP (Text Oriented Messaging Protocol. Helps the application act as a pub sub (client subscribes to server endpoint)
import SockJS from "sockjs-client"; // Fallback if browser doesnt support sockets.


/**
 SOCKET: A phone line (establishes connection) ensures a stable connection across different browsers
 CLIENT: A person using the phone (talks & listens) easier to send & receive messages with structure

 WEBSOCKET CONNECTION TO SERVER:
 When a user opens a workspace{id} page the workspaceChat page a websocket connection to the backend server : const socket = new SockJS("http://localhost:8080/chat");
 This endpoint connects the user to th Spring boot web socket server.

 SUBSCRIPTION TO TOPIC:
 The user subscribes to a chat "topic" /topic/123 (workspace ID 123)
 This means they will receive all messages sent to that workspace

 SENDING A MESSAGE
 Wen a message is sent its sent to  it is sent to the server (.../broadcast/sendMessage)
 The backend processes the message and broadcasts it to all subscribers (eah person with a connection to the workspace message is sent in)
 */

const WorkspaceChat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { workspace, user } = location.state || {}; // Passed in from workspace list as props.
    const [messages, setMessages] = useState([]); // This stores the chat messages when the
    const [newMessage, setNewMessage] = useState(""); //text box state management
    const messagesEndRef = useRef(null);
    const stompClientRef = useRef(null);

    // Return to workspace page where user/workspace will be reloaded.
    // Else retrieve workspace messages
    // Use effect executes websocket connection and fetching messages
    useEffect(() => {
        if (!workspace || !user) {
            navigate("/viewWorkspace");
        } else {
            fetchMessages();
            if (!stompClientRef.current) { // If no connection, connect  (Prevents multiple web sock connections) #TO:DO make sure this works.
                connectWebSocket();
            }
        }
    }, [workspace, user]);

    /*
    Client subscription to server for websockets.

     */
    const connectWebSocket = () => {
        const socket = new SockJS("http://localhost:8080/chat"); // matches registry.addEndpoint("/chat").withSockJS(); in sockets config
        const client = new Client({
            webSocketFactory: () => socket, // Uses SocketJS if websockets is blocked on a browser
            reconnectDelay: 5000, // Allows a reconnection every 5seconds (If disconnected)
            onConnect: () => {

                client.subscribe(`/topic/${workspace.id}`, (message) => { // make the client subscribe to the current workspace
                    const receivedMessage = JSON.parse(message.body); // get the body of the message recieved
                    setMessages(prev => [...prev, receivedMessage]); // Updating the previous messages
                });
            },
            onStompError: (frame) => console.error("WebSocket Error:", frame), // Error handling
        });

        client.activate(); // Starts the STOMP client connection to server. (ensures the client connects to the server and subscribes to topic)
        stompClientRef.current = client; // Storing the STOMP client in a useRef variable (prevents recreating multiple connections)

        // When closing the chat page the WebSocket connection is closed
        return () => {
            if (client) client.deactivate();
        };
    };

    //  Fetch the messages sent from the past in a particular group
    const fetchMessages = () => {
        fetch(`http://localhost:8080/messages?workspaceId=${workspace.id}`, {
            method: "GET",
            credentials: "include", // includes my Cookies??
            headers: { "Accept": "application/json" }, // JSON Format
        })
            .then(response => response.json())
            .then(data => setMessages(Array.isArray(data) ? data : [])) // sets the array if theres data in the json else empty
            .catch(error => console.error("Error fetching the past messages :", error)); // Error handling
    };


    const sendMessage = () => {
        // removes extra spaces and not blank, checks if websocket client exists and connection is active
        if (!newMessage.trim() || !stompClientRef.current || !stompClientRef.current.connected) return;

        const messageData = {
            sender: user,
            content: newMessage,
            workspace: { id: workspace.id },
            timestamp: new Date().toISOString(),
        };

        stompClientRef.current.publish({
            destination: "/broadcast/sendMessage", // Sends the message to the WebSocket server
            body: JSON.stringify(messageData),
        });

        setNewMessage(""); // remove all from input
    };

    // smooth transition to bottom div containing a ref
    // TO:DO mess around with styles
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (
        <div className="bg-secondary min-h-screen flex flex-col">
            <Navbar user={user} />

            <div className="mt-[80px] w-full max-w-6xl mx-auto py-5">
                <button
                    onClick={() => navigate("/viewWorkspace", { state: { user } })}
                    className="flex items-center text-white px-3 py-2 bg-primary rounded-lg shadow-md hover:bg-opacity-80 transition duration-200 text-lg font-semibold"
                >
                    <ArrowLeft size={24} className="mr-2" />
                    Back to Workspaces
                </button>
            </div>

            <div className="flex flex-col items-center w-full">
                <h1 className="text-white text-2xl font-bold mb-2">{workspace.name} Chat</h1>

                {/* Outer chat container */}
                <div className="w-full max-w-6xl bg-opacity-30 bg-white backdrop-blur-lg p-5 rounded-lg border border-white/50 shadow-lg">

                    {/* Scrollable chat window */}
                    <div className="max-h-[500px] overflow-y-auto rounded-lg p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border border-white/20 bg-opacity-10 bg-gray-900">

                        {/* If messages exist in workspace, map over them and create constants for each message */}
                        {messages.length > 0 ? (
                            messages.map((msg, index) => {
                                const timestamp = msg.timestamp ? new Date(msg.timestamp) : null;
                                const formattedTime = timestamp ? format(timestamp, "hh:mm a") : "Unknown Time";
                                const formattedDate = timestamp ? format(timestamp, "MMM d, yyyy") : "Unknown Date";

                                {/* Render each message as a card */}
                                {/* TO DO: Consider making this into a reusable component */}
                                return (
                                    <div key={index} className={`flex items-start p-3 mb-2 rounded-lg max-w-[75%] 
                                    ${msg.sender?.email === user.email ? "bg-blue-500 text-white ml-auto" : "bg-gray-700 text-white"} shadow-md`}
                                    >
                                        <img
                                            src={msg.sender?.picture || "/default-profile.png"}
                                            alt={msg.sender?.name || "user"}
                                            className="w-8 h-8 rounded-full mr-3 border border-white/30"
                                        />
                                        <div>
                                            <div className="flex items-center">
                                                <strong className="text-white">{msg.sender?.name || "Unknown User"}</strong>
                                                <span className="ml-2 text-sm text-gray-300">{formattedTime} • {formattedDate}</span>
                                            </div>
                                            <p className="text-white">{msg.content}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-white text-center">No messages yet.</p>
                        )}

                        {/* This helps auto-scroll to the newest message using a ref */}
                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* Input field and send button */}
                    <div className="mt-4 flex">
                        {/* Handles message input */}
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 p-3 rounded-lg text-black shadow-md border border-white/30"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-3 bg-primary text-white px-5 py-3 rounded-lg shadow-md"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default WorkspaceChat;
