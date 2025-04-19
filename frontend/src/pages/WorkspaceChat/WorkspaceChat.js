import React, {useEffect, useState, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {ArrowLeft} from "lucide-react";
import format from "date-fns/format";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ReactFlagsSelect from "react-flags-select";
import axios from "axios";

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
    const [messages, setMessages] = useState([]); // state which loads messages in a workpsace chat
    const [newMessage, setNewMessage] = useState(""); // new message for text bar
    const [translatedMessages, setTranslatedMessages] = useState([]); // secound array to store messages when translated
    const [selectedLang, setSelectedLang] = useState("en"); // set default to enlgish
    const messagesEndRef = useRef(null); // used for flow transition when opening chat
    const stompClientRef = useRef(null); // reate a reference to a websocket connection
    const selectedLangRef = useRef(selectedLang); // GONNA HAVE TO SOTRE THE LANGAUGE

    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state?.user; // set user
    const workspace = location.state?.workspace; // set workspace
    // static languages array
    const languageMap = {
        GB: "en",
        FR: "fr",
        DE: "de",
        ES: "es",
        IT: "it",
        HU: "hu",
        PL: "pl",
        BG: "bg"
    };

    useEffect(() => {
        selectedLangRef.current = selectedLang;
    }, [selectedLang]);

    useEffect(() => {
        if (!workspace || !user) {
            navigate("/viewWorkspace");
        } else {
            fetchMessages();
            //connect to web sockets if no connection is already connected
            if (!stompClientRef.current) {
                connectWebSocket();
            }
        }
    }, [workspace, user]);

    /*
    Client subscription to server for websockets.
     */
    const connectWebSocket = () => {
        const socket = new SockJS("http://localhost:8080/chat");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/${workspace.id}`, async (message) => {
                    const receivedMessage = JSON.parse(message.body);

                    // Translate the received message based on the current language
                    const translated = await translateMessage(receivedMessage.content, selectedLangRef.current);

                    // Add the received message to the messages state and update translated messages
                    setMessages((prev) => [...prev, receivedMessage]);
                    setTranslatedMessages((prev) => [...prev, translated]);
                });
            },
            onStompError: (frame) => console.error("WebSocket Error:", frame),
        });

        client.activate();
        stompClientRef.current = client;

        // When closing the chat page, the WebSocket connection is closed
        return () => {
            if (client) client.deactivate();
        };
    };



    //  Fetch the messages sent from the past in a particular group
    const fetchMessages = () => {
        fetch(`http://localhost:8080/messages?workspaceId=${workspace.id}`, {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" }, // wasnt fetching idk why this works
        })
            .then(response => response.json())
            .then(async data => {
                setMessages(Array.isArray(data) ? data : []); // non empty array
                const translated = await Promise.all( //make sure all send
                    data.map(msg => translateMessage(msg.content, selectedLang)) // translate all the messages
                );
                setTranslatedMessages(translated);
            })
            .catch(error => console.error("Error fetching the past messages :", error));
    };

    const translateMessage = async (text, lang) => {
        if (lang === "en" || !text?.trim()) return text;

        try {
            const response = await axios.get("https://translation.googleapis.com/language/translate/v2", {
                params: {
                    q: text,
                    target: lang,
                    key: "AIzaSyBg6crFqzluJpprAPmVbcVHokPs2ResoAI",

                },
            });


            // Congrats Brendan it was worth the headache, but i left this ^
            const translated = response?.data?.data?.translations?.[0]?.translatedText;
            /*
                                 {
                      "data": {
                        "translations": [
                          {
                            "translatedText": My message translated :DDD"
                          }
                        ]
                      }
                    }
            */


            return translated || text; // return text if cannot translate
            // TO:DO have a more graceful handling when it cant translate
        } catch (err) {
            console.error("cannot translate :C:", err);
            return text;
        }
    };

    //checks for a connection
    const sendMessage = () => {
        if (!newMessage.trim() || !stompClientRef.current || !stompClientRef.current.connected) return;

        //create Message Payload
        const payload = {
            sender: { id: user.id },
            content: newMessage,
            workspace: { id: workspace.id },
        };

        stompClientRef.current.publish({
            destination: "/broadcast/sendMessage",
            body: JSON.stringify(payload),
        });

        setNewMessage("");
    };

    // set the new language and translate all messages
    const handleLangChange = async (countryCode) => {
        const lang = languageMap[countryCode];
        setSelectedLang(lang);

        const translated = await Promise.all(
            messages.map(msg => msg.content?.trim() ? translateMessage(msg.content, lang) : msg.content)
        );

        setTranslatedMessages(translated);
    };

    // TO:DO  man fuck
    // Congratulations Brendan,  i survided
    const disconnectWebSocketConnection = (client) => {
        if (client && client.connected) {
            console.log("Deactivating WebSocket connection");
            client.deactivate();
        } else {
            console.log("No active WebSocket connection to deactivate");
        }

        // Then navigate to the workspace dashboard
        navigate(`/workspaceDashboard/${workspace.id}`, {state: {user, workspace}});
    };

    // croll to this ref div really cool way of doing this
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);


    // TO:DO this is fragile make components


    return (
        <div className="bg-secondary min-h-screen flex flex-col h-screen">
            <Navbar user={user} workspace={workspace}/>

            <div className="mt-[80px] w-full px-6 flex justify-between items-center">
                {/* Return button */}
                <button
                    onClick={() => disconnectWebSocketConnection(stompClientRef.current)} // remove connection works :,,,,D
                    className="flex items-center text-white bg-primary px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition"
                >
                    <ArrowLeft size={20} className="mr-2"/>
                    Return to Workspace View
                </button>

                {/* Language selector Drop Down
                 To:DO mess around with this tailwind css
                 */}
                <div className="bg-primary text-primary rounded-lg hover:bg-opacity-90 transition flex items-center">
                    <ReactFlagsSelect
                        className="bg-primary rounded-lg"
                        countries={["GB", "FR", "DE", "ES", "IT", "HU", "PL", "BG"]}
                        customLabels={{
                            GB: "English",
                            FR: "Français",
                            DE: "Deutsch",
                            ES: "Español",
                            IT: "Italiano",
                            HU: "Magyar",
                            PL: "Polska",
                            BG: "Bŭlgarski"

                        }}
                        selected={Object.keys(languageMap).find(key => languageMap[key] === selectedLang)}
                        onSelect={handleLangChange}
                        selectButtonClassName="bg-primary text-white"
                        fullWidth={false}
                        showSelectedLabel={true}
                        showOptionLabel={true}
                    />
                </div>
            </div>

            {/* Chat window */}
            <div
                className="flex-1 overflow-y-auto rounded-lg p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border border-white/20 bg-opacity-10 bg-primary mt-4">

            {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const timestamp = msg.timestamp ? new Date(msg.timestamp) : null;
                        const formattedTime = timestamp ? format(timestamp, "hh:mm a") : "Unknown Time";
                        const formattedDate = timestamp ? format(timestamp, "MMM d, yyyy") : "Unknown Date";

                        const isCurrentUser = msg.senderEmail === user.email;

                        return (
                            //check if user signedin is the person sending message
                            <div key={index} className={`flex items-start p-3 mb-2 rounded-lg max-w-[75%] 
                ${isCurrentUser ? "bg-accent text-white ml-auto" : "bg-primary text-white"} shadow-md`}>
                                <img
                                    src={msg.senderPicture}
                                    alt={msg.senderName || "user"}
                                    className="w-8 h-8 rounded-full mr-3 border border-white/30"
                                />
                                <div>
                                    <div className="flex items-center">
                                        <strong className="text-white">{msg.senderName || "Unknown User"}</strong>
                                        <span
                                            className="ml-2 text-sm text-white">{formattedTime} - {formattedDate}</span>
                                    </div>
                                    <p className="text-white">
                                        {translatedMessages[index] || msg.content || "No content"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-white text-center">No messages yet.</p>
                )}

                <div ref={messagesEndRef}></div>
            </div>

            {/* Input  Send  grid */}
            <div className="mt-4 flex px-6">
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
    );
};

export default WorkspaceChat;
