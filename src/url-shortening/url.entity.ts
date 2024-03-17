import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { AuthEntity } from 'src/auth/auth.entity';

@Entity()
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  longUrl: string;

  @Column({ type: 'text' })
  shortUrl: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => AuthEntity, AuthEntity=>AuthEntity.urls)
  user: AuthEntity;

  @BeforeInsert()
  setExpirationDate() {
    const expirationPeriodInDays = 60;
    const currentDate = new Date();
    this.expiresAt = new Date(
      currentDate.getTime() + expirationPeriodInDays * 24 * 60 * 60 * 1000,
    );
  }
}
