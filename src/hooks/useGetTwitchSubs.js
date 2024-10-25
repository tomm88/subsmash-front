import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export const useGetTwitchSubs = () => {
    const [allSubscribers, setAllSubscribers] = useState([]);
    const [activeSubscribers, setActiveSubscribers] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const getSubscribers = useCallback(async () => {
        setPageLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/twitch/getSubs`, { withCredentials: true })
            setAllSubscribers(response.data);
            setActiveSubscribers(response.data.filter(sub => sub.active))     
            setPageLoading(false)       
        } catch(error) {
            console.error("Error fetching subscribers", error);
            setPageLoading(false)
        }
    }, [apiUrl])

    useEffect(() => {
        getSubscribers()
    }, [getSubscribers]);

    return { allSubscribers, activeSubscribers, setActiveSubscribers, getSubscribers, pageLoading };
};