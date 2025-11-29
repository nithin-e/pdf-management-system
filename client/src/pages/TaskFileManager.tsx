import React, { useState, useEffect } from "react";
import { Download, FileText, Loader2, Check, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { extractPdfPages } from "../api/extractPdfPages";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface FileData {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
}

const PDFTaskUI: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [numPages, setNumPages] = useState<number>(0);
  const [extracting, setExtracting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const uploadedFile = location.state?.fileData;

   console.log(' check this data first ',uploadedFile);
    

    if (uploadedFile) {
      setFileData(uploadedFile);
      loadPDF(uploadedFile);
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  const loadPDF = async (file: FileData) => {
    try {
      // const pdfUrl = `http://localhost:5000/${file.path}`;
      const pdfUrl = `http://localhost:5000/uploads/${file.filename}`;
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      setNumPages(pdf.numPages);

      const pages: string[] = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Failed to get canvas context");
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };

        await page.render(renderContext).promise;
        pages.push(canvas.toDataURL());
      }

      setPdfPages(pages);
      setLoading(false);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setLoading(false);
      alert("Failed to load PDF. Please try again.");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " kB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const togglePageSelection = (pageIndex: number) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageIndex)) {
      newSelected.delete(pageIndex);
    } else {
      newSelected.add(pageIndex);
    }
    setSelectedPages(newSelected);
  };

  const selectAllPages = () => {
    const allPages = new Set<number>();
    for (let i = 0; i < numPages; i++) {
      allPages.add(i);
    }
    setSelectedPages(allPages);
  };

  const deselectAllPages = () => {
    setSelectedPages(new Set());
  };

  const handleDownload = async () => {
    if (fileData && selectedPages.size > 0) {
      try {
        setExtracting(true);

        const blob = await extractPdfPages(
          fileData.filename,
          Array.from(selectedPages).map((p) => p + 1)
        );

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `extracted_${fileData.originalName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setExtracting(false);
      } catch (error) {
        console.error("Error extracting pages:", error);
        alert("Failed to extract pages. Please try again.");
        setExtracting(false);
      }
    } else if (selectedPages.size === 0) {
      alert("Please select at least one page to download.");
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1 mt-12">

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
          
            <button
              onClick={handleGoBack}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Go Back</span>
            </button>

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Select Pages to Extract
              </h1>
              <p className="text-gray-600">
                Click on pages to select them for extraction. Selected pages
                will be included in the new PDF.
              </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={selectAllPages}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Select All
              </button>
              <button
                onClick={deselectAllPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Deselect All
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">
                  {selectedPages.size} of {numPages} pages selected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pdfPages.map((pageImage, index) => (
                <div
                  key={index}
                  onClick={() => togglePageSelection(index)}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                    selectedPages.has(index)
                      ? "border-blue-600 shadow-lg"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedPages.has(index)
                          ? "bg-blue-600"
                          : "bg-white border-2 border-gray-300"
                      }`}
                    >
                      {selectedPages.has(index) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm font-medium">
                    Page {index + 1}
                  </div>

                  <img
                    src={pageImage}
                    alt={`Page ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
          {fileData ? (
            <>
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {fileData.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileData.size)} • {numPages} pages
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    disabled={selectedPages.size === 0 || extracting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {extracting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Extracting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Selected Pages</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGoBack}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Go Back</span>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  File Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Filename:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {fileData.filename}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-900">
                      {fileData.mimetype}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-medium text-gray-900">
                      {formatFileSize(fileData.size)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pages:</span>
                    <span className="font-medium text-gray-900">
                      {numPages}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected:</span>
                    <span className="font-medium text-gray-900">
                      {selectedPages.size}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No file uploaded</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PDFTaskUI;