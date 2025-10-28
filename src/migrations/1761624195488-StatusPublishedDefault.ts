import { MigrationInterface, QueryRunner } from "typeorm";

export class StatusPublishedDefault1761624195488 implements MigrationInterface {
    name = 'StatusPublishedDefault1761624195488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'published'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'draft'`);
    }

}
