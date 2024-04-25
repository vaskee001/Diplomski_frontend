// Chatbox.js

import React, { useState, useEffect, useRef } from 'react';
import CommandController from '../api/CommandController';
import useAuth from '../hooks/useAuth';
import {jwtDecode} from "jwt-decode";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt  } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useLogout from '../hooks/useLogout';
import { useNavigate, Link } from "react-router-dom";



const Home2 = () => {
  const axiosPrivate = useAxiosPrivate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isModalOpen2, setIsModalOpen2] = useState(false); 
  const [groupName, setGroupName] = useState(''); // State to hold the group name input
  const messageContainerRef = useRef(null);
  const prevMessages = useRef([]);
  const GROUPS_URL = '/groups'
  const GROUPSPARTICIPANTS_URL = '/groupsparticipants'
  const [errMsg, setErrMsg] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [nonParticipants, setNonParticipants] = useState([]);
  const [selectedNonParticipant, setSelectedNonParticipant] = useState('');
  const [options, setOptions] = useState([]);
  const [allUsers, setAllUsers]= useState([]);
  const [output, setOutput] = useState('');
  const [outputCheck, setOutputCheck] = useState('');


  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users/'); // Adjust the URL as per your backend route
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, [selectedGroup,isModalOpen,isModalOpen2]); 
  

  useEffect(() => {
    setErrMsg("");
  }, [groupName]);

  const {auth}= useAuth();

  const decoded= auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined
    
  //OVDE CUVAM USERNAME AKTIVNOG USERA
  const userAuthorization = decoded?.UserInfo?.username || ""

  const fetchGroups = async () => {
    try {
        const response = await axiosPrivate.get(`/groups/${userAuthorization}`);
        setGroups(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
};



  const fetchMessageData = async () => {
    if (selectedGroup != ''){
      try {
        const response = await axiosPrivate.get(
          `/groupsparticipants/${selectedGroup}/${userAuthorization}/messages`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  const recieveMessage= async ()=>{
    try{
      const response = await CommandController.sendCommand("update");
      
      const updatedOutput = await CommandController.getRustOutput();
      
      setOutput(updatedOutput);
    } catch (error){
      console.error('Error:', error);
    }
  }

  
  
  

  useEffect(() => {
      // Fetch groups for the current participant when the component mounts
      fetchGroups();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axiosPrivate.get(`/groups/${selectedGroup}/participants`);
        setParticipants(response.data.participants);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchParticipants();
  }, [selectedGroup,isModalOpen2]);

  useEffect(() => {
    if (participants){
      const usersNotInGroup = allUsers.filter(username => !participants.includes(username));
      setNonParticipants(usersNotInGroup);
    }
  }, [selectedGroup,isModalOpen,isModalOpen2]);

  useEffect(() => {
    fetchMessageData(); 
  }, [selectedGroup]);


  //KOMANDA

  useEffect(() => {
    if (selectedGroup !== '') {
        handleCommandChooseGroup();
    }
  }, [selectedGroup]);

  const handleCommandExit = async (command) => {
    try {
      
      const response3 = await CommandController.sendCommand("exit");

      fetchGroups();
      return output;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const handleCommandCreateGroup = async (command) => {
    try {
      
      const response3 = await CommandController.sendCommand("exit");

      const response = await CommandController.sendCommand("create group "+ groupName);

      const response2 = await CommandController.sendCommand("update");

      recieveMessage();
      // console.log(output);
      // Get Rust output after sending the command
      setIsModalOpen(false);
      fetchGroups();
      return output;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleCommandChooseGroup = async () => {
    try {
      // Send exit command
      const response3 = await CommandController.sendCommand("exit");
      
      // Send update command
      const response = await CommandController.sendCommand("update");
      
      // Get Rust output after sending the update command
      recieveMessage();
  
      // If a group is selected, send the group command
      if (selectedGroup.length > 1) {
        const response2 = await CommandController.sendCommand("group " + selectedGroup);
      }
  
      // Return the updated output
      return response;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
  


  const handleCreateGroup = async (e)=> {
    setIsModalOpen(true); // Open the modal when the button is clicked
    setSelectedGroup(groupName);
  };

  const handleSubmitCreateGroupF =async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to create a new group
      const response = await axiosPrivate.post(
        GROUPS_URL,
        JSON.stringify({ name: groupName,  participants: [userAuthorization] }), // Send the group name in the request body
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // If needed
        }
      );
      // Handle success
      console.log('Group created:', response.data);
      handleCommandCreateGroup("create group "+groupName);
      setIsModalOpen(false); // Close the modal
      recieveMessage();
      setGroupName(''); // Clear the group name input field
    } catch (error) {
      // Handle errors
      if (!error?.response){
        setErrMsg('No Server Response')
      } else if (error.response?.status === 400){
          setErrMsg('Group already exists')
      } else if (error.response?.status === 401){
          setErrMsg('Unauthorized')
      } else if (error.response?.status === 409) {
        setErrMsg('Group already exists');
      }else {
          setErrMsg('Group Making Failed')
      }
    }
  };

  const handleClosePopup1 = () => {
    setIsModalOpen(false);
  };


  const handleClosePopup2 = () => {
    setIsModalOpen2(false);
  };

  


  useEffect(() => {
    // Scroll down to the latest message when messages change
    if (messageContainerRef.current) {
      // Check if messages actually changed
      const messagesChanged = JSON.stringify(prevMessages.current) !== JSON.stringify(messages);
      if (messagesChanged) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        // Update the previous messages ref
        prevMessages.current = messages;
      }
    }
  }, [messages]);

  // DODAVANJE U GRUPU
  const handleNonParticipantChange = (selectedOption) => {
    setSelectedNonParticipant(selectedOption.value);
  };

  // Update options when nonParticipants change
  useEffect(() => {
    // Map nonParticipants array to options format
    const options = nonParticipants.map((name, index) => ({
      label: name,
      value: name
    }));
    setOptions(options); // Set options state
  }, [nonParticipants]);

  const handleCommandAddParticipant = async () => {
    try {      
      const response2 = await CommandController.sendCommand("update");

      const response3 = await CommandController.sendCommand("group "+ selectedGroup);

      const response = await CommandController.sendCommand("invite "+ selectedNonParticipant);
      
      recieveMessage();

      setIsModalOpen2(false);
      const rustOutput = await CommandController.getRustOutput();
      // Return the Rust output
      console.log(rustOutput);
      return rustOutput;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleSubmitAddParticipant = async () => {
    try {
      const response = await axiosPrivate.post(`/groups/${selectedNonParticipant}`, {
        selectedNonParticipant: selectedNonParticipant, // Assuming you have this state variable
        selectedGroup: selectedGroup // Assuming you have this state variable
      });
      setIsModalOpen2(false);
      setSelectedNonParticipant();
      handleCommandAddParticipant();
      console.log('Participant added to group:', response.data);
      // Optionally, you can update your UI or state here if needed
    } catch (error) {
      console.error('Error adding participant to group:', error);
    }
  }

  //SLANJE PORUKA
  const handleCommandSendMessage = async () => {
    try {      
      recieveMessage();
      const newMessageRust = selectedGroup + ":" + inputMessage;
      
      const response = await CommandController.sendCommand("send "+ newMessageRust);
      
      const rustOutput = await CommandController.getRustOutput();
      return rustOutput;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  
  const handleSendMessage =async () => {
    if (inputMessage.trim() !== '') {
      const message = "Ja: " + inputMessage;
      const response = await axiosPrivate.post(
        `/groupsparticipants/${selectedGroup}/${userAuthorization}/messages`,
        JSON.stringify({ selectedGroup: selectedGroup,  userAuthorization: userAuthorization, message: message }), 
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // If needed
        }
      );

      fetchMessageData();
      setInputMessage('');
      
      handleCommandSendMessage();
    }
  };
  
  //PRIJEM PORUKA

  function reloadMessages() {
    // Your code here
    recieveMessage();
    fetchMessageData();
  }

  function useInterval(callback, delay) {
    useEffect(() => {
      const intervalId = setInterval(callback, delay);
      return () => clearInterval(intervalId);
    }, [callback, delay]);
  }

  
  // Call the function every second
  useInterval(reloadMessages, 250);

  useInterval(fetchGroups, 1700);

  async function addMessageToDB(selectedGroup, userAuthorization, message) {
    try {
      const response = await axiosPrivate.post(
        `/groupsparticipants/${selectedGroup}/${userAuthorization}/messages`,
        JSON.stringify({ selectedGroup, userAuthorization, message }), 
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // If needed
        }
      );

      // Handle the response here if needed
      console.log('Message sent:', response.data);
      
      return response.data; // Return the response data if needed
    } catch (error) {
      // Handle error here
      console.error('Error sending message:', error);
      throw error; // Throw error if needed
    }
  }

// Example usage:
// sendMessage(selectedGroup, userAuthorization, message)

  useEffect(() => {
    recieveMessage();
    if (output.includes('New messages:') && output != outputCheck && !output.includes(messages[messages.length - 1]) ) {
      // Extract messages
      const messages = output.split('\n').filter(line => line.trim().length > 0);
      // console.log('Messages:', messages); // Check the extracted messages
      messages.forEach(message => {
        // console.log(message);
      //   // Extract group, message content, and sender
        if (message.includes('from')) {    
          const trimmedMessage = message.trim();    
          console.log(trimmedMessage);
          const parts = trimmedMessage.split(":");

          if (message.includes(":")) {
            if (message.includes("from")) {
              const groupOfReceivedMessage = parts[0];
              const textOfReceivedMessage = parts[1].split("from")[0].trim();
              const senderOfReceivedMessage = parts[1].split("from")[1].trim();


              console.log(groupOfReceivedMessage);
              console.log(textOfReceivedMessage);
              console.log(senderOfReceivedMessage);

              //ODAVDE UBACUJEM U SVOJU BAZU
              addMessageToDB(groupOfReceivedMessage,userAuthorization,senderOfReceivedMessage+": "+textOfReceivedMessage);
            }
          }

      setOutputCheck(output);
        }
      });
    } 
  });

  //LEAVE GROUP 
  const handleConfirmLeaveGroup = async () => {
    try {
      const response = await axiosPrivate.delete(`/groups/${selectedGroup}/participants/${userAuthorization}`);
      console.log('Participant removed from group:', response.data);
      fetchGroups();
      setSelectedGroup('');
      // Optionally, update the UI or state here if needed
      setIsLeaveGroupModalOpen(false);
    } catch (error) {
      console.error('Error removing participant from group:', error);
    }
  };

  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] = useState(false);

  const handleLeaveGroup = () => {
    setIsLeaveGroupModalOpen(true); // Show the confirmation modal
  };

  const handleCloseLeaveGroupModal = () => {
    setIsLeaveGroupModalOpen(false); // Close the modal
  };
  
  // LOG OUT
  
  const logout = useLogout();
  const navigate = useNavigate();

  const handleCommandSignOut = async () => {
    try {     
      const response = await CommandController.sendCommand("exit");
      const response2 = await CommandController.sendCommand("exit");
      const response3 = await CommandController.sendCommand("exit");
      
      const rustOutput = await CommandController.getRustOutput();
      return rustOutput;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const signOut = async () => {
      await logout();
      handleCommandSignOut();
      navigate('/login');
  }

  return (
    <div className="chatbox-container">
      <div className="chatbox-left">
        <button className="close-button" onClick={signOut}>
          <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} /> {/* Use the new icon here */}
        </button>
        {/* Button to create group */}
        <button className="create-group-button" onClick={handleCreateGroup}>
          Create Group
        </button>
        <div>
          <h2>Groups for {userAuthorization}</h2>
          <ul>
            {groups.map((group) => (
              <button
                key={group._id}
                className={`group-button ${selectedGroup === group.name ? 'selected' : ''}`}
                onMouseEnter={(event) => {
                  if (selectedGroup !== group.name) {
                    event.target.classList.add('hover');
                  }
                }}
                onMouseLeave={(event) => {
                  if (selectedGroup !== group.name) {
                    event.target.classList.remove('hover');
                  }
                }}
                onClick={() => {
                  // Ovde stavljam odabir grupe og1
                  if (group.name != selectedGroup){
                    setSelectedGroup(group.name);
                  } else {
                    setSelectedGroup('');
                    handleCommandExit();
                  }
                }}
              >
                {group.name}
              </button>
            ))}
          </ul>
        </div>


      </div>
      {/* BOLJE NEKI PLACEHOLDER DA SE STAVI */}
      {selectedGroup.length > 0 &&(
      <div className="chatbox-right">
        {/* Placeholder for Group name */}
        <div className="chatbox-header">
          {selectedGroup}
        </div>
          
        {/* Space for messages */}
        <div className="message-container" ref={messageContainerRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.startsWith('Ja') ? 'sent-message' : 'received-message'}`}
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Input and Send button */}
        <div className="input-container">
          <button className='add-button' onClick={() => setIsModalOpen2(true)}>+</button>
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
          {/* Button for leaving the group */}
          <button className="leave-group-button" onClick={handleLeaveGroup}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="leave-group-text">Leave Group</span>
          </button>
          
        </div>
        {/* Confirmation Modal for leaving the group */}
      {isLeaveGroupModalOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <div className='izlaz-dugme'>
              <button className="close-button" onClick={handleCloseLeaveGroupModal}>
                X
              </button>
            </div>
            <h2>Leave Group</h2>
            <p>Are you sure you want to leave the group?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmLeaveGroup}>Yes</button>
              <button onClick={handleCloseLeaveGroupModal}>No</button>
            </div>
          </div>
        </div>
      )}


      </div>
      )}

      {/* Popup for creating group */}
      {isModalOpen && (
        
        <div className="popup-overlay">
          <div className="popup">
          <div className='izlaz-dugme'>
              <button className="close-button" onClick={handleClosePopup1}>
                X
              </button>
            </div>
          <p
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
            <h2>Group name</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
            />
            <button className="submit-button" onClick={handleSubmitCreateGroupF}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Adding to group modal */}
      {isModalOpen2 && (
        <div className="popup-overlay">
        <div className="popup">
          <div className='izlaz-dugme'>
            <button className="close-button" onClick={handleClosePopup2}>
              X
            </button>
          </div>
          <h2>Participants</h2>
          <ul>
            {participants.map((participant, index) => (
              <li key={index}>{participant}</li>
            ))}
          </ul>
          <div className="select-container">
            <label htmlFor="nonParticipantsSelect">Add non-participant:</label>
            <Select
              id="nonParticipantsSelect"
              value={selectedNonParticipant ? { label: selectedNonParticipant, value: selectedNonParticipant } : null}
              onChange={handleNonParticipantChange}
              options={options}
            />
            <button onClick={handleSubmitAddParticipant}>Add participant</button>
          </div>

        </div>
      </div>
      
      )}
    </div>
  );
};

export default Home2;
