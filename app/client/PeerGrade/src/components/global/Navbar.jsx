"use client";

import * as React from "react";
import { Link } from "react-router-dom";
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
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { classesData, assignmentsData } from '../lib/data';

export default function AppNavbar() {
  // Filter and sort assignments for review
  const reviewAssignments = assignmentsData
    .filter(assignment => assignment.forReview)
    .sort((a, b) => new Date(a.peerReviewDueDate) - new Date(b.peerReviewDueDate))
    .slice(0, 3);

  // Count the number of assignments marked for review
  const reviewsPendingCount = assignmentsData.filter(assignment => assignment.forReview).length;

  return (
    <div className="w-full py-3 bg-white shadow-md">
      <NavigationMenu className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4">
        <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>
            <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Peer-Reviews</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="bg-white grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      to="/peer-review"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        <span className="text-red-400 font-bold text-xl">{reviewsPendingCount}</span> Reviews Pending
                      </div>
                      <ListItem href="/peer-review" title="Go to reviews" className="bg-green-100 flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </ListItem>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {reviewAssignments.map((assignment) => (
                  <ListItem
                    key={assignment.id}
                    title={assignment.name}
                    href={`/assignedPR/${assignment.id}`}
                  >
                    {assignment.shortDesc}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Classes</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="bg-white grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {classesData.map((classItem) => (
                  <ListItem
                    key={classItem.id}
                    title={classItem.name}
                    href={`/class/${classItem.id}`}
                  >
                    {classItem.instructor}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/settings" className={navigationMenuTriggerStyle()}>
              Settings
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className="flex items-center space-x-4">
          <Button variant='outline'><Bell className="w-6 h-6 text-gray-700" /></Button>
          <Avatar className="w-8 h-8 bg-gray-200 rounded-full border border-black" />
          <Link to={"/"} className="shadow-md rounded-full">
            <Button variant='outline' className='border-none'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </Button>
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
