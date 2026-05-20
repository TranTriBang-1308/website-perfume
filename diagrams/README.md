# Diagrams – Sơ đồ phục vụ Đồ án tốt nghiệp

Thư mục này lưu mã nguồn PlantUML của các sơ đồ được sử dụng trong báo cáo đồ án. Khi mô hình thay đổi (ví dụ thêm bảng, sửa luồng nghiệp vụ), chỉ cần cập nhật file `.puml` rồi render lại.

## Danh sách sơ đồ

| File | Hình trong báo cáo | Loại |
|---|---|---|
| `01-usecase-tong-quat.puml` | Hình 3.1 | Use Case tổng quát toàn hệ thống |
| `02-usecase-khach-hang.puml` | Hình 3.2 | Use Case phía khách hàng |
| `03-usecase-quan-tri.puml` | Hình 3.3 | Use Case phía quản trị viên |
| `04-erd-co-so-du-lieu.puml` | Hình 3.4 | Sơ đồ thực thể – quan hệ (ERD) |
| `05-state-don-hang.puml` | Hình 3.5 | Sơ đồ trạng thái đơn hàng |

Ảnh đã render được lưu trong `exports/` (PNG + SVG).

## Cách render (chọn 1 trong 4 cách)

### Cách 1 — Script Bash (macOS / Linux / Git Bash trên Windows)
Chạy trong thư mục `diagrams/`:

```bash
bash render.sh
```

Script tự tải `plantuml.jar` nếu chưa có, rồi xuất PNG + SVG vào `exports/`.

### Cách 2 — Script PowerShell (Windows)
Mở PowerShell trong `diagrams/`:

```powershell
.\render.ps1
```

### Cách 3 — Script Python (yêu cầu mạng tới plantuml.com)

```bash
pip install plantweb
python render.py
```

Cách này không cần Java, gọi server `plantuml.com` để render.

### Cách 4 — VS Code extension
Cài extension **PlantUML** (`jebbs.plantuml`) → mở file `.puml` → `Alt+D` xem preview, `Ctrl+Shift+P` → "PlantUML: Export Current Diagram".

### Cách 5 — Online (không cần cài đặt)
Mở https://www.plantuml.com/plantuml/uml/ → dán nội dung file `.puml` → bấm "Submit" → tải PNG/SVG.

## Cách chèn vào báo cáo Word

Trong file `Do_An_Tot_Nghiep_Website_Nuoc_Hoa.docx`:

1. Tìm đến vị trí caption tương ứng (ví dụ "Hình 3.1. Sơ đồ Use Case tổng quát…").
2. Insert → Picture → chọn file PNG/SVG tương ứng từ `diagrams/exports/`.
3. Căn giữa, đặt kích thước rộng tối đa bằng vùng chữ (≈ 16cm với khổ A4 lề 3.5/2cm).

## Quy ước thiết kế

- Font: Times New Roman 14 — đồng bộ với báo cáo.
- Bố cục `left to right direction` cho Use Case để tiết kiệm chiều ngang trang A4.
- Màu nền sáng (`#FAFAF8`) phù hợp in giấy trắng và đọc trên máy chiếu.
- Tên thực thể, thuộc tính trong ERD khớp 1-1 với `prisma/schema.prisma` để dễ tra cứu chéo.
