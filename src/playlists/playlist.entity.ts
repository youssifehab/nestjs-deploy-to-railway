import { Song } from 'src/songs/songs.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Song, (song) => song.playlist)
  songs: Song[];

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;
}
