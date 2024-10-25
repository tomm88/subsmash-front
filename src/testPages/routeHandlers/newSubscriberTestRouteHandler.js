import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const newSubscriberTestRouteHandler = async (payload, streamerDatabaseId) => {
    try {
        const response = await axios.post(`${apiUrl}/test/handleNewSubscriber`, { payload, streamerDatabaseId });
        return response;
    } catch (error) {
        console.error('Error with new subscriber test: ', error);
    }

};

export default newSubscriberTestRouteHandler;