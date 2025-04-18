"use client";
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from "react-oidc-context";
import { redirect } from 'next/navigation';

export default function Home() {

  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [pastMessages, setPastMesages] = useState<any[]>([]);

  const socket = useSocket(inputValue);

  const auth = useAuth();


  if (auth.error) {
    console.log(auth.error)
    return <div>Encountering error... {auth.error.message}</div>;
  }

  useEffect(() => {
    if (!socket) return;

    const handleWelcomeMessage = (data: any) => {
      console.log("Connected Users:", data);
      setUsers([...data.filter((item:any) => item !== inputValue)]);
    };

    socket.on("welcomeMessage", handleWelcomeMessage);

    return () => {
      socket.off("welcomeMessage", handleWelcomeMessage);
    };
  }, [socket]);


  useEffect(() => {
    setInputValue(auth.user?.profile.email || "")
    if (socket && auth) {
      socket.emit('events', { name: "Hello" });

      socket.on('response', (data) => {
        console.log(localStorage.getItem("selectedUser"))
        console.log(data)

        const newMessage = {
          content: data.message,
          sender: data.from,
        };

        if (localStorage.getItem("selectedUser") == data.from) {
          console.log(data.message)
          setPastMesages(messages => [...messages, newMessage])
        }
        console.log('Server response:', data);
      });
    }

  }, [socket, auth]);

  useEffect(() => {

    if (socket && auth) {
      if (!auth.isAuthenticated) {
        if (!auth || auth.isLoading) return;
        console.log(auth)
        redirect('/login');
      }
    }
  }, [socket, auth]);


  const handleClick = () => {

    if(selectedContact == '' || selectedContact == null){
      alert('Please select a contact before typing the message');
      return;
    }

    if (socket) {
      socket.emit('events', { selectedContact, message, from: inputValue });

      socket.on('response', (data) => {
        console.log('Server response:', data);
      });
    }

    const newMessage = {
      content: message,
      sender: inputValue,
    };
    setPastMesages(messages => [...messages, newMessage])
    setMessage(message => '')
  }



  const SelectUser = (user: string) => {
    setSelectedContact(user)
    localStorage.setItem("selectedUser", user)
    socket?.emit('getMessagesByUser', { user });

    socket?.on('getMessagesByUser', (data) => {
      setPastMesages([...data.message])
      console.log('Server response123:', data.message);
    });
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <div>


          <div className="flex h-screen bg-gray-100">
            {/* Sidebar for User List */}
            <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col">
              <div className="p-4 flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Users</h2>
                <button
                  onClick={() => auth.removeUser()}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  Sign out
                </button>
              </div>

              <ul className="overflow-auto flex-1">
                {users.map(user => (
                  <li
                    key={user}
                    className={`p-3 cursor-pointer hover:bg-gray-700 border-b border-gray-600 ${
                      user === selectedContact ? 'bg-blue-500' : '' // Highlight selected user
                    }`}
                    onClick={() => SelectUser(user)}
                  >
                    <span className="text-white">{user}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* chat area */}
            <div className="flex flex-col flex-1">

              <div className="flex flex-col flex-1">

                <div className="overflow-auto p-4 flex-1 space-y-2 bg-gray-100">
                  {pastMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-[70%] ${message.sender == inputValue ? 'self-end bg-green-400 text-white' : 'self-start bg-gray-300 text-gray-900'
                        } shadow`}
                    >
                      {message.content}-{message.sender}
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-md focus:outline-none text-black"
                    />
                    <button
                      onClick={handleClick}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
}