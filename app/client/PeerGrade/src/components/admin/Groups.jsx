// The main function of this component is to display a table of groups that the admin can view on the admin ui groups tab.
// It takes in a title, data, and columns as props.
// The component also uses the useUser and useClass hooks to fetch user and class data where its needed.

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { getAllGroups } from '@/api/userApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";

const groupsColumns = [
  { accessorKey: 'groupName', header: 'Name' },
  { accessorKey: 'groupDescription', header: 'Description' },
  { accessorKey: 'groupSize', header: 'Size' },
  { accessorKey: 'classname', header: 'Class' },
];

const Groups = () => {
	const { user, userLoading } = useUser();
	const { classes, isClassLoading } = useClass();
	const [groupsData, setGroupsData] = useState([]);

	useEffect(() => {
		const fetchGroups = async () => {
      console.log(classes);
			const groups = await getAllGroups();
			if (groups.status === "Success") {
        // Add classname to each group based on classId
        const updatedGroups = groups.data.map(group => {
          const classItem = classes.find(cls => cls.classId === group.classId);
          return {
            ...group,
            classname: classItem ? classItem.classname : 'Unknown' // Default to 'Unknown' if classItem is not found
          };
        });
				setGroupsData(updatedGroups);
			}
		};

		fetchGroups();
	}, [user, userLoading, classes, isClassLoading]);

  return (
		<div className="w-full space-y-6">
			<h1 className="text-2xl font-bold">Groups</h1>
      
      <div className="pt-6 bg-white rounded-lg">
        <DataTable
          title="Groups"
          data={groupsData}
          columns={groupsColumns}
          pageSize={5}
          enableStatus={true}
        />
      </div>
		</div>
  );
};

export default Groups;
