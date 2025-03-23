import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer,OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { Server,Socket } from 'socket.io';
import { ConnectedUserService } from "./services/connectedUser";
import { MessageService } from "./services/message/message.service";

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins
        methods: '*', // Allow all methods
        allowedHeaders: '*', // Allow all headers
    }
})
export class PollsGateway implements OnGatewayInit, OnGatewayDisconnect,OnGatewayConnection {

    constructor(private readonly connectedUserService: ConnectedUserService,private readonly messageService: MessageService,) {}

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

    async handleConnection(client: Socket){
        const username = client.handshake.auth.username
        console.log(`Client connected- handle connection ${username}`);Object
        this.users.push(username)
        await this.connectedUserService.addUser(username);
        client.emit("welcomeMessage", this.users);
    }  


    @SubscribeMessage('events')
    async handleEvent(@MessageBody() data: any,@ConnectedSocket() client: Socket): Promise<any> {
        const username = client.handshake.auth.username;
        await this.messageService.saveMessage(username, 'test@example', data.message);

        console.log(`Message received from ${username}, ${JSON.stringify(data)}`);
        this.server.emit('response', { message: 'Hello from the server!', receivedData: data,username:username,users:this.users });
        return data;
    }

    
}