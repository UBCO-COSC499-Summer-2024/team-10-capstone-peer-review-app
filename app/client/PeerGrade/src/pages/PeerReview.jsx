import { useState } from 'react';
import { assignment as assignmentsData, iClass as classesData } from '@/utils/dbData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { Link } from 'react-router-dom';

const PeerReview = () => {
	const [view, setView] = useState("doc_view");
	const [searchTerm, setSearchTerm] = useState("");
	const [filterClass, setFilterClass] = useState("");

  const filteredAssignments = assignmentsData
    .filter(assignment => assignment.evaluation_type === 'peer')
    .filter(assignment =>
      (!filterClass || classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname === filterClass) &&
      (!searchTerm ||
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  return (
    <div className="main-container w-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Peer Reviews</h1>

      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-4 ">
          <div className="flex gap-2 rounded">
            <Button
              className={view === 'doc_view' ? 'bg-green-300 text-black shadow-md' : 'bg-gray-300 text-white-400 shadow-none'}
              variant={view === 'doc_view' ? 'default' : 'outline'}
              onClick={() => setView('doc_view')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </Button>
            <Button
              className={view === 'list_view' ? 'bg-green-300 text-black shadow-md' : 'bg-gray-300 text-white-400 shadow-none'}
              variant={view === 'list_view' ? 'default' : 'outline'}
              onClick={() => setView('list_view')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border bg-white shadow-md">
                {filterClass || 'Filter by class'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              {Array.from(new Set(classesData.map(classItem => classItem.classname))).map((className, index) => (
                <DropdownMenuItem key={index} onSelect={() => setFilterClass(className)} className="hover:bg-gray-200">
                  {className}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onSelect={() => setFilterClass('')}>
                All Classes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute top-2 left-2 h-6 w-6 text-gray-500"/>
          </div>
        </div>
      </div>

      <div className={`grid ${view === 'doc_view' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {filteredAssignments.map(assignment => {
          const className = classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname || 'Unknown Class';
          return (
            <Card key={assignment.assignment_id} className={`w-full ${view === 'doc_view'? "": "flex justify-between"} bg-white shadow-md rounded-lg`}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription className="text-gray-500">{assignment.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Due Date: {assignment.due_date.toLocaleDateString()}</span>
                  <Link to={`/assignedPR/${assignment.assignment_id}`} className="text-blue-500">Open</Link>
                </div>
                <div className="text-gray-500">Peer Review Due: {assignment.due_date.toLocaleDateString()}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PeerReview;
