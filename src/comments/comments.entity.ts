import { Posts } from '../posts/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>Posts, (post)=>post.id)
  @JoinColumn({ name: "posts_id" })
  posts: Posts;

  @Column({nullable:true})
  text: string;

  @Column({ length: 200, nullable:true })
  label: string;

  @Column({type: 'decimal', precision: 5, scale: 2, nullable:true})
  score: number;

  @Column({unique:true})
  comment_pk: string;
}