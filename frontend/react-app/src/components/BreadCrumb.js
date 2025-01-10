import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { ChevronLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function BreadcrumbDynamic({ items, className = "py-4 px-8" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentItems, setCurrentItems] = useState(items);

  useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  const handleNavigation = async (path) => {
    if (path) {
      setIsLoading(true);
      try {
        await navigate(path);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    const currentIndex = currentItems.findIndex(item => item.isCurrentPage);
    if (currentIndex > 0) {
      const previousItem = currentItems[currentIndex - 1];
      handleNavigation(previousItem.path);
    }
  };

  const isBackButtonVisible = () => {
    const caseDashboardMatch = matchPath('/case-dashboard/:caseId/:defaultTab', location.pathname);
    const individualDashboardMatch = matchPath('/individual-dashboard/:caseId/:individualId/:defaultTab', location.pathname);
    return caseDashboardMatch || individualDashboardMatch;
  };

  if (!currentItems?.length) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {isBackButtonVisible() && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 ml-2"
          onClick={handleBack}
          disabled={isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      <Breadcrumb className={className}>
        <BreadcrumbList>
          {currentItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className={isLoading ? 'opacity-50' : ''}>
                {item.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      className="flex items-center gap-1"
                      disabled={isLoading}
                    >
                      <BreadcrumbEllipsis className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <DropdownMenuItem 
                          key={dropdownIndex}
                          onClick={() => handleNavigation(dropdownItem.path)}
                          disabled={isLoading}
                        >
                          {dropdownItem.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    as="button"
                    className="cursor-pointer hover:underline"
                    onClick={() => handleNavigation(item.path)}
                    disabled={isLoading}
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < currentItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default BreadcrumbDynamic;
