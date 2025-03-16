import axios from 'axios';
import { toast } from 'react-hot-toast';

// Set default base URL
axios.defaults.baseURL = 'http://localhost:8080';

// Add response interceptor
axios.interceptors.response.use(
  (response) => {
    // Show point notifications
    if (response.data?.pointsAdded && response.data.pointsAdded > 0) {
      toast.success(`${response.data.pointMessage || `Earned ${response.data.pointsAdded} points!`}`, {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#4ade80',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
        },
        icon: '🎉'
      });
    } else if (response.data?.pointsDeducted && response.data.pointsDeducted > 0) {
      toast.error(`Lost ${response.data.pointsDeducted} points. ${response.data.msg || ''}`, {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#ef4444',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
        },
        icon: '⚠️'
      });
    }
    return response;
  },
  (error) => {
    // Handle point deduction in error responses
    if (error.response?.data?.pointsDeducted) {
      toast.error(`Lost ${error.response.data.pointsDeducted} points. ${error.response.data.msg || ''}`, {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#ef4444',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
        },
        icon: '⚠️'
      });
    }
    return Promise.reject(error);
  }
);
