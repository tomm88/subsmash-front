import { useEffect, useState } from 'react';
import axios from 'axios';

export const useStreamerHashes = () => {
    const [slideshowUrl, setSlideshowUrl] = useState('');
    const [alertsUrl, setAlertsUrl] = useState('');
    const [slideshowHash, set_SlideshowHash] = useState('');
    const homeUrl = process.env.REACT_APP_HOME_URL;
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const getHashes = async () => {
            try {
                const hashes = await axios.get(`${apiUrl}/db/hashes`, { withCredentials: true });
                const { slideshowHash, alertsHash } = hashes.data;
                set_SlideshowHash(slideshowHash)
        
                const slideshowUrl = `${homeUrl}/slideshow/${slideshowHash}`
                setSlideshowUrl(slideshowUrl);
        
                const alertsUrl = `${homeUrl}/alerts/${alertsHash}`
                setAlertsUrl(alertsUrl);
            } catch (error) {
            console.error ('Error getting hashes: ', error)
        }
    }
    getHashes();

    }, [homeUrl, apiUrl])

  return {slideshowUrl, alertsUrl, slideshowHash}
}