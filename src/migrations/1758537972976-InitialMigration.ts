import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758537972976 implements MigrationInterface {
    name = 'InitialMigration1758537972976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "full_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "biography" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "mediacount" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "profile_pic_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "profile_pic_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "mediacount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "biography" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "full_name" SET NOT NULL`);
    }

}
