import type { Request, Response } from "express";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export class controller {
  uploadPdf(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No PDF file uploaded",
        });
      }

      console.log("Uploaded file:", req.file);
      console.log("File path:", req.file.path);
      console.log("Original name:", req.file.originalname);

      res.status(200).json({
        success: true,
        message: "PDF uploaded successfully",
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading PDF",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async extractPages(req: Request, res: Response) {
    try {

        console.log('yes iam here hitting');
        
      const { filename, pages } = req.body;

      if (!filename || !pages || !Array.isArray(pages) || pages.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid request. Provide filename and pages array.",
        });
      }

      const uploadDir = path.join(process.cwd(), "uploads");
      const filePath = path.join(uploadDir, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "PDF file not found",
        });
      }

      const existingPdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const newPdfDoc = await PDFDocument.create();

      const totalPages = pdfDoc.getPageCount();

      for (const pageNum of pages) {
        if (pageNum < 1 || pageNum > totalPages) {
          return res.status(400).json({
            success: false,
            message: `Invalid page number: ${pageNum}. PDF has ${totalPages} pages.`,
          });
        }
      }

      for (const pageNum of pages) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=extracted_${filename}`
      );
      res.setHeader("Content-Length", pdfBytes.length);

      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error("Error extracting pages:", error);
      res.status(500).json({
        success: false,
        message: "Error extracting PDF pages",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
