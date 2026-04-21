# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> điều hướng tới trang sản phẩm
- Location: e2e\homepage.spec.ts:10:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /sản phẩm/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Chào mừng đến với Whisper of Scent" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e5]:
          - generic [ref=e6]: Chào mừng đến với
          - generic [ref=e7]:
            - img [ref=e9]
            - generic [ref=e15]: Whisper of Scent
      - generic [ref=e18]:
        - searchbox "Tìm kiếm sản phẩm" [ref=e19]
        - button "Tìm kiếm" [ref=e20]:
          - img [ref=e21]
      - generic [ref=e24]:
        - link "Cửa hàng" [ref=e25] [cursor=pointer]:
          - /url: /products
          - img [ref=e27]
          - generic [ref=e30]: Cửa hàng
        - link "Hỗ trợ" [ref=e31] [cursor=pointer]:
          - /url: /search
          - img [ref=e33]
          - generic [ref=e37]: Hỗ trợ
        - link "Đăng nhập" [ref=e38] [cursor=pointer]:
          - /url: /login
          - img [ref=e40]
          - generic [ref=e43]: Đăng nhập
        - link "Yêu thích" [ref=e44] [cursor=pointer]:
          - /url: /login?callbackUrl=/account/wishlist
          - img [ref=e46]
          - generic [ref=e48]: Yêu thích
        - link "Giỏ hàng" [ref=e49] [cursor=pointer]:
          - /url: /cart
          - img [ref=e51]
          - generic [ref=e55]: Giỏ hàng
    - navigation [ref=e56]:
      - list [ref=e57]:
        - listitem [ref=e58]:
          - link "TƯ VẤN CHỌN" [ref=e59] [cursor=pointer]:
            - /url: /products
        - listitem [ref=e60]:
          - link "HOT DEALS" [ref=e61] [cursor=pointer]:
            - /url: /products?sort=featured
        - listitem [ref=e62]:
          - link "THƯƠNG HIỆU" [ref=e63] [cursor=pointer]:
            - /url: /products
        - listitem [ref=e64]:
          - link "NƯỚC HOA NAM" [ref=e65] [cursor=pointer]:
            - /url: /products?gender=MALE
        - listitem [ref=e66]:
          - link "NƯỚC HOA NỮ" [ref=e67] [cursor=pointer]:
            - /url: /products?gender=FEMALE
        - listitem [ref=e68]:
          - link "NƯỚC HOA UNISEX" [ref=e69] [cursor=pointer]:
            - /url: /products?gender=UNISEX
        - listitem [ref=e70]:
          - link "SET QUÀ TẶNG" [ref=e71] [cursor=pointer]:
            - /url: /products
        - listitem [ref=e72]:
          - link "PHỤ KIỆN" [ref=e73] [cursor=pointer]:
            - /url: /products
  - main [ref=e74]:
    - generic [ref=e77]:
      - paragraph [ref=e78]: Bộ sưu tập mới
      - heading "Hương thơm định hình cá tính" [level=1] [ref=e79]:
        - text: Hương thơm
        - text: định hình cá tính
      - paragraph [ref=e80]: Khám phá những chai nước hoa được chọn lọc tinh tế từ các thương hiệu danh tiếng thế giới.
      - generic [ref=e81]:
        - link "Khám phá ngay" [ref=e82] [cursor=pointer]:
          - /url: /products
        - link "Nước hoa Unisex" [ref=e83] [cursor=pointer]:
          - /url: /products?gender=UNISEX
    - generic [ref=e85]:
      - generic [ref=e86]:
        - generic [ref=e87]:
          - paragraph [ref=e88]: Tuyển chọn
          - heading "Sản phẩm nổi bật" [level=2] [ref=e89]
        - link "Xem tất cả →" [ref=e90] [cursor=pointer]:
          - /url: /products
      - generic [ref=e91]:
        - link "Dior Dior Dior Homme Intense EDP 100ml EDP · 100ml 2.700.000 ₫" [ref=e92] [cursor=pointer]:
          - /url: /products/dior-homme-intense-edp-100ml
          - generic [ref=e94]: Dior
          - generic [ref=e95]:
            - paragraph [ref=e96]: Dior
            - heading "Dior Homme Intense EDP 100ml" [level=3] [ref=e97]
            - paragraph [ref=e98]: EDP · 100ml
            - generic [ref=e100]: 2.700.000 ₫
        - link "Creed Creed Creed Aventus 100ml EDP · 100ml 12.000.000 ₫" [ref=e101] [cursor=pointer]:
          - /url: /products/creed-aventus-100ml
          - generic [ref=e103]: Creed
          - generic [ref=e104]:
            - paragraph [ref=e105]: Creed
            - heading "Creed Aventus 100ml" [level=3] [ref=e106]
            - paragraph [ref=e107]: EDP · 100ml
            - generic [ref=e109]: 12.000.000 ₫
        - link "Tom Ford Tom Ford Tom Ford Oud Wood EDP 100ml EDP · 100ml 7.500.000 ₫" [ref=e110] [cursor=pointer]:
          - /url: /products/tom-ford-oud-wood-edp-100ml
          - generic [ref=e112]: Tom Ford
          - generic [ref=e113]:
            - paragraph [ref=e114]: Tom Ford
            - heading "Tom Ford Oud Wood EDP 100ml" [level=3] [ref=e115]
            - paragraph [ref=e116]: EDP · 100ml
            - generic [ref=e118]: 7.500.000 ₫
        - link "Dior Sale Dior Dior Sauvage EDT 100ml EDT · 100ml 2.900.000 ₫ 3.400.000 ₫" [ref=e119] [cursor=pointer]:
          - /url: /products/dior-sauvage-edt-100ml
          - generic [ref=e120]:
            - generic [ref=e121]: Dior
            - generic [ref=e122]: Sale
          - generic [ref=e123]:
            - paragraph [ref=e124]: Dior
            - heading "Dior Sauvage EDT 100ml" [level=3] [ref=e125]
            - paragraph [ref=e126]: EDT · 100ml
            - generic [ref=e127]:
              - generic [ref=e128]: 2.900.000 ₫
              - generic [ref=e129]: 3.400.000 ₫
        - link "Chanel Chanel Chanel Coco Mademoiselle EDP 100ml EDP · 100ml 3.800.000 ₫" [ref=e130] [cursor=pointer]:
          - /url: /products/chanel-coco-mademoiselle-edp-100ml
          - generic [ref=e132]: Chanel
          - generic [ref=e133]:
            - paragraph [ref=e134]: Chanel
            - heading "Chanel Coco Mademoiselle EDP 100ml" [level=3] [ref=e135]
            - paragraph [ref=e136]: EDP · 100ml
            - generic [ref=e138]: 3.800.000 ₫
        - link "Chanel Sale Chanel Chanel Bleu de Chanel EDP 100ml EDP · 100ml 3.500.000 ₫ 4.200.000 ₫" [ref=e139] [cursor=pointer]:
          - /url: /products/chanel-bleu-de-chanel-edp-100ml
          - generic [ref=e140]:
            - generic [ref=e141]: Chanel
            - generic [ref=e142]: Sale
          - generic [ref=e143]:
            - paragraph [ref=e144]: Chanel
            - heading "Chanel Bleu de Chanel EDP 100ml" [level=3] [ref=e145]
            - paragraph [ref=e146]: EDP · 100ml
            - generic [ref=e147]:
              - generic [ref=e148]: 3.500.000 ₫
              - generic [ref=e149]: 4.200.000 ₫
    - generic [ref=e150]:
      - heading "Thương hiệu nổi bật" [level=2] [ref=e151]
      - generic [ref=e152]:
        - link "Armaf" [ref=e153] [cursor=pointer]:
          - /url: /products?brand=armaf
        - link "Chanel" [ref=e154] [cursor=pointer]:
          - /url: /products?brand=chanel
        - link "Creed" [ref=e155] [cursor=pointer]:
          - /url: /products?brand=creed
        - link "Dior" [ref=e156] [cursor=pointer]:
          - /url: /products?brand=dior
        - link "Tom Ford" [ref=e157] [cursor=pointer]:
          - /url: /products?brand=tom-ford
        - link "Yves Saint Laurent" [ref=e158] [cursor=pointer]:
          - /url: /products?brand=ysl
  - contentinfo [ref=e159]:
    - generic [ref=e160]:
      - generic [ref=e161]:
        - generic [ref=e162]:
          - heading "Whisper of Scent" [level=3] [ref=e163]
          - paragraph [ref=e164]: Đánh thức giác quan qua từng nốt hương. Chúng tôi cung cấp những dòng nước hoa cao cấp, chính hãng từ các thương hiệu hàng đầu thế giới.
          - generic [ref=e165]:
            - link "Facebook" [ref=e166] [cursor=pointer]:
              - /url: https://www.facebook.com/bang.pici.7/
              - img [ref=e167]
            - link "Instagram" [ref=e169] [cursor=pointer]:
              - /url: "#"
              - img [ref=e170]
            - link "Twitter" [ref=e172] [cursor=pointer]:
              - /url: "#"
              - img [ref=e173]
        - generic [ref=e175]:
          - heading "Mua sắm" [level=4] [ref=e176]
          - list [ref=e177]:
            - listitem [ref=e178]:
              - link "Nước hoa Nam" [ref=e179] [cursor=pointer]:
                - /url: /products?gender=MALE
            - listitem [ref=e180]:
              - link "Nước hoa Nữ" [ref=e181] [cursor=pointer]:
                - /url: /products?gender=FEMALE
            - listitem [ref=e182]:
              - link "Nước hoa Unisex" [ref=e183] [cursor=pointer]:
                - /url: /products?gender=UNISEX
            - listitem [ref=e184]:
              - link "Thương hiệu" [ref=e185] [cursor=pointer]:
                - /url: /brands
            - listitem [ref=e186]:
              - link "Hàng mới về" [ref=e187] [cursor=pointer]:
                - /url: /products?sort=newest
        - generic [ref=e188]:
          - heading "Chính sách" [level=4] [ref=e189]
          - list [ref=e190]:
            - listitem [ref=e191]:
              - link "Điều khoản sử dụng" [ref=e192] [cursor=pointer]:
                - /url: /policies/terms
            - listitem [ref=e193]:
              - link "Chính sách bảo mật" [ref=e194] [cursor=pointer]:
                - /url: /policies/privacy
            - listitem [ref=e195]:
              - link "Chính sách đổi trả" [ref=e196] [cursor=pointer]:
                - /url: /policies/returns
            - listitem [ref=e197]:
              - link "Vận chuyển & Giao hàng" [ref=e198] [cursor=pointer]:
                - /url: /policies/shipping
            - listitem [ref=e199]:
              - link "Câu hỏi thường gặp" [ref=e200] [cursor=pointer]:
                - /url: /faq
        - generic [ref=e201]:
          - heading "Liên hệ" [level=4] [ref=e202]
          - list [ref=e203]:
            - listitem [ref=e204]:
              - img [ref=e206]
              - generic [ref=e208]: Thôn Lâm, Lục Ngạn, Bắc Ninh
            - listitem [ref=e209]:
              - img [ref=e211]
              - link "+84 853 394 026" [ref=e213] [cursor=pointer]:
                - /url: tel:+84853394026
            - listitem [ref=e214]:
              - img [ref=e216]
              - link "bang.pici2004@gmail.com" [ref=e218] [cursor=pointer]:
                - /url: mailto:bang.pici2004@gmail.com
          - generic [ref=e219]:
            - paragraph [ref=e220]: Nhận tin tức ưu đãi mới nhất từ chúng tôi
            - generic [ref=e221]:
              - textbox "Email của bạn..." [ref=e222]
              - button "Gửi" [ref=e223]
      - generic [ref=e225]:
        - paragraph [ref=e226]: © 2026 Whisper of Scent. All rights reserved.
        - generic [ref=e227]:
          - generic [ref=e228]: Thiết kế bởi Whisper of Scent Team
          - generic [ref=e229]: VNPAY
          - generic [ref=e230]: MOMO
  - button "Open Next.js Dev Tools" [ref=e236] [cursor=pointer]:
    - img [ref=e237]
  - alert [ref=e240]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("trang chủ hiển thị đúng", async ({ page }) => {
  4  |   await page.goto("/");
  5  |   await expect(page).toHaveTitle(/Whisper of Scent/i);
  6  |   await expect(page.locator("header")).toBeVisible();
  7  |   await expect(page.locator("footer")).toBeVisible();
  8  | });
  9  | 
  10 | test("điều hướng tới trang sản phẩm", async ({ page }) => {
  11 |   await page.goto("/");
> 12 |   await page.getByRole("link", { name: /sản phẩm/i }).first().click();
     |                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  13 |   await expect(page).toHaveURL(/.*\/products/);
  14 | });
  15 | 
  16 | test("trang sản phẩm hiển thị danh sách", async ({ page }) => {
  17 |   await page.goto("/products");
  18 |   await expect(page.locator("main")).toBeVisible();
  19 | });
  20 | 
```