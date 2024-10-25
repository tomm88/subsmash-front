import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL;

export const getSubsFromDatbase = async () => {
    try {
        const response = await axios.get(`${apiUrl}/db/getSubsFromDatabase`, { withCredentials: true });
        return response.data.subs
    } catch(error) {
        console.error('Error getting subs from database', error)
    }
}