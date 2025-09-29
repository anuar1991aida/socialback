import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758541273172 implements MigrationInterface {
    name = 'InitialMigration1758541273172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "UQ_afaebe19499d412161a46b42c66" UNIQUE ("media_pk")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "UQ_afaebe19499d412161a46b42c66"`);
    }

}
