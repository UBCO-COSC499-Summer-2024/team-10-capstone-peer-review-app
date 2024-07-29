import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Minus } from 'lucide-react';
import { updateRubricsForAssignment } from '@/api/rubricApi';
import { useToast } from "@/components/ui/use-toast";

const EditRubric = ({ isOpen, onClose, rubricData, onRubricUpdated }) => {
  const [editedRubricData, setEditedRubricData] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [editing, setEditing] = useState(null);
  const [hasNegativePoints, setHasNegativePoints] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (rubricData) {
      setEditedRubricData(rubricData);
      validateRubric(rubricData);
    }
  }, [rubricData]);

  const validateRubric = () => {
    if (!editedRubricData) return;

    const isValid = editedRubricData.title.trim() !== "" &&
      editedRubricData.criteria.length > 0 &&
      editedRubricData.criteria.every(criterion =>
        criterion.title.trim() !== "" &&
        criterion.criterionRatings.length > 0 &&
        criterion.criterionRatings.every(rating =>
          rating.description.trim() !== "" && !isNaN(parseFloat(rating.points)) && parseFloat(rating.points) >= 0
        )
      );
    setIsValid(isValid);
  
    const hasNegative = editedRubricData.criteria.some(criterion =>
      criterion.criterionRatings.some(rating => parseFloat(rating.points) < 0)
    );
    setHasNegativePoints(hasNegative);
  };

  const handleEdit = (criterionId, field, value) => {
    setEditedRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c =>
        c.criterionId === criterionId ? { ...c, [field]: value } : c
      )
    }));
    validateRubric();
  };

  const addCriterion = () => {
    setEditedRubricData(prevData => ({
      ...prevData,
      criteria: [
        ...prevData.criteria,
        {
          id: Date.now(), // Use a unique identifier
          title: "",
          criterionRatings: [{ description: "", points: "" }]
        }
      ]
    }));
    validateRubric();
  };

  const removeCriterion = (id) => {
    setEditedRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.filter(c => c.criterionId !== id)
    }));
    validateRubric();
  };

  const addRating = (criterionId) => {
    setEditedRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c =>
        c.criterionId === criterionId
          ? {
            ...c,
            criterionRatings: [
              ...c.criterionRatings,
              { description: "", points: "" }
            ]
          }
          : c
      )
    }));
    validateRubric();
  };

  const removeRating = (criterionId, ratingIndex) => {
    setEditedRubricData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c =>
        c.criterionId === criterionId
          ? {
            ...c,
            criterionRatings: c.criterionRatings.filter((_, index) => index !== ratingIndex)
          }
          : c
      )
    }));
    validateRubric();
  };

  const handleUpdateRubric = async () => {
    try {
        const updatedRubricData = {
            rubricId: editedRubricData.rubricId,
            updateData: {
                title: editedRubricData.title,
                description: editedRubricData.description,
                totalMarks: parseInt(editedRubricData.totalMarks, 10),
                criteria: editedRubricData.criteria.map(criterion => ({
                    title: criterion.title,
                    minMark: parseInt(criterion.minMark, 10) || 0,
                    maxMark: parseInt(criterion.maxMark, 10) || 0,
                    criterionRatings: criterion.criterionRatings.map(rating => ({
                        description: rating.description || '',
                        points: parseInt(rating.points, 10)
                    }))
                }))
            }
        };

        const updatedRubric = await updateRubricsForAssignment(updatedRubricData.rubricId, updatedRubricData.updateData);
        onRubricUpdated(updatedRubric);
        onClose();
        toast({
            title: "Success",
            description: "Rubric updated successfully",
            variant: "default",
        });
    } catch (error) {
        console.error('Error updating rubric:', error);
        toast({
            title: "Error",
            description: "Failed to update rubric",
            variant: "destructive",
        });
    }
};

  if (!editedRubricData) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Rubric</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 max-h-[85vh] z-[70] overflow-y-auto">
          <div className='mb-4'>
            <Input
              placeholder="Rubric Title"
              value={editedRubricData.title}
              onChange={(e) => setEditedRubricData(prev => ({ ...prev, title: e.target.value }))}
              className="mb-2"
            />
            <Input
              placeholder="Rubric Description"
              value={editedRubricData.description}
              onChange={(e) => setEditedRubricData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="p-4 bg-gray-100 rounded-t-md">
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
              {editedRubricData.criteria.map((criterion) => (
                <TableRow key={criterion.criterionId} className="border-b">
                  <TableCell className="font-medium border-r p-0">
                    <div className="flex items-center justify-between p-2">
                      {editing === `${criterion.criterionId}-criteria` ? (
                        <Input
                          value={criterion.title}
                          onChange={(e) => handleEdit(criterion.criterionId, 'title', e.target.value)}
                          onBlur={() => setEditing(null)}
                          autoFocus
                          placeholder="Enter criteria"
                        />
                      ) : (
                        <>
                          <span>{criterion.title || "Enter criteria"}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditing(`${criterion.criterionId}-criteria`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="border-r p-0">
                    <div className="flex">
                      {criterion.criterionRatings.map((rating, index) => (
                        <div key={index} className="flex-1 border-r last:border-r-0 relative px-6">
                          <div className="flex flex-col py-2">
                            <div className="flex items-center justify-between mb-2">
                              {editing === `${criterion.criterionId}-rating-points-${index}` ? (
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-12 text-sm"
                                  value={rating.points}
                                  onChange={(e) => {
                                    const newRatings = [...criterion.criterionRatings];
                                    newRatings[index].points = e.target.value;
                                    handleEdit(criterion.criterionId, 'criterionRatings', newRatings);
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
                                    onClick={() => setEditing(`${criterion.criterionId}-rating-points-${index}`)}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {editing === `${criterion.criterionId}-rating-${index}` ? (
                              <Input
                                className="w-full text-sm"
                                value={rating.description}
                                onChange={(e) => {
                                  const newRatings = [...criterion.criterionRatings];
                                  newRatings[index].description = e.target.value;
                                  handleEdit(criterion.criterionId, 'criterionRatings', newRatings);
                                }}
                                onBlur={() => setEditing(null)}
                                autoFocus
                                placeholder="Enter description"
                              />
                            ) : (
                              <div className="flex items-center">
                                <span className="text-sm mr-1 max-w-[150px] break-words">{rating.description || "Enter description"}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 flex-shrink-0"
                                  onClick={() => setEditing(`${criterion.criterionId}-rating-${index}`)}
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
                              onClick={() => removeRating(criterion.criterionId, index)}
                            >
                              <Minus className="h-3 w-3 text-destructive" />
                            </Button>
                          )}
                          {index === criterion.criterionRatings.length - 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-6 w-6 rounded-full bg-green-100 border border-success border-dashed"
                              onClick={() => addRating(criterion.criterionId)}
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
                      {Math.max(...criterion.criterionRatings.map(rating => parseFloat(rating.points) || 0), 0)}
                    </span>
                  </TableCell>
                  <TableCell className="p-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full w-full bg-red-100 p-2"
                      onClick={() => removeCriterion(criterion.criterionId)}
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
          
          <Button onClick={handleUpdateRubric} disabled={!isValid || hasNegativePoints} className="mt-4">Update Rubric</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditRubric;