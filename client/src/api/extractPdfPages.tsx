import api from "../cors/axiousInstance";

export const extractPdfPages = async (filename: string, pages: number[]) => {
  const response = await api.post(
    '/api/extract-pages',
    {
      filename,
      pages,
    },
    {
      responseType: 'blob',
    }
  );
  return response.data;
};