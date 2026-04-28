-- ============================================================================
-- Backfill cho việc tách Product → ProductVariant
-- ============================================================================
-- CHẠY FILE NÀY TRƯỚC khi `prisma db push` áp schema mới (vì schema mới sẽ
-- xóa các cột price/stock/sku/volumeMl/compareAtPrice trên Product).
--
-- Yêu cầu: PostgreSQL >= 13 với pgcrypto (gen_random_uuid()) — đa số đã có sẵn.
-- Cách chạy: psql $DATABASE_URL -f prisma/backfill-multi-variant.sql
-- ============================================================================

BEGIN;

-- 1. Tạo bảng ProductVariant
CREATE TABLE IF NOT EXISTS "ProductVariant" (
  "id"             TEXT NOT NULL,
  "productId"      TEXT NOT NULL,
  "volumeMl"       INTEGER NOT NULL,
  "price"          DECIMAL(12, 2) NOT NULL,
  "compareAtPrice" DECIMAL(12, 2),
  "stock"          INTEGER NOT NULL DEFAULT 0,
  "sku"            TEXT,
  "isDefault"      BOOLEAN NOT NULL DEFAULT false,
  "position"       INTEGER NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProductVariant_sku_key"
  ON "ProductVariant"("sku");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductVariant_productId_volumeMl_key"
  ON "ProductVariant"("productId", "volumeMl");
CREATE INDEX IF NOT EXISTS "ProductVariant_productId_idx"
  ON "ProductVariant"("productId");

ALTER TABLE "ProductVariant"
  ADD CONSTRAINT "ProductVariant_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Backfill: mỗi product cũ → 1 variant mặc định kế thừa giá/tồn kho/SKU
INSERT INTO "ProductVariant"
  ("id", "productId", "volumeMl", "price", "compareAtPrice", "stock", "sku", "isDefault", "position")
SELECT
  'cv_' || replace(gen_random_uuid()::text, '-', ''),
  p."id",
  p."volumeMl",
  p."price",
  p."compareAtPrice",
  p."stock",
  p."sku",
  true,
  0
FROM "Product" p;

-- 3. CartItem: thêm variantId, link tới default variant, sau đó bỏ productId
ALTER TABLE "CartItem" ADD COLUMN IF NOT EXISTS "variantId" TEXT;

UPDATE "CartItem" ci
SET "variantId" = pv."id"
FROM "ProductVariant" pv
WHERE pv."productId" = ci."productId"
  AND pv."isDefault" = true
  AND ci."variantId" IS NULL;

ALTER TABLE "CartItem" DROP CONSTRAINT IF EXISTS "CartItem_userId_productId_key";
ALTER TABLE "CartItem" DROP CONSTRAINT IF EXISTS "CartItem_productId_fkey";
ALTER TABLE "CartItem" DROP COLUMN IF EXISTS "productId";

ALTER TABLE "CartItem" ALTER COLUMN "variantId" SET NOT NULL;
ALTER TABLE "CartItem"
  ADD CONSTRAINT "CartItem_variantId_fkey"
  FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_userId_variantId_key"
  ON "CartItem"("userId", "variantId");

-- 4. OrderItem: thêm variantId (nullable, SetNull) + snapshot volumeMl
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "variantId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "volumeMl" INTEGER;

UPDATE "OrderItem" oi
SET "variantId" = pv."id",
    "volumeMl"  = pv."volumeMl"
FROM "ProductVariant" pv
WHERE pv."productId" = oi."productId"
  AND pv."isDefault" = true
  AND oi."variantId" IS NULL;

ALTER TABLE "OrderItem" ALTER COLUMN "volumeMl" SET NOT NULL;
ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_variantId_fkey"
  FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 5. Thêm 2 cột denormalized trên Product (minPrice/hasDiscount) cho filter/sort
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "minPrice" DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "hasDiscount" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Product" p
SET "minPrice" = sub."minPrice",
    "hasDiscount" = sub."hasDiscount"
FROM (
  SELECT
    "productId",
    MIN("price")                                         AS "minPrice",
    BOOL_OR("compareAtPrice" IS NOT NULL)                AS "hasDiscount"
  FROM "ProductVariant"
  GROUP BY "productId"
) sub
WHERE p."id" = sub."productId";

CREATE INDEX IF NOT EXISTS "Product_minPrice_idx" ON "Product"("minPrice");

-- 6. Bỏ các cột cũ trên Product (giá/tồn kho/SKU/dung tích)
ALTER TABLE "Product" DROP COLUMN IF EXISTS "price";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "compareAtPrice";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "stock";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "sku";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "volumeMl";

COMMIT;

-- ============================================================================
-- Sau khi chạy xong file này, chạy tiếp:
--   npm run db:generate   # cập nhật Prisma client
-- KHÔNG cần chạy `db push` nữa vì DB đã ở đúng trạng thái schema mới.
-- ============================================================================
