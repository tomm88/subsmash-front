import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${apiUrl}/db/getAllUsers`);
        return response.data.streamers;
    } catch (error) {
        console.error('Error getting all users', error)
        return;
    }
}
