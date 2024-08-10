// This is the main dashboard for the admin user. The user can view various information about the system.
// It is divided into different tabs for different sections of the system (Users, Classes, Assignments, Groups, Peer reivew, etc.)

import Overview from "@/components/admin/Overview";
import Users from "@/components/admin/Users";
import Search from "@/components/admin/Search";
import Assignments from "@/components/admin/Assign";
import Groups from "@/components/admin/Groups";
import Reports from "@/pages/Reports";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/contexts/contextHooks/useUser";

const AdminDashboard = () => {
	const { user, userLoading } = useUser();
	if (!userLoading && (!user || user.role !== "ADMIN")) {
		return <div>You do not have permission to view this page.</div>;
	}

	return (
		<div className="p-6 pt-0 w-full">
			<Tabs defaultValue="overview">
				<TabsList className="w-auto flex mb-5">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="classes">Classes</TabsTrigger>
					<TabsTrigger value="assignments">Assignments</TabsTrigger>
					<TabsTrigger value="groups">Groups</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<Overview />
				</TabsContent>
				<TabsContent value="users">
					<Users />
				</TabsContent>
				<TabsContent value="classes">
					<Search />
				</TabsContent>
				<TabsContent value="assignments">
					<Assignments />
				</TabsContent>
				<TabsContent value="groups">
					<Groups />
				</TabsContent>
				<TabsContent value="reports">
					<Reports role="ADMIN" />
				</TabsContent>
				<TabsContent value="notifications">
					<NotificationsPanel />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AdminDashboard;
