import type { Metadata } from "next";
import { PolicyLayout } from "@/components/store/policy-layout";

export const metadata: Metadata = {
  title: "Chính sách bảo mật — Whisper of Scent",
};

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Chính sách bảo mật" lastUpdated="01/01/2025">
      <Section title="1. Thông tin chúng tôi thu thập">
        <p>Khi bạn sử dụng dịch vụ của Whisper of Scent, chúng tôi thu thập:</p>
        <ul>
          <li>
            <strong>Thông tin cá nhân:</strong> họ tên, email, số điện thoại,
            địa chỉ giao hàng khi bạn đăng ký tài khoản hoặc đặt hàng.
          </li>
          <li>
            <strong>Dữ liệu giao dịch:</strong> lịch sử đơn hàng, phương thức
            thanh toán (không lưu số thẻ đầy đủ).
          </li>
          <li>
            <strong>Dữ liệu kỹ thuật:</strong> địa chỉ IP, loại trình duyệt,
            trang đã truy cập để cải thiện trải nghiệm.
          </li>
        </ul>
      </Section>

      <Section title="2. Mục đích sử dụng thông tin">
        <ul>
          <li>Xử lý và giao hàng đơn hàng của bạn.</li>
          <li>Gửi xác nhận đơn hàng và thông báo vận chuyển.</li>
          <li>Hỗ trợ khách hàng khi cần thiết.</li>
          <li>
            Gửi thông tin khuyến mãi nếu bạn đã đồng ý nhận (có thể hủy đăng
            ký bất cứ lúc nào).
          </li>
          <li>Cải thiện sản phẩm và dịch vụ.</li>
        </ul>
      </Section>

      <Section title="3. Bảo vệ thông tin">
        <p>
          Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn ngành để bảo vệ
          dữ liệu của bạn, bao gồm mã hóa SSL, hạn chế quyền truy cập nội bộ
          và kiểm tra bảo mật định kỳ. Mật khẩu được băm (hash) và không bao
          giờ lưu ở dạng văn bản thuần.
        </p>
      </Section>

      <Section title="4. Chia sẻ thông tin">
        <p>
          Chúng tôi không bán thông tin cá nhân của bạn. Thông tin chỉ được
          chia sẻ với:
        </p>
        <ul>
          <li>
            Đơn vị vận chuyển (tên, địa chỉ, số điện thoại) để giao hàng.
          </li>
          <li>Cổng thanh toán (VNPay, MoMo) để xử lý giao dịch.</li>
          <li>
            Cơ quan pháp luật khi có yêu cầu hợp lệ theo quy định pháp luật
            Việt Nam.
          </li>
        </ul>
      </Section>

      <Section title="5. Cookie">
        <p>
          Website sử dụng cookie để lưu phiên đăng nhập và giỏ hàng của bạn.
          Bạn có thể tắt cookie trong trình duyệt nhưng điều này có thể ảnh
          hưởng đến một số tính năng.
        </p>
      </Section>

      <Section title="6. Quyền của bạn">
        <ul>
          <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân.</li>
          <li>Hủy đăng ký nhận email marketing bất cứ lúc nào.</li>
          <li>Yêu cầu xuất dữ liệu cá nhân.</li>
        </ul>
        <p className="mt-2">
          Để thực hiện các quyền trên, liên hệ:{" "}
          <a href="mailto:bang.pici2004@gmail.com" className="text-burgundy underline">
            bang.pici2004@gmail.com
          </a>
        </p>
      </Section>

      <Section title="7. Thời gian lưu trữ">
        <p>
          Dữ liệu tài khoản được lưu đến khi bạn yêu cầu xóa. Dữ liệu đơn
          hàng được lưu tối thiểu 5 năm theo quy định kế toán.
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
      <div className="space-y-2 text-sm leading-relaxed text-ink-muted [&_strong]:text-ink [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
