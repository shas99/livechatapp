import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ConnectedUserService } from "./services/connectedUser";
import { MessageService } from "./services/message/message.service";

const EVENT_ERROR = 'error';

interface MessagePayload {
    selectedContact: string;
    message: string;
}

//configure later
@WebSocketGateway({
    cors: {
        origin: '*',
        methods: '*',
        allowedHeaders: '*',
    }
})


export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {

    constructor(private readonly connectedUserService: ConnectedUserService, private readonly messageService: MessageService,) { }

    @WebSocketServer() server: Server;
    users: string[] = [];


    afterInit(server: Server) {
        console.log('Websocket Gateway initialized')
    }

    async handleConnection(client: Socket): Promise<void> {
        const username = client.handshake.auth.username

        if (!username) {
            client.disconnect(true);
            return;
        }

        try {
            console.log(`Client connected- handle connection ${username}`);
            if (!this.users.includes(username)) {
                this.users.push(username);
            }
            client.join(username);
            this.server.emit("welcomeMessage", this.users);
            // await this.connectedUserService.addUser(username);
        } catch (error) {
            console.error(`Error connecting user ${username}:`, error);
            client.emit(EVENT_ERROR, { message: 'Failed to connect' });
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket): void {
        const username = client.handshake.auth.username
        if (!username) return;

        try {
            console.log(`Client disconnected: ${username}`);
            this.users = this.users.filter((user: String) => user != username)
            this.server.emit("welcomeMessage", this.users);
        } catch (error) {
            console.error(`Error disconnecting user ${username}:`, error);
        }
    }



    @SubscribeMessage('events')
    async handleEvent(@MessageBody() data: MessagePayload, @ConnectedSocket() client: Socket): Promise<any> {
        const username = client.handshake.auth.username;
        if (!username) return;

        if (!data || !data.selectedContact || !data.message) {
            client.emit(EVENT_ERROR, { message: 'Invalid message payload' });
            return;
        }

        try {

            console.log(`Message received from ${username}:`, data);
            await this.messageService.saveMessage(username, data.selectedContact, data.message);

            console.log(`Message received from ${username}, ${JSON.stringify(data)}`);

            this.server.to(data.selectedContact).emit('response', {
                from: username,
                message: data.message,
            });


            return data;
        } catch (error) {
            console.error(`Error handling message from ${username}:`, error);
            client.emit(EVENT_ERROR, { message: 'Failed to send message' });
        }
    }

    @SubscribeMessage('getMessagesByUser')
    async getMessagesByUser(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<any> {
        const username = client.handshake.auth.username;
        if (!username) return;

        if (!data || !data.user) {
            client.emit(EVENT_ERROR, { message: 'Invalid conversation request' });
            return;
        }

        try {

            console.log(`Conversation request from ${username} for user ${data.user}`);
            const messages = await this.messageService.getConversation(username, data.user);


            this.server.to(username).emit('getMessagesByUser', {
                from: username,
                message: messages,
            });


            return data;
        } catch (error) {
            console.error(`Error getting conversation for ${username} and ${data.user}:`, error);
            client.emit(EVENT_ERROR, { message: 'Failed to retrieve conversation' });
        }
    }


}