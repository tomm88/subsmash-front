import axios from 'axios';
import { useEffect, useState } from 'react';

export const useGetTwitchSubsSlideshow = (hash) => {
    const [activeSubscribers, setActiveSubscribers] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const getSubs = async() => {
            try {
                const response = await axios.get(`${apiUrl}/twitch/getSubsSlideshow`, { 
                    params: {
                        hash
                    }
                })
                setActiveSubscribers(response.data.filter(sub => sub.active && sub.characterName !== 'No character name'));        
            } catch(error) {
                console.error("Error fetching subscribers", error)
            }
        }

        getSubs();

    }, [apiUrl, hash ])

    return { activeSubscribers, setActiveSubscribers };
}

    