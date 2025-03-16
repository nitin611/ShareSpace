import axios from 'axios';
import { toast } from 'react-hot-toast';

// Set default base URL
axios.defaults.baseURL = 'http://localhost:8080';

// Add response interceptor
axios.interceptors.response.use(
  (response) => {
    // Show point notifications
    if (response.data?.pointsAdded && response.data.pointsAdded > 0) {
      toast.success(`+${response.data.pointsAdded} points! ${response.data.pointMessage || ''}`);
    } else if (response.data?.pointsDeducted && response.data.pointsDeducted > 0) {
      toast.error(`-${response.data.pointsDeducted} points! ${response.data.pointMessage || ''}`);
    }
    return response;
  },
  (error) => {
    // Handle point deduction in error responses
    if (error.response?.data?.pointsDeducted) {
      toast.error(`-${error.response.data.pointsDeducted} points! ${error.response.data.msg || ''}`);
    }
    return Promise.reject(error);
  }
);
