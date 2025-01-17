import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Upload, GripVertical } from "lucide-react";
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

const initialConfigTest = {
  bounds: { start: 100, end: 500 },
  lines: [
    { x: 150 },
    { x: 250 },
    { x: 350 }
  ],
  // labels: [
  //   { x: 200, type: 'date', label: '📅 Date' },
  //   { x: 300, type: 'description', label: '📝 Description' }
  // ]
}

const PDFColumnMarker = ({initialConfig=initialConfigTest}) => {
  const [tableBounds, setTableBounds] = useState({ start: null, end: null });
  const [columnLines, setColumnLines] = useState([]); // Array of {id, x}
  const [columnLabels, setColumnLabels] = useState([]); // Array of {id, x, type, label, colorIndex}
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.3);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);
  const [draggingLineIndex, setDraggingLineIndex] = useState(null);
  const [draggingLabelIndex, setDraggingLabelIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState('boundaries');

  const pdfContainerRef = useRef(null);
  const STEPS = [
    { id: 'boundaries', label: "Mark Table Boundaries" },
    { id: 'lines', label: "Add Column Lines" },
    { id: 'labels', label: "Label Columns" }
  ];

  useEffect(() => {
    if (initialConfig && pdfFile) {
      const { bounds, lines, labels } = initialConfig;
      
      if (bounds) {
        setTableBounds(bounds);
        setCurrentStep('lines'); // Move to lines step since boundaries are set
      }
      
      if (lines) {
        setColumnLines(lines.map(line => ({
          id: Date.now() + Math.random(), // Generate unique IDs
          x: line.x
        })));
      }
      
      if (labels) {
        setColumnLabels(labels.map((label, index) => ({
          id: Date.now() + Math.random(),
          x: label.x,
          type: label.type,
          label: label.label || COLUMN_TYPES.find(t => t.id === label.type)?.label || '',
          colorIndex: index % COLUMN_COLORS.length
        })));
        
        if (labels.length > 0) {
          setCurrentStep('labels'); // Move to labels step if labels exist
        }
      }
    }
  }, [initialConfig, pdfFile]);
    
    const getStepNumber = (stepId) => {
      return STEPS.findIndex(step => step.id === stepId) + 1;
    };
  
    const moveToNextStep = () => {
      const currentIndex = STEPS.findIndex(step => step.id === currentStep);
      if (currentIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentIndex + 1].id);
      }
    };
  
    const handleClick = (e) => {
      if (!pdfFile || isDragging) return;
      
      if (draggingLineIndex !== null || draggingLabelIndex !== null) {
        return;
      }
      
      const rect = pdfContainerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      
      if (currentStep === 'boundaries') {
        if (!tableBounds.start) {
          setTableBounds(prev => ({ ...prev, start: x }));
        } else if (!tableBounds.end) {
          setTableBounds(prev => ({ ...prev, end: x }));
          moveToNextStep();
        }
      } else if (currentStep === 'lines') {
        if (x > tableBounds.start && x < tableBounds.end) {
          setColumnLines(prev => [...prev, { id: Date.now(), x }]);
        }
      } else if (currentStep === 'labels') {
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
    setIsDragging(true);
  };

  const handleDrag = (e) => {
    if ((draggingLineIndex === null && draggingLabelIndex === null) || !pdfContainerRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Add a small delay before resetting isDragging to prevent immediate click handling
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
    
    setDraggingLineIndex(null);
    setDraggingLabelIndex(null);
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
      
      // Only reset if there's no initial configuration
      if (!initialConfig) {
        setColumnLines([]);
        setColumnLabels([]);
        setTableBounds({ start: null, end: null });
        setCurrentStep('boundaries');
      }
      
      setCurrentPage(1);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getInstructionText = () => {
    if (currentStep === 'boundaries') {
      if (!tableBounds.start) {
        return "Click to mark the left boundary of your table";
      }
      return "Click to mark the right boundary of your table";
    }
    if (currentStep === 'lines') {
      return "Click between the boundaries to add column divider lines";
    }
    return "Click between the lines to add column labels";
  };

  const handleSubmit = () => {
    const config = {
      page: currentPage,
      tableBounds,
      columnLines: columnLines.map(line => ({ x: line.x })),
      columnLabels: columnLabels.map(label => ({ 
        x: label.x,
        type: label.type,
        label: label.label
      }))
    };
    
    console.log(config);
  }

  const handleReset = () => {
    if (initialConfig) {
      // Reset to initial config
      setTableBounds(initialConfig.bounds || { start: null, end: null });
      setColumnLines(initialConfig.lines?.map(line => ({
        id: Date.now() + Math.random(),
        x: line.x
      })) || []);
      setColumnLabels(initialConfig.labels?.map((label, index) => ({
        id: Date.now() + Math.random(),
        x: label.x,
        type: label.type,
        label: label.label || COLUMN_TYPES.find(t => t.id === label.type)?.label || '',
        colorIndex: index % COLUMN_COLORS.length
      })) || []);
      setCurrentStep(initialConfig.bounds ? 'lines' : 'boundaries');
    } else {
      // Complete reset
      setTableBounds({ start: null, end: null });
      setColumnLines([]);
      setColumnLabels([]);
      setCurrentStep('boundaries');
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-6">
        <CardTitle>PDF Column Marker</CardTitle>
        
        {/* Steps Progress Bar */}
        <div className="w-full flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute h-0.5 bg-gray-200 w-full -z-10" />
          <div 
            className="absolute h-0.5 bg-blue-500 transition-all -z-10" 
            style={{ 
              width: `${(getStepNumber(currentStep) - 1) * 50}%`
            }} 
          />
          
          {/* Step Indicators */}
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = getStepNumber(currentStep) > index + 1;
            
            return (
              <div 
                key={step.id}
                className="flex flex-col items-center gap-2"
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${isCompleted ? 'bg-blue-500 text-white' : 
                      isActive ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-600'}`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-blue-500' : 'text-gray-600'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
        <CardContent className="space-y-6">

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{getInstructionText()}</p>
          <div className="text-xs text-gray-500 flex gap-x-4 mt-2">
            <p>• Drag <GripVertical className="inline h-3 w-3" /> to move items</p>
            <p>• Click <X className="inline h-3 w-3" /> to delete items</p>
          </div>
        </div>

        {!pdfFile ? (
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
        ) : (
          <>
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-2 text-nowrap">
                {/* Page Navigation */}
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

              <div className="flex items-center gap-4 w-full">
                <div className='w-full flex justify-center gap-2'>

                {currentStep !== 'boundaries' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const prevStepIndex = Math.max(0, getStepNumber(currentStep) - 2);
                      setCurrentStep(STEPS[prevStepIndex].id);
                    }}
                  >
                    Back
                  </Button>
                )}

                {currentStep === 'lines' && columnLines.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => moveToNextStep()}
                  >
                    Next: Label Columns
                  </Button>
                )}

</div>

                <div className="flex items-center gap-2 text-nowrap">
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
                style={{ cursor: 'crosshair'  }}
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
                      <div className="h-full bg-gray-400 border-l-2 border-gray-500" />
                      
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
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentStep('boundaries');
                  setTableBounds({ start: null, end: null });
                  setColumnLines([]);
                  setColumnLabels([]);
                }}
              >
                Start Over
              </Button>
              <Button 
                className="ml-auto"
                onClick={handleSubmit}
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