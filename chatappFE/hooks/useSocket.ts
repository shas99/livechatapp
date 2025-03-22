// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL

export function useSocket(username : string) {
    const [socket, setSocket] = useState<Socket | null>(null); // ✅ Correct typing

    useEffect(() => {
        console.log(SOCKET_URL)
        const newSocket: Socket = io(SOCKET_URL);
        setSocket(newSocket);
        newSocket.auth = {username: username}
        return () => {
            newSocket.disconnect();
        };
    }, [username]);

    return socket;
}
