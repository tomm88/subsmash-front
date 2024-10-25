import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUploadedFonts = async () => {
    try {
        const response = await axios.get(`${apiUrl}/aws/fonts`, { withCredentials: true });
        return response.data.fonts;
    } catch(error) {
        console.error('Error fetching user fonts', error)
    }
}