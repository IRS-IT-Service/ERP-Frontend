import { toast } from "react-toastify";
import addNotification from "react-push-notification";
import { useNavigate } from "react-router-dom";

export const toastNotification = ({ title, description, status }) => {
  // Implement your toast notification logic
  console.log(`Toast Notification: ${title} - ${description} - ${status}`);
  toast(`Toast Notification: ${title} - ${description} - ${status}`);
};

export const sendNativeNotification = ({ title, body }) => {
  // Implement your native notification logic

  addNotification({
    title: title,
    subtitle: data.time,
    message: body,
    duration: 30000,
    icon: irsLogo,
    native: true,
    onClick: () => {
      navigate("/login");
    },
  });
};
