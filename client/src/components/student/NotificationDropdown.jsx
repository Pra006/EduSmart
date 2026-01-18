import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.get("http://localhost:3000/api/notifications");
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  const handleClick = async (notif) => {
    // mark as read
    await axios.put(
      `http://localhost:3000/api/notifications/${notif._id}`
    );

    setNotifications(prev =>
      prev.map(n =>
        n._id === notif._id ? { ...n, isRead: true } : n
      )
    );

    onClose(); // close dropdown

    // navigate to course detail
    if (notif.courseId) {
      navigate(`/course/${notif.courseId}`);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-50">
      <div className="p-3 border-b font-semibold">
        Notifications
      </div>

      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500 text-sm">
          No notifications
        </p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif._id}
            onClick={() => handleClick(notif)}
            className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
              !notif.isRead ? "bg-gray-50" : ""
            }`}
          >
            <p className="font-medium">{notif.title}</p>
            <p className="text-sm text-gray-600">
              {notif.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;
