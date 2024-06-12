import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassCard from '@/components/class/ClassCard';
import { addClass, deleteClass } from '@/lib/redux/slices/classSlice'; // Ensure these actions are implemented
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ManageClass = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const classes = useSelector((state) => state.classes);

  if (!currentUser || (currentUser.type !== 'instructor' && currentUser.type !== 'admin')) {
    return <div>You do not have permission to view this page.</div>;
  }

  const handleAddClass = () => {
    const newClass = {
      class_id: Math.max(...classes.map((cls) => cls.class_id)) + 1,
      instructor_id: currentUser.user_id,
      classname: 'New Class',
      description: 'New class description',
      start: new Date(),
      term: 'New Term',
      end: new Date(),
      size: 0,
    };
    dispatch(addClass(newClass));
  };

  const handleDeleteClass = (classId) => {
    dispatch(deleteClass(classId));
  };

  const userClasses = classes.filter((classItem) => classItem.instructor_id === currentUser.user_id);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Classrooms</h1>
        <Button onClick={handleAddClass} className="flex items-center">
          <Plus className="mr-2" />
          Add a class
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userClasses.map((classItem) => (
          <div key={classItem.class_id} className="relative">
            <Link to={`/class/${classItem.class_id}`}>
              <ClassCard
                classId={classItem.class_id}
                className={classItem.classname}
                instructor={`${currentUser.firstname} ${currentUser.lastname}`}
                numStudents={classItem.size}
                numAssignments={assignmentsData.filter((assignment) => assignment.class_id === classItem.class_id).length}
                numPeerReviews={peerReviewData.filter((review) => {
                  const submission = submissionsData.find((sub) => sub.submission_id === review.submission_id);
                  return submission && submission.assignment_id === classItem.class_id;
                }).length}
              />
            </Link>
            <button
              onClick={() => handleDeleteClass(classItem.class_id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageClass;
