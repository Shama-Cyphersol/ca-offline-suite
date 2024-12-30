import React from 'react'
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RecentReports  from "./RecentReports";
import { ReportChart } from "../Elements/chartComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Files, BarChart3, Bell, Moon, Sun, User, Settings, LogOut, Search } from 'lucide-react';
import { useTheme } from "../theme-provider";
import { useState } from 'react';


const MainDashboard = () => {
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
    
      const stats = {
        totalReports: 1234,
        monthlyReports: 156,
        totalStatements: 5678
      };


    const notifications = [
        { id: 1, title: 'New Message', message: 'You have a new message from the team.', time: '5m ago' },
        { id: 2, title: 'Report Ready', message: 'Your report is ready to download.', time: '10m ago' },
        { id: 3, title: 'Update Available', message: 'A new version is available.', time: '1h ago' },
      ];

    const StatsCard = ({ title, value, description, icon: Icon }) => (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </CardContent>
        </Card>
      );

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
    
            <div className="grid gap-4 md:grid-cols-3">
              <StatsCard
                title="Total Reports"
                value={stats.totalReports}
                description="All time reports generated"
                icon={Files}
              />
              <StatsCard
                title="Monthly Reports"
                value={stats.monthlyReports}
                description="Reports generated this month"
                icon={BarChart3}
              />
              <StatsCard
                title="Total Statements"
                value={stats.totalStatements}
                description="Processed statements"
                icon={Files}
              />
            </div>
    
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