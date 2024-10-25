import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL

const getSessionData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/test/sessionData`, {withCredentials: true});
        return response;
    } catch (error) {
        console.error('Error getting session data: ', error)
    }
};

export default getSessionData;