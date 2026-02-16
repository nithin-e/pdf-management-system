import type { Request, Response, NextFunction } from "express";
import { IFileService } from "../services/interfaces/IFileService.js";
import { IPDFService } from "../services/interfaces/IPDFService.js";
import { UploadedFileInfo } from "../types/index.js";
import { ApiResponseHandler } from "../utils/responses/apiResponse.js";
import { PDFValidator } from "../utils/validators/pdfValidator.js";
import { MESSAGES } from "../utils/constants/messages.js";
import { HTTP_STATUS_CODES } from "../utils/constants/statusCodes.js";

export class PDFController {
  private pdfService: IPDFService;
  private fileService: IFileService;

  constructor(pdfService: IPDFService, fileService: IFileService) {
    this.pdfService = pdfService;
    this.fileService = fileService;
  }

  uploadPdf = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      PDFValidator.validateUploadRequest(req.file);

      const fileInfo: UploadedFileInfo = {
        filename: req.file!.filename,
        originalName: req.file!.originalname,
        path: req.file!.path,
        size: req.file!.size,
        mimetype: req.file!.mimetype,
      };

      ApiResponseHandler.success(
        res,
        MESSAGES.PDF_UPLOADED_SUCCESSFULLY,
        { file: fileInfo },
        HTTP_STATUS_CODES.OK
      );
    } catch (error) {
      next(error);
    }
  };

  extractPages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { filename, pages } = PDFValidator.validateExtractPagesRequest(
        req.body
      );

      if (!this.fileService.fileExists(filename)) {
        ApiResponseHandler.error(
          res,
          MESSAGES.PDF_FILE_NOT_FOUND,
          undefined,
          HTTP_STATUS_CODES.NOT_FOUND
        );
        return;
      }

      const pdfBuffer = await this.pdfService.extractPages(filename, pages);

      ApiResponseHandler.sendPDF(res, pdfBuffer, filename);
    } catch (error) {
      next(error);
    }
  };
}
