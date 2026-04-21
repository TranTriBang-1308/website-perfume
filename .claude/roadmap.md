# Roadmap — Tiến Độ Tính Năng

## Giai Đoạn 1 — Nền Tảng ✅ HOÀN THÀNH
- [x] Khởi tạo Next.js 16 project với TypeScript + Tailwind v4
- [x] Cài dependencies: Prisma v6, NextAuth v5, Zod, bcryptjs, react-hook-form
- [x] Thiết kế database schema (13 models, 7 enums)
- [x] Cấu trúc thư mục với route groups `(store)` + `(admin)` + `(auth)`
- [x] Prisma client singleton (`lib/prisma.ts`)
- [x] Utils: `cn`, `formatVND`, `slugify`, `generateOrderNumber`
- [x] Tạo database PostgreSQL local + chạy `db:push`
- [x] Seed data: admin user + 5 brands + 3 categories + 10 products
- [x] Dev server chạy OK tại http://localhost:3000
- [x] Theme: Tailwind v4 `@theme` với palette champagne/burgundy + Cormorant Garamond

## Giai Đoạn 2 — Tính Năng Khách Hàng ✅ GẦN XONG

### Auth ✅
- [x] Config NextAuth v5 với Credentials provider (JWT strategy)
- [x] `lib/auth.ts` export `auth`, `handlers`, `signIn`, `signOut`
- [x] API route `/api/auth/[...nextauth]`
- [x] Proxy (Next.js 16 rename của middleware) bảo vệ `/admin/*` và `/account/*`
- [x] Trang đăng nhập `/login`
- [x] Trang đăng ký `/register` (hash bcryptjs) + auto sign in
- [x] Validation Zod cho auth forms
- [x] Type extension: `types/next-auth.d.ts` thêm `id` + `role` vào Session
- [x] Google OAuth provider (bật khi có `GOOGLE_CLIENT_ID/SECRET`)
- [x] Đổi mật khẩu (`/account/security` + `POST /api/account/password`)

### Catalog ✅
- [x] Homepage: hero sang trọng, featured products, brand grid
- [x] Trang danh sách `/products`
  - [x] Lọc theo brand, category, gender, concentration
  - [x] Sắp xếp: mới nhất, nổi bật, giá tăng/giảm
  - [x] Pagination giữ filter
- [x] Trang chi tiết `/products/[slug]`
  - [x] Gallery ảnh (với fallback)
  - [x] Thông tin đầy đủ + notes (top/middle/base)
  - [x] Reviews section
  - [x] Breadcrumb
  - [x] Badge Sale / Hết hàng
- [x] Trang tìm kiếm `/search?q=...` dành riêng + search input trong header
- [x] Related products ở chi tiết (ưu tiên cùng brand → fill cùng category)
- [ ] API `GET /api/products` (hiện dùng server component query trực tiếp)

### Giỏ Hàng ✅
- [x] Trang `/cart`
- [x] API `GET/POST/PATCH/DELETE /api/cart`
- [x] Check stock khi add/update (trả lỗi 400 nếu vượt)
- [x] Update quantity, remove item
- [x] Header hiển thị badge số lượng
- [x] Sync guest cart (localStorage) → DB cart khi login (`POST /api/cart/sync` + `GuestCartSync`)

### Checkout ✅
- [x] Trang `/checkout` với form tổng hợp
- [x] Chọn / thêm địa chỉ giao hàng
- [x] Chọn phương thức thanh toán (COD + Bank Transfer hoạt động, VNPay/MoMo disabled)
- [x] API `POST /api/orders` dùng `$transaction`: validate stock → tạo Order + OrderItem (snapshot name+price) + Payment → giảm stock → xóa cart
- [x] Phí ship: miễn phí từ 2.000.000đ, còn lại 35.000đ
- [x] Trang `/checkout/success/[id]` chi tiết đơn vừa đặt
- [x] Email xác nhận qua Resend (scaffold: `lib/email.ts` dùng REST, no-op khi thiếu `RESEND_API_KEY`)
- [ ] Tích hợp VNPay / MoMo thực sự

### Tài Khoản ✅
- [x] `/account` thông tin cá nhân
- [x] `/account/orders` lịch sử đơn với trạng thái tiếng Việt
- [x] `/account/orders/[id]` chi tiết đơn
- [x] `/account/addresses` CRUD địa chỉ
- [x] Account layout có sidebar nav (thêm mục **Bảo mật**)
- [x] Đổi mật khẩu (`/account/security`)

## Giai Đoạn 3 — Admin Dashboard ✅ HOÀN THÀNH
### Vòng 1 ✅ (2026-04-20)
- [x] Layout admin riêng, sidebar navigation với active state
- [x] Dashboard overview (đơn tháng, doanh thu, user mới, sản phẩm active, đơn gần đây, top sản phẩm)
- [x] Quản lý brand (list + create/edit + delete có chặn FK)
- [x] Quản lý category (list + create/edit + delete có chặn FK)

### Vòng 2 ✅ (2026-04-21)
- [x] List + search (SKU/name) + paginate (20/page)
- [x] Create/Edit form (URL ảnh, `useFieldArray` for images)
- [x] Toggle `isActive`, `isFeatured` via PATCH

### Vòng 3 ✅ (2026-04-21)
- [x] Orders: list + filter status, detail page + update `OrderStatus`/`PaymentStatus`
- [x] Users: list + inline role change (USER ↔ ADMIN)

### Vòng 4 ✅ (2026-04-21)
- [x] Reports page: doanh thu 30 ngày gần đây (bảng)
- [x] API `GET /api/admin/reports` — aggregate by date

## Giai Đoạn 4 — Nâng Cao ✅ (chính, 2026-04-21)
- [x] Wishlist (toggle API, `/account/wishlist`, heart button trên product detail)
- [x] Review & rating (chỉ user đã DELIVERED, upsert qua `/api/reviews`)
- [x] Coupon / voucher (admin CRUD, validate endpoint, apply ở checkout, revalidate server trước khi tạo order)
- [x] SEO (root metadata + OG + sitemap.ts + robots.ts + product dynamic metadata)
- [ ] Flash sale (cần thêm schema — **skip**, để phase sau)
- [ ] GHN/GHTK (cần merchant account — **skip**)
- [x] Gợi ý sản phẩm liên quan (đã làm ở Phase 2)

## Giai Đoạn 5 — Production ✅ (code xong, 2026-04-21)
- [x] Performance: `next.config.ts` image remote patterns + AVIF/WebP, `unstable_cache` + `revalidateTag` cho products/brands/categories
- [x] Security: security headers (CSP, HSTS, X-Frame-Options, etc.), rate limiting in-memory cho `/api/orders`, `/api/auth/register`, `/api/account/password`, cookie httpOnly/secure/sameSite trong production
- [x] Testing: Jest + 16 unit tests (utils + coupons) pass, Playwright config + e2e specs (homepage, auth guards)
- [x] Monitoring: `@vercel/analytics` cài + mount trong root layout
- [ ] Deploy: cần bước thủ công (Neon, Vercel, Resend, Cloudinary) — xem phần hướng dẫn
- [ ] Sentry: placeholder trong `.env.example`, tích hợp khi user cung cấp DSN

## Ghi Chú Tiến Độ
- Khi hoàn thành một task, cập nhật file này (`[ ]` → `[x]`)
- Mỗi giai đoạn xong thì update status ở đầu section
- Xem `.claude/session-state.md` để nắm trạng thái phiên làm việc hiện tại
