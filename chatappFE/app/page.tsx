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
  
    const handleWelcomeMessage = (data:any) => {
      console.log("Connected Users:", data);
      setUsers([...data]);
    };
  
    socket.on("welcomeMessage", handleWelcomeMessage);
  
    return () => {
      socket.off("welcomeMessage", handleWelcomeMessage); // Cleanup to avoid stacking
    };
  }, [socket]);  


  useEffect(() => {
    setInputValue(auth.user?.profile.email || "")
    if (socket && auth) {
      socket.emit('events', { name: "Hello" });

      socket.on('response', (data) => {
          console.log('Server response:', data);
      });
  }
  
  }, [socket,auth]);

  useEffect(() => {

    if(socket && auth){
      if(!auth.isAuthenticated){
        if (!auth || auth.isLoading) return;
        console.log(auth)
        redirect('/login');
      }
    }

  //   if (socket && auth) {
  //     socket.emit('events', { name: "Hello" });

  //     socket.on('response', (data) => {
  //         console.log('Server response:', data);
  //     });
  // }
  
  }, [socket,auth]);


  const handleClick = () => {

    if (socket) {
      socket.emit('events', { selectedContact, message,from: inputValue});

      socket.on('response', (data) => {
          console.log('Server response:', data);
      });
  }
  }


  const SelectUser = (user:string) => {
    setSelectedContact(user)
    socket?.emit('getMessagesByUser', { user });

    socket?.on('getMessagesByUser', (data) => {
      setPastMesages([...data.message])
      console.log('Server response123:', data.message);
  });
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>

<div>
<button onClick={() => auth.removeUser()}>Sign out</button>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user} onClick={() => SelectUser(user)}>{user}</li>
        ))}
      </ul>
    </div>
    <div>
    <div>
  {pastMessages.map((message, index) => (
    <div key={index}>
      {message.content}
    </div>
  ))}
</div>
    </div>

    <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter text here..."
        className="p-2 border rounded-md mb-4"
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Click Me
             </button>

        
      </div>
    );
  }

//   return (
//     <div>
//     <button>Hello</button>
//     <button>Bye</button>
//   </div>
// )

}