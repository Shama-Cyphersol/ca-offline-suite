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
import { Alert, AlertDescription } from "../ui/alert";

const demoData = {
  cummalative_df: {
    link_analysis_df: [
      {
        Name: "John Smith",
        Entity: "ABC Corp",
        Total_Credit: 50000,
        Total_Debit: 30000,
      },
      {
        Name: "John Smith",
        Entity: "XYZ Ltd",
        Total_Credit: 75000,
        Total_Debit: 45000,
      },
      {
        Name: "Sarah Johnson",
        Entity: "ABC Corp",
        Total_Credit: 60000,
        Total_Debit: 35000,
      },
      {
        Name: "Sarah Johnson",
        Entity: "123 Industries",
        Total_Credit: 45000,
        Total_Debit: 25000,
      },
      {
        Name: "Michael Brown",
        Entity: "XYZ Ltd",
        Total_Credit: 80000,
        Total_Debit: 50000,
      },
      {
        Name: "Emily Davis",
        Entity: "123 Industries",
        Total_Credit: 55000,
        Total_Debit: 30000,
      },
      {
        Name: "Emily Davis",
        Entity: "ABC Corp",
        Total_Credit: 70000,
        Total_Debit: 40000,
      },
      {
        Name: "David Wilson",
        Entity: "456 Company",
        Total_Credit: 65000,
        Total_Debit: 35000,
      },
      {
        Name: "Lisa Anderson",
        Entity: "789 Enterprise",
        Total_Credit: 90000,
        Total_Debit: 55000,
      },
      {
        Name: "James Taylor",
        Entity: "456 Company",
        Total_Credit: 85000,
        Total_Debit: 50000,
      },
      {
        Name: "Mary Roberts",
        Entity: "789 Enterprise",
        Total_Credit: 95000,
        Total_Debit: 60000,
      },
      {
        Name: "Robert Brown",
        Entity: "XYZ Ltd",
        Total_Credit: 72000,
        Total_Debit: 42000,
      },
    ],
  },
};

const LinkAnalysisWidget = ({ result = demoData, caseId = "DEMO-001" }) => {
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingNames, setPendingNames] = useState([]);
  const [pendingEntities, setPendingEntities] = useState([]);
  const rowsPerPage = 10;

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
    const rawData = result?.cummalative_df?.link_analysis_df || [];
    return filterValidTransactions(rawData);
  }, [result]);

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
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setSelectedNames(pendingNames);
    setSelectedEntities(pendingEntities);
    setCurrentPage(1);
  };

  if (!linkAnalysisData.length) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>
            No data available. Please go to Name Manager tab and merge names for
            case id {caseId}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
