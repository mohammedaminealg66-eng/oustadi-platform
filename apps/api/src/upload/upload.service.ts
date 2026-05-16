import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Return the URL to access the uploaded file
    // Assuming the static files are served at /uploads
    const fileUrl = `/uploads/${file.filename}`;
    
    return {
      message: 'File uploaded successfully',
      url: fileUrl,
      fileName: file.filename,
    };
  }
}
