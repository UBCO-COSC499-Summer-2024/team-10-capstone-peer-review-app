"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, Settings, LogOut } from "lucide-react";
import NotifCard from "./NotifCard";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";

import { useUser } from "@/contexts/contextHooks/useUser";
import { getCurrentUser, logoutUser } from "@/api/authApi";
import { getClassesByUserId, getAllAssignments } from "@/api/classApi";

export default function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userLoading, setUserContext, clearUserContext } = useUser();
  const [classesData, setClassesData] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUserContext(currentUser);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch current user",
          variant: "destructive"
        });
      }
    };

    fetchCurrentUser();
  }, [toast]);

  useEffect(() => {
    if (user) {
      const fetchClasses = async () => {
        try {
          const classes = await getClassesByUserId(user.userId);
          setClassesData(Array.isArray(classes) ? classes : []);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch classes",
            variant: "destructive"
          });
        }
      };

      const fetchAssignments = async () => {
        try {
          const assignments = await getAllAssignments(user.userId);
          setAssignmentsData(Array.isArray(assignments) ? assignments : []);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch assignments",
            variant: "destructive"
          });
        }
      };

      fetchClasses();
      fetchAssignments();
    }
  }, [user, toast]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUserContext();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path === "/dashboard" && location.pathname === "/")
    );
  };

  return (
    <div className="flex h-screen fixed">
      <div className="py-4 bg-white shadow-md flex flex-col items-center justify-between">
        <div>
          <div className="mb-6">
            <Link to="/dashboard" className="flex items-center justify-center">
              <img
                src="../../../public/logo.png"
                className="w-12 h-12"
                alt="Logo"
              />
            </Link>
          </div>
          <NavigationMenu className="px-3">
            <NavigationMenuList className="w-full flex flex-col space-y-6 px-3">
              <NavigationMenuItem className="w-full">
                <Link
                  to={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive(user.role === "ADMIN" ? "/admin" : "/dashboard") &&
                      "font-bold"
                  )}
                >
                  <Home className="w-4 h-4 mr-2 inline-block" />
                  <span className="hidden md:block">Dashboard</span>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className={cn(navigationMenuTriggerStyle(), "font-bold flex items-center w-full")}>
                      <ClipboardList className="w-4 h-4 mr-2 inline-block" />
                      Peer-Review
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>My Peer-Reviews</SheetTitle>
                      <SheetDescription>
                        <ul className="bg-white flex flex-col justify-center items-center gap-3 p-6 w-full">
                          {assignmentsData.map((assignment) => (
                            <ListItem
                              key={assignment.assignmentId}
                              title={assignment.title}
                              href={`/assignedPR/${assignment.assignmentId}`}
                              className="w-full"
                            >
                              {assignment.description}
                            </ListItem>
                          ))}
                          <ListItem
                            title="All Peer Reviews"
                            href="/peer-review"
                            className="w-full bg-blue-100"
                          >
                            View all peer reviews.
                          </ListItem>
                        </ul>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className={cn(
                      navigationMenuTriggerStyle(),
                      (isActive("/classes") || isActive("/manageclass")) &&
                      "font-bold flex items-center w-full"
                    )}>
                      <Users className="w-4 h-4 mr-2 inline-block" />
                      Classes
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>My Classes</SheetTitle>
                      <SheetDescription>
                        <ul className="bg-white flex flex-col justify-center items-center gap-3 p-6 w-full">
                          {classesData.map((classItem) => (
                            <ListItem
                              key={classItem.classId}
                              title={classItem.classname}
                              href={`/class/${classItem.classId}`}
                              className="w-full"
                            >
                              {classItem.description}
                            </ListItem>
                          ))}
                          {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
                            <ListItem
                              title="Manage Classes"
                              href="/manageclass"
                              className="w-full bg-blue-100"
                            >
                              Administer classes and assignments.
                            </ListItem>
                          )}
                        </ul>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <Link
                  to="/settings"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/settings") && "font-bold flex items-center"
                  )}
                >
                  <Settings className="w-4 h-4 mr-2 inline-block" />
                  Settings
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center">
          <HoverCard>
            <HoverCardTrigger>
              <Avatar className="w-14 h-14 bg-gray-200 rounded-full shadow-md">
                <AvatarImage
                  src={user.avatarUrl}
                  alt={`${user.firstname} ${user.lastname}`}
                />
                <AvatarFallback>
                  {getInitials(user.firstname, user.lastname)}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-full transform translate-x-40 translate-y-16">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <NotifCard
                    title="Admin: Heads up!"
                    description="You have received a new message"
                  />
                  <NotifCard
                    title="Admin: Heads up!"
                    description="You have received a new message"
                  />
                  <NotifCard
                    title="Admin: Heads up!"
                    description="You have received a new message"
                  />
                  <NotifCard
                    title="Admin: Heads up!"
                    description="You have received a new message"
                  />
                  <Button variant="outline">View All</Button>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2 inline-block" />
                    Logout
                  </Button>
                  <Link to="/settings">
                    <Button variant="outline" size="sm">
                      Visit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div className="flex-1 overflow-auto ml-60">
        {/* This is where your main app content will be rendered */}
      </div>
    </div>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            to={href}
            className={cn(
              "block w-[300px] shadow hover:shadow-lg select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
