import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  hashedRefreshToken: string | null;

  @ManyToMany(() => Book, (book) => book.writtenBy)
  writtenBooks: Book[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
