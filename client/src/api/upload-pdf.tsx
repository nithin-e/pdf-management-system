import api from "../cors/axiousInstance";

export const sendToBackend = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await api.post("/api/upload-pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log('Response from backend:', response);
    return response.data;
    
  } catch (err) {
    console.error("Upload error:", err);
    throw err; 
  }
};