import React, { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";
import Sidebar from "../components/Sidebar";
import AccountNumNameManager from "../components/CaseDashboardComponents/AccountNumNameManager";
import IndividualTable from "../components/CaseDashboardComponents/IndividualTable";
import CombinedTable from "../components/CaseDashboardComponents/CombinedTable";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import {BreadcrumbDynamic}  from '../components/BreadCrumb';
import { ClipboardPlus, UserPen } from "lucide-react";

const CaseDashboard = () => {
  const { breadcrumbs, setCaseDashboard } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState("Acc No and Acc Name");
  const navigate = useNavigate();
  const { caseId, defaultTab } = useParams();

  useEffect(() => {
    setCaseDashboard(activeTab, `/case-dashboard/${caseId}/${activeTab}`);
  }, [activeTab]);

  const navItems = [
    {
      title: "Acc No and Acc Name",
      url: "#",
      icon: UserPen  ,
      isActive: true,
    },
    {
      title: "Reports",
      url: "#",
      icon: ClipboardPlus ,
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
      alwaysOpen: true,
    },
  ];

  useEffect(() => {
    if (defaultTab === "defaultTab") setActiveTab(navItems[0].title);
    else setActiveTab(defaultTab);
  }, []);

  const handleTabChange = (newTab) => {
    // Reset scroll position when tab changes
    setActiveTab(newTab);
    const scrollableNode = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollableNode) {
      // smooth scroll to top
      scrollableNode.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleView = () => {
    navigate(`/individual-dashboard/${1}/${1}`);
  };

  return (
    <>
      <div className={cn("w-full flex h-screen bg-background")}>
        <Sidebar
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={handleTabChange} // Use handleTabChange instead of setActiveTab
        />
        <ScrollArea className="w-full">
          <BreadcrumbDynamic items={breadcrumbs} />
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
