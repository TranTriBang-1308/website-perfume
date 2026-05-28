# Website Perfume - E-Commerce Platform 🛒✨

Đây là dự án Website thương mại điện tử chuyên cung cấp và bán các sản phẩm nước hoa. Hệ thống được xây dựng với kiến trúc hiện đại, hỗ trợ quản lý sản phẩm, giỏ hàng, thanh toán và quản trị (Admin).

## 🚀 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng trên hệ sinh thái **Next.js (App Router)** và các công nghệ tiên tiến nhất:
- **Framework:** [Next.js 15+](https://nextjs.org/) (React 19)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Cơ sở dữ liệu (Database):** PostgreSQL (Neon / Supabase / Local)
- **Xác thực (Authentication):** [NextAuth.js (Auth.js)](https://authjs.dev/) v5
- **UI & Styling:** Tailwind CSS v4, Lucide React (Icons), class-variance-authority, clsx
- **Quản lý Form & Validation:** React Hook Form, Zod
- **Lưu trữ ảnh:** Cloudinary
- **Gửi Email:** Resend
- **Kiểm thử (Testing):** Jest (Unit Test) & Playwright (E2E Test)

---

## 🛠️ Hướng dẫn Cài đặt (Bắt đầu)

### 1. Yêu cầu hệ thống (Prerequisites)
Trước khi cài đặt, hãy đảm bảo máy tính của bạn đã cài sẵn:
- **Node.js**: Phiên bản 20.x trở lên.
- **PostgreSQL**: Đang chạy trên máy (localhost) hoặc bạn có một Database URL từ Cloud (Neon, Supabase...).
- **Git** (để quản lý mã nguồn).

### 2. Cài đặt chi tiết

**Bước 1: Tải thư viện**
Mở terminal tại thư mục dự án và chạy:
```bash
npm install
```

**Bước 2: Cấu hình biến môi trường**
1. Copy file mẫu `.env.example` và đổi tên thành `.env`
2. Mở file `.env` và cập nhật thông tin:
   - `DATABASE_URL`: Đường dẫn kết nối tới PostgreSQL của bạn.
   - `NEXTAUTH_SECRET`: Chạy lệnh `openssl rand -base64 32` trong terminal để tạo chuỗi bí mật, sau đó dán vào đây.
   - `CLOUDINARY_*`: Lấy thông tin từ tài khoản Cloudinary để upload ảnh.
   - Các API Key khác (Resend, VNPay, Momo) nếu bạn cần kích hoạt các chức năng tương ứng.

**Bước 3: Khởi tạo Cơ sở dữ liệu (Database)**
Đồng bộ cấu trúc bảng từ Prisma vào cơ sở dữ liệu của bạn:
```bash
npm run db:push
npm run db:generate
```
*(Tùy chọn)* Nếu dự án có dữ liệu mẫu (seed), chạy:
```bash
npm run db:seed
```

**Bước 4: Chạy dự án (Development)**
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📁 Cấu trúc thư mục dự án (Project Structure)

- `/app`: Chứa các trang (pages) và API routes theo kiến trúc App Router của Next.js.
- `/components`: Các UI Component có thể tái sử dụng (Buttons, Cards, Modals...).
- `/lib`: Các hàm tiện ích (utils) và cấu hình tĩnh.
- `/prisma`: Định nghĩa schema cơ sở dữ liệu (`schema.prisma`) và file seed dữ liệu.
- `/public`: Hình ảnh tĩnh và file dùng chung.
- `/types`: Các định nghĩa TypeScript (Interfaces, Types).
- `/__tests__` & `/e2e`: Các file kiểm thử với Jest và Playwright.

---

## 🚀 Hướng dẫn Triển khai (Deployment)

### Cài đặt lên Vercel (Khuyên dùng)
Cách đơn giản nhất để đưa website này lên mạng là sử dụng nền tảng [Vercel](https://vercel.com).
1. Đẩy mã nguồn lên một Repository (Github, Gitlab...).
2. Đăng nhập Vercel và chọn **Import Project**.
3. Thêm các biến môi trường (Environment Variables) từ file `.env` vào phần cài đặt của Vercel.
4. Bấm **Deploy**. Vercel sẽ tự động build và chạy trang web của bạn.

### Cài đặt trên Máy chủ riêng (VPS)
1. Đưa mã nguồn lên VPS (đã cài Node.js & Database).
2. Chạy lệnh cài đặt và build:
   ```bash
   npm install
   npm run db:push
   npm run build
   ```
3. Khởi động ứng dụng (Khuyến nghị dùng `pm2` để ứng dụng chạy nền):
   ```bash
   npm start
   ```

---
*Phát triển bởi đội ngũ của bạn. Nếu có thắc mắc trong quá trình cài đặt, vui lòng kiểm tra lại log lỗi trong Terminal.*
