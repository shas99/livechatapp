import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer,OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { Server,Socket } from 'socket.io';


@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins
        methods: '*', // Allow all methods
        allowedHeaders: '*', // Allow all headers
    }
})
export class PollsGateway implements OnGatewayInit, OnGatewayDisconnect,OnGatewayConnection {

    @WebSocketServer() server: Server;
    users : any = [] 

    afterInit(server: any) {
        console.log('Websocket Gateway initialized')
    }

    handleDisconnect(client: Socket) {
        const username = client.handshake.auth.username
        console.log(`Client disconnected: ${username}`);
        this.users = this.users.filter((user:String) => user != username)
      }

    handleConnection(client: Socket){
        const username = client.handshake.auth.username
        console.log(`Client connected- handle connection ${username}`);
        this.users.push(username)
        client.emit("welcomeMessage", this.users);
    }  


    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string,@ConnectedSocket() client: Socket): string {
        const username = client.handshake.auth.username;
        console.log(`Message received from ${username}, ${JSON.stringify(data)}`);
        this.server.emit('response', { message: 'Hello from the server!', receivedData: data,username:username,users:this.users });
        return data;
    }

    
}