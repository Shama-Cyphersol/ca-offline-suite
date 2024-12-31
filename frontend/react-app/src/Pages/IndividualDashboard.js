import React, { useState } from "react";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";
import Sidebar from "../components/Sidebar";
import AccountNumNameManager from "../components/CaseDashboardComponents/AccountNumNameManager";
import IndividualTable from "../components/CaseDashboardComponents/IndividualTable";
import Summary from "../components/IndividualDashboardComponents/Summary";
import Transactions from "../components/IndividualDashboardComponents/Transactions";
import Cash from "../components/IndividualDashboardComponents/Cash";
import Suspense from "../components/IndividualDashboardComponents/Suspense";

const IndividualDashboard = () => {
  const [activeTab, setActiveTab] = useState("Acc No and Acc Name");

  const navItems = [
    {
      title: "Summary",
      url: "#",
      icon: null,
      isActive: true,
    },
    {
      title: "Transactions",
      url: "#",
      icon: null,
    },
    {
      title: "EOD",
      url: "#",
      icon: null,
    },
    {
      title: "Suspense",
      url: "#",
      icon: null,
    },
    {
      title: "Cash",
      url: "#",
      icon: null,
    },
    {
      title: "Debitors",
      url: "#",
      icon: null,
    },
    {
      title: "Creditors",
      url: "#",
      icon: null,
    },
    {
      title: "EMI",
      url: "#",
      icon: null,
    },
    {
      title: "Investments",
      url: "#",
      icon: null,
    },
  ];
  console.log("IndividualDashboard");

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
              {activeTab === "Summary" && <Summary />}
              {activeTab === "Transactions" && <Transactions />}
              {activeTab === "Cash" && <Cash />}
              {activeTab === "Suspense" && <Suspense />}
            </main>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default IndividualDashboard;
