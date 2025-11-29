import express, { Router } from "express";
import { uploadPDF } from "../config/multerConfig.js";
import { PDFController } from "../controller/controller.js";
import { FileService } from "../services/implementations/FileService.js";
import { PDFService } from "../services/implementations/PDFService.js";


export function createPDFRouter(): Router {
  const router = express.Router();

  
  const fileService = new FileService();
  const pdfService = new PDFService(fileService);
  const pdfController = new PDFController(pdfService, fileService);

  // Define routes
  router.post(
    "/upload-pdf",
    uploadPDF.single("pdf"),
    pdfController.uploadPdf
  );

  router.post("/extract-pages", pdfController.extractPages);

  return router;
}

export default createPDFRouter();