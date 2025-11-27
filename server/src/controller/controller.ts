import type { Request, Response } from "express";

export class controller {
  uploadPdf(req: Request, res: Response) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      console.log('Uploaded file:', req.file);
      console.log('File path:', req.file.path);
      console.log('Original name:', req.file.originalname);

    
      res.status(200).json({
        success: true,
        message: 'PDF uploaded successfully',
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });

    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}