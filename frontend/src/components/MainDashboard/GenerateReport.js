import React from 'react'
import RecentReports from "../RecentReports";
import GenerateReportForm from "./GenerateReportForm";

const GenerateReport = () => {
  return (
    <div>
      <h1 className='text-3xl font-bold ml-2'>Generate Report</h1>
      <div className='p-2 mt-8'>
      <div className='mb-10'>
        <GenerateReportForm/>
      </div>
      <div>
        <RecentReports/>
      </div>
      </div>
    </div>
  )
}

export default GenerateReport