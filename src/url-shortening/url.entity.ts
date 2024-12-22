import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { AuthEntity } from '../auth/auth.entity';
import { AnalyticsEntity } from '../analytics/analytics.entity';

@Entity()
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  longUrl: string;

  @Column({ type: 'text' })
  shortUrl: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => AuthEntity, (AuthEntity) => AuthEntity.urls)
  user: AuthEntity;

  @OneToMany(() => AnalyticsEntity, (AnalyticsEntity) => AnalyticsEntity.url)
  analytics: AnalyticsEntity[];

  @BeforeInsert()
  setExpirationDate() {
    const expirationPeriodInDays = 60;
    const currentDate = new Date();
    this.expiresAt = new Date(
      currentDate.getTime() + expirationPeriodInDays * 24 * 60 * 60 * 1000,
    );
  }
}
