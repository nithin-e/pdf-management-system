import type { ExtractPagesRequest } from "../../types/index.js";

export class PDFValidator {
  static validateUploadRequest(file: any): void {
    if (!file) {
      throw new Error("No PDF file uploaded");
    }

    if (file.mimetype !== "application/pdf") {
      throw new Error("File must be a PDF");
    }
  }

  static validateExtractPagesRequest(body: any): ExtractPagesRequest {
    const { filename, pages } = body;

    if (!filename || typeof filename !== "string") {
      throw new Error("Valid filename is required");
    }

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      throw new Error("Pages array is required and must not be empty");
    }

    if (!pages.every((page) => Number.isInteger(page) && page > 0)) {
      throw new Error("All page numbers must be positive integers");
    }

    return { filename, pages };
  }
}
