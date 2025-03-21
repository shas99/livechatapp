"use client";
// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:5000'; // Adjust if needed
const SOCKET_URL = 'http://livechatappnest-565007551.us-east-2.elb.amazonaws.com'; // Adjust if needed

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null); // ✅ Correct typing

    useEffect(() => {
        const newSocket: Socket = io(SOCKET_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
}
