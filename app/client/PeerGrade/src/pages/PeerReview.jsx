import { useState } from 'react';
import { assignment as assignmentsData, iClass as classesData } from '@/utils/dbData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, BookOpen, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';

const PeerReview = () => {
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssignments = assignmentsData
    .filter(assignment => assignment.evaluation_type === 'peer')
    .filter(assignment =>
      !searchTerm ||
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAssignments.map(assignment => {
        const className = classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname || 'Unknown Class';
        return (
          <Card key={assignment.assignment_id} className="w-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary">{assignment.title}</CardTitle>
              <CardDescription className="text-sm text-slate-500">{className}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 mb-4">{assignment.description}</p>
              <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Due: {assignment.due_date.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>Peer Review Due: {assignment.due_date.toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Link to={`/assignedPR/${assignment.assignment_id}`} className="w-full">
                <Button variant="default" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" /> Open Review
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredAssignments.map(assignment => {
        const className = classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname || 'Unknown Class';
        return (
          <Alert key={assignment.assignment_id} variant="default" className="hover:bg-accent cursor-pointer transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-2">
                  <AlertTitle className="text-lg font-semibold text-primary">{assignment.title}</AlertTitle>
                  <Badge variant="default" className="mb-2">{className}</Badge>
                </div>
                <AlertDescription>
                  <p className="text-sm text-slate-600 mb-2">{assignment.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {assignment.due_date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Peer Review Due: {assignment.due_date.toLocaleDateString()}
                    </span>
                  </div>
                </AlertDescription>
              </div>
              <Link to={`/assignedPR/${assignment.assignment_id}`}>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Alert>
        );
      })}
    </div>
  );

  return (
    <div className="w-full px-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Peer Reviews</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-1/3">
          <Input 
            type="text" 
            placeholder="Search assignments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200"
          />
          <Search className="absolute top-2.5 left-3 h-5 w-5 text-slate-400"/>
        </div>
        
        <Tabs defaultValue={view} className="w-full md:w-auto" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'grid' ? renderGridView() : renderListView()}

      {filteredAssignments.length === 0 && (
        <div className="text-center text-slate-500 mt-8">
          No peer review assignments found.
        </div>
      )}
    </div>
  );
};

export default PeerReview;