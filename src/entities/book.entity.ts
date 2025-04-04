import {
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  Entity,
} from 'typeorm';
import { Author } from './author.entity';
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => Author, (author) => author.writtenBooks)
  @JoinTable()
  writtenBy: Author[];
}
