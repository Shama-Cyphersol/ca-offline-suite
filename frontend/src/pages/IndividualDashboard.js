import React from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useLocation,useNavigate} from 'react-router-dom';
import Summary from '../components/IndividualDashboard/Summary';
import Transactions from '../components/IndividualDashboard/Transactions';
import EodBalance from '../components/IndividualDashboard/EodBalance';
import Creditors from '../components/IndividualDashboard/Creditors';
import Debtors from '../components/IndividualDashboard/Debtors';
import CashWithdrawal from '../components/IndividualDashboard/CashWithdrawal';
import CashDeposit from '../components/IndividualDashboard/CashDeposit';
import UnkownDebit from '../components/IndividualDashboard/UnkownDebit';
import UnkownCredit from '../components/IndividualDashboard/UnkownCredit';
import Reversal from '../components/IndividualDashboard/Reversal';
import Investment from '../components/IndividualDashboard/Investment';
import EMI from '../components/IndividualDashboard/EMI';
// import ForeignTransactions from '../components/IndividualDashboard/ForeignTransactions';
import {MoveLeft} from 'lucide-react';

const IndividualDashboard = () => {
  const [activePage, setActivePage] = React.useState(0);
  const {state} = useLocation();
  // exxtract caseId and individualId from the URL
  const { caseId, individualId } = useParams()
  const {name, accountNumber} = state;
  const navigate = useNavigate();
  console.log('IndividualDashboard:', caseId, individualId, name, accountNumber);
  
  const navItems = [
    { text: 'Summary', icon: null},
    { text: 'Transactions', icon: null},
    { text: 'EOD Balance', icon: null},
    { text: 'Creditors', icon: null},
    { text: 'Debtors', icon: null},
    { text: 'Cash Withdrawal', icon: null},
    { text: 'Cash Deposit', icon: null},
    { text: 'Unkown Debit', icon: null},
    { text: 'Unkown Credit', icon: null},
    { text: 'Reversal', icon: null},
    { text: 'Investment', icon: null},
    { text: 'EMI', icon: null},
    // { text: 'Foreign Transactions', icon: null},
];

  const handleOnNavigate = (index) => {
    console.log('Navigating to:', index);
    setActivePage(index);
  }

  return (
    <div className='h-full flex bg-gray-50'>
    <div className='h-full bg-gray-200'>
     <Sidebar onNavigate={handleOnNavigate} navItems={navItems} source={"individual-dashboard"} name={name}/>
   </div>
   <div className='h-full w-full max-h-full overflow-y-auto'>
     {/* create a header which will contain the title and back button */}
     {/* <div className='flex justify-between items-center py-5 shadow-[10px_5px_14px_rgba(149,157,165,0.2)]'> */}
       {/* <h1 className='text-xl font-bold text-center w-full opacity-80'>{navItems[activePage].text}</h1>
        <Link to={-1}><button className='bg-[#99C3Eb] hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mr-5 flex gap-x-2 items-center'>
          <MoveLeft size={24}/>Back</button>
        </Link> */}
     {/* </div> */}
     <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
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
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {activePage === 0 && <Summary/>}
          {activePage === 1 && <Transactions/>}
          {activePage === 2 && <EodBalance/>}
          {activePage === 3 && <Creditors/>}
          {activePage === 4 && <Debtors/>}
          {activePage === 5 && <CashWithdrawal/>}
          {activePage === 6 && <CashDeposit/>}
          {activePage === 7 && <UnkownDebit/>}
          {activePage === 8 && <UnkownCredit/>}
          {activePage === 9 && <Reversal/>}
          {activePage === 10 && <Investment/>}
          {activePage === 11 && <EMI/>}
          {/* {activePage === 12 && <ForeignTransactions/>} */}
       </div>
       </div>
       </main>
   </div>
 </div>
  )
}

export default IndividualDashboard