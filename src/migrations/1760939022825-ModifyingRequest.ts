import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyingRequest1760939022825 implements MigrationInterface {
    name = 'ModifyingRequest1760939022825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_442952e763e78eca4964df203bc"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_8821b8b846b641c99dbaf39f263"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "listingListingId"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "requesterUserId"`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "listing_id" uuid`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "requester_id" uuid`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_2b52785cba26ec7ee7561c1bb5c" FOREIGN KEY ("listing_id") REFERENCES "listings"("listing_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_394fe48b64d0de79ad6159ed28c" FOREIGN KEY ("requester_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_394fe48b64d0de79ad6159ed28c"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_2b52785cba26ec7ee7561c1bb5c"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "requester_id"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "listing_id"`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "requesterUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "listingListingId" uuid`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_8821b8b846b641c99dbaf39f263" FOREIGN KEY ("listingListingId") REFERENCES "listings"("listing_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_442952e763e78eca4964df203bc" FOREIGN KEY ("requesterUserId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
