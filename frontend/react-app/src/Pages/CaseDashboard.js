import React, { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";
import Sidebar from "../components/Sidebar";
import AccountNumNameManager from "../components/CaseDashboardComponents/AccountNumNameManager";
import IndividualTable from "../components/CaseDashboardComponents/IndividualTable";
import CombinedTable from "../components/CaseDashboardComponents/CombinedTable";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { BreadcrumbDynamic } from "../components/BreadCrumb";
import { ClipboardPlus, UserPen,Merge,Waypoints,TableProperties,Cable,ArrowRightLeft,ArrowDownUp,Banknote} from "lucide-react";
import EntityDistribution from "../components/CaseDashboardComponents/EntityDistribution";
import NetworkGraph from "../components/CaseDashboardComponents/NetworkGraph";
import LinkAnalysis from "../components/CaseDashboardComponents/LinkAnalysis";
import BiDirectionalAnalysis from "../components/CaseDashboardComponents/BiDirectionalAnalysis";
import FIFOLIFO from "../components/CaseDashboardComponents/FIFOLIFO";
import FundTracking from "../components/CaseDashboardComponents/FundTracking";
import NameManager from "../components/CaseDashboardComponents/NameManager";

// Dummy data structure matching the expected format
const dummyResult = {
  cummalative_df: {
    bidirectional_analysis: [
      {
        "Entity One": "MR AIYAZANWARQURESHI",
        "Entity Two": "POOJAN VIG",
        "Total Credit Transactions": "43",
        "Total Debit Transactions": "38",
        "Total Credit Amount": "144,211.00",
        "Total Debit Amount": "133,601.00",
        "Net Exchange (Credit - Debit)": "10,610.00",
      },
      {
        "Entity One": "POOJAN VIG",
        "Entity Two": "POOJAN VIG",
        "Total Credit Transactions": "4",
        "Total Debit Transactions": "3",
        "Total Credit Amount": "20,791.00",
        "Total Debit Amount": "19,088.00",
        "Net Exchange (Credit - Debit)": "1,703.00",
      },
      {
        "Entity One": "POOJAN VIG",
        "Entity Two": "aartisunilhinduja",
        "Total Credit Transactions": "2",
        "Total Debit Transactions": "0",
        "Total Credit Amount": "686.00",
        "Total Debit Amount": "0.00",
        "Net Exchange (Credit - Debit)": "686.00",
      },
      {
        "Entity One": "MR AIYAZANWARQURESHI",
        "Entity Two": "MR AIYAZANWARQURESHI",
        "Total Credit Transactions": "52",
        "Total Debit Transactions": "40",
        "Total Credit Amount": "149,624.00",
        "Total Debit Amount": "146,283.00",
        "Net Exchange (Credit - Debit)": "3,341.00",
      },
    ],
    entity_df: [
      { Entity: "MR AIYAZANWARQURESHI" },
      { Entity: "POOJAN VIG" },
      { Entity: "aartisunilhinduja" },
    ],
  },
};

const dummyData = {
  "Utilization of Credit (10000) received by Gamma from Alpha on 2024-04-03": {
    LIFO: {
      data: [
        {
          "Value Date": "2024-04-01",
          Name: "Alpha",
          Description: "Opening Balance",
          Debit: 0,
          Credit: 0,
          Entity: "Alpha",
        },
      ],
    },
    FIFO: {
      data: [
        {
          "Value Date": "2024-04-03",
          Name: "Gamma",
          Description: "Credit from Alpha",
          Debit: 0,
          Credit: 10000,
          Entity: "Alpha",
          "Utilized Credit": 0,
          "Remaining Credit": 10000,
        },
        {
          "Value Date": "2024-04-04",
          Name: "Gamma",
          Description: "Transfer to Beta",
          Debit: 2000,
          Credit: 0,
          Entity: "Beta",
          "Utilized Credit": 2000,
          "Remaining Credit": 8000,
        },
        {
          "Value Date": "2024-04-05",
          Name: "Gamma",
          Description: "Payment to Vendor",
          Debit: 1500,
          Credit: 0,
          Entity: "TechCorp",
          "Utilized Credit": 3500,
          "Remaining Credit": 6500,
        },
      ],
    },
  },
  "Utilization of Credit (5000) received by Beta from Delta on 2024-04-02": {
    LIFO: {
      data: [
        {
          "Value Date": "2024-04-02",
          Name: "Delta",
          Description: "Initial Credit",
          Debit: 0,
          Credit: 5000,
          Entity: "Delta",
        },
      ],
    },
    FIFO: {
      data: [
        {
          "Value Date": "2024-04-02",
          Name: "Beta",
          Description: "Credit from Delta",
          Debit: 0,
          Credit: 5000,
          Entity: "Delta",
          "Utilized Credit": 0,
          "Remaining Credit": 5000,
        },
        {
          "Value Date": "2024-04-03",
          Name: "Beta",
          Description: "Payment to Supplier",
          Debit: 3000,
          Credit: 0,
          Entity: "SupplyInc",
          "Utilized Credit": 3000,
          "Remaining Credit": 2000,
        },
        {
          "Value Date": "2024-04-04",
          Name: "Beta",
          Description: "Transfer to Alpha",
          Debit: 1000,
          Credit: 0,
          Entity: "Alpha",
          "Utilized Credit": 4000,
          "Remaining Credit": 1000,
        },
      ],
    },
  },
  "Utilization of Credit (8000) received by Alpha from TechCorp on 2024-04-05":
    {
      LIFO: {
        data: [
          {
            "Value Date": "2024-04-05",
            Name: "TechCorp",
            Description: "Credit Extension",
            Debit: 0,
            Credit: 8000,
            Entity: "TechCorp",
          },
        ],
      },
      FIFO: {
        data: [
          {
            "Value Date": "2024-04-05",
            Name: "Alpha",
            Description: "Credit from TechCorp",
            Debit: 0,
            Credit: 8000,
            Entity: "TechCorp",
            "Utilized Credit": 0,
            "Remaining Credit": 8000,
          },
          {
            "Value Date": "2024-04-06",
            Name: "Alpha",
            Description: "Transfer to Beta",
            Debit: 4000,
            Credit: 0,
            Entity: "Beta",
            "Utilized Credit": 4000,
            "Remaining Credit": 4000,
          },
          {
            "Value Date": "2024-04-07",
            Name: "Alpha",
            Description: "Payment to Delta",
            Debit: 2000,
            Credit: 0,
            Entity: "Delta",
            "Utilized Credit": 6000,
            "Remaining Credit": 2000,
          },
        ],
      },
    },
};

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
      icon: UserPen,
      isActive: true,
    },
    {
      title: "Reports",
      url: "#",
      icon: ClipboardPlus,
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
    {
      title: "Name Manager",
      url: "#",
      icon: Merge,
      isActive: true,
    },
    {
      title: "Network Graph",
      url: "#",
      icon: Waypoints,
    },
    {
      title: "Entity Distribution",
      url: "#",
      icon: TableProperties,
    },
    
    {
      title: "Link Analysis",
      url: "#",
      icon: Cable,
    },
    {
      title: "Bi-Directional Analysis",
      url: "#",
      icon: ArrowRightLeft,
    },
    {
      title: "FIFO LIFO",
      url: "#",
      icon: ArrowDownUp,
    },
    {
      title: "Fund Tracking",
      url: "#",
      icon: Banknote,
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
              {activeTab === "Entity Distribution" && <EntityDistribution />}
              {activeTab === "Network Graph" && <NetworkGraph />}
              {activeTab === "Link Analysis" && <LinkAnalysis />}
              {activeTab === "Bi-Directional Analysis" && (
                <BiDirectionalAnalysis />
              )}
              {activeTab === "FIFO LIFO" && <FIFOLIFO />}
              {activeTab === "Fund Tracking" && <FundTracking />}
              {activeTab === "Name Manager" && <NameManager
              caseId="123"
              initialGroups={[['John', 'Jon'], ['Elizabeth', 'Beth']]}
              onRefreshDashboard={(source) => {
                console.log('Refresh dashboard from', source);
              }}
              />}
            </main>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default CaseDashboard;
