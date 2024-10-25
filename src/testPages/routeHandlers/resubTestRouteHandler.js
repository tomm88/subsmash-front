import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const resubTestRouteHandler = async (payload, streamerDatabaseId) => {
    try {
        const response = await axios.post(`${apiUrl}/test/handleResub`, { payload, streamerDatabaseId });
        return response;
    } catch (error) {
        console.error('Error with resub test: ', error);
    }

};

export default resubTestRouteHandler;