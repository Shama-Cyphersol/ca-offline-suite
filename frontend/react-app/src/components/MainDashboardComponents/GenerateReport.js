import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Loader2,
  Plus,
  Trash2,
  Download,
  FileText,
  Bell,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import GenerateReportForm from "../Elements/ReportForm";
import RecentReports from "./RecentReports";

export default function GenerateReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState(["Unit 1", "Unit 2", "Unit 3"]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [serialNumber, setSerialNumber] = useState("00001");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recentReports, setRecentReports] = useState([
    {
      id: 1,
      date: "13-12-2024",
      caseId: "ATS_unit_1_00008",
      reportName: "Report_ATS_unit_1_00008",
      status: "Completed",
    },
    {
      id: 2,
      date: "13-12-2024",
      caseId: "ATS_unit_1_00007",
      reportName: "Report_ATS_unit_1_00007",
      status: "In Progress",
    },
    {
      id: 3,
      date: "12-12-2024",
      caseId: "ATS_unit_1_00003",
      reportName: "Report_ATS_unit_1_00003",
      status: "Completed",
    },
    {
      id: 4,
      date: "12-12-2024",
      caseId: "ATS_unit_1_00002",
      reportName: "Report_ATS_unit_1_00002",
      status: "Under Review",
    },
    {
      id: 5,
      date: "12-12-2024",
      caseId: "ATS_unit_1_00001",
      reportName: "Report_ATS_unit_1_00001",
      status: "Completed",
    },
  ]);

  const handleAddUnit = (value) => {
    if (value && !units.includes(value)) {
      setUnits([...units, value]);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      Completed:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
      "In Progress":
        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
      "Under Review":
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  const StatsCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold dark:text-white">
            {value.toLocaleString()}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
        </div>
      </div>
    </div>
  );

  const generateSerialNumber = () => {
    const lastNumber = parseInt(serialNumber);
    return String(lastNumber + 1).padStart(5, "0");
  };

  const handleUnitChange = (value) => {
    if (value === "add_new") {
      const newUnit = prompt("Enter new unit name:");
      if (newUnit) {
        handleAddUnit(newUnit);
        setSelectedUnit(newUnit);
      }
    } else {
      setSelectedUnit(value);
    }
    const newSerialNum = generateSerialNumber();
    setSerialNumber(newSerialNum);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !selectedUnit) {
      console.log("Please select a unit and file");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const submitData = {
      unit: selectedUnit,
      serialNumber,
      caseId: `ATS_${selectedUnit
        .toLowerCase()
        .replace(" ", "_")}_${serialNumber}`,
      file: file.name,
    };

    console.log("Submitted data:", submitData);
    setIsLoading(false);
    setFile(null);
    document.getElementById("fileInput").value = "";
  };

  const handleAddReport = (id) => {
    console.log("Adding report:", id);
  };

  const handleDeleteReport = (id) => {
    setRecentReports(recentReports.filter((report) => report.id !== id));
  };

  const notifications = [
    { id: 1, message: "You have a new message." },
    { id: 2, message: "Your report is ready to download." },
    { id: 3, message: "New comment on your post." },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Report Generator</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                     text-gray-600 dark:text-gray-300"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                     text-gray-600 dark:text-gray-300"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-14 mt-48 w-64 bg-white dark:bg-gray-800 
                          border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            >
              <ul className="max-h-60 overflow-y-auto p-2 space-y-2">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                             dark:hover:bg-gray-700 rounded-lg"
                  >
                    {notification.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="w-full rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800">
        <GenerateReportForm />
      </div>

      {/* Recent reports */}
      <RecentReports />
    </div>
  );
}
