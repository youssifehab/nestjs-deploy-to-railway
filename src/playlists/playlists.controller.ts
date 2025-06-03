import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlaylistDTO } from './dto/create-playlist-dto';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistService: PlaylistsService) {}
  @Post()
  createPlaylist(@Body() playlistDto: CreatePlaylistDTO): Promise<Playlist> {
    return this.playlistService.create(playlistDto);
  }
}
