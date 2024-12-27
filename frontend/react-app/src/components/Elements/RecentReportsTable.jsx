import React from "react";
import { Info } from 'lucide-react';
import { Input } from "../ui/input";

const RecentReportsTable = ({ 
  reports = [], 
  onAdd, 
  onDelete 
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Reports</h2>
      <div className="mb-4">
        <Input placeholder="Search..." className="max-w-sm" />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#3498db] text-white">
            <tr>
              <th className="px-6 py-3 text-left">Sr no.</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Case ID</th>
              <th className="px-6 py-3 text-left">Report Name</th>
              <th className="px-6 py-3 text-center">Actions</th>
              <th className="px-6 py-3 text-center">Info</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={report.id} className="border-b">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{report.date}</td>
                <td className="px-6 py-4 text-[#3498db]">{report.caseId}</td>
                <td className="px-6 py-4">{report.name || report.reportName}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    className="bg-[#3498db] text-white px-3 py-1 rounded mr-2"
                    onClick={() => onAdd && onAdd(report.id)}
                  >
                    Add
                  </button>
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => onDelete && onDelete(report.id)}
                  >
                    Delete
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <Info className="h-5 w-5 text-[#3498db] mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
          <button className="px-3 py-1 bg-gray-200 rounded" disabled>Previous</button>
          <span>Page 1 of 1</span>
          <button className="px-3 py-1 bg-gray-200 rounded" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default RecentReportsTable;