// Chatbox.js

import React, { useState, useEffect, useRef } from 'react';
import CommandController from '../api/CommandController';
import axios from '../api/axios';

const Home2 = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [groupName, setGroupName] = useState(''); // State to hold the group name input
  const messageContainerRef = useRef(null);
  const GROUPS_URL = '/groups'
  let groups;
  

  

  //KOMANDA
  const [output, setOutput] = useState('');

  const handleCommandCreateGroup = async (command) => {
    try {
      // Send command and get response
      console.log(command);
      const response = await CommandController.sendCommand(command);
      // Set output based on the response
      setOutput(response);
      // Get Rust output after sending the command
      setIsModalOpen(false);
      const rustOutput = await CommandController.getRustOutput();
      // Return the Rust output
      console.log(rustOutput)
      return rustOutput;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = { text: inputMessage, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      // You may want to send the message to your server or handle it accordingly
    }
  };

  const handleCreateGroup = async (e)=> {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to create a new group
      const response = await axios.post(
        GROUPS_URL,
        JSON.stringify({ name: groupName }), // Send the group name in the request body
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // If needed
        }
      );
      // Handle success
      console.log('Group created:', response.data);
      handleCommandCreateGroup("create group "+groupName);
      setIsModalOpen(false); // Close the modal
      setGroupName(''); // Clear the group name input field
    } catch (error) {
      // Handle errors
      console.error('Error creating group:', error);
    }
  };

  useEffect(() => {
    // Scroll down to the latest message when messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatbox-container">
      <div className="chatbox-left">
        {/* Button to create group */}
        <button className="create-group-button" onClick={handleCreateGroup}>
          Create Group
        </button>
        {/* Placeholder for selecting messages */}
        <div className="message-selector">Message Selector</div>
      </div>

      <div className="chatbox-right">
        {/* Placeholder for name */}
        <div className="chatbox-header">Receiver's Name</div>

        {/* Space for messages */}
        <div className="message-container" ref={messageContainerRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'user' ? 'sent-message' : 'received-message'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input and Send button */}
        <div className="input-container">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>

      {/* Popup for creating group */}
      {isModalOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Ime grupe</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
            />
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home2;
