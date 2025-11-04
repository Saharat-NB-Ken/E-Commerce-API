import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { ApiError } from "../apiError";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


/**
 * Upload single image to Cloudinary
 * @param image string | Buffer (URL, path, or base64)
 * @param folder string (Cloudinary folder)
 * @returns { url, name }
 */
export const uploadSingleImage = async (
  image: string,
  folder: string = "products"
): Promise<{ url: string; name: string }> => {
  console.log("cloud name", process.env.CLOUDINARY_NAME);
  console.log("api key", process.env.API_KEY);
  console.log("api secret", process.env.API_SECRET);

  if (!image) throw ApiError.badRequest("Image is required");

  const result = await cloudinary.uploader.upload(image, {
    folder,
    public_id: path.parse(image).name || `product-${Date.now()}`,
  });
  return { url: result.secure_url, name: result.public_id };

};

/**
 * Upload multiple images
 * @param images string[] (URL, path, or base64)
 */
export const uploadImagesToCloudinary = async (
  images: string[],
  folder: string = "products"
): Promise<{ url: string; name: string }[]> => {
  if (!images || !images.length) return [];
  console.log("11111");

  const uploaded: { url: string; name: string }[] = [];

  for (const img of images) {
    console.log("22222", images);
    const uploadedImg = await uploadSingleImage(img, folder);
    console.log("33333", uploadedImg);

    uploaded.push(uploadedImg);
  }

  return uploaded;
};
