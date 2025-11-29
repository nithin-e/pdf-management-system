export interface UploadedFileInfo {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface ExtractPagesRequest {
  filename: string;
  pages: number[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export type { ApiResponse as default };