// src/pages/AdminDashboard.jsx
import Overview from "@/components/admin/Overview";
import Users from "@/components/admin/Users";
import Search from "@/components/admin/Search";
import Assignments from "@/components/admin/Assign";
import Interactions from "@/components/admin/Interactions";
import Reports from "@/pages/Reports";
import Notifications from "@/components/admin/NotificationsPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/contexts/contextHooks/useUser";
import PRassign from "@/components/admin/PRassign";

const AdminDashboard = () => {
	const { user, userLoading } = useUser();
	if (!userLoading && (!user || user.role !== "ADMIN")) {
		return <div>You do not have permission to view this page.</div>;
	}

	return (
		<div className="p-6 w-full">
			<Tabs defaultValue="overview">
				<TabsList className="w-auto flex mb-5">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="classes">Classes</TabsTrigger>
					<TabsTrigger value="assignments">Assignments</TabsTrigger>
					<TabsTrigger value="peer-reviews">Peer-reviews</TabsTrigger>
					<TabsTrigger value="interactions">Interactions</TabsTrigger>
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
				<TabsContent value="peer-reviews">
					<PRassign />
				</TabsContent>
				<TabsContent value="interactions">
					<Interactions />
				</TabsContent>
				<TabsContent value="reports">
					<Reports role="ADMIN" />
				</TabsContent>
				<TabsContent value="notifications">
					<Notifications />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AdminDashboard;
