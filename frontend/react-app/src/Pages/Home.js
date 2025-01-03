import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  FilePlus2,
  Files,
  Import,
  ChartNoAxesCombined,
  ReceiptIndianRupee,
} from "lucide-react";
import ReportGenerator from "../components/MainDashboardComponents/GenerateReport";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";

import Sidebar from "../components/Sidebar";
import MainDashboard from "../components/MainDashboardComponents/MainDashboard";
import Eligibility from "../components/MainDashboardComponents/Eligibility";
import Billing from "../components/MainDashboardComponents/Billing";
import { Toaster } from "../components/ui/toaster";
import Analytics from "../components/MainDashboardComponents/Analytics";
import { BreadcrumbDynamic } from "../components/BreadCrumb";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { breadcrumbs, setMainDashboard } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { defaultTab } = useParams();

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
      icon: FilePlus2,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Import to Tally",
      url: "#",
      icon: Import,
    },
    {
      title: "Eligibility",
      url: "#",
      icon: Files,
    },
    {
      title: "Billing",
      url: "#",
      icon: ReceiptIndianRupee,
    },
  ];

  useEffect(() => {
    if (!defaultTab || defaultTab === "defaultTab")
      setActiveTab(navItems[0].title);
    else setActiveTab(defaultTab);
  }, []);

  useEffect(() => {
    setMainDashboard(activeTab, `/${activeTab}`);
  }, [activeTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const scrollableNode = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollableNode) {
      scrollableNode.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className={cn("h-full w-full flex h-screen bg-background")}>
        <Sidebar
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={handleTabChange} // Changed from setActiveTab to handleTabChange
        />
        <ScrollArea className="w-full">
          <BreadcrumbDynamic items={breadcrumbs} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1">
              {activeTab === "Dashboard" && <MainDashboard />}
              {activeTab === "Generate Report" && <ReportGenerator />}
              {activeTab === "Eligibility" && <Eligibility />}
              {activeTab === "Billing" && <Billing />}
              {activeTab === "Analytics" && <Analytics />}
            </main>
          </div>
        </ScrollArea>
        <Toaster />
      </div>
    </>
  );
};

export default Dashboard;
