import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "../ca-offline-suite/frontend/react-app/src/components/IndividualDashboardComponents/TableData";

function ExcelViewer() {
  const [uploadedData, setUploadedData] = useState([]);

  // Handle file upload and parse Excel data
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Assume data is in the first sheet
      const sheetName = workbook.SheetNames[2];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      const data = XLSX.utils.sheet_to_json(sheet);
      setUploadedData(data);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <h2>Uploaded Data</h2>
      {uploadedData.length > 0 ? (
        <DataTable data={uploadedData} />
      ) : (
        <p>No data uploaded yet.</p>
      )}
    </div>
  );
}

export default ExcelViewer;
