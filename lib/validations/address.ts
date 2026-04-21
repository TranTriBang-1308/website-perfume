import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100),
  phone: z.string().regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  province: z.string().min(1, "Tỉnh/Thành là bắt buộc"),
  district: z.string().min(1, "Quận/Huyện là bắt buộc"),
  ward: z.string().min(1, "Phường/Xã là bắt buộc"),
  street: z.string().min(3, "Địa chỉ cụ thể là bắt buộc").max(200),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
