import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import MultiSelect from '@/components/ui/MultiSelect';
import RubricDataTable from "@/components/class/RubricDataTable";
import { addRubricToAssignment, getAllRubrics } from '@/api/rubricApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";

const CreateRubric = ({ classId, assignments, onRubricCreated }) => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [newRubricData, setNewRubricData] = useState({
    title: "",
    description: "",
    criteria: [{
      criteria: "",
      minPoints: "",
      maxPoints: "",
      ratings: [{ text: "", points: "" }]
    }]
  });
  const [isValid, setIsValid] = useState(false);

  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isCreateDrawerOpen) {
      fetchRubrics();
    }
  }, [isCreateDrawerOpen]);

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
          minPoints: 0, // Set a default minimum, or add a field for this in your form
          maxPoints: parseFloat(criterion.points) || 0,
          criterionRatings: criterion.ratings.map(rating => ({
            text: rating.text,
            points: parseFloat(rating.points) || 0
          }))
        }))
      };
  
      console.log('formattedRubricData:', formattedRubricData);
      const userId = user.userId;
  
      // Add rubric to each selected assignment
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
          criteria: "",
          minPoints: "",
          maxPoints: "",
          ratings: [{ text: "", points: "" }]
        }]
      });
      setSelectedAssignments([]);
    
  };
  // NEED TO CHECK FOR DECIMAL VALUES, NOT SUPPORTED ATM. ALSO NEED TO CHECK FOR BLANK RATINGS TITLES.

  const handleAssignmentSelection = (selectedValues) => {
    console.log('Selected assignments:', selectedValues);
    setSelectedAssignments(selectedValues);
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
            <RubricDataTable rubricData={newRubricData} setRubricData={setNewRubricData} setIsValid={setIsValid} />
            <Button onClick={handleCreateRubric} disabled={!isValid} className="mt-4">Save Rubric</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateRubric;