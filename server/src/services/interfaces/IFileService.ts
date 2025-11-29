export interface IFileService {
  fileExists(filename: string): boolean;
  getFilePath(filename: string): string;
  readFile(filename: string): Buffer;
  ensureUploadDirectory(): void;
  getUploadDir(): string;
}
