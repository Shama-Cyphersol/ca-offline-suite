import React, { useState, useEffect } from "react";
import { Search, Loader2, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";

const CategoryEditTable = ({ data = [], categoryOptions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentFilterColumn, setCurrentFilterColumn] = useState(null);
  const [numericFilterModalOpen, setNumericFilterModalOpen] = useState(false);
  const [currentNumericColumn, setCurrentNumericColumn] = useState(null);
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 10;
  const { toast } = useToast();
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentData, setCurrentdata] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [columnsToIgnore, setColumnsToIgnore] = useState(["id"]);
  
  // New states for multiple selection
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkCategoryModalOpen, setBulkCategoryModalOpen] = useState(false);
  const [selectedBulkCategory, setSelectedBulkCategory] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [globalSelectedRows, setGlobalSelectedRows] = useState(new Set());

  useEffect(() => {
    setTransactions(data);
    setFilteredData(data);
  }, [data]);

  // Get dynamic columns from first data item
  let columns = data.length > 0 ? Object.keys(data[0]) : [];
  columns = columns.filter((column) => !columnsToIgnore.includes(column));

  // Determine which columns are numeric
  const numericColumns = columns.filter((column) =>
    data.some((row) => {
      const value = String(row[column]);
      return !isNaN(parseFloat(value)) && !value.includes("-");
    })
  );

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (searchValue === "") {
      setFilteredData(transactions);
      setCurrentPage(1);
      return;
    }

    const columnsToReplace = ["amount", "balance", "debit", "credit"];
    const filtered = filteredData.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (columnsToReplace.includes(key)) {
          return String(value)
            .replace(/,/g, "")
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        }
        return String(value).toLowerCase().includes(searchValue.toLowerCase());
      })
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleCategoryChange = (rowIndex, newCategory) => {
    const dataOnUi = [...currentData];
    const oldCategory = dataOnUi[rowIndex].category;
    dataOnUi[rowIndex].category = newCategory;
    setCurrentdata(dataOnUi);

    const modifiedObject = { ...dataOnUi[rowIndex], oldCategory: oldCategory };
    setModifiedData([...modifiedData, modifiedObject]);
    setHasChanges(true);
  };

  // New function to handle bulk category change
  // Modify bulk category update to work with global selection
  const handleBulkCategoryChange = () => {
    setFilteredData(prevData => {
      const updatedData = [...prevData];
      const newModifiedData = [...modifiedData];
      
      globalSelectedRows.forEach(globalIndex => {
        const oldCategory = updatedData[globalIndex].category;
        updatedData[globalIndex] = {
          ...updatedData[globalIndex],
          category: selectedBulkCategory
        };

        const modifiedObject = {
          ...updatedData[globalIndex],
          oldCategory: oldCategory
        };

        newModifiedData.push(modifiedObject);
      });

      // Update modified data in a separate state update
      setModifiedData(newModifiedData);
      setHasChanges(true);
      setGlobalSelectedRows(new Set());
      setBulkCategoryModalOpen(false);
      setConfirmationModalOpen(false);
      setSelectedBulkCategory("");

      toast({
        title: "Categories updated",
        description: `Updated ${globalSelectedRows.size} transactions`,
      });

      return updatedData;
    });
  };

  // Function to handle row selection
  const toggleRowSelection = (index) => {
    const globalIndex = startIndex + index;
    setGlobalSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(globalIndex)) {
        newSet.delete(globalIndex);
      } else {
        newSet.add(globalIndex);
      }
      return newSet;
    });
  };

   // Modify toggleSelectAll for current page
   const toggleSelectAll = () => {
    const newGlobalSelected = new Set(globalSelectedRows);
    const allCurrentPageSelected = filteredData.every((_, index) => 
      newGlobalSelected.has(startIndex + index)
    );

    if (allCurrentPageSelected) {
      // Unselect all items on current page
      filteredData.forEach((_, index) => {
        newGlobalSelected.delete(startIndex + index);
      });
    } else {
      // Select all items on current page
      filteredData.forEach((_, index) => {
        newGlobalSelected.add(startIndex + index);
      });
    }
    
    setGlobalSelectedRows(newGlobalSelected);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSelectAll = () => {
    const visibleCategories = getFilteredUniqueValues(currentFilterColumn);
    const allSelected = visibleCategories.every((cat) =>
      selectedCategories.includes(cat)
    );
    setSelectedCategories(allSelected ? [] : visibleCategories);
  };

  const handleColumnFilter = () => {
    if (selectedCategories.length === 0) {
      setFilteredData(transactions);
    } else {
      const filtered = data.filter((row) =>
        selectedCategories.includes(String(row[currentFilterColumn]))
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
    setFilterModalOpen(false);
  };

  const handleNumericFilter = (columnName, min, max) => {
    const filtered = data.filter((row) => {
      const value = parseFloat(row[columnName]);
      if (isNaN(value)) return false;
      const meetsMin = min === "" || value >= parseFloat(min);
      const meetsMax = max === "" || value <= parseFloat(max);
      return meetsMin && meetsMax;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilteredData(transactions);
    setCurrentPage(1);
    setMinValue("");
    setMaxValue("");
    setSelectedCategories([]);
    setCategorySearchTerm("");
    setSelectedRows([]);
  };

  const getUniqueValues = (columnName) => {
    return [...new Set(data.map((row) => String(row[columnName])))];
  };

  const getFilteredUniqueValues = (columnName) => {
    const uniqueValues = getUniqueValues(columnName);
    if (!categorySearchTerm) return uniqueValues;
    return uniqueValues.filter((value) =>
      value.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    const totalPagesTemp = Math.ceil(filteredData.length / rowsPerPage);
    setTotalPages(totalPagesTemp);
    const startIndexTemp = (currentPage - 1) * rowsPerPage;
    setStartIndex(startIndexTemp);
    const endIndexTemp = startIndexTemp + rowsPerPage;
    setEndIndex(endIndexTemp);
    setCurrentdata(filteredData.slice(startIndexTemp, endIndexTemp));
  }, [filteredData, currentPage]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 2) {
        pageNumbers.push("ellipsis");
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push("ellipsis");
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      console.log({"Form Submitted":modifiedData});
      
      // const response = await fetch('/api/update-categories', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ data: "test" }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to save changes');
      // }

      setHasChanges(false);
      toast({
        title: "Changes saved successfully",
        description: "All category updates have been saved",
      });

    } catch (error) {
      toast({
        title: "Error saving changes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">

    <Card className="flex-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <CardTitle>Edit Categories</CardTitle>
            <CardDescription>View and manage your categories</CardDescription>
          </div>
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 w-[400px]"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button variant="default" onClick={() => clearFilters()}>
              Clear Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                <Checkbox
                    checked={
                      currentData.length > 0 &&
                      currentData.every((_, index) => 
                        globalSelectedRows.has(startIndex + index)
                      )
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead key={column}>
                    <div className="flex items-center gap-2">
                      {column.charAt(0).toUpperCase() +
                        column.slice(1).toLowerCase()}
                      {column.toLowerCase() !== "description" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            if (numericColumns.includes(column)) {
                              setCurrentNumericColumn(column);
                              setNumericFilterModalOpen(true);
                            } else {
                              setCurrentFilterColumn(column);
                              setSelectedCategories([]);
                              setCategorySearchTerm("");
                              setFilterModalOpen(true);
                            }
                          }}
                        >
                          ▼
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center">
                    No matching results found
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((row, index) => (
                  <TableRow key={index} className={cn(selectedRows.includes(index) && "bg-muted/50")}>
                    <TableCell>
                    <Checkbox
                      checked={globalSelectedRows.has(startIndex + index)}
                      onCheckedChange={() => toggleRowSelection(index)}
                    />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column}
                        className="max-w-[200px] group relative"
                      >
                        {column.toLowerCase() === "category" ? (
                          <Select
                            value={row[column]}
                            onValueChange={(value) => handleCategoryChange(index, value)}
                            className="w-full"
                            disabled={globalSelectedRows.has(startIndex + index)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>{row[column]}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="truncate">{row[column]}</div>
                        )}
                        {column.toLowerCase() === "description" && (
                          <div className="absolute left-0 top-10 hidden group-hover:block bg-black text-white text-sm rounded p-2 z-50 whitespace-normal min-w-[200px] max-w-[400px]">
                            {row[column]}
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

     
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={cn(
                      "cursor-pointer",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={cn(
                      "cursor-pointer",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>


      {/* Category Filter Modal */}
      {filterModalOpen && (
        <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Filter {currentFilterColumn}</DialogTitle>
              <p className="text-sm text-gray-600">
                Make changes to your filter here. Click save when you're done.
              </p>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Search categories..."
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-60 overflow-y-auto space-y-[1px] mb-4">
              {getFilteredUniqueValues(currentFilterColumn).map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.includes(value)}
                    onCheckedChange={() => handleCategorySelect(value)}
                  />
                  <span className="text-gray-700">{value}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button
                variant="default"
                className="bg-black hover:bg-gray-800"
                onClick={handleColumnFilter}
              >
                Save changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Numeric Filter Modal */}
      {numericFilterModalOpen && (
        <Dialog
          open={numericFilterModalOpen}
          onOpenChange={setNumericFilterModalOpen}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Filter {currentNumericColumn}</DialogTitle>
              <p className="text-sm text-gray-600">
                Set the minimum and maximum values for the filter.
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Minimum Value</Label>
                <Input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Value</Label>
                <Input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setNumericFilterModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-black hover:bg-gray-800"
                onClick={() => {
                  handleNumericFilter(currentNumericColumn, minValue, maxValue);
                  setNumericFilterModalOpen(false);
                }}
              >
                Save changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bulk Category Update Modal */}
      <Dialog open={bulkCategoryModalOpen} onOpenChange={setBulkCategoryModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Multiple Categories</DialogTitle>
            <DialogDescription>
              Select a new category for the {selectedRows.length} selected transactions
            </DialogDescription>
          </DialogHeader>
          <Select
            value={selectedBulkCategory}
            onValueChange={setSelectedBulkCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select new category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setBulkCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setBulkCategoryModalOpen(false);
                setConfirmationModalOpen(true);
              }}
              disabled={!selectedBulkCategory}
            >
              Update Categories
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={confirmationModalOpen} onOpenChange={setConfirmationModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Category Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the category to "{selectedBulkCategory}" for {selectedRows.length} transactions?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleBulkCategoryChange}
            >
              Confirm Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-[#3498db]" />
        </div>
      )}
    </Card>
    
        {/* Fixed bottom actions bar */}
        {(hasChanges || globalSelectedRows.size > 0) && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg flex justify-end gap-2 z-50">
            {globalSelectedRows.size > 0 && (
              <Button
                variant="secondary"
                onClick={() => setBulkCategoryModalOpen(true)}
              >
                Update Selected ({globalSelectedRows.size})
              </Button>
            )}
            {hasChanges && (
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            )}
          </div>
        )}
    </div>
  );
};

export default CategoryEditTable;