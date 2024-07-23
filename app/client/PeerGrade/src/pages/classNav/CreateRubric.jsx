import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import MultiSelect from '@/components/ui/MultiSelect';
import { addRubricToAssignment, getAllRubrics } from '@/api/rubricApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus, Minus } from 'lucide-react'

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

  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isCreateDrawerOpen) {
      fetchRubrics();
    }
  }, [isCreateDrawerOpen]);

  useEffect(() => {
    validateRubric();
  }, [newRubricData]);

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
      throw new Error("No assignments selected");
    }

    const formattedRubricData = {
      title: newRubricData.title,
      description: newRubricData.description,
      totalMarks: newRubricData.criteria.reduce((total, criterion) => total + (parseFloat(criterion.points) || 0), 0),
      classId: classId,
      criterion: newRubricData.criteria.map(criterion => ({
        title: criterion.criteria,
        minPoints: 0,
        maxPoints: parseFloat(criterion.points) || 0,
        criterionRatings: criterion.ratings.map(rating => ({
          text: rating.text,
          points: parseFloat(rating.points) || 0
        }))
      }))
    };

    console.log('formattedRubricData:', formattedRubricData);
    const userId = user.userId;

    for (const assignmentId of selectedAssignments) {
      console.log('Adding rubric to assignment:', assignmentId);
      await addRubricToAssignment({
        userId,
        assignmentId,
        rubricData: formattedRubricData
      });
    }

    console.log('Rubric added to all selected assignments');
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
    const isValid = newRubricData.criteria.every(criterion => 
      criterion.criteria.trim() !== "" && 
      !isNaN(parseFloat(criterion.points)) &&
      criterion.ratings.every(rating => 
        rating.text.trim() !== "" && !isNaN(parseFloat(rating.points))
      )
    );
    setIsValid(isValid);
  };

  const addRating = (criterionId, index) => {
    setNewRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c => 
        c.id === criterionId 
          ? { ...c, ratings: [
              ...c.ratings.slice(0, index + 1), 
              { text: "", points: "" },
              ...c.ratings.slice(index + 1)
            ]} 
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
                                    <span className="text-sm mr-1">{rating.points || "Pts"}</span>
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
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-red-100 border border-dashed" // Made button smaller
                                onClick={() => {
                                  const newRatings = criterion.ratings.filter((_, i) => i !== index);
                                  handleEdit(criterion.id, 'ratings', newRatings);
                                }}
                              >
                                <Minus className="h-3 w-3 text-destructive" /> {/* Made icon smaller */}
                              </Button>
                            )}
                            {index === criterion.ratings.length - 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-6 w-6 rounded-full bg-green-100 border border-dashed" // Made button smaller
                                onClick={() => addRating(criterion.id, index)}
                              >
                                <Plus className="h-3 w-3 text-green-500" /> {/* Made icon smaller */}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="border-r p-0">
                      <span className="text-sm">
                        {criterion.ratings.reduce((sum, rating) => sum + (parseFloat(rating.points) || 0), 0)}
                      </span>
                    </TableCell>
                    <TableCell className="p-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-full"
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
                      className="w-full h-12 border-2 border-dashed bg-green-50"
                      onClick={addCriterion}
                    >
                      <Plus className="h-4 w-4 text-green-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button onClick={handleCreateRubric} disabled={!isValid} className="mt-4">Save Rubric</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateRubric;