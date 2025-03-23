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
    async saveMessage(from: string, to: string | null, content: string): Promise<Message> {
        const message = this.messageRepo.create({ from, to, content });
        return this.messageRepo.save(message);
    }
  
}
