import {Entity, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {UrlEntity} from '../url-shortening/url.entity';

@Entity()
export class AnalyticsEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=> UrlEntity, UrlEntity=>UrlEntity.analytics)
    url:UrlEntity;

    @Column({type:'timestamp'})
    clickedAtTimeStamp:Date;

    @Column({type:'text'})
    userAgent:string;

    @Column({type:'text'})
    referralSource:string;

    @CreateDateColumn({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP'})
    createdAt:Date;
}