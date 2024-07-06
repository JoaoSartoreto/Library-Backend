import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reserve {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column()
  isValid: boolean;

  @ManyToOne(() => User, (user) => user.reserves, { eager: true })
  user: User;

  @ManyToOne(() => Book, (book) => book.reserves, { eager: true })
  book: Book;
}
