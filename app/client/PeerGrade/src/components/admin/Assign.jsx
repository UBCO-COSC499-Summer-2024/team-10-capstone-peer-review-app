import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";

import { getAllAssignments } from '@/api/assignmentApi';

const assignmentColumns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'dueDate', header: 'Due Date' },
  { accessorKey: 'maxSubmissions', header: 'Max Submissions' },
];

// const submissionColumns = [
//   { accessorKey: 'submissionId', header: 'Submission ID' },
//   { accessorKey: 'assignmentId', header: 'Assignment ID' },
//   { accessorKey: 'submitter', header: 'Submitter' },
//   { accessorKey: 'createdAt', header: 'Created At' },
//   { accessorKey: 'updatedAt', header: 'Updated At' },
//   { accessorKey: 'submissionFilePath', header: 'Submission File Path' },
//   { accessorKey: 'finalGrade', header: 'Final Grade' },
// ];

const Assign = () => {
  const { user, userLoading } = useUser();
	const { classes, isClassLoading } = useClass();
	const [assignmentsData, setAssignmentsData] = useState([]);
  const [submissionsData, setSubmissionsData] = useState([]);

	useEffect(() => {
		const fetchAssignments = async () => {
			const allAssignments = await getAllAssignments();
			if (allAssignments.status === "Success") {
				setAssignmentsData(allAssignments.data);
				console.log("assignmentsData: ", assignmentsData);
			}
		};

		fetchAssignments();
	}, [user, userLoading, classes, isClassLoading]);

  return (
    <div className="flex flex-col justify-center space-y-8">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {classes && classes.length !== 0 &&
          <Tabs defaultValue={classes[0].classname}>
            <TabsList className="w-auto flex mb-5">
              {classes && classes.map((classItem) => (
                <TabsTrigger value={classItem.classname}>{classItem.classname}</TabsTrigger>
              ))}
            </TabsList>
            {classes && classes.map((classItem) => (
              <div>
                <TabsContent value={classItem.classname}>
                  <div className="pt-6 bg-white rounded-lg">
                    <DataTable title="Assignments" data={assignmentsData.filter(assignment => assignment.classId === classItem.classId)} columns={assignmentColumns} pageSize={5} />
                  </div>
                </TabsContent>
              </div>
            ))}
          </Tabs>
        }
      </div>

      {/* <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <div className="pt-6 bg-white rounded-lg">
          <DataTable title="Submissions" data={submissionsData} columns={submissionColumns} pageSize={5} enableStatus={true} />
        </div>
      </div> */}
    </div>
  );
};

export default Assign;
