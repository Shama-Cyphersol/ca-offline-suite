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
import { ChevronDown, ChevronUp } from "lucide-react";
import fifoLifoData from "../../data/fifo.json";
import TableData from "../IndividualDashboardComponents/TableData";

const TransactionGroup = ({ title, lifoData, fifoData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 w-[75vw]">
      <CardHeader
        className="cursor-pointer p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 hover:bg-slate-200 transition rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CardTitle className="text-sm font-semibold text-gray-700">
            {title}
          </CardTitle>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-6">
          <div>
            <TableData data={lifoData} src="LIFO" />
          </div>
          <div>
            <TableData data={fifoData} src="FIFO" />
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
    Object.values(fifoLifoData).forEach(({ LIFO, FIFO }) => {
      LIFO.forEach((item) => item.Entity && entitySet.add(item.Entity));
      FIFO.forEach((item) => item.Entity && entitySet.add(item.Entity));
    });
    return [...entitySet].filter(Boolean).sort();
  }, []);

  // Filter data based on applied entities
  const filteredData = useMemo(() => {
    if (appliedEntities.length === 0) return fifoLifoData;

    return Object.entries(fifoLifoData).reduce((acc, [key, value]) => {
      const hasMatchingEntity =
        value.LIFO.some(
          (item) => item.Entity && appliedEntities.includes(item.Entity)
        ) ||
        value.FIFO.some(
          (item) => item.Entity && appliedEntities.includes(item.Entity)
        );

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
