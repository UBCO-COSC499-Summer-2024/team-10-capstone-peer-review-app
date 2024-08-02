// TitleUpdater.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// TODO -> Add wildcards for paramaterized routes
const routeTitles = {
	"/": "Welcome!",
	"/dashboard": "Dashboard",
	"/admin": "Admin Dashboard",
	"/class/*": "Class Details",
	"/manage-class": "Manage Class",
	"/manage-class/*": "Manage Class Dashboard",
	"/enrollment": "Enrollment",
	"/assignment/*": "Assignment Details",
	"/viewSubmission/*": "Recieved Peer Reviews",
	"/peer-review": "Peer Reviews",
	"/manage-grades-and-reviews": "Manage Grades and Reviews",
	"/report": "Reports",
	"/notifications": "Notifications",
	"/settings": "Settings"
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
