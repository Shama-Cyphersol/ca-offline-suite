import React from 'react';
import logo from '../assets/cyphersol-logo.png';


const Sidebar = ({ onNavigate,navItems,source,caseId=null,name=null}) => {
  

  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleNavClick = (index) => {
    setActiveIndex(index);
    if (onNavigate) {
      onNavigate(index);
    }
  };
  
  const header_styles = source==="main-dashboard"?"flex justify-center pt-8 mb-6 pb-6 w-full":"flex justify-center pt-4 mb-5 pb-3 w-full bg-[#f8fafc]";

  return (
    <div className="min-w-[200px]  bg-white border-r border-gray-200 flex flex-col h-full max-h-full">
      <div className="flex flex-col h-full px-0">
        {/* Logo */}
        
        <div className={header_styles}>
        {source==="main-dashboard"&&<img
            src={logo}
            alt="CypherSol Logo" 
            className="h-[60px] w-[80%] object-contain"
          />}

        {source==="case-dashboard"&&
          <div className='w-full ml-5'>
            <h1 className="text-2xl font-bold text-left opacity-80">Case Dashboard</h1>
            <h4 className="text-sm text-left mt-1 opacity-85">Case ID: {caseId}</h4>
          </div>}

          {source==="individual-dashboard"&&
          <div className='w-full ml-5'>
            <h1 className="text-xl font-bold text-left opacity-80">Individual Dashboard</h1>
            <h4 className="text-sm text-left mt-1 opacity-85">Name: {name}</h4>
          </div>}
          
        </div>

        {/* Navigation Buttons */}
        <div className="flex-grow pr-3 max-h-full overflow-y-auto overflow-x-hidden">
          {navItems.map((item, index) => (
            <button
              key={item.text}
              onClick={() => handleNavClick(index)}
              className={`
                w-full px-3 py-3 text-left text-lg font-normal
                flex items-center gap-2 my-0.5 mx-2.5
                hover:bg-gray-50 hover:text-blue-500
                transition-colors duration-200
                rounded-md outline-none
                ${activeIndex === index 
                  ? 'bg-indigo-50 text-blue-500 border-l-[3px] border-l-blue-500' 
                  : 'border-l-[3px] border-transparent'
                }
              `}
            >
              {item.icon != null&& <img 
                src={item.icon} 
                alt={`${item.text} icon`}
                className="w-6 h-6 object-contain"
              />}
              <span className="ml-2">{item.text}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-full py-7 text-center px-5 text-gray-500 text-xs">
          <p>CypherSOL Fintech India Pvt Ltd.</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;