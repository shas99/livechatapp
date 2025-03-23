// connected-user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUser } from 'src/entities/connectedUser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUser)
    private userRepo: Repository<ConnectedUser>,
  ) {}

  async addUser(username: string) {
    try {
      const existing = await this.userRepo.findOneBy({ username });
      if (!existing) {
        const user = this.userRepo.create({ username });
        await this.userRepo.save(user);
      }
    } catch (err) {
      console.error('Error adding connected user:', err);
    }
  }

  async getAllUsers(): Promise<string[]> {
    const users = await this.userRepo.find();
    return users.map((u) => u.username);
  }
}
