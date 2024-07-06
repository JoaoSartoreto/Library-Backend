import { Book } from 'src/books/entities/book.entity';
import { Fine } from 'src/fines/entities/fine.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Borrowing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @Column()
  isReturned: boolean;

  @ManyToOne(() => User, (user) => user.borrowings, { eager: true })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrowings, { eager: true })
  book: Book;

  @OneToOne(() => Fine, (fine) => fine.borrowing, { eager: true })
  @JoinColumn()
  fine: Fine;
}
