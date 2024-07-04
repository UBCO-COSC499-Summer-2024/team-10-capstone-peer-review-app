import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RubricDrawer = ({ isOpen, onClose, onSubmit, children }) => {
  const [rubric, setRubric] = useState([{ criteria: "", ratings: [""], points: "" }]);

  const handleCriteriaChange = (index, value) => {
    const newRubric = [...rubric];
    newRubric[index].criteria = value;
    setRubric(newRubric);
  };

  const handleRatingsChange = (index, ratingIndex, value) => {
    const newRubric = [...rubric];
    newRubric[index].ratings[ratingIndex] = value;
    setRubric(newRubric);
  };

  const handlePointsChange = (index, value) => {
    const newRubric = [...rubric];
    newRubric[index].points = value;
    setRubric(newRubric);
  };

  const addRating = (index) => {
    const newRubric = [...rubric];
    newRubric[index].ratings.push("");
    setRubric(newRubric);
  };

  const removeRating = (index, ratingIndex) => {
    const newRubric = [...rubric];
    newRubric[index].ratings = newRubric[index].ratings.filter((_, i) => i !== ratingIndex);
    setRubric(newRubric);
  };

  const addCriteria = () => {
    setRubric([...rubric, { criteria: "", ratings: [""], points: "" }]);
  };

  const removeCriteria = (index) => {
    const newRubric = rubric.filter((_, i) => i !== index);
    setRubric(newRubric);
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader>
            <DrawerTitle>Edit Rubric</DrawerTitle>
            <DrawerDescription>Add or edit rubric criteria and ratings.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4 overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Criteria</TableHead>
                  <TableHead className="w-1/2">Ratings</TableHead>
                  <TableHead className="w-1/4">Points</TableHead>
                  <TableHead className="w-1/12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rubric.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        placeholder="Criteria"
                        value={item.criteria}
                        onChange={(e) => handleCriteriaChange(index, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.ratings.map((rating, ratingIndex) => (
                          <div key={ratingIndex} className="flex items-center space-x-2">
                            <Input
                              placeholder="Rating"
                              value={rating}
                              onChange={(e) => handleRatingsChange(index, ratingIndex, e.target.value)}
                              className="w-1/2"
                            />
                            <Button
                              onClick={() => removeRating(index, ratingIndex)}
                              variant="outline"
                              className="h-8 w-8 p-0 flex items-center justify-center"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button onClick={() => addRating(index)} variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Points"
                        value={item.points}
                        onChange={(e) => handlePointsChange(index, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeCriteria(index)}
                        variant="destructive"
                      >
                        <Trash className="h-4 w-4"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan="4" className="text-center">
                    <Button onClick={addCriteria} variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <DrawerFooter className="flex flex-col justify-center items-center ">
            <Button className="w-1/2  bg-green-100" onClick={() => onSubmit(rubric)} variant="outline">
              Save
            </Button>
              <Button className="w-1/2" onClick={() => onClose(false)} variant="default">Cancel</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RubricDrawer;
