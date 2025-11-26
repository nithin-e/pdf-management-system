import express from "express";
import { controller } from "../controller/controller.ts";

const Controller=new controller()

const router = express.Router();



router.post('/upload-pdf', Controller.uploadPdf);


export default router;
