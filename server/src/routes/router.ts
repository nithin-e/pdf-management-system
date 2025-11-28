import express from "express";
import { uploadPDF } from "../congif/multerConfig.ts";
import { controller } from "../controller/controller.ts";

const Controller = new controller();
const router = express.Router();

// Route with multer middleware
router.post('/upload-pdf', uploadPDF.single('pdf'), Controller.uploadPdf);
router.post('/extract-pages', Controller.extractPages);


export default router;