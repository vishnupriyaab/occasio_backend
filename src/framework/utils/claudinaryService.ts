// src/infrastructure/services/cloudinaryService.ts
import { ICloudinaryService } from "../../interfaces/IClaudinary";
import { configureCloudinary } from "../config/claudinary";

export class CloudinaryService implements ICloudinaryService {
  private cloudinary = configureCloudinary();

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await this.cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } catch (error) {
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await this.cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error('Failed to delete image from Cloudinary');
    }
  }
}