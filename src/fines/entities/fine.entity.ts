import { Borrowing } from 'src/borrowings/entities/borrowing.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Fine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isPaid: boolean;

  @Column()
  dailyFine: number;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @OneToOne(() => Borrowing, (borrowing) => borrowing.fine)
  borrowing: Borrowing;
}
