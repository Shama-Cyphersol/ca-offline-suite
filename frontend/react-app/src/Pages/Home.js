import React, { useState } from "react";
import { LayoutDashboard, Files } from "lucide-react";
import ReportGenerator from "../components/MainDashboardComponents/GenerateReport";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";

import Sidebar from '../components/Sidebar';
import MainDashboard from '../components/MainDashboardComponents/MainDashboard';
import Eligibility from "../components/MainDashboardComponents/Eligibility";
import Billing from "../components/MainDashboardComponents/Billing";
import { Toaster } from "../components/ui/toaster";
import Analytics from '../components/MainDashboardComponents/Analytics';
import {BreadcrumbDynamic}  from '../components/BreadCrumb';

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("Dashboard");

  // const navItems = [
  //   // { name: 'Dashboard', icon: LayoutDashboard, id: 'Dashboard' },
  //   // { name: 'Generate Report', icon: Files, id: 'report' }
  //   {text: 'Dashboard', icon: LayoutDashboard},
  //   {text: 'Generate Report', icon: Files}
  // ];

  const navItems = [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Generate Report",
      url: "#",
      icon: Files,
    },
    {
      title: "Analytics",
      url: "#",
      icon: Files,
    },
    {
      title: "Import to Tally",
      url: "#",
      icon: Files,
    },
    {
      title: "Eligibility",
      url: "#",
      icon: Files,
    },
    {
      title: "Billing",
      url: "#",
      icon: Files,
    },
  ]


  const handleOnNavigate = (selectedNav) => {
    console.log("Navigating to:", selectedNav);
    setActiveTab(selectedNav);
  };

  return (
    <>

      <div className={cn("h-full w-full flex h-screen bg-background")}>
        <Sidebar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
        <ScrollArea className="w-full">
        <BreadcrumbDynamic/>
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1">
              {activeTab === 'Dashboard' && <MainDashboard />}
              {activeTab === 'Generate Report' && <ReportGenerator />}
              {activeTab === 'Eligibility' && <Eligibility />}
              {activeTab === 'Billing' && <Billing />}
              {activeTab === 'Analytics' && <Analytics />}
              

            </main>
          </div>
        </ScrollArea>
        <Toaster />
      </div>
    </>
  );
};

export default Dashboard;
