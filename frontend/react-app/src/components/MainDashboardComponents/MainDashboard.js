import React from 'react'
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import RecentReports  from "./RecentReports";
import { Bell, Moon, Sun} from 'lucide-react';
import { useTheme } from "../theme-provider";

import StatsMetricCard from '../Elements/StatsCard';


const MainDashboard = () => {
  
    const { theme, setTheme } = useTheme();
    
    const notifications = [
        { id: 1, title: 'New Message', message: 'You have a new message from the team.', time: '5m ago' },
        { id: 2, title: 'Report Ready', message: 'Your report is ready to download.', time: '10m ago' },
        { id: 3, title: 'Update Available', message: 'A new version is available.', time: '1h ago' },
      ];

   

  return (
        <ScrollArea className="h-full">
          <div className="p-8 pt-0 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                  Overview of your report analytics and recent activities
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[380px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                        <div className="flex justify-between w-full">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
    
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </div>
            </div>
    
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <StatsMetricCard
                  type="reports"
                  title="Monthly Reports"
                  mainValue={120}
                  mainValueLabel="Reports Generated"
                  percentageChange={15}
                  breakdownData={[
                    { label: 'Approved', value: 90 },
                    { label: 'Pending', value: 20 },
                    { label: 'Rejected', value: 10 }
                  ]}
                  bottomStats={[
                    { label: 'Total Reports', value: 120 },
                    { label: 'Errors', value: 2 }
                  ]}
                  chartData={[
                    { month: 'Jan', value: 30 },
                    { month: 'Feb', value: 50 },
                    { month: 'Mar', value: 40 }
                  ]}
                  chartType="bar"
                />
                <StatsMetricCard
                  type="statements"
                  title="Monthly Statements"
                  mainValue={500}
                  mainValueLabel="Statements Processed"
                  percentageChange={10}
                  breakdownData={[
                    { label: 'Approved', value: 350 },
                    { label: 'Pending', value: 100 },
                    { label: 'Rejected', value: 50 }
                  ]}
                  bottomStats={[
                    { label: 'Total Statements', value: 500 },
                    { label: 'Errors', value: 5 }
                  ]}
                  chartData={[
                    { month: 'Jan', value: 120 },
                    { month: 'Feb', value: 200 },
                    { month: 'Mar', value: 180 },
                    { month: 'Apr', value: 250 }
                  ]}
                  chartType="line"
                />
                <StatsMetricCard
                  type="timeSaved"
                  title="Time Saved"
                  mainValue="1200"
                  mainValueLabel="Minutes Saved"
                  percentageChange={25}
                  breakdownData={[
                    { label: 'Manual Processing', value: '800 mins' },
                    { label: 'Automation', value: '400 mins' },
                    { label: 'Optimization', value: '200 mins' }
                  ]}
                  bottomStats={[
                    { label: 'Average Time Saved/Day', value: '40 mins' },
                    { label: 'Peak Savings', value: '100 mins' }
                  ]}
                />
              </div>

            {/* <MetricCard {...timeMetric} /> */}
    
            {/* Recent reports */}
            <RecentReports/>
            {/* <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Report generation trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportChart chartData={dummyChartData} viewType={chartViewType} />
              </CardContent>
            </Card> */}
          </div>
        </ScrollArea>
  )
}

export default MainDashboard