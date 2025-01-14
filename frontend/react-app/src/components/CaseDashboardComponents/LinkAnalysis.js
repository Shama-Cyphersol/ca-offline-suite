import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import TableData from "../IndividualDashboardComponents/TableData";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import link_analysisData from "../../data/link_analysis.json"; // Import JSON data directly

const LinkAnalysisWidget = () => {
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [pendingNames, setPendingNames] = useState([]);
  const [pendingEntities, setPendingEntities] = useState([]);

  // Filter valid transactions
  const filterValidTransactions = (data) => {
    if (!data || !data.length) return [];
    return data.filter(
      (row) =>
        ((row.Total_Credit != null && row.Total_Credit !== 0) ||
          (row.Total_Debit != null && row.Total_Debit !== 0)) &&
        row.Entity != null &&
        row.Entity.trim() !== ""
    );
  };

  // Initialize data
  const linkAnalysisData = useMemo(() => {
    return filterValidTransactions(link_analysisData);
  }, []);

  // Get unique values for dropdowns
  const uniqueNames = useMemo(() => {
    return [
      ...new Set(linkAnalysisData.map((row) => row.Name).filter(Boolean)),
    ].sort();
  }, [linkAnalysisData]);

  const uniqueEntities = useMemo(() => {
    return [
      ...new Set(linkAnalysisData.map((row) => row.Entity).filter(Boolean)),
    ].sort();
  }, [linkAnalysisData]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = [...linkAnalysisData];

    if (selectedNames.length) {
      filtered = filtered.filter((row) => selectedNames.includes(row.Name));
    }

    if (selectedEntities.length) {
      filtered = filtered.filter((row) =>
        selectedEntities.includes(row.Entity)
      );
    }

    return filtered;
  }, [linkAnalysisData, selectedNames, selectedEntities]);

  const resetFilters = () => {
    setSelectedNames([]);
    setSelectedEntities([]);
    setPendingNames([]);
    setPendingEntities([]);
  };

  const applyFilters = () => {
    setSelectedNames(pendingNames);
    setSelectedEntities(pendingEntities);
  };

  return (
    <Card className="m-8">
      <CardHeader>
        <CardTitle>Link Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Names</label>
              <Select
                onValueChange={(value) =>
                  setPendingNames((prev) =>
                    prev.includes(value)
                      ? prev.filter((v) => v !== value)
                      : [...prev, value]
                  )
                }
                value={pendingNames[0] || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select names..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {uniqueNames.map((name) => (
                      <SelectItem
                        key={name}
                        value={name}
                        className={
                          pendingNames.includes(name) ? "bg-accent" : ""
                        }
                      >
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {pendingNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {pendingNames.map((name) => (
                    <div
                      key={name}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
                    >
                      {name}
                      <button
                        onClick={() =>
                          setPendingNames((prev) =>
                            prev.filter((n) => n !== name)
                          )
                        }
                        className="hover:text-primary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Entities</label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select
                      onValueChange={(value) =>
                        setPendingEntities((prev) =>
                          prev.includes(value)
                            ? prev.filter((v) => v !== value)
                            : [...prev, value]
                        )
                      }
                      value={pendingEntities[0] || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select entities..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {uniqueEntities.map((entity) => (
                            <SelectItem
                              key={entity}
                              value={entity}
                              className={
                                pendingEntities.includes(entity)
                                  ? "bg-accent"
                                  : ""
                              }
                            >
                              {entity}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </div>
              </div>
              {pendingEntities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {pendingEntities.map((entity) => (
                    <div
                      key={entity}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
                    >
                      {entity}
                      <button
                        onClick={() =>
                          setPendingEntities((prev) =>
                            prev.filter((e) => e !== entity)
                          )
                        }
                        className="hover:text-primary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <TableData data={filteredData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkAnalysisWidget;
