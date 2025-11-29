import fs from "fs";
import path from "path";
import { IFileService } from "../interfaces/IFileService.js";

export class FileService implements IFileService {
  private uploadDir: string;

  constructor(uploadDir?: string) {
    this.uploadDir = uploadDir || path.join(process.cwd(), "uploads");
    this.ensureUploadDirectory();
  }

  ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  fileExists(filename: string): boolean {
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  readFile(filename: string): Buffer {
    const filePath = this.getFilePath(filename);
    return fs.readFileSync(filePath);
  }

  getUploadDir(): string {
    return this.uploadDir;
  }
}
