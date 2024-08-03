import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useUser } from "@/contexts/contextHooks/useUser";
import { Pencil, Trash2, Eye, Info, ChevronDown } from 'lucide-react';
import { deleteRubricsFromAssignment, getAllRubricsInClass, getRubricById } from '@/api/rubricApi';
import EditRubric from '@/components/rubrics/EditRubric';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import InfoButton from '@/components/global/InfoButton';

const Rubrics = () => {
  const { classId } = useParams();
  const { user } = useUser();
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rubricToDelete, setRubricToDelete] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [rubricToEdit, setRubricToEdit] = useState(null);
  const [editDrawerKey, setEditDrawerKey] = useState(0);
  const [confirmDeleteRubric, setConfirmDeleteRubric] = useState(false);


  useEffect(() => {
    fetchData();
  }, [classId]);

  const fetchData = async () => {
    try {
      const rubricsResponse = await getAllRubricsInClass(classId);
      if (rubricsResponse && rubricsResponse.status === 'Success' && Array.isArray(rubricsResponse.data)) {
        setRubrics(rubricsResponse.data);
      } else {
        setRubrics([]);
      }
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      setRubrics([]);
    }
  };

  const calculateTotalPoints = (rubric) => {
    if (!rubric || !rubric.criteria) return 0;
    return rubric.criteria.reduce((total, criterion) => 
      total + Math.max(...criterion.criterionRatings.map(rating => parseFloat(rating.points) || 0)), 0
    );
  };

  const handleDeleteRubric = async () => {
    if (confirmDeleteRubric) {
      setConfirmDeleteRubric(false);
      try {
        await deleteRubricsFromAssignment(rubricToDelete.rubricId);
        await fetchData(); // Wait for the data to be fetched
        setIsDrawerOpen(false);
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error deleting rubric:', error);
      }
    } else {
      setConfirmDeleteRubric(true);
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

  const handleEditRubricClick = async (rubricId) => {
    try {
      const response = await getRubricById(rubricId);
      if (response.data && response.data) {
        setRubricToEdit(response.data);
        setIsEditDrawerOpen(true);
        setEditDrawerKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error('Error fetching rubric details:', error);
    }
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setRubricToEdit(null);
  };

  const handleRubricUpdated = (updatedRubric) => {
    setRubrics(prevRubrics => prevRubrics.map(rubric => 
      rubric.rubricId === updatedRubric.rubricId ? updatedRubric : rubric
    ));
    handleCloseEditDrawer(); // Close the drawer after updating
  };

  const rubricsInfoContent = {
    title: "About Rubrics",
    description: (
      <>
        <p>This page allows you to manage rubrics for the class:</p>
        <ul className="list-disc list-inside mt-2">
          <li>View all existing rubrics</li>
          <li>See details of each rubric including criteria and point distributions</li>
          {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
            <>
              <li>Create new rubrics</li>
              <li>Edit existing rubrics</li>
              <li>Delete rubrics</li>
            </>
          )}
        </ul>
        <p className="mt-2">Click on 'View Details' to see the full rubric structure.</p>
        {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
          <p className="mt-2">Use 'Edit Rubric' to modify existing rubrics or create new ones to standardize grading across assignments.</p>
        )}
      </>
    )
  };

  return (
    <div className="p-6 bg-muted rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Rubrics</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {rubrics.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No rubrics found</div>
        ) : (
          rubrics.map((rubric) => (
            <Card key={rubric.rubricId} className="hover:shadow-md transition-shadow bg-white flex flex-col h-full">
              <CardHeader className="pb-2 flex justify-between">
                  <div>
                      <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{rubric.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 line-clamp-2">{rubric.description}</CardDescription>
                  </div>
                  <div>
                      <Badge variant="outline" className="text-xs flex justify-center items-center bg-success/30">
                          {rubric.totalMarks} Points
                      </Badge>
                  </div>
              </CardHeader>
              <CardContent className="pt-2 flex-grow">
                
              </CardContent>
              <CardFooter className="mt-auto">
                  <Button 
                      onClick={() => handleRubricClick(rubric.rubricId)} 
                      className="w-2/5 bg-gray-100 text-gray-800 hover:bg-gray-200 mr-2"
                      variant="ghost"
                  >
                      <Eye className="mr-2 h-4 w-4" /> View Details
                  </Button>
                  <Button 
                      onClick={() => handleEditRubricClick(rubric.rubricId)} 
                      className="w-2/5 bg-blue-100 text-blue-800 hover:bg-blue-200 mr-2"
                      variant="ghost"
                  >
                      <Pencil className="mr-2 h-4 w-4" /> Edit Rubric
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log('Delete rubric:', rubric);
                      setRubricToDelete(rubric);
                      setConfirmDeleteRubric(false);
                      setIsDialogOpen(true);
                    }} 
                    variant="destructive"
                    className="w-1/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
        <DrawerHeader>
          <div className="flex justify-between items-start">
            <div>
              <DrawerTitle className="text-2xl">{selectedRubric?.title}</DrawerTitle>
              <DrawerDescription>{selectedRubric?.description}</DrawerDescription>
            </div>
            </div>
          </DrawerHeader>
          <div className="p-4 bg-gray-100 rounded-md mb-4">
            <h4 className="font-semibold mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              How to read this rubric:
            </h4>
            <ul className="text-sm space-y-1">
              <li><Badge variant="outline" className="mr-2 bg-accent/70 text-slate-900">Criteria</Badge> Specific aspects of the assignment being evaluated</li>
              <li><Badge variant="outline" className="mr-2 bg-accent/70 text-slate-900">Ratings</Badge> Descriptions of performance levels for each criterion</li>
              <li><Badge variant="outline" className="mr-2 bg-accent/70 text-slate-900">Points</Badge> Score associated with each rating level</li>
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
                        {Math.max(...criterion.criterionRatings.map(rating => parseFloat(rating.points) || 0))}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>
            
          </div>
         <DrawerFooter>
            <div className="w-full flex justify-end">
              <p className="text-sm text-gray-500">
                Total Points: {calculateTotalPoints(selectedRubric)}
              </p>
            </div>
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}><ChevronDown className='w-6 h-6'/></Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <EditRubric 
        key={editDrawerKey}
        isOpen={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        rubricData={rubricToEdit}
        onRubricUpdated={handleRubricUpdated}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={confirmDeleteRubric ? "text-white bg-red-500 border-red-800 z-[2000]" : "z-[2000]"}>
          <DialogHeader>
            <DialogTitle>{confirmDeleteRubric ? "Confirm " : ""}Delete Rubric</DialogTitle>
            <DialogDescription className={confirmDeleteRubric ? "text-white" : ""}>
              Are you {confirmDeleteRubric ? "really " : ""}sure you want to delete the rubric '{rubricToDelete?.title}'? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className={confirmDeleteRubric ? "text-black" : ""} onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRubric}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <InfoButton content={rubricsInfoContent} />

    </div>
  );
};

export default Rubrics;
