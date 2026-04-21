import type { Metadata } from "next";
import { PolicyLayout } from "@/components/store/policy-layout";

export const metadata: Metadata = {
  title: "Chính sách đổi trả — Whisper of Scent",
};

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Chính sách đổi trả" lastUpdated="01/01/2025">
      <Section title="1. Điều kiện đổi trả">
        <p>Chúng tôi chấp nhận đổi/trả sản phẩm trong các trường hợp:</p>
        <ul>
          <li>Sản phẩm bị lỗi, hư hỏng do vận chuyển.</li>
          <li>Sản phẩm không đúng với mô tả hoặc đơn hàng đã đặt.</li>
          <li>Sản phẩm bị thiếu phụ kiện so với mô tả.</li>
          <li>Hàng giả, hàng không chính hãng (có bằng chứng).</li>
        </ul>
        <p className="mt-2">
          <strong>Lưu ý:</strong> Nước hoa đã được mở niêm phong và sử dụng sẽ
          không được hoàn trả, trừ trường hợp lỗi do nhà sản xuất.
        </p>
      </Section>

      <Section title="2. Thời gian đổi trả">
        <ul>
          <li>
            <strong>Đổi hàng lỗi/sai:</strong> trong vòng 7 ngày kể từ ngày
            nhận hàng.
          </li>
          <li>
            <strong>Hoàn tiền:</strong> trong vòng 3 ngày kể từ ngày chúng tôi
            nhận được hàng trả.
          </li>
        </ul>
      </Section>

      <Section title="3. Quy trình đổi trả">
        <ol>
          <li>
            Liên hệ với chúng tôi qua email{" "}
            <a href="mailto:bang.pici2004@gmail.com" className="text-burgundy underline">
              bang.pici2004@gmail.com
            </a>{" "}
            hoặc hotline <strong>+84 853 394 026</strong>.
          </li>
          <li>
            Cung cấp mã đơn hàng, mô tả vấn đề và hình ảnh/video chứng minh
            lỗi.
          </li>
          <li>
            Sau khi được xác nhận, gửi hàng về địa chỉ: Thôn Lâm, Lục Ngạn,
            Bắc Ninh (phí vận chuyển đổi trả do Whisper of Scent chịu nếu lỗi
            thuộc về chúng tôi).
          </li>
          <li>
            Chúng tôi kiểm tra và xử lý đổi/hoàn tiền trong 3–5 ngày làm việc.
          </li>
        </ol>
      </Section>

      <Section title="4. Hình thức hoàn tiền">
        <ul>
          <li>
            <strong>Chuyển khoản ngân hàng:</strong> 3–5 ngày làm việc.
          </li>
          <li>
            <strong>Hoàn về VNPay/MoMo:</strong> 5–7 ngày làm việc tùy chính
            sách của cổng thanh toán.
          </li>
          <li>
            <strong>Đổi sản phẩm:</strong> giao hàng trong 3–7 ngày sau khi
            nhận hàng trả.
          </li>
        </ul>
      </Section>

      <Section title="5. Trường hợp không áp dụng">
        <ul>
          <li>Sản phẩm đã qua sử dụng (trừ lỗi nhà sản xuất).</li>
          <li>Sản phẩm không còn hộp, bao bì gốc.</li>
          <li>Quá thời hạn 7 ngày kể từ ngày nhận hàng.</li>
          <li>Sản phẩm mua trong chương trình khuyến mãi đặc biệt có ghi rõ không áp dụng đổi trả.</li>
        </ul>
      </Section>
    </PolicyLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-ink-muted [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_strong]:text-ink [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
