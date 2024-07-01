import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassCard from '@/components/class/ClassCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useUser } from "@/contexts/contextHooks/useUser";
import { getClassesByUserId, getAllAssignmentsByClassId, getAllAssignments, createClass, deleteClass } from "@/api/classApi";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { iClass as mockClasses, PeerReview, submission } from '@/utils/dbData'; // Remove when mock data isn't needed

const AddClassModal = ({ show, onClose, onAddClass }) => {
  const [classname, setClassname] = useState('');
  const [description, setDescription] = useState('');
  const [term, setTerm] = useState('');
  const [size, setSize] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClass = {
      classname,
      description,
      startDate: new Date(),                                                    // Hardcoded start date for now
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),  // Hardcoded end date for now
      term,
      classSize: parseInt(size, 10)
    };

    const classCreate = async () => {
      const classData = await createClass(newClass);
      if (classData.status === "Success") {
        console.log("class data after create", classData);
        onAddClass(classData.data);
      } else {
        console.error('An error occurred while creating the class.', classData.message);
      }
    };
    classCreate();

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
              min="1"
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
	const { user, userLoading } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [userClasses, setUserClasses] = useState([]);
  const [classAssignments, setClassAssignments] = useState({});
  const [selectedClass, setSelectedClass] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!userLoading && user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN')) {
			const fetchClasses = async () => {
				const classesData = await getClassesByUserId(user.userId);
        console.log("classes data",classesData);
				if (classesData) {
					setUserClasses(Array.isArray(classesData) ? classesData : []);
				}
			};

			const fetchAssignments = async (classId) => {
				const assignmentsData = await getAllAssignmentsByClassId(classId);
        console.log(assignmentsData.data);
				if (assignmentsData.status === "Success") {
          return assignmentsData.data;
				}
			};

      const fetchAllAssignments = async () => {
        const assignments = {};
        for (const classItem of userClasses) {
          assignments[classItem.classId] = await fetchAssignments(classItem.classId);
        }
        setClassAssignments(assignments);
      };

      fetchClasses().then(fetchAllAssignments);
    }
  }, [user, userLoading]);

  const handleDeleteClass = async () => {
    if (selectedClass) {
      const classData = await deleteClass(selectedClass.classId);
      if (classData.status === "Success") {
        console.log("class data after delete", classData);
        setDialogOpen(false);
        setUserClasses(prevClasses => prevClasses.filter(classItem => classItem.classId !== selectedClass.classId));
      } else {
        console.error('An error occurred while deleting the class.', classData.message);
      }
    }
  };

  const handleDeleteClick = (classItem) => {
    setSelectedClass(classItem);
    setDialogOpen(true);
  };

  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return <div>You do not have permission to view this page.</div>;
  }

  const handleAddClass = (newClass) => {
    setUserClasses(prevClasses => [...prevClasses, newClass]);
  };

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
          <div key={classItem.classId} className="relative">
            <Link to={`/class/${classItem.classId}`}>
              <ClassCard
                classId={classItem.classId}
                className={classItem.classname}
                instructor={`${user.firstname} ${user.lastname}`}
                numStudents={classItem.classSize}
                numAssignments={classAssignments[classItem.classId]?.length || 0}
                numPeerReviews={PeerReview.filter((review) => {
                  const sub = submission.find((sub) => sub.submission_id === review.submission_id);
                  return sub && sub.assignment_id === classItem.classId;
                }).length}
              />
            </Link>
            <button
              onClick={() => handleDeleteClick(classItem)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              data-testid={`delete-class-${classItem.classId}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <h2 className='my-4'>Mocked Classes (debug only)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockClasses.map((classItem) => (
          <div key={classItem.class_id} className="relative">
            <Link to={`/class/${classItem.class_id}`}>
              <ClassCard
                classId={classItem.class_id}
                className={classItem.classname}
              />
            </Link>
          </div>
        ))}
      </div>
      <AddClassModal show={modalOpen} onClose={() => setModalOpen(false)} onAddClass={handleAddClass} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Class</DialogTitle>
            </DialogHeader>
            Are you sure you want to delete the class '{selectedClass.classname}'?
            <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteClass}>Delete</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageClass;
