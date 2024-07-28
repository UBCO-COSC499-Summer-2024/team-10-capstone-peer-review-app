import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import MultiSelect from '@/components/ui/MultiSelect';
import { addRubricToAssignment, getAllRubrics, linkRubricToAssignment } from '@/api/rubricApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Minus } from 'lucide-react';

const CreateRubric = ({ classId, assignments, onRubricCreated }) => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [newRubricData, setNewRubricData] = useState({
    title: "",
    description: "",
    criteria: [{
      id: 1,
      criteria: "",
      points: "",
      ratings: [{ text: "", points: "" }]
    }]
  });
  const [isValid, setIsValid] = useState(false);
  const [editing, setEditing] = useState(null);
  const [hasNegativePoints, setHasNegativePoints] = useState(false);

  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isCreateDrawerOpen) {
      fetchRubrics();
    }
  }, [isCreateDrawerOpen]);

  useEffect(() => {
    validateRubric();
  }, [newRubricData, selectedAssignments]);

  const fetchRubrics = async () => {
    try {
      const response = await getAllRubrics();
      if (response.data && Array.isArray(response.data.data)) {
        onRubricCreated(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch updated rubrics",
        variant: "destructive"
      });
    }
  };

  const handleCreateRubric = async () => {
    if (selectedAssignments.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one assignment",
        variant: "destructive"
      });
      return;
    }
  
    const formattedRubricData = {
      title: newRubricData.title,
      description: newRubricData.description,
      totalMarks: newRubricData.criteria.reduce((total, criterion) =>
        total + Math.max(...criterion.ratings.map(rating => parseFloat(rating.points) || 0), 0),
      0),
      classId: classId,
      criterion: newRubricData.criteria.map(criterion => ({
        title: criterion.criteria,
        minPoints: 0,
        maxPoints: Math.max(...criterion.ratings.map(rating => parseFloat(rating.points) || 0), 0),
        criterionRatings: criterion.ratings.map(rating => ({
          text: rating.text,
          points: parseFloat(rating.points) || 0
        }))
      }))
    };
  
    try {
      // Create a single rubric
      const createdRubric = await addRubricToAssignment({
        userId: user.userId,
        assignmentId: selectedAssignments[0],
        rubricData: formattedRubricData
      });
  
      console.log('Rubric created:', createdRubric);
  
      // Link the created rubric to all other selected assignments
      if (selectedAssignments.length > 1) {
        await linkRubricToAssignment(createdRubric.data.rubricId, selectedAssignments.slice(1));
      }
  
      console.log('Rubric linked to all selected assignments');
      toast({
        title: "Success",
        description: "Rubric created and linked to selected assignments",
        variant: "info"
      });
  
      onRubricCreated(createdRubric.data);
      setIsCreateDrawerOpen(false);
      setNewRubricData({
        title: "",
        description: "",
        criteria: [{
          id: 1,
          criteria: "",
          points: "",
          ratings: [{ text: "", points: "" }]
        }]
      });
      setSelectedAssignments([]);
      fetchRubrics(); // Refresh the rubrics list
    } catch (error) {
      console.error('Error creating rubric:', error);
      toast({
        title: "Error",
        description: "Failed to create rubric",
        variant: "destructive"
      });
    }
  };

  const handleAssignmentSelection = (selectedValues) => {
    console.log('Selected assignments:', selectedValues);
    setSelectedAssignments(selectedValues);
  };

  const handleEdit = (id, field, value) => {
    setNewRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const addCriterion = () => {
    setNewRubricData(prevData => ({
      ...prevData,
      criteria: [
        ...prevData.criteria,
        {
          id: prevData.criteria.length + 1,
          criteria: "",
          points: "",
          ratings: [{ text: "", points: "" }]
        }
      ]
    }));
  };

  const removeCriterion = (id) => {
    setNewRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.filter(c => c.id !== id)
    }));
  };

  const validateRubric = () => {
    const isValid = newRubricData.title.trim() !== "" &&
      newRubricData.criteria.length > 0 &&
      newRubricData.criteria.every(criterion =>
        criterion.criteria.trim() !== "" &&
        criterion.ratings.length > 0 &&
        criterion.ratings.every(rating =>
          rating.text.trim() !== "" && !isNaN(parseFloat(rating.points)) && parseFloat(rating.points) >= 0
        )
      ) &&
      selectedAssignments.length > 0;
    setIsValid(isValid);
  
    const hasNegative = newRubricData.criteria.some(criterion =>
      criterion.ratings.some(rating => parseFloat(rating.points) < 0)
    );
    setHasNegativePoints(hasNegative);
  };

  const addRating = (criterionId, index) => {
    setNewRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c =>
        c.id === criterionId
          ? {
            ...c, ratings: [
              ...c.ratings.slice(0, index + 1),
              { text: "", points: "" },
              ...c.ratings.slice(index + 1)
            ]
          }
          : c
      )
    }));
  };

  return (
    <>
      <Button onClick={() => setIsCreateDrawerOpen(true)} className="w-full mb-4">Add a Rubric</Button>
      <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create a Rubric</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 max-h-[85vh] z-[70] overflow-y-auto">
            <div className='mb-4'>
              <Input
                placeholder="Rubric Title"
                value={newRubricData.title}
                onChange={(e) => setNewRubricData(prev => ({ ...prev, title: e.target.value }))}
                className="mb-2"
              />
              <Input
                placeholder="Rubric Description"
                value={newRubricData.description}
                onChange={(e) => setNewRubricData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className='mb-8'>
              <h3 className="text-md mb-2">Select Assignments</h3>
              <MultiSelect
                options={assignments.map(assignment => ({
                  value: assignment.assignmentId,
                  label: assignment.title
                }))}
                value={selectedAssignments}
                onChange={handleAssignmentSelection}
              />
            </div>
            <div className="p-4 bg-slate-200 rounded-t-md">
              <h4 className="font-semibold mb-2">How to use this table:</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <Pencil className="h-4 w-4 mr-2" /> Click to edit text
                </li>
                <li className="flex items-center">
                  <Plus className="h-4 w-4 mr-2 text-green-500" /> Add a new rating or criterion
                </li>
                <li className="flex items-center">
                  <Minus className="h-4 w-4 mr-2 text-destructive" /> Remove a rating
                </li>
                <li className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Remove a criterion
                </li>
                <li><Badge variant="outline" className="bg-warning ">Important</Badge> You must fill out all the fields in order to submit the rubric! </li>
                <li className="flex items-center"><Badge variant="outline" className="bg-red-200 text-destructive mr-1">Negative</Badge> Points are not allowed</li>
              </ul>
            </div>
            <Table className="border-2">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-[200px] border-r">Criteria</TableHead>
                  <TableHead className="border-r">Ratings</TableHead>
                  <TableHead className="w-[100px] border-r">Pts</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newRubricData.criteria.map((criterion) => (
                  <TableRow key={criterion.id} className="border-b">
                    <TableCell className="font-medium border-r p-0">
                      <div className="flex items-center justify-between p-2">
                        {editing === `${criterion.id}-criteria` ? (
                          <Input
                            value={criterion.criteria}
                            onChange={(e) => handleEdit(criterion.id, 'criteria', e.target.value)}
                            onBlur={() => setEditing(null)}
                            autoFocus
                            placeholder="Enter criteria"
                          />
                        ) : (
                          <>
                            <span>{criterion.criteria || "Enter criteria"}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditing(`${criterion.id}-criteria`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="border-r p-0">
                      <div className="flex">
                        {criterion.ratings.map((rating, index) => (
                          <div key={index} className="flex-1 border-r last:border-r-0 relative px-6">
                            <div className="flex flex-col py-2">
                              <div className="flex items-center justify-between mb-2">
                                {editing === `${criterion.id}-rating-points-${index}` ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-12 text-sm"
                                    value={rating.points}
                                    onChange={(e) => {
                                      const newRatings = [...criterion.ratings];
                                      newRatings[index].points = e.target.value;
                                      handleEdit(criterion.id, 'ratings', newRatings);
                                    }}
                                    onBlur={() => setEditing(null)}
                                    autoFocus
                                    placeholder="Pts"
                                  />
                                ) : (
                                  <div className="flex items-center">
                                    <span className={`text-sm mr-1 ${parseFloat(rating.points) < 0 ? 'text-red-500' : ''}`}>{rating.points || "Pts"}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => setEditing(`${criterion.id}-rating-points-${index}`)}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              {editing === `${criterion.id}-rating-${index}` ? (
                                <Input
                                  className="w-full text-sm"
                                  value={rating.text}
                                  onChange={(e) => {
                                    const newRatings = [...criterion.ratings];
                                    newRatings[index].text = e.target.value;
                                    handleEdit(criterion.id, 'ratings', newRatings);
                                  }}
                                  onBlur={() => setEditing(null)}
                                  autoFocus
                                  placeholder="Enter description"
                                />
                              ) : (
                                <div className="flex items-center">
                                  <span className="text-sm mr-1 max-w-[150px] break-words">{rating.text || "Enter description"}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 flex-shrink-0"
                                    onClick={() => setEditing(`${criterion.id}-rating-${index}`)}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {index > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-red-100 border border-destructive border-dashed"
                                onClick={() => {
                                  const newRatings = criterion.ratings.filter((_, i) => i !== index);
                                  handleEdit(criterion.id, 'ratings', newRatings);
                                }}
                              >
                                <Minus className="h-3 w-3 text-destructive" />
                              </Button>
                            )}
                            {index === criterion.ratings.length - 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-6 w-6 rounded-full  bg-green-100 border border-success border-dashed"
                                onClick={() => addRating(criterion.id, index)}
                              >
                                <Plus className="h-3 w-3 text-green-500" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="border-r p-0">
                      <span className="text-sm">
                        {Math.max(...criterion.ratings.map(rating => parseFloat(rating.points) || 0), 0)}
                      </span>
                    </TableCell>
                    <TableCell className="p-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-full bg-red-100 p-2"
                        onClick={() => removeCriterion(criterion.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <Button
                      variant="ghost"
                      className="w-full h-12 border border-success border-dashed bg-green-50"
                      onClick={addCriterion}
                    >
                      <Plus className="h-4 w-4 text-green-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button onClick={handleCreateRubric} disabled={!isValid || hasNegativePoints} className="mt-4">Save Rubric</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateRubric;
