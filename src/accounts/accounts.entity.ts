import { Posts } from '../posts/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('accounts')
export class Accounts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  username: string;

  @Column({ length: 200 })
  tip_social: string;

  @Column({nullable:true})
  full_name: string;

  @Column({nullable:true})
  biography: string;

  @Column({nullable:true})
  mediacount: number;

  @Column({nullable:true})
  profile_pic_url: string;

  @OneToMany(() => Posts, (post) => post.accounts)
  posts: Posts[];
}



// import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
// import { Accounts } from '../accounts/accounts.entity'

// @Entity('posts')
// export class Posts {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(()=> Accounts, (account)=>account.id)
//   @JoinColumn({ name: "accounts_id" })
//   accounts: Accounts;

//   @Column({nullable:true})
//   content: string;

//   @Column({unique:true})
//   media_pk: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created: Date;

//   @Column()
//   db_acc_id: number;
// }

