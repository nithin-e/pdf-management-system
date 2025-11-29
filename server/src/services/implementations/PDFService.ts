import { PDFDocument } from "pdf-lib";
import { IPDFService } from "../interfaces/IPDFService.js";
import { IFileService } from "../interfaces/IFileService.js";
import { AppError } from "../../middleware/errorHandler.js";


export class PDFService implements IPDFService {
  private fileService: IFileService;

  constructor(fileService: IFileService) {
    this.fileService = fileService;
  }

  async validatePageNumbers(filename: string, pages: number[]): Promise<void> {
    const fileBytes = this.fileService.readFile(filename);
    const pdfDoc = await PDFDocument.load(fileBytes);
    const totalPages = pdfDoc.getPageCount();

    for (const pageNum of pages) {
      if (pageNum < 1 || pageNum > totalPages) {
        throw new AppError(
          `Invalid page number: ${pageNum}. PDF has ${totalPages} pages.`,
          400
        );
      }
    }
  }

  async extractPages(filename: string, pages: number[]): Promise<Buffer> {
    // Validate pages first
    await this.validatePageNumbers(filename, pages);

    // Read the original PDF
    const existingPdfBytes = this.fileService.readFile(filename);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Create new PDF with selected pages
    const newPdfDoc = await PDFDocument.create();

    for (const pageNum of pages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    // Save and return the new PDF
    const pdfBytes = await newPdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}