<div align="center">

# 🌟 Website Perfume E-Commerce 🌟

**Nền tảng thương mại điện tử bán nước hoa cao cấp - Dự án Đồ án Tốt nghiệp**

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6+-102C3F?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

[🌐 Xem Bản Demo](https://website-perfume.vercel.app) • [📹 Xem Video Demo](https://youtube.com) • [📄 Báo cáo PDF](https://google.com)

</div>

---

## ✨ Tính năng nổi bật

| Phân hệ                 | Tính năng chi tiết                                                                                                                                                        |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **🛍️ Khách hàng**       | - Tìm kiếm, lọc nước hoa theo thương hiệu, giá, nồng độ (EDP, EDT...)<br>- Giỏ hàng động, cập nhật số lượng tức thời<br>- Thanh toán online (Sandbox VNPay/Momo) hoặc COD |
| **🔐 Xác thực**         | - Đăng nhập bằng Email/Mật khẩu hoặc qua Google OAuth (NextAuth v5)<br>- Quản lý thông tin cá nhân & lịch sử mua hàng                                                     |
| **🛡️ Quản trị (Admin)** | - Biểu đồ thống kê doanh thu, đơn hàng trực quan<br>- Quản lý danh mục & thông tin sản phẩm nước hoa<br>- Quản lý trạng thái đơn hàng (Đang xử lý, Đang giao, Đã hủy)     |
| **⚡ Hiệu năng**        | - Tải trang cực nhanh nhờ Server Components trong Next.js<br>- Tự động tối ưu hóa hình ảnh với Cloudinary                                                                 |

---

## 🛠️ Hướng dẫn Cài đặt & Chạy dự án (Từng bước cho người mới)

Nếu bạn là người mới bắt đầu và chưa từng chạy các dự án web, hãy làm theo hướng dẫn cực kỳ chi tiết dưới đây:

### 1. Chuẩn bị công cụ (Prerequisites)

Trước tiên, bạn cần tải và cài đặt các công cụ cơ bản sau:
1.  **Node.js**:
    *   Truy cập trang chủ [nodejs.org](https://nodejs.org/) và tải phiên bản **LTS** (Khuyên dùng).
    *   Tải về và cài đặt giống như phần mềm thông thường (chỉ cần bấm Next liên tục).
2.  **PostgreSQL (Cơ sở dữ liệu)**:
    *   Truy cập [postgresql.org/download](https://www.postgresql.org/download/) và chọn phiên bản phù hợp với hệ điều hành của bạn (Windows/Mac).
    *   **Lưu ý quan trọng khi cài đặt:** Trong quá trình cài đặt, hệ thống sẽ yêu cầu bạn nhập **Mật khẩu** cho tài khoản quản trị (mặc định là `postgres`). Hãy **ghi nhớ mật khẩu này** vì bạn sẽ cần điền nó vào cấu hình ở Bước 2.
3.  **Visual Studio Code (VS Code)**: Trình soạn thảo mã nguồn phổ biến nhất để mở dự án này.

---

### 2. Các bước cài đặt chi tiết

#### **Bước 1: Mở dự án và mở Terminal**
1.  Mở phần mềm **VS Code**.
2.  Chọn **File** -> **Open Folder...** -> Chọn thư mục chứa dự án `website-perfume`.
3.  Mở Terminal trong VS Code bằng cách nhấn tổ hợp phím `Ctrl + \`` (hoặc vào menu **Terminal** -> **New Terminal** ở thanh menu phía trên).

#### **Bước 2: Cài đặt các thư viện liên quan**
Tại cửa sổ Terminal vừa mở, gõ lệnh dưới đây và nhấn `Enter`:
```bash
npm install
```
*Lệnh này sẽ tự động đọc file `package.json` và tải tất cả các thư viện cần thiết để chạy website.*

#### **Bước 3: Tạo và cấu hình file `.env`**
1.  Tại danh sách file bên trái VS Code, tìm file `.env.example`.
2.  Click chuột phải vào file `.env.example`, chọn **Duplicate** (hoặc Copy rồi Paste lại) và đổi tên file mới thành `.env`.
3.  Mở file `.env` mới tạo lên và chỉnh sửa các dòng sau:

    *   **Cơ sở dữ liệu (PostgreSQL):**
        Thay thế bằng thông tin của bạn theo mẫu: `postgresql://[tên_đăng_nhập]:[mật_khẩu]@localhost:5432/[tên_database]?schema=public`
        ```env
        # Ví dụ nếu mật khẩu Postgres của bạn là '123456' và bạn muốn đặt tên database là 'perfume_db'
        DATABASE_URL="postgresql://postgres:123456@localhost:5432/perfume_db?schema=public"
        DIRECT_URL="postgresql://postgres:123456@localhost:5432/perfume_db?schema=public"
        ```
    *   **Mã bảo mật (NextAuth Secret):**
        Dùng để bảo mật phiên đăng nhập của người dùng. Bạn hãy nhập một chuỗi chữ cái và số bất kỳ dài khoảng 30 ký tự, ví dụ:
        ```env
        NEXTAUTH_SECRET="websiteperfumesecretkey123456789"
        ```
    *   **Tài khoản lưu ảnh (Cloudinary - Tùy chọn):**
        Nếu muốn chạy chức năng upload ảnh sản phẩm mới: Đăng ký tài khoản miễn phí trên [Cloudinary](https://cloudinary.com/), vào trang Dashboard để copy **Cloud Name**, **API Key** và **API Secret** dán vào đây.

#### **Bước 4: Tạo cấu trúc bảng và nạp dữ liệu mẫu**
Đảm bảo phần mềm PostgreSQL của bạn đang bật, chạy lệnh sau trong Terminal:
```bash
# Lệnh 1: Tạo các bảng dữ liệu tự động
npx prisma db push

# Lệnh 2: Khởi tạo bộ kết nối cơ sở dữ liệu
npx prisma generate

# Lệnh 3: Nạp dữ liệu mẫu (sản phẩm nước hoa, tài khoản admin) vào cơ sở dữ liệu
npm run db:seed
```

#### **Bước 5: Chạy trang web**
Gõ lệnh sau để khởi động dự án:
```bash
npm run dev
```
Sau khi chạy, bạn sẽ thấy thông báo server đã khởi động tại cổng 3000. Hãy mở trình duyệt web (Chrome, Edge...) và truy cập địa chỉ:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Cấu trúc thư mục

```text
website-perfume/
├── app/               # Next.js App Router (Pages, API Routes)
├── components/        # UI Components dùng chung (Button, Card, Modal...)
├── lib/               # Cấu hình Prisma, Cloudinary, Hàm tiện ích
├── prisma/            # Schema định nghĩa Database & Script Seed
├── public/            # File tĩnh (Logo, Icons, Font...)
├── types/             # Định nghĩa Type cho TypeScript
├── .env.example       # File mẫu cấu hình biến môi trường
├── package.json       # Quản lý thư viện và script chạy dự án
└── README.md          # Hướng dẫn này
```

---

## 🚀 Hướng dẫn Triển khai (Deployment)

### Deploy lên Vercel & Neon (Nhanh nhất)

1. Đẩy code lên **GitHub**.
2. Tạo database PostgreSQL miễn phí trên **[Neon.tech](https://neon.tech)**.
3. Import project GitHub vào **[Vercel](https://vercel.com)**.
4. Điền các biến môi trường vào cấu hình Vercel Settings.
5. Nhấn **Deploy**.

---

## 🤝 Liên hệ & Tác giả

- **Họ và tên:** Trần Bằng
- **Địa chỉ:** Thôn Lâm, Lục Ngạn, Bắc Ninh
- **Số điện thoại:** +84 853394026
- **Email:** bang.pici2004@gmail.com
- **Facebook:** [Trần Bằng](https://www.facebook.com/bang.pici.7/)

---

<div align="center">
  ⭐ Nếu dự án này có ích cho bạn, hãy tặng cho dự án 1 sao nhé! ⭐
</div>
