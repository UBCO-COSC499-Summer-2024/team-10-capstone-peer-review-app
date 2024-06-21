"use client";

import * as React from "react";
import { useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/utils";
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
import { iClass as classesData, assignment as assignmentsData } from '@/utils/dbData';

export default function AppNavbar() {
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return null;
  }

  const userClasses = classesData.filter(classItem => {
    return Array.isArray(currentUser.classes) && currentUser.classes.includes(classItem.class_id);
  });

  const userReviewAssignments = assignmentsData
    .filter(assignment => {
      return Array.isArray(currentUser.classes) && currentUser.classes.includes(assignment.class_id) && assignment.evaluation_type === 'peer';
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  const isActive = (path) => location.pathname === path;

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  
  return (
    <div className="w-full py-3 px-4 bg-white shadow-md">
      <NavigationMenu className="flex items-center justify-between w-full max-w-screen-xl mx-auto ">
        <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>
            <Link to="/dashboard">
              <img src="logo.png" className="w-10 h-10"/>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/dashboard" className={cn(navigationMenuTriggerStyle(), isActive('/dashboard') && 'font-bold')}>
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className='group'>
              <NavigationMenuItem>
                  <Link to="/peer-review" className={cn(navigationMenuTriggerStyle(), isActive('/peer-review') && 'font-bold group')}>
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
            <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), isActive('/classes') || isActive('/manageclasses') && 'font-bold')}>
              Classes
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
                {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
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
          <NavigationMenuItem>
            <Link to="/settings" className={cn(navigationMenuTriggerStyle(), isActive('/settings') && 'font-bold')}>
              Settings
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className="flex items-center space-x-4">
          <Link to={"/"}>
            <Button variant="outline" className="bg-red-100" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="bg-indigo-100"><Bell className="w-5 text-gray-700" /></Button>
          <Link to={"/settings"}>
            <Avatar className="w-9 h-9 bg-gray-200 rounded-full shadow-md">
              <AvatarFallback>
                {getInitials(currentUser.firstname, currentUser.lastname)}
              </AvatarFallback>
            </Avatar>
          </Link>
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
