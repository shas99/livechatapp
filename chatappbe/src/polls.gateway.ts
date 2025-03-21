import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';



@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins
        methods: '*', // Allow all methods
        allowedHeaders: '*', // Allow all headers
    }
})
export class PollsGateway implements OnGatewayInit {

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        console.log('Websocket Gateway initialized')
    }

    // @SubscribeMessage('events')
    // handleEvent(@MessageBody() data: string): string {
    //     console.log("data")
    // return data;
    // }
    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
        console.log(data);
        this.server.emit('response', { message: 'Hello from the server!', receivedData: data });
        return data;
    }
}