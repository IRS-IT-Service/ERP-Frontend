import Swal from "sweetalert2";
import "../../src/App.css";

export const toastNotification = ({ title, description, status }) => {
  // toast(`Toast Notification: ${title} - ${description} - ${status}`);

  Swal.fire({
    title: `${title}`,
    text: `${description}`,
    html: `<div id="default"><h3 >${description}</h3>
    <img src="../../public/call.gif" ></div>`,
    confirmButtonColor: "green",
    didOpen: () => {
      const audio = new Audio("../../public/chatRingtone.mp3");
      audio.play();
    },
  });
};
