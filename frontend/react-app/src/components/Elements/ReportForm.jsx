import React, { useState, useRef, useEffect } from "react";
import { Upload, ChevronDown, Search, Plus, FileText, X ,Eye } from "lucide-react";

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

  const filteredUnits = units.filter((u) =>
    u.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if(forAts){
      setCaseId(`ATS_${unit.replace(/\s+/g, "_")}_${serialNumber}`);
      caseIdRef.current.disabled =true;
    }else{
      setCaseId(`CASE_${serialNumber}`);
      // enable case id input
      caseIdRef.current.disabled = false;
    }
  }, [unit, serialNumber,forAts]);

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
      fileDetails.forEach(detail => {
        if (detail.previewUrl) {
          URL.revokeObjectURL(detail.previewUrl);
        }
      });
    };
  }, [selectedFiles]);

  const handlePreviewFile = (previewUrl, fileType) => {
    // Open file in new tab
    window.open(previewUrl, '_blank');
  };


  const handleFileDetailChange = (index, field, value) => {
    setFileDetails(prev => prev.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    ));
  };

  const handleAddUnit = () => {
    if (searchTerm.trim() && !units.includes(searchTerm.trim())) {
      setUnits([...units, searchTerm.trim()]);
      setUnit(searchTerm.trim());
      setSearchTerm("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      unit,
      serialNumber,
      caseId,
      fileDetails: fileDetails.map(detail => ({
        fileName: detail.file.name,
        fileSize: detail.file.size,
        fileType: detail.file.type,
        password: detail.password,
        startDate: detail.startDate,
        endDate: detail.endDate,
        bankName: detail.bankName,
      })),
    });
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
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setFileDetails(prevDetails =>
      prevDetails.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="bg-gray-50/50">
      <div className="mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Unit Dropdown */}
            {forAts&&  <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all flex justify-between items-center group"
                >
                  <span>{unit}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-[#3498db] transition-colors" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl">
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search or add new unit..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddUnit}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] transition-all flex items-center gap-1 shadow-sm"
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
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
}
              {/* Serial Number */}
             {forAts&& <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="00009"
                  className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>}

              {/* Case ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case ID
                </label>
                <input
                  ref={caseIdRef}
                  type="text"
                  value={caseId}
                  className="w-full px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50 border border-gray-200 rounded-lg shadow-sm disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Statements
              </label>
              <div
                className={`relative ${isDragging ? 'ring-2 ring-[#3498db]' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex cursor-pointer flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-all bg-gray-50">
                  <div className="flex flex-col items-center justify-center w-full">
                    {selectedFiles.length > 0 ? (
                      <div className="w-full space-y-4">
                        {fileDetails.map((detail, index) => (
                          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-[#3498db]" />
                                <div>
                                  <p className="text-sm text-gray-600">{detail.file.name}</p>
                                  <p className="text-xs text-gray-400">{formatFileSize(detail.file.size)}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handlePreviewFile(detail.previewUrl, detail.file.type)}
                                  className="p-1.5 text-gray-500 hover:text-[#3498db] hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Preview file"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Remove file"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Password
                                </label>
                                <input
                                  type="password"
                                  value={detail.password}
                                  onChange={(e) => handleFileDetailChange(index, 'password', e.target.value)}
                                  placeholder="Enter password"
                                  className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={detail.startDate}
                                  onChange={(e) => handleFileDetailChange(index, 'startDate', e.target.value)}
                                  className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={detail.endDate}
                                  onChange={(e) => handleFileDetailChange(index, 'endDate', e.target.value)}
                                  className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Bank Name
                                </label>
                                <input
                                  type="text"
                                  value={detail.bankName}
                                  onChange={(e) => handleFileDetailChange(index, 'bankName', e.target.value)}
                                  placeholder="Enter bank name"
                                  className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1 text-center">
                          Drag and drop your files here, or
                        </p>
                      </>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click()}}
                    // className="mt-4 px-6 py-2.5 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] shadow-sm transition-all cursor-pointer flex items-center gap-2"
                    className="mt-4 px-6 py-2.5 text-sm font-medium  bg-white text-[#3498db] border border-[#3498db] rounded-lg hover:bg-[#2980b9] hover:text-white shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    {selectedFiles.length > 0 ? "Add More Files" : "Browse Files"}
                  </button>
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
                  <div className="absolute inset-0 bg-[#3498db]/10 rounded-lg pointer-events-none" />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#3498db] to-[#2980b9] rounded-lg hover:from-[#2980b9] hover:to-[#2475a8] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
              >
                Generate Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportForm;