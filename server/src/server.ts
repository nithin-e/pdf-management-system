import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import router from "./routes/router.js";
import { errorHandler } from "./middleware/errorHandler.js";



const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS



const allowedOrigins = [
  'https://pdf-management-system-seven.vercel.app',
  'http://localhost:5173', 
];

app.use(cors({
  origin: function(origin, callback) {
  
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

const uploadDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadDir));

app.use("/api", router);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
});

export default app;