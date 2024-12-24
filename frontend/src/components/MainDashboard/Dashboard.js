import React from 'react'
import RecentReports from "../RecentReports";
import Statistics from "./Statistics";
import ReportChart from "./ReportChart";

const Dashboard = () => {

  const dummyStats = {
    totalReports: 1234,
    monthlyReports: 156,
    totalStatements: 4567,
  };
  const dummyChartData = {
    daily: [
      { label: "2023-12-01", value: 10 },
      { label: "2023-12-02", value: 15 },
      { label: "2023-12-03", value: 5 },
      { label: "2023-12-01", value: 2 },
      { label: "2023-12-02", value: 15 },
      { label: "2023-12-03", value: 30 },
      { label: "2023-12-01", value: 7 },
      { label: "2023-12-02", value: 40 },
      { label: "2023-12-03", value: 70 },
      { label: "2023-12-01", value: 3 },
      { label: "2023-12-02", value: 67 },
      { label: "2023-12-03", value: 70 },
    ],
    monthly: [
      { label: "January", value: 200 },
      { label: "February", value: 300 },
      { label: "March", value: 250 },
    ],
    reset: [],
  };




  return (
    <div>
      <h1 className='text-3xl font-bold ml-5'>Dashboard</h1>
      <div className=''>
        <div className='p-2 mb-10'>
          <Statistics stats={dummyStats} />
        </div>
        <div>
          <RecentReports/>
        </div>
        <div className=''>
          <ReportChart chartData={dummyChartData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard