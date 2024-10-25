import axios from 'axios';

export const generatePrompt = async () => {
    //NO HASH
    const hash = ''
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        await axios.get(`${apiUrl}/db/generatePrompt`, { 
            params: {
                hash
            }
         })
    } catch(error) {
        console.error('Error generating prompt', error)
    }
}