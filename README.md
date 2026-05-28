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

## 🎨 Giao diện Dự án (Screenshots)

<div align="center">
  <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80" width="80%" alt="Perfume Banner" style="border-radius: 10px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);" />
  <p><i>Giao diện hiện đại, tối giản và tối ưu trải nghiệm người dùng (UX)</i></p>
</div>

---

## ✨ Tính năng nổi bật

| Phân hệ | Tính năng chi tiết |
| :--- | :--- |
| **🛍️ Khách hàng** | - Tìm kiếm, lọc nước hoa theo thương hiệu, giá, nồng độ (EDP, EDT...)<br>- Giỏ hàng động, cập nhật số lượng tức thời<br>- Thanh toán online (Sandbox VNPay/Momo) hoặc COD |
| **🔐 Xác thực** | - Đăng nhập bằng Email/Mật khẩu hoặc qua Google OAuth (NextAuth v5)<br>- Quản lý thông tin cá nhân & lịch sử mua hàng |
| **🛡️ Quản trị (Admin)**| - Biểu đồ thống kê doanh thu, đơn hàng trực quan<br>- Quản lý danh mục & thông tin sản phẩm nước hoa<br>- Quản lý trạng thái đơn hàng (Đang xử lý, Đang giao, Đã hủy) |
| **⚡ Hiệu năng** | - Tải trang cực nhanh nhờ Server Components trong Next.js<br>- Tự động tối ưu hóa hình ảnh với Cloudinary |

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án

<details>
<summary><b>💻 1. Yêu cầu cấu hình hệ thống</b></summary>

- **Node.js**: Phiên bản `v20.x` trở lên
- **PostgreSQL**: Phiên bản `15.x` trở lên (hoặc tài khoản Cloud tại Neon.tech)
- **Công cụ dòng lệnh**: Git, npm
</details>

<details>
<summary><b>🚀 2. Các bước cài đặt Local (Phát triển)</b></summary>

### Bước 1: Clone dự án và cài thư viện
```bash
# Di chuyển vào thư mục dự án
cd website-perfume

# Cài đặt toàn bộ thư viện
npm install
```

### Bước 2: Thiết lập biến môi trường (`.env`)
Tạo file `.env` ở thư mục gốc và sao chép cấu hình dưới đây:
```env
# Database connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/perfume_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/perfume_db?schema=public"

# Authentication (NextAuth)
NEXTAUTH_SECRET="chạy-lệnh-'openssl-rand--base64-32'-để-tạo"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Ảnh sản phẩm)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Bước 3: Đồng bộ và Khởi tạo dữ liệu mẫu
```bash
# Tạo bảng trong Database
npx prisma db push

# Tạo Prisma Client
npx prisma generate

# Bơm dữ liệu mẫu (Sản phẩm, Admin tài khoản...)
npm run db:seed
```

### Bước 4: Khởi động server
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn.
</details>

<details>
<summary><b>🐳 3. Cài đặt nhanh bằng Docker (Khuyên dùng)</b></summary>

Dự án hỗ trợ Docker giúp bạn chạy ứng dụng chỉ với một dòng lệnh mà không cần cài đặt Node.js hay PostgreSQL thủ công.

```bash
# Khởi chạy Docker Compose
docker-compose up -d
```
Hệ thống sẽ tự động cấu hình và khởi chạy ứng dụng tại cổng `3000`.
</details>

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

*   **Họ và tên:** Trần Trí Bằng
*   **Địa chỉ:** Thôn Lâm, Lục Ngạn, Bắc Ninh
*   **Số điện thoại:** +84 853394026
*   **Email:** bang.pici2004@gmail.com
*   **Facebook:** [Trần Trí Bằng](https://www.facebook.com/bang.pici.7/)

---
<div align="center">
  ⭐ Nếu dự án này có ích cho bạn, hãy tặng cho dự án 1 sao nhé! ⭐
</div>
