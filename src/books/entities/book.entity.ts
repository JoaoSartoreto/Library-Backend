import { Author } from 'src/authors/entities/author.entity';
import { Bibliography } from 'src/bibliographies/entities/bibliography.entity';
import { Borrowing } from 'src/borrowings/entities/borrowing.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Reserve } from 'src/reserves/entities/reserve.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  isbn: string;

  @Column()
  title: string;

  @Column()
  language: string;

  @Column()
  year: number;

  @Column()
  edition: number;

  @Column()
  quantity: number;

  @ManyToMany(() => Author, (author) => author.books, { eager: true })
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => Tag, (tag) => tag.books, { eager: true })
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Category, (category) => category.books, { eager: true })
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => Publisher, (publisher) => publisher.books, { eager: true })
  @JoinTable()
  publisher: Publisher;

  @ManyToMany(() => Bibliography, (bibliography) => bibliography.books)
  bibliographies: Bibliography[];

  @OneToMany(() => Reserve, (reserve) => reserve.book)
  reserves: Reserve[];

  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowings: Borrowing[];
}
