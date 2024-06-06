import { toast } from "react-toastify";
import addNotification from "react-push-notification";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../src/App.css"

export const toastNotification = ({ title, description, status }) => {
  // toast(`Toast Notification: ${title} - ${description} - ${status}`);
  // Swal.fire({
  //   title: `${title}`,
  //   text: `${description}`,
  //   icon: 'success',
  //   showCancelButton: true,
  //   confirmButtonColor: '#d11e06',
  //   cancelButtonColor: 'black',
  // })

  Swal.fire({
    title: `${title}`,
    text: `${description}`,
    html: `<div id="default"><h3 >${description}</h3>
    <img src="../../public/call.gif" ></div>`,
    confirmButtonColor: "green",
    didOpen: () => {
      // Create and play audio element
      const audio = new Audio("../../public/chatRingtone.mp3");
      audio.play();
    },
  });
};
