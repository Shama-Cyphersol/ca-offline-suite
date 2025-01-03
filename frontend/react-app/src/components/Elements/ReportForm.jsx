import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  ChevronDown,
  Search,
  Plus,
  FileText,
  X,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { CircularProgress } from "../ui/circularprogress";
import axios from "axios";

const GenerateReportForm = () => {
  const [unit, setUnit] = useState("Unit 1");
  const [units, setUnits] = useState(["Unit 1", "Unit 2"]); // TODO - get units from API
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serialNumber, setSerialNumber] = useState("00009"); // TODO - get serial number from somewhere
  const [caseId, setCaseId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);
  const dropdownRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const caseIdRef = useRef(null);
  const [forAts, setForAts] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [toastId, setToastId] = useState(null);
  const progressIntervalRef = useRef(null);
  const filteredUnits = units.filter((u) =>
    u.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev; // Hold at 90% until completion
        }
        // Non-linear progress simulation for more realistic feel
        const increment = Math.max(1, Math.floor((90 - prev) / 10));
        return Math.min(90, prev + increment);
      });
    }, 300);
    return interval;
  };
  useEffect(() => {
    if (toastId && progress >= 0) {
      toast({
        id: toastId,
        title: loading ? "Generating Report" : "Report Status",
        description: (
          <div className="mt-2 w-full flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <CircularProgress value={progress} className="w-full" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <p className="text-sm text-gray-500">
              {progress < 90
                ? "Processing your bank statements..."
                : progress < 100
                ? "Finalizing report generation..."
                : "Report generated successfully!"}
            </p>
          </div>
        ),
        duration: progress >= 100 ? 3000 : Infinity,
      });
    }
  }, [progress, toastId, loading, toast]);
  useEffect(() => {
    if (forAts) {
      setCaseId(`ATS_${unit.replace(/\s+/g, "_")}_${serialNumber}`);
      caseIdRef.current.disabled = true;
    } else {
      setCaseId(`CASE_${serialNumber}`);
      // enable case id input
      caseIdRef.current.disabled = false;
    }
  }, [unit, serialNumber, forAts]);

  useEffect(() => {
    // Initialize or update fileDetails when files change
    const newFileDetails = selectedFiles.map((file, index) => {
      const existing = fileDetails[index] || {};
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        password: existing.password || "",
        startDate: existing.startDate || "",
        endDate: existing.endDate || "",
        bankName: existing.bankName || "",
      };
    });
    setFileDetails(newFileDetails);

    // Cleanup function to revoke URLs
    return () => {
      fileDetails.forEach((detail) => {
        if (detail.previewUrl) {
          URL.revokeObjectURL(detail.previewUrl);
        }
      });
    };
  }, [selectedFiles]);

  const handlePreviewFile = (previewUrl, fileType) => {
    // Open file in new tab
    window.open(previewUrl, "_blank");
  };

  const handleFileDetailChange = (index, field, value) => {
    setFileDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    );
  };

  const handleAddUnit = () => {
    if (searchTerm.trim() && !units.includes(searchTerm.trim())) {
      setUnits([...units, searchTerm.trim()]);
      setUnit(searchTerm.trim());
      setSearchTerm("");
    }
  };

  // const simulateProgress = () => {
  //   setProgress(0);
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 99) {
  //         clearInterval(interval); // Stop at 95%
  //         return 99;
  //       }
  //       return prev + 5; // Increment progress
  //     });
  //   }, 200); // Adjust interval speed as needed
  //   return interval;
  // };
  // const simulateProgress = () => {
  //   setProgress(0);
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 99) {
  //         clearInterval(interval); // Stop at 95%
  //         return 99;
  //       }
  //       return prev + 5; // Increment progress
  //     });
  //   }, 200); // Adjust interval speed as needed
  //   return interval;
  // };

  useEffect(() => {
    if (toastId && progress > 0 && progress < 100) {
      toast({
        id: toastId, // Same ID ensures the content is updated
        title: "Generating Report",
        description: (
          <div className="mt-2 w-full flex flex-row gap-5 items-center space-y-2">
            <CircularProgress value={progress} size={38} />
            <p className="text-sm text-gray-500">
              {progress < 100
                ? "Please wait while we generate your report..."
                : "Finalizing..."}
            </p>
          </div>
        ),
        duration: Infinity, // Keep the toast visible during updates
      });
    }
  }, [progress, toastId]);

  // const simulateProgress = () => {
  //   const interval = setInterval(() => {
  //     setProgress((prev) => (prev < 100 ? prev + 10 : prev));
  //   }, 500);
  //   return interval;
  // };

  const analyzeBankStatements = async (fileDetails) => {
  // Construct the payload dynamically from fileDetails
  const payload = {
    bank_names: fileDetails.map((detail) => detail.bankName),
    pdf_paths: fileDetails.map((detail) => `C:/Users/Harsh Jajal/Documents/coding/CypherSol Fintech India Pvt Ltd/clone--fork/ca-offline-suite/frontend/data/${detail.file.name}`),
    passwords: fileDetails.map((detail) => detail.password || ""),
    start_date: fileDetails.map((detail) => detail.startDate || ""),
    end_date: fileDetails.map((detail) => detail.endDate || ""),
    ca_id: "CASE_00009", // You can make this dynamic as well if needed
  };
  
  // const payload = {
  //   bank_names: ["HDFC"],
  //   pdf_paths: fileDetails.map((detail) => `C:/Users/Harsh Jajal/Documents/coding/CypherSol Fintech India Pvt Ltd/clone--fork/ca-offline-suite/frontend/data/${detail.file.name}`),
  //   passwords: [""],
  //     start_date: ["26-01-2024"],
  //     end_date: ["22-02-2024"],
  //     ca_id: "HDFC",
  //   };

  try {
    const response = await axios.post("http://localhost:7500/analyze-statements/", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (selectedFiles.length === 0) {
    toast({
      title: "Error",
      description: "Please select at least one file to generate the report.",
      variant: "destructive",
    });
    setLoading(false);
    return;
  }

  // Create initial progress toast
  const id = toast({
    title: "Initializing Report Generation",
    description: (
      <div className="mt-2 w-full flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <CircularProgress value={0} className="w-full" />
          <span className="text-sm font-medium">0%</span>
        </div>
        <p className="text-sm text-gray-500">Preparing to process files...</p>
      </div>
    ),
    duration: Infinity,
  });
  setToastId(id);

  const progressInterval = simulateProgress();
  const progressInterval = simulateProgress();

  try {
    const result = await analyzeBankStatements(fileDetails);

    // Complete the progress
    clearInterval(progressInterval);
    setProgress(100);

    // Show success message
    toast({
      title: "Success",
      description: "Report generated successfully!",
      duration: 3000,
    });

    // Reset form state
    setSelectedFiles([]);
    setFileDetails([]);
  } catch (error) {
    clearInterval(progressInterval);
    toast({
      title: "Error",
      description: `Failed to generate report: ${error.message}`,
      variant: "destructive",
      duration: 5000,
    });
  } finally {
    setLoading(false);
    setTimeout(() => {
      setProgress(0);
      setToastId(null);
    }, 3000);
  }
};
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setFileDetails((prevDetails) =>
      prevDetails.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="bg-white dark:bg-black">
  <div className="mx-auto">
    <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Unit Dropdown */}
          {forAts && (
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all flex justify-between items-center group"
              >
                <span>{unit}</span>
                <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-300 group-hover:text-[#3498db] transition-colors" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-lg shadow-xl">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-600">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search or add new unit..."
                          className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-300" />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddUnit}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] dark:bg-blue-600 rounded-lg hover:bg-[#2980b9] dark:hover:bg-blue-500 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {filteredUnits.map((u, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setUnit(u);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Serial Number */}
          {forAts && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="00009"
                className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all"
              />
            </div>
          )}

          {/* Case ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Name
            </label>
            <input
              ref={caseIdRef}
              type="text"
              value={caseId}
              className="w-full px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bank Statements
          </label>
          <div
            className={`relative ${
              isDragging ? "ring-2 ring-[#3498db] dark:ring-blue-500" : ""
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 dark:border-white rounded-lg hover:border-gray-300 dark:hover:border-gray-500 transition-all bg-gray-50 dark:bg-black"
            >
              <div className="flex flex-col items-center justify-center w-full">
                {selectedFiles.length > 0 ? (
                  <div className="w-full space-y-4">
                    {fileDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-[#3498db] dark:text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {detail.file.name}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {formatFileSize(detail.file.size)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() =>
                                handlePreviewFile(
                                  detail.previewUrl,
                                  detail.file.type
                                )
                              }
                              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-[#3498db] dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="Preview file"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Password
                            </label>
                            <input
                              type="password"
                              value={detail.password}
                              onChange={(e) =>
                                handleFileDetailChange(
                                  index,
                                  "password",
                                  e.target.value
                                )
                              }
                              placeholder="Enter password"
                              className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={
                                detail.startDate
                                  ? detail.startDate.split("-").reverse().join("-")
                                  : "" // Ensure correct initial value
                              }
                              onChange={(e) => {
                                const date = e.target.value; // Get the date in YYYY-MM-DD format
                                const [year, month, day] = date.split("-"); // Split into components
                                const formattedDate = `${day}-${month}-${year}`; // Format to DD-MM-YYYY
                                handleFileDetailChange(index, "startDate", formattedDate);
                              }}
                              placeholder="DD-MM-YYYY"
                              value={
                                detail.startDate
                                  ? detail.startDate.split("-").reverse().join("-")
                                  : "" // Ensure correct initial value
                              }
                              onChange={(e) => {
                                const date = e.target.value; // Get the date in YYYY-MM-DD format
                                const [year, month, day] = date.split("-"); // Split into components
                                const formattedDate = `${day}-${month}-${year}`; // Format to DD-MM-YYYY
                                handleFileDetailChange(index, "startDate", formattedDate);
                              }}
                              placeholder="DD-MM-YYYY"
                              className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={
                                detail.endDate
                                  ? detail.endDate.split("-").reverse().join("-")
                                  : "" // Ensure correct initial value
                              }
                              onChange={(e) => {
                                const date = e.target.value; // Get the date in YYYY-MM-DD format
                                const [year, month, day] = date.split("-"); // Split into components
                                const formattedDate = `${day}-${month}-${year}`; // Format to DD-MM-YYYY
                                handleFileDetailChange(index, "endDate", formattedDate);
                              }}
                              placeholder="DD-MM-YYYY"
                              value={
                                detail.endDate
                                  ? detail.endDate.split("-").reverse().join("-")
                                  : "" // Ensure correct initial value
                              }
                              onChange={(e) => {
                                const date = e.target.value; // Get the date in YYYY-MM-DD format
                                const [year, month, day] = date.split("-"); // Split into components
                                const formattedDate = `${day}-${month}-${year}`; // Format to DD-MM-YYYY
                                handleFileDetailChange(index, "endDate", formattedDate);
                              }}
                              placeholder="DD-MM-YYYY"
                              className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              value={detail.bankName}
                              onChange={(e) =>
                                handleFileDetailChange(
                                  index,
                                  "bankName",
                                  e.target.value
                                )
                              }
                              placeholder="Enter bank name"
                              className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 text-center">
                      Drag and drop your files here, or
                    </p>
                  </>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-4 px-6 py-2.5 text-sm font-medium"
              >
                {selectedFiles.length > 0
                  ? "Add More Files"
                  : "Browse Files"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".pdf,.xls,.xlsx"
              />
            </div>

            {isDragging && (
              <div className="absolute inset-0 bg-[#3498db]/10 dark:bg-blue-500/10 rounded-lg pointer-events-none" />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="relative inline-flex items-center px-4 py-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            "Generate Report"
          )}
        </Button>
      </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default GenerateReportForm;
