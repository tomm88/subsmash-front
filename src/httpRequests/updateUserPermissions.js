import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const updateUserPermissions = async (twitchUsername, isApproved, isAdmin) => {
    try {   
        const response = await axios.put(`${apiUrl}/db/updateUserPermissions`, {twitchUsername, isApproved, isAdmin})
        return response;
    } catch (error) {
        console.error('Error updating user permissions', error);
        return;
    }
}