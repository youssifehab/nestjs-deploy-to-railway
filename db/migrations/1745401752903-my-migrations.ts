import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigrations1745401752903 implements MigrationInterface {
    name = 'MyMigrations1745401752903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artists" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_f7bd9114dc2849a90d39512911" UNIQUE ("userId"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Songs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "releasedDate" date NOT NULL, "duration" TIME NOT NULL, "lyrics" text, "playlistId" integer, CONSTRAINT "PK_1dfdb20e61091a01eab9a067a86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "twoFASecret" text, "enable2FA" boolean NOT NULL DEFAULT false, "apiKey" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs-artists" ("songsId" integer NOT NULL, "artistsId" integer NOT NULL, CONSTRAINT "PK_fca6786574f91139c490ae52df0" PRIMARY KEY ("songsId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_932808207bb5ee75efac9ccea6" ON "songs-artists" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7af0e893ca6441ec17e05e68c0" ON "songs-artists" ("artistsId") `);
        await queryRunner.query(`ALTER TABLE "artists" ADD CONSTRAINT "FK_f7bd9114dc2849a90d39512911b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Songs" ADD CONSTRAINT "FK_c341fc026c9a3e0ea621dcd8b15" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_708a919e9aa49019000d9e9b68e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs-artists" ADD CONSTRAINT "FK_932808207bb5ee75efac9ccea64" FOREIGN KEY ("songsId") REFERENCES "Songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs-artists" ADD CONSTRAINT "FK_7af0e893ca6441ec17e05e68c09" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs-artists" DROP CONSTRAINT "FK_7af0e893ca6441ec17e05e68c09"`);
        await queryRunner.query(`ALTER TABLE "songs-artists" DROP CONSTRAINT "FK_932808207bb5ee75efac9ccea64"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_708a919e9aa49019000d9e9b68e"`);
        await queryRunner.query(`ALTER TABLE "Songs" DROP CONSTRAINT "FK_c341fc026c9a3e0ea621dcd8b15"`);
        await queryRunner.query(`ALTER TABLE "artists" DROP CONSTRAINT "FK_f7bd9114dc2849a90d39512911b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7af0e893ca6441ec17e05e68c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_932808207bb5ee75efac9ccea6"`);
        await queryRunner.query(`DROP TABLE "songs-artists"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
        await queryRunner.query(`DROP TABLE "Songs"`);
        await queryRunner.query(`DROP TABLE "artists"`);
    }

}
