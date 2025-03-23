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
        this.server.emit("welcomeMessage", this.users);
      }

    async handleConnection(client: Socket){
        const username = client.handshake.auth.username
        console.log(`Client connected- handle connection ${username}`);
        this.users.push(username)
        client.join(username);
        this.server.emit("welcomeMessage", this.users);
        await this.connectedUserService.addUser(username);
    }  


    @SubscribeMessage('events')
    async handleEvent(@MessageBody() data: any,@ConnectedSocket() client: Socket): Promise<any> {
        const username = client.handshake.auth.username;
        await this.messageService.saveMessage(username, data.selectedContact, data.message);

        console.log(`Message received from ${username}, ${JSON.stringify(data)}`);

        this.server.to(data.selectedContact).emit('response', {
            from: username,
            message: data.message,
          });


        return data;
    }

    @SubscribeMessage('getMessagesByUser')
    async getMessagesByUser(@MessageBody() data: any,@ConnectedSocket() client: Socket): Promise<any> {
        const username = client.handshake.auth.username;
        
        const messages = await this.messageService.getConversation(username, data.user);

        console.log(`Message received from 123${username}, ${data.user}, ${messages}`);

        this.server.to(username).emit('getMessagesByUser', {
            from: username,
            message: messages,
          });


        return data;
    }

    
}