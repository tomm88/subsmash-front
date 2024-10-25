import axios from 'axios' 
const apiUrl = process.env.REACT_APP_API_URL;

export const getActiveSlideshowLayout = async (slideshowHash) => {
    try {
        const slideshowLayout = await axios.get(`${apiUrl}/db/layouts/activeSlideshow/${slideshowHash}`);
        return slideshowLayout.data.slideshowLayout
    } catch (error) {
        console.error('Error getting slideshow layout', error)
    }
};