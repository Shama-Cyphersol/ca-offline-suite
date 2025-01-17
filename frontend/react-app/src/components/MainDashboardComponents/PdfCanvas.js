import React, { useState, useRef } from 'react';
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Upload, MousePointer2, GripVertical, Plus } from "lucide-react";
import { pdfjs, Document, Page } from 'react-pdf';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const COLUMN_TYPES = [
  { id: 'date', label: '📅 Date' },
  { id: 'description', label: '📝 Description' },
  { id: 'credit', label: '💰 Credit' },
  { id: 'debit', label: '💸 Debit' },
  { id: 'balance', label: '🏦 Balance' }
];

const COLUMN_COLORS = [
  { bg: "bg-blue-200", text: "text-blue-700", border: "border-blue-400" },
  { bg: "bg-green-200", text: "text-green-700", border: "border-green-400" },
  { bg: "bg-purple-200", text: "text-purple-700", border: "border-purple-400" },
  { bg: "bg-orange-200", text: "text-orange-700", border: "border-orange-400" },
  { bg: "bg-pink-200", text: "text-pink-700", border: "border-pink-400" }
];

const PDFColumnMarker = () => {
  const [tableBounds, setTableBounds] = useState({ start: null, end: null });
  const [columnLines, setColumnLines] = useState([]); // Array of {id, x}
  const [columnLabels, setColumnLabels] = useState([]); // Array of {id, x, type, label, colorIndex}
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.3);
  const [activeStep, setActiveStep] = useState(0);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);
  const [draggingLineIndex, setDraggingLineIndex] = useState(null);
  const [draggingLabelIndex, setDraggingLabelIndex] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);
  const [mode, setMode] = useState('lines'); // 'lines' or 'labels'
  
  const pdfContainerRef = useRef(null);

  const handleClick = (e) => {
    if (!pdfFile || activeStep !== 1 || draggingLineIndex !== null || draggingLabelIndex !== null) return;
    
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    
    if (!tableBounds.start) {
      setTableBounds(prev => ({ ...prev, start: x }));
    } else if (!tableBounds.end) {
      setTableBounds(prev => ({ ...prev, end: x }));
    } else if (mode === 'lines') {
      if (x > tableBounds.start && x < tableBounds.end) {
        setColumnLines(prev => [...prev, { id: Date.now(), x }]);
      }
    } else if (mode === 'labels') {
      if (x > tableBounds.start && x < tableBounds.end) {
        setColumnLabels(prev => [...prev, {
          id: Date.now(),
          x,
          type: '',
          label: '',
          colorIndex: prev.length % COLUMN_COLORS.length
        }]);
      }
    }
  };

  const handleDragStart = (e, index, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'line') {
      setDraggingLineIndex(index);
    } else {
      setDraggingLabelIndex(index);
    }
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / scale;
    setDragStartX(startX);
  };

  const handleDrag = (e) => {
    if ((draggingLineIndex === null && draggingLabelIndex === null) || !pdfContainerRef.current) return;
    
    e.preventDefault();
    
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / scale;
    
    if (draggingLineIndex !== null) {
      setColumnLines(prev => prev.map((line, i) => {
        if (i === draggingLineIndex && currentX > tableBounds.start && currentX < tableBounds.end) {
          return { ...line, x: currentX };
        }
        return line;
      }));
    } else if (draggingLabelIndex !== null) {
      setColumnLabels(prev => prev.map((label, i) => {
        if (i === draggingLabelIndex && currentX > tableBounds.start && currentX < tableBounds.end) {
          return { ...label, x: currentX };
        }
        return label;
      }));
    }
  };

  const handleDragEnd = (e) => {
    if (e) e.preventDefault();
    setDraggingLineIndex(null);
    setDraggingLabelIndex(null);
    setDragStartX(null);
  };

  const handleColumnTypeSelect = (labelIndex, typeId) => {
    setColumnLabels(prev => prev.map((label, i) => 
      i === labelIndex ? { 
        ...label, 
        type: typeId,
        label: COLUMN_TYPES.find(t => t.id === typeId)?.label || ''
      } : label
    ));
    setEditingLabelIndex(null);
  };

  const removeColumnLine = (index) => {
    setColumnLines(prev => prev.filter((_, i) => i !== index));
  };

  const removeColumnLabel = (index) => {
    setColumnLabels(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      setColumnLines([]);
      setColumnLabels([]);
      setTableBounds({ start: null, end: null });
      setCurrentPage(1);
      setActiveStep(1);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getInstructionText = () => {
    if (!tableBounds.start) {
      return "Click to mark the left boundary of your table";
    } else if (!tableBounds.end) {
      return "Click to mark the right boundary of your table";
    }
    return mode === 'lines' 
      ? "Click between the boundaries to add column lines" 
      : "Click between the lines to add column labels";
  };

  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        {[
          { step: 0, label: "Upload PDF" },
          { step: 1, label: "Mark Table Bounds & Columns" }
        ].map(({ step, label }) => (
          <div key={step} className="flex flex-col items-center w-1/2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
              ${step === activeStep ? 'bg-blue-500 text-white' : 
                step < activeStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step + 1}
            </div>
            <span className="text-sm text-center">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Fixed Instructions Panel */}
      <div className="fixed bottom-4 right-4 z-50 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <h3 className="font-medium mb-2">Instructions</h3>
        <p className="text-sm text-gray-600 mb-2">{getInstructionText()}</p>
        <div className="text-xs text-gray-500">
          <p>• Drag <GripVertical className="inline h-3 w-3" /> to move items</p>
          <p>• Click <X className="inline h-3 w-3" /> to delete items</p>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>PDF Column Marker</CardTitle>
          <CardDescription>
            Mark table boundaries and columns in your PDF document to extract structured data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepIndicator()}

          {activeStep === 0 && (
            <div className="flex justify-center">
              <label className="relative cursor-pointer bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors w-full">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-900">
                      Drop PDF here or click to upload
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
          )}

          {pdfFile && (
            <>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>Page {currentPage} of {numPages || '?'}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages || prev))}
                    disabled={currentPage >= (numPages || 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg p-1">
                    <Button
                      variant={mode === 'lines' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setMode('lines')}
                    >
                      Lines
                    </Button>
                    <Button
                      variant={mode === 'labels' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setMode('labels')}
                    >
                      Labels
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span>{Math.round(scale * 100)}%</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setScale(prev => prev + 0.1)}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div 
                ref={pdfContainerRef}
                className="relative bg-gray-50 rounded-lg overflow-hidden"
                style={{ cursor: activeStep === 1 ? 'crosshair' : 'default' }}
                onClick={handleClick}
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page 
                    pageNumber={currentPage} 
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />

                  {/* Table boundaries */}
                  {tableBounds.start !== null && (
                    <div 
                      className="absolute top-0 h-full border-l-2 border-red-500"
                      style={{ left: `${tableBounds.start * scale}px` }}
                    >
                      <div className="absolute top-2 -translate-x-1/2 px-2 py-1 rounded bg-red-100 text-red-700 text-sm font-medium whitespace-nowrap">
                        Table Start
                      </div>
                    </div>
                  )}
                  {tableBounds.end !== null && (
                    <div 
                      className="absolute top-0 h-full border-l-2 border-red-500"
                      style={{ left: `${tableBounds.end * scale}px` }}
                    >
                      <div className="absolute top-2 -translate-x-1/2 px-2 py-1 rounded bg-red-100 text-red-700 text-sm font-medium whitespace-nowrap">
                        Table End
                      </div>
                    </div>
                  )}

                  {/* Column lines */}
                  {columnLines.map((line, index) => (
                    <div 
                      key={line.id} 
                      className="absolute top-0 h-full" 
                      style={{ left: `${line.x * scale}px` }}
                    >
                      <div className="w-1 h-full bg-gray-400 border-l-2 border-gray-500" />
                      
                      {/* Line Controls */}
                      <div className="absolute top-2 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-move"
                          onMouseDown={(e) => handleDragStart(e, index, 'line')}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeColumnLine(index);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Column labels */}
                  {columnLabels.map((label, index) => (
                    <div 
                      key={label.id} 
                      className="absolute top-12" 
                      style={{ 
                        left: `${label.x * scale}px`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 mb-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-move"
                            onMouseDown={(e) => handleDragStart(e, index, 'label')}
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeColumnLabel(index);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {editingLabelIndex === index ? (
                          <Select
                            value={label.type}
                            onValueChange={(value) => handleColumnTypeSelect(index, value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select column type" />
                            </SelectTrigger>
                            <SelectContent>
                              {COLUMN_TYPES.map(type => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div 
                            className={`px-2 py-1 rounded cursor-pointer
                              ${COLUMN_COLORS[label.colorIndex].bg} ${COLUMN_COLORS[label.colorIndex].text}
                              text-sm font-medium whitespace-nowrap`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLabelIndex(index);
                            }}
                          >
                            {label.label || 'Click to label'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Document>
              </div>

              <div className="flex justify-between">
                {activeStep > 0 && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setActiveStep(prev => prev - 1);
                      setTableBounds({ start: null, end: null });
                      setColumnLines([]);
                      setColumnLabels([]);
                    }}
                  >
                    Start Over
                  </Button>
                )}
                <Button 
                  className="ml-auto"
                  onClick={() => console.log({ 
                    tableBounds, 
                    columnLines: columnLines.map(line => ({ x: line.x })),
                    columnLabels: columnLabels.map(label => ({ 
                      x: label.x,
                      type: label.type,
                      label: label.label
                    }))
                  })}
                  disabled={!tableBounds.start || !tableBounds.end}
                >
                  Save Column Mapping
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PDFColumnMarker;