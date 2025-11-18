import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities2025New1763432363859 implements MigrationInterface {
    name = 'UpdateEntities2025New1763432363859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ecopoint_actions" ("action_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "points_base" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bcce9c7e6c11e152f16c4818f8b" UNIQUE ("name"), CONSTRAINT "PK_8a9197ba26a79fe62eb5d8ff818" PRIMARY KEY ("action_id"))`);
        await queryRunner.query(`CREATE TABLE "ecopoint_user_history" ("eco_user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "points_action" integer NOT NULL, "factor_category" double precision NOT NULL, "points_total" double precision NOT NULL, "extra_data" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "action_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_e6112d4d6ded5217ab592c22441" PRIMARY KEY ("eco_user_id"))`);
        await queryRunner.query(`CREATE TABLE "ecopoint_category_factors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "factor_circular" double precision NOT NULL, "active" boolean NOT NULL DEFAULT true, "category_id" uuid NOT NULL, CONSTRAINT "PK_a2c56f1a4a32d7cf970f71ca9f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."categories_block_enum" AS ENUM('A', 'B', 'C', 'D', 'E')`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "block" "public"."categories_block_enum"`);
        await queryRunner.query(`ALTER TABLE "ecopoint_user_history" ADD CONSTRAINT "FK_4720a362f8b88536398efb74dda" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ecopoint_user_history" ADD CONSTRAINT "FK_328289b2b08f4a42f183a2ca821" FOREIGN KEY ("action_id") REFERENCES "ecopoint_actions"("action_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ecopoint_user_history" ADD CONSTRAINT "FK_6d68b521716b9dc3e081aa0065e" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ecopoint_category_factors" ADD CONSTRAINT "FK_227c1cfd1f8a5d07202039485b3" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ecopoint_category_factors" DROP CONSTRAINT "FK_227c1cfd1f8a5d07202039485b3"`);
        await queryRunner.query(`ALTER TABLE "ecopoint_user_history" DROP CONSTRAINT "FK_6d68b521716b9dc3e081aa0065e"`);
        await queryRunner.query(`ALTER TABLE "ecopoint_user_history" DROP CONSTRAINT "FK_328289b2b08f4a42f183a2ca821"`);
        await queryRunner.query(`ALTER TABLE "ecopoint_user_history" DROP CONSTRAINT "FK_4720a362f8b88536398efb74dda"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "block"`);
        await queryRunner.query(`DROP TYPE "public"."categories_block_enum"`);
        await queryRunner.query(`DROP TABLE "ecopoint_category_factors"`);
        await queryRunner.query(`DROP TABLE "ecopoint_user_history"`);
        await queryRunner.query(`DROP TABLE "ecopoint_actions"`);
    }

}
