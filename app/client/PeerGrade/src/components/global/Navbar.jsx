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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { logoutUser } from "@/api/authApi";
import { getAllAssignments } from "@/api/classApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";

export default function AppNavbar() {
  const { user, userLoading, clearUserContext, setUserContext } = useUser();
  const { classes, setUserClasses, setAdminClasses } = useClass();
  const { toast } = useToast();

  const location = useLocation();
  const navigate = useNavigate();
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(0);
  const [isPeerReviewSheetOpen, setIsPeerReviewSheetOpen] = useState(false);
  const [isClassesSheetOpen, setIsClassesSheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user && !userLoading) {
        console.log("User is null and not loading, calling setUserContext");
        await setUserContext();
      }
      if (user) {
        try {
          console.log("Fetching classes and assignments for user:", user);
          if (user.role === "ADMIN") {
            await setAdminClasses();
          } else {
            await setUserClasses(user.userId);
          }

          const assignments = await getAllAssignments(user.userId);
          setAssignmentsData(Array.isArray(assignments) ? assignments : []);
        } catch (error) {
          console.error("Failed to fetch data", error);
          toast({
            title: "Error",
            description: "Failed to fetch data",
            variant: "destructive",
          });
        }
      }
    };

    fetchData();
  }, [user, toast]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCardVisible && !event.target.closest(".notification-card")) {
        toggleCardVisibility();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCardVisible]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUserContext();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const isActive = (path) => {
    return location.pathname === path || (path === "/dashboard" && location.pathname === "/");
  };

  const toggleCardVisibility = () => {
    if (isCardVisible) {
      setCardOpacity(0);
      setTimeout(() => setIsCardVisible(false), 300);
    } else {
      setIsCardVisible(true);
      setTimeout(() => setCardOpacity(1), 50);
    }
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-[200px] z-[60] h-screen fixed">
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
                  <span className="md:block">Dashboard</span>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <Sheet open={isPeerReviewSheetOpen} onOpenChange={setIsPeerReviewSheetOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(navigationMenuTriggerStyle(), "font-bold flex items-center w-full")}
                      onClick={() => setIsPeerReviewSheetOpen(true)}
                    >
                      <ClipboardList className="w-4 h-4 mr-2 inline-block" />
                      Peer-Review
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] border-l border-gray-200">
                    <SheetHeader>
                      <SheetTitle>My Peer-Reviews</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <p className="text-sm leading-snug text-muted-foreground">
                        {assignmentsData.length} Reviews Assigned
                      </p>
                      <ul className="bg-white flex flex-col justify-center items-center gap-3 p-6 w-full mt-2">
                        {assignmentsData.map((assignment) => (
                          <ListItem
                            key={assignment.assignmentId}
                            title={assignment.title}
                            href={`/assignedPR/${assignment.assignmentId}`}
                            className="w-full"
                            onItemClick={() => setIsPeerReviewSheetOpen(false)}
                          >
                            {assignment.description}
                          </ListItem>
                        ))}
                        <ListItem
                          title="All Peer Reviews"
                          href="/peer-review"
                          className="w-full bg-blue-100"
                          onItemClick={() => setIsPeerReviewSheetOpen(false)}
                        >
                          View all peer reviews.
                        </ListItem>
                      </ul>
                    </div>
                  </SheetContent>
                </Sheet>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <Sheet open={isClassesSheetOpen} onOpenChange={setIsClassesSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" onClick={() => setIsClassesSheetOpen(true)}
                      className={cn(
                      navigationMenuTriggerStyle(),
                      (isActive("/classes") || isActive("/manageclass")) &&
                      "font-bold flex items-center w-full"
                    )}>
                      <Users className="w-4 h-4 mr-2 inline-block" />
                      Classes
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle>My Classes</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <p className="text-sm leading-snug text-muted-foreground">
                        {classes.length} Active Classes
                      </p>
                      <ul className="bg-white flex flex-col justify-center items-center gap-3 p-6 w-full">
                        {classes.map((classItem) => (
                          <ListItem
                            key={classItem.classId}
                            title={classItem.classname}
                            href={`/class/${classItem.classId}`}
                            className="w-full"
                            onItemClick={() => setIsClassesSheetOpen(false)}
                          >
                            {classItem.description}
                          </ListItem>
                        ))}
                        {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
                          <ListItem
                            title="Manage Classes"
                            href="/manageclass"
                            className="w-full bg-blue-100"
                            onItemClick={() => setIsClassesSheetOpen(false)}
                          >
                            Administer classes and assignments.
                          </ListItem>
                        )}
                      </ul>
                    </div>
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
          <Button className="w-16 h-16 rounded-full shadow-lg" variant="avatar" onClick={toggleCardVisibility} disabled={!user}>
            <Avatar className="w-14 h-14 rounded-full ">
              <AvatarImage
                src={user.avatarUrl}	
                alt={`${user.firstname} ${user.lastname}`}
              />
              <AvatarFallback className='text-2xl'>
                {getInitials(user.firstname, user.lastname)}
              </AvatarFallback>
            </Avatar>
          </Button>
          {isCardVisible && (
            <Card 
              className="absolute w-[400px] transform -translate-y-56 translate-x-36 transition-opacity duration-300 ease-in-out notification-card"
              style={{ opacity: cardOpacity }}
            >              
            <CardContent className="space-y-4 ">
                <CardTitle className="text-lg font-bold">Hey <span className="text-blue-600">{user.firstname}</span>!</CardTitle>
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
                  <Button variant="outline" className="bg-green-100">View All</Button>
                </div>
                <div className="flex justify-between">
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2 inline-block" />
                    Logout
                  </Button>
                  <Link to="/settings">
                    <Button variant="default" size="sm">
                      Visit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto ml-60">
        {/* This is where your main app content will be rendered */}
      </div>
    </div>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, href, onItemClick, ...props }, ref) => {
    return (
      <li className="w-[250px] ">
        <NavigationMenuLink asChild>
          <Link
            to={href}
            className={cn(
              "block shadow hover:shadow-lg select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            onClick={onItemClick}
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
