import React, { useState } from 'react';
import { Info, Trash2, Plus, Eye, Search } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Outlet, Link } from "react-router-dom";

// const generateAccountNumber = () => {
//   return Math.floor(Math.random() * 9000000000) + 1000000000;
// };

//   // Generate sample data
// const generateDummyData = () => {
//     const cases = [];
//     const startDate = new Date('2024-01-01');
//     const banks = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Union Bank'];

    
//     for (let i = 0; i < 25; i++) {
//       const date = new Date(startDate);
//       date.setDate(startDate.getDate() + i);
      
//       const caseId = `CASE${String(i + 1).padStart(4, '0')}`;
//       const bank = banks[Math.floor(Math.random() * banks.length)];
      
//       cases.push({
//         date: date.toLocaleDateString('en-GB'),
//         case_id: caseId,
//         report_name: `${bank} Bank Statement Analysis`,
//         already_existing_pdfs: [
//           {
//             pdf_path: `/documents/statements/${bank.toLowerCase()}_${generateAccountNumber()}.pdf`,
//             case_ids: [caseId, `CASE${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`]
//           },
//           {
//             pdf_path: `/documents/statements/${bank.toLowerCase()}_${generateAccountNumber()}.pdf`,
//             case_ids: [caseId]
//           }
//         ],
//         pdf_paths_not_extracted: Math.random() > 0.7 ? [
//           `/failed/corrupt_statement_${Math.random().toString(36).substring(7)}.pdf`,
//           `/failed/unreadable_${Math.random().toString(36).substring(7)}.pdf`
//         ] : []
//       });
//     }
    
//     return cases;
//   };
  
const loadRecentReports = () => {
  const data = require('../data/cases.json');
  return data;
};

const RecentReports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState(loadRecentReports());
  const [showDialog, setShowDialog] = useState(false);
  const [currentDialogData, setCurrentDialogData] = useState(null);
  const [dialogView, setDialogView] = useState('existing');
  const [isLoading, setIsLoading] = useState(false);

  const rowsPerPage = 10;

  const filteredData = tableData.filter(report => 
    report.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.report_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleCaseClick = (caseId) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
    console.log('Case clicked:', caseId);
  };

  const handleView = (caseId) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
    console.log('View case:', caseId);
  };

  const handleUploadPdf = (caseId) => {
    console.log('Upload PDF for case:', caseId);
  };

  const handleDelete = (caseId) => {
    console.log('Delete case:', caseId);
  };

  const handleShowInfo = (data) => {
    setCurrentDialogData(data);
    setDialogView('existing');
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen  p-2">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8 flex-col gap-5 md:gap-0 md:flex-row">
          <h1 className="text-2xl font-semibold text-gray-900 ">Recent Reports</h1>
          {/* Search Input - Matching previous component style */}
          <div className="relative w-[400px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white border-2 border-[#3498db] rounded-xl focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-blue-100 text-gray-800 transition-all"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#3498db]" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#3498db] text-md">
                <th className="px-6 py-4 text-left font-medium text-white">Sr no.</th>
                <th className="px-6 py-4 text-left font-medium text-white">Date</th>
                <th className="px-6 py-4 text-left font-medium text-white">Case ID</th>
                <th className="px-6 py-4 text-left font-medium text-white">Report Name</th>
                <th className="px-6 py-4 text-center font-medium text-white">Actions</th>
                <th className="px-6 py-4 text-center font-medium text-white">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No Cases found
                  </td>
                </tr>
              ) : (
                paginatedData.map((report, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors text-md">
                    <td className="px-6 py-4 text-gray-500 text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{report.date}</td>
                    <td className="px-6 py-4">
                      <Link to={"/case-dashboard/"+report.case_id}
                        className="text-[#3498db] hover:text-[#2980b9] font-medium">
                        {report.case_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4  text-gray-900">{report.report_name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link to={"/case-dashboard/"+report.case_id}>
                          <button
                            onClick={() => handleView(report.case_id)}
                            className="p-2 bg-[#99C3EC] text-white rounded-lg hover:bg-[#3498db] transition-colors"
                            title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleUploadPdf(report.case_id)}
                          className="p-2 bg-[#97E3C2] text-white rounded-lg hover:bg-green-500 transition-colors"
                          title="Upload PDF">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.case_id)}
                          className="p-2 bg-[#F69C9E] text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleShowInfo(report)}
                        className="p-2 text-[#3498db] hover:text-[#2980b9] transition-colors"
                        title="Information">
                        <Info className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination - Matching previous component style */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-500">
              {filteredData.length > 0 ? `Page ${currentPage} of ${totalPages}` : ''}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || filteredData.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors "
            >
              Next
            </button>
          </div>
        </div>

        {/* Info Dialog */}
        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[11]">
            <div className="bg-white rounded-2xl w-3/4 max-h-[80vh] shadow-xl">
              <div className="bg-[#3498db] text-white px-6 py-4 rounded-t-2xl">
                <h3 className="text-lg font-medium">Case Information</h3>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {dialogView === 'existing' ? (
                  currentDialogData.already_existing_pdfs?.length > 0 ? (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900">Already Existing Statements</h2>
                      {currentDialogData.already_existing_pdfs.map((pdf, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm font-medium text-gray-900">Statement Path: {pdf.pdf_path}</p>
                          <p className="text-sm text-gray-600">Case Ids: {pdf.case_ids.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No Already Existing Statements found for this case.</p>
                  )
                ) : (
                  currentDialogData.pdf_paths_not_extracted?.length > 0 ? (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900">Statements Not Processed Due to Some Exception</h2>
                      {currentDialogData.pdf_paths_not_extracted.map((pdf, index) => (
                        <p key={index} className="text-sm text-gray-600">{pdf}</p>
                      ))}
                    </div>
                  ) : (
                    <h2 className="text-md text-gray-900">No Statements had any error</h2>
                  )
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDialogView('existing')}
                    disabled={dialogView === 'existing'}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setDialogView('not_extracted')}
                    disabled={dialogView === 'not_extracted'}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setShowDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center">
            <div className="p-4">
              <Loader2 className="animate-spin h-8 w-8 text-[#3498db]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentReports;