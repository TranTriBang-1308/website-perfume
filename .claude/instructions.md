# Instructions — Tổng Quan Dự Án

## Giới Thiệu
E-commerce website bán nước hoa quy mô nhỏ và vừa, fullstack với Next.js. Backend dùng Next.js API Routes, không tách server riêng.

## Tech Stack

| Layer | Công nghệ | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Styling | TailwindCSS | v4 |
| Database | PostgreSQL | 16+ |
| ORM | Prisma | v6 |
| Auth | NextAuth.js | v5 (beta) + @auth/prisma-adapter |
| Validation | Zod | v4 |
| Storage | Cloudinary | — |
| Payment | VNPay / MoMo | — |
| Email | Resend | — |
| Deploy | Vercel + Neon/Supabase | — |

> ⚠️ Next.js 16 có breaking changes so với 14/15. Khi làm tính năng mới cần xác minh API, đọc `node_modules/next/dist/docs/` trước.

## Kiến Trúc
- **Fullstack monorepo** trong một Next.js app duy nhất
- **Backend** = Next.js API Routes (`/app/api/...`)
- **Frontend** = App Router với route groups:
  - `(store)` — giao diện khách hàng
  - `(admin)` — admin dashboard
- **Auth** session-based, middleware bảo vệ `/admin/*`

## Cấu Trúc Thư Mục
```
website-perfume/
├── .claude/              # Project instructions (file này nằm đây)
│   ├── instructions.md   # Tổng quan, tech stack, commands
│   ├── db-rules.md       # Models, enums, validation
│   ├── ui-rules.md       # Design guidelines, UI conventions
│   └── roadmap.md        # Roadmap tính năng theo giai đoạn
├── app/
│   ├── (store)/          # Giao diện khách hàng
│   ├── (admin)/admin/    # Admin dashboard
│   ├── api/              # API Routes
│   │   ├── auth/[...nextauth]/
│   │   ├── products/
│   │   ├── cart/
│   │   └── orders/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # UI primitives
│   ├── store/            # Components trang khách hàng
│   └── admin/            # Components admin dashboard
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   └── utils.ts          # cn, formatVND, slugify, generateOrderNumber
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── types/                # TypeScript types chung
├── public/               # Static assets
├── .env                  # Biến môi trường local (KHÔNG commit)
├── .env.example          # Template biến môi trường
├── CLAUDE.md             # Pointer ngắn → đọc .claude/
└── AGENTS.md             # Next.js 16 agent rules (auto)
```

## Quy Ước Chung

### Ngôn Ngữ
- **Code** (tên biến, hàm, component, type, file): English
- **Comment trong code**: Tiếng Việt được phép khi giải thích business logic
- **UI text / label / message**: Tiếng Việt
- **Commit message**: Tiếng Việt được phép
- **Giá tiền**: luôn VND, format qua `formatVND()` trong `lib/utils.ts`

### Naming
- File: `kebab-case.tsx`
- Component: `PascalCase`
- Hook: `useCamelCase`
- Constant: `SCREAMING_SNAKE_CASE`

### API Response Format (BẮT BUỘC)
```ts
// Success
{ data: T, message?: string }

// Error
{ error: string, details?: unknown }
```

## Biến Môi Trường
Xem `.env.example`. Bắt buộc để dev: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.

## Lệnh Thường Dùng
```bash
# Dev server
npm run dev

# Database
npm run db:generate    # sinh Prisma client
npm run db:migrate     # tạo migration mới (production)
npm run db:push        # push schema nhanh (dev)
npm run db:studio      # mở Prisma Studio UI
npm run db:seed        # chạy seed data

# Build & lint
npm run build
npm run lint
```

## Tài Khoản Mặc Định (Seed)
- Admin: `admin@perfume.local` / `admin123`

## Tham Khảo Chi Tiết
- Database & validation: xem `.claude/db-rules.md`
- UI & thiết kế: xem `.claude/ui-rules.md`
- Tiến độ tính năng: xem `.claude/roadmap.md`
