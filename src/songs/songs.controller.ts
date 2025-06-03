import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Conncetion } from 'src/common/constants/connection';
import { DevConfigService } from 'src/common/providers/devConfigService';
import { Song } from './songs.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/guards/artist-jwt.guard';

// @Controller({ path: 'songs', scope: Scope.REQUEST })
@Controller('songs')
export class SongsController {
  constructor(
    @Inject('CONNECTION') private connection: Conncetion,
    private songsService: SongsService,
  ) {
    console.log(this.connection.CONNECTION_STRING);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    try {
      limit = limit > 100 ? 100 : limit;
      return this.songsService.paginate({ page, limit });
    } catch (err) {
      throw new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: err },
      );
    }
  }

  @Get(':id')
  findSongById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    return this.songsService.findById(id);
  }

  @Post()
  @UseGuards(JwtArtistGuard)
  createSong(
    @Body() createSongDTO: CreateSongDTO,
    @Request() req,
  ): Promise<Song> {
    console.log(req.user);
    return this.songsService.create(createSongDTO);
  }

  @Patch(':id')
  updateSong(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDTO,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  deleteSong(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }
}
