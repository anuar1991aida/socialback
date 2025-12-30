import { Posts } from '../posts/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Posts, (post) => post.id)
  @JoinColumn({ name: "posts_id" })
  posts: Posts;

  @Column({nullable:true})
  text: string;

  @Column({ length: 200, nullable:true })
  label: string;

  @Column({type: 'decimal', precision: 5, scale: 2, nullable:true})
  score: number;

  @Column({nullable:true})
  tip_social: string;

  @Column({nullable:true})
  category_id: number;

  @Column({type: 'decimal', precision: 5, scale: 2, nullable:true})
  likes: number;

  @Column({unique:true})
  comment_pk: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;
}