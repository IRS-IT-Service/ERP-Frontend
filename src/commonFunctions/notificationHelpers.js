import Swal from "sweetalert2";
import "../../src/App.css";

export const toastNotification = ({ title, description, status }) => {
  // toast(`Toast Notification: ${title} - ${description} - ${status}`);

  Swal.fire({
    title: `${title}`,
    text: `${description}`,
    html: `<div id="default"><h3 >${description}</h3>
    <img src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/hello/call.gif?updatedAt=1717741713230" ></div>`,
    confirmButtonColor: "green",
    didOpen: () => {
      const audio = new Audio("https://ik.imagekit.io/z7h0zeety/Admin-Portal/hello/ringtone_call_phone.mp3?updatedAt=1717741773010");
      audio.play();
    },
    didClose: () =>{
      audio.pause();
    }
  });
};
