import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/songs.entity';
import { User } from 'src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

// const path = require('path');
// const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
// console.log('===========>>>>',envPath)
// require('dotenv').config({ path: envPath });
require('dotenv').config();
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get<string>('db_host'),
      port: configService.get<number>('db_port'),
      username: configService.get<string>('db_username'),
      password: configService.get<string>('db_password'),
      database: configService.get<string>('db_name'),
      // entities: ['dist/**/*.entity.js'],
      entities: [User, Playlist, Artist, Song],
      synchronize: false,
      migrations: ['dist/db/migrations/*.js'],
    };
  },
};

console.log(process.env.NODE_ENV);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PASSWORD);
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
