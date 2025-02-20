export interface ICloudinaryService {
    uploadImage(file: Express.Multer.File): Promise<string>;
    deleteImage(publicId: string): Promise<void>;
    uploadGoogleProfileImage(googleImageUrl: string): Promise<string>
  }