import { z } from "zod";

// Chấp nhận URL tuyệt đối hoặc đường dẫn nội bộ bắt đầu bằng "/"
const hrefSchema = z
  .string()
  .max(500)
  .refine(
    (v) => v === "" || /^https?:\/\//.test(v) || v.startsWith("/"),
    "Đường dẫn phải là URL hoặc bắt đầu bằng /"
  );

export const bannerUpsertSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(120),
  subtitle: z.string().max(160).optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  ctaLabel: z.string().max(40).optional().or(z.literal("")),
  ctaHref: hrefSchema.optional().or(z.literal("")),
  position: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export type BannerUpsertInput = z.infer<typeof bannerUpsertSchema>;
