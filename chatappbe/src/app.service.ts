import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/sample.entity';


@Injectable()
export class AppService {

  // constructor(
  //   @InjectRepository(User)
  //   private userRepository: Repository<User>,
  // ) {
  //   this.insertSampleUser(); // auto-run on service init (for testing purposes only)
  // }

  // async insertSampleUser() {
  //   const user = this.userRepository.create({
  //     name: 'Jack maa',
  //     email: 'JackM@example.com',
  //   });

  //   try {
  //     await this.userRepository.save(user);
  //     console.log('Sample user inserted:', user);
  //   } catch (error) {
  //     console.error('Error inserting user:', error);
  //   }
  // }

  getHello(): string {
    return 'Hello World from load balancer!';
  }
}
