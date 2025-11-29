export interface IPDFService {
  extractPages(filename: string, pages: number[]): Promise<Buffer>;
  validatePageNumbers(filename: string, pages: number[]): Promise<void>;
}