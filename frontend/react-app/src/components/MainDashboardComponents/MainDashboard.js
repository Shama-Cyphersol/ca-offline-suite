import React from 'react'
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RecentReports  from "./RecentReports";
import { ReportChart } from "../Elements/chartComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bell, Moon, Sun, User, Settings, LogOut, Search,Clock} from 'lucide-react';
import { useTheme } from "../theme-provider";
import { useState } from 'react';

import StatsMetricCard from '../Elements/StatsCard';
import MetricCard from '../Elements/timecard';


const MainDashboard = () => {
  const timeMetric = {
    title: "Time consumed",
    value: 1234,
    unit: "minutes",
    icon: Clock,
    growth: "+12.5%",
    metrics: {
      Daily: "45 min",
      Weekly: "315 min",
      Monthly: "1,234 min"
    },
    stats: {
      "Efficiency Rate": "94.2%",
      "Tasks Automated": "847"
    }
  }
  
    const { theme, setTheme } = useTheme();
    const [chartViewType, setChartViewType] = useState("daily");
    const [searchQuery, setSearchQuery] = useState("");
    
    const dummyChartData = {
        daily: [
          { label: "Mon", value: 10 },
          { label: "Tue", value: 15 },
          { label: "Wed", value: 8 },
          { label: "Thu", value: 12 },
          { label: "Fri", value: 20 },
        ],
        monthly: [
          { label: "Jan", value: 45 },
          { label: "Feb", value: 52 },
          { label: "Mar", value: 38 },
          { label: "Apr", value: 42 },
          { label: "May", value: 55 },
        ]
      };
    
      const statsData = {
        statements: {
          chartData: [
            { month: 'Sep', value: 1050 },
            { month: 'Oct', value: 1200 },
            { month: 'Nov', value: 1150 },
            { month: 'Dec', value: 1300 }
          ],
          breakdownData: [
            { label: 'Daily Avg', value: '41' },
            { label: 'Weekly Avg', value: '287' },
            { label: 'Monthly Avg', value: '1,234' }
          ],
          bottomStats: [
            { label: 'Success Rate', value: '99.2%' },
            { label: 'Avg. Processing Time', value: '1.2s' }
          ]
        },
        reports: {
          chartData: [
            { month: 'Sep', value: 700 },
            { month: 'Oct', value: 780 },
            { month: 'Nov', value: 820 },
            { month: 'Dec', value: 847 }
          ],
          breakdownData: [
            { label: 'Daily', value: '28' },
            { label: 'Weekly', value: '196' },
            { label: 'Monthly', value: '847' }
          ],
          bottomStats: [
            { label: 'Success Rate', value: '98.5%' },
            { label: 'Avg. Size', value: '2.3 MB' }
          ]
        },
        timeSaved: {
          breakdownData: [
            { label: 'Daily', value: '45 min' },
            { label: 'Weekly', value: '315 min' },
            { label: 'Monthly', value: '1,234 min' }
          ],
          bottomStats: [
            { label: 'Efficiency Rate', value: '94.2%' },
            { label: 'Tasks Automated', value: '847' }
          ]
        }
      }

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
    
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatar.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  mainValue={1200}
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
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Report generation trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportChart chartData={dummyChartData} viewType={chartViewType} />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
  )
}

export default MainDashboard