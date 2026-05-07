import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@perfume.local" },
    update: {},
    create: {
      email: "admin@perfume.local",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin: ${admin.email} / admin123`);

  const brandData = [
    { name: "Chanel", slug: "chanel", description: "Thương hiệu Pháp biểu tượng" },
    { name: "Dior", slug: "dior", description: "Thương hiệu nước hoa Pháp cao cấp" },
    { name: "Tom Ford", slug: "tom-ford", description: "Thương hiệu Mỹ sang trọng" },
    { name: "Creed", slug: "creed", description: "Thương hiệu di sản nước Anh" },
    { name: "Yves Saint Laurent", slug: "ysl", description: "Thương hiệu Pháp" },
  ];
  const brands = await Promise.all(
    brandData.map((b) =>
      prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b })
    )
  );
  const brandBySlug = Object.fromEntries(brands.map((b) => [b.slug, b]));

  const categoryData = [
    { name: "Nước hoa nam", slug: "nuoc-hoa-nam" },
    { name: "Nước hoa nữ", slug: "nuoc-hoa-nu" },
    { name: "Nước hoa unisex", slug: "nuoc-hoa-unisex" },
    { name: "Set quà tặng", slug: "set-qua-tang" },
    { name: "Phụ kiện", slug: "phu-kien" },
  ];
  const categories = await Promise.all(
    categoryData.map((c) =>
      prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
    )
  );
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const productsData = [
    {
      name: "Chanel Bleu de Chanel EDP 100ml",
      slug: "chanel-bleu-de-chanel-edp-100ml",
      description: "Hương thơm nam tính hiện đại với notes gỗ và cam bergamot tươi mát.",
      price: 3500000,
      compareAtPrice: 4200000,
      stock: 15,
      volumeMl: 100,
      gender: "MALE" as const,
      concentration: "EDP" as const,
      topNotes: "Bưởi, bạc hà, chanh",
      middleNotes: "Gừng, nhục đậu khấu, hoa nhài",
      baseNotes: "Gỗ đàn hương, tuyết tùng, hương trầm",
      isFeatured: true,
      brandSlug: "chanel",
      categorySlug: "nuoc-hoa-nam",
    },
    {
      name: "Chanel Coco Mademoiselle EDP 100ml",
      slug: "chanel-coco-mademoiselle-edp-100ml",
      description: "Biểu tượng của sự quyến rũ và độc lập cho phụ nữ hiện đại.",
      price: 3800000,
      stock: 12,
      volumeMl: 100,
      gender: "FEMALE" as const,
      concentration: "EDP" as const,
      topNotes: "Cam Sicily, bưởi",
      middleNotes: "Hoa hồng Thổ Nhĩ Kỳ, hoa nhài",
      baseNotes: "Patchouli, vetiver, xạ hương trắng",
      isFeatured: true,
      brandSlug: "chanel",
      categorySlug: "nuoc-hoa-nu",
    },
    {
      name: "Dior Miss Dior EDP 100ml",
      slug: "dior-miss-dior-edp-100ml",
      description: "Biểu tượng của sự nữ tính và tinh tế Pháp.",
      price: 3200000,
      stock: 10,
      volumeMl: 100,
      gender: "FEMALE" as const,
      concentration: "EDP" as const,
      topNotes: "Cam bergamot, hoa hồng",
      middleNotes: "Hoa mẫu đơn, hoa diên vĩ",
      baseNotes: "Xạ hương, gỗ",
      isFeatured: true,
      brandSlug: "dior",
      categorySlug: "nuoc-hoa-nu",
    },
    {
      name: "Dior Sauvage EDT 100ml",
      slug: "dior-sauvage-edt-100ml",
      description: "Hương thơm nam tính hoang dã lấy cảm hứng từ thiên nhiên.",
      price: 2900000,
      compareAtPrice: 3400000,
      stock: 20,
      volumeMl: 100,
      gender: "MALE" as const,
      concentration: "EDT" as const,
      topNotes: "Cam bergamot Calabria",
      middleNotes: "Hoa tiêu Sichuan, hoa oải hương",
      baseNotes: "Ambroxan, tuyết tùng",
      isFeatured: true,
      brandSlug: "dior",
      categorySlug: "nuoc-hoa-nam",
    },
    {
      name: "Tom Ford Oud Wood EDP 100ml",
      slug: "tom-ford-oud-wood-edp-100ml",
      description: "Hương oud quý phái, sang trọng và cá tính.",
      price: 7500000,
      stock: 5,
      volumeMl: 100,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: "Gỗ oud, hoa hồng",
      middleNotes: "Tuyết tùng, đàn hương",
      baseNotes: "Vani, hương trầm, amber",
      isFeatured: true,
      brandSlug: "tom-ford",
      categorySlug: "nuoc-hoa-unisex",
    },
    {
      name: "Tom Ford Black Orchid EDP 100ml",
      slug: "tom-ford-black-orchid-edp-100ml",
      description: "Hương thơm huyền bí và cuốn hút khó quên.",
      price: 6800000,
      stock: 8,
      volumeMl: 100,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: "Nấm truffle, cam bergamot",
      middleNotes: "Hoa lan đen, hoa nhài",
      baseNotes: "Patchouli, sô-cô-la đen, vani",
      isFeatured: false,
      brandSlug: "tom-ford",
      categorySlug: "nuoc-hoa-unisex",
    },
    {
      name: "Creed Aventus 100ml",
      slug: "creed-aventus-100ml",
      description: "Huyền thoại của dòng nước hoa nam quyền lực.",
      price: 12000000,
      stock: 3,
      volumeMl: 100,
      gender: "MALE" as const,
      concentration: "EDP" as const,
      topNotes: "Dứa, nho đen, táo",
      middleNotes: "Hoa nhài, hoa hồng",
      baseNotes: "Xạ hương, gỗ sồi, vani",
      isFeatured: true,
      brandSlug: "creed",
      categorySlug: "nuoc-hoa-nam",
    },
    {
      name: "YSL Libre EDP 90ml",
      slug: "ysl-libre-edp-90ml",
      description: "Tự do và phóng khoáng cho phụ nữ hiện đại.",
      price: 3100000,
      stock: 0,
      volumeMl: 90,
      gender: "FEMALE" as const,
      concentration: "EDP" as const,
      topNotes: "Lavender Pháp, cam bergamot",
      middleNotes: "Hoa cam, hoa nhài",
      baseNotes: "Vani, xạ hương",
      isFeatured: false,
      brandSlug: "ysl",
      categorySlug: "nuoc-hoa-nu",
    },
    {
      name: "Chanel N°5 EDP 100ml",
      slug: "chanel-no5-edp-100ml",
      description: "Kinh điển vượt thời gian trong thế giới nước hoa.",
      price: 4500000,
      stock: 7,
      volumeMl: 100,
      gender: "FEMALE" as const,
      concentration: "EDP" as const,
      topNotes: "Aldehyde, hoa ngọc lan tây",
      middleNotes: "Hoa hồng, hoa nhài",
      baseNotes: "Xạ hương, vetiver",
      isFeatured: false,
      brandSlug: "chanel",
      categorySlug: "nuoc-hoa-nu",
    },
    {
      name: "Dior Homme Intense EDP 100ml",
      slug: "dior-homme-intense-edp-100ml",
      description: "Thanh lịch, tinh tế và đầy nam tính.",
      price: 2700000,
      stock: 14,
      volumeMl: 100,
      gender: "MALE" as const,
      concentration: "EDP" as const,
      topNotes: "Oải hương",
      middleNotes: "Diên vĩ, hoa nhài",
      baseNotes: "Vetiver, gỗ đàn hương",
      isFeatured: false,
      brandSlug: "dior",
      categorySlug: "nuoc-hoa-nam",
    },

    // ===== SET QUÀ TẶNG — không tạo decant variants =====
    {
      name: "Set Quà Chanel — Bleu de Chanel + Coco Mademoiselle",
      slug: "set-qua-chanel-bleu-coco",
      description: "Bộ set sang trọng dành cho cặp đôi: Bleu de Chanel EDP 100ml cho chàng và Coco Mademoiselle EDP 100ml cho nàng. Đóng gói trong hộp da Chanel, kèm thiệp chúc mừng.",
      price: 7800000,
      compareAtPrice: 8500000,
      stock: 6,
      volumeMl: 200,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: "Bưởi, cam Sicily",
      middleNotes: "Hoa nhài, hoa hồng Thổ Nhĩ Kỳ",
      baseNotes: "Gỗ đàn hương, patchouli, xạ hương",
      isFeatured: true,
      brandSlug: "chanel",
      categorySlug: "set-qua-tang",
      noDecant: true,
    },
    {
      name: "Set Quà Dior Miss Dior — Phiên bản giới hạn",
      slug: "set-qua-dior-miss-dior-limited",
      description: "Set giới hạn Miss Dior EDP 100ml + Body Lotion 75ml + Pouch nhung. Đóng gói hộp Dior tinh tế, lý tưởng cho ngày kỷ niệm.",
      price: 4200000,
      compareAtPrice: 4900000,
      stock: 8,
      volumeMl: 175,
      gender: "FEMALE" as const,
      concentration: "EDP" as const,
      topNotes: "Cam bergamot, hoa hồng",
      middleNotes: "Hoa mẫu đơn, hoa diên vĩ",
      baseNotes: "Xạ hương, gỗ",
      isFeatured: true,
      brandSlug: "dior",
      categorySlug: "set-qua-tang",
      noDecant: true,
    },
    {
      name: "Set Quà Tom Ford Discovery — 5 mini 5ml",
      slug: "set-qua-tom-ford-discovery-5x5ml",
      description: "Bộ khám phá 5 hương Tom Ford biểu tượng dạng mini 5ml: Oud Wood, Black Orchid, Tobacco Vanille, Lost Cherry, Soleil Blanc. Hộp gỗ đen sang trọng.",
      price: 3500000,
      stock: 10,
      volumeMl: 25,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: "Đa dạng",
      middleNotes: "Đa dạng",
      baseNotes: "Đa dạng",
      isFeatured: true,
      brandSlug: "tom-ford",
      categorySlug: "set-qua-tang",
      noDecant: true,
    },
    {
      name: "Set Quà YSL Libre — Eau + Body Lotion",
      slug: "set-qua-ysl-libre-duo",
      description: "Set YSL Libre EDP 50ml + Sensual Body Lotion 50ml. Gói quà sang trọng với ruy băng đen vàng đặc trưng YSL.",
      price: 2900000,
      compareAtPrice: 3300000,
      stock: 12,
      volumeMl: 100,
      gender: "FEMALE" as const,
      concentration: "EDP" as const,
      topNotes: "Lavender Pháp, cam bergamot",
      middleNotes: "Hoa cam, hoa nhài",
      baseNotes: "Vani, xạ hương",
      isFeatured: false,
      brandSlug: "ysl",
      categorySlug: "set-qua-tang",
      noDecant: true,
    },
    {
      name: "Set Quà Creed Royal — Trio Aventus",
      slug: "set-qua-creed-royal-trio",
      description: "Bộ ba Creed Aventus 30ml + Aventus Cologne 30ml + Aventus for Her 30ml. Hộp da hand-stitched, dành riêng cho người sành điệu.",
      price: 14500000,
      stock: 3,
      volumeMl: 90,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: "Dứa, nho đen",
      middleNotes: "Hoa hồng, hoa nhài",
      baseNotes: "Xạ hương, gỗ sồi",
      isFeatured: true,
      brandSlug: "creed",
      categorySlug: "set-qua-tang",
      noDecant: true,
    },

    // ===== PHỤ KIỆN — không tạo decant variants, dùng volumeMl nominal =====
    {
      name: "Vỏ da nâu 100ml — Da Ý handmade",
      slug: "vo-da-nau-100ml-italia",
      description: "Vỏ da nappa Ý cao cấp, may tay tỉ mỉ, vừa khít các chai 100ml phổ biến. Bảo vệ chai khỏi va đập và ánh sáng. Có 4 màu: nâu cognac, đen, navy, burgundy.",
      price: 850000,
      stock: 25,
      volumeMl: 100,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: null,
      middleNotes: null,
      baseNotes: null,
      isFeatured: true,
      brandSlug: "creed",
      categorySlug: "phu-kien",
      noDecant: true,
      noNotes: true,
    },
    {
      name: "Atomizer du lịch 5ml — Vàng champagne",
      slug: "atomizer-du-lich-5ml-champagne",
      description: "Bình xịt mini 5ml mạ rose-gold, có cơ chế refill nhanh chỉ trong vài giây. Thiết kế nhỏ gọn, vừa túi áo. Dung lượng đủ cho 1 tuần du lịch.",
      price: 320000,
      compareAtPrice: 420000,
      stock: 50,
      volumeMl: 5,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: null,
      middleNotes: null,
      baseNotes: null,
      isFeatured: true,
      brandSlug: "tom-ford",
      categorySlug: "phu-kien",
      noDecant: true,
      noNotes: true,
    },
    {
      name: "Túi nhung đỏ rượu — Đựng quà 1 chai",
      slug: "tui-nhung-do-ruou-1-chai",
      description: "Túi nhung Pháp màu burgundy với dây rút lụa, lớp lót satin mềm. Vừa chai 100ml, bảo vệ và làm tăng vẻ sang trọng khi tặng quà.",
      price: 180000,
      stock: 80,
      volumeMl: 100,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: null,
      middleNotes: null,
      baseNotes: null,
      isFeatured: false,
      brandSlug: "ysl",
      categorySlug: "phu-kien",
      noDecant: true,
      noNotes: true,
    },
    {
      name: "Bộ chiết 3 mini 10ml — Crystal glass",
      slug: "bo-chiet-3-mini-10ml-crystal",
      description: "Bộ 3 chai chiết pha lê 10ml với nắp vàng champagne. Gioăng silicon kín hoàn hảo, không rò rỉ. Kèm phễu chiết và miếng dán nhãn.",
      price: 250000,
      stock: 60,
      volumeMl: 30,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: null,
      middleNotes: null,
      baseNotes: null,
      isFeatured: true,
      brandSlug: "dior",
      categorySlug: "phu-kien",
      noDecant: true,
      noNotes: true,
    },
    {
      name: "Hộp trưng bày gỗ óc chó — 10 chai",
      slug: "hop-trung-bay-go-oc-cho-10-chai",
      description: "Hộp trưng bày 2 tầng làm từ gỗ óc chó nguyên khối, sức chứa 10 chai 100ml. Kính trong cao cấp, đèn LED âm trần tùy chọn. Nâng tầm bộ sưu tập của bạn.",
      price: 2800000,
      compareAtPrice: 3500000,
      stock: 5,
      volumeMl: 1,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: null,
      middleNotes: null,
      baseNotes: null,
      isFeatured: false,
      brandSlug: "creed",
      categorySlug: "phu-kien",
      noDecant: true,
      noNotes: true,
    },
    {
      name: "Khăn lau microfiber + Cọ làm sạch chai",
      slug: "khan-lau-microfiber-co-lam-sach",
      description: "Bộ chăm sóc chai nước hoa: khăn microfiber siêu mịn 30x30cm + cọ mềm làm sạch các kẽ. Giữ chai sáng bóng và không trầy xước.",
      price: 95000,
      stock: 100,
      volumeMl: 1,
      gender: "UNISEX" as const,
      concentration: "EDP" as const,
      topNotes: null,
      middleNotes: null,
      baseNotes: null,
      isFeatured: false,
      brandSlug: "chanel",
      categorySlug: "phu-kien",
      noDecant: true,
      noNotes: true,
    },
  ];

  // Hệ số nhân giá theo dung tích so với volume gốc — quy ước decant:
  // dung tích nhỏ có giá/ml cao hơn nên không phải tỉ lệ tuyến tính.
  const variantRatios: Array<{ volumeMl: number; priceFactor: number; stockFactor: number }> = [
    { volumeMl: 10, priceFactor: 0.2, stockFactor: 1.5 }, // decant nhỏ
    { volumeMl: 50, priceFactor: 0.6, stockFactor: 0.7 }, // dung tích vừa
  ];

  for (const p of productsData) {
    // Tách field "meta" không thuộc schema (noDecant, noNotes) trước khi gửi vào Prisma
    const {
      brandSlug,
      categorySlug,
      price,
      compareAtPrice,
      stock,
      volumeMl,
      noDecant,
      noNotes: _noNotes,
      ...rest
    } = p as typeof p & { compareAtPrice?: number; noDecant?: boolean; noNotes?: boolean };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        brandId: brandBySlug[brandSlug].id,
        categoryId: catBySlug[categorySlug].id,
      },
    });

    // Tạo variant mặc định = dung tích gốc; chỉ thêm decant nhỏ (10/50ml) cho nước hoa
    // (gift set + phụ kiện có noDecant=true nên giữ nguyên 1 variant duy nhất).
    const allVariants = [
      { volumeMl, price, compareAtPrice: compareAtPrice ?? null, stock, isDefault: true, position: 0 },
      ...(noDecant
        ? []
        : variantRatios
            .filter((v) => v.volumeMl < volumeMl)
            .map((v, i) => ({
              volumeMl: v.volumeMl,
              price: Math.round(price * v.priceFactor),
              compareAtPrice: compareAtPrice ? Math.round(compareAtPrice * v.priceFactor) : null,
              stock: Math.max(0, Math.floor(stock * v.stockFactor)),
              isDefault: false,
              position: i + 1,
            }))),
    ];

    for (const v of allVariants) {
      await prisma.productVariant.upsert({
        where: { productId_volumeMl: { productId: product.id, volumeMl: v.volumeMl } },
        update: {},
        create: { productId: product.id, ...v },
      });
    }

    // Đồng bộ cache giá: minPrice = giá variant rẻ nhất, hasDiscount = có ít nhất 1 variant giảm giá
    const minPrice = Math.min(...allVariants.map((v) => v.price));
    const hasDiscount = allVariants.some((v) => v.compareAtPrice !== null);
    await prisma.product.update({
      where: { id: product.id },
      data: { minPrice, hasDiscount },
    });
  }

  console.log(`✓ ${productsData.length} sản phẩm (kèm variants), ${brandData.length} thương hiệu, ${categoryData.length} danh mục`);
  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
