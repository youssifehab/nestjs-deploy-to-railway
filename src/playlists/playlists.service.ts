import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { Song } from 'src/songs/songs.entity';
import { User } from 'src/users/user.entity';
import { CreatePlaylistDTO } from './dto/create-playlist-dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist) private playlistRepo: Repository<Playlist>,
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(playlistDTO: CreatePlaylistDTO): Promise<Playlist> {
    const { songs, user, ...rest } = playlistDTO;
    const playlist = Object.assign(new Playlist(), rest);

    playlist.songs = await this.songRepo.find({ where: { id: In(songs) } });
    playlist.user = await this.userRepo.findOneBy({ id: user });

    return this.playlistRepo.save(playlist);
  }
}
