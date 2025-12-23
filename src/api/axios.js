import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_URL || 'http://localhost:2000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
