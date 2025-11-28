import React, { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { sendToBackend } from "../api/upload-pdf";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const validatePDF = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".pdf")) {
      setError("Please upload a PDF file only");
      return false;
    }

    if (file.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF file");
      return false;
    }

    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size too large. Maximum size is 30MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validatePDF(file)) {
        console.log("Valid PDF file:", file);
        setUploading(true);
        try {
          const res = await sendToBackend(file);

          console.log("check this response", res);

          navigate("/afterUpload", {
            state: { fileData: res.file },
          });
        } catch (error) {
          console.error("Failed to upload:", error);
          setError("Failed to upload PDF. Please try again.");
        } finally {
          setUploading(false);
        }
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validatePDF(file)) {
        console.log("Valid PDF file:", file);
        setUploading(true);
        try {
          const res = await sendToBackend(file);

          console.log("check this response", res);

          navigate("/afterUpload", {
            state: { fileData: res.file },
          });
        } catch (error) {
          console.error("Failed to upload:", error);
          setError("Failed to upload PDF. Please try again.");
        } finally {
          setUploading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-16">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-12">
            PDF Upload
          </h1>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative transition-all duration-200 ${
              isDragging ? "scale-105" : ""
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
              disabled={uploading}
            />
            <label
              htmlFor="pdf-upload"
              className={`inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload PDF →</span>
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-red-600 bg-red-50 py-3 px-4 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <p className="mt-8 text-gray-500 text-lg">👥 900,000+ happy users</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
