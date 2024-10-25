import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const generateSampleImage = async (prompt) => {
    try {
        const sampleImage = await axios.post(`${apiUrl}/openai/generateSampleImage`, { prompt }, { withCredentials: true });
        let imageData = sampleImage.data.image
        if (imageData.code === 'content_policy_violation'){
            imageData = {
                imageUrl: `${apiUrl}/unsafePrompt___123.png`,
                characterName: ''
            }
        }
        return imageData
    } catch (error) {
        console.error ("Failed to generate sample image", error)
    }

}