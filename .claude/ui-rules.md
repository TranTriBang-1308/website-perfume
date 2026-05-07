# UI Rules — Thiết Kế & Conventions

## Triết Lý Thiết Kế: Modern Quiet Luxury

Website nước hoa cao cấp → phong cách **sang trọng hiện đại, trẻ trung, tinh tế**. Tránh cảm giác "vintage editorial" già cỗi (border-only, tracking quá rộng, gold ấm cổ điển). Ưu tiên:

- **Whitespace rộng rãi**, không dồn ép nội dung
- **Mix typography**: serif Cormorant Garamond cho H1/H2 (sang) × grotesk Inter Tight cho H3+ (modern, trẻ)
- **Palette Onyx + Rose-gold + Off-white**: contrast cao, hiện đại
- **Bo góc nhẹ** (radius 2-4px) cho card → không "khô" như border-only
- **Ảnh sản phẩm tỉ lệ 3:4** (thon, không to dềnh dàng)
- **Animation tinh tế** (fade, subtle scale, micro-tilt) — KHÔNG bouncy
- **Tracking vừa phải**: `tracking-[0.15em]` cho label thay vì `0.25em+` (đỡ vintage)

## Color Palette

Định nghĩa trong `app/globals.css` qua Tailwind v4 `@theme`:

```css
@theme {
  /* Onyx ink — đen sâu, contrast cao */
  --color-ink: #0f0f10;
  --color-ink-soft: #1d1d20;
  --color-ink-muted: #6f6f74;
  --color-ink-faint: #a3a3a8;

  /* Off-white / paper */
  --color-cream: #fafaf8;        /* near-white nền chính */
  --color-cream-warm: #f3f1ec;   /* sand light surface phụ */
  --color-paper: #ffffff;

  /* Rose-gold accent — trẻ và hiện đại */
  --color-champagne: #d4a574;
  --color-champagne-light: #e6c39c;
  --color-champagne-dark: #b07f4f;

  /* Plum burgundy */
  --color-burgundy: #7a2d3c;
  --color-burgundy-light: #9a3a4c;

  --color-border-soft: #e8e6e0;
  --color-border-faint: #f0eeea;
}
```

### Nguyên tắc dùng màu
- Nền mặc định: `cream` hoặc `paper`. KHÔNG dùng `cream-warm` làm nền chính
- Text chính: `ink`, text phụ: `ink-muted`, hint: `ink-faint`
- CTA chính: nền `ink`, text trắng — KHÔNG dùng màu chói
- Giá sale: `burgundy`; giá gốc gạch ngang `ink-faint`
- Badge "NEW" / "HOT": rose-gold `champagne`
- Hover viền card: `champagne` (rose-gold) — không xám

## Typography

```css
@theme {
  --font-display: "Cormorant Garamond", "Playfair Display", serif;  /* H1, H2 */
  --font-grotesk: "Inter Tight", system-ui, sans-serif;              /* H3, H4, H5 */
  --font-sans: "Inter", system-ui, sans-serif;                       /* body, button, label */
}
```

| Vai trò | Font | Class |
|---|---|---|
| H1 hero | display | `font-display text-5xl md:text-7xl font-light` |
| H2 section | display | `font-display text-3xl md:text-5xl font-light` |
| H3 subsection / product card | grotesk | `font-[family-name:var(--font-grotesk)] text-base md:text-lg` |
| Eyebrow label | sans | `text-[11px] uppercase tracking-[0.15em]` |
| Body | sans | `text-sm md:text-base` |
| Price | grotesk | `font-[family-name:var(--font-grotesk)] font-medium` |

> **Quy tắc**: Tên sản phẩm trên card dùng grotesk (modern, dễ đọc). Tên sản phẩm trang chi tiết (H1) mới dùng display (sang).

## Sizing & Aspect Ratios

### Product Card
- Aspect ratio: `aspect-[3/4]` (thon, hiện đại) — KHÔNG dùng `4/5` (quá to)
- Grid mobile: `grid-cols-2`, tablet: `grid-cols-3`, desktop: `grid-cols-4`, có thể `xl:grid-cols-5` ở pages dày
- Gap: `gap-x-4 gap-y-8` desktop (gap dọc lớn hơn ngang để thoáng)
- Bo góc ảnh: `rounded-sm` (2px)
- Hover: `border-champagne` + scale ảnh `1.04` (không 1.1 — quá lố)

### Brand Card
- Aspect ratio: `aspect-[5/3]` (ngang, gọn) — KHÔNG `aspect-square`
- Padding: `p-3 sm:p-4` (KHÔNG `p-6 sm:p-8`)
- Grid: 3 cột mobile, 4-5 cột desktop

### Trust Strip / Top Bar
- Icon size: `h-4 w-4` (KHÔNG `h-12 w-12`)
- Padding: `py-3` (gọn, không `py-6`)

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
- Không inline style trừ khi động (vd grid-template cột động)
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
// Server Component
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

### Data fetching
- Server Component: gọi `prisma` trực tiếp
- Client Component: fetch qua API Route
- Không fetch trong Server Component qua `fetch('/api/...')`

## Layout & Responsive

### Breakpoints
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px

### Container
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

### Grid sản phẩm chuẩn
```tsx
<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
```

## UI Text (Tiếng Việt)

### Quy tắc
- Mọi label, button, message, error TRẢ VỀ USER bằng **Tiếng Việt**
- Format ngày: `dd/MM/yyyy` (`date-fns` locale `vi`)
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
| Gift Set | Set quà tặng |
| Accessory | Phụ kiện |
| Decant | Chiết |

## Catalog Pages — Cấu trúc trang category

Trang category cố định (`/products?gender=...`, `/gift-sets`, `/accessories`, `/sale`) cần:

1. **Hero header** ngắn (eyebrow + H1 display + 1 dòng mô tả) — KHÔNG ảnh banner full-width
2. **Filter sidebar** trái + grid 3 cột phải trên `lg`
3. **Sort dropdown** + count "X sản phẩm" trên đầu grid
4. **Empty state** sang (icon outline + message + CTA)

Trang Gift Sets / Accessories có thêm 1 strip USP riêng (vd "Gói quà miễn phí", "Thẻ chúc mừng") trước grid.

## Accessibility (a11y)
- Mọi `<img>` có `alt` — product image dùng tên sản phẩm
- Icon-only button: `aria-label`
- Form input: `<label>` gắn `id`
- Focus ring rõ ràng (`focus-visible:ring-2 ring-champagne`), không `outline-none` trừ khi có thay thế
- Contrast tối thiểu AA (4.5:1)

## Image Optimization
- Luôn dùng `next/image`, KHÔNG `<img>` cho ảnh content
- Cloudinary URL với transformation `f_auto,q_auto,w_800`
- `priority` cho ảnh above-fold đầu tiên
- `sizes` prop chính xác

## Loading & Error States
- Mọi data fetch có loading skeleton — không màn trống
- Error UI thân thiện, tiếng Việt: `"Không thể tải sản phẩm. Vui lòng thử lại."`
- Empty state có icon outline + message + CTA: `"Giỏ hàng trống. Khám phá sản phẩm →"`

## Motion Guidelines
- Transition mặc định: `duration-300 ease-luxe`
- Hover ảnh card: scale `1.04` (không 1.1)
- Hover button CTA: shadow tăng dần, KHÔNG translate
- Micro-tilt cho card chính (`hover:-translate-y-0.5`) — sang nhưng không quá đà
- Reduced-motion: disabled hết qua `@media (prefers-reduced-motion: reduce)` trong `globals.css`
