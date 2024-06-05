import { toast } from "react-toastify";
import addNotification from "react-push-notification";
import { useNavigate } from "react-router-dom";

export const toastNotification = ({ title, description, status }) => {
  toast(`Toast Notification: ${title} - ${description} - ${status}`);
};


