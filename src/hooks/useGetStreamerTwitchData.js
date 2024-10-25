import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetStreamerTwitchData = () => {
    const [streamerProfilePic, setStreamerProfilePic] = useState('');
    const [streamerTwitchUsername, setStreamerTwitchUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const getStreamerData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/twitch/getStreamerData`, { withCredentials: true });
                setStreamerProfilePic(response.data.profilePicUrl);
                setStreamerTwitchUsername(response.data.streamerTwitchUsername);
                setIsAdmin(response.data.isAdmin);
            } catch (error) {
                console.error('Error getting streamer data', error)
            }
        }
        getStreamerData();
    }, [apiUrl]);

    return { streamerProfilePic, streamerTwitchUsername, isAdmin };
}