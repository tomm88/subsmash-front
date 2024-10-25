import axios from 'axios';

export const checkAuth = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await axios.get(`${apiUrl}/auth/check`, { withCredentials: true });
        return response.data.isAuthenticated;
    } catch (error) {
        console.error('Not authenticated, please log in', error);
        return false;
    }
};
