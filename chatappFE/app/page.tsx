"use client";
import Image from "next/image";
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { redirect } from 'next/navigation';

export default function Home() {

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([])
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState("");

  const socket = useSocket(inputValue);

  const auth = useAuth();

  const router = useRouter();

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
  }, [socket]); // Runs only when socket changes

  // socket?.on("welcomeMessage", (data) => {
  //   console.log("Connected Users:", data);
  //   setUsers([...data])
  // });

  // if (auth.isAuthenticated) {
  //   return (
  //     <div>
  //       <pre> Hello: {auth.user?.profile.email} </pre>

  //       <button onClick={() => auth.removeUser()}>Sign out</button>
  //     </div>
  //   );
  // }else{
  //   router.push("/login");    
  // }

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

    if (socket && auth) {
      socket.emit('events', { name: "Hello" });

      socket.on('response', (data) => {
          console.log('Server response:', data);
      });
  }
  
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

  return (
    <div>
    <button>Hello</button>
    <button>Bye</button>
  </div>
)

  // if (isLoading) return null;

  // return (
  //   <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  //     <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
  //       Hello world!
  //        <input
  //       type="text"
  //       value={inputValue}
  //       onChange={(e) => setInputValue(e.target.value)}
  //       placeholder="Enter text here..."
  //       className="p-2 border rounded-md mb-4"
  //     />
  //     <button
  //       onClick={handleClick}
  //       className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
  //     >
  //       Click Me
  //     </button>
  //       <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
  //         <li className="mb-2 tracking-[-.01em]">
  //           Get started by editing{" "}
  //           <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
  //             app/page.tsx
  //           </code>
  //           .
  //         </li>
  //         <li className="tracking-[-.01em]">
  //           Save and see your changes instantly.
  //         </li>
  //       </ol>

  //       <div className="flex gap-4 items-center flex-col sm:flex-row">
  //         <a
  //           className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
  //           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           <Image
  //             className="dark:invert"
  //             src="/vercel.svg"
  //             alt="Vercel logomark"
  //             width={20}
  //             height={20}
  //           />
  //           Deploy now
  //         </a>
  //         <a
  //           className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
  //           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Read our docs
  //         </a>
  //       </div>
  //     </main>
  //     <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
  //       <a
  //         className="flex items-center gap-2 hover:underline hover:underline-offset-4"
  //         href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <Image
  //           aria-hidden
  //           src="/file.svg"
  //           alt="File icon"
  //           width={16}
  //           height={16}
  //         />
  //         Learn
  //       </a>
  //       <a
  //         className="flex items-center gap-2 hover:underline hover:underline-offset-4"
  //         href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <Image
  //           aria-hidden
  //           src="/window.svg"
  //           alt="Window icon"
  //           width={16}
  //           height={16}
  //         />
  //         Examples
  //       </a>
  //       <a
  //         className="flex items-center gap-2 hover:underline hover:underline-offset-4"
  //         href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <Image
  //           aria-hidden
  //           src="/globe.svg"
  //           alt="Globe icon"
  //           width={16}
  //           height={16}
  //         />
  //         Go to nextjs.org →
  //       </a>
  //     </footer>
  //   </div>
  // );
}
