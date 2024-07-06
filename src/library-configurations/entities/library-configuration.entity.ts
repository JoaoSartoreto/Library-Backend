import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LibraryConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'timestamp with time zone' })
  startingDate: Date;

  @Column({ type: 'numeric' })
  dailyFine: number;

  @Column({ type: 'integer' })
  maxBorrowedBooksByUser: number;

  @Column({ type: 'integer' })
  maxBorrowingDurationDays: number;

  @Column({ type: 'integer' })
  maxReservesByUser: number;
}
