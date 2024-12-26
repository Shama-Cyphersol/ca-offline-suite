import React from 'react'
import Sidebar from '../components/Sidebar'
import dashboardIcon from '../assets/dashboard.png';
import generateReportIcon from '../assets/generate_report.png';
import reportIcon from '../assets/report.png';
import Dashboard from '../components/MainDashboard/Dashboard';
import GenerateReport from '../components/MainDashboard/GenerateReport';
import ReportsTab from '../components/MainDashboard/ReportsTab';

const MainDashboard = () => {
  const [activePage, setActivePage] = React.useState(0);


  const handleOnNavigate = (index) => {
    console.log('Navigating to:', index);
    setActivePage(index);
  }

    const navItems = [
        { text: 'Dashboard', icon: dashboardIcon },
        { text: 'Generate Report', icon: generateReportIcon },
        { text: 'Reports', icon: reportIcon }
    ];
    return (
    <div className='h-full flex'>
      <div className='h-full max-h-full  bg-gray-200'>
        <Sidebar onNavigate={handleOnNavigate} source={"main-dashboard"} navItems={navItems}/>
      </div>
      <div className='h-full w-full p-5 max-h-full overflow-y-auto '>
        {activePage === 0 && <Dashboard/>}
        {activePage === 1 && <GenerateReport/>}
        {activePage === 2 && <ReportsTab/>}
      </div>
    </div>
  )
}

export default MainDashboard