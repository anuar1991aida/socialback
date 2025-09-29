import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Accounts } from '../../accounts/accounts.entity'

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> Accounts, (account)=>account.id)
  @JoinColumn({ name: "accounts_id" })
  accounts: Accounts;

  @Column({nullable:true})
  content: string;

  @Column({unique:true})
  media_pk: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column()
  db_acc_id: number;

  @Column({nullable:true})
  image_url: string;

  @Column({nullable:true})
  video_url: string;
}
