import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollsGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/sample.entity';
import { ConnectedUser } from './entities/connectedUser.entity';
import { ConnectedUserService } from './services/connectedUser';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message/message.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432', 10), // Optional: parse port
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [__dirname + '/**/*.entity{.ts,.js}',User,ConnectedUser,Message],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User,ConnectedUser,Message]),
  ],
  controllers: [AppController],
  providers: [AppService,PollsGateway,ConnectedUserService,MessageService],
})
export class AppModule {}
