import React, { useState,useRef } from 'react';
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {  ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Upload, Trash2 } from "lucide-react";
import { pdfjs, Document, Page } from 'react-pdf';
import { Tooltip } from "../ui/tooltip";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Predefined column options
  const COLUMN_OPTIONS = [
  "Date",
  "Description",
  "Credit",
    "Debit",
    "Balance"
  ];

// Color palette for columns
const COLUMN_COLORS = [
  { bg: "bg-blue-200", border: "border-blue-400", hover: "hover:bg-blue-300", text: "text-blue-700" },
  { bg: "bg-green-200", border: "border-green-400", hover: "hover:bg-green-300", text: "text-green-700" },
  { bg: "bg-purple-200", border: "border-purple-400", hover: "hover:bg-purple-300", text: "text-purple-700" },
  { bg: "bg-orange-200", border: "border-orange-400", hover: "hover:bg-orange-300", text: "text-orange-700" },
  { bg: "bg-pink-200", border: "border-pink-400", hover: "hover:bg-pink-300", text: "text-pink-700" },
  { bg: "bg-teal-200", border: "border-teal-400", hover: "hover:bg-teal-300", text: "text-teal-700" },
  { bg: "bg-red-200", border: "border-red-400", hover: "hover:bg-red-300", text: "text-red-700" },
  { bg: "bg-yellow-200", border: "border-yellow-400", hover: "hover:bg-yellow-300", text: "text-yellow-700" },
  { bg: "bg-indigo-200", border: "border-indigo-400", hover: "hover:bg-indigo-300", text: "text-indigo-700" },
  { bg: "bg-cyan-200", border: "border-cyan-400", hover: "hover:bg-cyan-300", text: "text-cyan-700" }
];

const PDFColumnMarker = () => {
  const [columns, setColumns] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  // const [draggedColumn, setDraggedColumn] = useState(null);
  const [resizeEdge, setResizeEdge] = useState(null); // 'left' or 'right'

  const pdfContainerRef = useRef(null);


  const getColumnAtPosition = (x) => {
    return columns.find(col => {
      const colStart = col.x;
      const colEnd = col.x + col.width;
      return x >= colStart && x <= colEnd;
    });
  };

  const isNearColumnEdge = (x, column) => {
    const nearLeftEdge = Math.abs(x - column.x) < 10;
    const nearRightEdge = Math.abs(x - (column.x + column.width)) < 10;
    
    if (nearLeftEdge) return 'left';
    if (nearRightEdge) return 'right';
    return null;
  };

  const handleMouseDown = (e) => {
    if (!pdfFile) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;

    // Check if clicking on existing column
    const clickedColumn = getColumnAtPosition(x);

    if (clickedColumn) {
      setEditingColumnId(clickedColumn.id);
      setDragStartX(x);
      const edge = isNearColumnEdge(x, clickedColumn);
      if (edge) {
        setIsResizing(true);
        setResizeEdge(edge);
      }
    } else {
      // Starting a new column
      setColumns(prev => [...prev, {
        id: Date.now(),
        x: x,
        width: 0,
        name: "",
        colorIndex: prev.length % COLUMN_COLORS.length
      }]);
      setIsDragging(true);
      setStartX(x);
    }
  };

  const handleMouseMove = (e) => {
    if (!pdfContainerRef.current) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / scale;

    if (isDragging) {
      // Creating/resizing new column
      setColumns(prev => {
        const newColumns = [...prev];
        const lastColumn = newColumns[newColumns.length - 1];
        if (lastColumn) {
          lastColumn.width = currentX - lastColumn.x;
        }
        return newColumns;
      });
    } else if (editingColumnId) {
      if (isResizing) {
        // Resizing existing column
        setColumns(prev => prev.map(col => {
          if (col.id === editingColumnId) {
            const diff = currentX - dragStartX;
            
            if (resizeEdge === 'left') {
              const newX = col.x + diff;
              const newWidth = col.width - diff;
              // Prevent negative width
              if (newWidth >= 10) {
                return {
                  ...col,
                  x: newX,
                  width: newWidth
                };
              }
            } else {
              // Right edge resize
              return {
                ...col,
                width: Math.max(10, col.width + diff)
              };
            }
          }
          return col;
        }));
        setDragStartX(currentX);
      } else {
        // Moving entire column
        setColumns(prev => prev.map(col => {
          if (col.id === editingColumnId) {
            const diff = currentX - dragStartX;
            return {
              ...col,
              x: col.x + diff
            };
          }
          return col;
        }));
        setDragStartX(currentX);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setColumns(prev => {
        const newColumns = [...prev];
        if (newColumns.length > 0) {
          const lastColumn = newColumns[newColumns.length - 1];
          if (Math.abs(lastColumn.width) < 10) {
            return prev.slice(0, -1);
          }
        }
        return newColumns;
      });
    }
    
    setIsDragging(false);
    setEditingColumnId(null);
    setIsResizing(false);
    setResizeEdge(null);
    setDragStartX(null);
  };

  const getCursorStyle = () => {
    if (editingColumnId) {
      return isResizing ? "cursor-col-resize" : "cursor-move";
    }
    return "cursor-crosshair";
  };
  const handleClick = (e) => {
    if (isDragging || !pdfFile || columns.length >= COLUMN_COLORS.length || editingColumnId) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    
    setColumns(prev => [...prev, {
      id: Date.now(),
      x: x,
      width: 0,
      name: "",
      colorIndex: prev.length % COLUMN_COLORS.length
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
      setError("Please mark at least one column before submitting");
      return;
    }

    if (columns.some(col => !col.name)) {
      setError("Please select names for all columns");
      return;
    }

    const columnsData = columns.map(col => ({
      name: col.name,
      startX: col.x,
      width: col.width,
      page: currentPage
    }));

    console.log("Columns data:", columnsData);
    // Add your submission logic here
  };

  const removeColumn = (id) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setPdfFile(file);
      setColumns([]);
      setCurrentPage(1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          PDF Column Marker
        </CardTitle>
        <CardDescription>
          Upload a PDF and click-and-drag to mark columns. Click and drag existing columns to move them, 
          or drag their edges to resize. Select column types from the predefined options.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div className="flex justify-center">
          <label className="relative cursor-pointer bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors w-full">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <span className="text-sm font-medium text-gray-900">
                  {pdfFile ? pdfFile.name : "Drop PDF here or click to upload"}
                </span>
              </div>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* PDF Controls */}
        {pdfFile && (
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Tooltip content="Previous Page">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Tooltip>
              <span className="text-sm">
                Page {currentPage} of {numPages || '?'}
              </span>
              <Tooltip content="Next Page">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages || prev))}
                  disabled={currentPage >= (numPages || 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content="Zoom Out">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </Tooltip>
              <span className="text-sm">{Math.round(scale * 100)}%</span>
              <Tooltip content="Zoom In">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScale(prev => prev + 0.1)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {pdfFile && (
          <div 
            ref={pdfContainerRef}
            className={`relative bg-gray-50 rounded-lg overflow-hidden ${getCursorStyle()}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-96 text-red-500">
                  Failed to load PDF
                </div>
              }
            >
              <Page 
                pageNumber={currentPage} 
                scale={scale}
                className="relative"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />

              {/* Column markers */}
              {columns.map((col) => (
                <div
                  key={col.id}
                  className={`absolute top-0 bottom-0 ${COLUMN_COLORS[col.colorIndex].bg} bg-opacity-50 
                    ${COLUMN_COLORS[col.colorIndex].border} border-x ${COLUMN_COLORS[col.colorIndex].hover}
                    ${editingColumnId === col.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{
                    left: `${col.x * scale}px`,
                    width: `${col.width * scale}px`
                  }}
                >
                  {/* Column number indicator */}
                  <div className={`absolute bottom-4 left-[40%] w-6 h-6 rounded-full 
                    ${COLUMN_COLORS[col.colorIndex].bg} ${COLUMN_COLORS[col.colorIndex].border} 
                    flex items-center justify-center font-bold ${COLUMN_COLORS[col.colorIndex].text}`}>
                    {columns.indexOf(col) + 1}
                  </div>
                  
                  {/* Resize handles */}
                  <div className="absolute inset-y-0 left-0 w-2 cursor-col-resize" />
                  <div className="absolute inset-y-0 right-0 w-2 cursor-col-resize" />
                </div>
              ))}
            </Document>
          </div>
        )}

        {/* Column names input */}
        {columns.length > 0 && (
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Please Label Columns Before submitting</h3>
            {columns.map((col, index) => (
              <div key={col.id} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${COLUMN_COLORS[col.colorIndex].bg} 
                  ${COLUMN_COLORS[col.colorIndex].border} flex items-center justify-center 
                  font-bold ${COLUMN_COLORS[col.colorIndex].text}`}>
                  {index + 1}
                </div>
                <Select value={col.name} onValueChange={(value) => handleColumnNameChange(col.id, value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select column type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMN_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Tooltip content="Remove Column">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColumn(col.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            ))}
          </div>
        )}

        <Button 
          className="w-full"
          onClick={handleSubmission}
          disabled={columns.length === 0}
        >
          Save Column Mapping
        </Button>
      </CardContent>
    </Card>
  );
};

export default PDFColumnMarker;