import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { X } from "lucide-react";
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDFColumnMarker = () => {
  const [columns, setColumns] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfPath, setPdfPath] = useState('');
  const [scale, setScale] = useState(1.0);

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setIsDragging(true);
    setStartX(x);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;

    setColumns(prev => {
      const newColumns = [...prev];
      if (newColumns.length > 0) {
        const lastColumn = newColumns[newColumns.length - 1];
        lastColumn.width = currentX - startX;
      }
      return newColumns;
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setColumns(prev => {
      const newColumns = [...prev];
      if (newColumns.length > 0) {
        const lastColumn = newColumns[newColumns.length - 1];
        if (lastColumn.width < 10) {
          return prev.slice(0, -1);
        }
      }
      return newColumns;
    });
  };

  const handleClick = (e) => {
    if (isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    setColumns(prev => [...prev, {
      id: Date.now(),
      x: x,
      width: 0,
      name: `Column ${prev.length + 1}`
    }]);
    setStartX(x);
    setIsDragging(true);
  };

  const handleColumnNameChange = (id, newName) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, name: newName } : col
    ));
  };

  const handleSubmission = () => {
    if (columns.length === 0) {
      alert("Please mark at least one column");
      return;
    }

    const columnsData = columns.map(col => ({
      name: col.name,
      startX: col.x,
      width: col.width,
      page: currentPage
    }));

    console.log("Columns data:", columnsData);
  };

  const removeColumn = (id) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfPath(''); // Clear the path when file is uploaded
    }
  };

  const handlePathSubmit = () => {
    if (pdfPath) {
      setPdfFile(null); // Clear the file when path is provided
      // Force re-render of PDF component
      setCurrentPage(1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>PDF Column Marker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mb-2"
            />
          </div>

       
          {/* PDF Controls */}
          {(pdfFile || pdfPath) && (
            <div className="flex items-center gap-2 my-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {numPages || '?'}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages || prev))}
                disabled={currentPage >= (numPages || 1)}
              >
                Next
              </Button>
              <Button
                onClick={() => setScale(prev => prev + 0.1)}
              >
                Zoom In
              </Button>
              <Button
                onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
              >
                Zoom Out
              </Button>
            </div>
          )}

          {/* PDF Viewer */}
          <div 
            className="relative bg-gray-100 mb-4 cursor-crosshair"
            onMouseDown={handleClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Document
              file={pdfFile || pdfPath}
              onLoadSuccess={onDocumentLoadSuccess}
              className="border border-gray-200"
            >
              <Page 
                pageNumber={currentPage} 
                scale={scale}
                className="relative"
                renderTextLayer={false}
                renderAnnotationLayer={false} 
              />
            </Document>

            {/* Column markers */}
            {columns.map((col) => (
              <div
                key={col.id}
                className="absolute top-0 bottom-0 bg-blue-200 bg-opacity-50 border-x border-blue-400"
                style={{
                  left: `${col.x}px`,
                  width: `${col.width}px`
                }}
              />
            ))}
          </div>

          {/* Column names input */}
          <div className="space-y-2">
            {columns.map((col) => (
              <div key={col.id} className="flex items-center gap-2">
                <Input
                  value={col.name}
                  onChange={(e) => handleColumnNameChange(col.id, e.target.value)}
                  placeholder="Column name"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColumn(col.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button 
            className="w-full"
            onClick={handleSubmission}
            disabled={columns.length === 0}
          >
            Submit Column Mapping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFColumnMarker;