import { Migration } from "@mikro-orm/migrations"

export class Migration20240101000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "wishlist_item" (
        "id" text NOT NULL,
        "customer_id" text NOT NULL,
        "product_id" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" timestamptz,
        CONSTRAINT "wishlist_item_pkey" PRIMARY KEY ("id")
      );
    `)

    // Add index for performance
    this.addSql(`
      CREATE INDEX "IDX_wishlist_item_customer_id" ON "wishlist_item" ("customer_id");
    `)
    
    this.addSql(`
      CREATE INDEX "IDX_wishlist_item_product_id" ON "wishlist_item" ("product_id");
    `)
    
    // Add unique constraint to prevent duplicates
    this.addSql(`
      CREATE UNIQUE INDEX "IDX_wishlist_item_customer_product" ON "wishlist_item" ("customer_id", "product_id") WHERE "deleted_at" IS NULL;
    `)
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "wishlist_item" CASCADE;')
  }
}