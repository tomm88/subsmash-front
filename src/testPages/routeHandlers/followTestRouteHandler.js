import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const followTestRouteHandler = async (payload, streamerDatabaseId) => {
    try {
        const response = await axios.post(`${apiUrl}/test/handleFollow`, { payload, streamerDatabaseId });
        return response;
    } catch (error) {
        console.error('Error with follow test: ', error);
    }

};

export default followTestRouteHandler;