import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  MessageSquareWarning,
  PlusCircle,
  Bell,
  CircleHelp,
  NotebookPen
} from "lucide-react";
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { logoutUser } from "@/api/authApi";
import { getAllAssignments } from "@/api/classApi";
import { deleteNotification, getNotifications } from "@/api/notifsApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";

export default function AppNavbar() {
  const { user, userLoading, clearUserContext, setUserContext } = useUser();
  const { classes, setUserClasses, setAdminClasses } = useClass();
  const maxNotificationCount = 3;
  const { toast } = useToast();

  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(0);
  const [isPeerReviewSheetOpen, setIsPeerReviewSheetOpen] = useState(false);
  const [isClassesSheetOpen, setIsClassesSheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const assignments = await getAllAssignments(user.userId);
          setAssignmentsData(Array.isArray(assignments) ? assignments : []);
        } catch (error) {
          console.error("Failed to fetch data", error);
          toast({
            title: "Error",
            description: "Failed to fetch data",
            variant: "destructive"
          });
        }
      }
    };
    const fetchNotifs = async () => {
      if (user) {
        try {
          const notifs = await getNotifications(user.userId);
          setNotifications(Array.isArray(notifs.data) ? notifs.data : []);
        } catch (error) {
          console.error("Failed to fetch notifications", error);
          toast({
            title: "Error",
            description: "Failed to fetch notifications",
            variant: "destructive"
          });
        }
      }
    };
    
		fetchData();
		fetchNotifs();

		const intervalId = setInterval(() => {
			fetchNotifs();
		}, 10000); // Fetch notifications every 30 seconds

		return () => {
			clearInterval(intervalId); // Clear the interval when the component unmounts
		};
	}, [user]);

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
        variant: "destructive"
      });
    }
  };

  const handleDeleteNotif = async (notificationId) => {
    const deleteNotif = await deleteNotification(notificationId);
    if (deleteNotif.status === "Success") {
      setNotifications((prevNotifs) =>
        prevNotifs.filter(
          (notification) => notification.notificationId !== notificationId
        )
      );
    } else {
      console.error('An error occurred while deleting the notification.', deleteNotif.message);
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
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

  if (!user) {
    return null;
  }

	return (
		<div className="flex w-[170px] z-[60] h-screen fixed">
			<div className="py-6 bg-white shadow-md flex flex-col items-center justify-between h-screen w-full">
				<div className="flex flex-col items-center w-full flex-grow">
					<div className="mb-4">
						<Link to={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center justify-center">
							<img src="/logo.png" className="w-12 h-12" alt="Logo" />
						</Link>
					</div>
					<NavigationMenu className="px-3 flex items-center justify-center flex-grow w-full">
						<NavigationMenuList className="w-full flex flex-col space-y-8 items-center justify-center px-3">
							<NavigationMenuItem className="w-full flex items-center justify-center">
								<Link
									to={user.role === "ADMIN" ? "/admin" : "/dashboard"}
									className={cn(
										navigationMenuTriggerStyle(),
										"flex flex-col items-center justify-center w-full h-full",
										isActive(user.role === "ADMIN" ? "/admin" : "/dashboard") && "font-bold"
									)}
								>
									<Home className="w-6 h-6 mb-1" />
									<span className="md:block">Dashboard</span>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem className="w-full flex items-center justify-center">
								<Sheet open={isPeerReviewSheetOpen} onOpenChange={setIsPeerReviewSheetOpen}>
									<SheetTrigger asChild>
										<Button
											variant="ghost"
											className={cn(
												navigationMenuTriggerStyle(),
												"flex flex-col items-center justify-center font-bold w-full h-full"
											)}
											onClick={() => setIsPeerReviewSheetOpen(true)}
										>
											<ClipboardList className="w-6 h-6 mb-1" />
											Reviews
										</Button>
									</SheetTrigger>
									<SheetContent side="left" className="w-[300px] border-l border-gray-200 ml-[-20px]">
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
							{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
								<NavigationMenuItem className="w-full flex items-center justify-center">
									<Link
									to="/manage-class"
									className={cn(
										navigationMenuTriggerStyle(),
										"flex flex-col items-center justify-center w-full h-full",
										isActive("/manage-class") && "font-bold"
									)}
									>
									<NotebookPen className="w-6 h-6 mb-1" />
									<span className="md:block">Manage Classes</span>
									</Link>
								</NavigationMenuItem>
							)}
							<NavigationMenuItem className="w-full flex items-center justify-center">
								<Sheet open={isClassesSheetOpen} onOpenChange={setIsClassesSheetOpen}>
									<SheetTrigger asChild>
										<Button
											variant="ghost"
											onClick={() => setIsClassesSheetOpen(true)}
											className={cn(
												navigationMenuTriggerStyle(),
												"flex flex-col items-center justify-center font-bold w-full h-full",
												(isActive("/classes") || isActive("/manageclass")) && "font-bold"
											)}
										>
											<Users className="w-6 h-6 mb-1" />
											Classes
										</Button>
									</SheetTrigger>
									<SheetContent side="left" className="w-[300px] border-l border-gray-200 ml-[-20px]">
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
													href="/manage-class"
													className="w-full bg-blue-100"
													onItemClick={() => setIsClassesSheetOpen(false)}
													>
													Administer classes and assignments.
													</ListItem>
												)}
												{user.role === "STUDENT" && (
													<ListItem
													title="Enroll"
													href="/enrollment"
													className="w-full bg-blue-100"
													onItemClick={() => setIsClassesSheetOpen(false)}
													>
													Enroll into a class!
                          </ListItem>
												)}
											</ul>
										</div>
									</SheetContent>
								</Sheet>
							</NavigationMenuItem>
							<NavigationMenuItem className="w-full flex items-center justify-center">
								<Link
									to="/settings"
									className={cn(
										navigationMenuTriggerStyle(),
										"flex flex-col items-center justify-center w-full h-full",
										isActive("/settings") && "font-bold"
									)}
								>
									<Settings className="w-6 h-6 mb-1" />
									Settings
								</Link>
								</NavigationMenuItem>
							<NavigationMenuItem className="w-full flex items-center justify-center">
								{user.role !== "ADMIN" && (
									<Link
									to="/report"
									className={cn(
										navigationMenuTriggerStyle(),
										"flex flex-col items-center justify-center w-full h-full",
										isActive("/report") && "font-bold"
									)}
									>
									<MessageSquareWarning className="w-6 h-6 mb-1" />
									Report{user.role === "INSTRUCTOR" ? "s" : ""}
									</Link>
								)}
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex flex-col items-center space-y-2">
					<Link to="/notifications" className="enabled:rounded-full">
					<Button
						variant="ghost"
						className="w-16 h-16 enabled:rounded-full relative"
						disabled={!user}
						title="Notifications"
					>
						<Bell className='w-6 h-6' />
						{notifications.length > 0 && (
							<span className="absolute top-5 right-5 block h-2 w-2 bg-red-600 rounded-full ring-2 ring-white"></span>
						)}
					</Button>
					</Link>
					<Button
						className="w-16 h-16 rounded-full shadow-lg"
						variant="avatar"
						onClick={toggleCardVisibility}
						disabled={!user}
					>

					<Avatar className="w-14 h-14 rounded-full ">
						<AvatarImage
						src={user.avatarUrl}
						alt={`${user.firstname, user.lastname}`}
						/>
						<AvatarFallback className="text-2xl">
						{getInitials(user.firstname, user.lastname)}
						</AvatarFallback>
					</Avatar>
					</Button>
				</div>
			</div>
      {isCardVisible && (
        <Card
          className="w-[480px] transition-opacity duration-300 ease-in-out notification-card h-auto fixed left-[180px] bottom-3 z-50 shadow-md bg-white"
          style={{ opacity: cardOpacity }}
        >
          <CardContent className="space-y-4">
            <CardTitle className="text-lg font-bold">
              Hey <span className="text-blue-600">{user.firstname}</span>!
            </CardTitle>
            <div className="flex flex-col gap-2">
              {notifications.length === 0 && (
                <div className="text-center px-4 pb-4 text-gray-500 text-sm">
                  You have no notifications!
                </div>
              )}
             {notifications.slice(0, maxNotificationCount).map((notification) => (
                <NotifCard
                  key={notification.notificationId}
                  notificationData={notification}
                  deleteNotifCall={handleDeleteNotif}
                />
              ))}
              {notifications.length > maxNotificationCount && (
                <Link to="/notifications" className="w-full">
                  <Button className="w-full" onClick={toggleCardVisibility}>
                    View All
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2 inline-block" />
                Logout
              </Button>
              <div className="flex items-center justify-between">
                <Link to="/help">
                  <Button variant="outline" size="sm" className='w-8 h-8 mr-2'>
                    <CircleHelp className='w-4 h-4' />
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="default" size="sm">
                    Visit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, href, onItemClick, ...props }, ref) => {
    const location = useLocation();
    const isActive =
      location.pathname === href || location.pathname.startsWith(href);

    return (
      <li className="w-[250px] ">
        <NavigationMenuLink asChild>
          <Link
            to={href}
            className={cn(
              "block shadow hover:shadow-lg select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              isActive && "bg-accent text-accent-foreground",
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