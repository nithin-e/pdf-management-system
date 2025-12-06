import api from "../cors/axiousInstance";
import { API_ROUTES } from "../utils/constants/routes";

export const extractPdfPages = async (filename: string, pages: number[]) => {
  const response = await api.post(
    API_ROUTES.EXTRACT_PAGES,
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