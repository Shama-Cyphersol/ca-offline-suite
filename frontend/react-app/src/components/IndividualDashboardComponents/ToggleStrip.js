import React from "react";
import {Card} from "../ui/card";

const ToggleStrip = ({ columns, selectedColumns, setSelectedColumns }) => {
  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const toggleSelectAll = () => {
    setSelectedColumns(
      selectedColumns.length === columns.length ? [] : [...columns]
    );
  };

  const isAllSelected = selectedColumns.length === columns.length;

  return (

    <Card>
    <div className="relative flex items-center gap-2 p-3 pt-2 rounded-md">
      <div className="absolute top-0 left-0 h-full w-full rounded-md"></div>
      <div className="flex gap-4 z-10 overflow-x-auto">
        <button
          onClick={toggleSelectAll}
          className="text-sm font-medium text-slate-500 dark:text-slate-500"
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </button>
        {columns.map((column) => (
          <div
            key={column}
            className={`relative px-4 py-2 text-sm font-medium cursor-pointer transition-transform duration-300 ${
              selectedColumns.includes(column)
                ? "text-slate-900 dark:text-slate-300 font-semibold"
                : "text-slate-500 dark:text-slate-500"
            }`}
            onClick={() => toggleColumn(column)}
          >
            {column}
            {selectedColumns.includes(column) && (
              <div
                className="absolute bottom-0 left-0 w-full h-1 bg-slate-900 dark:bg-slate-300 rounded-full transition-all duration-300"
                style={{
                  transform: "scaleX(1)",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
    </Card>
  );
};

export default ToggleStrip;
