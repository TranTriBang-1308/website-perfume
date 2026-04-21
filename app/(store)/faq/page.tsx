import type { Metadata } from "next";
import { PolicyLayout } from "@/components/store/policy-layout";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp — Whisper of Scent",
};

const faqs = [
  {
    category: "Đặt hàng & Thanh toán",
    items: [
      {
        q: "Tôi có thể đặt hàng mà không cần tài khoản không?",
        a: "Hiện tại bạn cần đăng ký tài khoản để đặt hàng. Việc này giúp bạn theo dõi đơn hàng, lịch sử mua và nhận ưu đãi thành viên dễ dàng hơn. Đăng ký chỉ mất 1 phút!",
      },
      {
        q: "Whisper of Scent chấp nhận những hình thức thanh toán nào?",
        a: "Chúng tôi chấp nhận thanh toán qua VNPay (thẻ ATM, Visa, MasterCard, QR), ví MoMo và thanh toán khi nhận hàng (COD).",
      },
      {
        q: "Đơn hàng của tôi có thể bị hủy không?",
        a: "Bạn có thể hủy đơn hàng trước khi đơn được xác nhận đóng gói. Sau khi đã đóng gói và bàn giao cho đơn vị vận chuyển, đơn hàng không thể hủy — bạn cần sử dụng quy trình đổi trả.",
      },
      {
        q: "Tôi quên áp mã giảm giá, có thể áp sau khi đặt không?",
        a: "Rất tiếc, mã giảm giá phải được áp dụng tại thời điểm đặt hàng và không thể áp dụng sau. Nếu bạn gặp sự cố kỹ thuật khiến không áp được mã, hãy liên hệ chúng tôi trong vòng 1 giờ.",
      },
    ],
  },
  {
    category: "Sản phẩm",
    items: [
      {
        q: "Sản phẩm tại Whisper of Scent có chính hãng không?",
        a: "100% chính hãng. Chúng tôi nhập hàng trực tiếp từ nhà phân phối ủy quyền tại Việt Nam và quốc tế. Mỗi sản phẩm đều có hóa đơn nhập khẩu và tem chống giả.",
      },
      {
        q: "Tôi có thể thử mùi trước khi mua không?",
        a: "Hiện tại chúng tôi chỉ bán online. Bạn có thể tham khảo mô tả chi tiết và review từ khách hàng trên trang sản phẩm để lựa chọn phù hợp.",
      },
      {
        q: "Nước hoa có hạn sử dụng không?",
        a: "Nước hoa thường có hạn sử dụng 3–5 năm kể từ ngày sản xuất (ghi trên đáy hộp). Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp để giữ mùi lâu nhất.",
      },
      {
        q: "Các nồng độ EDP, EDT, EDP khác nhau thế nào?",
        a: "EDC (Eau de Cologne) ~3–5% tinh dầu, lưu hương ~2h. EDT (Eau de Toilette) ~8–15%, lưu hương 3–5h. EDP (Eau de Parfum) ~15–25%, lưu hương 5–8h. Parfum (Pure Parfum) ~25–40%, lưu hương cả ngày.",
      },
    ],
  },
  {
    category: "Vận chuyển",
    items: [
      {
        q: "Thời gian giao hàng là bao lâu?",
        a: "Nội thành Hà Nội và TP.HCM: 1–2 ngày. Các tỉnh thành khác: 2–4 ngày. Khu vực miền núi, hải đảo: 4–7 ngày. Thời gian tính từ khi đơn được xác nhận.",
      },
      {
        q: "Phí vận chuyển được tính như thế nào?",
        a: "Phí vận chuyển từ 25.000đ – 50.000đ tùy khu vực. Đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển toàn quốc.",
      },
      {
        q: "Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt không?",
        a: "Có, nhưng chỉ trong vòng 1 giờ sau khi đặt hàng. Liên hệ hotline +84 853 394 026 để được hỗ trợ nhanh nhất.",
      },
    ],
  },
  {
    category: "Đổi trả & Hoàn tiền",
    items: [
      {
        q: "Tôi nhận được hàng bị vỡ, phải làm gì?",
        a: "Vui lòng chụp ảnh/quay video tình trạng hàng ngay khi nhận và liên hệ chúng tôi trong vòng 24 giờ. Chúng tôi sẽ gửi hàng thay thế hoặc hoàn tiền đầy đủ.",
      },
      {
        q: "Hoàn tiền mất bao lâu?",
        a: "Sau khi chúng tôi nhận và kiểm tra hàng trả (1–2 ngày), tiền sẽ được hoàn trong 3–5 ngày làm việc qua chuyển khoản hoặc 5–7 ngày qua VNPay/MoMo.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PolicyLayout title="Câu hỏi thường gặp">
      <div className="space-y-10">
        {faqs.map((group) => (
          <div key={group.category}>
            <h2 className="mb-5 font-display text-lg font-medium text-ink">
              {group.category}
            </h2>
            <div className="space-y-4">
              {group.items.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-border-soft"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-ink select-none hover:bg-cream/60">
                    {item.q}
                    <span className="flex-none text-ink-muted transition group-open:rotate-180">
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="border-t border-border-soft px-5 py-4 text-sm leading-relaxed text-ink-muted">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-champagne/40 bg-champagne/10 p-6 text-center">
        <p className="text-sm text-ink-muted">
          Không tìm thấy câu trả lời bạn cần?
        </p>
        <p className="mt-2 text-sm font-medium text-ink">
          Liên hệ với chúng tôi qua{" "}
          <a href="mailto:bang.pici2004@gmail.com" className="text-burgundy underline">
            bang.pici2004@gmail.com
          </a>{" "}
          hoặc hotline{" "}
          <a href="tel:+84853394026" className="text-burgundy underline">
            +84 853 394 026
          </a>
        </p>
      </div>
    </PolicyLayout>
  );
}
