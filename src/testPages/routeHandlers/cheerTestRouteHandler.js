import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const cheerTestRouteHandler = async (payload, streamerDatabaseId) => {
    try {
        const response = await axios.post(`${apiUrl}/test/handleCheer`, { payload, streamerDatabaseId });
        return response;
    } catch (error) {
        console.error('Error with cheer test: ', error);
    }

};

export default cheerTestRouteHandler;