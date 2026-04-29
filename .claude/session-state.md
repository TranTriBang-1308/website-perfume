# Session State — Trạng Thái Phiên Làm Việc

> Cập nhật: 2026-04-29 — **Phase 6 (Multi-Variant) hoàn thành**. Đã deploy production.

## Phase 6 — Multi-Variant (2026-04-28 → 2026-04-29)

### Schema (đã làm)
- `prisma/schema.prisma`: thêm `ProductVariant`, bỏ price/stock/sku/volumeMl/compareAtPrice khỏi `Product`, thêm denormalized `Product.minPrice` + `hasDiscount`. `CartItem.productId → variantId`. `OrderItem` thêm `variantId` (nullable SetNull) + snapshot `volumeMl`.
- `prisma/backfill-multi-variant.sql`: SQL `BEGIN/COMMIT` 1 transaction — tạo bảng ProductVariant, backfill 1 default variant per product cũ, di `CartItem.productId → variantId`, di `OrderItem.variantId + volumeMl`, drop cột cũ trên Product, tính `minPrice`/`hasDiscount`.
- `prisma/seed.ts`: mỗi sản phẩm tạo 1 default variant theo dung tích gốc + 2 variant nhỏ (10ml @ 20% giá, 50ml @ 60% giá).
- `lib/queries/variants.ts` (mới): `syncProductPriceCache(productId)` (gọi sau mọi mutation variant), `getDefaultVariant(productId)`.

### Backend (đã làm)
- `lib/validations/product.ts`: `productVariantInputSchema` + `productCreateSchema.variants[]` với 2 refine (đúng 1 default, không trùng dung tích). `productUpdateSchema` validate variants ở route handler vì refine không chạy với partial.
- `lib/validations/cart.ts`: tất cả schema đổi `productId → variantId`.
- `lib/queries/products.ts`: `productCardSelect` chung — lấy variant mặc định + minPrice/hasDiscount. Sort `price-asc/desc` qua `Product.minPrice` (Prisma không hỗ trợ orderBy aggregate).
- `lib/queries/cart.ts`: include `variant.product`, convert Decimal sang Number trước khi pass xuống Client.
- `app/api/cart/route.ts` + `sync/route.ts`: dùng `variantId`, unique constraint `userId_variantId`, check tồn kho qua variant.
- `app/api/orders/route.ts`: cart items → snapshot `productName + volumeMl + price`, trừ tồn kho `productVariant`, sau commit gọi `syncProductPriceCache` cho các product bị đụng.
- `app/api/admin/products/route.ts` + `[id]/route.ts`: nested create variants khi tạo. Khi update, sync 3 thao tác trong transaction (delete variant không có trong payload, update có id, create không id) rồi gọi `syncProductPriceCache`.
- `app/api/products/suggest/route.ts`: dùng `minPrice` + `compareAtPrice` từ variant mặc định.
- `lib/guest-cart.ts`: localStorage key `parfum:guest-cart`, item `{variantId, quantity}`.

### UI (đã làm)
- `components/store/variant-selector.tsx` (mới): client component, ban đầu chọn variant đầu còn hàng, click đổi giá + compareAtPrice + tồn kho realtime, gắn vào `AddToCartButton` với `variantId` đang chọn. Guard: trả message "chưa có dung tích" khi `variants` rỗng.
- `components/store/product-card.tsx`: lấy variant mặc định để hiển thị giá + dung tích, fallback `Number(product.minPrice)` nếu không có default.
- `components/store/cart-line.tsx`: hiển thị `variant.volumeMl`, gọi `/api/cart` với `variantId`.
- `components/store/add-to-cart-button.tsx`: prop đổi `productId → variantId`, sync vào guest cart cũng dùng `variantId`.
- `app/(store)/products/[slug]/page.tsx`: map variants thành `VariantOption[]`, truyền vào `VariantSelector`. Bỏ block giá tĩnh + tồn kho (giờ thuộc selector).
- `app/(store)/cart`, `checkout/success/[id]`, `account/orders/[id]`, `(admin)/admin/orders/[id]`: hiển thị `item.volumeMl` snapshot.
- `app/(store)/account/wishlist`: dùng `minPrice` + tổng tồn kho mọi variant để xác định "Hết hàng".
- `components/admin/product-form.tsx`: thêm section "Dung tích & giá" với `useFieldArray` cho `variants`, radio "Mặc định" (chỉ 1), nút thêm/xóa, validation server hiển thị qua `variantsError`.
- `app/(admin)/admin/products/page.tsx`: bảng list hiển thị "Dung tích / Giá từ / Tổng tồn", search SKU theo variant qua `variants.some.sku`.
- `app/(admin)/admin/products/[id]/page.tsx`: load `variants` order theo `position`, truyền vào form qua `initialValues.variants`.

### Bugfix khi deploy
- **Build error**: Next.js 16 đổi signature `revalidateTag(tag, profile)` cần 2 args — fix `revalidateTag("products", "max")` ở `app/api/admin/products/route.ts:63` và `[id]/route.ts:115/139`.
- **Runtime error mọi trang trên Vercel** (chưa fix bằng code): root cause là DB production chưa được áp schema mới. Fix bằng cách chạy `prisma/backfill-multi-variant.sql` qua Neon SQL Editor (hoặc `psql $DIRECT_URL -f`) trước khi deploy có hiệu lực.

### Quy ước multi-variant (xem chi tiết `.claude/db-rules.md`)
- Cart trỏ vào **variant**, không phải product. Wishlist vẫn ở mức product.
- OrderItem **snapshot** name + volumeMl + price khi mua. Không lookup lại từ variant cho đơn cũ.
- Mọi mutation variant phải gọi `syncProductPriceCache(productId)` để đồng bộ `Product.minPrice` + `hasDiscount`.
- Filter giá + sort price dùng `Product.minPrice` (denormalized).
- Mỗi product phải có **đúng 1** variant `isDefault: true`.


## Phase 4 — Nâng cao ✅ (2026-04-21)
### Wishlist
- `lib/validations/wishlist.ts` + `app/api/wishlist/route.ts` (GET list, POST toggle). Toggle: có thì xóa, chưa có thì tạo.
- `components/store/wishlist-button.tsx` — variant `icon`/`full`, heart SVG filled/outline. Chưa đăng nhập → redirect `/login?callbackUrl=...`.
- `app/(store)/account/wishlist/page.tsx` — list dạng divide-y với remove button.
- Product detail page: fetch `wishlistItem` song song với purchased/review checks qua `Promise.all`.

### Reviews
- `lib/queries/reviews.ts`: `hasUserPurchased(userId, productId)` — count orders DELIVERED có item chứa productId. `getUserReview` để load review hiện tại.
- `app/api/reviews/route.ts`: POST upsert (chặn 403 nếu chưa mua), DELETE.
- `components/store/review-form.tsx` — 5 sao hover + textarea + upsert vào cùng endpoint.
- Product detail: hiển thị form nếu `canReview`, preload existing review để cho edit.

### Coupons
- Schema `Coupon` đã có sẵn. `lib/validations/coupon.ts` với refine check PERCENTAGE ≤ 100 + endDate > startDate.
- `lib/coupons.ts` — `applyCoupon(coupon, subtotal)` trả `{ok, discount}` hoặc `{ok:false, error}`. Check active/expired/usage/min/maxDiscount. Dùng chung cho validate endpoint và order creation.
- Admin: `/admin/coupons` list + new + edit. Form dùng datetime-local, có setValueAs để coerce empty → undefined cho optional number fields.
- `app/api/coupons/validate/route.ts` — POST với code + subtotal, trả discount.
- `app/api/orders/route.ts` cập nhật: trong transaction, lookup coupon → applyCoupon → tăng `usedCount`. Error throw prefix `COUPON:` để catch ngoài map sang 400.
- `CheckoutForm`: coupon state (`appliedCoupon`), apply button, hiện dòng "Giảm giá" trong tóm tắt, `total = Math.max(0, subtotal + shipping - discount)`.
- Sidebar admin thêm link `Mã giảm giá` + `Báo cáo`.

### SEO
- `lib/site-config.ts` — `siteConfig` + `getSiteUrl()` (env NEXT_PUBLIC_APP_URL hoặc NEXTAUTH_URL).
- `app/layout.tsx`: `metadataBase`, `title: { default, template }`, OpenGraph, Twitter card, robots.
- `app/sitemap.ts` — static routes + products active + filter routes (brand/category).
- `app/robots.ts` — disallow `/admin`, `/api`, `/account`, `/checkout`, sitemap reference.
- Product detail `generateMetadata` thêm OG images, Twitter card, canonical.

## Phase 3 vòng 1 — đã xong (2026-04-20)
- `lib/api-auth.ts`: helper `requireUser()` / `requireAdmin()` trả `{ok, userId, role}` hoặc `{ok:false, response}`. Dùng thay cho inline session check ở API routes.
- `lib/validations/brand.ts`, `lib/validations/category.ts`: `brandUpsertSchema`, `categoryUpsertSchema` (Zod).
- `components/admin/sidebar.tsx`: client component dùng `usePathname()` để set active class. Items: Tổng quan / Sản phẩm / Đơn hàng / Người dùng / Thương hiệu / Danh mục.
- `app/(admin)/layout.tsx`: server component. Guard redirect non-ADMIN. Header có form `signOut({redirectTo: "/"})` qua server action.
- `app/(admin)/admin/page.tsx`: dashboard. Dùng `Promise.all` gộp 7 queries: `order.count`, `order.count(thisMonth)`, `order.aggregate({_sum: total})` (không tính CANCELLED/REFUNDED), `user.count(thisMonth)`, `product.count(active)`, `orderItem.groupBy` top 5, 8 đơn gần nhất.
- `components/admin/delete-button.tsx`: reusable, props `endpoint` + `confirmMessage` + optional `onDeletedRedirect`. `window.confirm` trước DELETE.
- `components/admin/brand-form.tsx` + `category-form.tsx`: RHF + Zod, auto-`slugify()` từ `name` khi blur (chỉ khi slug còn rỗng).
- `app/(admin)/admin/brands/` + `categories/`: list page (table với cột đếm sản phẩm), `new/page.tsx`, `[id]/page.tsx` (edit).
- `app/api/admin/brands/route.ts` + `[id]/route.ts` (+ categories): POST tạo, PATCH sửa, DELETE. Delete chặn khi còn `product.count > 0`. Xử lý Prisma P2002 (unique conflict) → 409, P2025 (not found) → 404.

## Phase 3 vòng 2-4 — Products, Orders, Users, Reports ✅ (2026-04-21)
- **Products**: list (search SKU/name, paginate 20/page), new/[id] edit, API PATCH (full update hoặc toggle `isActive`/`isFeatured`). Form có `useFieldArray` for images.
- **Orders**: list (filter by status), detail page (items table, address, payment info) + `OrderStatusForm` để change `status`/`paymentStatus`. API PATCH `/api/admin/orders/[id]`.
- **Users**: list (name, email, role, created date, order count), inline `UserRoleForm` để change role USER ↔ ADMIN. API PATCH `/api/admin/users/[id]`.
- **Reports**: `/admin/reports` aggregate doanh thu last 30 days grouped by date. API `GET /api/admin/reports` trả `{ data: { daily } }`. Placeholder for recharts integration (require `npm install recharts`).

## Phase 3 vòng 2 — Products (đã làm)
1. API `app/api/admin/products/route.ts` (POST, GET list admin) + `[id]/route.ts` (PATCH, DELETE).
2. Cần route toggle: có thể gộp vào PATCH (chấp nhận partial) hoặc tạo endpoint riêng `[id]/toggle/route.ts`.
3. `lib/validations/product.ts`: đã có `productCreateSchema`. Cần thêm `productUpdateSchema` (partial) và schema cho `images` (array of `{url, alt, position}`).
4. Schema Prisma có `ProductImage` tách biệt — form cần quản lý array ảnh (thêm/xóa URL).
5. Pages: `app/(admin)/admin/products/page.tsx` (list với search + filter brand/category/gender), `new/page.tsx`, `[id]/page.tsx`.
6. Component `ProductForm`: RHF với `useFieldArray` cho images; dropdown brand/category load từ server.

## Loose ends Phase 2 — đã xong (2026-04-20)
- **Đổi mật khẩu**: `lib/validations/account.ts`, `app/api/account/password/route.ts`, `app/(store)/account/security/page.tsx`, `components/store/password-form.tsx`; account layout thêm link "Bảo mật".
- **Trang search**: `app/(store)/search/page.tsx` (reuse `listProducts` với `q`), `components/store/search-input.tsx` — form submit đổ về `/search?q=...`; header có ô search ở giữa (md+).
- **Related products**: thêm `getRelatedProducts()` trong `lib/queries/products.ts` (ưu tiên cùng brand, fill cùng category); section mới ở `products/[slug]/page.tsx` dùng `ProductCard`.
- **Guest cart sync**: `lib/guest-cart.ts` (get/add/clear localStorage), `lib/validations/cart.ts` thêm `cartSyncSchema`, `app/api/cart/sync/route.ts` merge quantity + cap ở stock, `components/store/guest-cart-sync.tsx` (useSession → fetch sync khi authenticated) mount trong `Providers`; `AddToCartButton` khi 401 → `addGuestCartItem` thay vì chỉ báo lỗi.
- **Google OAuth scaffold**: `lib/auth.ts` thêm `Google` provider có điều kiện `GOOGLE_CLIENT_ID/SECRET`, export `googleOAuthEnabled`. Login page truyền flag vào `LoginForm` → hiển thị nút "Đăng nhập với Google". Callback `jwt` load `role`+`id` từ DB khi user đăng nhập OAuth lần đầu.
- **Email Resend scaffold**: `lib/email.ts` dùng `fetch()` tới `https://api.resend.com/emails` (KHÔNG cần SDK); no-op khi thiếu `RESEND_API_KEY` hoặc `EMAIL_FROM`. `POST /api/orders` gọi `sendOrderConfirmation` sau transaction (fire-and-forget, không chặn response).

## File vừa tạo/sửa gần nhất

### Tài khoản & địa chỉ
- `app/(store)/account/addresses/page.tsx` — Server Component load `prisma.address.findMany` theo `userId`, sort `isDefault desc, createdAt desc`.
- `components/store/addresses-manager.tsx` — client UI: list + edit + thêm mới, gọi `router.refresh()` sau khi lưu/xóa.
- `components/store/address-form.tsx` — dùng lại cho create & edit (prop `addressId`), RHF + Zod.

### Checkout
- `components/store/checkout-form.tsx` — chọn địa chỉ, radio payment method (COD/BANK_TRANSFER enabled, VNPAY/MOMO disabled), textarea note, submit `POST /api/orders`, route tới `/checkout/success/[id]`.
- `app/api/orders/route.ts` — `$transaction`: validate stock → tạo Order + OrderItem (snapshot `productName` + `unitPrice`) + Payment → `decrement` stock → `deleteMany` cart.
- `app/(store)/checkout/success/[id]/page.tsx` — chi tiết đơn vừa đặt (số đơn, trạng thái VN, breakdown tiền).

### Header + Cart badge
- `components/store/header.tsx` — async Server Component, fetch `session` + `prisma.cartItem.count` để hiện badge số lượng cạnh link "Giỏ hàng".

### Validation
- `lib/validations/address.ts` — `isDefault: z.boolean().optional()` (xem mục fix bên dưới).
- `lib/validations/order.ts` — schema order với `paymentMethod` enum.

## Lỗi đã fix

### 🔥 Decimal Serialization (Prisma Decimal → Client Component)
**Triệu chứng**: React throw `Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.` khi truyền `product.price`, `order.subtotal`, `cartItem.priceSnapshot` v.v. từ Server page xuống Client component.

**Nguyên nhân**: Prisma v6 trả về instance của class `Decimal` (decimal.js) cho mọi field `Decimal`. Class instance không serialize qua ranh giới RSC.

**Pattern đã áp dụng xuyên suốt**:
```tsx
// Server Component trước khi pass prop
const price = Number(product.price);
const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;

// Khi format tại chỗ
formatVND(Number(order.subtotal))

// Với mảng items
const items = cartItems.map((it) => ({
  ...it,
  priceSnapshot: Number(it.priceSnapshot),
  product: { ...it.product, price: Number(it.product.price) },
}));
```

**File đã áp dụng**: `product-card.tsx`, `products/[slug]/page.tsx`, `cart/page.tsx`, `checkout/page.tsx`, `checkout/success/[id]/page.tsx`, `account/orders/page.tsx`, `account/orders/[id]/page.tsx`.

### Các lỗi khác
- **Prisma v7 không nhận `url = env(...)` trong datasource** → downgrade xuống `prisma@^6` + `@prisma/client@^6`, xóa `prisma.config.ts`.
- **Next.js 16 bỏ `middleware.ts`** → đổi tên thành `proxy.ts` (cùng API, cùng vị trí root).
- **RHF resolver type mismatch**: `z.boolean().default(false)` tạo lệch `z.input` vs `z.output` → dùng `z.boolean().optional()` trong `addressSchema`.
- **`as const` tuple không cho optional field**: `paymentOptions as const` inferr literal không có `disabled` → khai báo `type PaymentOption = {...; disabled?: boolean}` rồi `PaymentOption[]`.
- **`.next` cache stale** sau khi xóa `app/page.tsx` gây tsc lỗi ảo → `rm -rf .next` trước khi typecheck.
- **CLAUDE.md conflict với `create-next-app`** → xóa rồi tạo lại sau khi scaffold.

## Đầu việc tiếp theo (đang dở / ưu tiên)

### Phase 2 — loose ends (nice to have, có thể bỏ qua để sang Phase 3)
- [ ] Google OAuth provider (thêm `GoogleProvider` vào `lib/auth.ts` + env vars)
- [ ] Đổi mật khẩu (`/account/security` + API `POST /api/account/password`)
- [ ] Trang search `/search?q=...`
- [ ] Related products ở trang chi tiết sản phẩm
- [ ] Email xác nhận đơn qua Resend (`lib/email.ts` + hook trong `POST /api/orders`)
- [ ] Sync guest cart (localStorage) ↔ DB khi login
- [ ] VNPay / MoMo integration thật

### Phase 3 — Admin Dashboard (bước kế tiếp chính)
1. `app/(admin)/layout.tsx` — sidebar nav, guard ADMIN (đã có proxy nhưng cần UI).
2. `app/(admin)/admin/page.tsx` — dashboard overview: tổng đơn, doanh thu tháng, số user mới, top product.
3. **Quản lý sản phẩm**:
   - `app/(admin)/admin/products/page.tsx` — list + search + filter, paginate.
   - `app/(admin)/admin/products/new/page.tsx` + `[id]/edit/page.tsx` — form RHF + Zod (reuse `productCreateSchema`), upload ảnh (Cloudinary — tạm skip, dùng URL input trước).
   - API `POST/PATCH/DELETE /api/admin/products` + toggle `isActive` / `isFeatured`.
4. **Quản lý đơn hàng**: list + filter status, chi tiết + dropdown cập nhật `OrderStatus` + `PaymentStatus`.
5. **Quản lý user**: list + change role + deactivate.
6. **Brand & Category CRUD**.
7. **Báo cáo doanh thu** (recharts) — để cuối.

## Lệnh hay dùng
```bash
npm run dev                    # dev server (Turbopack)
npx tsc --noEmit               # typecheck
npm run db:studio              # Prisma Studio xem DB
npm run db:push                # sync schema không cần migrate
npm run db:seed                # reset seed data
```

## Thông tin môi trường
- PostgreSQL local, password `tranbang2004`, DB `perfume_dev`.
- Admin seed: `admin@perfume.local` / `admin123`.
- Dev port: 3000 (fallback 3001 nếu chiếm).
