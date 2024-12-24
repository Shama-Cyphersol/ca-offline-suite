import React, { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
        <div className="mb-6 text-gray-600">{children}</div>
        <div className="flex justify-end space-x-3">
          {actions}
        </div>
      </div>
    </div>
  );
};

const AccountNumNameManager = ({ caseData, onRefresh }) => {
  const [tableData, setTableData] = useState(caseData);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ROWS_PER_PAGE = 10;

  const filteredData = useMemo(() => {
    return tableData.file_names
      .map((path, index) => ({
        path,
        name: tableData.individual_names.Name[index],
        accNumber: tableData.individual_names['Acc Number'][index],
        index
      }))
      .filter(item =>
        item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [tableData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleCellEdit = (rowIndex, field, value) => {
    const newData = { ...tableData };
    if (field === 'name') {
      newData.individual_names.Name[rowIndex] = value;
    } else if (field === 'accNumber') {
      newData.individual_names['Acc Number'][rowIndex] = value;
    }
    setTableData(newData);
  };

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    const formattedData = tableData.file_names.map((path, index) => ({
      srNo: (index + 1).toString(),
      pdfPath: path,
      name: tableData.individual_names.Name[index],
      accNumber: tableData.individual_names['Acc Number'][index]
    }));

    try {
      // handle submit here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setShowSuccessDialog(true);
      if (onRefresh) {
        onRefresh(tableData, "AccountNumberAndNameManager");
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Search Input - Matching Individual Dashboard style */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-white border-2 border-[#3498db] rounded-xl focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-blue-100 text-gray-800 transition-all"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#3498db]" />
          </div>
        </div>
      </div>

      {/* Table - Matching Individual Dashboard style */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full overflow-x-auto">
            <thead>
              <tr className="bg-[#3498db]">
                <th className="w-16 px-6 py-4 text-left text-sm font-medium text-white">No.</th>
                <th className="w-[35%] px-6 py-4 text-left text-sm font-medium text-white">File Location</th>
                <th className="w-[25%] px-6 py-4 text-left text-sm font-medium text-white">Name</th>
                <th className="w-[25%] px-6 py-4 text-left text-sm font-medium text-white">Account Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No matching results found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * ROWS_PER_PAGE + paginatedData.indexOf(item) + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="truncate text-sm text-gray-500" title={item.path}>
                        {item.path}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-blue-100 transition-all"
                        value={item.name}
                        onChange={(e) => handleCellEdit(item.index, 'name', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-blue-100 transition-all"
                        value={item.accNumber}
                        onChange={(e) => handleCellEdit(item.index, 'accNumber', e.target.value)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Matching Individual Dashboard style */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-500">
            {filteredData.length > 0 ? `Page ${currentPage} of ${totalPages}` : ''}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || filteredData.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium text-white bg-[#3498db] rounded-xl hover:bg-[#2980b9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Saving Changes...
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="Confirm Changes"
        actions={
          <>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] transition-colors"
            >
              Confirm
            </button>
          </>
        }
      >
        <p>Are you sure you want to save these changes?</p>
      </Modal>

      <Modal
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Success"
        actions={
          <button
            onClick={() => setShowSuccessDialog(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg hover:bg-[#2980b9] transition-colors"
          >
            OK
          </button>
        }
      >
        <p>Changes have been saved successfully.</p>
      </Modal>
    </div>
  );
};

export default AccountNumNameManager;