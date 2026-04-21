// Cấu hình chung về site, dùng cho SEO/metadata/sitemap.

export const siteConfig = {
  name: "Whisper of Scent",
  title: "Whisper of Scent — Nước hoa chính hãng",
  description:
    "Cửa hàng nước hoa cao cấp chính hãng tại Việt Nam. Khám phá các thương hiệu Chanel, Dior, Tom Ford... với giá tốt nhất.",
  keywords: ["nước hoa", "whisper of scent", "nước hoa chính hãng", "chanel", "dior", "tom ford"],
  locale: "vi_VN",
  ogImage: "/og-image.jpg",
} as const;

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL;
  return (fromEnv ?? "http://localhost:3000").replace(/\/$/, "");
}
