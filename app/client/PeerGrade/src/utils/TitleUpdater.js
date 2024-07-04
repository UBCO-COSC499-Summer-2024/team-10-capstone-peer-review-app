// TitleUpdater.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// TODO -> Add wildcards for paramaterized routes
const routeTitles = {
	"/": "Welcome!",
	"/dashboard": "Dashboard",
	"/class/:classId": "Class Details",
	"/class/createAssignment": "Create Assignment",
	"/manageClass": "Manage Class",
	"/search": "Search",
	"/assignment/:assignmentId": "Assignment Details",
	"/assignedPR/:assignmentId": "Assigned Peer Reviews",
	"/peer-review": "Peer Review",
	"/settings": "Settings",
	"/admin": "Admin Dashboard",
	"/test-user": "Test User Context"
};

function TitleUpdater() {
	const location = useLocation();

	useEffect(() => {
		const title = `PeerGrade | ${routeTitles[location.pathname]}`;
		document.title = title;
	}, [location]);

	return null;
}

export default TitleUpdater;
