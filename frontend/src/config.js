// API URL configuration
const isDevelopment = import.meta.env.DEV;
const productionApiUrl = 'https://capstone-backend.onrender.com';
const developmentApiUrl = 'http://localhost:5001';

export const API_URL = import.meta.env.VITE_API_URL || 
  (isDevelopment ? developmentApiUrl : productionApiUrl);
