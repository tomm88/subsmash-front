import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const raidTestRouteHandler = async (payload, streamerDatabaseId) => {
    try {
        const response = await axios.post(`${apiUrl}/test/handleRaid`, { payload, streamerDatabaseId });
        return response;
    } catch (error) {
        console.error('Error with raid test: ', error);
    }

};

export default raidTestRouteHandler;