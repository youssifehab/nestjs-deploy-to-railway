import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './songs.entity';
import { Artist } from 'src/artists/artist.entity';

const MockSongsService = {
  findAll() {
    return [{ id: 1, title: 'last dance' }];
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],

  // Default and simple usage.
  // providers: [SongsService], // option 1

  // When you need control (e.g., mocking, token-based DI, aliases).
  // providers: [{ provide: SongsService, useClass: SongsService }], // option 2

  // when you want constant value
  // providers: [{ provide: SongsService, useValue: MockSongsService }], // option 3

  providers: [SongsService, { provide: 'CONNECTION', useValue: connection }],
})
export class SongsModule {}
