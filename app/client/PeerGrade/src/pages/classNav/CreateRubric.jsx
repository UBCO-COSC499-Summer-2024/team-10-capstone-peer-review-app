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
    criteria: [{ criteria: "", ratings: [{ text: "", points: "" }], points: "" }]
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
    try {
      if (selectedAssignments.length === 0) {
        throw new Error("No assignments selected");
      }

      const formattedRubricData = {
        title: newRubricData.title,
        // description: newRubricData.description, // You might want to add a description field as well
        totalMarks: newRubricData.criteria.reduce((total, criterion) => total + parseInt(criterion.maxPoints || 0), 0),
        classId: classId,
        criterion: newRubricData.criteria.map(criterion => ({
          title: criterion.criteria,
          minPoints: parseInt(criterion.minPoints || 0),
          maxPoints: parseInt(criterion.maxPoints || 0),
          criterionRatings: criterion.ratings.map(rating => ({
            text: rating.text,
            points: parseInt(rating.points || 0)
          }))
        }))
      };
      console.log('formattedRubricData:', formattedRubricData);
      console.log(user);
      const userId = user.userId // Replace with actual user ID or fetch from context/state

      // Add rubric to each selected assignment
      const assignmentId = selectedAssignments;
        console.log('Adding rubric to assignment:', assignmentId);
        await addRubricToAssignment({
          userId,
          assignmentId,
          rubricData: formattedRubricData
        });
      

        console.log('Rubric added to selected assignments');
        setIsCreateDrawerOpen(false);
        setNewRubricData({
          title: "",
          criteria: [{ criteria: "", ratings: [{ text: "", points: "" }], minPoints: "", maxPoints: "" }]
        });
        setSelectedAssignments([]);
        
        toast({
          title: "Success",
          description: "Rubric created successfully",
          variant: "success"
        });
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

  return (
    <>
      <Button onClick={() => setIsCreateDrawerOpen(true)} className="w-full mb-4">Add a Rubric</Button>
      <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create a Rubric</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 max-h-[85vh] z-[70] overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Assignments</h3>
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