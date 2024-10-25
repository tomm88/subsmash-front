import axios from 'axios';

export const uploadSounds = async (formData) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const sounds = await axios.post(`${apiUrl}/aws/uploadSounds`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        })
        return {
            message: 'Files uploaded successfully',
            data: sounds
        }

    } catch (error) {
        console.error('Error uploading files', error);
        return 'Error uploading files, please refresh the page and try again'
    }
}