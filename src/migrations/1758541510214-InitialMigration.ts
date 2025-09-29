import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758541510214 implements MigrationInterface {
    name = 'InitialMigration1758541510214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "text" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "label" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "score" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "label" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "text" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "content" SET NOT NULL`);
    }

}
