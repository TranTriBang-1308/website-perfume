# Database Rules — Schema, Validation & Conventions

## Nguyên Tắc
- **Prisma ORM v6** là lớp truy cập DB duy nhất
- Luôn import từ singleton: `import { prisma } from "@/lib/prisma"`
- **KHÔNG** khởi tạo `new PrismaClient()` ở nhiều nơi (gây leak connection)
- Mọi thay đổi schema phải qua migration (prod) hoặc `db push` (dev)

## Models

### Auth & User
| Model | Mục đích |
|---|---|
| `User` | Tài khoản — có `role: USER \| ADMIN` |
| `Account` | OAuth provider (Google, …) — quản lý bởi NextAuth |
| `Session` | Session lưu DB — quản lý bởi NextAuth |
| `VerificationToken` | Magic link / email verify |
| `Address` | Địa chỉ giao hàng của user (nhiều địa chỉ, có `isDefault`) |

### Catalog
| Model | Mục đích |
|---|---|
| `Brand` | Thương hiệu (Chanel, Dior, …) có `slug` unique |
| `Category` | Danh mục (Nước hoa nam, nữ, unisex, …) |
| `Product` | Sản phẩm — `slug` unique + 2 cột denormalized `minPrice`, `hasDiscount` (đồng bộ từ variants) cho filter/sort |
| `ProductVariant` | **Biến thể dung tích** — mỗi product có 1+ variant (10ml, 50ml, 100ml…), giá/tồn/SKU riêng. Unique `(productId, volumeMl)`, có 1 `isDefault: true` |
| `ProductImage` | Ảnh sản phẩm (nhiều ảnh, có `position` để sort) |

### Commerce
| Model | Mục đích |
|---|---|
| `CartItem` | Item trong giỏ — unique theo `(userId, variantId)` (cart trỏ vào variant, không phải product) |
| `WishlistItem` | Danh sách yêu thích — unique theo `(userId, productId)` (wishlist ở mức product) |
| `Order` | Đơn hàng — có `orderNumber` unique (format `PF-XXX-YYY`) |
| `OrderItem` | Chi tiết đơn — snapshot `productName`, `volumeMl`, `price` tại thời điểm mua. Có cả `productId` (FK) + `variantId` nullable (SetNull khi variant bị xóa) |
| `Payment` | Giao dịch thanh toán — `1-1` với Order |

### Social & Marketing
| Model | Mục đích |
|---|---|
| `Review` | Đánh giá sản phẩm — unique `(userId, productId)`, rating 1-5 |
| `Coupon` | Mã giảm giá — theo `code` unique, có `usageLimit` và `usedCount` |

## Enums Bắt Buộc

```ts
enum Role          { USER, ADMIN }
enum Gender        { MALE, FEMALE, UNISEX }
enum Concentration { PARFUM, EDP, EDT, EDC }
enum OrderStatus   { PENDING, CONFIRMED, PROCESSING, SHIPPING, DELIVERED, CANCELLED, REFUNDED }
enum PaymentStatus { PENDING, PAID, FAILED, REFUNDED }
enum PaymentMethod { COD, VNPAY, MOMO, BANK_TRANSFER }
enum DiscountType  { PERCENTAGE, FIXED }
```

### Luồng OrderStatus hợp lệ
```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED
   ↓           ↓           ↓
CANCELLED  CANCELLED   CANCELLED
                                      ↓
                                  REFUNDED
```
- Sau `SHIPPING` hoặc `DELIVERED` không được hủy — chỉ refund
- `CANCELLED` / `REFUNDED` là trạng thái cuối

## Validation với Zod (BẮT BUỘC)

### Nguyên tắc
- **Mọi API Route** nhận input phải validate bằng Zod trước khi xử lý
- Lưu schema ở `lib/validations/*.ts`, tách theo domain (product, order, auth, …)
- Trả lỗi 400 với `details: error.issues` khi validate fail

### Pattern chuẩn
```ts
// lib/validations/product.ts
import { z } from "zod";

// Schema cho 1 variant (dung tích)
export const productVariantInputSchema = z.object({
  id: z.string().cuid().optional(), // có khi sửa, không có khi tạo mới
  volumeMl: z.number().int().positive(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
  position: z.number().int().nonnegative().default(0),
});

export const productCreateSchema = z
  .object({
    name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
    slug: z.string().regex(/^[a-z0-9-]+$/, "Slug không hợp lệ"),
    gender: z.enum(["MALE", "FEMALE", "UNISEX"]),
    concentration: z.enum(["PARFUM", "EDP", "EDT", "EDC"]),
    brandId: z.string().cuid(),
    categoryId: z.string().cuid(),
    variants: z.array(productVariantInputSchema).min(1),
  })
  .refine((d) => d.variants.filter((v) => v.isDefault).length === 1, {
    message: "Phải có đúng 1 dung tích mặc định",
    path: ["variants"],
  })
  .refine(
    (d) => new Set(d.variants.map((v) => v.volumeMl)).size === d.variants.length,
    { message: "Các dung tích không được trùng nhau", path: ["variants"] }
  );

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
```

```ts
// app/api/products/route.ts
import { productCreateSchema } from "@/lib/validations/product";

export async function POST(req: Request) {
  const body = await req.json();
  const result = productCreateSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: "Validation failed", details: result.error.issues },
      { status: 400 }
    );
  }
  // ... xử lý với result.data
}
```

### Validate ở client
- Dùng cùng schema Zod ở form (React Hook Form + `@hookform/resolvers/zod`)
- KHÔNG bypass validate client chỉ vì "đã validate ở server"

## Query Conventions

### Performance
- **Luôn** dùng `select` hoặc `include` có chọn lọc, KHÔNG select `*` mặc định
- Pagination mọi list endpoint: `?page=1&limit=20` (max 100)
- Khi cần count + data dùng `$transaction([count, findMany])`

### Ví dụ pattern tốt
```ts
const [total, products] = await prisma.$transaction([
  prisma.product.count({ where: { isActive: true } }),
  prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true, name: true, slug: true,
      minPrice: true, hasDiscount: true,
      images: { take: 1, orderBy: { position: "asc" } },
      brand: { select: { name: true, slug: true } },
      // Lấy variant mặc định để hiển thị giá/dung tích trên card
      variants: {
        where: { isDefault: true },
        take: 1,
        select: { id: true, volumeMl: true, price: true, compareAtPrice: true, stock: true },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  }),
]);
```

### Filter/sort theo giá
- Filter `minPrice/maxPrice`: dùng `Product.minPrice` (denormalized) — không filter qua relation `variants`.
- Sort `price-asc/desc`: `orderBy: { minPrice: "asc" }` — Prisma không hỗ trợ orderBy theo aggregate của relation, nên buộc phải denormalize.
- Sau khi tạo/sửa/xóa variant: gọi `syncProductPriceCache(productId)` từ `lib/queries/variants.ts` để cập nhật `minPrice` + `hasDiscount`.

### Soft delete
- Dùng `isActive: false` thay vì xóa thật với `Product`, `Brand`, `Category`
- Order KHÔNG bao giờ xóa, chỉ chuyển `status: CANCELLED`

## Authorization (BẮT BUỘC trong API)

Mọi API Route kiểm tra session TRƯỚC khi query:
```ts
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  // ...
}
```

## Decimal & Money
- **KHÔNG** dùng `Number` cho giá tiền — Prisma trả `Decimal`
- Convert trước khi trả client: `price: product.price.toString()` hoặc `.toNumber()`
- Tính toán: dùng thư viện `decimal.js` hoặc giữ nguyên Prisma Decimal

## Migration Workflow
- **Dev nhanh**: `npm run db:push` (không tạo migration file)
- **Trước PR**: `npm run db:migrate -- --name <tên_mô_tả>` → commit cả migration
- **KHÔNG** sửa migration đã merge — tạo migration mới
- **Migration có data move** (ví dụ Product → ProductVariant): viết SQL thủ công trong `prisma/*.sql` rồi chạy qua `psql $DIRECT_URL -f file.sql` BEFORE chạy `db push --accept-data-loss`. Xem ví dụ `prisma/backfill-multi-variant.sql`.

## Multi-Variant — Quy ước

### Ngữ nghĩa
- 1 sản phẩm có thể có nhiều dung tích (variant). Mỗi variant có **giá, tồn kho, SKU, compareAtPrice riêng**.
- Phải có **đúng 1 variant mặc định** (`isDefault: true`) — dùng làm giá hiển thị trên product card và để filter.
- `Product.minPrice` = `MIN(variants.price)` — denormalized cho filter/sort.
- `Product.hasDiscount` = `true` nếu có ít nhất 1 variant có `compareAtPrice` — dùng cho filter "đang sale".

### Quy tắc bất biến
- Cart trỏ vào **variant**, không phải product (`CartItem.variantId`).
- OrderItem **snapshot** `productName`, `volumeMl`, `price` tại thời điểm mua. Không lấy lại từ variant khi hiển thị đơn cũ.
- Khi xóa variant: `CartItem` cascade-delete (mất khỏi giỏ); `OrderItem.variantId` SetNull (giữ snapshot, đơn cũ vẫn hiển thị đúng).
- Mọi mutation variant (create/update/delete) phải gọi `syncProductPriceCache(productId)` để đồng bộ `Product.minPrice` + `hasDiscount`.

### UI selector
- Component `VariantSelector` ở `components/store/variant-selector.tsx` — hiển thị danh sách dung tích, click đổi giá, gắn vào `AddToCartButton` với `variantId` đang chọn.
- Variant hết hàng: hiển thị nút disabled với line-through, không cho add.
