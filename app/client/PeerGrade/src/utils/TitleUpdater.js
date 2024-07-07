// TitleUpdater.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// TODO -> Add wildcards for paramaterized routes
const routeTitles = {
	"/": "Welcome!",
	"/dashboard": "Dashboard",
	"/class/*": "Class Details",
	"/class/createAssignment": "Create Assignment",
	"/manageClass": "Manage Class",
	"/search": "Search",
	"/assignment/*": "Assignment Details",
	"/assignedPR/*": "Assigned Peer Reviews",
	"/peer-review": "Peer Review",
	"/settings": "Settings",
	"/admin": "Admin Dashboard",
	"/test-user": "Test User Context"
};

function TitleUpdater() {
	const location = useLocation();

	useEffect(() => {
		const pathname = location.pathname;
		const titleKey =
			Object.keys(routeTitles).find((key) => {
				if (key.includes("*")) {
					// Handle wildcard routes
					const baseRoute = key.split("*")[0];
					return pathname.startsWith(baseRoute);
				}
				return key === pathname;
			}) || pathname;

		const title = `PeerGrade | ${routeTitles[titleKey]}`;
		document.title = title;
	}, [location]);

	return null;
}

export default TitleUpdater;
