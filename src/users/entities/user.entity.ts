import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Reserve } from 'src/reserves/entities/reserve.entity';
import { Borrowing } from 'src/borrowings/entities/borrowing.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  fullName: string;

  @Column()
  isLibrarian: boolean;

  @Column({ nullable: true, select: false })
  passwordUpdateDate?: Date;

  @OneToMany(() => Reserve, (reserve) => reserve.user)
  reserves: Reserve[];

  @OneToMany(() => Borrowing, (borrowing) => borrowing.user)
  borrowings: Borrowing[];

  @DeleteDateColumn({ select: false })
  deleteDate?: Date;

  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
