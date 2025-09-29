import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758537859553 implements MigrationInterface {
    name = 'InitialMigration1758537859553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "full_text"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "full_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "biography" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "mediacount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "profile_pic_url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "profile_pic_url"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "mediacount"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "biography"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "full_text" character varying NOT NULL`);
    }

}
