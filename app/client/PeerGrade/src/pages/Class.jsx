import React from 'react';
import { useParams } from 'react-router-dom';
import { classesData } from '../lib/data';
import ClassCard from '../components/class/ClassCard';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Class = () => {
  const { classId } = useParams();
  const classItem = classesData.find((item) => item.id === classId);

  if (!classItem) {
    return <div>Class not found</div>;
  }

  return (
    <div className="w-screen mx-5 p-6">
      <div className="flex flex-col gap-4 bg-gray-200 p-4 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold">{classItem.name}: {classItem.instructor}</h1>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-gray-300">HOME</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-gray-300">GRADES</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-gray-300">PEOPLE</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-gray-300">GROUPS</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-gray-300">FILES</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white p-4 shadow-md mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-2">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-100 p-4 rounded">No recent announcements</CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-2">Unit 1: Integrals and Differentiation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                <span>Assignment 1</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                <span>Assignment 2</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                <span>Assignment 3</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                <span>Assignment 4</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                <span>Assignment 5</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <span className="block text-4xl font-bold">98%</span>
              <span className="text-gray-500">Class Grade</span>
            </CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <span className="block text-4xl font-bold">98%</span>
              <span className="text-gray-500">Avg Peer Grade</span>
            </CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-2">To Do</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-100 p-4 rounded">No tasks due</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Class;
