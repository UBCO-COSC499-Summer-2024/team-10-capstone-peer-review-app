"use client";

import * as React from "react";
import { useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { iClass as classesData, assignment as assignmentsData } from '@/lib/dbData';

export default function AppNavbar() {
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser); //redux user state

  // Filter classes based on user class_ids
  const userClasses = classesData.filter(classItem => currentUser.class_id.includes(classItem.class_id));

  // Filter assignments based on user class_ids and evaluation_type 'peer'
  const userReviewAssignments = assignmentsData
    .filter(assignment => currentUser.class_id.includes(assignment.class_id) && assignment.evaluation_type === 'peer')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full py-3 bg-gray-900 shadow-md px-5">
      <NavigationMenu className="flex items-center justify-between w-full max-w-screen-xl mx-auto ">
        <NavigationMenuList className="flex space-x-4">
          {/* <NavigationMenuItem>
            logo here
          </NavigationMenuItem> */}
          <NavigationMenuItem className="text-white hover:text-colored ">
            <Link to="/dashboard" className={cn(navigationMenuTriggerStyle(), isActive('/dashboard') && 'font-bold text-colored')}>
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <NavigationMenuItem className="text-white hover:text-colored">
                <Link to="/peer-review" className={cn(navigationMenuTriggerStyle(), isActive('/peer-review') && 'font-bold text-colored')}>
                      Peer-Review
                </Link>
              </NavigationMenuItem>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="bg-white grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                {userReviewAssignments.map((assignment) => (
                  <ListItem
                    key={assignment.assignment_id}
                    title={assignment.title}
                    href={`/assignedPR/${assignment.assignment_id}`}
                  >
                    {assignment.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(isActive('/classes') || isActive('/manageclasses') && 'font-bold text-colored')}>
              <span className="text-white hover:text-colored">Classes</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="bg-white grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {userClasses.map((classItem) => (
                  <ListItem
                    key={classItem.class_id}
                    title={classItem.classname}
                    href={`/class/${classItem.class_id}`}
                  >
                    {classItem.description}
                  </ListItem>
                ))}
                {(currentUser.type === 'instructor' || currentUser.type === 'admin') && (
                  <ListItem
                    title="Manage Classes"
                    href="/manageclass"
                    className="bg-blue-100"
                  >
                    Administer classes and assignments.
                  </ListItem>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-white hover:text-colored">
            <Link to="/settings" className={cn(navigationMenuTriggerStyle(), isActive('/settings') && 'font-bold text-colored')}>
              Settings
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className="flex items-center space-x-4">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Avatar className="w-9 h-9 bg-black border border-white rounded-full shadow-md">
                <AvatarFallback>
                  {currentUser && `${currentUser.firstname.charAt(0)}${currentUser.lastname.charAt(0)}`}
                </AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="absolute r-0">
              <div className="flex bg-white grid  md:grid-cols-1 lg:w-[300px] flex-col space-y-2 p-4">
                <div className="bg-white shadow rounded-md p-4">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p>No new notifications</p>
                </div>
                <Button variant="link" className="w-full text-left">
                  <Link to={"/"} className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    <span>Logout</span>
                  </Link>
                </Button>
                <Button variant="link" className="w-full text-left">
                  <Link to={"/help"} className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m9 1.5v-13a2.25 2.25 0 0 0-2.25-2.25h-13A2.25 2.25 0 0 0 6 4.5v1.25m9.75 13v.75m0-6.5h.008v.008H15.75v-.008Z" />
                    </svg>
                    <span>Request Help</span>
                  </Link>
                </Button>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </div>
      </NavigationMenu>
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
              "block shadow hover:shadow-lg select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
