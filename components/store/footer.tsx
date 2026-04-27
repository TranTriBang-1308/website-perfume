import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const shopLinks = [
  { label: "Nước hoa Nam", href: "/products?gender=MALE" },
  { label: "Nước hoa Nữ", href: "/products?gender=FEMALE" },
  { label: "Nước hoa Unisex", href: "/products?gender=UNISEX" },
  { label: "Thương hiệu", href: "/brands" },
  { label: "Hàng mới về", href: "/products?sort=newest" },
];

const policyLinks = [
  { label: "Điều khoản sử dụng", href: "/policies/terms" },
  { label: "Chính sách bảo mật", href: "/policies/privacy" },
  { label: "Chính sách đổi trả", href: "/policies/returns" },
  { label: "Vận chuyển & Giao hàng", href: "/policies/shipping" },
  { label: "Câu hỏi thường gặp", href: "/faq" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">
          {/* Cột thương hiệu */}
          <div>
            <h3 className="font-display text-3xl tracking-wide text-cream">
              {siteConfig.name}
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
              Đánh thức giác quan qua từng nốt hương. Chúng tôi cung cấp những
              dòng nước hoa cao cấp, chính hãng từ các thương hiệu hàng đầu thế
              giới.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <SocialIcon
                href="https://www.facebook.com/bang.pici.7/"
                label="Facebook"
              >
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.94c-3.14 0-3.51.01-4.75.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.26.82-.38.38-.62.75-.82 1.26-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.07.23 1.65.38 2.04.2.51.44.88.82 1.26.38.38.75.62 1.26.82.39.15.97.33 2.04.38 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.26-.82.38-.38.62-.75.82-1.26.15-.39.33-.97.38-2.04.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.07-.23-1.65-.38-2.04a3.4 3.4 0 0 0-.82-1.26 3.4 3.4 0 0 0-1.26-.82c-.39-.15-.97-.33-2.04-.38-1.24-.06-1.61-.07-4.75-.07zm0 3.3a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zm0 7.6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5.85-7.78a1.07 1.07 0 1 1-2.15 0 1.07 1.07 0 0 1 2.15 0z" />
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <path d="M22 5.92c-.74.33-1.53.55-2.36.65.85-.51 1.5-1.32 1.8-2.28-.79.47-1.67.81-2.6 1a4.1 4.1 0 0 0-7 3.74A11.63 11.63 0 0 1 3.4 4.8a4.1 4.1 0 0 0 1.27 5.47 4.07 4.07 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.29 4.02 4.1 4.1 0 0 1-1.85.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.41a11.6 11.6 0 0 0 6.29 1.84c7.55 0 11.68-6.25 11.68-11.68l-.01-.53A8.3 8.3 0 0 0 22 5.92z" />
              </SocialIcon>
            </div>
          </div>

          {/* Mua sắm */}
          <FooterColumn title="Mua sắm" links={shopLinks} />

          {/* Chính sách */}
          <FooterColumn title="Chính sách" links={policyLinks} />

          {/* Liên hệ */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/80">
              Liên hệ
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-cream/75">
              <li className="flex items-start gap-3">
                <ContactIcon>
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </ContactIcon>
                <span>Thôn Lâm, Lục Ngạn, Bắc Ninh</span>
              </li>
              <li className="flex items-start gap-3">
                <ContactIcon>
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z" />
                </ContactIcon>
                <a href="tel:+84853394026" className="hover:text-champagne">
                  +84 853 394 026
                </a>
              </li>
              <li className="flex items-start gap-3">
                <ContactIcon>
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </ContactIcon>
                <a
                  href="mailto:bang.pici2004@gmail.com"
                  className="hover:text-champagne"
                >
                  bang.pici2004@gmail.com
                </a>
              </li>
            </ul>

            <form className="mt-6">
              <p className="text-xs italic text-cream/60">
                Nhận tin tức ưu đãi mới nhất từ chúng tôi
              </p>
              <div className="mt-2 flex items-center border-b border-cream/30 focus-within:border-champagne">
                <input
                  type="email"
                  required
                  placeholder="Email của bạn..."
                  className="w-full bg-transparent py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2 py-2 text-xs font-semibold uppercase tracking-widest text-champagne hover:text-cream"
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider + thanh dưới cùng */}
        <div className="mt-14 border-t border-cream/15 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-cream/60 sm:flex-row">
            <p className="text-center uppercase tracking-widest sm:tracking-[0.25em]">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <span className="italic">Thiết kế bởi {siteConfig.name} Team</span>
              <span className="rounded border border-cream/20 px-2 py-1 text-[10px] font-semibold tracking-wider">
                VNPAY
              </span>
              <span className="rounded border border-cream/20 px-2 py-1 text-[10px] font-semibold tracking-wider">
                MOMO
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/80">
        {title}
      </h4>
      <ul className="mt-5 space-y-3 text-sm text-cream/75">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition hover:text-champagne">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-champagne hover:text-champagne"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden
      >
        {children}
      </svg>
    </a>
  );
}

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center text-champagne">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        {children}
      </svg>
    </span>
  );
}
