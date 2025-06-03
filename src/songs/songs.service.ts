import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conncetion } from 'src/common/constants/connection';
import { Song } from './songs.entity';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { title } from 'process';
import { Artist } from 'src/artists/artist.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  // local array
  private readonly songs = [];

  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
  ) {}

  async create(songDto: CreateSongDTO): Promise<Song> {
    const { artists: artistsId, ...rest } = songDto;
    const song = Object.assign(new Song(), rest);
    const artists = await this.artistRepo.find({
      where: { id: In(artistsId) },
    });
    song.artists = artists;
    return this.songRepo.save(song);
  }

  async findAll(): Promise<Song[]> {
    return await this.songRepo.find();
  }

  async findById(id: number): Promise<Song> {
    return this.songRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.songRepo.delete({ id });
  }

  async update(
    id: number,
    updateSongDto: UpdateSongDTO,
  ): Promise<UpdateResult> {
    const { artists: artistId, ...rest } = updateSongDto;
    const newSong = Object.assign(new Song(), rest);
    if (updateSongDto.artists) {
      newSong.artists = await this.artistRepo.find({
        where: { id: In(artistId) },
      });
    }
    return this.songRepo.update(id, newSong);
  }

  async paginate(option: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepo.createQueryBuilder('song');

    // Optional: Customize query (e.g., add filters)
    // queryBuilder.where('song.title like :title', { title: '%C%' });
    queryBuilder.orderBy('song.releasedDate', 'DESC');

    return paginate<Song>(queryBuilder, option);
  }
}
