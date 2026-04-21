@AGENTS.md

# Website Bán Nước Hoa

E-commerce fullstack với Next.js 16 + Prisma v6 + PostgreSQL. Backend qua Next.js API Routes.

## 📚 Tài liệu dự án nằm trong `.claude/`

| File | Nội dung |
|---|---|
| [.claude/instructions.md](.claude/instructions.md) | Tổng quan, tech stack, cấu trúc thư mục, quy ước chung, lệnh chạy |
| [.claude/db-rules.md](.claude/db-rules.md) | Database models, enums, Zod validation, query conventions |
| [.claude/ui-rules.md](.claude/ui-rules.md) | Design system (sang trọng, tối giản), Tailwind v4, Server Components, UI tiếng Việt |
| [.claude/roadmap.md](.claude/roadmap.md) | Tiến độ tính năng theo 5 giai đoạn |

## Quy ước cốt lõi (tóm tắt)
- **Code** bằng English, **UI text** và **comment business logic** bằng Tiếng Việt
- Server Components mặc định, `"use client"` chỉ khi cần
- Mọi API input validate bằng **Zod** trước khi xử lý
- Giá tiền format qua `formatVND()` trong `lib/utils.ts`

## Khởi động nhanh
```bash
npm run dev         # http://localhost:3000
npm run db:studio   # xem/sửa DB
```

Tài khoản admin mặc định: `admin@perfume.local` / `admin123`
