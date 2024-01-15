const Dateformat = (inputDateString) => {
    const currentDate = inputDateString
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = currentDate.getFullYear();
  
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate
  }

  export default Dateformat;