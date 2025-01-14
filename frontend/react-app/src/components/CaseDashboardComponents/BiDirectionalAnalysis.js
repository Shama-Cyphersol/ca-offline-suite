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
import DataTable from "../IndividualDashboardComponents/TableData";
import bidirectional_analysisData from "../../data/bidirectional_analysis.json";

const Bidirectional = () => {
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentValue, setCurrentValue] = useState("");
  const [appliedFiltersData, setAppliedFiltersData] = useState(
    bidirectional_analysisData
  );
  const rowsPerPage = 10;

  // Get unique entities for the dropdown
  const entities = useMemo(() => {
    const uniqueEntities = new Set();
    bidirectional_analysisData.forEach((row) => {
      uniqueEntities.add(row["Entity One"]);
      uniqueEntities.add(row["Entity Two"]);
    });
    return Array.from(uniqueEntities).sort();
  }, []);

  // Filter data based on selected entities
  const filteredData = useMemo(() => {
    if (selectedEntities.length === 0) {
      return bidirectional_analysisData;
    }

    return bidirectional_analysisData.filter(
      (row) =>
        selectedEntities.includes(row["Entity One"]) ||
        selectedEntities.includes(row["Entity Two"])
    );
  }, [selectedEntities]);

  // Pagination
  const totalPages = Math.ceil(appliedFiltersData.length / rowsPerPage);
  const currentData = appliedFiltersData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
    setAppliedFiltersData(filteredData);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedEntities([]);
    setCurrentValue("");
    setAppliedFiltersData(bidirectional_analysisData);
    setCurrentPage(1);
  };

  return (
    <Card className="m-8 w-[53%]">
      <CardHeader>
        <CardTitle>Bidirectional Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters Section */}
          <div className="flex gap-4 items-end">
            {/* Dropdown Section */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Interest Entities
              </label>
              <div className="flex flex-row gap-4 items-center">
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
                {/* Apply Filters Button */}
                <Button
                  onClick={applyFilters}
                  variant="default"
                  className="self-center"
                >
                  Apply Filters
                </Button>

                {/* Reset Filters Button */}
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="self-center"
                >
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

          {/* Table Section */}
          <div className="border rounded-lg">
            <DataTable data={currentData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Bidirectional;
