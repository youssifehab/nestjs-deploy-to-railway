import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlaylistDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly songs: number[];

  @IsNotEmpty()
  @IsNumber()
  readonly user: number;
}
