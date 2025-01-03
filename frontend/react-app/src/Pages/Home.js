import React, { useState,useMemo, useEffect } from "react";
import {  LayoutDashboard, FilePlus2,Files, Import,ChartNoAxesCombined, ReceiptIndianRupee, ReceiptText, IndianRupee } from "lucide-react";
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
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { useParams } from "react-router-dom";

const Dashboard = () => {
  
  const { breadcrumbs, setMainDashboard } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const {defaultTab} = useParams();


  
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
      icon: FilePlus2 ,
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
      items:[
        {
          title: "Payment Voucher",
          url: "#",
          icon: Import,
        },
      ],
      alwaysOpen: false,
    },
    {
      title: "Opportunity to Earn",
      url: "#",
      icon: IndianRupee,
    },
    {
      title: "Billing",
      url: "#",
      icon:ReceiptText
    },
  ];
  useEffect(() => {
      if (!defaultTab || defaultTab==="defaultTab") setActiveTab(navItems[0].title);
      else setActiveTab(defaultTab);
  }, []);

  useEffect(() => {
    setMainDashboard(activeTab,`/${activeTab}`);
  }, [activeTab]);

  // const breadcrumbItems = [
  //   {
  //     label: "Home",
  //     href: "/"
  //   },
  //   {
  //     label: "...",
  //     dropdown: [
  //       { label: "Documentation", href: "/docs" },
  //       { label: "Themes", href: "/themes" },
  //       { label: "GitHub", href: "/github" }
  //     ]
  //   },
  //   {
  //     label: "Components",
  //     href: "/docs/components"
  //   },
  //   {
  //     label: "Breadcrumb",
  //     isCurrentPage: true
  //   }
  // ];

  return (
    <>
      <div className={cn("h-full w-full flex h-screen bg-background")}>
        <Sidebar
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <ScrollArea className="w-full">
          <BreadcrumbDynamic items={breadcrumbs} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1">
              {activeTab === "Dashboard" && <MainDashboard />}
              {activeTab === "Generate Report" && <ReportGenerator />}
              {activeTab === "Opportunity to Earn" && <Eligibility />}
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
