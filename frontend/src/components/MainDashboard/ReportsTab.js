import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText } from 'lucide-react';

const ReportsTable = () => {
  const [view, setView] = useState('reports'); // 'reports' or 'individuals'
  const [selectedCase, setSelectedCase] = useState(null);
  const [reports, setReports] = useState([
    // Sample data - replace with your actual data fetching logic
    { date: '2024-03-20', case_id: 'ATS_Unit_1_00009', report_name: 'Bank Statement Analysis' },
    { date: '2024-03-19', case_id: 'ATS_Unit_2_00010', report_name: 'Financial Report' },
  ]);

  const [individuals, setIndividuals] = useState([
    // Sample data - replace with your actual data fetching logic
    { name: 'John Doe', acc_number: '1234567890' },
    { name: 'Jane Smith', acc_number: '0987654321' },
  ]);

  const handleViewDetails = (caseId) => {
    setSelectedCase(caseId);
    setView('individuals');
  };

  const handleGoBack = () => {
    setSelectedCase(null);
    setView('reports');
  };

  const handleDownloadReport = async (name, accNumber) => {
    try {
      // Implement your download logic here
      console.log(`Downloading report for ${name} with account ${accNumber}`);
      alert(`Report downloaded for ${name}`);
    } catch (error) {
      alert(`Failed to download report: ${error.message}`);
    }
  };

  const handleDownloadAllInOne = async (caseId) => {
    try {
      // Implement your download logic here
      console.log(`Downloading all-in-one report for case ${caseId}`);
      alert(`All-in-one report downloaded for case ${caseId}`);
    } catch (error) {
      alert(`Failed to download report: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen ">
      <div className="mx-auto">
        <div className="bg-white rounded-2xl pd-2 lg:p-5 backdrop-blur-sm">
          {view === 'reports' ? (
            <>
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Select a Case to download reports
              </h1>
              <div className="overflow-hidden shadow-sm rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full ">
                  <thead>
                    <tr className="bg-[#3498db]">
                      <th className="px-6 py-4 text-sm font-semibold text-white">Sr No.</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Date</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Case ID</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Report Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report, index) => (
                      <tr 
                        key={report.case_id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{report.date}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{report.case_id}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{report.report_name}</td>
                        <td className="px-6 py-4 text-sm text-center">
                          <button
                            onClick={() => handleDownloadAllInOne(report.case_id)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] transition-colors gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Individuals in Case {selectedCase}
                </h2>
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] transition-colors gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#3498db]">
                      <th className="px-6 py-4 text-sm font-semibold text-white">Sr No.</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Individual Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Account Number</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {individuals.map((individual, index) => (
                      <tr 
                        key={individual.acc_number}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{individual.name}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">{individual.acc_number}</td>
                        <td className="px-6 py-4 text-sm text-center">
                          <button
                            onClick={() => handleDownloadReport(individual.name, individual.acc_number)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] transition-colors gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTable;