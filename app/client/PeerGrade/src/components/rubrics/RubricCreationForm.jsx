import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Pencil, Trash2, RefreshCw  } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const RubricCreationForm = ({ onRubricChange, assignments }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rubricData, setRubricData] = useState({
    title: "",
    description: "",
    selectedAssignments: [],
    criteria: [{
      id: 1,
      criteria: "",
      ratings: [{ text: "", points: "" }]
    }]
  });
  const [isValid, setIsValid] = useState(false);
  const [hasNegativePoints, setHasNegativePoints] = useState(false);
  const [editing, setEditing] = useState(null);

  const initialRubricData = {
    title: "",
    description: "",
    selectedAssignments: [],
    criteria: [{
      id: 1,
      criteria: "",
      ratings: [{ text: "", points: "" }]
    }]
  };

  const clearForm = () => {
    setRubricData(initialRubricData);
    setEditing(null);
    setIsValid(false);
    setHasNegativePoints(false);
    onRubricChange(initialRubricData);
  };

  
  useEffect(() => {
    validateRubric();
  }, [rubricData]);
  

  const handleChange = (field, value) => {
    setRubricData(prev => {
      const newData = { ...prev, [field]: value };
      onRubricChange(newData);
      return newData;
    });
  };

  const addCriterion = () => {
    setRubricData(prev => {
      const newData = {
        ...prev,
        criteria: [
          ...prev.criteria,
          {
            id: prev.criteria.length + 1,
            criteria: "",
            ratings: [{ text: "", points: "" }]
          }
        ]
      };
      onRubricChange(newData);
      return newData;
    });
  };

  const removeCriterion = (id) => {
    setRubricData(prev => {
      const newData = {
        ...prev,
        criteria: prev.criteria.filter(c => c.id !== id)
      };
      onRubricChange(newData);
      return newData;
    });
  };

  const addRating = (criterionId) => {
    setRubricData(prev => {
      const newData = {
        ...prev,
        criteria: prev.criteria.map(c =>
          c.id === criterionId
            ? { ...c, ratings: [...c.ratings, { text: "", points: "" }] }
            : c
        )
      };
      onRubricChange(newData);
      return newData;
    });
  };

  const removeRating = (criterionId, ratingIndex) => {
    setRubricData(prev => {
      const newData = {
        ...prev,
        criteria: prev.criteria.map(c =>
          c.id === criterionId
            ? { ...c, ratings: c.ratings.filter((_, i) => i !== ratingIndex) }
            : c
        )
      };
      onRubricChange(newData);
      return newData;
    });
  };

  const handleEdit = (criterionId, field, value, ratingIndex = null) => {
    setRubricData(prev => {
      const newData = {
        ...prev,
        criteria: prev.criteria.map(c =>
          c.id === criterionId
            ? ratingIndex !== null
              ? {
                  ...c,
                  ratings: c.ratings.map((r, i) =>
                    i === ratingIndex ? { ...r, [field]: value } : r
                  )
                }
              : { ...c, [field]: value }
            : c
        )
      };
      onRubricChange(newData);
      return newData;
    });
  };

 
  const validateRubric = () => {
    const isValid = rubricData.title.trim() !== "" &&
      rubricData.criteria.length > 0 &&
      rubricData.criteria.every(criterion =>
        criterion.criteria.trim() !== "" &&
        criterion.ratings.length > 0 &&
        criterion.ratings.every(rating =>
          rating.text.trim() !== "" && !isNaN(parseFloat(rating.points)) && parseFloat(rating.points) >= 0
        )
      );
    
    console.log("Validation result:", isValid);
    console.log("Rubric data:", rubricData);
    
    setIsValid(isValid);
  
    const hasNegative = rubricData.criteria.some(criterion =>
      criterion.ratings.some(rating => parseFloat(rating.points) < 0)
    );
    setHasNegativePoints(hasNegative);
    
    console.log("Has negative points:", hasNegative);
  };

  const handleSaveRubric = () => {
    onRubricChange(rubricData);
    setIsOpen(false);
  };

  const getTriggerText = () => {
    if (rubricData.title) {
      const words = rubricData.title.split(' ');
      return words.length > 1 ? `${words[0]}...` : rubricData.title;
    }
    return "Create New Rubric";
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>{getTriggerText()}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Create a Rubric</DrawerTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearForm}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Form
          </Button>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <Input
            placeholder="Rubric Title"
            value={rubricData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <Input
            placeholder="Rubric Description"
            value={rubricData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <div className="p-4 bg-gray-100 rounded-md">
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
              <li><Badge variant="outline" className="bg-warning">Important</Badge> You must fill out all the fields in order to submit the rubric!</li>
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
              {rubricData.criteria.map((criterion) => (
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
                                  onChange={(e) => handleEdit(criterion.id, 'points', e.target.value, index)}
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
                                onChange={(e) => handleEdit(criterion.id, 'text', e.target.value, index)}
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
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-red-100 border border-destructive border-dashed"
                              onClick={() => removeRating(criterion.id, index)}
                            >
                              <Minus className="h-3 w-3 text-destructive" />
                            </Button>
                          )}
                          {index === criterion.ratings.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-6 w-6 rounded-full bg-green-100 border border-success border-dashed"
                              onClick={() => addRating(criterion.id)}
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
                      {criterion.ratings.reduce((sum, rating) => sum + (parseFloat(rating.points) || 0), 0)}
                    </span>
                  </TableCell>
                  <TableCell className="p-0">
                    <Button
                      type="button"
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
                    type="button"
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
          <Button onClick={handleSaveRubric} disabled={!isValid || hasNegativePoints}>Save Rubric</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RubricCreationForm;