import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ConnectedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  connectedAt: Date;
}