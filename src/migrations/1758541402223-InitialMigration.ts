import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758541402223 implements MigrationInterface {
    name = 'InitialMigration1758541402223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_3a72cc828d53d3322d7eca3d07b"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "postsId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "posts_id" integer`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "UQ_f637851dfee56b0c1136d20cc75" UNIQUE ("comment_pk")`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_46d88a8ad6b206bcdb926e04a91" FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_46d88a8ad6b206bcdb926e04a91"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "UQ_f637851dfee56b0c1136d20cc75"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "posts_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "postsId" integer`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_3a72cc828d53d3322d7eca3d07b" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
