export const showTimeIndonesia = () => {
    // Get current date and time
    const currentTime = new Date();
  
    // Set the time zone to UTC+7 (Indonesia, Western Indonesia Time)
    currentTime.setHours(currentTime.getHours() + 7);
  
    // Format the time as HH:mm:ss
    const formattedTime = currentTime.toLocaleString('en-ID');
  
    return formattedTime;
  }