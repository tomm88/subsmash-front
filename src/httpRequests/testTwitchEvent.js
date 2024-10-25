import axios from 'axios' 
const apiUrl = process.env.REACT_APP_API_URL;

export const testTwitchEvent = async (testData) => {
    try {
        await axios.post(`${apiUrl}/twitch/testEvent`, {testData}, {withCredentials: true});
        return;
    } catch (error) {
        console.error('Error testing Twitch event', error)
        return;
    }
}