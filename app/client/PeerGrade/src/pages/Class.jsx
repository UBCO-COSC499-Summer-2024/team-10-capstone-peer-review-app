import { useState } from 'react';
import {useSelector} from 'react-redux'
import { useParams, Link } from 'react-router-dom';
import { iClass as classesData, assignment as assignmentsData, Categories as categoriesData, user } from '@/utils/dbData';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Grades from './classNav/Grades';
import Groups from './classNav/Groups';
import Files from './classNav/Files';
import People from './classNav/People';
import AssignmentCreation from './classNav/AssignmentCreation';
import { Button } from '@/components/ui/button';

const Class = () => {
  const { classId } = useParams();
  const classItem = classesData.find((item) => item.class_id === parseInt(classId));
  const [currentView, setCurrentView] = useState('home');
  const currentUser = useSelector((state) => state.user.currentUser); //REDUX: user state, after user state stored in login, it has that user logged info saved

	if (!classItem) {
		return <div>Class not found</div>;
	}

  const classAssignments = assignmentsData.filter(assignment => assignment.class_id === classItem.class_id);
  const categories = categoriesData.filter(category => classAssignments.some(assignment => assignment.assignment_id === category.rubric_id));

  const renderContent = () => {
    switch (currentView) {
      case 'grades':
        return <Grades classAssignments={classAssignments} />;
      case 'people':
        return <People />;
      case 'groups':
        return <Groups />;
      case 'files':
        return <Files />;
      case 'assignmentCreation':
        return <AssignmentCreation />;
      default:
        return (
          <>
            <Card className="bg-white p-4 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-2">Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-100 p-4 rounded">No recent announcements</CardContent>
            </Card>
            {categories.map((category, index) => (
              <Card key={index} className="bg-white p-4 shadow-md mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold mb-2">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {classAssignments
                    .filter(assignment => assignment.assignment_id === category.rubric_id)
                    .map((assignment) => (
                      <Link
                        key={assignment.assignment_id}
                        to={`/assignment/${assignment.assignment_id}`}
                        className="flex items-center space-x-2 bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        <span>{assignment.title}</span>
                      </Link>
                    ))}
                </CardContent>
              </Card>
            ))}
          </>
        );
    }
  };

  return (
    <div className="w-screen main-container mx-5 p-6">
      <div className="flex flex-col gap-4 bg-gray-200 p-4 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold">{classItem.classname}: {user.find(instructor => instructor.user_id === classItem.instructor_id)?.firstname + ' ' + user.find(instructor => instructor.user_id === classItem.instructor_id)?.lastname}</h1>
        <div className="flex rounded-lg">
          <div className="flex justify-between items-center">
            <Menubar className='bg-gray-200'>
              <MenubarMenu>
                <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300" onClick={() => setCurrentView('home')}>HOME</MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300" onClick={() => setCurrentView('grades')}>GRADES</MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300" onClick={() => setCurrentView('people')}>PEOPLE</MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300" onClick={() => setCurrentView('groups')}>GROUPS</MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300" onClick={() => setCurrentView('files')}>FILES</MenubarTrigger>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderContent()}
        </div>
        <div className="space-y-6">
          {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && currentView!='assignmentCreation' &&
            <Button variant="outline" onClick={() => setCurrentView('assignmentCreation')} className="w-full bg-white">
              Create Assignment
            </Button>
          }
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <span className="block text-4xl font-bold">98%</span>
              <span className="text-gray-500">Class Grade</span>
            </CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <span className="block text-4xl font-bold">98%</span>
              <span className="text-gray-500">Avg Peer Grade</span>
            </CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-2">To Do</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-100 p-4 rounded">No tasks due</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Class;
