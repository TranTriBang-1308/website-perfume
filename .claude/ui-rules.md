# UI Rules — Thiết Kế & Conventions

## Triết Lý Thiết Kế
Website nước hoa cao cấp → phong cách **sang trọng, tối giản, tinh tế**. Ưu tiên:
- Whitespace rộng rãi, không dồn ép nội dung
- Typography nổi bật — serif cho tiêu đề, sans-serif cho body
- Palette trung tính (đen, trắng, be, vàng champagne) + accent nhẹ
- Ảnh sản phẩm lớn, chất lượng cao, chiếm vai trò chính
- Animation tinh tế (fade, subtle scale) — KHÔNG bouncy/playful

## Color Palette

Định nghĩa trong `app/globals.css` qua Tailwind v4 `@theme`:
```css
@theme {
  --color-ink: #0a0a0a;           /* đen chữ chính */
  --color-ink-muted: #6b6b6b;     /* xám phụ */
  --color-cream: #faf7f2;         /* nền ấm */
  --color-champagne: #c9a961;     /* accent vàng champagne */
  --color-burgundy: #6d1a2a;      /* accent đỏ rượu (sale) */
  --color-border: #e5e0d8;
}
```

### Nguyên tắc dùng màu
- Nền mặc định: `cream` hoặc `white`
- Text chính: `ink`, text phụ: `ink-muted`
- CTA chính: nền `ink`, text trắng — KHÔNG dùng màu chói
- Giá sale: `burgundy`; giá gốc gạch ngang màu `ink-muted`
- Badge "NEW" / "HOT": accent `champagne`

## Typography

```css
@theme {
  --font-display: "Cormorant Garamond", "Playfair Display", serif;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

- Heading (h1, h2, tên sản phẩm): `font-display`, `tracking-tight`
- Body, button, label: `font-sans`
- H1: `text-4xl md:text-6xl font-light`
- H2: `text-3xl md:text-5xl font-light`
- Product name trên card: `text-lg font-display`

## TailwindCSS v4

### Khác biệt v4 so với v3
- Config qua CSS `@theme` trong `globals.css`, KHÔNG dùng `tailwind.config.js`
- Import qua `@import "tailwindcss"` (một dòng)
- Sử dụng `@utility` để tạo utility class custom
- CSS variables auto-generated từ `@theme`

### Dùng `cn()` từ `lib/utils.ts`
```tsx
import { cn } from "@/lib/utils";

<button className={cn("base-classes", isActive && "active-classes", className)} />
```

### KHÔNG
- Không viết inline style trừ khi động (e.g. grid-template cột động)
- Không custom CSS rời rạc — ưu tiên utility
- Không `@apply` trong component — chỉ dùng ở `globals.css` cho primitive

## Components

### Server vs Client Components
**Mặc định = Server Component.** Chỉ thêm `"use client"` khi cần:
- State (`useState`, `useReducer`)
- Effect (`useEffect`)
- Event handler (onClick, onSubmit)
- Browser API (localStorage, window)
- Context Provider

### Pattern tách component
```tsx
// app/(store)/products/[slug]/page.tsx  — Server Component
export default async function ProductPage({ params }) {
  const product = await prisma.product.findUnique({ ... });
  return (
    <div>
      <ProductGallery images={product.images} />       {/* Server */}
      <ProductInfo product={product} />                 {/* Server */}
      <AddToCartButton productId={product.id} />        {/* Client */}
    </div>
  );
}
```

→ Chỉ `AddToCartButton` là `"use client"`, còn lại server để giảm JS bundle.

### Data fetching
- Server Component: gọi `prisma` trực tiếp
- Client Component: fetch qua API Route (`/api/...`)
- Không fetch trong Server Component qua `fetch('/api/...')` — query DB trực tiếp nhanh hơn

## Layout & Responsive

### Breakpoints (Tailwind default)
- `sm` 640px — mobile landscape
- `md` 768px — tablet
- `lg` 1024px — laptop
- `xl` 1280px — desktop
- `2xl` 1536px — large

### Container
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

### Grid sản phẩm
- Mobile: 2 cột
- Tablet: 3 cột
- Desktop: 4 cột
```tsx
<div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
```

## UI Text (Tiếng Việt)

### Quy tắc
- Mọi label, button, message, error TRẢ VỀ USER đều bằng **Tiếng Việt**
- Sai: `"Add to cart"` → Đúng: `"Thêm vào giỏ"`
- Sai: `"Login required"` → Đúng: `"Vui lòng đăng nhập"`
- Format ngày: `dd/MM/yyyy` (xài `date-fns` locale `vi`)
- Format tiền: `formatVND()` → `1.500.000 ₫`

### Terminology thống nhất
| English | Tiếng Việt |
|---|---|
| Product | Sản phẩm |
| Cart | Giỏ hàng |
| Checkout | Thanh toán |
| Order | Đơn hàng |
| Wishlist | Yêu thích |
| Sign in | Đăng nhập |
| Sign up | Đăng ký |
| Sign out | Đăng xuất |
| Account | Tài khoản |
| Address | Địa chỉ |
| Brand | Thương hiệu |
| Category | Danh mục |
| Review | Đánh giá |
| Search | Tìm kiếm |

## Accessibility (a11y)
- Mọi `<img>` có `alt` — product image dùng tên sản phẩm
- Icon-only button: thêm `aria-label`
- Form input: có `<label>` gắn với `id`
- Focus ring rõ ràng, không `outline-none` trừ khi có thay thế
- Contrast ratio tối thiểu AA (4.5:1 cho text thường)

## Image Optimization
- Luôn dùng `next/image`, KHÔNG `<img>` cho ảnh content
- Cloudinary URL với transformation `f_auto,q_auto,w_800`
- `priority` cho ảnh above-fold đầu tiên (hero, product chính)
- `sizes` prop chính xác để không tải ảnh quá lớn

## Loading & Error States
- Mọi data fetch có loading skeleton — không để màn trống
- Error UI thân thiện, tiếng Việt: `"Không thể tải sản phẩm. Vui lòng thử lại."`
- Empty state có icon + message + CTA (nếu có): `"Giỏ hàng trống. Khám phá sản phẩm →"`
