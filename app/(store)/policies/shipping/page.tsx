import type { Metadata } from "next";
import { PolicyLayout } from "@/components/store/policy-layout";

export const metadata: Metadata = {
  title: "Vận chuyển & Giao hàng — Whisper of Scent",
};

const shippingZones = [
  { zone: "Nội thành Hà Nội & HCM", time: "1–2 ngày", fee: "25.000đ" },
  { zone: "Tỉnh thành khác (đồng bằng)", time: "2–4 ngày", fee: "35.000đ" },
  { zone: "Miền núi, hải đảo", time: "4–7 ngày", fee: "50.000đ" },
];

export default function ShippingPage() {
  return (
    <PolicyLayout title="Vận chuyển & Giao hàng" lastUpdated="01/01/2025">
      <Section title="1. Đối tác vận chuyển">
        <p>
          Whisper of Scent hợp tác với các đơn vị vận chuyển uy tín gồm
          GHN, GHTK và VNPost để đảm bảo hàng hóa được giao đến tay bạn an
          toàn và đúng hẹn.
        </p>
      </Section>

      <Section title="2. Thời gian & phí vận chuyển">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left">
                <th className="py-2 pr-4 font-semibold text-ink">Khu vực</th>
                <th className="py-2 pr-4 font-semibold text-ink">Thời gian</th>
                <th className="py-2 font-semibold text-ink">Phí ship</th>
              </tr>
            </thead>
            <tbody>
              {shippingZones.map((row) => (
                <tr key={row.zone} className="border-b border-border-soft">
                  <td className="py-2 pr-4">{row.zone}</td>
                  <td className="py-2 pr-4">{row.time}</td>
                  <td className="py-2">{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          * Thời gian trên tính từ lúc đơn hàng được xác nhận và đóng gói
          (thường trong vòng 4 giờ trong giờ làm việc).
        </p>
      </Section>

      <Section title="3. Miễn phí vận chuyển">
        <p>
          Đơn hàng từ <strong>500.000đ</strong> trở lên được miễn phí vận
          chuyển toàn quốc (áp dụng cho khu vực đồng bằng và nội thành).
        </p>
      </Section>

      <Section title="4. Đóng gói">
        <p>
          Mỗi sản phẩm được đóng gói cẩn thận trong hộp carton có lớp đệm bảo
          vệ để tránh va đập. Nước hoa được niêm phong bằng màng bọc nhựa
          trước khi đóng hộp.
        </p>
      </Section>

      <Section title="5. Theo dõi đơn hàng">
        <p>
          Sau khi đơn hàng được giao cho đơn vị vận chuyển, bạn sẽ nhận được
          email chứa mã vận đơn để theo dõi tình trạng giao hàng. Bạn cũng có
          thể kiểm tra trong{" "}
          <a href="/account/orders" className="text-burgundy underline">
            lịch sử đơn hàng
          </a>{" "}
          của tài khoản.
        </p>
      </Section>

      <Section title="6. Xử lý giao hàng thất bại">
        <ul>
          <li>
            Nếu giao hàng thất bại lần 1: đơn vị vận chuyển sẽ liên hệ lại.
          </li>
          <li>
            Sau 3 lần thất bại: đơn hàng sẽ được hoàn về kho và chúng tôi sẽ
            liên hệ để sắp xếp giao lại (phí vận chuyển lần 2 do khách hàng
            chịu).
          </li>
        </ul>
      </Section>

      <Section title="7. Liên hệ hỗ trợ">
        <p>
          Nếu đơn hàng bị trễ hoặc có vấn đề trong quá trình vận chuyển, vui
          lòng liên hệ:{" "}
          <a href="mailto:bang.pici2004@gmail.com" className="text-burgundy underline">
            bang.pici2004@gmail.com
          </a>{" "}
          hoặc <strong>+84 853 394 026</strong>.
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
