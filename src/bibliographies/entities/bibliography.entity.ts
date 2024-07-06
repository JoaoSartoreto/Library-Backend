import { Book } from 'src/books/entities/book.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Bibliography {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToMany(() => Book, (book) => book.bibliographies, { eager: true })
  @JoinTable()
  books: Book[];
}
