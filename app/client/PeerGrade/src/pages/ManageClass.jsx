import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassCard from '@/components/class/ClassCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { iClass, assignment, PeerReview, submission } from '@/lib/dbData'; // Make sure to import these correctly

const AddClassModal = ({ show, onClose, onAddClass }) => {
  const [classname, setClassname] = useState('');
  const [description, setDescription] = useState('');
  const [term, setTerm] = useState('');
  const [size, setSize] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClass({
      classname,
      description,
      term,
      size: parseInt(size, 10),
    });
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Add a New Class</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="classname" className="block text-sm font-medium text-gray-700">
              Class Name
            </label>
            <input
              type="text"
              id="classname"
              value={classname}
              onChange={(e) => setClassname(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="term" className="block text-sm font-medium text-gray-700">
              Term
            </label>
            <input
              type="text"
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <input
              type="number"
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit">Add Class</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageClass = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
    return <div>You do not have permission to view this page.</div>;
  }

  const handleAddClass = (newClass) => {
    const classData = {
      ...newClass,
      class_id: iClass.length + 1,
      instructor_id: currentUser.userId,
      start: new Date(),
      end: new Date(),
    };
    // Add the new class to the database here
    iClass.push(classData);
    setModalOpen(false);
  };

  const handleDeleteClass = (classId) => {
    const classIndex = iClass.findIndex((cls) => cls.class_id === classId);
    if (classIndex > -1) {
      // Remove the class from the database here
      iClass.splice(classIndex, 1);
    }
  };

  const userClasses = iClass.filter((classItem) => classItem.instructor_id === currentUser.userId);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Classrooms</h1>
        <Button onClick={() => setModalOpen(true)} className="flex items-center">
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
                numAssignments={assignment.filter((assign) => assign.class_id === classItem.class_id).length}
                numPeerReviews={PeerReview.filter((review) => {
                  const sub = submission.find((sub) => sub.submission_id === review.submission_id);
                  return sub && sub.assignment_id === classItem.class_id;
                }).length}
              />
            </Link>
            <button
              onClick={() => handleDeleteClass(classItem.class_id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              data-testid={`delete-class-${classItem.class_id}`} // Add data-testid attribute
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <AddClassModal show={modalOpen} onClose={() => setModalOpen(false)} onAddClass={handleAddClass} />
    </div>
  );
};

export default ManageClass;
