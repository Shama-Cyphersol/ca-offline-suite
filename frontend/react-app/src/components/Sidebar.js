
import * as React from "react";
import {
  LayoutDashboard,
  Files,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import logo from "../data/assets/logo.png";
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
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./ui/sidebar";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

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
import Billing from "./MainDashboardComponents/Billing";

const data = {
  user: {
    name: "Harsh",
    email: "m@example.com",
    avatar: "#",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Generate Report",
      url: "#",
      icon: Files,
    },
  ],
};

const SidebarDynamic = ({ navItems, activeTab, setActiveTab }) => {
  const [expandedItems, setExpandedItems] = React.useState({});
  const [user, setUser] = React.useState({
    name: "Harsh",
    email: "m@example.com",
    avatar: "#",
  });

  const toggleSubmenu = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const NavMain = ({ items, activeTab, setActiveTab }) => {
    return (
      <SidebarMenu className="space-y-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="space-y-4">
            <SidebarMenuButton
              defaultOpen
              asChild
              isActive={activeTab === item.title}
              onClick={() => {
                if (item.items && !item.alwaysOpen) {
                  toggleSubmenu(item.title);
                } else {
                  setActiveTab(item.title);
                }
              }}
            >
              <button
                className={`w-full flex items-center justify-between py-5 ${
                  activeTab === item.title
                    ? "font-extrabold text-black"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center text-[18px]">
                  {item.icon && <item.icon className="mr-3 h-6 w-6" />}
                  <span>{item.title}</span>
                </div>
                {item.items &&
                  !item.alwaysOpen &&
                  (expandedItems[item.title] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </button>
            </SidebarMenuButton>
            {(item.items && expandedItems[item.title]) || item.alwaysOpen ? (
              <SidebarMenuSub className="pl-6 space-y-2">
                {item.items.map((subItem) => (
                  <div key={subItem.title} className="flex flex-col text-base">
                    <button
                      className={`py-2 text-left ${
                        activeTab === subItem.title
                          ? "font-bold text-black bg-gray-200 rounded-md p-2"
                          : "text-gray-600 hover:text-black p-2"
                      }`}
                      onClick={() => setActiveTab(subItem.title)}
                    >
                      {subItem.title}
                    </button>
                    {subItem.submenu && (
                      <div className="pl-4 space-y-1">
                        {subItem.submenu.map((menu) => (
                          <div
                            key={menu.title}
                            className={`py-1 ${
                              activeTab === menu.title
                                ? "font-bold text-black bg-gray-200 rounded-md"
                                : "text-gray-500 hover:text-black"
                            }`}
                          >
                            {menu.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  };
  
  const NavUser = ({ user }) => {
    const { isMobile } = useSidebar();

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">HJ</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="top"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">HJ</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Refer and Earn </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
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
        </SidebarMenuItem>
      </SidebarMenu>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="h-16 flex items-center px-6 border-b">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto p-4 ">
        <NavMain
          items={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarDynamic;