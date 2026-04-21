import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/api-auth";

export async function POST() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary chưa được cấu hình" },
      { status: 500 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "perfume/products";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  );

  return NextResponse.json({
    timestamp,
    signature,
    folder,
    apiKey,
    cloudName,
  });
}
