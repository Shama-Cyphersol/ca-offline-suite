import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

const dummyData = {
  "Utilization of Credit (10000) received by Gamma from Alpha on 2024-04-03": {
    LIFO: {
      "Value Date": ["2024-04-01"],
      Name: ["Alpha"],
      Description: ["Opening Balance"],
      Debit: [0],
      Credit: [0],
      Entity: ["poojan"],
    },
    FIFO: {
      "Value Date": [
        "2024-04-03",
        "2024-04-04",
        "2024-04-05",
        "2024-04-06",
        "2024-04-06",
        "2024-04-07",
        "2024-04-10",
      ],
      Name: ["Gamma", "Gamma", "Gamma", "Gamma", "Gamma", "Gamma", "Gamma"],
      Description: [
        "Credit from Alpha",
        "Groceries",
        "Travel Expense",
        "Transfer to Delta",
        "Dining",
        "Gift to Beta",
        "Transfer to Delta",
      ],
      Debit: [0, 250, 100, 1500, 150, 200, 1500],
      Credit: [10000, 0, 0, 0, 0, 0, 0],
      Entity: ["Alpha", null, "raj", "Delta", null, "Beta", "Delta"],
      "Utilized Credit": [0, 250, 350, 1850, 2000, 2200, 3700],
      "Remaining Credit": [10000, 9750, 9650, 8150, 8000, 7800, 6300],
    },
  },
  "Utilization of Credit (1000) received by Alpha from Beta on 2024-04-03": {
    LIFO: {
      "Value Date": ["2024-04-01"],
      Name: ["Beta"],
      Description: ["Opening Balance"],
      Debit: [0],
      Credit: [0],
      Entity: [null],
    },
    FIFO: {
      "Value Date": ["2024-04-03", "2024-04-04", "2024-04-05"],
      Name: ["Alpha", "Alpha", "Alpha"],
      Description: ["Credit from Beta", "Groceries", "Electricity Bill"],
      Debit: [0, 200, 150],
      Credit: [1000, 0, 0],
      Entity: ["Beta", "sanjay", "gar"],
      "Utilized Credit": [0, 200, 350],
      "Remaining Credit": [1000, 800, 650],
    },
  },
};

const DataTable = ({ data }) => {
  if (!data || typeof data !== "object") return null;

  const columns = Object.keys(data);
  if (!columns.length) return null;

  const rowCount = data[columns[0]]?.length || 0;
  if (!rowCount) return null;

  // Calculate totals for numeric columns
  const numericColumns = columns.filter((col) =>
    data[col].every((value) => typeof value === "number")
  );

  const totals = numericColumns.reduce((acc, column) => {
    acc[column] = data[column].reduce((sum, value) => sum + value, 0);
    return acc;
  }, {});

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        {/* Table Header */}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column}
                className="text-gray-500 p-3 text-sm text-center"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="bg-white">
              {columns.map((column) => (
                <TableCell
                  key={`${rowIndex}-${column}`}
                  className="p-3 text-sm text-center border-b"
                >
                  {data[column][rowIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const TransactionGroup = ({ title, lifoData, fifoData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">{title}</CardTitle>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">LIFO Transactions</h3>
            <DataTable data={lifoData} />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">FIFO Transactions</h3>
            <DataTable data={fifoData} />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const LIFOFIFO = () => {
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [appliedEntities, setAppliedEntities] = useState([]);
  const [currentValue, setCurrentValue] = useState("");

  // Get unique entities for the dropdown
  const entities = useMemo(() => {
    const entitySet = new Set();
    Object.values(dummyData).forEach(({ LIFO, FIFO }) => {
      LIFO.Entity.forEach((entity) => entitySet.add(entity));
      FIFO.Entity.forEach((entity) => entitySet.add(entity));
    });
    return [...entitySet].sort();
  }, []);

  // Filter data based on applied entities
  const filteredData = useMemo(() => {
    if (appliedEntities.length === 0) return dummyData;

    return Object.entries(dummyData).reduce((acc, [key, value]) => {
      const hasMatchingEntity =
        value.LIFO.Entity.some((entity) => appliedEntities.includes(entity)) ||
        value.FIFO.Entity.some((entity) => appliedEntities.includes(entity));

      if (hasMatchingEntity) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [appliedEntities]);

  const handleEntitySelect = (value) => {
    setCurrentValue(value);
    setSelectedEntities((prev) => {
      if (prev.includes(value)) {
        return prev.filter((e) => e !== value);
      }
      return [...prev, value];
    });
  };

  const applyFilters = () => {
    setAppliedEntities(selectedEntities);
  };

  const resetFilters = () => {
    setSelectedEntities([]);
    setAppliedEntities([]);
    setCurrentValue("");
  };

  return (
    <Card className="m-8">
      <CardHeader>
        <CardTitle>LIFO FIFO Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Filters Section */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Filter by Entity
              </label>
              <div className="flex flex-row items-center gap-2">
                <Select value={currentValue} onValueChange={handleEntitySelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((entity) => (
                      <SelectItem
                        key={entity}
                        value={entity}
                        className={
                          selectedEntities.includes(entity) ? "bg-accent" : ""
                        }
                      >
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={applyFilters} variant="default">
                  Apply Filters
                </Button>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </div>
              {/* Selected Entities Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEntities.map((entity) => (
                  <div
                    key={entity}
                    className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
                  >
                    {entity}
                    <button
                      onClick={() => handleEntitySelect(entity)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction Groups */}
          <div className="space-y-4">
            {Object.entries(filteredData).map(([title, data], index) => (
              <TransactionGroup
                key={index}
                title={title}
                lifoData={data.LIFO}
                fifoData={data.FIFO}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LIFOFIFO;
