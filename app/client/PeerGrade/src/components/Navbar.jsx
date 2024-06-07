"use client";

import * as React from "react";
import { Link } from "react-router-dom"; // Corrected import for Link from react-router-dom
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
// import { Icons } from "@/components/icons";
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

const components = [
  {
    title: "COSC 414",
    href: "/classes",
    description:
      "Shan Du - Computer Graphics",
  },
  {
    title: "MATH 222",
    href: "/classes",
    description:
      "Paul Tsomone - Matrix Algebra",
  },
  {
    title: "COSC 221",
    href: "/classes",
    description:
      "Mohammed Khaled - Artificial Intelligence",
  },
  {
    title: "COSC 499",
    href: "/classes",
    description: "Scott Fzackerly - Capstone Project",
  },
  {
    title: "COSC 310",
    href: "/classes",
    description:
      "Shan Du - Software Engineering Fundamentals",
  },
  {
    title: "COSC 341",
    href: "/classes",
    description:
      "Dr Bowen - Human Computer Interaction",
  },
];

export default function AppNavbar() {
  return (
    <NavigationMenu className="flex items-center justify-between">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
            Dashboard
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Peer-Reviews</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/peer-review"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      <span className="text-red-400 font-bold text-xl">4</span> Reviews Pending
                    </div>
                    <ListItem href="/peer-review" title="Go to reviews" className="bg-green-100 flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </ListItem>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/peer-review" title="Review 1" className="ease-in-out duration-300">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/peer-review" title="Review 2" className="ease-in-out duration-300">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/peer-review" title="Review 3" className="ease-in-out duration-300">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Classes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
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
      <div className="flex items-center gap-5 bg-gray-200 px-5 py-1 ">
        <Button><Bell className="w-6 h-6 text-gray-700" /></Button>
        <Avatar className="w-8 h-8 bg-gray-200 rounded-full border border-black" />
        <Link to={"/"}>
          <Button className="bg-red-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          </Button>
        </Link>
      </div>
    </NavigationMenu>
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
