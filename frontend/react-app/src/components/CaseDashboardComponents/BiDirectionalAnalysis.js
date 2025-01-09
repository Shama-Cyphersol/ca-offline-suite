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

const Bidirectional = () => {
  // Dummy data - Replace this with API call when ready
  const dummyData = {
    bidirectional_analysis: [
      {
        "Entity One": "Company A",
        "Entity Two": "Company B",
        "Number of Transactions": 15,
        "Total Amount Exchanged": 150000,
        "Average Amount Exchanged": 10000,
      },
      {
        "Entity One": "Company B",
        "Entity Two": "Company C",
        "Number of Transactions": 8,
        "Total Amount Exchanged": 80000,
        "Average Amount Exchanged": 10000,
      },
      {
        "Entity One": "Company C",
        "Entity Two": "Company A",
        "Number of Transactions": 12,
        "Total Amount Exchanged": 120000,
        "Average Amount Exchanged": 10000,
      },
    ],
    entity_df: {
      Entity: ["Company A", "Company B", "Company C", "Company D"],
    },
  };

  const [selectedEntities, setSelectedEntities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentValue, setCurrentValue] = useState("");
  const [appliedFiltersData, setAppliedFiltersData] = useState(
    dummyData.bidirectional_analysis
  );
  const rowsPerPage = 10;

  // Get unique entities for the dropdown
  const entities = useMemo(() => {
    return [...new Set(dummyData.entity_df.Entity)].sort();
  }, []);

  // Filter data based on selected entities
  const filteredData = useMemo(() => {
    if (selectedEntities.length === 0) {
      return dummyData.bidirectional_analysis;
    }

    return dummyData.bidirectional_analysis.filter(
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
    setAppliedFiltersData(dummyData.bidirectional_analysis);
    setCurrentPage(1);
  };

  return (
    <Card className="m-8">
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
