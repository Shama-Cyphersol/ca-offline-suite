import React from 'react'
import Sidebar from '../components/Sidebar'
import { Link ,useParams,useNavigate} from 'react-router-dom';
import AccountNumNameManager from '../components/CaseDashboard/AccountNumNameManager';
import IndividualTable from '../components/CaseDashboard/IndividualTable';
import {MoveLeft} from 'lucide-react';

const loadCaseData = (caseid) => {
  const data = require('../data/cases.json');
  const caseData = data.find(item => item.case_id === caseid);
  return caseData;
};  


const CaseDashboard = () => {
    const [activePage, setActivePage] = React.useState(0);
    // extract case id from the url
    // const caseId = window.location.pathname.split("/")[2];
    const caseId = useParams().caseId;
    const caseData = loadCaseData(caseId);
    const navigate = useNavigate();
    
    const navItems = [
        // { text: 'Name Manager', icon: null },
        { text: 'Acc No and Acc Name', icon: null ,title:"Account Number and Account Name Manager"},
        // { text: 'Network Graph', icon: null },
        // { text: 'Entities Distribution', icon:null },
        { text: 'Individual Table', icon: null , title:"Individual Table"},
        // { text: 'Link Analysis', icon: null },
        // { text: 'Bi Directional Analysis', icon: null },
        // { text: 'FIFO LIFO Analysis', icon: null },
        // { text: 'Fund Tracking Analysis', icon: null },
    ];

    const handleOnNavigate = (index) => {
      console.log('Navigating to:', index);
      setActivePage(index);
    }

  return (
    <div className='h-full flex bg-gray-50'>
       <div className='h-full bg-gray-200'>
        <Sidebar onNavigate={handleOnNavigate} navItems={navItems} source={"case-dashboard"} caseId={caseId}/>
      </div>
      <div className='h-full w-full max-h-full overflow-y-auto'>
        {/* create a header which will contain the title and back button */}
        {/* <div className='flex justify-between items-center py-5 shadow-[10px_5px_14px_rgba(149,157,165,0.2)]'>
          <h1 className='text-xl font-bold text-center w-full opacity-80'>{navItems[activePage].title}</h1>
        <Link to={-1}><button className='bg-[#99C3Eb] hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mr-5 flex gap-x-3 items-center'>
          <MoveLeft size={24}/> Back</button>
        </Link>
        </div> */}

         <header className="bg-white border-b border-gray-200">
                  <div className="mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => navigate(-1)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Back"
                        >
                          <MoveLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className='py-2'>
                          <h1 className="text-xl font-semibold text-gray-900">
                            {navItems[activePage].text}
                          </h1>
                          <div className="flex space-x-4 mt-1">
                            {/* <p className="text-sm text-gray-600">Name: {name}</p>
                            <p className="text-sm text-gray-600">Account: {accountNumber}</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {activePage === 0 && <AccountNumNameManager caseData={caseData}/>}
            {activePage === 1 && <IndividualTable caseId={caseId} caseData={caseData}/>}
            </div>
       </div>
       </main>
   </div>
 </div>
  )
}

export default CaseDashboard