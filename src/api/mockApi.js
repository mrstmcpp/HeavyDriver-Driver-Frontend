import axios from 'axios';


export const updateDriverStatus = async (driverId, status) => {
  console.log(`Axios: Setting driver ${driverId} status to ${status}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    console.log("Mock API Success: Status updated");
    return { success: true };
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};