import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const giftSubTestRouteHandler = async (payload, streamerDatabaseId) => {
    try {
        const response = await axios.post(`${apiUrl}/test/handleGiftSub`, { payload, streamerDatabaseId });
        return response;
    } catch (error) {
        console.error('Error with gift sub test: ', error);
    }

};

export default giftSubTestRouteHandler;