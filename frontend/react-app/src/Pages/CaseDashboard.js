import React, { useState } from "react";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";
import Sidebar from "../components/Sidebar";
import AccountNumNameManager from "../components/CaseDashboardComponents/AccountNumNameManager";
import IndividualTable from "../components/CaseDashboardComponents/IndividualTable";
import CombinedTable from "../components/CaseDashboardComponents/CombinedTable";
import { useNavigate } from "react-router-dom";
// import { UserPen } from "lucide-react";

const CaseDashboard = () => {
  const [activeTab, setActiveTab] = useState("Acc No and Acc Name");

  const navigate = useNavigate();
  const navItems = [
    {
      title: "Acc No and Acc Name",
      url: "#",
      icon: null ,
      isActive: true,
    },
    {
      title: "Reports",
      url: "#",
      icon: null,
      items: [
        {
          title: "Individual Table",
          url: "#",
          icon: null,
        },
        {
          title: "Combined Table",
          url: "#",
          icon: null,
        },
      ],
      alwaysOpen: true, // Ensures the section remains open
    },
  ];

  return (
    <>
      <div className={cn("w-full flex h-screen bg-background")}>
        <Sidebar
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <ScrollArea className="w-full">
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1">
              {activeTab === "Acc No and Acc Name" && <AccountNumNameManager />}
              {activeTab === "Individual Table" && <IndividualTable />}
              {activeTab === "Combined Table" && <CombinedTable />}
            </main>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default CaseDashboard;
