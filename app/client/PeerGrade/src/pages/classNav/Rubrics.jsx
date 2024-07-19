import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { getAllRubrics, getRubricById, addRubricToAssignment } from '@/api/rubricApi';
import { getAllAssignmentsByClassId } from '@/api/assignmentApi';
import RubricDataTable from '@/components/class/RubricDataTable';
import { useParams } from 'react-router-dom';
import MultiSelect from '@/components/ui/MultiSelect';
import { useUser } from "@/contexts/contextHooks/useUser";

const Rubrics = () => {
  const { classId } = useParams();
  const { user, userLoading } = useUser();
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [newRubricData, setNewRubricData] = useState({
    title: "",
    criteria: [{ criteria: "", ratings: [{ text: "", points: "" }], minPoints: "", maxPoints: "" }]
  });
  const [isValid, setIsValid] = useState(false);


  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await getAllRubrics();
        console.log('Rubrics fetched:', response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setRubrics(response.data.data);
        } else {
          setRubrics([]);
        }
      } catch (error) {
        console.error('Error fetching rubrics:', error);
        setRubrics([]);
      }
    };

    fetchRubrics();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getAllAssignmentsByClassId(classId);
        if (response.data && Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments([]);
      }
    };

    fetchAssignments();
  }, [classId]);

  const handleRubricClick = async (rubricId) => {
    try {
      const response = await getRubricById(rubricId);
      console.log('Rubric details fetched:', response.data);
      if (response.data && response.data.data) {
        setSelectedRubric(response.data.data);
      } else {
        setSelectedRubric(null);
      }
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching rubric details:', error);
      setSelectedRubric(null);
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
      const userId = user.userId

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

      // Refresh the rubrics list
      const updatedRubrics = await getAllRubrics();
      setRubrics(updatedRubrics.data.data);
    } catch (error) {
      console.error('Error creating rubric:', error);
      // Show an error message to the user here
    }
  };

  const handleAssignmentSelection = (selectedValues) => {
    console.log('Selected assignments:', selectedValues);
    setSelectedAssignments(selectedValues);
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Rubrics</h1>
      <div className="grid grid-cols-1 gap-4">
        {rubrics.length === 0 ? (
          <div>No rubrics found</div>
        ) : (
          rubrics.map((rubric) => (
            <div key={rubric.rubricId} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{rubric.title}</h2>
              <p>{rubric.description}</p>
              <Button onClick={() => handleRubricClick(rubric.rubricId)} className="mt-2">View Details</Button>
            </div>
          ))
        )}
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedRubric?.title}</DrawerTitle>
            <DrawerDescription>{selectedRubric?.description}</DrawerDescription>
          </DrawerHeader>
          <div className="  max-h-[60vh] overflow-y-auto">
            {selectedRubric && selectedRubric.criteria && selectedRubric.criteria.map((criterion, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">{criterion.title}</h3>
                <p>Min Points: {criterion.minMark}</p>
                <p>Max Points: {criterion.maxMark}</p>
                <div className="mt-2">
                  {criterion.criteronRatings && criterion.criteronRatings.map((rating, ratingIndex) => (
                    <div key={ratingIndex} className="flex items-center justify-between">
                      <p>{rating.description}</p>
                      <p>{rating.points} Points</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Rubrics;
