import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758608737649 implements MigrationInterface {
    name = 'InitialMigration1758608737649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "image_url" character varying`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "video_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "video_url"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "image_url"`);
    }

}
