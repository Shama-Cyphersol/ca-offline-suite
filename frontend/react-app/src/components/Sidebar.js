
import React,{useEffect} from "react";
import {
  LayoutDashboard,
  Files,
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
  TestTube2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  // SidebarMenuSubItem,
  // SidebarMenuSubButton,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import logo from "../data/assets/logo.png";

const SidebarDynamic = ({ navItems, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [user] = React.useState({
    name: "Harsh Jajal",
    email: "m@example.com",
    avatar: "#",
  });

  const MenuItem = ({ item, level = 0 }) => {
    const hasSubmenu = item.items?.length > 0;

    return (
      <div className="w-full">
        <button
          className={`w-full flex items-center justify-start p-2 rounded-md transition-all duration-200 ease-in-out
            ${level > 0 ? "ml-4" : ""} 
            ${activeTab === item.title && !hasSubmenu ? "bg-gray-200 text-black font-semibold" : "text-gray-600 hover:bg-gray-100"}
            ${isCollapsed ? "justify-center" : ""}`}
          onClick={() => !hasSubmenu && setActiveTab(item.title)}
        >
          <div className="flex items-center gap-3">
            {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
            {!isCollapsed && <span className="text-sm">{item.title}</span>}
          </div>
        </button>

        {hasSubmenu && (
          <div className={`ml-4 mt-1 space-y-1 ${isCollapsed ? "hidden" : ""}`}>
            {item.items.map((subItem) => (
              <MenuItem key={subItem.title} item={subItem} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const NavMain = () => (
    <div className="space-y-2">
      {navItems.map((item) => (
        <MenuItem key={item.title} item={item} />
      ))}
    </div>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md transition-all duration-200">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">HJ</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="ml-3 flex-1 text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="top" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>HJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/backend-tester')}>
            <TestTube2 className="mr-2 h-4 w-4" />
            <span>Backend Tester</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Refer and Earn</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BadgeCheck className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Sidebar className="transition-all duration-300 ease-in-out">
      <SidebarHeader>
        <div className="h-16 flex items-center px-4 border-b">
          <img 
            src={logo} 
            alt="Logo" 
            className={`h-12 cursor-pointer transition-all duration-300 ${isCollapsed ? "w-8" : "w-auto"}`}
            onClick={() => navigate("/")} 
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3 overflow-x-hidden">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarDynamic;
