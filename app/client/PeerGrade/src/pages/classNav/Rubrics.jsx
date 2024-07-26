import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useUser } from "@/contexts/contextHooks/useUser";
import { Pencil, Trash2, Eye, FileText, Info, ChevronDown } from 'lucide-react';
import { deleteRubricsFromAssignment, getAllRubricsInClass, getRubricById } from '@/api/rubricApi';
import { getAllAssignmentsByClassId } from '@/api/assignmentApi';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';

const Rubrics = () => {
  const { classId } = useParams();
  const { user } = useUser();
  const [rubrics, setRubrics] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [rubricToDelete, setRubricToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rubricsResponse, assignmentsResponse] = await Promise.all([
          getAllRubricsInClass(classId),
          getAllAssignmentsByClassId(classId)
        ]);

        if (rubricsResponse && rubricsResponse.status === 'Success' && Array.isArray(rubricsResponse.data)) {
          setRubrics(rubricsResponse.data);
        } else {
          setRubrics([]);
        }

        if (assignmentsResponse && assignmentsResponse.data) {
          setAssignments(assignmentsResponse.data);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRubrics([]);
        setAssignments([]);
      }
    };
  
    fetchData();
  }, [classId]);

  const handleDeleteRubric = async () => {
    try {
      await deleteRubricsFromAssignment(rubricToDelete.rubricId);
      setIsDrawerOpen(false);
      setIsAlertDialogOpen(false);
      fetchRubrics();
    } catch (error) {
      console.error('Error deleting rubric:', error);
    }
  };

  const handleRubricClick = async (rubricId) => {
    try {
      const response = await getRubricById(rubricId);
      if (response.data && response.data) {
        setSelectedRubric(response.data);
      } else {
        setSelectedRubric(null);
      }
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching rubric details:', error);
      setSelectedRubric(null);
    }
  };

  const handleRubricCreated = () => {
    fetchRubrics();
  };

  const fetchRubrics = async () => {
    try {
      const response = await getAllRubricsInClass(classId);
      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        setRubrics(response.data);
      } else {
        setRubrics([]);
      }
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      setRubrics([]);
    }
  };

  return (
    <div className="p-6 bg-muted rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Rubrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rubrics.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No rubrics found</div>
        ) : (
          rubrics.map((rubric) => (
            <Card key={rubric.rubricId} className="hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-2 flex justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-800">{rubric.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">{rubric.description}</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs w-1/2 flex justify-center items-center bg-success/30">
                    {rubric.totalMarks} Points
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
              
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleRubricClick(rubric.rubricId)} 
                  className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                  variant="ghost"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-2xl">{selectedRubric?.title}</DrawerTitle>
            <DrawerDescription>{selectedRubric?.description}</DrawerDescription>
            <div className="flex justify-end space-x-2 mt-4">
              
            </div>
          </DrawerHeader>
          <div className="p-4 bg-gray-100 rounded-md mb-4">
            <h4 className="font-semibold mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              How to read this rubric:
            </h4>
            <ul className="text-sm space-y-1">
              <li><Badge variant="outline" className="mr-2 bg-accent text-slate-900">Criteria</Badge> Specific aspects of the assignment being evaluated</li>
              <li><Badge variant="outline" className="mr-2 bg-accent text-slate-900">Ratings</Badge> Descriptions of performance levels for each criterion</li>
              <li><Badge variant="outline" className="mr-2 bg-accent text-slate-900">Points</Badge> Score associated with each rating level</li>
            </ul>
          </div>
          <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Criteria</TableHead>
                  <TableHead>Ratings</TableHead>
                  <TableHead className="w-[100px] text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedRubric && selectedRubric.criteria && selectedRubric.criteria.map((criterion, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{criterion.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {criterion.criterionRatings && criterion.criterionRatings.map((rating, ratingIndex) => (
                          <div key={ratingIndex} className="flex items-center bg-gray-100 rounded p-2">
                            <p className="text-sm mr-2">{rating.description}</p>
                            <Badge variant="secondary">{rating.points}</Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-accent text-slate-900">
                        {criterion.criterionRatings.reduce((sum, rating) => sum + (parseFloat(rating.points) || 0), 0)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setRubricToDelete(selectedRubric);
                    setIsAlertDialogOpen(true);
                  }} 
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Rubric
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this rubric? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={handleDeleteRubric}>Delete</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <DrawerFooter>
            <p className="text-sm text-gray-500">Total Points: {selectedRubric?.totalMarks}</p>
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}><ChevronDown className='w-6 h-6'/></Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    
    </div>
  );
};

export default Rubrics;
