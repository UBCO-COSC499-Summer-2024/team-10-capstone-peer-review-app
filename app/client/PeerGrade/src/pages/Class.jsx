import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { classesData, assignmentsData } from '../lib/data';
import ClassCard from '../components/class/ClassCard';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from '@/components/ui/button';

const Class = () => {
  const { classId } = useParams();
  const classItem = classesData.find((item) => item.id === classId);
  // const handleBackClick = () => {
  //   navigate(-1); // This will navigate the user to the previous page
  // };

  if (!classItem) {
    return <div>Class not found</div>;
  }

  const classAssignments = assignmentsData.filter(assignment => assignment.className === classItem.name);
  const categories = [...new Set(classAssignments.map(assignment => assignment.category))];

  return (
    <div className="w-screen mx-5 p-6">
            {/* <Button onClick={handleBackClick}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>
</Button> */}

      <div className="flex flex-col gap-4 bg-gray-200 p-4 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold">{classItem.name}: {classItem.instructor}</h1>
        <div className="flex rounded-lg">
        <div className="flex justify-between items-center">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">HOME</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">GRADES</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">PEOPLE</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">GROUPS</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">FILES</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">CONTACTS</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white p-4 shadow-md mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-2">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-100 p-4 rounded">No recent announcements</CardContent>
          </Card>
          {categories.map((category, index) => (
            <Card key={index} className="bg-white p-4 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-2">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {classAssignments
                  .filter(assignment => assignment.category === category)
                  .map((assignment) => (
                    <Link
                      key={assignment.id}
                      to={`/assignment/${assignment.id}`}
                      className="flex items-center space-x-2 bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
                    >
                      <span>{assignment.name}</span>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          ))}
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
