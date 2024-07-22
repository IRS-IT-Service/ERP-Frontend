import Swal from "sweetalert2";
import "../../src/App.css";
import {
  useGetAllTasksManagementQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../features/api/taskManagementApiSilce";



export const toastNotification = ({ title, description, status }) => {
  const Tone =
    "https://ik.imagekit.io/z7h0zeety/Admin-Portal/hello/chatRingtone.mp3?updatedAt=1717744741084";
  // toast(`Toast Notification: ${title} - ${description} - ${status}`);

  Swal.fire({
    title: `${title}`,
    text: `${description}`,
    html: `<div id="default"><h3 >${description}</h3>
    <img src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/hello/call.gif?updatedAt=1717741713230" ></div>`,
    confirmButtonColor: "green",
    didOpen: () => {
      const audio = new Audio(Tone);
      audio.play();
    },
  });
};

