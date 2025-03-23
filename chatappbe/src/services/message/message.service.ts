// connected-user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
      constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
      ) {}

    // message.service.ts
    async saveMessage(sender: string, to: string | null, content: string): Promise<Message> {
        const message = this.messageRepo.create({ sender, to, content });
        return this.messageRepo.save(message);
    }

    async getConversation(userA: string, userB: string): Promise<Message[]> {
        return await this.messageRepo.find({
          where: [
            { sender: userA, to: userB },
            { sender: userB, to: userA }
          ],
          order: { timestamp: 'ASC' }
        });
      }

    // async getConversation(userA: string, userB: string): Promise<Message[]> {
    //     return await this.messageRepo.find({
    //       order: { timestamp: 'ASC' } // Optional: keep chronological order
    //     });
    //   }
  
}
