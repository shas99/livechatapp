// // message.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity()
// export class Message {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   from: string;

//   @Column({ nullable: true })
//   to: string | null;

//   @Column('text')
//   content: string;

//   @CreateDateColumn()
//   timestamp: Date;
// }


import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column({ type: 'varchar', nullable: true })
  to: string | null;

  @Column('text')
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}
