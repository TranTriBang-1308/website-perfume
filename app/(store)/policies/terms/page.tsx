import type { Metadata } from "next";
import { PolicyLayout } from "@/components/store/policy-layout";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng — Whisper of Scent",
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Điều khoản sử dụng" lastUpdated="01/01/2025">
      <Section title="1. Chấp nhận điều khoản">
        <p>
          Khi truy cập và sử dụng website Whisper of Scent, bạn đồng ý tuân
          theo các điều khoản và điều kiện sử dụng này. Nếu bạn không đồng ý
          với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng
          tôi.
        </p>
      </Section>

      <Section title="2. Tài khoản người dùng">
        <p>
          Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình. Mọi hoạt
          động diễn ra dưới tài khoản của bạn đều thuộc trách nhiệm của bạn.
          Vui lòng thông báo ngay cho chúng tôi nếu phát hiện hành vi truy cập
          trái phép.
        </p>
        <ul>
          <li>Mỗi người dùng chỉ được đăng ký một tài khoản.</li>
          <li>Thông tin đăng ký phải trung thực và chính xác.</li>
          <li>Không được chia sẻ tài khoản cho người khác sử dụng.</li>
        </ul>
      </Section>

      <Section title="3. Sản phẩm và giá cả">
        <p>
          Whisper of Scent cam kết cung cấp sản phẩm chính hãng 100%. Giá sản
          phẩm có thể thay đổi mà không báo trước. Giá tại thời điểm đặt hàng
          sẽ được áp dụng cho đơn hàng đó.
        </p>
      </Section>

      <Section title="4. Đặt hàng và thanh toán">
        <p>
          Đơn hàng chỉ được xác nhận sau khi thanh toán thành công. Chúng tôi
          có quyền từ chối hoặc hủy đơn hàng trong trường hợp phát hiện gian
          lận hoặc sai sót về giá.
        </p>
        <ul>
          <li>Chấp nhận thanh toán qua VNPay, MoMo và COD.</li>
          <li>Hóa đơn điện tử sẽ được gửi qua email sau khi đặt hàng thành công.</li>
        </ul>
      </Section>

      <Section title="5. Quyền sở hữu trí tuệ">
        <p>
          Toàn bộ nội dung trên website bao gồm logo, hình ảnh, văn bản thuộc
          quyền sở hữu của Whisper of Scent. Nghiêm cấm sao chép, phân phối
          hoặc sử dụng vì mục đích thương mại mà không có sự đồng ý bằng văn
          bản.
        </p>
      </Section>

      <Section title="6. Giới hạn trách nhiệm">
        <p>
          Whisper of Scent không chịu trách nhiệm về các thiệt hại gián tiếp
          phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ. Chúng tôi
          nỗ lực duy trì hoạt động website liên tục nhưng không đảm bảo không
          có gián đoạn.
        </p>
      </Section>

      <Section title="7. Thay đổi điều khoản">
        <p>
          Chúng tôi có quyền cập nhật điều khoản này bất cứ lúc nào. Thay đổi
          có hiệu lực ngay khi đăng tải. Việc tiếp tục sử dụng dịch vụ sau khi
          thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
        </p>
      </Section>

      <Section title="8. Liên hệ">
        <p>
          Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ:{" "}
          <a href="mailto:bang.pici2004@gmail.com" className="text-burgundy underline">
            bang.pici2004@gmail.com
          </a>
        </p>
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
      <div className="space-y-2 text-sm leading-relaxed text-ink-muted [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
