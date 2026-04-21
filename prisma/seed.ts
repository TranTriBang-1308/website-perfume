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
  ];

  for (const p of productsData) {
    const { brandSlug, categorySlug, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        brandId: brandBySlug[brandSlug].id,
        categoryId: catBySlug[categorySlug].id,
      },
    });
  }

  console.log(`✓ ${productsData.length} sản phẩm, ${brandData.length} thương hiệu, ${categoryData.length} danh mục`);
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
