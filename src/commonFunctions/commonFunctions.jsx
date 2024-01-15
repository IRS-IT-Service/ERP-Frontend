import NotificationSound2 from "../assets/NotificationSound2.mp3";

function formatIndianPrice(value) {
  let valueChecked = +value || 0;
  const formattedValue = valueChecked.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return formattedValue;
}

function formatUSDPrice(value) {
  let valueChecked = +value || 0;
  const formattedValue = valueChecked.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formattedValue;
}
const NotificationSoundPlay = () => {
  const audio = new Audio(NotificationSound2);
  audio.play();
};

const  formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }
  
  const date = new Date(dateString);
  
  const options = { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" };
  const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);

  return formattedDate;
};

const  formateDateAndTime =(originalDate) => {
  const date = new Date(originalDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();

  const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  const formattedDate = `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`;

  return `${formattedTime}, ${formattedDate}`;
}


export { formatIndianPrice, formatUSDPrice, NotificationSoundPlay ,formatDate,formateDateAndTime};
