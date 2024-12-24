import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Helper function to calculate pagination remains the same
const usePagination = (data, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  };

  return {
    next: () => setCurrentPage(Math.min(currentPage + 1, totalPages)),
    prev: () => setCurrentPage(Math.max(currentPage - 1, 1)),
    currentData: currentData(),
    currentPage,
    totalPages,
  };
};

const IndividualTable = ({ caseData, caseId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ROWS_PER_PAGE = 10;
  const navigate = useNavigate();

  const data = [];
  for (let i = 0; i < caseData.individual_names.Name.length; i++) {
    data.push({
      row_id: i,
      Name: caseData.individual_names.Name[i],
      'Account Number': caseData.individual_names['Acc Number'][i],
      'Pdf Path': caseData.file_names[i]
    });
  }
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filtered = data.filter(item => 
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item['Account Number'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item['Pdf Path'].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  const {
    next,
    prev,
    currentData,
    currentPage,
    totalPages
  } = usePagination(filteredData, ROWS_PER_PAGE);

  const handleRowClick = async (name, accountNumber, rowId) => {
    setIsLoading(true);
    try {
      navigate(`/individual-dashboard/${caseId}/${rowId}`, { state: { name, accountNumber } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-6">
      {/* Search Input - Apple Style with Company Blue */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white border-2 border-[#3498db] rounded-xl focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-blue-100 text-gray-800 transition-all"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table - Apple Style with Company Blue */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto rounded-xl" >
          <table className="w-full ">
            <thead>
              <tr className="bg-[#3498db] ">
                <th className="w-16 px-6 py-4 text-left text-sm font-medium text-white">No.</th>
                <th className="w-[32%] px-6 py-4 text-left text-sm font-medium text-white">Name</th>
                <th className="w-[18%] px-6 py-4 text-left text-sm font-medium text-white">Account Number</th>
                <th className="w-[45%] px-6 py-4 text-left text-sm font-medium text-white">File Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No matching results found
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr
                    key={item.row_id}
                    onClick={() => handleRowClick(item.Name, item['Account Number'], item.row_id)}
                    className="hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {item.Name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item['Account Number']}</td>
                    <td className="px-6 py-4">
                      <div className="truncate text-sm text-gray-500" title={item['Pdf Path']}>
                        {item['Pdf Path']}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Apple Style with Company Blue */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={prev}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-500">
            {filteredData.length > 0 ? `Page ${currentPage} of ${totalPages}` : ''}
          </span>
          
          <button
            onClick={next}
            disabled={currentPage === totalPages || filteredData.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3498db] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2980b9] transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Loading Overlay - Apple Style */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center">
          <div className="p-4">
            <Loader2 className="animate-spin h-8 w-8 text-[#3498db]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualTable;