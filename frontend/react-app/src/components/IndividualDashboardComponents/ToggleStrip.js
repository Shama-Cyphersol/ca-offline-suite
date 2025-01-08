import React from "react";

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
    <div className="relative flex items-center gap-2 p-3 pt-1 bg-gray-100 dark:bg-gray-800 rounded-md shadow">
      <div className="absolute top-0 left-0 h-full w-full bg-gray-50 dark:bg-gray-900 rounded-md"></div>
      <div className="flex gap-4 z-10 overflow-x-auto">
        <button
          onClick={toggleSelectAll}
          className="text-sm font-medium text-gray-600 dark:text-black"
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </button>
        {columns.map((column) => (
          <div
            key={column}
            className={`relative px-4 py-2 text-sm font-medium cursor-pointer transition-transform duration-300 ${
              selectedColumns.includes(column)
                ? "text-gray-600 dark:text-400 font-semibold"
                : "text-gray-600 dark:text-black"
            }`}
            onClick={() => toggleColumn(column)}
          >
            {column}
            {selectedColumns.includes(column) && (
              <div
                className="absolute bottom-0 left-0 w-full h-1 bg-slate-600 rounded-full transition-all duration-300"
                style={{
                  transform: "scaleX(1)",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToggleStrip;
