import React, { useState } from 'react';
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area"
import Sidebar from '../components/Sidebar';
import AccountNumNameManager from '../components/CaseDashboardComponents/AccountNumNameManager';
import IndividualTable from '../components/CaseDashboardComponents/IndividualTable';
import { useNavigate } from 'react-router-dom';
import {MoveLeft} from 'lucide-react';

const CaseDashboard = () => {
    const [activeTab, setActiveTab] = useState('Acc No and Acc Name');

  const navigate = useNavigate();
  const navItems = [
    {
      title: "Acc No and Acc Name",
      url: "#",
      icon: null,
      isActive: true,
    },
    {
      title: "Individual Table",
      url: "#",
      icon: null,
    },
  ];

  const handleView = () => {
    console.log('View case:' );
    navigate(`/individual-dashboard/${1}/${1}`);
    console.log('2');
    console.log(3);
  };

  return (
    <>
      <div className={cn("w-full flex h-screen bg-background")}>
        <Sidebar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab}/>
        <ScrollArea className="w-full">
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1">
            <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back"
            >
                <MoveLeft className="w-5 h-5 text-gray-600" />
            </button>
            {/* <p onClick={handleView}>Hi</p> */}
              {activeTab === 'Acc No and Acc Name' && <AccountNumNameManager />} 
              {activeTab === 'Individual Table' && <IndividualTable />}
            </main>
          </div>
        </ScrollArea>

      </div>
    </>
  );
};

export default CaseDashboard;