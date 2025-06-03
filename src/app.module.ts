import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/devConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Song } from './songs/songs.entity';
import { Playlist } from './playlists/playlist.entity';
import { DataSource } from 'typeorm';
import { Artist } from './artists/artist.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions, typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'dotenv.validation';

const devConfig = { port: 3001 };
const proConfig = { port: 5000 };

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration],
      // validate: validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    SongsModule,
    PlaylistsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: DevConfigService, useClass: DevConfigService },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'DEV' ? devConfig : proConfig;
      },
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSourse: DataSource) {
    console.log('database name: ', dataSourse.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option 1
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); // option 2
    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // optipn 3
  }
}
