import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/contextHooks/useUser";
import NotifCard from "@/components/global/NotifCard";
import { deleteNotification, getNotifications } from "@/api/notifsApi";

export default function Notifications() {
  const { user, userLoading } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      if (user && !userLoading) {
        try {
          const notifs = await getNotifications(user.userId);
          setNotifications(Array.isArray(notifs.data) ? notifs.data : []);
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      }
    };

    fetchNotifs();

    const intervalId = setInterval(() => {
      fetchNotifs();
    }, 10000); // Fetch notifications every 30 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [user, userLoading]);

	const handleDeleteNotif = async (notificationId) => {
		const deleteNotif = await deleteNotification(notificationId);
		if (deleteNotif.status === "Success") {
			setNotifications((prevNotifs) =>
				prevNotifs.filter(
					(notification) => notification.notificationId !== notificationId
				)
			);
		} else {
			console.error('An error occurred while deleting the notification.', deleteNotif.message);
		}
	};

  return (
    <div className="w-full px-6">
      <div className="flex flex-col gap-1 mt-5 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <span className="ml-1 text-sm text-gray-500 mb-2">
          Here are all your notifications.
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {notifications.length === 0 && (
          <div className="text-center px-4 pb-4 text-gray-500 text-sm">
            You have no notifications!
          </div>
        )}
        {notifications.map((notification) => (
          <NotifCard
            key={notification.notificationId}
            notificationData={notification}
            deleteNotifCall={handleDeleteNotif}
          />
        ))}
      </div>
    </div>
  );
}
