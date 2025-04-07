
"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import io from "socket.io-client";

const socket = io("https://chattingbackend-79ur.onrender.com", { withCredentials: true });

const Page = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch logged-in user data
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No token found");
      return;
    }

    axios
      .post("https://chattingbackend-79ur.onrender.com/decode", { token })
      .then((response) => {
        if (response.status === 200) {
          setUserData(response.data);
          socket.emit("join", response.data.userId); // Join user's room
        } else {
          setError(response.data.message || "Failed to fetch user data");
        }
      })
      .catch((error) => {
        setError("Error fetching user data");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (userData && selectedUser) {
      axios
        .get(`https://chattingbackend-79ur.onrender.com/messages/${userData.userId}/${selectedUser._id}`)
        .then((response) => {
          setMessages(response.data.map((msg) => ({
            text: msg.text,
            sender: msg.sender === userData.userId ? "You" : selectedUser.username,
            createdAt: msg.createdAt,
          })));
        })
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [selectedUser, userData]);

  // Socket.IO real-time message listener
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === userData?.userId && msg.receiver === selectedUser?._id) ||
        (msg.sender === selectedUser?._id && msg.receiver === userData?.userId)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            text: msg.text,
            sender: msg.sender === userData.userId ? "You" : selectedUser.username,
            createdAt: msg.createdAt,
          },
        ]);
      }
    });

    return () => socket.off("receiveMessage"); 
  }, [selectedUser, userData]);

  // Handle user search
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await axios.get(`https://chattingbackend-79ur.onrender.com/search-users?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Handle selecting a user
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setMessages([]); // Reset messages when a new user is selected
  };

  // Handle sending messages
  const handleSendMessage = () => {
    if (message.trim() !== "" && userData && selectedUser) {
      const msgData = {
        senderId: userData.userId,
        receiverId: selectedUser._id,
        text: message,
      };
      socket.emit("sendMessage", msgData); // Send via Socket.IO
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="bg-black h-[93vh] w-full bg-opacity-90 grid grid-cols-[35%_65%] border-y border-gray-300">
      {/* Left Sidebar - Search */}
      <div className="pt-1 px-5 border-r border-gray-300">
        <div className="flex flex-row justify-between items-center">
          <span className="text-white text-2xl font-bold">Chats</span>
          <div className="text-white flex flex-row justify-center items-center">
            <div>
              {userData ? (
                <h2 className="text-lg font-bold">{userData.username}</h2>
              ) : (
                <p>{error || "Loading user data..."}</p>
              )}
            </div>
            <div className="bg-white border border-green-500 w-10 h-10 rounded-full m-4 relative overflow-hidden">
              {userData && userData.profilePicture ? (
                <img
                  className="w-full h-full object-cover"
                  src={userData.profilePicture}
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full h-10 mt-3 p-2 rounded-md border border-gray-400"
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <div className="bg-white mt-2 p-2 rounded-md shadow-md">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-2 border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.profilephoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-black">{user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Section - Chat Window */}
      <div className="bg-black flex flex-col justify-between">
        {selectedUser ? (
          <div className="text-white flex items-center p-4 border-b border-gray-700">
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
              src={selectedUser.profilephoto}
              alt="Profile"
            />
            <h2 className="ml-3 text-xl font-bold">{selectedUser.username}</h2>
          </div>
        ) : (
          <div className="text-gray-500 flex items-center justify-center h-full">
            Select a user to start chatting
          </div>
        )}

        {selectedUser && (
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} mb-2`}
              >
                <div
                  className={`p-3 rounded-lg text-white ${
                    msg.sender === "You" ? "bg-green-500 text-right" : "bg-gray-700 text-left"
                  }`}
                >
                  <span className="text-sm">{msg.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedUser && (
          <div className="p-4 border-t border-gray-700 flex items-center">
            <input
              type="text"
              className="flex-1 h-10 p-2 rounded-md border border-gray-400"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;