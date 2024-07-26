import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { updateRubricsForAssignment } from '@/api/rubricApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Minus } from 'lucide-react';

const EditRubric = ({ rubricData, isOpen, onOpenChange, onRubricUpdated }) => {
  const [rubric, setRubric] = useState(rubricData);
  const [isValid, setIsValid] = useState(false);
  const [editing, setEditing] = useState(null);

  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setRubric(rubricData);
  }, [rubricData]);

  useEffect(() => {
    validateRubric();
  }, [rubric]);

  const handleUpdateRubric = async () => {
    try {
      const formattedRubricData = {
        title: rubric.title,
        description: rubric.description,
        totalMarks: rubric.criteria.reduce((total, criterion) =>
          total + criterion.ratings.reduce((sum, rating) => sum + (parseFloat(rating.points) || 0), 0),
        0),
        criterion: rubric.criteria.map(criterion => ({
          title: criterion.criteria,
          minPoints: 0,
          maxPoints: criterion.ratings.reduce((sum, rating) => sum + (parseFloat(rating.points) || 0), 0),
          criterionRatings: criterion.ratings.map(rating => ({
            text: rating.text,
            points: parseFloat(rating.points) || 0
          }))
        }))
      };

      await updateRubricsForAssignment(rubric.rubricId, formattedRubricData);
      onRubricUpdated();
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Rubric updated successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating rubric:', error);
      toast({
        title: "Error",
        description: "Failed to update rubric",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (id, field, value) => {
    setRubric(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const addCriterion = () => {
    setRubric(prevData => ({
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
    setRubric(prevData => ({
      ...prevData,
      criteria: prevData.criteria.filter(c => c.id !== id)
    }));
  };

  const validateRubric = () => {
    const isValid = rubric.title.trim() !== "" &&
      rubric.criteria.length > 0 &&
      rubric.criteria.every(criterion =>
        criterion.criteria.trim() !== "" &&
        criterion.ratings.length > 0 &&
        criterion.ratings.every(rating =>
          rating.text.trim() !== "" && !isNaN(parseFloat(rating.points)) && parseFloat(rating.points) >= 0
        )
      );
    setIsValid(isValid);
  };

  const addRating = (criterionId, index) => {
    setRubric(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c =>
        c.id === criterionId
          ? { ...c, ratings: [
              ...c.ratings.slice(0, index + 1),
              { text: "", points: "" },
              ...c.ratings.slice(index + 1)
            ] }
          : c
      )
    }));
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Rubric</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 max-h-[85vh] z-[70] overflow-y-auto">
          <div className='mb-4'>
            <Input
              placeholder="Rubric Title"
              value={rubric.title}
              onChange={(e) => setRubric(prev => ({ ...prev, title: e.target.value }))}
              className="mb-2"
            />
            <Input
              placeholder="Rubric Description"
              value={rubric.description}
              onChange={(e) => setRubric(prev => ({ ...prev, description: e.target.value }))}
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
              <li><Badge variant="outline" className="bg-warning text-white">Important</Badge> You must fill out all the fields in order to submit the rubric! </li>
              <li>Points are automatically calculated based on rating points</li>
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
              {rubric.criteria?.map((criterion) => (
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
                              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-red-100 border border-destructive border-dashed" // Made button smaller
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
                              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-6 w-6 rounded-full  bg-green-100 border border-success border-dashed" // Made button smaller
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
          <Button onClick={handleUpdateRubric} disabled={!isValid} className="mt-4">Update Rubric</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditRubric;
