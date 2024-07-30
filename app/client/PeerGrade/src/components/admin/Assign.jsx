import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getAllAssignments } from '@/api/assignmentApi';

const assignmentColumns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'dueDate', header: 'Due Date' },
  { accessorKey: 'maxSubmissions', header: 'Max Submissions' },
];

const Assign = () => {
  const { user, userLoading } = useUser();
  const { classes, isClassLoading } = useClass();
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [fadeState, setFadeState] = useState('opacity-100');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPreviousDisabled, setIsPreviousDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      const allAssignments = await getAllAssignments();
      if (allAssignments.status === "Success") {
        setAssignmentsData(allAssignments.data);
      }
    };

    fetchAssignments();
  }, [user, userLoading, classes, isClassLoading]);

  useEffect(() => {
    if (classes && classes.length) {
      setSelectedClass(classes[0].classname);
    }
  }, [classes]);

  const updateNavigationButtons = (index) => {
    setIsPreviousDisabled(index === 0);
    setIsNextDisabled(index === classes.length - 1);
  };

  const handleCarouselChange = (index) => {
    setCarouselIndex(index);
    updateNavigationButtons(index);
    const newClass = classes[index].classname;
    if (newClass !== selectedClass) {
      setFadeState('opacity-0');
      setTimeout(() => {
        setSelectedClass(newClass);
        setFadeState('opacity-100');
      }, 300); // duration of the fade-out transition
    }
  };

  const handlePrevious = () => {
    const newIndex = (carouselIndex - 1 + classes.length) % classes.length;
    handleCarouselChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = (carouselIndex + 1) % classes.length;
    handleCarouselChange(newIndex);
  };

  useEffect(() => {
    const currentClassIndex = classes.findIndex((classItem) => classItem.classname === selectedClass);
    if (currentClassIndex !== -1 && currentClassIndex !== carouselIndex) {
      setCarouselIndex(currentClassIndex);
      updateNavigationButtons(currentClassIndex);
    }
  }, [selectedClass]);

  return (
    <div className="flex flex-col justify-center space-y-8" data-testid='assignments-tab'>
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {classes && classes.length !== 0 &&
          <Tabs value={selectedClass} onValueChange={(value) => {
            const newIndex = classes.findIndex(classItem => classItem.classname === value);
            setCarouselIndex(newIndex);
            updateNavigationButtons(newIndex);
            setSelectedClass(value);
          }}>
            <TabsList className="w-auto flex mb-5 whitespace-nowrap ml-11">
              <Carousel className='max-w-lg'>
                <CarouselContent style={{ transform: `translateX(-${carouselIndex * 100}%)`, transition: 'transform 0.3s ease-in-out' }}>
                  {classes.map((classItem, index) => (
                    <CarouselItem key={classItem.classname} className="basis-auto">
                      <TabsTrigger value={classItem.classname} className='w-full'>
                        {classItem.classname}
                      </TabsTrigger>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious onClick={handlePrevious} disabled={isPreviousDisabled} />
                <CarouselNext onClick={handleNext} disabled={isNextDisabled} />
              </Carousel>
            </TabsList>

            {classes.map((classItem) => (
              <TabsContent key={classItem.classname} value={classItem.classname}>
                <div className={`pt-6 bg-white rounded-lg transition-opacity duration-300 ${fadeState}`}>
                  <DataTable
                    title="Assignments"
                    data={assignmentsData.filter(assignment => assignment.classId === classItem.classId)}
                    columns={assignmentColumns}
                    pageSize={5}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        }
      </div>
    </div>
  );
};

export default Assign;
